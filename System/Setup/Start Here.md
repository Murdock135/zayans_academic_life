# Start here

See [[System/Vault Map]] for the folder layout. Begin daily work at [[Home]]; this System folder is for setup and reference.

Read [[How To Use]] for the daily workflow, [[System/Setup/Project Structure]] for project internals, and [[System/Setup/Reading Capture]] for the reading-event command.

## Enable the foundation

1. Open this folder as a vault in Obsidian.
2. Under Settings → Community plugins, enable **Tasks**, **Dataview**, **Index Checker**, and **QuickAdd**. Their distributions are included. QuickAdd 2.27.0 requires Obsidian 1.13.0 or newer; see Reading Capture if you use an older app.
3. Open [[Home]]. Empty views are expected until you create projects and reading records. Dataview JavaScript queries must remain enabled for the Projects dashboard’s active-project task filter.
4. Homepage is installed and configured to open Home at startup.

## First use

- Add a clear standalone action to [[Work/Tasks Next|Tasks Next]] and confirm it appears under **Next tasks** on Home.
- Add an ambiguous capture to [[Work/Inbox|Inbox]] and confirm it does not appear as a Home task.
- Copy System/Templates/Project Blueprint to Work/P-ProjectName and customize it. Each project owns its Research Log folder, scratchpads/index, milestone tasks, and attachments.
- Run **QuickAdd: New research log** from a project note; a date-and-time-named entry is created automatically.
- Tick off the startup checklist on [[Home]] each morning. Edit the items there directly whenever the routine needs updating.
- Create a resource in Library/Items using the Resource template; folder placement puts it in the catalog automatically. Set status to reading for Home, or finished when done; finished records remain in the library.
- Run **QuickAdd: Log reading** to create a consistently named event. Add its resource link and optional reading details. Resource progress updates remain manual.
- Run **Index Checker: Check indexes** periodically to find scratchpads missing from their index.

The attachment setting is **In subfolder under current folder → Attachments**. Thus files stay inside their project, with a separate Scratch/Attachments when attaching from scratchpads. It does not relocate existing files.

## Current boundaries

Inbox processing remains manual. Home separately shows up to twelve standalone Tasks Next items and twelve unfinished tasks from active projects. Library sync, sliders, clusters, AI greetings, and external PDF capture are not implemented. See [[System/Setup/Plugin Plan]].

Queries and link resolution have been checked through the running Obsidian app. Research capture has passed a file-creation smoke test. See [[System/Setup/Vault Review]] for the latest findings and remaining checks.

## Rendered pages and editing

Use **Live Preview** to render links, Dataview tables, and Tasks queries while editing. Reading view is optional, not required for these features.

In Settings → Editor, set **Default view for new tabs** to **Editing view**, **Default editing mode** to **Live Preview**, and **Properties in document** to **Visible**.

Existing tabs remember their own editing mode. In a tab showing raw Markdown, open its three-dot menu and turn off **Source mode**, or use the command palette's **Toggle Live Preview/Source mode** command. Ctrl+E switches Reading/Editing views; it does not select which editing mode to use.

In Live Preview, the block containing your cursor may show its source. Click a paragraph outside the query block to see the rendered result. Dataview and Tasks must be enabled.

If settings edited on disk have not taken effect in the running app, select these values in the UI. The workspace file is not manually modified. QuickAdd is configured to open reading events in Live Preview.

## Test the workflows

Run **QuickAdd: Test vault workflows** to test creation, dashboards, the catalog, and task interactions with disposable fixtures. See [[System/Tests/README|Workflow tests]] for terminal commands, coverage, and test reports.
