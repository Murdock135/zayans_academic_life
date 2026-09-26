# Vault cheat sheet

[[Home|Dashboard]] · [[Work/Projects|Projects]] · [[Library/Catalog.base|Library]] · [[Library/Sessions|Sessions]] · [[System/How To Use|Full guide]]

## Daily loop

1. Open [[Home]] and use the start-up checklist.
2. Choose a project or resume a recent research log.
3. Put work where it belongs using the table below.
4. Leave unfinished tasks in their source note; no end-of-day migration is required.

## Where does this go?

| You have… | Put it in… |
| --- | --- |
| A clear task with no project | [[Work/Tasks Next]] |
| An unclear or unprocessed thought | [[Work/Inbox]] |
| A project task | That project's `Milestones.md` |
| A dated account of project work | That project's `Research Log/` |
| An experiment, derivation, draft, or exploratory note | That project's `Scratch/` |
| A book, textbook, paper, or article | `Library/Items/` |
| A paper or online-article reading session | `Library/Sessions/` |

## Commands to remember

| Command | Use |
| --- | --- |
| **QuickAdd: New research log** | Create a timestamped research entry in the current project |
| **QuickAdd: Log reading** | Record a paper/article session and its takeaway |
| **Templates: Insert template → Resource** | Set up a new note in `Library/Items/` |

## Reading

### Books and textbooks

- Set `kind` to `book` or `textbook`.
- Set `status` to `reading` to show it under **Currently Reading** on Home.
- Update `progress` and `position` when useful.
- Do **not** create a reading-session note or takeaway for every sitting.

### Papers and online articles

- Keep one resource record in `Library/Items/`.
- Run **QuickAdd: Log reading** for each session you want to retain.
- Link the `resource` and write the session's `takeaway`.
- `projects`, `position`, and `progress_after` are optional.
- [[Library/Sessions|Sessions]] shows the latest 200. Preserve the complete history in `Library/Reading History.csv` before removing anything older.

### Finish any resource

- Set `status` to `finished`.
- Set `finished_on`.
- Use `progress: 100` only if you completed all of it.
- Use `stopped` when you deliberately set something aside.

## Project status

- `active`: unfinished project tasks appear on the Projects dashboard.
- `paused`, `completed`, or `archived`: tasks remain in place but disappear from the active-project view.
- Keep all project-owned notes and attachments inside that project's folder.

## When in doubt

- No project + clear action → [[Work/Tasks Next|Tasks Next]]
- No project + unclear → [[Work/Inbox|Inbox]]
- Project-owned → that project
- Shared reading resource → Library

For setup details and full explanations, see [[System/How To Use]] and [[System/Vault Map]].
