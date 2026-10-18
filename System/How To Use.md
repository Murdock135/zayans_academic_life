# How to use this vault

[[Home|Dashboard]] · [[Work/Projects|Work]] · [[Personal/Home|Personal]] · [[Library/Catalog.base|Library]] · [[Library/Sessions|Sessions]] · [[System/Cheat Sheet|Cheat Sheet]] · [[System/Setup/Start Here|Setup]]

Start from Home, choose Work or Personal, and resume a project or Library exploration. Record reading when useful. You do not need a general-purpose notes collection or summaries of everything you save.

## Your first ten minutes

1. Follow [[System/Setup/Start Here]] to enable the plugins.
2. Run **QuickAdd: New project** for Work or **QuickAdd: New personal project** for Personal, then define one outcome and task.
3. For Work, create a research log or Scratch note. For Personal, write in the project’s Notes folder. For an open-ended interest, create a Library item with the Exploration template.
4. Add one current book or textbook using the instructions below. When you read a paper or online article, use [[System/Setup/Reading Capture|QuickAdd reading capture]] if you want to record that session.
5. Open Home to see the separate files represented in its views.

## A normal day

### Begin

Open Home and tick off the startup checklist. Then choose Work, Personal, or Library. **Continue research** resumes Work logs; Personal Home lists active personal projects and their next actions.

### Work

Send a clear action with no project owner directly to [[Work/Tasks Next|Tasks Next]]. Send unclear work captures to [[Work/Inbox|Work Inbox]] and personal ideas to [[Personal/Inbox|Personal Inbox]], then process them later.

For Work projects, move shared work into the project’s Milestones.md and manuscript-specific work into the paper’s Milestones.md. Check tasks there or in the Projects dashboard's **Active project tasks** view; the query updates the source checkbox. Tasks in the current project or paper’s Scratch notes also appear there when their owners are active. The Active project tasks and Next project tasks sections have no task limit. Tag an unfinished task `#next` to show it in the unlimited Next project tasks section and in Tasks Next’s Tagged next tasks view. The Projects view requires an active project and, for paper tasks, an active paper; Tasks Next includes tagged tasks anywhere else in Work regardless of status. Checkboxes in both views update the original task.

Create timestamped entries in the current project or paper’s Research Log folder using **QuickAdd: New research log**. Put substantial experiments, drafts, derivations, and exploratory ideas into individual Scratch files. Scratch is project exploration, not the global task inbox. Maintain scratch links in 00 Scratch Index.md, aided by Index Checker. See [[System/Setup/Project Structure]] for the full folder layout and rationale.

For personal projects, keep tasks in Milestones or project Notes, then tag your chosen next actions `#next`. Personal Home and Tasks Next’s **Personal projects** callout show these tasks only while their nearest owning project is active. Library exploration checkboxes appear in the separate **Personal explorations** callout without a `#next` tag.

### Read

Home's **Currently Reading** card is for books and textbooks. Open the resource record, then follow its URL or use its saved position to resume. Update the resource's overall progress or position when useful. You do not need to create a digital session record or write a takeaway each time you read a book or textbook.

For papers and online articles, run **QuickAdd: Log reading** to record the reading session and its takeaway. Add a position, project, or progress-after value when useful.

### Finish

Unfinished project tasks stay where they are. No tomorrow-action prompt is required. Uncheck any startup items on Home that you want to revisit tomorrow.

Unchecked startup items do not carry forward automatically. If a prompt has become a clear standalone action, move it to Tasks Next. If it is unclear, move it to Inbox. If a project owns it, move it to the appropriate project milestone.

## Create and manage a Work project

Run **QuickAdd: New project**, enter a name, and let the command copy the complete blueprint into Work and open the new `Home.md`. Each Work project has its own Research Log folder, scratch index, and Papers folder. Project status and area labels live in the project entry file. Milestones and their tasks live together in Milestones.md. See [[System/Setup/Project Structure]].

The Projects dashboard's **Active project tasks** section shows unfinished tasks only from projects whose status includes `active`. Setting a project to `paused`, `completed`, or `archived` removes its tasks from that section; the tasks stay in their original notes. Home's separate **Next tasks** section is unaffected by project status. Review project tasks when closing a project. A milestone is currently a heading; there is no draggable or calculated milestone bar yet.

## Create and manage a personal project

Open [[Personal/Home|Personal]] or run **QuickAdd: New personal project**. Enter a name; the command creates `Personal/Project Name/Home.md`, `Milestones.md`, and an empty `Notes/` folder, then opens the project Home. Record why the project matters and a manageable outcome. Keep tasks with their milestones and add notes only when useful.

