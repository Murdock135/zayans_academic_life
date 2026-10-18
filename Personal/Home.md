# Personal

[[Home|Dashboard]] · [[Personal/Inbox|Inbox]] · [[Personal/Routines/Home|Routines]] · [[Library/Catalog.base|Library]] · [[Work/Tasks Next|Tasks Next]]

Projects for learning, building, and improving everyday life. Run **QuickAdd: New personal project** to start one. Set `areas` on each project's Home to describe the parts of your life it supports.

## Active projects

```dataview
TABLE WITHOUT ID link(file.path, regexreplace(file.folder, "^.*/", "")) AS "Project", areas AS "Areas"
FROM "Personal"
WHERE type = "project" AND econtains(flat(list(status)), "active")
SORT file.folder ASC
```

## Next actions

Unfinished `#next` tasks from active personal projects. Checkboxes update the original notes.

```dataviewjs
const pages = dv.pages('"Personal"').array();
const projects = pages.filter(p => p.type === "project")
    .sort((a, b) => b.file.folder.length - a.file.folder.length);
const escapeRegex = path => path.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
let shown = false;
for (const project of [...projects].sort((a, b) => a.file.folder.localeCompare(b.file.folder))) {
    if (!dv.array(project.status).array().includes("active")) continue;
    const sources = pages.filter(page =>
        projects.find(owner => page.file.path.startsWith(owner.file.folder + "/")) === project &&
        page.file.tasks.some(task => !task.completed && task.status !== "-" &&
            Array.from(task.tags ?? []).includes("#next")));
    if (!sources.length) continue;
    shown = true;
    dv.header(3, dv.fileLink(project.file.path, false, project.file.folder.split("/").pop()));
    dv.paragraph("```tasks\n" + [
        "not done",
        "status.type is not CANCELLED",
        "path regex matches /^(?:" + sources.map(page => escapeRegex(page.file.path)).join("|") + ")$/",
        "tags regex matches /^#next$/",
        "group by heading",
        "hide backlink"
    ].join("\n") + "\n```");
}
if (!shown) dv.paragraph("No next actions from active personal projects.");
```

## All projects

```dataview
TABLE WITHOUT ID link(file.path, regexreplace(file.folder, "^.*/", "")) AS "Project", status AS "Status", areas AS "Areas"
FROM "Personal"
WHERE type = "project"
SORT status ASC, file.folder ASC
```
