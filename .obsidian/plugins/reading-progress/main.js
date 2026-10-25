const { Plugin, Notice, parseYaml } = require("obsidian");

/** Calculate a percentage, or null when page counts are missing or invalid. */
function calculateProgress(currentPage, totalPages) {
  if (typeof currentPage !== "number" || !Number.isFinite(currentPage) || currentPage < 0 ||
      typeof totalPages !== "number" || !Number.isFinite(totalPages) || totalPages <= 0) return null;
  return Math.round(Math.min(currentPage / totalPages, 1) * 1000) / 10;
}

/** Read fresh properties so a delayed metadata-cache event cannot undo an edit. */
async function readProperties(app, file) {
  const source = await app.vault.read(file);
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  return match ? parseYaml(match[1]) ?? {} : {};
}

function isResource(file) {
  return file.extension === "md" && file.path.startsWith("Library/Items/");
}

function isSession(file) {
  return file.extension === "md" && file.path.startsWith("Library/Sessions/");
}

/** Resolve a session's resource link relative to the session, including aliases. */
function linkedResource(app, session, resource) {
  if (typeof resource !== "string") return null;
  const target = resource.match(/^\[\[([^\]|#]+)(?:[^\]]*)\]\]$/)?.[1];
  if (!target) return null;
  const file = app.metadataCache.getFirstLinkpathDest(target, session.path);
  return file && isResource(file) ? file : null;
}

/** Refresh stored resource percentages and copy newer session page updates. */
async function synchronize(app) {
  const files = app.vault.getMarkdownFiles();
  const latestSessions = new Map();
  for (const file of files.filter(isSession)) {
    const properties = await readProperties(app, file);
    if (properties.type !== "reading-event" || typeof properties.current_page !== "number" ||
        !Number.isFinite(properties.current_page) || properties.current_page < 0) continue;
    const resource = linkedResource(app, file, properties.resource);
    if (!resource) continue;
    const timestamp = Date.parse(properties.logged_at);
    const time = Number.isFinite(timestamp) ? timestamp : file.stat.ctime;
    const previous = latestSessions.get(resource.path);
    if (!previous || time > previous.time || (time === previous.time && file.path > previous.file.path)) {
      latestSessions.set(resource.path, { file, properties, time });
    }
  }

  for (const file of files.filter(isResource)) {
    const properties = await readProperties(app, file);
    if (properties.kind === "exploration") continue;
    const session = latestSessions.get(file.path);
    // A direct resource edit wins over older session edits, including after restart.
    const useSession = session && session.file.stat.mtime > file.stat.mtime;
    const currentPage = useSession ? session.properties.current_page : properties.current_page;
    const progress = calculateProgress(currentPage, properties.total_pages);
    if (properties.progress === progress && (!useSession || properties.current_page === currentPage)) continue;
    await app.fileManager.processFrontMatter(file, frontmatter => {
      // Recalculate from the properties being written, preserving concurrent edits.
      if (useSession && session.file.stat.mtime > file.stat.mtime) frontmatter.current_page = currentPage;
      frontmatter.progress = calculateProgress(frontmatter.current_page, frontmatter.total_pages);
    });
  }
}

module.exports = class ReadingProgress extends Plugin {
  onload() {
    this.timer = null;
    this.running = false;
    this.pending = false;
    const schedule = file => {
      if (file && !isResource(file) && !isSession(file)) return;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.refresh(), 300);
    };
    for (const event of ["create", "modify", "delete", "rename"]) {
      this.registerEvent(this.app.vault.on(event, schedule));
    }
    this.registerEvent(this.app.metadataCache.on("resolved", () => schedule()));
    this.app.workspace.onLayoutReady(() => this.refresh());
    this.addCommand({ id: "recalculate", name: "Recalculate reading progress", callback: () => this.refresh() });
  }

  async refresh() {
    if (this.running) { this.pending = true; return; }
    this.running = true;
    try {
      do {
        this.pending = false;
        await synchronize(this.app);
      } while (this.pending);
    } catch (error) {
      console.error("Reading progress update failed", error);
      new Notice("Reading progress could not update. Check the developer console.");
    } finally {
      this.running = false;
    }
  }

  onunload() { clearTimeout(this.timer); }
};
module.exports.calculateProgress = calculateProgress;
module.exports.synchronize = synchronize;
