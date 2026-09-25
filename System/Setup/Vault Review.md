# Vault review — 2026-09-24

[[Home]] · [[System/Setup/Start Here|Setup]]

Reviewed the Markdown notes, templates, catalog definition, local scripts, plugin settings, property types, and internal link resolution. The current structure is coherent: project work lives under Work, shared resources and reading events under Library, daily routines under Daily, and configuration and templates under System.

## Fixed

| Finding | Impact | Correction |
| --- | --- | --- |
| The old project-status dropdown remained after adopting a List property | It wrote a scalar value back to YAML and did not recognize an existing status list | Removed the separate control and its unused script; project and resource templates now use one-element status lists |
| Reading and finished-resource queries compared status directly to text | Resource lists could disappear from those views after editing status as a List | Both queries now match exact status membership and also support older text values |
| Index Checker matched Research Log Index.md | It incorrectly reported dynamically listed research entries as missing manual links | Scoped Index Checker to Scratch Index; the research index remains automatic |
| The usage guide contained an inserted resource template | The guide was incorrectly classified as a resource | Removed the empty resource metadata and clarified that a new resource note must be active before inserting its template |
| Home’s “Project folder” column showed the Research Log subfolder | The displayed label was inaccurate | It now shows the project folder |
| Older research entries lacked a displayed creation value | The initial migrated log had an empty Created cell | Log indexes fall back to file creation time for older entries |
| Setup instructions described obsolete behavior | They said JavaScript was unnecessary, Homepage needed installation, and project status used a separate dropdown | Updated setup, project guidance, scratch-index instructions, plugin inventory, and version records |

## Global capture workflow

- Added [[Work/Tasks Next|Tasks Next]] for clear standalone actions with no project owner.
- Added [[Work/Inbox|Inbox]] for unprocessed ideas, notes, and ambiguous items. Processing remains manual.
- Home now renders **Next tasks** and **Active project tasks** separately, with independent 12-item limits.
- The Tasks Next query uses the exact path `Work/Tasks Next.md`, so Inbox and similarly named files cannot leak into it.
- Completing a Home checkbox writes back to its source note. Active-project status controls only the project task section.
- Project milestones remain the destination for project-owned actions. Project Scratch notes remain exploratory, and tasks in Scratch notes owned by active projects continue to appear on Home.
- No QuickAdd commands, global Scratch folder, properties, or status values were added for this workflow.

## Needs your attention

- The project still has its blueprint title and example milestone tasks. The blank scratchpad and research entries were preserved. Replace these when beginning real work; they are valid files, not broken configuration.

## Verification

- The complete terminal run passed 27 fast tests and 30 live Obsidian tests with zero failures.
- Home rendered standalone and active-project tasks in separate sections in the running app. The live tests completed both kinds of checkbox, verified exact source updates and removal after completion, and confirmed Inbox exclusion.
- Tasks Next remained visible with the test project archived. Both task sections enforced their 12-item limits independently.
- Every production Dataview query evaluated successfully, the workflow links resolved, all disposable fixtures were removed, and production notes remained unchanged.
- Resource status matching was checked with text, list, empty, missing, and unrelated values.
- Index Checker now identifies only the two Scratch indexes (project and blueprint); neither has missing links.
- Research-entry tests passed for project inference, nested projects, project selection, name-only input, timestamped naming, duplicate names, cancellation, and opening the created file. File creation in the running app had already passed a smoke test.
- All JSON configuration files parse; configured capture templates/scripts and required storage folders exist. Plugin minimum versions are compatible with the running Obsidian 1.13.7 app.
- The existing reading-capture configuration and produced record were inspected. The complete interactive reading-capture command was not re-run during this review.

The status List intentionally provides suggestions rather than enforcing a single choice or a fixed vocabulary. Keep one status per note. Future integrations in [[System/Setup/Feature Candidates]] remain proposals, not installed or verified workflows.

A pre-review backup of notes, scripts, and JSON settings was saved outside the vault at `/tmp/academic-vault-before-review.zip`. It is a temporary recovery copy, not a long-term backup.
