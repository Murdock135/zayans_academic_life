---
type: project
status:
  - active
areas: []
---
# Agentic System For epidemiology

Paper live doc: https://mailmissouri-my.sharepoint.com/:w:/r/personal/qzic2d_umsystem_edu/Documents/Academics/Postgrad/Mizzou/300_research/socioecono_salmonella/paper/sparq_jamia_2026/paper.docx?d=w6e7ca434a3cc43ac980bc3126471ace9&csf=1&web=1&e=vaUHOb

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
