# Projects

[[Home]] · [[Work/Tasks Next|Tasks Next]] · [[Work/Inbox|Inbox]] · [[System/Setup/Project Structure|Project structure]]


```dataview
TABLE WITHOUT ID link(file.path, regexreplace(file.folder, "^.*/", "")) AS "Project", status AS "Status", areas AS "Areas"
FROM "Work"
WHERE type = "project"
SORT status ASC, file.name ASC
```


## Active project tasks

```dataviewjs
const pages = dv.pages('"Work"').array();
// The closest project folder owns each note, including nested scratchpads.
const projects = pages.filter(p => p.type === "project")
    .sort((a, b) => b.file.folder.length - a.file.folder.length);
const taskPages = pages.map(page => {
    const project = projects.find(p => page.file.path.startsWith(p.file.folder + "/"));
    const statuses = project ? dv.array(project.status).array() : [];
    return { page, project, active: statuses.includes("active") };
}).filter(({ page, active }) => active && page.file.tasks.some(task => !task.completed));
if (taskPages.length === 0) {
    dv.paragraph("No open tasks from active projects.");
} else {
    const escapeRegex = path => path.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
    const grouped = new Map();
    for (const entry of taskPages) {
        const key = entry.project.file.path;
        grouped.set(key, [...(grouped.get(key) ?? []), entry]);
    }
    let remaining = 12;
    let projectNumber = 1;
    for (const entries of grouped.values()) {
        if (remaining === 0) break;
        const project = entries[0].project;
        const openCount = entries.reduce((count, { page }) =>
            count + page.file.tasks.filter(task => !task.completed).length, 0);
        const limit = Math.min(remaining, openCount);
        const projectName = project.file.folder.split("/").pop();
        dv.header(3, dv.fileLink(project.file.path, false, `${projectNumber}. ${projectName}`));
        const query = [
            "not done",
            "path regex matches /^(?:" + entries.map(({ page }) => escapeRegex(page.file.path)).join("|") + ")$/",
            "group by heading",
            "limit " + limit
        ].join("\n");
        dv.paragraph("```tasks\n" + query + "\n```");
        dv.el("hr", "");
        remaining -= limit;
        projectNumber += 1;
    }
}
```

## Next project tasks

Unfinished tasks tagged `#next` from active projects. This view has no task limit.

```dataviewjs
const pages = dv.pages('"Work"').array();
// The closest project folder owns each note, including nested scratchpads.
const projects = pages.filter(p => p.type === "project")
    .sort((a, b) => b.file.folder.length - a.file.folder.length);
const taskPages = pages.map(page => {
    const project = projects.find(p => page.file.path.startsWith(p.file.folder + "/"));
    const statuses = project ? dv.array(project.status).array() : [];
    return { page, project, active: statuses.includes("active") };
}).filter(({ page, active }) => active && page.file.tasks.some(task => !task.completed && Array.from(task.tags ?? []).includes("#next")));
if (taskPages.length === 0) {
    dv.paragraph("No #next tasks from active projects.");
} else {
    const escapeRegex = path => path.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
    const grouped = new Map();
    for (const entry of taskPages) {
        const key = entry.project.file.path;
        grouped.set(key, [...(grouped.get(key) ?? []), entry]);
    }
    let remaining = Infinity;
    let projectNumber = 1;
    for (const entries of grouped.values()) {
        if (remaining === 0) break;
        const project = entries[0].project;
        const openCount = entries.reduce((count, { page }) =>
            count + page.file.tasks.filter(task => !task.completed && Array.from(task.tags ?? []).includes("#next")).length, 0);
        const limit = Math.min(remaining, openCount);
        const projectName = project.file.folder.split("/").pop();
        dv.header(3, dv.fileLink(project.file.path, false, `${projectNumber}. ${projectName}`));
        const query = [
            "not done",
            "path regex matches /^(?:" + entries.map(({ page }) => escapeRegex(page.file.path)).join("|") + ")$/",
            "tags regex matches /^#next$/",
            "group by folder",
            "group by heading"
        ].join("\n");
        dv.paragraph("```tasks\n" + query + "\n```");
        dv.el("hr", "");
        remaining -= limit;
        projectNumber += 1;
    }
}
```
