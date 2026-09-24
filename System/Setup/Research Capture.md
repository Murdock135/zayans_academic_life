# Research capture

[[Home]] · [[System/Setup/Project Structure|Project structure]]

1. Open any note inside the project, including a milestone, scratchpad, or earlier log entry.
2. Run **QuickAdd: New research log** from the command palette. You can assign it a hotkey in Settings → Hotkeys.
3. Enter a name. The command creates `Research Log/Your name — YYYY-MM-DD HHmmss-SSS.md` within that project and opens it in Live Preview.

Only the name is required when a project note is open. From Home or another non-project note, the command uses the sole project or offers a project picker if there are several. The nearest project folder determines ownership for nested projects. Paused projects remain available for recording research.

Every entry has `type: research-log`, a `logged_at` timestamp with timezone, a link to its project, and optional `related_projects`. Its body is blank. Filename-invalid characters are replaced with hyphens. Existing files are never overwritten; a numeric suffix handles a duplicate timestamp/name. Cancelling creates no entry.

Research Log Index.md lists the project's entries newest first. Home continues to show recently edited entries across projects. Existing root-level research logs have been moved to Research Log/Initial Notes.md with their content preserved.

This uses the already-installed QuickAdd plugin and `System/Scripts/new-research-log.js`, registered as a Macro choice with one User Script step. New projects copied from the blueprint already contain their Research Log folder and index; the command also creates the folder if it is missing.
