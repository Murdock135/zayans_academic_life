# Vault review — 2026-10-18

[[Home]] · [[Personal/Home|Personal]] · [[System/Setup/Project Structure|Project structure]] · [[System/Tests/README|Workflow tests]]

Added a separate Personal workspace and Library explorations. The dated reviews below are historical records; their folder layouts, limits, counts, and remaining issues describe those earlier runs.

## Current changes

- Personal has a dashboard, Inbox, Routines index, and a lightweight project blueprint with Home, Milestones, and Notes.
- **QuickAdd: New personal project** creates personal project folders. Project Home holds `type: project`, an active status list, and an `areas` list. Personal Home reads those properties; Work queries remain scoped to Work.
- Personal project `#next` tasks appear on Personal Home and in Tasks Next’s collapsed **Personal projects** callout. The callout embeds the dashboard’s Next actions section. Only active nearest owners qualify; completed and cancelled tasks are hidden.
- Library items can use `kind: exploration` and the Exploration template. The catalog has an Explorations view. Unfinished exploration tasks appear in a separate Tasks Next callout without a tag requirement or item-status filter.
- Existing Work project and paper workflows remain separate. Work’s active-project and #next views are unlimited; only root Home’s standalone Next tasks section is capped at twelve.

## Verification scope

The implementation run passed **54 fast tests**: 48 existing checks and six Personal checks. Manual checks in the running Obsidian app verified project creation, area display, tagged-task rendering in the callout, exact source updates when checking a task, and hiding paused-project tasks while retaining the project in All projects. The temporary project was removed.

The earlier implementation also checked the exploration task query with the installed Dataview parser and evaluator. This does not establish live coverage of the Explorations catalog view or checkbox interactions. The automated in-app suite was not rerun for the Personal implementation; its saved report belongs to an earlier run. See Workflow tests for coverage and the outstanding historical limit assertion.

## Documentation refresh

Updated the usage guide, cheat sheet, vault map, setup instructions, project structure, capture scope, plugin inventory, and test coverage notes to distinguish Work projects, Personal projects, Library explorations, and ongoing routines. Removed obsolete twelve-task claims from current workflow guidance. Older dated reviews below are retained for provenance.

---

# Vault review — 2026-10-13

[[Home]] · [[System/Setup/Project Structure|Project and paper structure]] · [[System/Tests/README|Workflow tests]]

Implemented Project → Papers while retaining project-level shared research and the shared Library. The workflow uses the existing plugins; no plugin installation or version update was needed.

## Changes and plugin impact

| Component | Change |
| --- | --- |
| Vault structure | Each project has a Papers folder; each authored paper owns Home, Milestones, Research Log, Scratch and local attachments |
| QuickAdd | Added New paper, extended New research log to recognize project and paper destinations, and removed the duplicate New project choice |
| Paper properties | Added type, project, status, stage, target_venue, deadline and manuscript; status remains a List and publication stage is separate |
| Dataview | Project Homes list papers; Home research shows separate project/paper identities; project task queries recognize paper ownership |
| Tasks | Source checkboxes remain authoritative; paper tasks require active project and paper in both Projects views; ordinary total limit stays twelve and #next stays unlimited |
| Tasks Next | Existing tagged Work view remains independent of project/paper status |
| Index Checker | Existing direct-child Scratch-index settings work for nested papers; detected and cleared missing links separately at both levels |
| Attachments | Existing relative Attachments setting routes paper attachments locally |
| Task Archiver | Existing current-note archive command works in paper Milestones without changing project Milestones |
| Documentation | Updated project structure, research capture, usage guide, cheat sheet, vault map, setup, plugin plan and test coverage |

## Migration

Created [[Work/Agentic System For epidemiology/Papers/SPARQ JAMIA/Home|SPARQ JAMIA]]. Moved its live manuscript link, paper milestone section, reviewer-materials task, completed outline task and Reference JAMIA papers scratchpad into the paper workspace. Obsidian handled the scratchpad move and link updates.

Kept architecture, shared batch-evaluation infrastructure, general evaluation ideas, journal possibilities and broader ideas at project level. Follow-up Study remains an example rather than a created paper. No paper title was inferred for Combination of Evidence in MASs.

Compared the migrated milestone files with the pre-change backup: all 19 existing task lines are preserved exactly, with each task stored once. The moved reference note’s bytes are unchanged. Pre-existing edits to Combination of Evidence milestones and Tasks Next were preserved.

## Verification

- **45 fast tests passed; 39 live Obsidian workflow tests passed; zero failures in the completed runs.**
- Live checks used real QuickAdd creation and cancellation, actual templates, Dataview/Tasks rendering, source-checkbox completion, owner status changes, Index Checker, attachment routing and Task Archiver.
- The final Home owner-label adjustment was then verified with the installed Dataview parser and evaluator against project and paper fixtures, including destinations and ordering. An additional live rerun after this display change was unavailable because UI reconnection timed out after CLI was restored to disabled.
- Every production Dataview query evaluated in the completed live run, workflow links resolved, all disposable fixture roots were removed, and production notes stayed unchanged throughout the final test run.
- All Obsidian JSON files parse; JavaScript syntax and git diff whitespace checks passed.
- Corrected old test assertions that looked for project tasks on Home and compared reading resource links with session filenames. Link assertions now use resolved destinations.
- The window was occluded during CLI verification. The test harness temporarily disabled Electron background throttling so real animation-frame rendering could proceed and restored the original setting afterward. CLI was also returned to its original disabled state after testing. This is recorded in the test report, not a permanent application change.

