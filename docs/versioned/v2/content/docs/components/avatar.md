# Avatar

`import { Avatar } from '@tale-ui/react/avatar';`

A circular avatar displaying a user image or fallback initials.

## Parts

| Part | Description |
|------|-------------|
| `Avatar.Root` | Outer container. Accepts a `size` prop (`xs`, `sm`, `md`, `lg`, `xl`, `2xl`). |
| `Avatar.Image` | An `<img>` element for the user photo. |
| `Avatar.Fallback` | Text content shown when no image is provided or loading fails. |
| `Avatar.Group` | Stacks multiple avatars with overlapping layout. Propagates `size` to children. |
| `Avatar.Count` | Displays a "+N" overflow indicator for additional avatars not shown. |
| `Avatar.Indicator` | Positions a badge (e.g. DotIcon) at the corner of an avatar. Accepts `position` and `badge` props. |
| `Avatar.LabelGroup` | Combines an avatar with title + subtitle in a grid row. Accepts `size` (`sm`, `md`, `lg`). Propagates size to children. |
| `Avatar.LabelGroupTitle` | Primary text label inside a LabelGroup. |
| `Avatar.LabelGroupSubtitle` | Secondary text label inside a LabelGroup. Truncates on overflow. |
| `Avatar.AddButton` | Dashed-border circular "+" button. Sizes `xs`, `sm`, `md`. |
| `Avatar.CompanyIcon` | Overlays a company logo badge at the bottom-right corner. Wraps `Avatar.Root`. |
| `Avatar.VerifiedTick` | Decorative SVG seal badge with a checkmark. Eight sizes (`xs`–`4xl`). |
| `Avatar.ProfilePhoto` | Enhanced display avatar with a contrast ring and optional badge slot. Sizes `sm`, `md`, `lg`. |

## Props

### Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'md'` | Size variant controlling avatar dimensions |

Also accepts all standard `<span>` HTML attributes.

### Image

No Tale UI-specific props. Accepts all standard `<img>` HTML attributes.

### Fallback

No Tale UI-specific props. Accepts all standard `<span>` HTML attributes.

### Indicator

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'bottom-right' \| 'top-right'` | `'bottom-right'` | Where to position the badge |
| `badge` | `ReactNode` | — | Element to position at the avatar corner (typically a DotIcon) |

Also accepts all standard `<span>` HTML attributes.

### LabelGroup

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Controls avatar size via context and text sizing |

Also accepts all standard `<figure>` HTML attributes.

`Avatar.LabelGroupTitle` and `Avatar.LabelGroupSubtitle` accept all standard `<span>` HTML attributes.

### AddButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md'` | `'md'` | Size of the button — matches avatar xs–md dimensions |

Also accepts all standard `<button>` HTML attributes.

### CompanyIcon

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'md'` | Avatar size being decorated — controls badge image dimensions |
| `src` | `string` | required | URL of the company logo image |
| `alt` | `string` | `''` | Accessible alt text for the company logo |

Also accepts all standard `<span>` HTML attributes.

### VerifiedTick

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| '4xl'` | `'md'` | Size of the SVG badge |

Also accepts all standard SVG attributes.

### ProfilePhoto

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Display size — maps to avatar md / lg / xl dimensions respectively |
| `badge` | `ReactNode` | — | Badge element shown at bottom-right (e.g. `Avatar.VerifiedTick`) |

Also accepts all standard `<span>` HTML attributes.

## Basic Usage

```tsx
<Avatar.Root size="md">
  <Avatar.Fallback>JD</Avatar.Fallback>
</Avatar.Root>
```

## Examples

### All Sizes

```tsx
<Avatar.Root size="xs">
  <Avatar.Fallback>XS</Avatar.Fallback>
</Avatar.Root>
<Avatar.Root size="sm">
  <Avatar.Fallback>SM</Avatar.Fallback>
</Avatar.Root>
<Avatar.Root size="md">
  <Avatar.Fallback>MD</Avatar.Fallback>
</Avatar.Root>
<Avatar.Root size="lg">
  <Avatar.Fallback>LG</Avatar.Fallback>
</Avatar.Root>
<Avatar.Root size="xl">
  <Avatar.Fallback>XL</Avatar.Fallback>
</Avatar.Root>
<Avatar.Root size="2xl">
  <Avatar.Fallback>2X</Avatar.Fallback>
</Avatar.Root>
```

