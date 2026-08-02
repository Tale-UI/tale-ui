# Tree

`import { Tree } from '@tale-ui/react/tree';`

A hierarchical tree view with expandable/collapsible nodes and optional selection.

## Parts

| Part               | Description                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| `Tree.Root`        | Container. Accepts `aria-label`, `selectionMode`, and `defaultExpandedKeys`.                         |
| `Tree.Item`        | A tree node. Requires `id` and `textValue`. Nest items for sub-trees.                                |
| `Tree.ItemContent` | Renders the visible label content of a tree item. Wraps children in a `div.tale-tree__item-content`. |

## Props

Accepts all React Aria `Tree` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

Use `keyboardNavigationBehavior="tab"` only when tree items contain interactive
controls. The default `"arrow"` behavior remains appropriate for ordinary tree
navigation. React Aria 1.20 also exports upstream `TreeSectionProps` and
`TreeHeaderProps`; Tale UI's current public namespace intentionally remains
`Root`, `Item`, and `ItemContent`.

## Basic Usage

```tsx
<Tree.Root aria-label="Files">
  <Tree.Item id="1" textValue="Documents">
    <Tree.ItemContent>Documents</Tree.ItemContent>
    <Tree.Item id="1.1" textValue="report.pdf">
      <Tree.ItemContent>report.pdf</Tree.ItemContent>
    </Tree.Item>
  </Tree.Item>
  <Tree.Item id="2" textValue="Photos">
    <Tree.ItemContent>Photos</Tree.ItemContent>
  </Tree.Item>
</Tree.Root>
```

## Examples

### Pre-expanded Nodes

```tsx
<Tree.Root aria-label="Files" defaultExpandedKeys={new Set(['1', '2'])}>
  <Tree.Item id="1" textValue="Documents">
    <Tree.ItemContent>Documents</Tree.ItemContent>
    <Tree.Item id="1.1" textValue="report.pdf">
      <Tree.ItemContent>report.pdf</Tree.ItemContent>
    </Tree.Item>
    <Tree.Item id="1.2" textValue="notes.txt">
      <Tree.ItemContent>notes.txt</Tree.ItemContent>
    </Tree.Item>
  </Tree.Item>
  <Tree.Item id="2" textValue="Photos">
    <Tree.ItemContent>Photos</Tree.ItemContent>
    <Tree.Item id="2.1" textValue="vacation.jpg">
      <Tree.ItemContent>vacation.jpg</Tree.ItemContent>
    </Tree.Item>
  </Tree.Item>
</Tree.Root>
```

## CSS Classes

- `.tale-tree` — Root container
- `.tale-tree__item` — Tree node (receives `data-level`, `data-has-child-items`, `data-expanded`, `data-selected`)
- `.tale-tree__item-content` — Content wrapper inside each item (rendered by `Tree.ItemContent`)

## Pitfalls

<!-- pitfall: tree-sub-parts-only -->
<!-- multi-idea-ok -->

- **Sub-parts are Root, Item, and ItemContent only** — there is no `Tree.Node`, `Tree.Header`, or `Tree.ExpandTrigger`.
  - anti-pattern: `<Tree.Node>...</Tree.Node>`
  - fix: `<Tree.Item id="node-1" textValue="Node"><Tree.ItemContent>Node</Tree.ItemContent></Tree.Item>`
  - complete example:

    ```tsx
    import { Tree } from '@tale-ui/react/tree';

    export function Example() {
      return (
        <Tree.Root aria-label="Files">
          <Tree.Item id="src" textValue="src">
            <Tree.ItemContent>src/</Tree.ItemContent>
            <Tree.Item id="app" textValue="App.tsx">
              <Tree.ItemContent>App.tsx</Tree.ItemContent>
            </Tree.Item>
          </Tree.Item>
          <Tree.Item id="pkg" textValue="package.json">
            <Tree.ItemContent>package.json</Tree.ItemContent>
          </Tree.Item>
        </Tree.Root>
      );
    }
    ```

<!-- pitfall: tree-root-requires-aria-label -->
<!-- prose-only -->

- **`Tree.Root` requires `aria-label`** — omitting it leaves the tree without an accessible name.

<!-- pitfall: tree-item-requires-id-and-text-value -->
<!-- multi-idea-ok -->

- **Each `Tree.Item` requires both `id` and `textValue`** — `id` identifies the node, `textValue` provides the screen reader label.
  - anti-pattern: `<Tree.Item><Tree.ItemContent>Node</Tree.ItemContent></Tree.Item>`
  - fix: `<Tree.Item id="node-1" textValue="Node"><Tree.ItemContent>Node</Tree.ItemContent></Tree.Item>`

## Notes

- Nest `Tree.Item` elements inside a parent `Tree.Item` to create a hierarchy.
- Every `Tree.Item` must contain a `Tree.ItemContent` to render its label.
- Items with children automatically show a `▶` chevron that rotates to `▼` when expanded (via CSS `::before` on `.tale-tree__item-content`).
- Indentation is handled by CSS using the `data-level` attribute (levels 1–5).
- Use `defaultExpandedKeys` (a `Set`) to control which nodes start expanded.
- Built on React Aria `Tree`, `TreeItem`, and `TreeItemContent`.
- Items receive `data-hovered` on mouse hover (styled with `--neutral-12` background).
