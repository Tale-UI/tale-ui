# SocialButtonGroup

`import { SocialButtonGroup } from '@tale-ui/react/social-button';`

Groups SocialButton components with equal width and centered content. The group sizes to the widest child button, and all buttons stretch to match.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | `'sm' \| 'md' \| 'lg'` | -- | Size propagated to all child SocialButton components |

Also accepts all standard `<div>` HTML attributes.

## Basic Usage

```tsx
import { SocialButton, SocialButtonGroup } from '@tale-ui/react/social-button';

<SocialButtonGroup>
  <SocialButton provider="google">Sign in with Google</SocialButton>
  <SocialButton provider="github">Continue with GitHub</SocialButton>
  <SocialButton provider="apple">Sign in with Apple</SocialButton>
</SocialButtonGroup>
```

## Examples

### With Size Propagation

```tsx
<SocialButtonGroup size="lg">
  <SocialButton provider="google">Sign in with Google</SocialButton>
  <SocialButton provider="github">Continue with GitHub</SocialButton>
  <SocialButton provider="apple">Sign in with Apple</SocialButton>
</SocialButtonGroup>
```

## CSS Classes

- `.tale-social-button-group` -- Group container (flex column, equal-width children)

## Notes

- Renders a `<div role="group">` element.
- Buttons inside a group get `width: 100%` and centered content, overriding the standalone left-aligned layout.
- The `size` prop on the group propagates to all child SocialButton components via context. Individual buttons can still override with their own `size` prop.
- See [SocialButton](social-button.md) for the full button API, props, and examples.

## Pitfalls
