// QuickAdd: create a timestamped entry in the current project's Research Log folder.
module.exports = async ({ app, quickAddApi }) => {
    const projects = app.vault.getMarkdownFiles()
        .filter(file => file.path.startsWith("Work/") &&
            app.metadataCache.getFileCache(file)?.frontmatter?.type === "project")
        .sort((a, b) => b.parent.path.length - a.parent.path.length);
    if (!projects.length) throw new Error("Create a project in Work before adding a research log.");
    const activePath = app.workspace.getActiveFile()?.path;
    let project = projects.find(file => activePath?.startsWith(file.parent.path + "/"));
    if (!project) {
        project = projects.length === 1 ? projects[0] : await quickAddApi.suggester(
            projects.map(file => `${file.basename} (${file.parent.path})`), projects
        );
    }
    if (!project) return;
    const folder = `${project.parent.path}/Research Log`;
    if (!app.vault.getAbstractFileByPath(folder)) await app.vault.createFolder(folder);
    const stamp = quickAddApi.date.now("YYYY-MM-DD HHmmss-SSS");
    const base = `${folder}/${stamp}`;
    let path = `${base}.md`;
    let suffix = 2;
    while (app.vault.getAbstractFileByPath(path)) path = `${base} (${suffix++}).md`;
    const content = [
        "---", "type: research-log",
        `logged_at: ${JSON.stringify(quickAddApi.date.now("YYYY-MM-DDTHH:mm:ssZ"))}`,
        `project: ${JSON.stringify(`[[${project.path.slice(0, -3)}]]`)}`,
        "related_projects: []", "---", "", ""
    ].join("\n");
    const file = await app.vault.create(path, content);
    await app.workspace.getLeaf(false).openFile(file, {
        state: { mode: "source", source: false }
    });
};
