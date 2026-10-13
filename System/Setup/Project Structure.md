# Project and paper structure

[[Work/Projects|Projects]] · [[System/How To Use|Usage guide]]

A project owns a research direction. Each paper owns one manuscript effort within that direction. Projects can also be hobbies or other work without papers.

```text
Work/
  Project Name/
    Home.md
    Milestones.md
    Research Log/
      Research Log Index.md
    Scratch/
      00 Scratch Index.md
      Attachments/
    Attachments/
    Papers/
      Paper Name/
        Home.md
        Milestones.md
        Research Log/
          Research Log Index.md
        Scratch/
          00 Scratch Index.md
          Attachments/
        Attachments/
```

## Where work belongs

Keep shared methods, infrastructure, datasets, broad questions, and early paper ideas at project level. Put manuscript-specific experiments, analysis, drafts, submission tasks, and reviewer responses inside the paper. Give each task or note one owning location and link to it wherever else it is useful.

- **Home.md:** entry point and properties. Project Homes list their papers. Paper Homes link back to the project and hold the research question, contribution, venue, deadline, and live manuscript link.
- **Milestones.md:** outcome headings with tasks beneath them. Project milestones cover shared work; paper milestones cover that manuscript. Checkboxes in dashboard views update these source notes.
- **Research Log/:** separate timestamped session or topic entries, with a blank body and an automatic index. A paper log links to both project and paper.
- **Scratch/:** experiments, derivations, drafts, prompts, and exploratory notes. Link useful notes from the log instead of duplicating their contents.
- **00 Scratch Index.md:** curated wikilinks to that folder’s working notes. Index Checker checks direct Markdown children independently at project and paper level.
- **Attachments/:** the relative attachment setting keeps supporting files beside their owning notes.

Shared reading resources remain in Library/Items, even when several projects or papers use them. Reading events remain in Library/Sessions; their existing `projects` links and archive workflow are unchanged. Link a paper from the event body when useful.

## Create a project

1. Run **QuickAdd: New project** and enter its name.
2. The command copies the Project Blueprint into `Work/Project Name/`, including an empty Papers folder, and opens Home.
3. Set optional `areas` and customize Milestones.md. New projects start with `status: [active]`.

## Create a paper

1. Open any note in the owning project, including an existing paper note.
2. Run **QuickAdd: New paper** and enter a stable short name, such as `SPARQ JAMIA`.
3. The command copies the Paper Blueprint into `Work/Project Name/Papers/Paper Name/`, fills in its parent-project link, and opens Home in Live Preview.
4. Set the question, contribution, publication stage, target venue, optional deadline and manuscript URL. Add milestones as needed.

From outside a project, New paper uses the sole project or asks which project. New projects and papers never overwrite an existing destination folder. Unsafe filename characters are replaced with hyphens. Canceling selection or supplying a blank name creates nothing.

Use the command to create the complete structure; core Templates insertion is for resource notes rather than project or paper blueprints. A paper idea can remain in project Scratch until it becomes a concrete manuscript effort.

## Properties and status

Project Homes use `type: project`, a `status` list, and optional `areas`.

Paper Homes use:

| Property | Meaning |
| --- | --- |
| `type: paper` | Identifies an authored paper workspace |
| `project` | Wikilink to the parent project’s Home; required for the project’s Papers listing |
| `status` | One value: active, paused, completed, or archived |
| `stage` | One value: idea, experiments, drafting, submitted, revision, or published |
| `target_venue` | Intended journal or conference |
| `deadline` | Optional date |
| `manuscript` | URL or wikilink to the editable manuscript |

Status controls work visibility; stage records publication progress. A paper can be paused while drafting or active while submitted. Properties provide suggestions rather than enforcing this vocabulary.

The Projects dashboard shows paper tasks only when both the nearest parent project and the paper are active. Shared project tasks require an active project. Its ordinary task view has a total limit of twelve; its `#next` view is unlimited. Each task group identifies the project and paper, or shared project work.

Tasks Next’s Tagged next tasks view intentionally includes `#next` tasks anywhere else in Work, regardless of project or paper status. Home’s standalone Next tasks section is independent of both statuses.

## Research capture

Run **QuickAdd: New research log** from a paper note to save in that paper’s Research Log, or from a project-level note to save in the project’s Research Log. From outside these folders, select a project or paper destination. Paused work remains available for recording research.

The nearest enclosing project/paper determines the capture destination. The physical folder determines ownership, so keep the paper’s `project` link consistent with its containing project. Every entry has `type: research-log`, a timezone-bearing timestamp, a project link, and optional `related_projects`; paper entries also have a paper link. Home shows recent entries with project and paper identity. See [[System/Setup/Research Capture]].

For work spanning projects or papers, create a note where the work belongs and link to it from the other workspace. Do not maintain duplicate logs or tasks.

## Scratch indexes and fallback

Index Checker is scoped to files named `00 Scratch Index`, with nested mode off. Run **Index Checker: Check indexes**, review missing links, and add them to the relevant Scratch index. Automatic Research Log indexes are excluded. Each paper Scratch folder is checked separately; notes in another paper are not children of this index.

If Index Checker is unavailable, a Scratch index can use this Dataview block to list its direct Markdown children automatically:

```dataview
LIST
FROM "Work"
WHERE file.folder = this.file.folder AND file.path != this.file.path
SORT file.name ASC
```

Copy the block into the Scratch index. This example renders against this documentation folder; its query is relative to whichever note contains it. For a permanent automatic index, rename it to `Scratch Index.md` and update its Home link/query, so Index Checker does not treat the generated list as missing manual links. Curated annotations can remain above the listing.

## Attachments and archiving

The attachment setting is **In subfolder under current folder → Attachments**. Pasting into a paper Scratch note creates an attachment inside that paper’s Scratch/Attachments; a log entry uses its own Research Log/Attachments. Existing attachments are not relocated by this setting.

Task Archiver archives completed tasks under Archived in their current source note. Paper Milestones therefore archive locally with the same settings as project Milestones. Marking a project or paper archived changes its status; it does not move or delete the folder.
