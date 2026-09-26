const SESSION_FOLDER = "Library/Sessions";
const ARCHIVE_PATH = "Library/Reading History.csv";
const KEEP_COUNT = 200;
const HEADER = "filename,logged_at,resource,projects,position,progress_after,takeaway,notes\n";

function csv(value) {
  const text = value == null
    ? ""
    : Array.isArray(value)
      ? value.map(String).join("; ")
      : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function valueOf(value) {
  if (Array.isArray(value)) return value.map(valueOf);
  if (value && typeof value === "object" && typeof value.path === "string") {
    return value.path;
  }
  return value;
}

async function archiveOverflow(app) {
  const sessions = app.vault.getMarkdownFiles()
    .filter(file => file.parent?.path === SESSION_FOLDER)
    .map(file => {
      const frontmatter = app.metadataCache.getFileCache(file)?.frontmatter ?? {};
      const timestamp = Date.parse(frontmatter.logged_at);
      return {
        file,
        frontmatter,
        time: Number.isFinite(timestamp) ? timestamp : file.stat.ctime,
      };
    })
    .filter(entry => entry.frontmatter.type === "reading-event")
    .sort((a, b) => a.time - b.time);

  const overflow = sessions.slice(0, Math.max(0, sessions.length - (KEEP_COUNT - 1)));
  if (overflow.length === 0) return 0;

  const archiveFile = app.vault.getAbstractFileByPath(ARCHIVE_PATH);
  let existing = archiveFile ? await app.vault.read(archiveFile) : HEADER;
  if (!existing.endsWith("\n")) existing += "\n";

  const rows = [];
  const archivedNames = new Set(existing.split(/\r?\n/).slice(1).map(line => {
    const match = line.match(/^"((?:[^"]|"")*)",/);
    return match ? match[1].replaceAll('""', '"') : "";
  }));
  for (const { file, frontmatter } of overflow) {
    if (archivedNames.has(file.name)) continue;
    const source = await app.vault.read(file);
    const notes = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trim();
    const fields = [
      file.name,
      frontmatter.logged_at,
      valueOf(frontmatter.resource),
      valueOf(frontmatter.projects),
      frontmatter.position,
      frontmatter.progress_after,
      frontmatter.takeaway,
      notes,
    ];
    rows.push(fields.map(csv).join(","));
  }

  const updated = rows.length > 0 ? existing + rows.join("\n") + "\n" : existing;
  if (!archiveFile) await app.vault.create(ARCHIVE_PATH, updated);
  else if (rows.length > 0) await app.vault.modify(archiveFile, updated);

  const saved = await app.vault.read(app.vault.getAbstractFileByPath(ARCHIVE_PATH));
  if (saved !== updated) throw new Error("Reading-history archive verification failed; no sessions were removed.");

  for (const { file } of overflow) {
    await app.fileManager.trashFile(file);
  }
  return overflow.length;
}

module.exports = async ({ app, quickAddApi, obsidian }) => {
  const archived = await archiveOverflow(app);
  await quickAddApi.executeChoice("Create reading event");
  if (archived > 0) {
    new obsidian.Notice(`Archived ${archived} old reading session${archived === 1 ? "" : "s"} to Reading History.csv.`);
  }
};

module.exports.archiveOverflow = archiveOverflow;
