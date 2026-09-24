# Today

[[Work/Projects|Projects]] · [[Library/Catalog.base|Library]] · [[Daily/History|History]] · [[System/How To Use|Guide]]

## Startup

Run **Daily notes: Open today's daily note** to create or open your checklist.

```dataview
TASK
FROM "Daily/Startup"
WHERE file.name = dateformat(date(today), "yyyy-MM-dd")
```

## Continue research

Each project has a Research Log folder. This view links to the six most recently edited entries. Run **QuickAdd: New research log** to create an entry.

```dataview
TABLE WITHOUT ID file.link AS "Research log", regexreplace(file.folder, "/Research Log(/.*)?$", "") AS "Project folder", file.mtime AS "Last edited"
FROM "Work"
WHERE type = "research-log"
SORT file.mtime DESC
LIMIT 6
```

## Currently reading

```dataview
TABLE WITHOUT ID file.link AS "Resource", authors AS "Authors", progress AS "Progress (%)", position AS "Last position"
FROM "Library/Items"
WHERE econtains(flat(list(status)), "reading")
SORT file.mtime DESC
LIMIT 5
```

Run **QuickAdd: Log reading** to create a session with a standardized filename. See [[System/Setup/Reading Capture]].

## Recent reading

```dataview
TABLE WITHOUT ID file.link AS "Session", resource AS "Resource", logged_at AS "When", takeaway AS "Takeaway"
FROM "Library/Sessions"
WHERE type = "reading-event"
SORT default(date(logged_at), file.ctime) DESC
LIMIT 6
```

## Open project tasks

```dataviewjs
const pages = dv.pages('"Work"').array();
// The closest project folder owns each note, including nested scratchpads.
const projects = pages.filter(p => p.type === "project")
    .sort((a, b) => b.file.folder.length - a.file.folder.length);
const paths = pages.filter(page => {
    const project = projects.find(p => page.file.path.startsWith(p.file.folder + "/"));
    const statuses = project ? dv.array(project.status).array() : [];
    return statuses.includes("active") && page.file.tasks.length > 0;
}).map(page => page.file.path);
if (paths.length === 0) {
    dv.paragraph("No open tasks from active projects.");
} else {
    const escapeRegex = path => path.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
    const query = [
        "not done",
        "path regex matches /^(?:" + paths.map(escapeRegex).join("|") + ")$/",
        "group by folder",
        "group by heading",
        "limit 12"
    ].join("\n");
    dv.paragraph("```tasks\n" + query + "\n```");
}
```
