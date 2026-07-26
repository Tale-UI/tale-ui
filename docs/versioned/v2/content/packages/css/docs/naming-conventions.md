# Naming Conventions

## Utility Classes: `.{block}--{modifier}`

```css
.text--display-l    /* block: text, modifier: display-l */
.gap--xl            /* block: gap, modifier: xl */
.grid--auto-3       /* block: grid, modifier: auto-3 */
.center--all        /* block: center, modifier: all */
.display--none      /* block: display, modifier: none */
.radius--m          /* block: radius, modifier: m */
```

- Double-dash `--` separates block from modifier
- Single dash `-` for compound words within block or modifier
- Sizing scale: `xs`, `s`, `m`, `l`, `xl`, `2xl` (plus `3xl`/`4xl` for spacing)

## Responsive Variants: `.{block}--{breakpoint}-{modifier}`

```css
.gap--xl-m          /* gap xl-size at xl breakpoint */
.grid--l-2          /* 2-column grid at l breakpoint */
.flex--col-m        /* flex column at m breakpoint */
.text--center-s     /* text center at s breakpoint */
.display--none-xl   /* display none at xl breakpoint */
```

### Breakpoints

| Suffix | Media Query | Use Case |
|--------|------------|----------|
| `-xl` | `max-width: 1600px` | Large desktop |
| `-l` | `max-width: 992px` | Desktop/tablet landscape |
| `-m` | `max-width: 768px` | Tablet portrait |
| `-s` | `max-width: 480px` | Mobile |

### Which utilities have responsive variants

**Have responsive variants:**

- Gap (`gap--`, `col-gap--`, `row-gap--`)
- Grid (column counts, row counts, spans, starts, ends, order, alternates)
- Centering (all directions)
- Flex (direction, wrap)
- Text alignment (left, center, right)
- Display/visibility (all display modes + visibility)

**Do NOT have responsive variants:**

- Opacity, aspect, object-fit, line-clamp, radius, shadow, border, divider, padding, z-index, position, sizing, flex-wrap, flex-grow, text transform/weight/style/decoration

### Special cases

- `.gap--none` only applies at ≤480px (defined in the mobile media query only)
- `.display--inline` has no responsive variants

## Theme Classes: `.{type}-{name}`

```css
.color-red          /* single dash, NOT double-dash */
.neutral-cool       /* single dash, NOT double-dash */
```

Theme classes always use a **single dash**. Never `.color--red`.

## Component Classes (BEM)

```css
.card               /* block */
.card__title        /* element */
.card__title--large /* modifier */
```

Use BEM for component internals when building on top of this design system. See [building-components.md](building-components.md).
