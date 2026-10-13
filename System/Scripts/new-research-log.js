// QuickAdd: create a timestamped entry in the current project or paper.
module.exports = async ({ app, quickAddApi }) => {
    const files = app.vault.getMarkdownFiles().filter(file => file.path.startsWith("Work/"));
    const type = file => app.metadataCache.getFileCache(file)?.frontmatter?.type;
    const projects = files.filter(file => type(file) === "project")
        .sort((a, b) => b.parent.path.length - a.parent.path.length);
    if (!projects.length) throw new Error("Create a project in Work before adding a research log.");
    const parentProject = file => projects.find(project => file.path.startsWith(project.parent.path + "/"));
    const papers = files.filter(file => type(file) === "paper" && parentProject(file) &&
        file.parent.path.startsWith(parentProject(file).parent.path + "/Papers/"));
    const destinations = [...projects, ...papers].sort((a, b) => b.parent.path.length - a.parent.path.length);
    const activePath = app.workspace.getActiveFile()?.path;
    let owner = destinations.find(file => activePath?.startsWith(file.parent.path + "/"));
    if (!owner) {
        owner = destinations.length === 1 ? destinations[0] : await quickAddApi.suggester(
            destinations.map(file => `${type(file) === "paper" ? "Paper" : "Project"}: ${file.parent.path}`), destinations
        );
    }
    if (!owner) return;
    const paper = type(owner) === "paper" ? owner : null;
    const project = paper ? parentProject(paper) : owner;
    const folder = `${owner.parent.path}/Research Log`;
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
        ...(paper ? [`paper: ${JSON.stringify(`[[${paper.path.slice(0, -3)}]]`)}`] : []),
        "related_projects: []", "---", "", ""
    ].join("\n");
    const file = await app.vault.create(path, content);
    await app.workspace.getLeaf(false).openFile(file, {
        state: { mode: "source", source: false }
    });
};
