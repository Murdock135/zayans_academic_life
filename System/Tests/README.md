# Vault workflow tests

The fast and in-app suites cover different parts of the vault’s workflows using its actual templates, scripts, queries, and installed plugins. They do not test the unimplemented proposals in [[System/Setup/Feature Candidates]].

## Run inside Obsidian

Open the command palette and run **QuickAdd: Test vault workflows**.

The suite opens a temporary test tab and automatically submits or cancels its own paper-name dialogs. Let the run finish without editing notes or interacting with those dialogs. It restores the previously active tab and removes its temporary files when finished. A notification gives the result; details are saved in `System/Tests/Results/latest.json`.

## Run from a terminal

From the vault folder:

```sh
python3 System/Tests/run.py
```

This runs both the fast tests and the in-app tests. It requires Node.js, Python 3, and the vault open in Obsidian with its CLI enabled. Windows users can use `python` instead of `python3`.

```sh
# Fast tests only; Obsidian does not need to be open.
node --test System/Tests/workflows.test.cjs System/Tests/personal.test.cjs

# Integration tests only.
python3 System/Tests/run.py --integration-only

# Specify the executable if automatic discovery cannot find it.
python3 System/Tests/run.py --cli "/path/to/Obsidian"
```

The runner exits with a nonzero status on test failure, failed cleanup, or a timeout. QuickAdd must be enabled so its test command is registered.

## Personal workflow verification

`personal.test.cjs` runs in the fast suite only. It covers personal project creation, cancellation and duplicates, safe names, owner/status/tag filtering, and shared dashboard/callout wiring. The in-app QuickAdd suite does not automate personal-project creation, exploration tasks, or the Explorations catalog view.

During the 2026-10-18 implementation, manual live checks verified the real New personal project command, area display, the Tasks Next callout, source-checkbox completion, and paused-project filtering. The temporary personal project was removed afterward. Those checks are separate from the saved automated in-app report.

## Coverage

| Workflow | What is tested |
| --- | --- |
| Create a project | Copy the complete blueprint; verify status, areas, milestones, Scratch index, Research Log folder and index; edit properties and check their rendered controls |
| Personal projects (fast tests) | Create the personal blueprint with areas and Notes, preserve duplicates, handle cancellation and invalid names, scope next tasks to active nearest owners, escape folder paths, and verify shared dashboard/callout wiring |
| Create research entries | Execute the real QuickAdd macro without a name prompt; verify timestamped filename, correct project/paper destination, owner links, metadata, blank body and Live Preview |
| Create a paper | Run the real QuickAdd command and submit/cancel the paper-name prompt; verify the complete blueprint, parent link and Live Preview; fast tests cover project selection, sibling papers, duplicates, unsafe and blank names |
| Research edge cases | Nested projects, folder boundaries, project selection from Home, no projects, empty names, unsafe filename characters, duplicate names/timestamps, failed writes |
| Create a resource | Open an empty test note and invoke core Templates insertion; validate the resulting resource properties |
| Resource lifecycle | Saved, reading, finished, stopped and legacy text/list statuses; finishing and rereading; reading history retained; resource membership determined by folder rather than editable type |
| Reading capture | Run a clone of the real QuickAdd Template choice with only its destination and opening behavior changed; verify unique events, expanded date tokens and resource links |
| Home and Projects | Render standalone tasks on Home and active-project tasks on Projects; require an exact Tasks Next path; exclude completed, Inbox, similarly named, paused, archived and completed-project tasks; retain active-project Scratch tasks; click each kind of checkbox and verify its exact source; fast tests check Home’s 12-item limit and unlimited Work project task views |
| Other dashboards | Evaluate and render Projects, project overviews, and research indexes; assert actual rows and links; fast checks use the installed Dataview parser/evaluator to validate Home project/paper labels, links and ordering |
| Bases catalog | Render All, Reading and Finished views with a temporary source folder; test missing, capitalized and incorrect type values, exact status matching, and exclusion of non-Markdown attachments |
| Index Checker | Independently detect and clear missing links in project and paper Scratch folders; exclude generated Research Log indexes |
| Paper workflows | Render project/paper navigation, Home owner identities and task headings; complete a paper checkbox; hide tasks when paper or parent is paused; verify attachment placement and archive completed tasks inside paper Milestones |
| Configuration | Required plugins, paths, property type and JavaScript setting; resolve workflow links and evaluate every production Dataview query |

## Isolation and cleanup

Each integration run creates uniquely named `vault-test-...` folders beneath Work, Library/Items, Library/Sessions, and System/Tests/Fixtures. Production notes are not edited; the suite compares their contents before and after the run. Dashboard copies change only their source folders so assertions remain independent of the amount of real data in the vault.

The research command is tested unchanged. Resource insertion uses the actual core Templates implementation. Reading capture uses a temporary in-memory choice that is removed afterward; the production choice is not changed.

All fixture roots are tracked in the result and removed in `finally`, including when assertions fail. If Obsidian closes or crashes mid-run, cleanup cannot execute. Check the result/run ID and remove only that run’s `vault-test-...` folders after confirming the run has stopped. Do not remove normal project or library folders.

## Limits

The in-app Home-limit check still carries an older assumption that the Work project task view is capped at twelve. Current production Work queries are unlimited; that historical integration assertion needs updating before its limit result can describe current behavior. The Personal fast tests and manual checks above do not establish full in-app coverage for Personal or Explorations.

These are behavioral and DOM-rendering tests, not pixel-perfect visual comparisons. In an occluded desktop window, the suite temporarily disables Electron background throttling so Tasks can run real animation-frame callbacks, then restores the previous state. The report records this environment adjustment. They verify rendered tables, links, properties and interactive checkboxes; they do not judge theme aesthetics, mobile layout, long-term sync, backup recovery or external integrations. A few core Obsidian APIs and DOM selectors are not public contracts, so an app/plugin update may require a test-harness adjustment. Failures retain their names and stack traces in the report to distinguish harness incompatibility from a vault regression.
