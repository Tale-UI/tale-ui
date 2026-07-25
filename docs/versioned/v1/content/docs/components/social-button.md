# SocialButton

`import { SocialButton } from '@tale-ui/react/social-button';`

A social login button with a provider icon on the left.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| provider | `'google' \| 'github' \| 'apple' \| 'x' \| 'facebook'` | (required) | Social provider whose icon to display |
| size | `'sm' \| 'md'` | `'md'` | Button size |

Also accepts all standard `<button>` HTML attributes.

## Basic Usage

```tsx
<SocialButton provider="google">Sign in with Google</SocialButton>
```

## Examples

### All Providers

```tsx
<SocialButton provider="google">Sign in with Google</SocialButton>
<SocialButton provider="github">Continue with GitHub</SocialButton>
<SocialButton provider="apple">Sign in with Apple</SocialButton>
<SocialButton provider="x">Sign in with X</SocialButton>
<SocialButton provider="facebook">Continue with Facebook</SocialButton>
```

### All Sizes

```tsx
<SocialButton provider="google" size="sm">Sign in with Google</SocialButton>
<SocialButton provider="google" size="md">Sign in with Google</SocialButton>
```

## CSS Classes

- `.tale-social-button` -- Base
- `.tale-social-button--google` / `--github` / `--apple` / `--x` / `--facebook` -- Provider modifiers
- `.tale-social-button--sm` / `--md` -- Size modifiers
- `.tale-social-button__icon` -- Icon wrapper

## Pitfalls

<!-- pitfall: social-button-provider-required -->
- **`provider` prop is required** — `SocialButton` requires a `provider` value (`'google'`, `'github'`, `'apple'`, `'x'`, or `'facebook'`). Omitting it will render no icon and may cause a runtime error.
  - anti-pattern: `<SocialButton>Sign in with Google</SocialButton>`
  - fix: `<SocialButton provider="google">Sign in with Google</SocialButton>`
  - complete example:
    ```tsx
    import { SocialButton } from '@tale-ui/react/social-button';

    export function Example() {
      return (
        <>
          <SocialButton provider="google">Sign in with Google</SocialButton>
          <SocialButton provider="github" size="sm">Continue with GitHub</SocialButton>
        </>
      );
    }
    ```
<!-- pitfall: use-socialbutton-for-any-social -->
- **Use `SocialButton` for any social sign-in, sign-up, or OAuth button prompt** — when a prompt asks for a Google, GitHub, Apple, X, or Facebook auth button, render the `SocialButton` component itself instead of a generic `Button`, custom markup, or an empty placeholder. This ensures the correct built-in provider styling and icon are used.
  - anti-pattern: `import { Button } from '@tale-ui/react/button'; export function SignInWithGoogle() { return <Button>Sign in with Google</Button>; }`
  - anti-pattern: `// empty file`
  - fix: `import { SocialButton } from '@tale-ui/react/social-button'; export function SignInWithGoogle() { return <SocialButton provider="google">Sign in with Google</SocialButton>; }`
<!-- pitfall: socialbutton-size-sm-md-only -->
- **`size` only accepts `'sm'` or `'md'` — `'lg'` does not exist** — passing `size="lg"` causes `Type '"lg"' is not assignable to type 'Size | undefined'`. When the prompt does not request a specific size, omit the prop and use the default.
  - anti-pattern: `<SocialButton provider="google" size="lg">Sign in with Google</SocialButton>`
  - fix: `<SocialButton provider="google">Sign in with Google</SocialButton>`

## Notes

- Custom component -- not built on a React Aria primitive.
- Renders a `<button type="button">` element.
- Each provider has its own branded SVG icon embedded in the component.
- Pass label text as `children` (e.g. "Sign in with Google").
- Standalone buttons have `width: fit-content` with left-aligned icon and text.
- See also [SocialButtonGroup](social-button-group.md) for equal-width grouped layout.
