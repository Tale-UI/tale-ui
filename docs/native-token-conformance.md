# Native token conformance

`@tale-ui/tokens/native` exports typed light and dark token objects generated
from the same `tokens.json` source as web CSS. Native examples consume those
objects directly; this roadmap does not add a native component package.

## Appearance and high contrast

Select `nativeTokenModes.light` or `nativeTokenModes.dark` from the platform
appearance setting. Treat high contrast as a platform behavior layer:

- preserve semantic accessibility roles and labels;
- prefer operating-system colors and contrast settings when available;
- keep text/background pairs at WCAG contrast;
- do not infer high contrast by reversing the entire palette; and
- test the example in iOS Increase Contrast and Android high-contrast text.

The deterministic report in `registry/conformance/report.json` lists every
portable token and every platform exception. Exceptions expire within 180
days and block the conformance check when stale or unmatched.

## Motion

Duration tokens are numeric milliseconds. Semantic CSS easing curves map to
the equivalent native animation-driver easing function because React Native
does not consume CSS cubic-bezier strings directly. Reduced-motion settings
must bypass non-essential movement and retain state changes.

## Elevation

Use the semantic flat, raised, floating, overlay, modal, and toast hierarchy.
Map each role to an owned iOS shadow/Android elevation recipe; do not parse CSS
multi-shadow strings at runtime.

## Scrims

Resolve the active neutral color and apply the documented scrim alpha using
the platform color API. CSS relative `rgb()` expressions are intentionally
reported as platform exceptions.

## Example

See `examples/react-native/TokenCard.tsx`. It demonstrates appearance
selection, spacing, radius, colors, and typography without introducing a
native component abstraction.
