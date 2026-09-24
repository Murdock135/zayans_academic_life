# Feature candidates

[[System/Setup/Plugin Plan|Plugin plan]] · [[Home]]

Research shortlist, 2026-09-24. These are candidates to evaluate, not newly installed features. Documentation establishes the capabilities described below; the proposed combinations have not been tested in this vault. Recommendations favor plugins already present and small additions over another large custom system.

## Recommended first trials

| Requirement | Try first | Work still needed |
| --- | --- | --- |
| Startup archival and unfinished actions | Existing Tasks + QuickAdd macro | Small archive script; persistent tasks remain in their project files |
| Reading slider and event capture | Meta Bind + existing QuickAdd | Gradient styling and a save macro that coordinates event creation and progress update |
| Project progress | Trial Task Genius for calculated progress; Meta Bind for a separate estimate | Exact draggable milestone track remains a custom-UI candidate |
| Multi-source library | Zotero/API and CSV pilot; compare local importer against self-hosted n8n | Source mapping, deduplication, refresh logic, and provenance |
| Learning paths and clusters | Bases + Canvas + QuickAdd AI; compare Smart Connections for related resources | Level review, prerequisite validation, and large-library performance testing |
| Daily greeting | Existing QuickAdd AI Assistant | Profile prompt, daily cache, dashboard embed, fallback |
| PDF capture | PDF++ + QuickAdd if reading inside Obsidian is acceptable | External Acrobat/Okular adapters otherwise |

Effort below refers to integration work, not simply installing the plugin. “Custom” identifies proposed code, not an existing product.

## 1. Startup archival and unfinished actions

### A — Tasks + QuickAdd archive macro — recommended

Keep persistent actions in their original project milestone files and display them with Tasks queries. They remain the same tasks across days without needing copies or new identities. A QuickAdd macro would create/open today's startup list and move older lists from Daily/Startup to Daily/Archive. A separate Finish startup action can archive today's completed list.

**Existing capability:** Tasks query views update source checkboxes; QuickAdd macros can run user scripts. **Custom gap:** date-aware archival, collision handling, and retry-safe behavior. This proposes keeping persistent actions separate from daily routines, rather than duplicating unfinished checkboxes into each new file. If every unchecked routine must carry forward, that needs its own explicit identity/rules.

Effort: small to medium. Automatic execution at startup or day change requires an additional trigger; a macro alone is not a background scheduler. Nothing runs while Obsidian is closed unless an external scheduler is introduced.