### With Image

```tsx
<Avatar.Root size="lg">
  <Avatar.Image src="/photo.jpg" alt="User avatar" />
  <Avatar.Fallback>AB</Avatar.Fallback>
</Avatar.Root>
```

### Group

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'md'` | Size variant propagated to all child avatars |

Also accepts all standard `<div>` HTML attributes.

### Count

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | — | The overflow count to display (renders as "+N") |

Also accepts all standard `<span>` HTML attributes.

### Avatar Group

```tsx
<Avatar.Group size="md">
  <Avatar.Root>
    <Avatar.Fallback>AB</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Fallback>CD</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Fallback>EF</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Count count={5} />
</Avatar.Group>
```

### Group with Images

```tsx
<Avatar.Group size="lg">
  <Avatar.Root>
    <Avatar.Image src="/alice.jpg" alt="Alice" />
    <Avatar.Fallback>AL</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Image src="/bob.jpg" alt="Bob" />
    <Avatar.Fallback>BO</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Count count={12} />
</Avatar.Group>
```

### With Indicator

```tsx
import { DotIcon } from '@tale-ui/react/dot-icon';

<Avatar.Indicator badge={<DotIcon color="success" />}>
  <Avatar.Root size="lg">
    <Avatar.Image src="/photo.jpg" alt="User" />
    <Avatar.Fallback>JD</Avatar.Fallback>
  </Avatar.Root>
</Avatar.Indicator>
```

### With LabelGroup

```tsx
<Avatar.LabelGroup size="md">
  <Avatar.Root>
    <Avatar.Image src="/photo.jpg" alt="User" />
    <Avatar.Fallback>JD</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.LabelGroupTitle>Jane Doe</Avatar.LabelGroupTitle>
  <Avatar.LabelGroupSubtitle>Product Designer</Avatar.LabelGroupSubtitle>
</Avatar.LabelGroup>
```

### LabelGroup with Indicator

```tsx
<Avatar.LabelGroup size="md">
  <Avatar.Indicator badge={<DotIcon color="success" />}>
    <Avatar.Root>
      <Avatar.Image src="/photo.jpg" alt="User" />
      <Avatar.Fallback>JD</Avatar.Fallback>
    </Avatar.Root>
  </Avatar.Indicator>
  <Avatar.LabelGroupTitle>Jane Doe</Avatar.LabelGroupTitle>
  <Avatar.LabelGroupSubtitle>Online</Avatar.LabelGroupSubtitle>
</Avatar.LabelGroup>
```

### AddButton

```tsx
<Avatar.Group size="md">
  <Avatar.Root><Avatar.Fallback>AB</Avatar.Fallback></Avatar.Root>
  <Avatar.Root><Avatar.Fallback>CD</Avatar.Fallback></Avatar.Root>
  <Avatar.AddButton size="md" aria-label="Add team member" />
</Avatar.Group>
```

### CompanyIcon

```tsx
<Avatar.CompanyIcon src="/logos/acme.png" alt="Acme Corp" size="md">
  <Avatar.Root>
    <Avatar.Image src="/photo.jpg" alt="Jane Doe" />
    <Avatar.Fallback>JD</Avatar.Fallback>
  </Avatar.Root>
</Avatar.CompanyIcon>
```

### VerifiedTick

```tsx
{/* As badge on Indicator */}
<Avatar.Indicator badge={<Avatar.VerifiedTick size="sm" />}>
  <Avatar.Root size="md">
    <Avatar.Image src="/photo.jpg" alt="User" />
    <Avatar.Fallback>JD</Avatar.Fallback>
  </Avatar.Root>
