// QuickAdd: create a personal project with Home, Milestones, and an empty Notes folder.
const TEMPLATE_PATH = "System/Templates/Personal Project Blueprint";

function safeFolderName(input) {
    let name = input.trim()
        .replace(/[<>:"/\\|?*#^[\]\x00-\x1F]/g, "-")
        .replace(/\s+/g, " ")
        .replace(/[. ]+$/g, "");
    if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(name)) name += "-project";
    return name;
}

module.exports = async ({ app, quickAddApi }) => {
    const entered = await quickAddApi.inputPrompt("Personal project name");
    if (entered == null || entered.trim() === "") return;
    const title = entered.trim();
    const folderName = safeFolderName(title);
    if (!folderName) throw new Error("Enter a project name containing at least one valid filename character.");
    const destination = `Personal/${folderName}`;
    if (app.vault.getAbstractFileByPath(destination)) {
        throw new Error(`A personal project already exists at ${destination}.`);
    }
    const templates = ["Home.md", "Milestones.md"];
    const contents = [];
    for (const name of templates) {
        const source = app.vault.getAbstractFileByPath(`${TEMPLATE_PATH}/${name}`);
        if (!source) throw new Error(`Personal project template not found: ${name}`);
        contents.push((await app.vault.read(source))
            .replace(/^# Project home$/m, () => `# ${title}`)
            .replaceAll("HOME_FOLDER", () => destination));
    }
    if (!app.vault.getAbstractFileByPath("Personal")) await app.vault.createFolder("Personal");
    await app.vault.createFolder(destination);
    await app.vault.createFolder(`${destination}/Notes`);
    let home;
    for (let i = 0; i < templates.length; i++) {
        const file = await app.vault.create(`${destination}/${templates[i]}`, contents[i]);
        if (i === 0) home = file;
    }
    await app.workspace.getLeaf(false).openFile(home, { state: { mode: "source", source: false } });
};
