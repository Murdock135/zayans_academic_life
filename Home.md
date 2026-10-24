
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

Books and textbooks you are working through. Progress and last position use the latest linked session with a recorded value, falling back to the resource record. Session details appear in **Recent reading sessions** below.

```dataview
TABLE WITHOUT ID file.link AS "Resource", authors AS "Authors", "<span class='reading-progress-wrap'><progress class='reading-progress' max='100' value='" + default(last_progress_session.progress_after, default(progress, 0)) + "'></progress><span>" + default(last_progress_session.progress_after, default(progress, 0)) + "%</span></span>" AS "Progress", default(last_position_session.reading_position, reading_position) AS "Last position"
FROM "Library/Items"
WHERE econtains(flat(list(status)), "reading") AND (kind = "book" OR kind = "textbook")
FLATTEN reverse(sort(filter(file.inlinks, (s) => s.type = "reading-event" AND s.reading_position != null AND s.reading_position != ""), (s) => default(date(s.logged_at), s.file.ctime)))[0] AS last_position_session
FLATTEN reverse(sort(filter(file.inlinks, (s) => s.type = "reading-event" AND s.progress_after != null), (s) => default(date(s.logged_at), s.file.ctime)))[0] AS last_progress_session
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

Recorded sessions for books, papers, and articles. Position is where you stopped; progress is the percentage recorded for that session. A dash means no percentage was recorded.

```dataview
TABLE WITHOUT ID resource AS "Resource", logged_at AS "When", reading_position AS "Position", choice(progress_after = null, "—", string(progress_after) + "%") AS "Progress", takeaway AS "Takeaway", file.link AS "Session"
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