</Avatar.Indicator>
```

### ProfilePhoto

```tsx
{/* With verified badge */}
<Avatar.ProfilePhoto size="lg" badge={<Avatar.VerifiedTick size="md" />}>
  <Avatar.Image src="/photo.jpg" alt="Jane Doe" />
  <Avatar.Fallback>JD</Avatar.Fallback>
</Avatar.ProfilePhoto>

{/* Without badge */}
<Avatar.ProfilePhoto size="md">
  <Avatar.Fallback>JD</Avatar.Fallback>
</Avatar.ProfilePhoto>
```

## CSS Classes

- `.tale-avatar` — Base
- `.tale-avatar--xs` / `--sm` / `--md` / `--lg` / `--xl` / `--2xl` — Size modifiers
- `.tale-avatar__image` — Image element
- `.tale-avatar__fallback` — Fallback text
- `.tale-avatar-group` — Group container
- `.tale-avatar-group--xs` / `--sm` / `--md` / `--lg` / `--xl` / `--2xl` — Group size modifiers
- `.tale-avatar-count` — "+N" overflow count indicator (with `--xs` / `--sm` / `--md` / `--lg` / `--xl` / `--2xl` size modifiers)
- `.tale-avatar-indicator` — Indicator positioning wrapper
- `.tale-avatar-indicator--bottom-right` / `--top-right` — Indicator position modifiers
- `.tale-avatar-indicator__badge` — Positioned badge element
- `.tale-avatar-label-group` — LabelGroup grid container
- `.tale-avatar-label-group--sm` / `--md` / `--lg` — LabelGroup size modifiers
- `.tale-avatar-label-group__title` — Primary text
- `.tale-avatar-label-group__subtitle` — Secondary text (truncated)
- `.tale-avatar-add-button` — Dashed circle add button
- `.tale-avatar-add-button--xs` / `--sm` / `--md` — AddButton size modifiers
- `.tale-avatar-add-button__icon` — Plus icon SVG inside AddButton
- `.tale-avatar-company-icon` — CompanyIcon wrapper
- `.tale-avatar-company-icon--xs` / `--sm` / `--md` / `--lg` / `--xl` / `--2xl` — CompanyIcon size modifiers
- `.tale-avatar-company-icon__badge` — The small circular company logo image
- `.tale-avatar-verified-tick` — VerifiedTick SVG element
- `.tale-avatar-verified-tick--xs` / `--sm` / `--md` / `--lg` / `--xl` / `--2xl` / `--3xl` / `--4xl` — VerifiedTick size modifiers
- `.tale-avatar-profile-photo` — ProfilePhoto outer wrapper
- `.tale-avatar-profile-photo--sm` / `--md` / `--lg` — ProfilePhoto size modifiers
- `.tale-avatar-profile-photo__inner` — Inner avatar with contrast ring (also carries `.tale-avatar` + size class)
- `.tale-avatar-profile-photo__badge` — Positioned badge container (bottom-right)

## Pitfalls

<!-- pitfall: avatar-indicator-outside-root -->
- **`Avatar.Indicator` must wrap OUTSIDE `Avatar.Root`** — `Avatar.Root` has `overflow: hidden`, so placing `Avatar.Indicator` inside it will clip the indicator badge.
  - anti-pattern: `<Avatar.Root><Avatar.Image /><Avatar.Indicator><Badge /></Avatar.Indicator></Avatar.Root>`
  - fix: `<Avatar.Indicator><Avatar.Root><Avatar.Image /></Avatar.Root><Badge /></Avatar.Indicator>`
  - complete example:
    ```tsx
    import { Avatar } from '@tale-ui/react/avatar';

    export function Example() {
      return (
        <Avatar.Group size="md">
          <Avatar.Root><Avatar.Fallback>AB</Avatar.Fallback></Avatar.Root>
          <Avatar.Root><Avatar.Fallback>CD</Avatar.Fallback></Avatar.Root>
          <Avatar.Count>+3</Avatar.Count>
        </Avatar.Group>
      );
    }
    ```

<!-- pitfall: avatar-group-propagates-size -->
<!-- prose-only -->
- **`Avatar.Group` propagates `size` to children** — do not set `size` on individual `Avatar.Root` inside a Group unless intentionally overriding the group size.

<!-- pitfall: avatar-size-full-values -->
- **`size` accepts `'xs'`, `'sm'`, `'md'`, `'lg'`, `'xl'`, `'2xl'`** — NOT the short forms `'s'`, `'m'`, or `'l'`.
  - anti-pattern: `<Avatar.Root size="m">`
  - fix: `<Avatar.Root size="md">`

<!-- pitfall: avatar-company-icon-outside-root -->
- **`Avatar.CompanyIcon` must wrap `Avatar.Root` from outside** — like `Avatar.Indicator`, the badge is absolutely positioned on the wrapper. Placing it inside `Avatar.Root` will clip it.
  - anti-pattern: `<Avatar.Root><Avatar.CompanyIcon src="..." /></Avatar.Root>`
  - fix: `<Avatar.CompanyIcon src="..." size="md"><Avatar.Root>...</Avatar.Root></Avatar.CompanyIcon>`
<!-- pitfall: avatar-profile-photo-children -->
- **`Avatar.ProfilePhoto` accepts `Avatar.Image` then `Avatar.Fallback` as direct children** — do not nest `Avatar.Root` inside `ProfilePhoto`; it renders its own inner avatar element.
  - anti-pattern: `<Avatar.ProfilePhoto><Avatar.Root><Avatar.Image /></Avatar.Root></Avatar.ProfilePhoto>`
  - fix: `<Avatar.ProfilePhoto><Avatar.Image src="..." alt="..." /><Avatar.Fallback>JD</Avatar.Fallback></Avatar.ProfilePhoto>`
<!-- pitfall: avatarcount-accepts-children-text-not -->
- **Avatar.Count accepts children text, not a count prop** — pass the overflow label string (e.g. `"+5"`) as children; there is no `count` prop and passing one causes a TypeScript error.
  - anti-pattern: `<Avatar.Count count={5} />`
  - fix: `<Avatar.Count>+5</Avatar.Count>`
<!-- pitfall: avatarprofilephoto-size-does-not-accept -->
- **Avatar.ProfilePhoto size does not accept 'xl' or '2xl' — valid values are 'xs', 'sm', 'md', 'lg'** — `ProfilePhotoSize` is a narrower type than `Avatar.Root` size; passing `size="xl"` or `size="2xl"` causes `Type '"xl"' is not assignable to type 'ProfilePhotoSize | undefined'`. Use `size="lg"` for the largest profile photo.
  - anti-pattern: `<Avatar.ProfilePhoto size="xl">`
  - anti-pattern: `<Avatar.ProfilePhoto size="2xl">`
  - fix: `<Avatar.ProfilePhoto size="lg">`

<!-- pitfall: use-avatargroup-with-avatarcount-for-overflow-prompts -->
- **Use `Avatar.Group` with `Avatar.Count` for prompts that ask for stacked avatars with overflow** — when the request is for a group of layered avatars showing an overflow label (for example `+5`), render `Avatar.Group` with individual `Avatar.Root` children and `Avatar.Count` for the overflow string instead of leaving the file empty. Pass the overflow label as children to `Avatar.Count` — there is no `count` prop.
  - anti-pattern: `// empty file`
  - fix: `import { Avatar } from '@tale-ui/react/avatar'; export function StackedAvatars() { return <Avatar.Group size="md"><Avatar.Root><Avatar.Fallback>AB</Avatar.Fallback></Avatar.Root><Avatar.Root><Avatar.Fallback>CD</Avatar.Fallback></Avatar.Root><Avatar.Root><Avatar.Fallback>EF</Avatar.Fallback></Avatar.Root><Avatar.Count>+5</Avatar.Count></Avatar.Group>; }`

## Notes

- Always include a `Fallback` alongside `Image` so initials display while the image loads or if it fails.
- Default size is `md`.
- `Avatar.Group` propagates `size` to children — do not set `size` on individual `Avatar.Root` inside a Group unless overriding.
- `Avatar.Count` renders a "+N" indicator — always place it as the last child of `Avatar.Group`.
