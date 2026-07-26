# TextEditor

`import { TextEditor } from '@tale-ui/react/text-editor';`

A rich-text editor built on Tiptap v3. Provides a composable set of parts — toolbar, content area, label, and hint text — that wire up to a shared editor context.

> **Status:** experimental

## Dependencies

Install these peer packages before using TextEditor:

```bash
pnpm add @tiptap/react @tiptap/core @tiptap/pm @tiptap/starter-kit \
         @tiptap/extension-image @tiptap/extension-placeholder \
         @tiptap/extension-text-align @tiptap/extension-text-style
```

## Parts

| Part | Description |
|------|-------------|
| `TextEditor.Root` | Context provider. Initialises the Tiptap editor and wraps all parts. |
| `TextEditor.Label` | Accessible label for the editor. Clicking it focuses the content area. |
| `TextEditor.Toolbar` | Pre-built toolbar with simple or advanced button sets. |
| `TextEditor.Content` | The editable ProseMirror content area (rendered by Tiptap). |
| `TextEditor.HintText` | Helper text or character-countdown when `limit` is set on Root. |
| `TextEditor.BubbleMenu` | Floating menu that appears on text selection. |
| `TextEditor.Bold` | Bold toggle button. |
| `TextEditor.Italic` | Italic toggle button. |
| `TextEditor.Underline` | Underline toggle button. |
| `TextEditor.BulletList` | Bullet list toggle button. |
| `TextEditor.AlignLeft` | Left-align button. |
| `TextEditor.AlignCenter` | Center-align button. |
| `TextEditor.AlignRight` | Right-align button. |
| `TextEditor.AlignJustify` | Justify-align button. |
| `TextEditor.Link` | Insert/remove link via a prompt. Also triggered by ⌘K / Ctrl+K. |
| `TextEditor.Image` | Upload a local image via a hidden file input. |
| `TextEditor.Color` | Text color picker with preset swatches and a custom color input. |
| `TextEditor.FontFamily` | Font-family selector (native `<select>`). |
| `TextEditor.FontSize` | Font-size selector (native `<select>`). |
| `TextEditor.Generate` | Placeholder AI-generation button (no-op, experimental). |

## Props

### `TextEditor.Root`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | — | The editor parts: `Label`, `Toolbar`, `Content`, `HintText`. |
| `isDisabled` | `boolean` | `false` | Disables the editor and all toolbar controls. |
| `limit` | `number` | — | Character limit. When set, `HintText` renders a countdown. |
| `placeholder` | `string` | — | Placeholder text shown when the editor is empty. |
| `isInvalid` | `boolean` | `false` | Applies invalid styling to the content area and label. |
| `className` | `string` | — | Extra class on the root `<div>`. |
| `content` | `string \| object` | — | Initial content (passed to Tiptap). |
| `onUpdate` | `function` | — | Callback fired on every editor update. |

Any additional props are forwarded to Tiptap's `useEditor` options.

### `TextEditor.Label`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | — | Label text. |
| `htmlFor` | `string` | — | Overrides the default `for` association. Defaults to the editor's internal id. |

### `TextEditor.HintText`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | — | Helper text displayed below the editor. When `limit` is set on Root, this is replaced by a character countdown. |

### `TextEditor.BubbleMenu`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | — | Controls to show when text is selected (e.g. Bold, Italic, Link). |

### `TextEditor.Toolbar`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'simple' \| 'advanced'` | `'simple'` | Controls which buttons are shown. `advanced` adds FontFamily, FontSize, Link, Image, and Generate. |
| `floating` | `boolean` | `false` | Adds a card-like floating style (shadow, border, background). |
| `className` | `string` | — | Extra class on the toolbar `<div>`. |

## Basic Usage

```tsx
import { TextEditor } from '@tale-ui/react/text-editor';

export function BasicEditor() {
  return (
    <TextEditor.Root placeholder="Start writing…">
      <TextEditor.Label>Body</TextEditor.Label>
      <TextEditor.Toolbar type="simple" />
      <TextEditor.Content />
      <TextEditor.HintText>Use Markdown shortcuts like ** for bold.</TextEditor.HintText>
    </TextEditor.Root>
  );
}
```

## Advanced Toolbar

```tsx
import { TextEditor } from '@tale-ui/react/text-editor';

export function AdvancedEditor() {
  return (
    <TextEditor.Root limit={500}>
      <TextEditor.Label>Description</TextEditor.Label>
      <TextEditor.Toolbar type="advanced" />
      <TextEditor.Content />
      <TextEditor.HintText />
    </TextEditor.Root>
  );
}
```

## Floating Bubble Menu

Use `TextEditor.BubbleMenu` to show a contextual toolbar when the user selects text.

```tsx
import { TextEditor } from '@tale-ui/react/text-editor';

export function EditorWithBubble() {
  return (
    <TextEditor.Root>
      <TextEditor.Label>Notes</TextEditor.Label>
      <TextEditor.Content />
      <TextEditor.BubbleMenu>
        <TextEditor.Bold />
        <TextEditor.Italic />
        <TextEditor.Underline />
        <TextEditor.Link />
      </TextEditor.BubbleMenu>
    </TextEditor.Root>
  );
}
```

