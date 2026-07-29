# Tale UI

Unified monorepo for the Tale UI design system and React component library.

## Packages

| Package                                           | Description                                                                                            | Release channel                                                                                                   |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| [`@tale-ui/tokens`](packages/tokens/)             | Canonical design tokens and native token objects                                                       | [![npm](https://img.shields.io/npm/v/@tale-ui/tokens)](https://www.npmjs.com/package/@tale-ui/tokens)             |
| [`@tale-ui/foundations`](packages/foundations/)   | Renderer-neutral themes, contracts, state, and portable recipes                                        | Workspace-supported experimental                                                                                  |
| [`@tale-ui/css`](packages/css/)                   | CSS foundations and utilities generated from the shared tokens                                         | [![npm](https://img.shields.io/npm/v/@tale-ui/css)](https://www.npmjs.com/package/@tale-ui/css)                   |
| [`@tale-ui/react`](packages/react/)               | Styled React components built on [React Aria Components](https://react-spectrum.adobe.com/react-aria/) | [![npm](https://img.shields.io/npm/v/@tale-ui/react)](https://www.npmjs.com/package/@tale-ui/react)               |
| [`@tale-ui/react-native`](packages/react-native/) | Accessible components for iOS, Android, and declared React Native Web surfaces                         | Workspace-supported experimental                                                                                  |
| [`@tale-ui/react-styles`](packages/styles/)       | Component CSS using `@tale-ui/css` design tokens                                                       | [![npm](https://img.shields.io/npm/v/@tale-ui/react-styles)](https://www.npmjs.com/package/@tale-ui/react-styles) |
| [`@tale-ui/themes`](packages/themes/)             | Optional standard and monochrome theme suites                                                          | [![npm](https://img.shields.io/npm/v/@tale-ui/themes)](https://www.npmjs.com/package/@tale-ui/themes)             |
| [`@tale-ui/utils`](packages/utils/)               | Public shared hooks, colour utilities, and DOM helpers                                                 | [![npm](https://img.shields.io/npm/v/@tale-ui/utils)](https://www.npmjs.com/package/@tale-ui/utils)               |
| [`@tale-ui/charts`](packages/charts/)             | Recharts-based chart components themed with Tale UI tokens                                             | [![npm](https://img.shields.io/npm/v/@tale-ui/charts)](https://www.npmjs.com/package/@tale-ui/charts)             |
| [`@tale-ui/a2ui`](packages/a2ui/)                 | A2UI protocol renderer and Tale UI catalog                                                             | [![npm](https://img.shields.io/npm/v/@tale-ui/a2ui)](https://www.npmjs.com/package/@tale-ui/a2ui)                 |
| [`@tale-ui/tooling`](packages/tooling/)           | Public-beta registry API, CLI, local validation, and safe project tooling                              | Public beta (`next`)                                                                                              |

## Installation

```bash
# CSS design system only
npm install @tale-ui/css

# Platform-neutral and React Native tokens
npm install @tale-ui/tokens

# React components + styles
npm install @tale-ui/react @tale-ui/react-styles

# Optional standard themes
npm install @tale-ui/themes
```

The foundations and React Native packages are workspace-supported experimental
packages. The current publication workflow does not publish either package.
Use workspace links or the clean packed-consumer fixture while they remain
experimental.

**Consumer requirements:** React 17, 18, or 19. React 3 requires Node 18+.
Repository development requires Node 22+ and pnpm 10+.

## Usage

### CSS Design System

```css
@import '@tale-ui/css';
```

### React Components

```tsx
import { Button } from '@tale-ui/react/button';
import '@tale-ui/react-styles/button';

export function MyButton() {
  return <Button variant="primary">Click me</Button>;
}
```

Or import all styles at once:

```tsx
import '@tale-ui/react-styles';
```

Add an optional standard theme:

```tsx
import '@tale-ui/themes/themes.css';
import { applyStandardTheme } from '@tale-ui/themes';

applyStandardTheme('harbour');
```

Or apply a monochrome theme whose brand and neutral scales share one colour anchor:

```tsx
import { applyMonochromeTheme } from '@tale-ui/themes';

applyMonochromeTheme('mountain-meadow');
```

## Components

See the registry-derived [component index](docs/component-index.md) for every
React and chart component, import path, lifecycle status, and public sub-part.
The index is checked against source in CI.

## Documentation

- [Consume Tale UI](docs/consuming-design-system.md)
- [Runtime and release compatibility](docs/compatibility.md)
- [Migrate from React 2 to React 3](docs/migrating-to-v3.md)
- [Author components](docs/authoring-components.md)
- [Set up React Native](docs/react-native-setup.md)
- [Author React Native components](docs/authoring-react-native-components.md)
- [Test the repository](test/README.md)
- [Maintain documentation and generated artifacts](docs/documentation-governance.md)
- [Understand workspace boundaries](docs/workspace-structure.md)

## Development

```bash
pnpm install                 # install all workspace deps
pnpm start                   # install + launch playground
pnpm playground:dev          # run vite playground
pnpm storybook               # run storybook
pnpm build                   # build all packages
pnpm tokens:check            # verify generated CSS/native token artifacts
pnpm build:css               # build CSS design system only
pnpm test:jsdom              # unit tests (jsdom)
pnpm test:chromium           # unit tests (browser)
pnpm typescript              # type check
pnpm eslint                  # lint JS/TS
pnpm lint:css                # lint CSS design system
```

## Publishing

Publishing is automated via [.github/workflows/publish.yml](.github/workflows/publish.yml).
That workflow currently omits `@tale-ui/foundations` and
`@tale-ui/react-native`.

- **Coordinated release:** Tag with `release-v*.*.*` to publish Tokens, CSS, React, Styles,
  Themes, and Utils together
- **Tokens:** Tag with `tokens-v*.*.*`
- **CSS design system:** Tag with `css-v*.*.*` (e.g. `css-v2.0.1`) or use `pnpm release:css`
- **React compatibility release scope:** Tag with `react-v*.*.*` to run the coordinated six-package release job; prefer `release-v*.*.*` for normal releases
- **Themes-only exception:** Tag with `themes-v*.*.*` only for an explicitly requested package-only release
- **Tooling beta:** Tag with `tooling-v*.*.*` to publish `@tale-ui/tooling` independently under npm dist-tag `next`
- **Manual dispatch:** Run the workflow from GitHub Actions with scope (`all`, `tokens`, `css`,
  `react`, `themes`, or `tooling`) and version

Requires repository secret `NPM_TOKEN` with publish permissions for the `@tale-ui` npm scope.

## License

MIT
