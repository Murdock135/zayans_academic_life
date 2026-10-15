// QuickAdd: create a paper inside the current or selected project.
const TEMPLATE_PATH = "System/Templates/Paper Blueprint";

function safeFolderName(input) {
    let name = input.trim()
        .replace(/[<>:"/\\|?*#^[\]\x00-\x1F]/g, "-")
        .replace(/\s+/g, " ")
        .replace(/[. ]+$/g, "");
    if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(name)) name += "-paper";
    return name;
}

async function copyFolder(app, source, destination, title, project) {
    await app.vault.createFolder(destination);
    for (const child of [...source.children]) {
        const target = `${destination}/${child.name}`;
        if (Array.isArray(child.children)) {
            await copyFolder(app, child, target, title, project);
        } else if (child.extension === "md") {
            let content = await app.vault.read(child);
            if (child.name === "Home.md") {
                content = content.replace(/^# Paper home$/m, () => `# ${title}`)
                    .replaceAll("HOME_FOLDER", () => destination)
                    .replace(/^project: ""$/m, () => `project: ${JSON.stringify(`[[${project.path.slice(0, -3)}]]`)}`)
                    .replace("PARENT_PROJECT_LINK", () => `[[${project.path.slice(0, -3)}|${project.parent.path.split("/").pop()}]]`);
            }
            await app.vault.create(target, content);
        } else {
            await app.vault.createBinary(target, await app.vault.readBinary(child));
        }
    }
}

module.exports = async ({ app, quickAddApi }) => {
    const projects = app.vault.getMarkdownFiles()
        .filter(file => file.path.startsWith("Work/") &&
            app.metadataCache.getFileCache(file)?.frontmatter?.type === "project")
        .sort((a, b) => b.parent.path.length - a.parent.path.length);
    if (!projects.length) throw new Error("Create a project in Work before adding a paper.");
    const activePath = app.workspace.getActiveFile()?.path;
    let project = projects.find(file => activePath?.startsWith(file.parent.path + "/"));
    if (!project) {
        project = projects.length === 1 ? projects[0] : await quickAddApi.suggester(
            projects.map(file => file.parent.path), projects
        );
    }
    if (!project) return;
    const entered = await quickAddApi.inputPrompt("Paper name");
    if (entered == null || entered.trim() === "") return;
    const title = entered.trim();
    const folderName = safeFolderName(title);
    if (!folderName) throw new Error("Enter a paper name containing at least one valid filename character.");
    const papersFolder = `${project.parent.path}/Papers`;
    const destination = `${papersFolder}/${folderName}`;
    if (app.vault.getAbstractFileByPath(destination)) throw new Error(`A paper already exists at ${destination}.`);
    const template = app.vault.getAbstractFileByPath(TEMPLATE_PATH);
    if (!template || !Array.isArray(template.children) ||
        !app.vault.getAbstractFileByPath(`${TEMPLATE_PATH}/Home.md`)) {
        throw new Error(`Paper blueprint not found at ${TEMPLATE_PATH}.`);
    }
    if (!app.vault.getAbstractFileByPath(papersFolder)) await app.vault.createFolder(papersFolder);
    await copyFolder(app, template, destination, title, project);
    const home = app.vault.getAbstractFileByPath(`${destination}/Home.md`);
    if (!home) throw new Error("The paper was created, but its Home.md is missing.");
    await app.workspace.getLeaf(false).openFile(home, { state: { mode: "source", source: false } });
};

module.exports.safeFolderName = safeFolderName;
