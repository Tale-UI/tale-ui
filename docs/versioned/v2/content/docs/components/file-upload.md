# FileUpload

`import { FileUpload } from '@tale-ui/react/file-upload';`

Drag-and-drop file upload with a drop zone and animated file list. Requires the `motion` peer dependency for list animations.

## Parts

| Part | Description |
|------|-------------|
| `FileUpload.Root` | Outer wrapper — flex column container. |
| `FileUpload.DropZone` | Interactive drop zone with drag-over highlight, click-to-browse, and file validation. |
| `FileUpload.List` | Animated `<ul>` using `motion/react` `AnimatePresence` — wraps list items. |
| `FileUpload.ListItem` | Generic `<li>` for custom list item content. |
| `FileUpload.ListItemProgressBar` | Pre-built list item with a linear progress bar, status text, and delete/retry controls. |
| `FileUpload.ListItemProgressFill` | Pre-built list item with a fill-from-left progress background, status text, and delete/retry controls. |

## Props

### FileUpload.Root

No Tale UI-specific props. Accepts all standard `<div>` HTML attributes.

### FileUpload.DropZone

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hint` | `string` | `'SVG, PNG, JPG or GIF (max. 800×400px)'` | Helper text shown below the upload prompt |
| `isDisabled` | `boolean` | — | Disables drag-and-drop and click-to-browse |
| `accept` | `string` | — | Accepted file types — comma-separated MIME types or extensions (e.g. `"image/*,.pdf"`) |
| `allowsMultiple` | `boolean` | `true` | Allow multiple files |
| `maxSize` | `number` | — | Maximum file size in bytes |
| `onDropFiles` | `(files: FileList) => void` | — | Called with accepted files |
| `onDropUnacceptedFiles` | `(files: FileList) => void` | — | Called with files not matching `accept` |
| `onSizeLimitExceed` | `(files: FileList) => void` | — | Called with files exceeding `maxSize` |

### FileUpload.List

No Tale UI-specific props. Accepts all standard `<ul>` HTML attributes.

### FileUpload.ListItem

No Tale UI-specific props. Accepts all standard `<li>` HTML attributes.

### FileUpload.ListItemProgressBar / FileUpload.ListItemProgressFill

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | required | File name |
| `size` | `number` | required | File size in bytes (displayed as human-readable) |
| `progress` | `number` | required | Upload progress 0–100 |
| `failed` | `boolean` | — | Marks the item as failed |
| `icon` | `ReactNode` | — | Optional file type icon element |
| `onDelete` | `() => void` | — | Called when the delete button is clicked |
| `onRetry` | `() => void` | — | Called when the "Try again" link is clicked |

## Utility

`getReadableFileSize(bytes: number): string` — Returns a human-readable file size (e.g. `"2 MB"`, `"430 KB"`). Also exported from the package.

## Basic Usage

```tsx
import { FileUpload } from '@tale-ui/react/file-upload';
import { useState } from 'react';

function Example() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileUpload.Root>
      <FileUpload.DropZone
        hint="PNG, JPG or PDF (max 5 MB)"
        accept="image/*,.pdf"
        maxSize={5 * 1024 * 1024}
        onDropFiles={(fl) => setFiles((p) => [...p, ...Array.from(fl)])}
      />
      <FileUpload.List>
        {files.map((f, i) => (
          <FileUpload.ListItemProgressBar
            key={`${f.name}-${i}`}
            name={f.name}
            size={f.size}
            progress={100}
            onDelete={() => setFiles((p) => p.filter((_, j) => j !== i))}
          />
        ))}
      </FileUpload.List>
    </FileUpload.Root>
  );
}
```

## Examples

### With Fill Progress Variant

```tsx
<FileUpload.List>
  <FileUpload.ListItemProgressFill
    name="design.fig"
    size={2_400_000}
    progress={65}
    onDelete={() => {}}
  />
  <FileUpload.ListItemProgressFill
    name="assets.zip"
    size={8_100_000}
    progress={100}
    onDelete={() => {}}
  />
</FileUpload.List>
```

### With Custom File Icon

```tsx
{/* Using @untitledui/file-icons */}
import { FileIcon } from '@untitledui/file-icons';

<FileUpload.ListItemProgressBar
  name="report.pdf"
  size={1_200_000}
  progress={45}
  icon={<FileIcon type="pdf" theme="light" className="tale-file-upload-item__icon" />}
  onDelete={() => {}}
/>
```

### Failed State

```tsx
<FileUpload.ListItemProgressBar
  name="large-video.mp4"
  size={500_000_000}
  progress={0}
  failed
  onDelete={() => {}}
  onRetry={() => restartUpload()}
