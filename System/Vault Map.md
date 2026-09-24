# Vault map

[[Home]] · [[System/How To Use|Usage guide]]

The root contains one starting page and four folders. Daily work should rarely require opening System.

```text
Home.md
Work/
  Projects.md                 Project directory
  P-ProjectName/
    Project Name.md           Project overview
    Milestones.md             Milestones and their tasks
    Research Log/             Named, timestamped research entries
      Research Log Index.md    Project entry index
    Scratch/
      Scratch Index.md        Curated scratchpad links
      Attachments/
    Attachments/
Library/
  Catalog.base                Library: All, Reading, and Finished views
  Items/                      One metadata record per resource
  Sessions/                   Timestamped reading events
Daily/
  History.md                  Reading and startup activity history
  Startup/                    Current startup checklists
  Archive/                    Archived startup checklists
System/
  How To Use.md               Daily workflow
  Vault Map.md                This page
  Setup/                      Plugin and configuration instructions
  Scripts/                    QuickAdd research-entry creation
  Templates/
    Project Blueprint/        Copy this whole folder to create a project
    Resource.md               Blank resource record
    Capture/Reading Event.md  QuickAdd capture template
    Startup/Research Morning.md
  Reference/Legacy Templates/ Previous single-file templates, retained for reference
```

The folder shown as P-ProjectName is a convention, not an extra project created during reorganization. Existing project names and contents have been preserved.

## Placement rules

- Start at Home. Its navigation links open the project directory, library, history, or guide.
- Keep all project-specific work beneath its project folder. The project overview and Milestones file are distinct from its research log and exploratory scratchpads.
- Keep shared resources and reading sessions together in Library. Do not copy a resource into every project that uses it.
- Keep dated startup routines in Daily. History is a view across activity, not another copy of the records.
- Use System/Templates for new records and project scaffolding. Legacy single-file templates are outside the active template folder to avoid offering competing creation methods.
- Use a project-local Attachments subfolder; the relative attachment setting is unchanged.

The root was reorganized without rewriting the current workspace. If a previously open tab points to an old path, close it and reopen the page from Home. Reload Obsidian if the running plugins still remember their old template or capture paths.
