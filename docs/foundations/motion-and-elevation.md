# Motion and elevation

Tale UI uses semantic motion roles and elevation levels so interaction intent survives visual
refreshes, reduced-motion preferences, and platform adaptation.

## Motion roles

| Role     | Duration token               | Easing token               | Use                                         |
| -------- | ---------------------------- | -------------------------- | ------------------------------------------- |
| Feedback | `--motion-feedback-duration` | `--motion-feedback-easing` | Press and direct manipulation feedback      |
| State    | `--motion-state-duration`    | `--motion-state-easing`    | Selection, focus, and compact state changes |
| Enter    | `--motion-enter-duration`    | `--motion-enter-easing`    | Content entering the viewport               |
| Exit     | `--motion-exit-duration`     | `--motion-exit-easing`     | Content leaving the viewport                |
| Content  | `--motion-content-duration`  | `--motion-content-easing`  | Larger layout or content transitions        |

Use role tokens in component CSS. Primitive durations and curves are foundation implementation
details, not component choices. `prefers-reduced-motion: reduce`, the
`data-reduced-motion="true"` root attribute, and `.tale-reduced-motion` all map semantic durations
to zero and curves to linear. Components must remain understandable when every transition is
instant.

```css
.product-panel {
  transition:
    opacity var(--motion-enter-duration) var(--motion-enter-easing),
    transform var(--motion-enter-duration) var(--motion-enter-easing);
}
```

## Elevation hierarchy

| Level    | Token                  | Intended surface                            |
| -------- | ---------------------- | ------------------------------------------- |
| Flat     | `--elevation-flat`     | Inline and page content                     |
| Raised   | `--elevation-raised`   | Cards and selected controls                 |
| Floating | `--elevation-floating` | Sticky controls                             |
| Overlay  | `--elevation-overlay`  | Popovers, menus, and drawers                |
| Modal    | `--elevation-modal`    | Dialogs and blocking surfaces               |
| Toast    | `--elevation-toast`    | Time-sensitive notifications above overlays |

Elevation communicates stacking and interaction priority. Do not select legacy `--shadow-*`
primitives directly in new component work.

## Migration treatment

Replace raw component timings with the role matching the interaction, rather than mechanically
matching the closest millisecond value. Replace direct `--shadow-*` use with the elevation level
that matches the surface. The `audit:motion:elevation:check` ratchet blocks new raw declarations
while allowing the existing inventory to decrease incrementally.

React Native does not consume CSS shadow recipes or cubic-bezier strings directly. The temporary
platform exception is recorded in `test/baselines/roadmap/motion-elevation.json`; P3-C owns the native
object mapping and its conformance tests.
