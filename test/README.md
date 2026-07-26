# Testing

Tale UI uses Vitest for unit and browser projects, Testing Library and the
shared `createRenderer` helper for component tests, Playwright for browser
automation, and dedicated projects for end-to-end, visual, accessibility, and
regression coverage.

## Where tests live

- Component unit tests live beside source as
  `packages/react/src/{component}/{Component}.test.tsx`.
- Shared utility tests live beside their source under `packages/utils/src/`.
- Package-specific Vitest configuration lives in
  `packages/*/vitest.config.mts`.
- End-to-end fixtures and tests live under [`test/e2e/`](e2e/README.md).
- Visual regression fixtures live under
  [`test/regressions/`](regressions/README.md).
- Playwright component snapshots live under `test/visual/`.
- Changed-component axe coverage and retained evidence are described in
  [`docs/governance/accessibility-and-performance.md`](../docs/governance/accessibility-and-performance.md).

## Writing component tests

Use `createRenderer` from the package test utilities. It provides an async
Testing Library render, configured user events, cleanup, and the repository
test environment.

```tsx
import { expect, fn } from 'vitest';
import { Button } from '@tale-ui/react/button';
import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer } from '#test-utils';

describe('<Button />', () => {
  const { render } = createRenderer();

  it('handles a press', async () => {
    const onPress = fn();
    const { user } = await render(<Button onPress={onPress}>Save</Button>);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onPress).toHaveBeenCalledOnce();
  });
});
```

For new tests:

- use Vitest's native `expect` and `fn` APIs;
- prefer accessible queries such as `getByRole`;
- await `render` and user interactions;
- do not call `flushMicrotasks()` immediately after an awaited render when no
  state change occurred;
- use `it.skipIf(isJSDOM)` or `describe.skipIf(isJSDOM)` for
  browser-layout-sensitive cases; and
- add a docs demo or visual fixture when appearance is the behaviour under
  test.

The repository still provides `toErrorDev` for tests that intentionally assert
development warnings. Unexpected `console.error` and `console.warn` calls fail
the suite through `vitest-fail-on-console`.

```tsx
expect(() => {
  renderDeprecatedUsage();
}).toErrorDev('Tale UI: the deprecated usage is not supported.');
```

## Unit and browser commands

Run these from the repository root:

```bash
pnpm test:jsdom --no-watch              # core unit projects in jsdom
pnpm test:jsdom Button --no-watch       # focused jsdom run
pnpm test:chromium --no-watch           # core unit projects in Chromium
pnpm test:chromium Button --no-watch    # focused Chromium run
pnpm test:firefox --no-watch            # core unit projects in Firefox
pnpm test:webkit --no-watch             # core unit projects in WebKit
pnpm test:browsers --no-watch           # all configured browser projects
pnpm test:jsdom:coverage --no-watch     # Istanbul coverage
pnpm test:tokens                        # token generation tests
```

Install missing Playwright browsers with:

```bash
pnpm exec playwright install --with-deps chromium firefox webkit
```

GitHub Actions runs the required CI matrix. There is no CircleCI or
BrowserStack trigger in the current repository workflow.

## End-to-end, visual, and regression commands

```bash
pnpm test:e2e
pnpm test:visual
pnpm test:visual:update
pnpm test:regressions
```

For interactive fixture development, use the paired development server and
runner documented in the [end-to-end guide](e2e/README.md) or
[regression guide](regressions/README.md).

## Accessibility and performance

```bash
pnpm a11y:smoke
pnpm a11y:changed
pnpm performance:check
```

Changed-component accessibility runs against a built Storybook in CI. Manual
assistive-technology evidence, exceptions, and performance baselines are
governed by
[`docs/governance/accessibility-and-performance.md`](../docs/governance/accessibility-and-performance.md).

## Test configuration

The root [`vitest.config.mts`](../vitest.config.mts) discovers package, docs,
end-to-end, and regression projects. The `VITEST_ENV` selected by root scripts
controls jsdom or browser execution. Do not document or add a new environment
without adding the corresponding root command and CI coverage.
