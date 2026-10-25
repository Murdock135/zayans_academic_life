# Reading sessions

[[Home|Dashboard]] · [[Library/Catalog.base|Library catalog]] · [[System/Setup/Reading Capture|Capture instructions]]

The 200 most recent reading sessions are kept in Obsidian. Progress is calculated from `current_page` and the linked resource’s `total_pages`; a dash means page counts or the resource link are missing. Changing a resource’s total recalculates the session percentages. When **QuickAdd: Log reading** would create session 201, the oldest completed session is appended to [[Library/Reading History.csv]] and moved to Obsidian's trash first.

```dataview
TABLE logged_at AS "When", resource AS "Resource", projects AS "Projects", current_page AS "Page", choice(typeof(current_page) = "number" AND current_page >= 0 AND typeof(resource.total_pages) = "number" AND resource.total_pages > 0, string(round(min(list(100, current_page / resource.total_pages * 100)), 1)) + "%", "—") AS "Progress", takeaway AS "Takeaway"
FROM "Library/Sessions"
WHERE type = "reading-event"
SORT default(date(logged_at), file.ctime) DESC
LIMIT 200
```
