---
type: project
status:
  - active
areas: []
---
# Agentic System For epidemiology

Paper live doc: https://www.overleaf.com/project/6aa437fad91a9fc91b51c29a

## Project files

```dataview
LIST
FROM "Work"
WHERE file.folder = this.file.folder AND file.path != this.file.path
SORT file.name ASC
```

## Scratch index

```dataview
LIST
FROM "Work"
WHERE file.path = this.file.folder + "/Scratch/00 Scratch Index.md"
```

## Research log

```dataview
LIST
FROM "Work"
WHERE file.path = this.file.folder + "/Research Log/Research Log Index.md"
```
