# Accessibility and performance gates

Accessibility and performance are release controls, not advisory dashboards.

## Changed-component accessibility

`pnpm a11y:changed -- --url <storybook-url> --base <git-ref>` maps changed component source,
styles, docs, and stories to Storybook entries and runs axe-core in Chromium. Changes to tokens,
shared primitives, shared style entry points, A2UI rendering, or Storybook configuration trigger a
full component fallback. The scheduled workflow scans every component and foundation story.

The runner blocks violations that are absent from `test/accessibility/baseline.json`. A temporary
waiver belongs in `test/accessibility/exceptions.json` with an owner, substantive rationale, and
expiry. Resolved baseline violations are reported so the baseline can only ratchet downward.

`pnpm a11y:smoke` proves the pinned runner detects an intentional accessible-name failure and
accepts the corrected fixture.

Automated axe results do not replace assistive-technology review. The retained record in
`test/accessibility/manual-evidence.json` covers screen reader, zoom/reflow, keyboard, touch, and
reduced motion. Pending records are explicit and block stable promotion of the scoped experimental
families; they do not fabricate a manual pass.

## Maintained performance budgets

`pnpm performance:check` measures and trends eight surfaces:

- the full React ESM entry and a minimal Button import;
- published minified CSS;
- AppShell SSR and hydration;
- the worst maintained 10k Table p95;
- the Charts ESM entry; and
- the A2UI ESM entry.

JavaScript entry measurements externalize third-party and workspace bare imports, making the result
the first-party cost Tale UI controls. CSS uses the release build. Runtime measurements use
isolated deterministic fixtures. Table retains its dedicated 1k/10k correctness and timing
benchmarks.

Each budget has a baseline, warning threshold, blocking threshold, accountable owner, and evidence
source in `analysis/baselines/performance-budgets.json`. CI uploads the current comparison report.
A regression above the blocking threshold requires an expiring, scoped exception with an understood
maximum; raising or recapturing a baseline without investigation is not an exception.
