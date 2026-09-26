# Today

---

[[Work/Projects|Projects]] · [[Library/Catalog.base|Library]] · [[Library/Sessions|Sessions]] · [[System/Cheat Sheet|Cheat Sheet]] · [[System/How To Use|Guide]]

## Start-up

- [ ] Open a recent research log
- [ ] Review active project milestones
- [ ] Choose a reading item if useful today

## Ongoing Projects

- Academic
  1. Agentic System for pathogen analysis
  2. Combining Evidence
  3. Code diff analysis
- Athletics
  - Basic workout (3 d/w)
  - Football (2 d/w)

## Currently Reading and watching (courses/playlists)

Books and textbooks you are working through. These do not require a digital session record or a takeaway.

```dataview
TABLE WITHOUT ID file.link AS "Resource", authors AS "Authors", "<span class='reading-progress-wrap'><progress class='reading-progress' max='100' value='" + default(progress, 0) + "'></progress><span>" + default(progress, 0) + "%</span></span>" AS "Progress", position AS "Last position"
FROM "Library/Items"
WHERE econtains(flat(list(status)), "reading") AND (kind = "book" OR kind = "textbook")
SORT file.mtime DESC
LIMIT 5
```

---

## Continue research

```dataview
TABLE WITHOUT ID file.link AS "ID", link(regexreplace(file.folder, "/Research Log(/.*)?$", "") + "/Project.md", regexreplace(regexreplace(file.folder, "/Research Log(/.*)?$", ""), "^.*/", "")) AS "Project", file.mtime AS "Time"
FROM "Work"
WHERE type = "research-log"
SORT file.mtime DESC
LIMIT 6
```

---

## Paper & article reading sessions

```dataview
TABLE WITHOUT ID resource AS "Resource", logged_at AS "When", takeaway AS "Takeaway"
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