Set `areas` in each project's Home frontmatter, for example `areas: [learning, health]` for Microbiology Foundations or `areas: [organization, wellbeing]` for Organizing Myself. Use areas to describe the parts of your life the project supports; they do not need separate folders. Personal Home reads these properties to show active projects and the complete directory.

Tag an unfinished personal project task `#next` to show it on Personal Home and in the collapsed **Personal projects** callout on [[Work/Tasks Next|Tasks Next]]. These views show only tasks whose nearest owning project has `status: [active]`; `paused`, `completed`, or `archived` hides its tasks without moving them. Completed and cancelled tasks are hidden. Checkboxes update the original notes. Untagged tasks stay in the project. Work dashboards continue to show Work projects only.

Capture personal ideas in [[Personal/Inbox|Personal Inbox]]. Keep recurring practices and reusable checklists in [[Personal/Routines/Home|Routines]]. Open-ended interests belong in Library explorations; a chosen outcome belongs in a personal project. Link the exploration and project when one leads to the other. Shared books, articles, and courses stay in Library. **New research log** and **New paper** remain Work commands; use personal project Notes for your learning, designs, and reflections.

## Create and manage a paper

Open a note in its Work project and run **QuickAdd: New paper**. Enter a stable short name; the command creates Home, Milestones, Research Log, and Scratch under that project’s Papers folder. From outside a project, select the parent when necessary.

Paper Home holds `type: paper`, a parent-project link, status, publication stage, target venue, optional deadline and manuscript link. Project Home lists its papers. Keep shared infrastructure and broad ideas at project level; put manuscript-specific experiments, drafts, tasks and reviewer responses inside the paper. Store each note/task once and cross-link it.

Paper tasks appear on Projects only when both paper and parent project are active. Stage records publication progress independently of status. Index Checker checks each paper’s Scratch index separately; [[System/Setup/Project Structure|Project structure]] includes a Dataview fallback.

## Create a research log entry

From a Work project or paper note, run **QuickAdd: New research log**. QuickAdd creates a date-and-time-named entry in that workspace’s Research Log folder and opens a blank body. From outside a workspace, choose a project or paper destination when more than one exists.

Each Research Log Index.md lists entries in its own log folder. Home lists recent entries across projects and papers with both owner identities. Use `related_projects` to link other projects involved in an entry. See [[System/Setup/Research Capture]].

## Add a reading resource

Create and open a new note such as `Library/Items/Analysis I.md`. With that new note active, run **Templates: Insert template** and choose Resource. This creates a metadata record, not a requirement to write a prose note.

| Field             | Use                                                                  |
| ----------------- | -------------------------------------------------------------------- |
| title / authors   | Bibliographic title and author list; use a recognizable filename too |
| publication_date  | Actual date if known; otherwise blank                                |
| kind              | book, textbook, paper, article, video, or course                     |
| status            | saved, reading, finished, or stopped                                 |
| progress          | Numeric coverage estimate from 0 to 100, without a percent sign      |
| reading_position  | Page, section, or video timestamp where you stopped                  |
| url / doi         | Source location and identifier if available                          |
| topics / projects | Optional topic labels and project links                              |
| finished_on       | Completion date when you mark the item finished                      |
| source_ids        | Leave empty for manual records; reserved for importers               |

Set a book or textbook's `status` list to one value, `reading`, to show it under **Currently Reading** on Home. Papers and articles remain available through the Library catalog but do not appear in that Home list. Keep one record per resource. Create reading events only for papers and online articles, as needed. [[Library/Catalog.base|Library]] is the single catalog, with All, Explorations, Reading, and Finished views. Markdown notes in Library/Items appear automatically; no `type` property is required. System/Templates/Resource.md is the reusable blank form.

## Explore a personal interest

Create a note in `Library/Items`, then run **Templates: Insert template** and choose **Exploration**. Use it for a rabbit hole, hobby, or personal experiment such as personal agents or organizing yourself. The Library's **Explorations** view lists items with `kind: exploration`.

Use `curious`, `exploring`, or `resting` in the status list. Record your interest, questions, things to try, linked resources and discoveries in Trail, and a short Resume here reminder. No progress percentage or milestones are needed. Link books, articles, and courses to their own Library records.

