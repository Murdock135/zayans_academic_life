---
type: project
status:
  - active
areas: []
---
# Project

Describe the intended outcome here if useful.

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
WHERE file.path = this.file.folder + "/Scratch/Scratch Index.md"
```

## Research log

```dataview
LIST
FROM "Work"
WHERE file.path = this.file.folder + "/Research Log/Research Log Index.md"
```
