# Projects

[[Home]] · [[System/Setup/Project Structure|Project structure]]

This is the directory of your projects: use it to find, open, or review a project. The actual work stays in each project's folder under `Work`; this page does not store another copy of its tasks or logs.

```dataview
TABLE status AS "Status", areas AS "Areas"
FROM "Work"
WHERE type = "project"
SORT status ASC, file.name ASC
```

To create a project, follow [[System/Setup/Project Structure]]. Set one value in the `status` list in Properties. Areas are optional labels, and status can be `active`, `paused`, `completed`, or `archived`. All statuses are shown here. Home shows unfinished tasks only from projects whose status includes `active`.
