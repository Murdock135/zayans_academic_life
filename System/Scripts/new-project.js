// QuickAdd: create a complete project from the project blueprint.
const TEMPLATE_PATH = "System/Templates/Project Blueprint";
const WORK_PATH = "Work";

function safeFolderName(input) {
    let name = input.trim()
        .replace(/[<>:"/\\|?*#^[\]\x00-\x1F]/g, "-")
        .replace(/\s+/g, " ")
        .replace(/[. ]+$/g, "");
    if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(name)) name += "-project";
    return name;
}

async function copyFolder(app, source, destination, projectTitle) {
    await app.vault.createFolder(destination);
    for (const child of source.children) {
        const target = `${destination}/${child.name}`;
        if (Array.isArray(child.children)) {
            await copyFolder(app, child, target, projectTitle);
        } else if (child.extension === "md") {
            let content = await app.vault.read(child);
            if (child.name === "Home.md") {
                content = content.replace(/^# Project home$/m, `# ${projectTitle}`);
            }
            await app.vault.create(target, content);
        } else {
            await app.vault.createBinary(target, await app.vault.readBinary(child));
        }
    }
}

module.exports = async ({ app, quickAddApi }) => {
    const entered = await quickAddApi.inputPrompt("Project name");
    if (entered == null || entered.trim() === "") return;

    const title = entered.trim();
    const folderName = safeFolderName(title);
    if (!folderName) throw new Error("Enter a project name containing at least one valid filename character.");

    const destination = `${WORK_PATH}/${folderName}`;
    if (app.vault.getAbstractFileByPath(destination)) {
        throw new Error(`A project already exists at ${destination}.`);
    }

    const template = app.vault.getAbstractFileByPath(TEMPLATE_PATH);
    if (!template || !Array.isArray(template.children)) {
        throw new Error(`Project blueprint not found at ${TEMPLATE_PATH}.`);
    }

    await copyFolder(app, template, destination, title);
    const home = app.vault.getAbstractFileByPath(`${destination}/Home.md`);
    if (!home) throw new Error("The project was created, but its Home.md is missing.");
    await app.workspace.getLeaf(false).openFile(home, {
        state: { mode: "source", source: false }
    });
};

module.exports.safeFolderName = safeFolderName;
