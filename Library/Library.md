# Library

[[Home]] · [[How To Use#Add a reading resource|Add a resource]] · [[System/Setup/Reading Capture|Log a reading session]]

This page is the **catalog view**. `Library/Items/` stores one metadata record per book, paper, article, video, or course. [[System/Templates/Resource]] is the blank form used to create one such record. The view, stored records, and template serve different purposes; they are not three copies of your library.

A resource record stores title, author, source link, reading status, and current progress. It does not require a prose note or a local copy of the PDF. A reading event records one occasion on which you read that resource; many events can point to the same resource.

![[Library/Catalog.base]]

## Finished items

Set the item's `status` to `finished` and its `finished_on` date. Set `progress` to 100 only if you actually completed the whole resource; finishing the portion you needed can leave progress below 100. Optionally log a final reading session.

The item leaves Home's Currently reading section, stays in this catalog, and keeps every reading event and project link. Do not move or delete it. If you return to it, set status back to `reading`, clear `finished_on` for the new active period if appropriate, and keep the previous reading events. Use `stopped` for material you set aside rather than consider finished.

```dataview
TABLE finished_on AS "Finished", progress AS "Coverage (%)"
FROM "Library/Items"
WHERE type = "resource" AND econtains(flat(list(status)), "finished")
SORT finished_on DESC
```

Automatic imports, duplicate reconciliation, and topic clusters are not installed yet.
