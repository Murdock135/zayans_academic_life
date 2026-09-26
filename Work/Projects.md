# Projects

[[Home]] · [[Work/Tasks Next|Tasks Next]] · [[Work/Inbox|Inbox]] · [[System/Setup/Project Structure|Project structure]]

This is the directory of your projects: use it to find, open, or review a project. The actual work stays in each project's folder under `Work`; this page does not store another copy of its tasks or logs.

```dataview
TABLE WITHOUT ID link(file.path, regexreplace(file.folder, "^.*/", "")) AS "Project", status AS "Status", areas AS "Areas"
FROM "Work"
WHERE type = "project"
SORT status ASC, file.name ASC
```

To create a project, follow [[System/Setup/Project Structure]]. Set one value in the `status` list in Properties. Areas are optional labels, and status can be `active`, `paused`, `completed`, or `archived`. All statuses are shown here.

Put clear actions with no project owner in [[Work/Tasks Next|Tasks Next]], and put ambiguous captures in [[Work/Inbox|Inbox]].

Keep project-owned tasks in project milestones. Tasks in Scratch notes under active projects also appear below while the work is being explored.

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
    for (const entries of grouped.values()) {
        if (remaining === 0) break;
        const project = entries[0].project;
        const openCount = entries.reduce((count, { page }) =>
            count + page.file.tasks.filter(task => !task.completed).length, 0);
        const limit = Math.min(remaining, openCount);
        const projectName = project.file.folder.split("/").pop();
        dv.header(3, dv.fileLink(project.file.path, false, projectName));
        const query = [
            "not done",
            "path regex matches /^(?:" + entries.map(({ page }) => escapeRegex(page.file.path)).join("|") + ")$/",
            "group by heading",
            "limit " + limit
        ].join("\n");
        dv.paragraph("```tasks\n" + query + "\n```");
        remaining -= limit;
    }
}
```
