# Vault map

[[Home]] · [[System/How To Use|Usage guide]]

The root contains one starting page and three folders. Routine work should rarely require opening System.

```text
Home.md
Work/
  Projects.md                 Project directory
  Tasks Next.md               Standalone actions with no project owner
  Inbox.md                    Unprocessed and ambiguous captures
  Project Name/
    Home.md                   Project home, status, areas, and overview
    Milestones.md             Milestones and their tasks
    Research Log/             Timestamped research entries
      Research Log Index.md    Project entry index
    Scratch/
      Scratch Index.md        Curated scratchpad links
      Attachments/
    Attachments/
Library/
  Catalog.base                Library: All, Reading, and Finished views
  Sessions.md                 View of the 200 most recent reading sessions
  Reading History.csv         Excel-compatible long-term session archive
  Items/                      One metadata record per resource
  Sessions/                   Latest 200 paper and article reading events
System/
  Cheat Sheet.md              One-page daily workflow reference
  How To Use.md               Daily workflow
  Vault Map.md                This page
  Setup/                      Plugin and configuration instructions
  Scripts/                    QuickAdd research-entry creation
  Templates/
    Project Blueprint/        Copy this whole folder to create a project
    Resource.md               Blank resource record
    Capture/Reading Event.md  QuickAdd capture template
  Reference/Legacy Templates/ Previous single-file templates, retained for reference
```

Each project folder is named from the value entered in **QuickAdd: New project**. Existing project names and contents have been preserved.

## Placement rules

- Start at Home. Its navigation links open the project directory, library, cheat sheet, or guide.
- Put a clear action with no project owner in Work/Tasks Next.md.
- Put an unclear or unprocessed capture in Work/Inbox.md, then move it to Tasks Next, a project milestone, a project Scratch note, or deletion.
- Project Scratch folders are for exploration, not a global inbox. Tasks inside active-project Scratch notes may appear on the Projects dashboard.
- Keep all project-specific work beneath its project folder. The project overview and Milestones file are distinct from its research log and exploratory scratchpads.
- Keep shared resources in Library. Track books and textbooks through their resource records; keep the latest 200 paper and online-article reading sessions in Library/Sessions and archive older ones in Reading History.csv. Do not copy a resource into every project that uses it.
- Use System/Templates for new records and project scaffolding. Legacy single-file templates are outside the active template folder to avoid offering competing creation methods.
- Use a project-local Attachments subfolder; the relative attachment setting is unchanged.

The root was reorganized without rewriting the current workspace. If a previously open tab points to an old path, close it and reopen the page from Home. Reload Obsidian if the running plugins still remember their old template or capture paths.
