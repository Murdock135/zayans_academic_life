# Research capture

[[Home]] · [[System/Setup/Project Structure|Project and paper structure]]

This command is scoped to Work projects and papers. Use a personal project’s Notes folder for learning, designs, and reflections; Personal is not a research-log destination.

1. Open a note inside the Work project or paper whose work you are recording.
2. Run **QuickAdd: New research log** from the command palette. An optional hotkey can be assigned in Settings → Hotkeys.
3. The command creates `Research Log/YYYY-MM-DD HHmmss-SSS.md` inside that workspace and opens a blank body in Live Preview.

Inside a paper, the entry belongs to that paper. Inside the project’s shared notes, it belongs to the project. From Home or another non-project note, choose a destination from the list of Work projects and papers. If there is only one destination, it is selected automatically. Picker labels show full paths so repeated paper names remain distinguishable. Paused work remains available for recording research.

Every entry has `type: research-log`, a `logged_at` timestamp with timezone, a parent-project link, and optional `related_projects`. Paper entries also have a `paper` link. No entry name or body format is required. Existing files are never overwritten; a numeric suffix handles repeated timestamps.

Each Research Log Index lists entries inside its own Research Log folder, newest first. The project’s log index is for shared project sessions; each paper has its own index. Home’s Continue research view shows recent entries across both levels with separate Project and Paper columns. The displayed links and names come from each entry’s owning folder, so older entries work without adding owner properties.

This uses the installed QuickAdd plugin and `System/Scripts/new-research-log.js`. Project and paper blueprints contain Research Log folders and automatic indexes; capture also creates the destination folder if missing.
