# Manual visual regression tests

These fixtures are deliberately excluded from the routine regression run
because they are expensive or require focused inspection. Use them when a
change affects the behaviour they cover.

Temporarily move or copy the relevant fixture into the active regression
fixture set described in [`../README.md`](../README.md), then run:

```bash
pnpm test:regressions:dev
pnpm test:regressions:run --watch
```

Do not commit the temporary fixture move or newly generated screenshots unless
the baseline change is intentional and reviewed.
