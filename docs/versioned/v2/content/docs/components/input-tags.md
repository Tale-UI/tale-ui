# InputTags

A field for entering and managing a list of tag chips. Press **Enter** to add a tag, click the remove button or press **Backspace** (when the cursor is at the start of the input) to remove the last tag.

## Import

```tsx
import { InputTags } from '@tale-ui/react/input-tags';
```

## Parts

| Part             | Element | Description                                                                                 |
| ---------------- | ------- | ------------------------------------------------------------------------------------------- |
| `InputTags.Root` | `div`   | Outer container. Manages tag state and renders the label, field, tag list, and description. |

## Props

### `InputTags.Root`

| Prop              | Type                         | Default    | Description                                                       |
| ----------------- | ---------------------------- | ---------- | ----------------------------------------------------------------- |
| `tagPlacement`    | `'inline' \| 'below'`        | `'inline'` | Where to render tag chips — inside the field area or below it.    |
| `size`            | `'sm' \| 'md' \| 'lg'`       | `'md'`     | Size variant.                                                     |
| `label`           | `ReactNode`                  | —          | Label text displayed above the field.                             |
| `placeholder`     | `string`                     | —          | Placeholder text for the text input.                              |
| `description`     | `ReactNode`                  | —          | Helper text displayed below the field.                            |
| `errorMessage`    | `ReactNode`                  | —          | Error message shown when `isInvalid` is true.                     |
| `isRequired`      | `boolean`                    | —          | Adds a visual asterisk to the label.                              |
| `isDisabled`      | `boolean`                    | —          | Disables the field and all tags.                                  |
| `isInvalid`       | `boolean`                    | —          | Applies error styling and shows `errorMessage`.                   |
| `value`           | `string[]`                   | —          | Controlled tag list.                                              |
| `defaultValue`    | `string[]`                   | —          | Initial tags for uncontrolled mode.                               |
| `onChange`        | `(tags: string[]) => void`   | —          | Called whenever the tag list changes.                             |
| `onTagAdded`      | `(tag: string) => void`      | —          | Called when a tag is successfully added.                          |
| `onTagRemoved`    | `(tag: string) => void`      | —          | Called when a tag is removed.                                     |
| `allowDuplicates` | `boolean`                    | `false`    | Allow duplicate tag values.                                       |
| `maxTags`         | `number`                     | —          | Maximum number of tags allowed.                                   |
| `validate`        | `(value: string) => boolean` | —          | Validation function — return `true` to accept, `false` to reject. |

## Basic Usage

```tsx
import { InputTags } from '@tale-ui/react/input-tags';

function Example() {
  const [tags, setTags] = React.useState<string[]>([]);

  return (
    <InputTags.Root
      label="Skills"
      placeholder="Add a skill…"
      description="Press Enter to add each skill."
      onChange={setTags}
    />
  );
}
```

## Tag Placement

### Inline (default)

Tags appear inside the field area alongside the text input:

```tsx
<InputTags.Root
  label="Technologies"
  placeholder="Add a technology…"
  tagPlacement="inline"
  defaultValue={['React', 'TypeScript']}
  onChange={setTags}
/>
```

### Below

Tags appear in a separate row below the field:

```tsx
<InputTags.Root
  label="Tags"
  placeholder="Add a tag…"
  tagPlacement="below"
  defaultValue={['design', 'ui']}
  onChange={setTags}
/>
```

## Sizes

```tsx
<InputTags.Root size="sm" label="Small" placeholder="Add tag…" />
<InputTags.Root size="md" label="Medium" placeholder="Add tag…" />
<InputTags.Root size="lg" label="Large" placeholder="Add tag…" />
```

## Validation States

```tsx
{
  /* Invalid with error message */
}
<InputTags.Root
  label="Required skills"
  isInvalid
  errorMessage="At least one skill is required."
  isRequired
/>;

{
  /* Disabled */
}
<InputTags.Root label="Skills" isDisabled defaultValue={['React', 'TypeScript']} />;
```

## Validation Function

```tsx
<InputTags.Root
  label="Hashtags"
  placeholder="#tag"
  validate={(value) => value.startsWith('#') && value.length > 1}
  description="Each tag must start with #"
/>
```

## Max Tags

```tsx
<InputTags.Root label="Up to 3 tags" maxTags={3} description="Maximum 3 tags allowed." />
```

## Controlled

```tsx
function ControlledExample() {
  const [tags, setTags] = React.useState(['React', 'TypeScript']);

  return (
    <InputTags.Root
      label="Skills"
      value={tags}
      onChange={setTags}
      onTagAdded={(tag) => console.log('added:', tag)}
      onTagRemoved={(tag) => console.log('removed:', tag)}
    />
  );
}
```

## CSS Classes

| Class                           | Description                                                                            |
| ------------------------------- | -------------------------------------------------------------------------------------- |
| `.tale-input-tags`              | Outer container                                                                        |
| `.tale-input-tags--sm`          | Small size modifier                                                                    |
| `.tale-input-tags--lg`          | Large size modifier                                                                    |
| `.tale-input-tags--below`       | Below tag placement modifier                                                           |
| `.tale-input-tags__label`       | Label element                                                                          |
| `.tale-input-tags__group`       | The field surface (manages focus-within, disabled, invalid states via data attributes) |
| `.tale-input-tags__tag-wrapper` | Wrapper around the tag list (handles keyboard navigation)                              |
| `.tale-input-tags__tag-list`    | Tag list (display: contents in inline mode)                                            |
| `.tale-input-tags__tag`         | Individual tag chip                                                                    |
| `.tale-input-tags__input`       | The native text input                                                                  |
| `.tale-input-tags__tags`        | Tag container for below placement                                                      |
| `.tale-input-tags__description` | Helper text                                                                            |
| `.tale-input-tags__error`       | Error message                                                                          |

## Pitfalls

<!-- pitfall: keyboard-nav-inline-only -->
<!-- prose-only -->

- **Backspace/ArrowLeft keyboard navigation applies to inline mode only** — in `tagPlacement="below"` mode, pressing Backspace when the input is empty does not focus the last tag.

<!-- pitfall: no-form-field-context -->
<!-- prose-only -->

- **`InputTags` does not integrate with React Aria form contexts** — it renders a plain `<div>` container. For form validation, use the `isInvalid`/`errorMessage` props directly rather than wrapping in a `Field`.

<!-- pitfall: controlled-value-identity -->
<!-- prose-only -->

- **In controlled mode, pass a stable array reference when the value hasn't changed** — the ID reconciliation logic uses reference equality (`===`) to skip re-reconciliation. Creating a new array on every render forces re-reconciliation on every render (though it remains functionally correct).
<!-- pitfall: use-input-tags-for-tag-entry-prompts -->
- **Use `InputTags.Root` for any prompt that asks for a tag-entry field, skills input, chip input, or add-tags UI** — when the request is specifically to let users enter multiple tags such as skills, render `InputTags.Root` directly with `label`, `placeholder`, `description`, and `maxTags` as needed instead of leaving the file empty or substituting a different field component.
  - anti-pattern: `// empty file`
  - anti-pattern: `<TextField.Root><TextField.Label>Skills</TextField.Label><TextField.Input placeholder="Add a skill..." /></TextField.Root>`
  - fix: `import { InputTags } from '@tale-ui/react/input-tags'; export function SkillsField() { return <InputTags.Root label="Skills" placeholder="Add a skill..." description="Enter up to 5 skills. Press Enter to add each one." maxTags={5} />; }`
