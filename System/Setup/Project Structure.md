# Project structure

[[Projects]] · [[How To Use]]

Each project owns its research log, working scratchpads, milestone tasks, and attachments. The recommended starting structure is:

```text
Work/
  P-ProjectName/
    Project Name.md
    Milestones.md
    Research Log/
      Research Log Index.md
      Entry name — YYYY-MM-DD HHmmss-SSS.md
    Scratch/
      Scratch Index.md
      A Working Idea.md
      Attachments/
    Attachments/
```

## What each part means

- **Project Name.md:** the entry point, project status/areas, and optional outcome. Its Dataview queries show files belonging to its own folder.
- **Milestones.md:** milestone headings with tasks underneath. This keeps tasks attached to outcomes, without maintaining a separate Tasks file or duplicating tasks in the project overview.
- **Research Log/:** separate named, timestamped entries. Research Log Index.md lists the entries newest first. Each entry starts with a blank body; record what helps you resume without a required format.
- **Scratch/:** separate explorations, derivations, drafts, prompts, and experiments. Link useful scratchpads from the log rather than pasting their entire contents into it.
- **Scratch Index.md:** a curated list of those scratchpads, preserving the indexing behavior of the previous vault. Index Checker checks for omitted links. This is a real link index, not only a generated query.
- **Attachments/:** supporting files attached to root-level project documents. Notes inside Scratch use Scratch/Attachments, which is still inside the project.

Library resources remain in the shared catalog because the same paper may serve several projects. Project documents link to those records. Reading events remain in Library/Sessions and can link to several projects.

## Create a project

1. In your file manager, copy the complete `System/Templates/Project Blueprint` folder into `Work` and name the copy `P-ProjectName`. This copies a folder structure, not a single template note. Do not move or edit the master copy for one particular project.
2. Rename the copied `Project.md` to your project's name and change its title. Set one value in the `status` list in Properties. Set optional `areas` in Properties.
3. Replace the example milestone headings and tasks in Milestones.md. Delete unused example tasks.
4. From any note in the project, run **QuickAdd: New research log** and enter a name. The command adds the date and time and opens a blank entry in Research Log/. There is no required daily entry.
5. Create scratchpad files inside Scratch. Add their links to Scratch Index.md and periodically run Index Checker.

For existing projects, add these files as needed rather than replacing their contents. Creating a project through an automated command is a possible later improvement.

## Index Checker

The new vault includes the same Index Checker version as the previous vault, with fresh settings. Enable it in Community plugins. The checker is scoped to files named `Scratch Index`: `Scratch/Scratch Index.md` plays the same role as the previous `_Scratch.md`. Your original vault is unchanged.

Automatic Research Log indexes are excluded; Dataview already lists their entries. The checker is configured for direct Markdown children, with nested mode off, so attachments and deeper folders are not treated as scratchpads in the parent index. Run **Index Checker: Check indexes**, review its indicators, and add missing links using its file/index actions. Curated order and annotations remain yours. See the [plugin documentation](https://github.com/pavloDeshko/obsidian-index-checker).

## Research spanning projects

Create an entry in the project that owns the work and link to it from an entry in the other project. `related_projects` is an optional list of links, not a reason to merge all project logs. Home queries the separate logs and shows recent ones by project folder.

Every project starts with a Research Log folder. Create a new entry for a new session or topic rather than growing one file indefinitely. Each entry has `type: research-log`; Home finds these entries across all projects. Existing logs are preserved as Research Log/Initial Notes.md. See [[System/Setup/Research Capture]] for the creation command.

## Attachment placement

The vault uses Obsidian's **In subfolder under current folder** setting with `Attachments` as the subfolder. An image pasted into `Work/P-Example/Research Log/An Entry.md` goes into `Work/P-Example/Research Log/Attachments`. An image pasted into `Work/P-Example/Scratch/An Idea.md` goes into `Work/P-Example/Scratch/Attachments`.

Thus attachments stay within the project, but there can be more than one Attachments subfolder. A single shared project-root attachment folder for every depth would need additional routing. Existing linked files are not relocated by this setting. Shared library files may remain outside the vault or alongside their catalog records. See [Obsidian attachment settings](https://obsidian.md/help/attachments).

## Project status

Use the `status` list in Properties with exactly one value: `active`, `paused`, `completed`, or `archived`. The list provides suggestions, but does not enforce the documented vocabulary. Home includes tasks only when the list contains `active`.

Resource notes share the same list property but use `saved`, `reading`, `finished`, or `stopped`. Their dashboards accept both list values and older text values. Dataview JavaScript remains enabled for Home's active-project task filter.
