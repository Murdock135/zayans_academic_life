---
type: project
status:
  - active
areas: []
---
# Project home

Research questions:

Index:
- [[HOME_FOLDER/Milestones|Milestones]]
- [[HOME_FOLDER/Scratch/00 Scratch Index|Notes index]]
- [[HOME_FOLDER/Research Log/Research Log Index|Research log index]]

```dataview
TABLE WITHOUT ID link(file.path, regexreplace(file.folder, "^.*/", "")) AS "Papers"
FROM "Work"
WHERE type = "paper" AND project = this.file.link
SORT file.folder ASC
```
