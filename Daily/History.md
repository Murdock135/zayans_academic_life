# History

[[Home]] · [[System/Setup/Reading Capture|Log reading]]

This is a retrospective view: what you read and which startup checklists you kept. Home shows recent activity; History lets you look further back. It does not duplicate the files or replace project-owned research logs.

## Reading sessions

```dataview
TABLE logged_at AS "When", resource AS "Resource", projects AS "Projects", takeaway AS "Takeaway"
FROM "Library/Sessions"
WHERE type = "reading-event"
SORT default(date(logged_at), file.ctime) DESC
```
