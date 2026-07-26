# FileTrigger

`import { FileTrigger } from '@tale-ui/react/file-trigger';`

A headless component that opens the native file picker when its child element is clicked.

## Props

Accepts all React Aria `FileTrigger` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

## Basic Usage

```tsx
import { Button } from '@tale-ui/react/button';
import { useState } from 'react';

function FileUpload() {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <>
      <FileTrigger
        onSelect={(fileList) => {
          if (fileList) {
            setFileName(
              Array.from(fileList)
                .map((f) => f.name)
                .join(', '),
            );
          }
        }}
      >
        <Button>Upload file</Button>
      </FileTrigger>
      {fileName && <p>Selected: {fileName}</p>}
    </>
  );
}
```

## CSS Classes

None -- `FileTrigger` is a headless wrapper that renders no DOM element of its own.

## Pitfalls

<!-- pitfall: file-trigger-no-root -->

- **No `FileTrigger.Root`** — `FileTrigger` is a simple (non-compound) component used directly. There is no namespace structure.
  - anti-pattern: `<FileTrigger.Root>`
  - fix: `<FileTrigger>`
  - complete example:

    ```tsx
    import { FileTrigger } from '@tale-ui/react/file-trigger';
    import { Button } from '@tale-ui/react/button';

    export function Example() {
      return (
        <FileTrigger onSelect={(files) => console.log(files)}>
          <Button>Upload file</Button>
        </FileTrigger>
      );
    }
    ```

<!-- pitfall: file-trigger-onselect-nullable -->

- **onSelect receives FileList | null — always null-check** — The callback may receive `null` (e.g. when the user cancels the dialog). Guard before accessing the list.
  - anti-pattern: `onSelect={(list) => Array.from(list).map(...)}`
  - fix: `onSelect={(list) => { if (list) { Array.from(list).map(...) } }}`

<!-- pitfall: when-displaying-the-selected-filename -->
- **When displaying the selected filename with Text, use color="muted" plus size="s"** — color="secondary" and variant="body-m" do not exist on Text, and size="sm" is invalid because Text size uses single-letter tokens ('xs', 's', 'm', 'l'). When building a FileTrigger with filename display, use gap="s" on any Column or Row wrapper and variant="neutral" on the Button — never gap="sm" or variant="secondary". This applies whether the wrapper is a Column (vertical stack) or a Row (horizontal inline layout). The Row inline layout is particularly error-prone: gap="sm", Button variant="secondary", Text size="sm", and Text color="secondary" are all invalid and must each be fixed.
  - anti-pattern: `<Text size="sm" color="secondary">{fileName}</Text>`
  - anti-pattern: `<Text variant="body-m">{fileName}</Text>`
  - anti-pattern: `<Column gap="sm"><FileTrigger><Button variant="secondary">Upload file</Button></FileTrigger></Column>`
  - anti-pattern: `<Row gap="sm" align="center"><FileTrigger><Button variant="secondary">Upload file</Button></FileTrigger>{filename && <Text size="sm">{filename}</Text>}</Row>`
  - anti-pattern: `<Row gap="sm" align="center"><FileTrigger><Button variant="secondary">Upload file</Button></FileTrigger>{fileName && <Text size="sm" color="secondary">{fileName}</Text>}</Row>`
  - fix: `<Text size="s" color="muted">{fileName}</Text>`
  - fix: `<Column gap="s"><FileTrigger><Button variant="neutral">Upload file</Button></FileTrigger></Column>`
  - fix: `<Row gap="s" align="center"><FileTrigger><Button variant="neutral">Upload file</Button></FileTrigger>{filename && <Text size="s" color="muted">{filename}</Text>}</Row>`
  - complete example:
    ```tsx
    import { useState } from 'react';
    import { FileTrigger } from '@tale-ui/react/file-trigger';
    import { Button } from '@tale-ui/react/button';
    import { Row } from '@tale-ui/react/row';
    import { Text } from '@tale-ui/react/text';

    export function FileUploadButton() {
      const [fileName, setFileName] = useState<string | null>(null);

      return (
        <Row gap="s" align="center">
          <FileTrigger
            onSelect={(files) => {
              if (files && files.length > 0) {
                setFileName(files[0].name);
              }
            }}
          >
            <Button variant="neutral">Upload file</Button>
          </FileTrigger>
          {fileName && (
            <Text size="s" color="muted">
              {fileName}
            </Text>
          )}
        </Row>
      );
    }
    ```

<!-- pitfall: file-trigger-upload-button-uses-neutral-variant -->

- **For FileTrigger upload actions, use `Button variant="neutral"` instead of `variant="secondary"`** — `Button` has no `"secondary"` variant; use `"neutral"` for secondary-action upload buttons.
  - anti-pattern: `<FileTrigger><Button variant="secondary">Upload file</Button></FileTrigger>`
  - fix: `<FileTrigger><Button variant="neutral">Upload file</Button></FileTrigger>`

<!-- pitfall: file-trigger-column-gap-uses-spacing-tokens -->

- **When wrapping FileTrigger in `Column`, use spacing-token gap values** — `gap="sm"` is not a valid `Gap` value; use `gap="s"` instead.
  - anti-pattern: `<Column gap="sm"><FileTrigger><Button>Upload file</Button></FileTrigger></Column>`
  - fix: `<Column gap="s"><FileTrigger><Button>Upload file</Button></FileTrigger></Column>`
<!-- pitfall: file-trigger-no-accept-prop -->
- **FileTrigger has no accept prop — use acceptedFileTypes (a string array) to restrict file types** — FileTrigger does not accept an `accept` string prop like a native `<input type="file">`. Passing `accept="image/*"` causes `Type '{ accept: string; ... }' is not assignable to type 'IntrinsicAttributes & FileTriggerProps'`. Use the `acceptedFileTypes` prop instead, which takes an array of MIME type strings.
  - anti-pattern: `<FileTrigger accept="image/*" onSelect={handleFileSelect}>`
  - anti-pattern: `<FileTrigger accept="image/*,application/pdf" onSelect={handleFileSelect}>`
  - fix: `<FileTrigger acceptedFileTypes={['image/*']} onSelect={handleFileSelect}>`
  - fix: `<FileTrigger acceptedFileTypes={['image/*', 'application/pdf']} onSelect={handleFileSelect}>`
  - complete example:
    ```tsx
    import { FileTrigger } from '@tale-ui/react/file-trigger';
    import { Button } from '@tale-ui/react/button';

    export function AvatarUpload() {
      return (
        <FileTrigger
          acceptedFileTypes={['image/*']}
          onSelect={(files) => {
            if (files && files.length > 0) {
              console.log(files[0]);
            }
          }}
        >
          <Button variant="neutral">Change photo</Button>
        </FileTrigger>
      );
    }
    ```

## Notes

- Wrap a `Button` (or any pressable element) as the child; clicking it opens the native file dialog.
- The `onSelect` callback receives a `FileList` or `null`.
- Supports `acceptedFileTypes`, `allowsMultiple`, and `defaultCamera` props from React Aria.
