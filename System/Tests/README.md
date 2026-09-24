# Vault workflow tests

The suite tests the vault’s current workflows using its actual templates, scripts, queries, and installed plugins. It does not test the unimplemented proposals in [[System/Setup/Feature Candidates]].

## Run inside Obsidian

Open the command palette and run **QuickAdd: Test vault workflows**.

The suite opens a temporary test tab and automatically submits or cancels its own research-name dialogs. Let the run finish without editing notes or interacting with those dialogs. It restores the previously active tab and removes its temporary files when finished. A notification gives the result; details are saved in `System/Tests/Results/latest.json`.

## Run from a terminal

From the vault folder:

```sh
python3 System/Tests/run.py
```

This runs both the fast tests and the in-app tests. It requires Node.js, Python 3, and the vault open in Obsidian with its CLI enabled. Windows users can use `python` instead of `python3`.

```sh
# Fast tests only; Obsidian does not need to be open.
node --test System/Tests/workflows.test.cjs

# Integration tests only.
python3 System/Tests/run.py --integration-only

# Specify the executable if automatic discovery cannot find it.
python3 System/Tests/run.py --cli "/path/to/Obsidian"
```

The runner exits with a nonzero status on test failure, failed cleanup, or a timeout. QuickAdd must be enabled so its test command is registered.

## Coverage

| Workflow | What is tested |
| --- | --- |
| Create a project | Copy the complete blueprint; verify status, areas, milestones, Scratch index, Research Log folder and index; edit properties and check their rendered controls |
| Create research entries | Execute the real QuickAdd macro and submit the name dialog; verify timestamped filename, correct project, project link, metadata, blank body and Live Preview; cancel the actual dialog without creating a note |
| Research edge cases | Nested projects, folder boundaries, project selection from Home, no projects, empty names, unsafe filename characters, duplicate names/timestamps, failed writes |
| Create a resource | Open an empty test note and invoke core Templates insertion; validate the resulting resource properties |
| Resource lifecycle | Saved, reading, finished, stopped and legacy text/list statuses; finishing and rereading; reading history retained |
| Daily startup | Use the core Daily notes implementation with a temporary destination; expand the real template; verify idempotency, Home prompts, and archival into History |
| Reading capture | Run a clone of the real QuickAdd Template choice with only its destination and opening behavior changed; verify unique events, expanded date tokens and resource links |
| Home | Render its actual Dataview/Tasks blocks; exclude paused, archived and completed tasks; include scratchpad tasks; click a checkbox and verify its source changes; check all list limits and ordering |
| Other dashboards | Evaluate and render Projects, project overviews, research indexes, Library and History; assert actual rows and links |
| Bases catalog | Render the real catalog definition with a temporary source folder; verify reading, finished and stopped resources remain visible |
| Index Checker | Detect a missing Scratch link, add it, and verify the warning clears; ensure generated Research Log indexes are excluded |
| Configuration | Required plugins, paths, property type and JavaScript setting; evaluate every production Dataview query |

## Isolation and cleanup

Each integration run creates uniquely named `vault-test-...` folders beneath Work, Library/Items, Library/Sessions, Daily/Startup, Daily/Archive and System/Tests/Fixtures. Production notes are not edited; the suite compares their contents before and after the run. Dashboard copies change only their source folders so assertions remain independent of the amount of real data in the vault.

The research command is tested unchanged. Resource insertion uses the actual core Templates implementation. Daily-note creation uses the actual core method on an object with a temporary destination, leaving the live daily-note settings unchanged. Reading capture uses a temporary in-memory choice that is removed afterward; the production choice is not changed.

All fixture roots are tracked in the result and removed in `finally`, including when assertions fail. If Obsidian closes or crashes mid-run, cleanup cannot execute. Check the result/run ID and remove only that run’s `vault-test-...` folders after confirming the run has stopped. Do not remove normal project, library or daily folders.

## Limits

These are behavioral and DOM-rendering tests, not pixel-perfect visual comparisons. They verify rendered tables, links, properties and interactive checkboxes; they do not judge theme aesthetics, mobile layout, long-term sync, backup recovery or external integrations. A few core Obsidian APIs and DOM selectors are not public contracts, so an app/plugin update may require a test-harness adjustment. Failures retain their names and stack traces in the report to distinguish harness incompatibility from a vault regression.
