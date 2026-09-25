# Plugin plan

Prefer built-in features and a small set of existing plugins. Add custom code only for demonstrated gaps.

## Foundation

| Need | Reuse | Starter status |
| --- | --- | --- |
| Project tasks under milestone headings | [Tasks](https://publish.obsidian.md/tasks/) | Installed and enabled |
| Recent research and reading history | [Dataview](https://blacksmithgu.github.io/obsidian-dataview/) | Installed and enabled |
| Catalog table | [Bases](https://obsidian.md/help/bases/syntax) | Built-in feature configured |
| Daily startup file | Daily notes + Templates | Built-in features configured; creation on demand |
| Standardized reading events | [QuickAdd](https://quickadd.obsidian.guide/) | Included; Log reading choice configured; requires Obsidian 1.13.0+ |
| Timestamped research entries | Existing QuickAdd user-script macro | New research log command configured and tested |
| Curated scratch indexes | [Index Checker](https://github.com/pavloDeshko/obsidian-index-checker) | Included; `Scratch Index` naming configured; automatic research indexes excluded |
| Project-local attachments | Built-in attachment setting | Configured to `./Attachments` relative to the current file |
| Open dashboard on launch | [Homepage](https://github.com/mirnovov/obsidian-homepage) | Installed and configured to open Home |

## Evaluate only when needed

| Need                        | Candidate                                                                              | Boundary                                                                                                                                      |
| --------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| More automation             | [Templater](https://silentvoid13.github.io/Templater/)                                 | Use after core templates become insufficient; does not itself promise background day-end processing                                           |
| Browser metadata capture    | [Official Web Clipper](https://obsidian.md/help/web-clipper)                           | Existing browser extension; custom capture templates. A gradient reading slider is not established by its documentation                       |
| In-Obsidian PDF reading     | [PDF++](https://github.com/RyotaUshio/obsidian-pdf-plus)                               | May avoid a native companion if reading within Obsidian is acceptable; does not capture arbitrary external reader windows                     |
| Zotero imports              | [Zotero Integration](https://github.com/community-archive/obsidian-zotero-integration) | Evaluate current maintenance/compatibility and dependencies; imports are not a multi-source live catalog                                      |
| Colored progress displays   | [Advanced Progress Bars](https://community.obsidian.md/plugins/advanced-progress-bars) | Already present in original vault; evaluate before writing a renderer. Does not establish draggable milestones or reading-history integration |
| Spatial library exploration | Built-in Canvas, then specialized view candidates                                      | Manual grouping first; automatic semantic clustering remains unverified                                                                       |

## Remaining requirements

See [[System/Setup/Feature Candidates]] for researched options, recommendations, limitations, and trial criteria for each feature.

- Automatic startup archival with stable carry-forward identities.
- Gradient progress controls that create reading events as well as updating current progress.
- Draggable milestone markers with separate automatic and manual-estimate modes.
- Drive, YouTube, Excel, Zotero, and Mendeley ingestion with deduplication and provenance.
- Learning-level suggestions, saved-resource learning paths, and large-library clustering.
- Background-personalized daily greeting.
- External Acrobat/Okular capture if the in-Obsidian PDF workflow is unsuitable.

These are gaps in the evaluated stack, not a claim that no existing plugin can address them. Prototype and assess narrower candidates before building a plugin. Do not begin with two large bespoke plugins.

## Data choice

The reusable-plugin path favors property-only Markdown resource records. No user-authored body is required. Each project owns a Research Log folder and indexed Scratch folder. Related projects can cross-link their log entries. See [[System/Setup/Project Structure]]. Source imports should retain stable external IDs and should never overwrite reading history.
