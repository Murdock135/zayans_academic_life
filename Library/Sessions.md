# Reading sessions

[[Home|Dashboard]] · [[Library/Catalog.base|Library catalog]] · [[System/Setup/Reading Capture|Capture instructions]]

The 200 most recent reading sessions are kept in Obsidian. Progress is the percentage recorded in `progress_after`; a dash means none was recorded. When **QuickAdd: Log reading** would create session 201, the oldest completed session is appended to [[Library/Reading History.csv]] and moved to Obsidian's trash first.

```dataview
TABLE logged_at AS "When", resource AS "Resource", projects AS "Projects", reading_position AS "Position", choice(progress_after = null, "—", string(progress_after) + "%") AS "Progress", takeaway AS "Takeaway"
FROM "Library/Sessions"
WHERE type = "reading-event"
SORT default(date(logged_at), file.ctime) DESC
LIMIT 200
```
