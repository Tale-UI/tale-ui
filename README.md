# Tale UI

Unified monorepo for the Tale UI design system and React component library.

## Packages

| Package                                     | Description                                                                                            | npm                                                                                                               |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| [`@tale-ui/tokens`](packages/tokens/)       | Canonical design tokens and native token objects                                                       | [![npm](https://img.shields.io/npm/v/@tale-ui/tokens)](https://www.npmjs.com/package/@tale-ui/tokens)             |
| [`@tale-ui/css`](packages/css/)             | CSS foundations and utilities generated from the shared tokens                                         | [![npm](https://img.shields.io/npm/v/@tale-ui/css)](https://www.npmjs.com/package/@tale-ui/css)                   |
| [`@tale-ui/react`](packages/react/)         | Styled React components built on [React Aria Components](https://react-spectrum.adobe.com/react-aria/) | [![npm](https://img.shields.io/npm/v/@tale-ui/react)](https://www.npmjs.com/package/@tale-ui/react)               |
| [`@tale-ui/react-styles`](packages/styles/) | Component CSS using @tale-ui/css design tokens                                                         | [![npm](https://img.shields.io/npm/v/@tale-ui/react-styles)](https://www.npmjs.com/package/@tale-ui/react-styles) |
| [`@tale-ui/themes`](packages/themes/)       | Optional standard and monochrome theme suites                                                          | [![npm](https://img.shields.io/npm/v/@tale-ui/themes)](https://www.npmjs.com/package/@tale-ui/themes)             |
| [`@tale-ui/utils`](packages/utils/)         | Shared utilities                                                                                       | [![npm](https://img.shields.io/npm/v/@tale-ui/utils)](https://www.npmjs.com/package/@tale-ui/utils)               |
| [`@tale-ui/tooling`](packages/tooling/)     | Internal-first registry API, CLI, validation, and safe project tooling                                 | Internal                                                                                                          |

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

**Requirements:** React 17, 18, or 19. Node 22+.

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
  return <Button className="tale-button tale-button--primary">Click me</Button>;
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

Accordion, Alert Dialog, Autocomplete, Avatar, Breadcrumbs, Button, Calendar, Checkbox, Checkbox Group, Color Area, Color Field, Color Picker, Color Slider, Color Swatch, Color Swatch Picker, Color Wheel, Combobox, Context Menu, Date Field, Date Picker, Date Range Picker, Dialog, Disclosure, Drawer, Drop Zone, Field, Fieldset, File Trigger, Form, Grid List, Input, Link, Menu, Menubar, Meter, Navigation Menu, Number Field, Popover, Preview Card, ProgressBar, Radio, Radio Group, Range Calendar, Scroll Area, Search Field, Select, Separator, Slider, Switch, Table, Tabs, Tag Group, Text Area, Text Field, Time Field, Toggle Button, Toggle Button Group, Toolbar, Tooltip, Tree

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
