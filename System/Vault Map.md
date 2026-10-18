# Vault map

[[Home]] · [[System/How To Use|Usage guide]]

The root contains one starting page and four folders. Routine work should rarely require opening System.

```text
Home.md
Work/
  Projects.md                 Project directory
  Tasks Next.md               Standalone tasks, tagged Work tasks, personal callouts
  Inbox.md                    Unprocessed and ambiguous captures
  Project Name/
    Home.md                   Project home, status, areas, and overview
    Milestones.md             Milestones and their tasks
    Research Log/             Timestamped research entries
      Research Log Index.md    Project entry index
    Scratch/
      00 Scratch Index.md        Curated scratchpad links
      Attachments/
    Attachments/
    Papers/                   Authored manuscript workspaces
      Paper Name/
        Home.md               Parent project, status, publication stage, manuscript link
        Milestones.md         Paper tasks and submission milestones
        Research Log/
          Research Log Index.md
        Scratch/
          00 Scratch Index.md
          Attachments/
        Attachments/
Personal/
  Home.md                     Active projects, areas, next actions, and directory
  Inbox.md                    Personal ideas to process
  Routines/
    Home.md                   Reusable checklists and ongoing practices
  Project Name/
    Home.md                   Purpose, outcome, status, areas, and links
    Milestones.md             Milestones and their tasks
    Notes/                    Learning, designs, experiments, and reflections
Library/
  Catalog.base                Library: All, Explorations, Reading, and Finished views
  Sessions.md                 View of the 200 most recent reading sessions
  Reading History.csv         Excel-compatible long-term session archive
  Items/                      Shared resources and lightweight exploration notes
  Sessions/                   Latest 200 paper and article reading events
System/
  Cheat Sheet.md              One-page daily workflow reference
  How To Use.md               Daily workflow
  Vault Map.md                This page
  Setup/                      Plugin and configuration instructions
  Scripts/                    QuickAdd project creation, research, and reading capture
  Templates/
    Project Blueprint/        Copy this whole folder to create a project
    Personal Project Blueprint/  Home and milestones for personal projects
    Exploration.md            Lightweight Library exploration
    Paper Blueprint/          Copy under a project with QuickAdd: New paper
    Resource.md               Blank resource record
    Capture/Reading Event.md  QuickAdd capture template
  Reference/Legacy Templates/ Previous single-file templates, retained for reference
```

Work project folders are created with **QuickAdd: New project**; Personal project folders use **QuickAdd: New personal project**. Both ask for a name. Existing project names and contents have been preserved.

## Placement rules

- Start at Home. Its navigation links open Work, Personal, Library, the cheat sheet, or guide.
- Personal projects live under Personal, with areas on each project Home. Use Personal/Inbox.md for ideas and Personal/Routines for ongoing practices. Create a project with QuickAdd: New personal project.
- Personal project tasks tagged #next appear on Personal Home and in Tasks Next when their nearest owning project is active. Library exploration tasks have a separate callout in Tasks Next.
- Put a clear action with no project owner in Work/Tasks Next.md.
- Put an unclear or unprocessed Work capture in Work/Inbox.md, then move it to Tasks Next, a project milestone, a project Scratch note, or deletion.
- Work project Scratch folders are for exploration, not a global inbox. Tasks inside active-project Scratch notes may appear on the Projects dashboard.
- Keep shared research at project level and manuscript-specific work under Papers/Paper Name. Each paper has its own log, milestones and Scratch index.
- Keep all project-specific work beneath its project folder. Each project has a Home and Milestones file; Work projects use Research Log and Scratch, while Personal projects use Notes.
- Keep shared resources in Library. Track books and textbooks through their resource records; keep the latest 200 paper and online-article reading sessions in Library/Sessions and archive older ones in Reading History.csv. Do not copy a resource into every project that uses it.
- Use System/Templates for new records and project scaffolding. Legacy single-file templates are outside the active template folder to avoid offering competing creation methods.
- Use a project-local Attachments subfolder; the relative attachment setting is unchanged.

The root was reorganized without rewriting the current workspace. If a previously open tab points to an old path, close it and reopen the page from Home. Reload Obsidian if the running plugins still remember their old template or capture paths.