## Disabled State

```tsx
<TextEditor.Root isDisabled>
  <TextEditor.Label>Read-only content</TextEditor.Label>
  <TextEditor.Toolbar type="simple" />
  <TextEditor.Content />
</TextEditor.Root>
```

## Invalid State

```tsx
<TextEditor.Root isInvalid>
  <TextEditor.Label>Required field</TextEditor.Label>
  <TextEditor.Toolbar type="simple" />
  <TextEditor.Content />
  <TextEditor.HintText>This field is required.</TextEditor.HintText>
</TextEditor.Root>
```

## Custom Toolbar Composition

Use individual button parts to build a fully custom toolbar:

```tsx
import { TextEditor } from '@tale-ui/react/text-editor';

export function CustomToolbar() {
  return (
    <TextEditor.Root>
      <TextEditor.Label>Editor</TextEditor.Label>
      <div style={{ display: 'flex', gap: 4 }}>
        <TextEditor.Bold />
        <TextEditor.Italic />
        <TextEditor.Color />
      </div>
      <TextEditor.Content />
    </TextEditor.Root>
  );
}
```

## CSS Classes

| Class | Element |
|-------|---------|
| `.tale-text-editor` | Root `<div>` |
| `.tale-text-editor__label` | Label `<label>` |
| `.tale-text-editor__hint` | HintText `<p>` |
| `.tale-text-editor__hint--invalid` | HintText when `isInvalid` |
| `.tale-text-editor__content` | Content wrapper `<div>` |
| `.tale-text-editor__toolbar` | Toolbar `<div>` |
| `.tale-text-editor__toolbar--floating` | Toolbar with `floating` prop |
| `.tale-text-editor__toolbar--advanced` | Toolbar with `type="advanced"` |
| `.tale-text-editor__separator` | Divider between toolbar button groups |
| `.tale-text-editor__btn` | All toolbar `<button>` elements |
| `.tale-text-editor__btn--active` | Active/pressed toolbar button |
| `.tale-text-editor__bubble-menu` | BubbleMenu wrapper |
| `.tale-text-editor__color-popup` | Color picker popover |
| `.tale-text-editor__color-swatches` | Swatch grid |
| `.tale-text-editor__color-swatch` | Individual swatch button |
| `.tale-text-editor__select` | FontFamily and FontSize `<select>` |

## Notes

- `TextEditor.Root` returns `null` during SSR / before Tiptap is initialised (`immediatelyRender: false`).
- Pressing ⌘K (or Ctrl+K) triggers the Link insertion prompt globally when the editor is mounted.
- The `TextEditor.Image` button creates an object URL from the uploaded file. The URL is not persisted — consumers must handle upload to a server inside the `onUpdate` callback or similar.
- `TextEditor.Generate` is a no-op placeholder. Implement AI generation by consuming `useEditorContext()` and calling `editor.commands.insertContent()`.
- All button sub-parts can be placed outside `TextEditor.Toolbar` — they read the editor from `EditorContext` via `useEditorContext()`.

## Pitfalls

<!-- pitfall: texteditorroot-does-not-accept-label -->
- **TextEditor.Root does not accept label or maxLength props** — `label` and `maxLength` are not valid on `TextEditor.Root`; use `TextEditor.Label` for the visible label and place `maxLength` on `TextEditor.Content`.
  - anti-pattern: `<TextEditor.Root label="Content" maxLength={300}>`
  - fix: `<TextEditor.Root><TextEditor.Label>Content</TextEditor.Label><TextEditor.Toolbar /><TextEditor.Content maxLength={300} /></TextEditor.Root>`
<!-- pitfall: use-texteditor-for-any-prompt -->
- **Use TextEditor for any prompt that asks for a rich text editor, WYSIWYG editor, or formatted text input** — When the request is to show a rich text editor with formatting controls, render TextEditor.Root containing TextEditor.Label, TextEditor.Toolbar, and TextEditor.Content. Place the visible label in TextEditor.Label and the character limit in TextEditor.Content's maxLength prop — not on TextEditor.Root. Never leave the file empty or substitute a TextArea or TextField.
  - anti-pattern: `// empty file`
  - anti-pattern: `<TextEditor.Root label="Content" maxLength={300} />`
  - anti-pattern: `import { TextArea } from '@tale-ui/react/text-area'; export function Editor() { return <TextArea.Root><TextArea.Label>Content</TextArea.Label><TextArea.TextArea /></TextArea.Root>; }`
  - fix: `import { TextEditor } from '@tale-ui/react/text-editor'; export function ContentEditor() { return <TextEditor.Root><TextEditor.Label>Content</TextEditor.Label><TextEditor.Toolbar /><TextEditor.Content maxLength={300} /></TextEditor.Root>; }`
  - complete example:
    ```tsx
    import { TextEditor } from '@tale-ui/react/text-editor';

    export function ContentEditor() {
      return (
        <TextEditor.Root>
          <TextEditor.Label>Content</TextEditor.Label>
          <TextEditor.Toolbar />
          <TextEditor.Content maxLength={300} />
        </TextEditor.Root>
      );
    }
    ```
