# Table sorting promotion record

- Candidate: sorting
- Approved rank: 1
- Status: Implemented; pending release review
- Public API: `useTableController`, `sortTableRows`
- Import: `@tale-ui/react/table`

## Contract

The stable controller promotes sorting only. It preserves React Aria
`SortDescriptor`, `allowsSorting`, `sortDescriptor`, and `onSortChange`
semantics while adding:

- stable client sorting without source-array mutation;
- controlled and default sorting modes;
- stable `tableId` validation across SSR and hydration;
- monotonic server request IDs;
- abort-on-supersede and abort-on-unmount;
- current-request and single-accept stale response guards; and
- an additive migration path from direct `Table.Root` props.

Selection remains private in the P0-D prototype until its separate rank-two
promotion.

## Migration

Existing code remains valid:

```tsx
<Table.Root sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor} />
```

Controller adoption moves those same React Aria props behind one additive
spread:

```tsx
const controller = useTableController({
  tableId: 'people',
  sortDescriptor,
  onSortChange: setSortDescriptor,
});

<Table.Root {...controller.tableProps} />;
```

No Table part, CSS class, direct prop, or row/column composition changes.

## A2UI decision

Do not add the sorting controller to the A2UI catalog. A serialized catalog
entry cannot safely represent a comparator or server request callback. Existing
`Table`, `TableColumn.allowsSorting`, and selection mappings remain unchanged.
Host-owned A2UI sorting must provide equivalent correlation, cancellation, and
stale-result handling.

## Release evidence

- unit fixtures cover client sorting, controlled/default state, server
  correlation, cancellation, stale and duplicate acceptance, SSR/hydration,
  React Aria semantics, stable ordering, and immutability;
- Storybook and ComponentAudit exercise the public controller;
- component docs cover client/server use and direct-prop migration;
- the golden prompt exercises the public import and composition; and
- 1k/10k public-helper benchmarks are schema checked and replayed in
  `roadmap:check`.