/>
```

## CSS Classes

- `.tale-file-upload` — Root wrapper
- `.tale-file-upload-drop-zone` — Drop zone container
- `.tale-file-upload-drop-zone--drag-over` — Active drag-over state
- `.tale-file-upload-drop-zone--disabled` — Disabled state
- `.tale-file-upload-drop-zone__icon-wrap` — Upload cloud icon container
- `.tale-file-upload-drop-zone__icon` — Upload cloud icon
- `.tale-file-upload-drop-zone__icon--disabled` — Disabled icon opacity
- `.tale-file-upload-drop-zone__body` — Text content area
- `.tale-file-upload-drop-zone__trigger-row` — Row with button + "or drag and drop"
- `.tale-file-upload-drop-zone__input` — Visually hidden `<input type="file">`
- `.tale-file-upload-drop-zone__trigger` — "Click to upload" button
- `.tale-file-upload-drop-zone__or` — "or drag and drop" text
- `.tale-file-upload-drop-zone__hint` — Hint text
- `.tale-file-upload-drop-zone__hint--invalid` — Error-colored hint text
- `.tale-file-upload-list` — List `<ul>`
- `.tale-file-upload-list-item` — Generic list item `<li>`
- `.tale-file-upload-item` — Compound list item base
- `.tale-file-upload-item--bar` — Progress bar variant
- `.tale-file-upload-item--fill` — Fill progress variant
- `.tale-file-upload-item--failed` — Failed state
- `.tale-file-upload-item__icon` — File icon slot
- `.tale-file-upload-item__content` — Content column
- `.tale-file-upload-item__name` — File name text
- `.tale-file-upload-item__meta` — Meta row (size + status)
- `.tale-file-upload-item__size` — Human-readable file size
- `.tale-file-upload-item__meta-sep` — Vertical separator between size and status
- `.tale-file-upload-item__status` — Status icon + label
- `.tale-file-upload-item__status-icon--success` / `--error` / `--uploading` — Status icon colors
- `.tale-file-upload-item__status-label` / `--success` / `--error` — Status label colors
- `.tale-file-upload-item__delete-btn` — Delete button
- `.tale-file-upload-item__delete-icon` — Trash icon
- `.tale-file-upload-item__retry-btn` — "Try again" link button
- `.tale-file-upload-item__progress-track` — Progress bar track
- `.tale-file-upload-item__progress-fill` — Progress bar fill
- `.tale-file-upload-item__fill-bg` — Fill variant background progress layer
- `.tale-file-upload-item__fill-bg--complete` — Hidden when complete
- `.tale-file-upload-item__fill-ring` — Fill variant inner border ring
- `.tale-file-upload-item__fill-ring--failed` — Error ring color

## Notes

- Requires `motion` to be installed: `npm install motion`
- `FileUpload.List` uses `AnimatePresence` from `motion/react` — list items animate in/out automatically.
- `getReadableFileSize` is also available as a named export: `import { getReadableFileSize } from '@tale-ui/react/file-upload'`.

## Pitfalls

<!-- pitfall: use-fileuploaddropzone-capital-z-not -->
- **Use FileUpload.DropZone (capital Z), not FileUpload.Dropzone** — the sub-part uses PascalCase with a capital Z; the lowercase form causes 'Property does not exist' TypeScript errors.
  - anti-pattern: `<FileUpload.Dropzone />`
  - fix: `<FileUpload.DropZone />`
<!-- pitfall: fileupload-props-on-dropzone-not-root -->
- **FileUpload.DropZone does not accept children or any file-filter props — it must be self-closing** — FileUpload.DropZone is typed as DropZoneProps & RefAttributes<HTMLDivElement>. This type includes neither children nor file-filter props like accept, maxSize, or allowsMultiple. Passing children (including a JSX element like <Column>) or any of those filter props causes 'Type ... has no properties in common with type IntrinsicAttributes & DropZoneProps & RefAttributes<HTMLDivElement>' TypeScript errors. Always use FileUpload.DropZone as a self-closing element with no children and no file-filter props.
  - anti-pattern: `<FileUpload.Root accept="image/*,application/pdf" maxSize={5 * 1024 * 1024} allowsMultiple><FileUpload.DropZone>...</FileUpload.DropZone><FileUpload.List /></FileUpload.Root>`
  - anti-pattern: `<FileUpload.Root><FileUpload.DropZone accept="image/*,application/pdf" maxSize={5 * 1024 * 1024} allowsMultiple>...</FileUpload.DropZone><FileUpload.List /></FileUpload.Root>`
  - anti-pattern: `<FileUpload.Root><FileUpload.DropZone><Column gap="s" align="center"><Icon icon={UploadCloud} size="lg" /><Text variant="label">Drag & drop files here</Text></Column></FileUpload.DropZone><FileUpload.List /></FileUpload.Root>`
  - fix: `<FileUpload.Root><FileUpload.DropZone /><FileUpload.List /></FileUpload.Root>`
  - complete example:
    ```tsx
    import { FileUpload } from '@tale-ui/react/file-upload';
    import { Column } from '@tale-ui/react/column';

    export function ImagePdfUploader() {
      return (
        <Column gap="m" style={{ maxWidth: 560 }}>
          <FileUpload.Root>
            <FileUpload.DropZone />
            <FileUpload.List />
          </FileUpload.Root>
        </Column>
      );
    }
    ```
<!-- pitfall: fileuploaddropzone-accept-takes-string -->
- **`FileUpload.DropZone` `accept` takes a comma-separated string, not an array** — passing `accept={['image/*', 'application/pdf']}` causes `Type 'string[]' is not assignable to type 'string'`; use a plain comma-separated string matching the HTML `accept` attribute format instead.
  - anti-pattern: `<FileUpload.DropZone accept={['image/*', 'application/pdf']} />`
  - fix: `<FileUpload.DropZone accept="image/*,application/pdf" />`
<!-- pitfall: use-fileupload-for-any-prompt -->
- **Use FileUpload for any prompt that asks for a file upload area, dropzone uploader, uploaded-file list with progress, or a progress bar for file uploads** — Even when a prompt specifies accepted file types (e.g. images and PDFs), a maximum file size (e.g. 5 MB), a progress bar, or progress tracking, render FileUpload.Root with a self-closing FileUpload.DropZone and FileUpload.List — FileUpload manages file filtering, progress display, and the uploaded-file list internally. The phrase 'progress bar' in a file upload prompt is a direct signal to use FileUpload. Never add accept, maxSize, allowsMultiple, children, or onDropFiles to FileUpload.DropZone, and never attempt to build a custom progress-bar implementation using DropZone, FileTrigger, ProgressBar, or manual state.
  - anti-pattern: `// empty file`
  - anti-pattern: `import { DropZone } from '@tale-ui/react/drop-zone'; export function UploadArea() { return <DropZone />; }`
  - anti-pattern: `import * as React from 'react'; import { FileUpload } from '@tale-ui/react/file-upload'; export function UploadArea() { return <FileUpload.Root><FileUpload.DropZone accept="image/*,application/pdf" maxSize={5 * 1024 * 1024}><Column gap="s"><Text>Drop files here</Text></Column></FileUpload.DropZone><FileUpload.List /></FileUpload.Root>; }`
  - anti-pattern: `import { DropZone } from '@tale-ui/react/drop-zone'; import { ProgressBar } from '@tale-ui/react/progress-bar'; // manually wiring progress state instead of using FileUpload`
  - fix: `import * as React from 'react'; import { FileUpload } from '@tale-ui/react/file-upload'; import { Column } from '@tale-ui/react/column'; export function ImagePdfUploader() { return <Column gap="m" style={{ maxWidth: 560 }}><FileUpload.Root><FileUpload.DropZone /><FileUpload.List /></FileUpload.Root></Column>; }`
  - complete example:
    ```tsx
    import * as React from 'react';
    import { FileUpload } from '@tale-ui/react/file-upload';
    import { Column } from '@tale-ui/react/column';

    export function ImagePdfUploader() {
      return (
        <Column gap="m" style={{ maxWidth: 560 }}>
          <FileUpload.Root>
            <FileUpload.DropZone />
            <FileUpload.List />
          </FileUpload.Root>
        </Column>
      );
    }
    ```
