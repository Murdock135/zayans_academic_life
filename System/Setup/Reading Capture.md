# Reading capture

[[Home]] · [[Library]] · [[History]]

QuickAdd is included and configured with a **Log reading** Template choice. It creates a file in `Library/Sessions`, gives it a standardized timestamp name, adds the session properties and timestamp, and opens it for editing. No Bash script is needed for naming.

## Enable and use

1. Enable **QuickAdd** in Settings → Community plugins. The included official release is 2.27.0 and requires Obsidian 1.13.0 or newer, according to its manifest. If your app is older, update Obsidian or install a compatible QuickAdd release and recreate the choice using the settings below.
2. Open the command palette and run **QuickAdd: Log reading**. Alternatively run QuickAdd and select Log reading. You can assign a hotkey in Settings → Hotkeys.
3. In the new event, set `resource` to a wikilink to the catalog item. Add optional position, project links, progress-after, and takeaway through Properties. You do not enter or rename the filename.
4. Return to Home to see the event. Update the resource's overall progress separately if appropriate; this command does not change another file's reading progress.

The name has the form `2026-09-24 143052-123 Reading.md` (local date, time, milliseconds). If the target name already exists, QuickAdd is configured to append a duplicate suffix rather than overwrite it. The event's `logged_at` property includes the timezone offset; Home and History sort by it, with file-creation time as a fallback for older entries.

If recording a past session, edit `logged_at` to when you actually read. The filename can keep its creation timestamp. If you accidentally create an empty event, delete that event through Obsidian.

## Choice settings

| Setting | Value |
| --- | --- |
| Name | Log reading |
| Type | Template |
| Template path | System/Templates/Capture/Reading Event.md |
| Filename format | `{{DATE:YYYY-MM-DD HHmmss-SSS}} Reading` |
| Destination | Library/Sessions |
| Open created file | On |
| View mode | Live Preview |
| Expose as command | On |
| Existing file behavior | Create another file → Append duplicate suffix |

Use the QuickAdd command, not core Insert template, for this capture template: QuickAdd expands its date tokens. The old manual fallback is retained under System/Reference/Legacy Templates; QuickAdd is the normal creation path.

The workflow test suite exercises the real QuickAdd Template choice with a temporary destination, checks two unique events and their timestamps, and verifies Home and History. See [[System/Tests/README|Workflow tests]]. See [QuickAdd Template choices](https://quickadd.obsidian.guide/docs/Choices/TemplateChoice/) and [format syntax](https://quickadd.obsidian.guide/docs/FormatSyntax/).

## If metadata appears as plain text

The lines between `---` are stored properties. They should appear as editable fields in Live Preview. Set Settings → Editor → Default editing mode to **Live Preview** and Properties in document to **Visible**. For an already-open note, use its three-dot menu to turn off **Source mode**. QuickAdd is configured to open new reading events in Live Preview. If configuration was changed while Obsidian was running, reload the app; if an old in-memory setting was saved back over it, choose these settings in the UI. The reading-event body remains blank below Properties, which you can collapse while writing.