Use ordinary bullets for possibilities. Turn an activity into a checkbox when you intend to do it. All unfinished exploration checkboxes appear in the collapsed **Personal explorations** callout on [[Work/Tasks Next|Tasks Next]], grouped by source note; no `#next` tag is required. Completed and cancelled tasks are hidden. Exploration status does not hide unfinished tasks. Checking a task there updates the original Library item.

## Record a paper or article reading session

Use this for papers and online articles, not routine book or textbook reading. Run **QuickAdd: Log reading**; it assigns the name and destination automatically. Set resource to the catalog item's wikilink and record the session's takeaway. Project links, position, and progress_after are optional. Full instructions and exact settings are in [[System/Setup/Reading Capture]].

Reading events and overall progress are distinct. A paper or article excerpt can produce a takeaway without changing overall progress. The capture command does not modify the resource record. Home uses the latest linked session with a recorded `reading_position` or `progress_after` for each value in Currently Reading, falling back to the resource record; optional book sessions work too. Home shows six recent events, and [[Library/Sessions|Sessions]] shows the latest 200 ordered by logged_at, falling back to file creation time for older entries. When a new capture would exceed 200 files, **Log reading** appends the oldest session to the Excel-compatible `Library/Reading History.csv`, verifies the write, and moves that Markdown file to Obsidian's trash before creating the new session.

## Finish a library item

Set status to `finished` and set finished_on. If you finished all of it, set progress to 100; if you finished only what you needed, retain the honest coverage estimate. A final reading event is optional for a paper or article and unnecessary for a book or textbook.

The record stays in the library, disappears from Home's active-reading list, and retains all links and history. To reread it, set status back to reading and keep the previous events. Use stopped for something you set aside. Finishing does not move or delete files.

## Customize your startup routine

Edit the checklist directly in [[Home]] under **Start-up**. Changes take effect immediately.

## Where things belong

Home is the only page at the vault root. Everything else belongs to four folders:

| Location | Purpose |
| --- | --- |
| Home.md | Daily starting point |
| Personal/ | Personal projects, ideas, and reusable routines |
| Work/ | Projects directory and self-contained projects, with authored papers under each project’s Papers folder |
| Work/Tasks Next.md | Standalone actions, tagged Work tasks, and separate personal-project and exploration callouts |
| Work/Inbox.md | Unprocessed ideas, notes, and ambiguous items |
| Library/ | Catalog.base, resource records in Items, and reading events in Sessions |
| System/ | This guide, setup instructions, reusable templates, and reference material |

Open [[System/Vault Map]] for the full layout. Process Inbox entries manually into Tasks Next, a project milestone, a project Scratch note, or deletion. Work logs and Scratch notes stay inside their project or paper. Personal project Notes stay inside their personal project; reusable practices belong in Personal/Routines. A resource belongs to the shared Library even when several projects use it; each reading session points to that resource.

## Which tasks appear where?

| View | Included tasks | Status and tag rules |
| --- | --- | --- |
| Root Home → Next tasks | Standalone checkboxes written directly in Tasks Next | First 12 unfinished tasks; project status does not apply |
| Work Projects → Active project tasks | Tasks owned by Work projects and papers | Project must be active; papers must also be active; no task limit |
| Work Projects → Next project tasks | Work project and paper tasks tagged `#next` | Same active-owner rules; no task limit |
| Tasks Next → Tagged next tasks | `#next` tasks elsewhere in Work | Independent of project and paper status; no task limit |
| Personal Home → Next actions; Tasks Next → Personal projects | Personal project tasks tagged `#next` | Nearest owning project must be active; completed and cancelled tasks hidden; no task limit |
| Tasks Next → Personal explorations | Tasks in Library items with `kind: exploration` | No tag required; item status does not filter tasks; completed and cancelled tasks hidden |

The personal sections in Tasks Next are collapsed callouts. Expand their titles to see tasks. All task views edit the original checkboxes. Tasks in Personal Inbox and Routines are not included in the personal-project callout because they have no owning project.

## What is still manual

Resource creation and progress edits, choosing project/paper names and customizing their blueprints, Inbox processing, and index review are manual. Reading-event and research-entry filenames/timestamps are automated through QuickAdd. Index Checker helps detect missing scratch links; it does not decide their organization.

Source synchronization, deduplication, semantic clusters, learning-level recommendations, AI greetings, sliders, and external PDF-window capture remain future work. See [[System/Setup/Plugin Plan]]. If views show raw code, enable their plugins and use Reading view. Empty views are expected before adding records in the correct folders with the required type/status properties.
