# RFC: Experimental AppShell

- Status: Approved
- Date: 2026-07-25
- Approval: Repository owner delegated implementation authority
- Evidence: `analysis/app-shell/candidate-dispositions.json`

## Decision

Ship an experimental `AppShell` namespace containing `Root`, `Header`,
`Sidebar`, `Main`, `MobileNavigation`, and `SkipLink`. Defer `SecondaryPanel`
and a resizable-region adapter until repeated templates demonstrate their
landmark, resizing, persistence, RTL, and responsive contracts.

The approved family is structural. It must not own routing, route content,
data loading, authentication, authorization, navigation state, application
state, persistence, media-query subscriptions, or modal focus management.
`Sidebar`, `HeaderNav`, and `Drawer` remain the interaction components that
consumers compose inside the shell.

## API boundaries

- `Root` renders deterministic grid markup and applies no viewport reads.
- `Header` and `Sidebar` are placement slots for the existing `HeaderNav` and
  `Sidebar` landmarks; `Main` renders the main landmark.
- `Main` defaults to `id="main-content"` so `SkipLink` has a stable target.
- `MobileNavigation` renders a labelled navigation region whose visibility is
  controlled by responsive CSS.
- `SkipLink` defaults to `href="#main-content"` and becomes visible on focus.
- Every part forwards native element props and refs.

There is intentionally no shell controller. With no internal presentation
state, instance/revision scoping, stale update rejection, subscription
cleanup, and persistence reconciliation are satisfied by absence: the
application remains the sole state owner. Interactive mobile navigation must
use `Drawer` or `HeaderNav`, which already owns escape and focus behavior.

## Accessibility and compatibility

DOM reading order remains skip link, header, sidebar, main, then optional
mobile navigation regardless of visual grid placement. Logical CSS
properties support RTL. The desktop shell collapses to one column without
removing landmarks. Focus styles and reduced-motion behavior do not depend on
animation. Server and client render the same tree.

## Promotion

The namespace remains experimental until at least two independently packed
templates use it, keyboard/zoom/RTL checks are retained, and no product state
has migrated into the family.
