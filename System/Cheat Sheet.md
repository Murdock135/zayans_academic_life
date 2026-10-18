# Vault cheat sheet

[[Home|Dashboard]] · [[Work/Projects|Work]] · [[Personal/Home|Personal]] · [[Library/Catalog.base|Library]] · [[Library/Sessions|Sessions]] · [[System/How To Use|Full guide]]

## Daily loop

1. Open [[Home]] and use the start-up checklist.
2. Choose Work, Personal, or a Library exploration. Resume a recent Work research log when useful.
3. Put work where it belongs using the table below.
4. Leave unfinished tasks in their source note; no end-of-day migration is required.

## Where does this go?

| You have… | Put it in… |
| --- | --- |
| A personal idea | [[Personal/Inbox]] |
| A personal project | A project folder under `Personal/` |
| A reusable personal routine | `Personal/Routines/` |
| An open-ended personal interest | A Library item using the Exploration template |
| A clear task with no project | [[Work/Tasks Next]] |
| An unclear work thought | [[Work/Inbox]] |
| A shared project task | The project’s `Milestones.md` |
| A manuscript-specific task | The paper’s `Milestones.md` |
| A dated account of research work | The owning project or paper’s `Research Log/` |
| A Work experiment, derivation, or draft | The owning Work project or paper’s `Scratch/` |
| A personal project note | The owning personal project’s `Notes/` |
| A reading resource: book, textbook, paper, or article | `Library/Items/` |
| A paper or online-article reading session | `Library/Sessions/` |

## Commands to remember

| Command | Use |
| --- | --- |
| **QuickAdd: New project** | Create the Work project structure and open its Home |
| **QuickAdd: New personal project** | Create Home, Milestones, and Notes under Personal |
| **QuickAdd: New paper** | Create a paper under the current or selected project and open its Home |
| **QuickAdd: New research log** | Create a timestamped entry in the current project or paper |
| **QuickAdd: Log reading** | Record a paper/article session and its takeaway |
| **Templates: Insert template → Resource** | Set up a reading-resource record in `Library/Items/` |
| **Templates: Insert template → Exploration** | Set up an open-ended interest in `Library/Items/` |

## Reading

### Books and textbooks

- Set `kind` to `book` or `textbook`.
- Set `status` to `reading` to show it under **Currently Reading** on Home.
- Update `progress` and `reading_position` when useful.
- Do **not** create a reading-session note or takeaway for every sitting.

### Papers and online articles

- Keep one resource record in `Library/Items/`.
- Run **QuickAdd: Log reading** for each session you want to retain.
- Link the `resource` and write the session's `takeaway`.
- `projects`, `reading_position`, and `progress_after` are optional.
- [[Library/Sessions|Sessions]] shows the latest 200. Preserve the complete history in `Library/Reading History.csv` before removing anything older.

### Finish any resource

- Set `status` to `finished`.
- Set `finished_on`.
- Use `progress: 100` only if you completed all of it.
- Use `stopped` when you deliberately set something aside.

## Project and paper status

- Work project `active`: shared project tasks appear on Work Projects.
- Paper tasks appear when both project and paper are `active`.
- Paper `stage`: idea, experiments, drafting, submitted, revision, or published; independent of status.
- `paused`, `completed`, or `archived`: tasks remain in place but disappear from the active-project view.
- Keep authored papers under the project’s Papers folder; each paper owns its notes and attachments.
- Tasks Next’s Tagged next tasks view includes tagged Work tasks regardless of status.

Personal project `#next` tasks appear on Personal Home and in Tasks Next’s **Personal projects** callout when the owning project is active. Set `areas` on each project Home. Library exploration tasks appear in their own callout without requiring `#next`; completed and cancelled tasks are hidden, and exploration status does not affect visibility. Expand the callout titles to see tasks. Personal Inbox and Routines tasks stay in those notes.

## When in doubt

- No project + clear action → [[Work/Tasks Next|Tasks Next]]
- Unclear work capture → [[Work/Inbox|Work Inbox]]
- Personal idea → [[Personal/Inbox|Personal Inbox]]
- Open-ended interest → Library Exploration
- Reusable practice → [[Personal/Routines/Home|Routines]]
- Project-owned → that project
- Shared reading resource → Library

For setup details and full explanations, see [[System/How To Use]] and [[System/Vault Map]].
