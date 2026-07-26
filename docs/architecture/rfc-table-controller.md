# Table plugin controller RFC

- Status: Approved
- Approved: 2026-07-25 by user confirmation
- Gate: P0-D research and prototype
- Public API impact: None
- Required reviewers: Design Systems, Accessibility, Developer Experience, Performance

## Decision sought

Adopt one scoped Table controller contract that lets independently released
plugins share selection, sorting, pagination, filtering, column, expansion,
grouping, and virtualization state without replacing React Aria semantics.

This RFC does not promote a public API. The selection and sorting controller in
`packages/react/src/table/TableController.experimental.ts` is deliberately
unexported. Approval of this RFC and `ranking.json` is required before the
evidence-ranked top five can enter public component work.

## Preserved inventory

The canonical inventory is `registry/sources/roadmap/table-plugins/inventory.json`:

1. selection;
2. sorting;
3. pagination;
4. filtering;
5. column visibility/settings;
6. column resize;
7. sticky columns;
8. row expansion;
9. grouped/tree rows; and
10. virtualization.

`pnpm roadmap:contracts:check` enforces exact set equality, unique ranks,
record digests, evidence provenance, selection/sorting prototype coverage, and
the exact 1k/10k benchmark matrix in
`test/baselines/roadmap/table-controller.json`.

## Controller contract

One controller instance owns a stable `tableId`, plugin state, a monotonically
increasing query revision, and at most one active async request.

- Row and column identities remain explicit React Aria keys.
- Controlled values are authoritative and callbacks report requested changes.
- Default values initialize controller-owned state.
- Selection and sorting events publish one combined query snapshot.
- A new query aborts the previous request.
- Request IDs are scoped as `<tableId>:<revision>`.
- Async consumers receive an `AbortSignal`, `isCurrent()`, and `accept()`.
  `accept()` refuses commits from cancelled or stale requests.
- Unmount cancels active work.
- `tableId` must be portable, stable across SSR and hydration, and immutable
  for the mounted instance.

The eventual plugin interface must contribute state and root/part props through
this shared controller. A plugin may not create a second selection, sorting,
pagination, filtering, or request-correlation store.

## Client and server behavior

Selection is always expressed as React Aria `Selection`. Sorting is always a
React Aria `SortDescriptor`. Client tables may use the stable local-sort helper.
Server tables publish the same query state and apply results only through the
request context’s stale-result guard.

Pagination and filtering must join the same query snapshot before their public
prototypes begin. Server sorting, filtering, and pagination must never infer
freshness from response order alone.

## Accessibility and React Aria boundary

The controller supplies state props and event handlers to `Table.Root`; React
Aria continues to own keyboard navigation, focus, selection semantics, sort
announcements, row/column relationships, and disabled behavior. Plugins must
not replace those interactions with parallel DOM event systems.

Each public plugin requires keyboard and screen-reader evidence, including
focus retention after client and server updates. Virtualization requires an
explicit accessibility review because unmounted rows change the browsable DOM.

## Migration from the current API

The current direct props remain valid:

```tsx
<Table.Root
  selectedKeys={selectedKeys}
  onSelectionChange={setSelectedKeys}
  sortDescriptor={sortDescriptor}
  onSortChange={setSortDescriptor}
/>
```

A future controller is additive and returns equivalent root props:

```tsx
const controller = useTableController({
  tableId: 'people',
  defaultSelectedKeys: new Set(),
  defaultSortDescriptor: { column: 'name', direction: 'ascending' },
});

<Table.Root {...controller.tableProps} />;
```

No migration can require rewriting `Table.Header`, `Table.Column`,
`Table.Body`, `Table.Row`, or `Table.Cell`.

## Ranking and release gate

`registry/sources/roadmap/table-plugins/ranking.json` establishes the top five from repository
evidence and the roadmap’s 1k/10k requirement. Selection and sorting are
mandatory prototypes but receive no automatic rank bonus. The ranking is
authoritative while its status is `approved`.

Public implementation requires:

1. reviewer approval of every disposition and rank (completed 2026-07-25);
2. review of the captured 1k and 10k baselines;
3. controlled/default, client/server, SSR, cancellation, and stale-result
   fixtures;
4. an A2UI decision and migration story per promoted plugin; and
5. the usual docs, stories, ComponentAudit, golden, registry, and audit sync.

## Current artifact impact

This slice does not change Table props, parts, styles, exports, documentation,
Storybook, ComponentAudit, golden prompts, registry records, or A2UI mappings.
Those artifacts remain unchanged intentionally because the prototype is
private.
