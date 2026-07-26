# Tale UI Vite playground

A small Vite + React app used for local experimentation and performance benchmarks against the Tale UI source in this repo.

## Usage

### Dev mode

```bash
pnpm dev
```

### Production mode

```bash
pnpm build
pnpm serve
```

### Profiling build

This app supports a profiling build that aliases `react-dom/client` to `react-dom/profiling`.
This enables React Performance Tracks in Chrome Developer Tools profiler.

```bash
pnpm build:profile
pnpm serve
```

## React Performance Tracks

React can annotate the browser Performance panel with scheduling, commit, and component timing tracks in development and profiling builds. To use it:

1. Install the React DevTools browser extension.
2. Use the profiling build above (or `pnpm -C playground/vite-app dev`) and open the app in a Chromium-based browser.
3. Open DevTools > Performance, start a recording, then interact with the app.
4. Look for the React tracks in the timeline.

Reference: https://react.dev/reference/dev-tools/react-performance-tracks

## Deployment

The Pages workflow builds this app with `pnpm -C playground/vite-app build`
and assembles it beside the docs, metrics dashboard, scale playground, and
Storybook. In the repository Pages deployment it is available under
`/tale-ui/playground/`; local/custom Pages base paths are supplied through
`PLAYGROUND_BASE`.
