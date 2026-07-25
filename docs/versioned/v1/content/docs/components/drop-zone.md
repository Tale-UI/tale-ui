# DropZone

`import { DropZone } from '@tale-ui/react/drop-zone';`

A drag-and-drop target area that accepts files and other draggable content.

## Props

Accepts all React Aria `DropZone` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { useState } from 'react';

function MyDropZone() {
  const [dropped, setDropped] = useState(false);

  return (
    <DropZone onDrop={() => setDropped(true)}>
      <p>{dropped ? 'File dropped!' : 'Drop files here'}</p>
    </DropZone>
  );
}
```

## Examples

### Combined with FileTrigger

```tsx
import { DropZone } from '@tale-ui/react/drop-zone';
import { FileTrigger } from '@tale-ui/react/file-trigger';
import { Button } from '@tale-ui/react/button';
import { useState } from 'react';

function FileUpload() {
  const [files, setFiles] = useState<string[]>([]);

  return (
    <DropZone
      onDrop={(e) => {
        const names = e.items
          .filter((item) => item.kind === 'file')
          .map((item) => ('name' in item ? item.name : 'unknown'));
        setFiles((prev) => [...prev, ...names]);
      }}
    >
      <p>Drop files here or</p>
      <FileTrigger
        onSelect={(fileList) => {
          if (fileList) {
            setFiles((prev) => [...prev, ...Array.from(fileList).map((f) => f.name)]);
          }
        }}
      >
        <Button>Browse files</Button>
      </FileTrigger>
      {files.length > 0 && <p>Files: {files.join(', ')}</p>}
    </DropZone>
  );
}
```

## CSS Classes

- `.tale-drop-zone` — Base element

## Pitfalls

<!-- pitfall: drop-zone-no-sub-parts -->
- **No `DropZone.Content`, `DropZone.Icon`, or `DropZone.Title` sub-parts** — `DropZone` is a simple component. Pass children (text, icons, buttons) directly inside `<DropZone>`.
  - anti-pattern: `<DropZone><DropZone.Icon /><DropZone.Title>Drop files</DropZone.Title></DropZone>`
  - fix: `<DropZone><Icon /><Text>Drop files here</Text></DropZone>`
  - complete example:
    ```tsx
    import { DropZone } from '@tale-ui/react/drop-zone';
    import { FileTrigger } from '@tale-ui/react/file-trigger';
    import { Button } from '@tale-ui/react/button';

    export function Example() {
      return (
        <DropZone onDrop={(e) => console.log('Dropped:', e.items)}>
          <FileTrigger onSelect={(files) => console.log(files)}>
            <Button>Drop files here or click to browse</Button>
          </FileTrigger>
        </DropZone>
      );
    }
    ```

<!-- pitfall: drop-zone-ondrop-not-filelist -->
- **`onDrop` receives a `DropEvent` object, not a `FileList`** — Access dropped files via `e.items.filter(item => item.kind === 'file')`, not as a `FileList`.
  - anti-pattern: `onDrop={(files) => files.forEach(...)}`
  - fix: `onDrop={(e) => e.items.filter(item => item.kind === 'file').forEach(...)}`

<!-- pitfall: drop-zone-file-drop-item-not-file -->
- **Do NOT cast FileDropItem to File** — `FileDropItem` is not a native `File` object. Access `item.name` and call `item.getFile()` (returns a `Promise<File>`) to get the actual file data. Do not use `as File`.
  - anti-pattern: `const file = item as File; console.log(file.size);`
  - fix: `const file = await item.getFile(); console.log(file.size);`
<!-- pitfall: never-import-filedropitem-from-reactariacomponents -->
- **Never import FileDropItem from react-aria-components — use FileUpload instead for upload-with-progress use cases** — `react-aria-components` is not an allowed import prefix; importing `FileDropItem` causes 'Cannot find module' TypeScript errors. Whenever you need file drop + a displayed file list with progress bars, use `FileUpload` from `@tale-ui/react/file-upload` (see FileUpload pitfalls) rather than composing `DropZone` with manual progress state. If you must use `DropZone` directly and need to narrow the item kind, use inline narrowing without a type annotation — never import the type.
  - anti-pattern: `import type { FileDropItem } from 'react-aria-components';`
  - fix: `onDrop={async (e) => { const fileItems = e.items.filter(item => item.kind === 'file'); }}`

<!-- pitfall: drop-zone-browse-button-uses-neutral-variant -->
- **Inside DropZone browse actions, use `Button variant="neutral"` instead of `variant="secondary"`** — there is no `'secondary'` variant on `Button`; for secondary-action browse buttons use `variant="neutral"` instead.
  - anti-pattern: `<Button variant="secondary">or click to browse</Button>`
  - fix: `<Button variant="neutral">or click to browse</Button>`

<!-- pitfall: drop-zone-column-gap-uses-spacing-tokens -->
- **When wrapping DropZone content in `Column`, use spacing-token gap values** — `gap="sm"` is not a valid `Gap` value and causes `Type '"sm"' is not assignable to type 'Gap | undefined'`; use `gap="s"` instead.
  - anti-pattern: `<Column gap="sm"><Text>Drop files here</Text></Column>`
  - fix: `<Column gap="s"><Text>Drop files here</Text></Column>`

## Notes

- This is a simple (non-compound) component exported directly as `DropZone`.
- The `onDrop` handler receives a drop event with an `items` array.
- Use `data-drop-target` attribute for styling the active drop state.
- **Click-to-browse:** nest a `FileTrigger` (wrapping a `Button`) directly inside `DropZone` and React Aria will forward clicks on the entire zone to the file picker automatically — the user does not need to click the button specifically. This is the recommended pattern for file upload zones.
