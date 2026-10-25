
[[Work/Projects|Work]] · [[Personal/Home|Personal]] · [[Library/Catalog.base|Library]] · [[Library/Sessions|Sessions]] · [[System/Cheat Sheet|Cheat Sheet]] · [[System/How To Use|Guide]]

## Start

- [x] Get settled. Get Water. Put phone out of sight  [completion:: 2026-10-23]
- [x] your capacity  [completion:: 2026-10-23]
	- low
	- medium
	- high
- [ ] Check Calendar and Emails. Reply urgent or quick ones.
- [ ] Sync mentally with your [goal-calendar](https://docs.google.com/spreadsheets/d/1Q2_pZfxfxRwTP0ZcygrcS9VHABFGuA0vQcgA8maIX40/edit?usp=drive_link).
- [ ] Choose one work priority. Today I will: **Code up the **
- [ ] Begin before you feel ready. Begin by writing your thoughts freely about the project you're about to work on for a **max of 10m**.

> [!tip] Rules of Thumb
> Capture distractions. Keep a scratchpad for questions, errands and ideas to revisit.

> [!quote] Remember
> He who has a *why* to live for can bear with any *how* - Nietzsche

## Ongoing Projects

- Academic
  1. [[Work/Agentic System For epidemiology/Home| Agentic System for pathogen analysis]]
  2. [[Work/Combination of Evidence in MASs/Home| Combination of evidence in MAS]]
  3. Code diff analysis
- Athletics
  - Basic workout (3 d/w)
  - Football (2 d/w)

## Currently Reading and watching (courses/playlists)

Books and textbooks you are working through. Update `current_page`; percentages are calculated from `total_pages`. Newer linked reading sessions update the resource automatically. A dash means page counts are missing.

```dataview
TABLE WITHOUT ID file.link AS "Resource", authors AS "Authors", choice(progress = null, "—", "<span class='reading-progress-wrap'><progress class='reading-progress' max='100' value='" + progress + "'></progress><span>" + progress + "%</span></span>") AS "Progress", current_page AS "Current page", total_pages AS "Total pages"
FROM "Library/Items"
WHERE econtains(flat(list(status)), "reading") AND (kind = "book" OR kind = "textbook")
SORT file.mtime DESC
LIMIT 5
```

---

## Continue research

```dataview
TABLE WITHOUT ID file.link AS "Entry", link(project_folder + "/Home.md", regexreplace(project_folder, "^.*/", "")) AS "Project", choice(contains(owner_folder, "/Papers/"), link(owner_folder + "/Home.md", regexreplace(owner_folder, "^.*/", "")), "") AS "Paper", file.mtime AS "Time"
FROM "Work"
WHERE type = "research-log"
FLATTEN regexreplace(file.folder, "/Research Log(/.*)?$", "") AS owner_folder
FLATTEN regexreplace(owner_folder, "/Papers/.*$", "") AS project_folder
SORT file.mtime DESC
LIMIT 6
```

---

## Recent reading sessions

Recorded sessions for books, papers, and articles. Percentages are calculated from each session’s `current_page` and the linked resource’s `total_pages`. A dash means page counts or a resource link are missing.

```dataview
TABLE WITHOUT ID resource AS "Resource", logged_at AS "When", current_page AS "Page", choice(typeof(current_page) = "number" AND current_page >= 0 AND typeof(resource.total_pages) = "number" AND resource.total_pages > 0, string(round(min(list(100, current_page / resource.total_pages * 100)), 1)) + "%", "—") AS "Progress", takeaway AS "Takeaway", file.link AS "Session"
FROM "Library/Sessions"
WHERE type = "reading-event"
SORT default(date(logged_at), file.ctime) DESC
LIMIT 6
```

## Next tasks

Clear standalone actions that do not belong to a project appear here. [[Work/Tasks Next|Open the complete list]].

```tasks
not done
path regex matches /^Work\/Tasks Next\.md$/
limit 12
hide toolbar
```
