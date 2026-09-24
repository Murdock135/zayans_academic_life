---
type: research-log-index
---
# Research log

Run **QuickAdd: New research log** from any note in this project. Enter a name; the date and time are added automatically.

```dataview
TABLE WITHOUT ID file.link AS "Entry", default(logged_at, file.ctime) AS "Created"
FROM "Work"
WHERE type = "research-log" AND startswith(file.folder + "/", this.file.folder + "/")
SORT default(date(logged_at), file.ctime) DESC
```
