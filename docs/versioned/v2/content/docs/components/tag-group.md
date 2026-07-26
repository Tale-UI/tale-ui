# TagGroup

`import { TagGroup } from '@tale-ui/react/tag-group';`

A labeled group of tags supporting selection and removal.

## Parts

| Part                    | Description                                        |
| ----------------------- | -------------------------------------------------- |
| `TagGroup.Root`         | Container. Accepts `selectionMode` and `onRemove`. |
| `TagGroup.Label`        | Visible label for the group.                       |
| `TagGroup.List`         | Container for the tag items.                       |
| `TagGroup.Tag`          | An individual tag. Requires `id`.                  |
| `TagGroup.Description`  | Help text below the tag list.                      |
| `TagGroup.ErrorMessage` | Validation error text.                             |

## Props

Accepts all React Aria `TagGroup` props plus an optional `className`. See the `@example` JSDoc on the component export for usage.

### New in React Aria 1.17/1.18

| Prop       | Type                 | Description                                                                                                                                                              |
| ---------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `onAction` | `(key: Key) => void` | Handler called when a user performs an action on a tag (e.g. pressing Enter or double-clicking). Lives on the React Aria layer; flows through `TagGroup.Root` untouched. |

## Basic Usage

```tsx
<TagGroup.Root>
  <TagGroup.Label>Categories</TagGroup.Label>
  <TagGroup.List>
    <TagGroup.Tag id="react">React</TagGroup.Tag>
    <TagGroup.Tag id="vue">Vue</TagGroup.Tag>
    <TagGroup.Tag id="angular">Angular</TagGroup.Tag>
  </TagGroup.List>
  <TagGroup.Description>Select your frameworks</TagGroup.Description>
</TagGroup.Root>
```

## Examples

### Removable Tags

```tsx
import { useState } from 'react';
import type { Selection } from '@tale-ui/react/tag-group';

function RemovableTags() {
  const [tags, setTags] = useState([
    { id: 'react', name: 'React' },
    { id: 'vue', name: 'Vue' },
    { id: 'angular', name: 'Angular' },
    { id: 'svelte', name: 'Svelte' },
  ]);

  const handleRemove = (keys: Selection) => {
    setTags((prev) => prev.filter((tag) => !(keys as Set<string>).has(tag.id)));
  };

  return (
    <TagGroup.Root onRemove={handleRemove}>
      <TagGroup.Label>Frameworks</TagGroup.Label>
      <TagGroup.List>
        {tags.map((tag) => (
          <TagGroup.Tag key={tag.id} id={tag.id}>
            {tag.name}
          </TagGroup.Tag>
        ))}
      </TagGroup.List>
    </TagGroup.Root>
  );
}
```

### With Selection

```tsx
<TagGroup.Root selectionMode="multiple">
  <TagGroup.Label>Skills</TagGroup.Label>
  <TagGroup.List>
    <TagGroup.Tag id="typescript">TypeScript</TagGroup.Tag>
    <TagGroup.Tag id="rust">Rust</TagGroup.Tag>
    <TagGroup.Tag id="python">Python</TagGroup.Tag>
    <TagGroup.Tag id="go">Go</TagGroup.Tag>
  </TagGroup.List>
  <TagGroup.Description>Select all that apply</TagGroup.Description>
</TagGroup.Root>
```

## CSS Classes

- `.tale-tag-group` — Base
- `.tale-tag-group__list` — Tag list container
- `.tale-tag-group__tag` — Individual tag
- `.tale-tag-group__label` — Label
- `.tale-tag-group__description` — Description text
- `.tale-tag-group__error` — Error message

## Pitfalls

<!-- pitfall: tag-group-no-item-sub-part -->

- **Uses `TagGroup.Tag`, NOT `TagGroup.Item`** — there is no `TagGroup.Item` sub-part.
  - anti-pattern: `<TagGroup.Root><TagGroup.Item key="a">Design</TagGroup.Item></TagGroup.Root>`
  - fix: `<TagGroup.Root><TagGroup.Tag id="a">Design</TagGroup.Tag></TagGroup.Root>`
  - complete example:

    ```tsx
    import { TagGroup } from '@tale-ui/react/tag-group';

    export function Example() {
      return (
        <TagGroup.Root>
          <TagGroup.Label>Categories</TagGroup.Label>
          <TagGroup.List>
            <TagGroup.Tag id="react">React</TagGroup.Tag>
            <TagGroup.Tag id="vue">Vue</TagGroup.Tag>
          </TagGroup.List>
        </TagGroup.Root>
      );
    }
    ```

<!-- pitfall: tag-group-root-no-label-prop -->

- **`TagGroup.Root` does NOT accept a `label` prop** — use `<TagGroup.Label>` as a child element.
  - anti-pattern: `<TagGroup.Root label="Technologies">...</TagGroup.Root>`
  - fix: `<TagGroup.Root><TagGroup.Label>Technologies</TagGroup.Label>...</TagGroup.Root>`

<!-- pitfall: tag-group-tag-no-on-remove -->

- **`TagGroup.Tag` does NOT accept `onRemove`** — put `onRemove` on `TagGroup.Root` instead.
  - anti-pattern: `<TagGroup.Tag id="a" onRemove={() => remove('a')}>Design</TagGroup.Tag>`
  - fix: `<TagGroup.Root onRemove={(keys) => setTags(tags.filter(t => !keys.has(t.id)))}><TagGroup.Tag id="a">Design</TagGroup.Tag></TagGroup.Root>`

## Notes

- Pass `onRemove` to `Root` to make tags removable. The callback receives the set of removed keys.
- `selectionMode` can be `"none"`, `"single"`, or `"multiple"`.
- Tags support these data attributes for styling: `data-selected`, `data-focused`, `data-focus-visible`, `data-hovered`, `data-pressed`, `data-disabled`.
