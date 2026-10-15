---
type: project
status:
  - active
areas: []
---
# Agentic System For epidemiology

Research questions:

Index:
- [[Work/Agentic System For epidemiology/Milestones|Milestones]]
- [[Work/Agentic System For epidemiology/Scratch/00 Scratch Index|Notes index]]
- [[Work/Agentic System For epidemiology/Research Log/Research Log Index|Research log index]]

```dataview
TABLE WITHOUT ID link(file.path, regexreplace(file.folder, "^.*/", "")) AS "Papers"
FROM "Work"
WHERE type = "paper" AND project = this.file.link
SORT file.folder ASC
```
