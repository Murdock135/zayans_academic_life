---
type: project
status:
  - active
areas: []
---
# Combination of Evidence in MASs

Research questions:

Index:
- [[Work/Combination of Evidence in MASs/Milestones|Milestones]]
- [[Work/Combination of Evidence in MASs/Scratch/00 Scratch Index|Notes index]]
- [[Work/Combination of Evidence in MASs/Research Log/Research Log Index|Research log index]]

```dataview
TABLE WITHOUT ID link(file.path, regexreplace(file.folder, "^.*/", "")) AS "Papers"
FROM "Work"
WHERE type = "paper" AND project = this.file.link
SORT file.folder ASC
```