Sources: [Tasks](https://publish.obsidian.md/tasks/), [QuickAdd macros](https://quickadd.obsidian.guide/docs/Choices/MacroChoice/).

### B — Rollover Daily Todos + an archive action

[Rollover Daily Todos](https://github.com/lumoe/obsidian-rollover-daily-todos) is directly aimed at moving unfinished daily todos forward. It is a closer fit if you want pending checkboxes to live in daily files themselves.

**Gap:** rollover is not proof of stable cross-day task identity, retry safety, or whole-file archival. Test repeated execution, nested tasks, missed days, and current plugin compatibility before adopting. It may duplicate the role already served by project Tasks queries.

Effort: small to evaluate; medium if archival and reconciliation must be added.

**Trial:** create two dates with recurring prompts and one persistent action; reopen today's list twice. Expect one current action, an intact historical checklist, and no duplicate files.

## 2. Reading progress and reading events

### A — Meta Bind + QuickAdd — recommended

[Meta Bind sliders](https://www.moritzjung.dev/obsidian-meta-bind-plugin-docs/reference/inputfields/slider/) can edit a numeric property, and [buttons](https://www.moritzjung.dev/obsidian-meta-bind-plugin-docs/guides/buttons/) can run commands or scripts. Use a 0–100 control and a Save reading action that calls a QuickAdd macro.

**Proposed integration:** keep the slider value as a draft until Save. The macro creates one timestamped event under Library/Sessions, records the resource link and optional takeaway, then updates the resource's current progress. Add scoped CSS for a color gradient, a numeric label, and keyboard usability.

**Gap:** Meta Bind plus the current QuickAdd template does not automatically provide this combined transaction. Avoid logging every slider movement. The macro needs a stable event ID and recovery handling so retrying after a partial write does not duplicate a session or lose a progress update.

Effort: medium; one new plugin plus styling and a small macro. An excerpt can be logged without changing overall progress.

### B — Advanced Progress Bars + QuickAdd

[Advanced Progress Bars](https://community.obsidian.md/plugins/advanced-progress-bars) supplies colored progress displays and is already used in the original vault. Pair it with a QuickAdd form that asks for progress and creates an event.

**Gap:** treat this as a display-oriented fallback. An interactive gradient slider and linked event/resource updates are not established by its documentation; the save workflow still needs integration.

Effort: small for a display, medium for coordinated capture.

**Trial:** save 35% with a takeaway, reload, and confirm both the resource and exactly one event agree. Then log an excerpt without changing 35%.

## 3. Project progress and draggable milestones

### A — Task Genius + Meta Bind estimate — first existing-plugin trial

[Task Genius progress bars](https://taskgenius.md/docs/progress-bars) derive progress from completed tasks beneath parent items or headings. This is relevant to the current Milestones.md structure. Use Meta Bind for a separate numeric manual estimate if needed.

**Gap:** this is not the requested single track with draggable milestone boundaries. The exact automatic/manual switching behavior and weighted milestones need verification or integration. Task Genius overlaps with the installed Tasks plugin; trial only the needed progress features and check checkbox/status compatibility before enabling broader task-management features.

Effort: medium. Avoid introducing two competing sources of task completion.

### B — Small dedicated milestone view — custom candidate

Build only the visual track: draggable milestone boundaries, a current-position handle, and an explicit Automatic/Manual estimate switch. Continue to store real tasks as ordinary checkboxes in Milestones.md and give milestones stable IDs.

This is the closest fit to the exact interaction requested, but it has the highest development cost. Moving a handle must not silently complete tasks. Changing milestone weights must recalculate the estimate visibly.

Effort: large relative to the other candidates. Defer until A has been tried; a standard calculated bar may be sufficient.

**Trial:** complete a task and observe automatic progress; set a manual estimate and confirm checkboxes remain unchanged. If draggable boundaries are still important, use that result to specify B.

## 4. Multi-source library imports and refresh

### A — Local importer with existing source APIs — recommended starting scope

Build a small importer that emits the current property-only records into Library/Items. Start with a CSV export from Excel and a small Zotero collection. Reuse bibliographic IDs and source metadata; do not require a new note-writing workflow.

| Source | Candidate access method | Important boundary |
| --- | --- | --- |
| Drive | [Drive change API](https://developers.google.com/workspace/drive/api/guides/manage-changes) | Track selected-folder membership, moved files, and saved cursors |
| YouTube | [Playlist items API](https://developers.google.com/youtube/v3/docs/playlistItems/list) | Poll chosen playlists; imports need pagination and quota handling |
| Excel | CSV export first | A local workbook needs a file importer/watcher; CSV export is not live sync |
| Zotero | [Incremental API](https://www.zotero.org/support/dev/web_api/v3/syncing) | Preserve stable item keys; update only changed records |
| Mendeley | [Registered API client](https://dev.mendeley.com/reference/topics/application_registration.html) or exports | Verify usable authentication first; an export fallback is not continuous sync |

**Existing-plugin alternative within this route:** [Zotero Integration](https://github.com/community-archive/obsidian-zotero-integration) can import bibliographic material and annotations. Verify its maintained version and dependencies before adopting it. Its import capability does not establish five-source synchronization or compatibility with our exact resource schema.

**Gap:** the importer itself is custom. Maintain source IDs and field origins, protect user corrections, reconcile duplicate matches, and retain events when a source disappears. Exact DOI matches can connect source records; fuzzy title matches need review. Distinguish editions and preprint/published versions. Zotero also offers [duplicate detection](https://www.zotero.org/support/duplicate_detection), but it is not a general cross-source merger for this vault.

Effort: medium for a CSV/Zotero pilot; large for all five continuously updating sources. A Python importer is more suitable than Bash for spreadsheet parsing and structured metadata.

### B — Self-hosted n8n workflows + a catalog writer

Use existing [Drive](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googledrive/), [YouTube](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.youtube/), and [Excel/OneDrive](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.microsoftexcel/) integrations, plus HTTP/API calls where needed. A final writer maps records into the vault's schema.

**Gap:** authentication, deduplication, provenance, and conflict handling remain workflow logic. The Excel cloud connector is not a local .xlsx watcher. Local vault writes require self-hosted access to that directory; n8n's [file node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.readwritefile/) is not a way for n8n Cloud to access your laptop's filesystem.

Effort: medium to large, with another service to operate. Prefer this if visual automation is useful for other work too; otherwise the local importer may be simpler to maintain.

**Trial:** import 20 mixed records including intentional overlap, rerun unchanged inputs, then change and remove a source entry. Require stable resource identities, no duplicated sessions, and a reconciliation report.

## 5. Learning levels, learning paths, and visual groups

### A — Bases + Canvas + QuickAdd AI — recommended initial approach

Use the existing catalog for reviewed topic/level fields, [Canvas](https://obsidian.md/help/plugins) for a small visual learning map, and [QuickAdd AI](https://quickadd.obsidian.guide/docs/AIAssistant/) to propose a sequence from selected catalog resources. This is a proposed workflow, not a turnkey learning-path feature.

The model must receive the selected resource IDs and return only those IDs, with a reason for each step. Keep level specific to a topic and the user's prior knowledge. “Unknown” and “missing prerequisite resource” must be valid answers. Confirm suggestions before storing them as reviewed classifications.

**Gap:** prompt design, evidence extraction, output validation, and linking results back into the catalog. Metadata-only records may lack enough information to judge difficulty; titles alone are weak evidence. Canvas provides manual arrangement, not automatic semantic clustering or guaranteed large-library performance.

Effort: small for a manually curated map; medium for validated AI suggestions.

### B — Smart Connections for related resources; ExcaliBrain for explicit relationships

[Smart Connections](https://smartconnections.app/docs/connections/) is a candidate for finding semantically related resource records. Its [feature guide](https://smartconnections.app/smart-connections/list-feature/) distinguishes related-note lists from the Smart Graph offering for topic neighborhoods. Verify the exact edition, dependencies, and indexing behavior before choosing a graph product.

[ExcaliBrain](https://community.obsidian.md/plugins/excalibrain) is an alternative for exploring explicitly modeled relationships. It is more relevant to confirmed prerequisite links than to inferring difficulty automatically; check its dependency requirements before adding it.

**Gap:** relatedness is not a prerequisite and does not establish introductory level. Neither candidate establishes the full requested learning advisor. Sparse catalog records and external PDFs that are not indexed limit semantic results. Test on a subset before indexing the entire library; a large, responsive cluster view remains a separate acceptance requirement.

Effort: medium for an evaluation, potentially large for the complete advisor.

**Trial:** use one topic with 15 saved resources of mixed difficulty. Require a path using only those resources, a visible explanation, explicit gaps, and editable classifications. Then benchmark representative larger collections.

## 6. Personalized daily greeting

### A — QuickAdd AI Assistant — recommended

Use [QuickAdd AI Assistant](https://quickadd.obsidian.guide/docs/AIAssistant/) with a brief user profile and a voice preference such as literary, plainspoken, or playful. Save one generated greeting per local date and display today's result on Home.

**Gap:** a macro must cache by date, provide an offline fallback, and trigger during startup. QuickAdd does not automatically infer the user's background or create this greeting workflow. AI features in this vault are currently configured as disabled; evaluating this option requires intentionally configuring a provider and enabling the relevant feature. Provider use may incur cost.

Effort: small to medium; no additional plugin if QuickAdd's AI workflow suffices. Store profile/prompt configuration under System; keep daily output alongside daily activity. Do not send unrelated project contents for a greeting.

### B — Text Generator + a greeting template

[Text Generator](https://github.com/nhaouari/obsidian-textgenerator-plugin) supports configurable prompts, a template engine, and multiple AI providers. It is an alternative if you expect broader generation workflows beyond a daily message.

**Gap:** daily scheduling/caching and dashboard insertion remain integration work. It adds a plugin whose role overlaps QuickAdd's AI feature.

Effort: small to medium. A rotating collection of user-approved messages is a useful offline fallback, but is not AI generation.

**Trial:** open Home three times on the same date and expect one generation, the requested voice, and a usable fallback when the provider is unavailable.

## 7. PDF reading capture

### A — PDF++ + QuickAdd — first trial if willing to read inside Obsidian

[PDF++](https://github.com/RyotaUshio/obsidian-pdf-plus) extends Obsidian's PDF reading/annotation and linking workflow. Pair a document/page reference with the reading-event capture workflow above.

**Gap:** this does not capture an external Acrobat or Okular window. Automatic page-to-event transfer needs a tested command/API integration; metadata extraction and the event's link to a catalog resource also need handling. The fallback is manual page entry in the existing QuickAdd-created event.

Effort: small to evaluate, medium for streamlined capture. This changes the reading application, so it is an alternative rather than a claim to meet external-window capture.

### B — Acrobat adapter + host-OS hotkey — custom candidate

The [Acrobat SDK](https://opensource.adobe.com/dc-acrobat-sdk-docs/acrobatsdk/) includes interapplication communication and JavaScript integration. A Windows helper could use supported interfaces to identify the document/page, then present a reading form and write an event into Library/Sessions.

**Gap:** test the installed Acrobat edition and available interfaces first. [Reader exposes more limited APIs](https://opensource.adobe.com/dc-acrobat-sdk-docs/library/overview/index.html), so do not assume a technique working in full Acrobat works in free Reader. Resolving author/date still requires PDF metadata or bibliographic lookup. A generic window title is not reliable document identity.

Effort: medium to large; not an existing Obsidian plugin identified in this research.

### C — Okular D-Bus adapter + desktop shortcut — custom candidate

Investigate Okular's D-Bus interface, whose presence is visible in the [upstream shell source](https://raw.githubusercontent.com/KDE/okular/master/shell/shell.h). A Linux desktop shortcut could invoke a helper and open the same reading form.

**Gap:** this evidence establishes an interface, not reliable active-tab file/page capture. Inspect the installed build's exposed methods and test multiple windows/tabs before promising extraction. A Windows Okular install cannot be assumed to have the same Linux session-bus behavior. The helper must run where the reader runs, not merely in WSL.

Effort: medium to large. For either external adapter, file selection plus manual page input remains the reliable fallback. Prefer an explicit hotkey over recording activity whenever a window receives a click.

**Trial:** with two PDFs open, the hotkey must identify the intended file/page and let the user confirm it. Missing metadata must remain editable rather than guessed. Saving must create exactly one correctly linked reading event.

## Evaluation order

1. Meta Bind + QuickAdd reading save: closes a frequent daily interaction gap.
2. Startup archive macro using existing Tasks and QuickAdd.
3. CSV/Zotero import pilot with duplicate reconciliation.
4. PDF++ or one external-reader feasibility test, according to reading preference.
5. Task Genius progress trial before deciding whether a custom milestone track is worth building.
6. QuickAdd greeting workflow.
7. Learning classification and cluster exploration after the catalog contains representative data.

No candidate is selected for installation by this document alone. Each trial should answer the stated practical question before adding more plugins.
