# How to use this vault

[[Home|Dashboard]] · [[Projects]] · [[Library/Catalog.base|Library]] · [[History]] · [[System/Setup/Start Here|Setup]]

Start from Home, choose a project, resume that project's research, and record reading when useful. You do not need a general-purpose notes collection or summaries of everything you save.

## Your first ten minutes

1. Follow [[System/Setup/Start Here]] to enable the plugins.
2. Copy the project blueprint into Work as described in [[System/Setup/Project Structure]]. Give the project one real milestone and task.
3. Run **QuickAdd: New research log** from a project note, or create a scratchpad under its Scratch folder.
4. Add one current reading resource using the instructions below, then use [[System/Setup/Reading Capture|QuickAdd reading capture]] to record a session.
5. Open Home to see the separate files represented in its views.

## A normal day

### Begin

Open Home and tick off the startup checklist. Then choose a project-owned log from **Continue research**.

### Work

Send a clear action with no project owner directly to [[Work/Tasks Next|Tasks Next]]. Send an unclear idea, note, or action to [[Work/Inbox|Inbox]] and process it later.

Move project-owned work into the appropriate project's Milestones.md. Check tasks there or in the Projects dashboard's **Active project tasks** view; the query updates the source checkbox. Tasks written while exploring in an active project's Scratch notes also appear there. The dashboard shows at most twelve items, and its source note is the complete view.

Create timestamped entries in that project's Research Log folder using **QuickAdd: New research log**. Put substantial experiments, drafts, derivations, and exploratory ideas into individual Scratch files. Scratch is project exploration, not the global task inbox. Maintain scratch links in Scratch Index.md, aided by Index Checker. See [[System/Setup/Project Structure]] for the full folder layout and rationale.

### Read

Home's Currently reading card opens the resource record; follow its URL to read. It does not yet automatically resume an external reader at the saved position. After reading, run **QuickAdd: Log reading**, fill the resource link and any optional takeaway/position, and update the resource's overall progress if it changed.

### Finish

Unfinished project tasks stay where they are. No tomorrow-action prompt is required. Uncheck any startup items on Home that you want to revisit tomorrow.

Unchecked startup items do not carry forward automatically. If a prompt has become a clear standalone action, move it to Tasks Next. If it is unclear, move it to Inbox. If a project owns it, move it to the appropriate project milestone.

## Create and manage a project

Use [[System/Setup/Project Structure]] and its complete copyable blueprint. Every project has its own Research Log folder and scratch index. Project status and area labels live in the project entry file. Milestones and their tasks live together in Milestones.md.

The Projects dashboard's **Active project tasks** section shows unfinished tasks only from projects whose status includes `active`. Setting a project to `paused`, `completed`, or `archived` removes its tasks from that section; the tasks stay in their original notes. Home's separate **Next tasks** section is unaffected by project status. Review project tasks when closing a project. A milestone is currently a heading; there is no draggable or calculated milestone bar yet.

## Create a research log entry

From any note in a project, run **QuickAdd: New research log**. QuickAdd immediately creates a file named with the local date and time in that project's Research Log folder and opens a blank body for writing. From outside a project, choose the destination project when more than one exists.

Research Log Index.md lists that project's entries. Home lists recent entries across projects without combining their contents. Use `related_projects` to link other projects involved in an entry. See [[System/Setup/Research Capture]].

## Add a reading resource

Create and open a new note such as `Library/Items/Analysis I.md`. With that new note active, run **Templates: Insert template** and choose Resource. This creates a metadata record, not a requirement to write a prose note.

| Field             | Use                                                                  |
| ----------------- | -------------------------------------------------------------------- |
| title / authors   | Bibliographic title and author list; use a recognizable filename too |
| publication_date  | Actual date if known; otherwise blank                                |
| kind              | book, paper, article, video, or course                               |
| status            | saved, reading, finished, or stopped                                 |
| progress          | Numeric coverage estimate from 0 to 100, without a percent sign      |
| position          | Page, section, or video timestamp where you stopped                  |
| url / doi         | Source location and identifier if available                          |
| topics / projects | Optional topic labels and project links                              |
| finished_on       | Completion date when you mark the item finished                      |
| source_ids        | Leave empty for manual records; reserved for importers               |

Set the `status` list to one value, `reading`, to show the item on Home. Keep one record per resource and many reading events as needed. [[Library/Catalog.base|Library]] is the single catalog, with All, Reading, and Finished views. Markdown notes in Library/Items appear automatically; no `type` property is required. System/Templates/Resource.md is the reusable blank form.

## Record a reading session

Run **QuickAdd: Log reading**; it assigns the name and destination automatically. Set resource to the catalog item's wikilink, then add optional project links, position, progress_after, and takeaway. Full instructions and exact settings are in [[System/Setup/Reading Capture]].

Reading events and overall progress are distinct. An excerpt can produce a takeaway without changing overall progress. The capture command does not yet update the resource's progress for you. Home shows six recent events; History shows the full list ordered by logged_at, falling back to file creation time for older entries.

## Finish a library item

Set status to `finished` and set finished_on. If you finished all of it, set progress to 100; if you finished only what you needed, retain the honest coverage estimate. Optionally create a final reading event.

The record stays in the library, disappears from Home's active-reading list, and retains all links and history. To reread it, set status back to reading and keep the previous events. Use stopped for something you set aside. Finishing does not move or delete files.

## Customize your startup routine

Edit the checklist directly in [[Home]] under **Start-up**. Changes take effect immediately.

## Where things belong

Home is the only page at the vault root. Everything else belongs to four folders:

| Location | Purpose |
| --- | --- |
| Home.md | Daily starting point |
| Work/ | Projects directory and self-contained project folders |
| Work/Tasks Next.md | Clear standalone actions with no project owner |
| Work/Inbox.md | Unprocessed ideas, notes, and ambiguous items |
| Library/ | Catalog.base, resource records in Items, and reading events in Sessions |
| Daily/ | Startup checklists, their Archive, and the History page |
| System/ | This guide, setup instructions, reusable templates, and reference material |

Open [[System/Vault Map]] for the full layout. Process Inbox entries manually into Tasks Next, a project milestone, a project Scratch note, or deletion. Project logs, scratchpads, indexes, and attachments stay inside their project. A resource belongs to the shared Library even when several projects use it; each reading session points to that resource.

## What is still manual

Resource creation and progress edits, project creation from the blueprint, Inbox processing, index review, and startup archival are manual. Reading-event and research-entry filenames/timestamps are automated through QuickAdd. Index Checker helps detect missing scratch links; it does not decide their organization.

Source synchronization, deduplication, semantic clusters, learning-level recommendations, AI greetings, sliders, and external PDF-window capture remain future work. See [[System/Setup/Plugin Plan]]. If views show raw code, enable their plugins and use Reading view. Empty views are expected before adding records in the correct folders with the required type/status properties.