The final live report is `System/Tests/Results/latest.json`. These are workflow and DOM checks; they do not validate manuscript contents, external document access, mobile rendering or sync behavior.

## Existing content issue

[[Work/Combination of Evidence in MASs/Milestones|Combination of Evidence milestones]] contains pre-existing merge-conflict markers in its archived section. The paper-structure migration preserved that note. Resolving its historical duplicate entries is separate content cleanup.

A pre-change recovery copy is available at `/tmp/academic-vault-before-papers-20261013-115312.zip`. It is temporary, not a long-term backup.

---

# Vault review — 2026-09-24

[[Home]] · [[System/Setup/Start Here|Setup]]

Reviewed the Markdown notes, templates, catalog definition, local scripts, plugin settings, property types, and internal link resolution. The current structure is coherent: project work lives under Work, shared resources and reading events under Library, daily routines under Daily, and configuration and templates under System.

## Fixed

| Finding | Impact | Correction |
| --- | --- | --- |
| The old project-status dropdown remained after adopting a List property | It wrote a scalar value back to YAML and did not recognize an existing status list | Removed the separate control and its unused script; project and resource templates now use one-element status lists |
| Reading and finished-resource queries compared status directly to text | Resource lists could disappear from those views after editing status as a List | Both queries now match exact status membership and also support older text values |
| Index Checker matched Research Log Index.md | It incorrectly reported dynamically listed research entries as missing manual links | Scoped Index Checker to 00 Scratch Index; the research index remains automatic |
| The usage guide contained an inserted resource template | The guide was incorrectly classified as a resource | Removed the empty resource metadata and clarified that a new resource note must be active before inserting its template |
| Home’s “Project folder” column showed the Research Log subfolder | The displayed label was inaccurate | It now shows the project folder |
| Older research entries lacked a displayed creation value | The initial migrated log had an empty Created cell | Log indexes fall back to file creation time for older entries |
| Setup instructions described obsolete behavior | They said JavaScript was unnecessary, Homepage needed installation, and project status used a separate dropdown | Updated setup, project guidance, scratch-index instructions, plugin inventory, and version records |

## Global capture workflow

- Added [[Work/Tasks Next|Tasks Next]] for clear standalone actions with no project owner.
- Added [[Work/Inbox|Inbox]] for unprocessed ideas, notes, and ambiguous items. Processing remains manual.
- Home renders **Next tasks**, while the Projects dashboard renders **Active project tasks**; each has its own 12-item limit.
- The Tasks Next query uses the exact path `Work/Tasks Next.md`, so Inbox and similarly named files cannot leak into it.
- Completing a dashboard checkbox writes back to its source note. Active-project status controls only the Projects task section.
- Project milestones remain the destination for project-owned actions. Project Scratch notes remain exploratory, and tasks in Scratch notes owned by active projects continue to appear on Projects.
- No QuickAdd commands, global Scratch folder, properties, or status values were added for this workflow.

## Needs your attention

- The project still has its blueprint title and example milestone tasks. The blank scratchpad and research entries were preserved. Replace these when beginning real work; they are valid files, not broken configuration.

## Verification

- The complete terminal run passed 27 fast tests and 30 live Obsidian tests with zero failures.
- Home rendered standalone tasks and Projects rendered active-project tasks in the running app. The live tests completed both kinds of checkbox, verified exact source updates and removal after completion, and confirmed Inbox exclusion.
- Tasks Next remained visible with the test project archived. Both task sections enforced their 12-item limits independently.
- Every production Dataview query evaluated successfully, the workflow links resolved, all disposable fixtures were removed, and production notes remained unchanged.
- Resource status matching was checked with text, list, empty, missing, and unrelated values.
- Index Checker now identifies only the two Scratch indexes (project and blueprint); neither has missing links.
- Research-entry tests passed for project inference, nested projects, project selection, name-only input, timestamped naming, duplicate names, cancellation, and opening the created file. File creation in the running app had already passed a smoke test.
- All JSON configuration files parse; configured capture templates/scripts and required storage folders exist. Plugin minimum versions are compatible with the running Obsidian 1.13.7 app.
- The existing reading-capture configuration and produced record were inspected. The complete interactive reading-capture command was not re-run during this review.

The status List intentionally provides suggestions rather than enforcing a single choice or a fixed vocabulary. Keep one status per note. Future integrations in [[System/Setup/Feature Candidates]] remain proposals, not installed or verified workflows.

A pre-review backup of notes, scripts, and JSON settings was saved outside the vault at `/tmp/academic-vault-before-review.zip`. It is a temporary recovery copy, not a long-term backup.
