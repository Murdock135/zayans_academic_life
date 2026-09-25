# Projects

[[Home]] · [[Work/Tasks Next|Tasks Next]] · [[Work/Inbox|Inbox]] · [[System/Setup/Project Structure|Project structure]]

This is the directory of your projects: use it to find, open, or review a project. The actual work stays in each project's folder under `Work`; this page does not store another copy of its tasks or logs.

```dataview
TABLE status AS "Status", areas AS "Areas"
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
