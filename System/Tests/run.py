#!/usr/bin/env python3
"""Run unit tests and/or the live Obsidian workflow suite. No third-party packages."""
import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parents[2]
RESULT = ROOT / 'System/Tests/Results/latest.json'


def find_cli(explicit):
    candidates = [explicit, os.environ.get('OBSIDIAN_CLI'), shutil.which('obsidian'), shutil.which('Obsidian')]
    local = os.environ.get('LOCALAPPDATA')
    if local:
        candidates.append(str(Path(local) / 'Programs/Obsidian/Obsidian.exe'))
    if Path('/mnt/c/Users').exists():
        candidates.extend(str(p) for p in Path('/mnt/c/Users').glob('*/AppData/Local/Programs/Obsidian/Obsidian.exe'))
    candidates.append('/Applications/Obsidian.app/Contents/MacOS/Obsidian')
    for candidate in candidates:
        if candidate and Path(candidate).is_file():
            return candidate
    raise RuntimeError('Obsidian CLI not found. Pass --cli PATH or set OBSIDIAN_CLI. Enable CLI in Obsidian settings.')


def cli_eval(cli, code):
    completed = subprocess.run([cli, f'vault={ROOT.name}', 'eval', 'code=' + code], cwd=ROOT, capture_output=True, text=True, timeout=20)
    if completed.returncode:
        raise RuntimeError(completed.stdout + completed.stderr)
    for line in reversed(completed.stdout.splitlines()):
        line = line.strip()
        if line.startswith('=> '):
            return json.loads(line[3:])
    if 'Error:' in completed.stdout:
        raise RuntimeError(completed.stdout)
    return None


def integration(cli, timeout):
    state = None
    # Older Windows installers occasionally return before forwarding CLI stdout.
    # Retry this read-only availability check; never retry the test-start command.
    for attempt in range(3):
        state = cli_eval(cli, 'JSON.stringify({vault:app.vault.getName(),running:!!window.__academicVaultTests?.running,command:!!app.commands.commands["quickadd:choice:academic-vault-workflow-tests"]})')
        if state:
            break
        time.sleep(0.3)
    if not state or state.get('vault') != ROOT.name:
        raise RuntimeError('Could not contact the intended vault. Open it in Obsidian and enable its CLI.')
    if state['running']:
        raise RuntimeError('An integration run is already active. Wait for it to finish.')
    if not state['command']:
        raise RuntimeError('Test command is not registered. Enable QuickAdd or reload Obsidian.')
    previous = RESULT.read_text() if RESULT.exists() else None
    cli_eval(cli, 'void app.plugins.plugins.quickadd.api.executeChoice("Test vault workflows").catch(e=>{window.__academicVaultTestStartError=String(e)})')
    started = time.monotonic()
    last_progress = started
    while time.monotonic() - started < timeout:
        if RESULT.exists():
            try:
                text = RESULT.read_text()
                report = json.loads(text)
                if text != previous and not report.get('running', True):
                    for case in report['tests']:
                        print(f"{case['status'].upper()}: {case['name']}")
                        if case.get('error'):
                            print(case['error'], file=sys.stderr)
                    print(f"\nIntegration: {report['passed']} passed, {report['failed']} failed. Cleanup: {'passed' if all(c.get('removed') for c in report['cleanup']) else 'FAILED'}.")
                    print(f'Report: {RESULT}')
                    return 0 if report['ok'] else 1
            except (json.JSONDecodeError, OSError):
                pass  # The report may be in the middle of an atomic or buffered write.
        if time.monotonic() - last_progress >= 10:
            print('Obsidian integration tests are still running...', flush=True)
            last_progress = time.monotonic()
        time.sleep(0.5)
    raise RuntimeError('Integration run timed out. Check Obsidian for a dialog and System/Tests/Results/latest.json. Do not delete fixture folders until the run has stopped.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group()
    group.add_argument('--unit-only', action='store_true')
    group.add_argument('--integration-only', action='store_true')
    parser.add_argument('--cli', help='Obsidian executable path')
    parser.add_argument('--timeout', type=int, default=300, help='Integration timeout in seconds')
    args = parser.parse_args()
    status = 0
    if not args.integration_only:
        node = shutil.which('node')
        if not node:
            raise RuntimeError('Node.js is required for the fast tests.')
        status = subprocess.run([node, '--test', 'System/Tests/workflows.test.cjs'], cwd=ROOT).returncode
    if not args.unit_only:
        status = max(status, integration(find_cli(args.cli), args.timeout))
    return status


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (RuntimeError, subprocess.TimeoutExpired) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