<!-- pitfall: fileuploaddropzone-ondropfiles-receives-filelist -->
- **FileUpload.DropZone does not accept an onDropFiles prop — never add a callback to manually capture dropped files** — FileUpload.DropZone is typed as DropZoneProps (the standard React Aria DropZone interface), which has no onDropFiles callback. Adding onDropFiles causes 'is not assignable to type IntrinsicAttributes & DropZoneProps' TypeScript errors. FileUpload manages its own internal file state; always use FileUpload.DropZone as a self-closing element with no children and use FileUpload.List to display uploaded files — do not wire custom state via onDropFiles.
  - anti-pattern: `<FileUpload.DropZone accept="image/*,application/pdf" maxSize={5 * 1024 * 1024} allowsMultiple onDropFiles={(rawFiles: FileList) => handleFiles(rawFiles)}>`
  - anti-pattern: `<FileUpload.DropZone onDropFiles={(rawFiles: File[]) => handleFiles(rawFiles)} />`
  - fix: `<FileUpload.Root><FileUpload.DropZone /><FileUpload.List /></FileUpload.Root>`
  - complete example:
    ```tsx
    import * as React from 'react';
    import { FileUpload } from '@tale-ui/react/file-upload';
    import { Column } from '@tale-ui/react/column';

    export function ImagePdfUploader() {
      return (
        <Column gap="m" style={{ maxWidth: 560 }}>
          <FileUpload.Root>
            <FileUpload.DropZone />
            <FileUpload.List />
          </FileUpload.Root>
        </Column>
      );
    }
    ```
