# React Native accessibility verification

Automated checks validate JavaScript-observable roles, state, values, labels,
announcements, overlay structure and callbacks, and package contracts. They do
not prove screen-reader containment, focus management, background hiding, safe
areas, keyboard avoidance, rotation behavior, or physical-device performance.

## Manual post-merge physical-device promotion checklist

This is a documentation-only checklist executed manually by humans after
merge. Post-merge evidence cannot satisfy, override, repair, or rewrite a
failed PR check.

Record the tested build identity (commit and reviewed package or application
build) and non-unique device context:

- physical iOS model family and platform version;
- physical Android model family and platform version; and
- the Storybook or reviewed application build used for the observations.

Do not record serial numbers, UDIDs, Android IDs, advertising identifiers, or
other unique device identifiers. Do not record personal or account data,
credentials, tokens, secrets, or user content.

For both VoiceOver and TalkBack, record pass, fail, unavailable, or untested
for:

- names, roles, values, states, hints, activation, and traversal order;
- interactive descendants remaining separately reachable;
- Dialog, AlertDialog, and Drawer entry, containment, background hiding, and
  traversal;
- visible close controls and platform back or close dismissal;
- observed focus entry and restoration where the platform and host support it;
- observed escape behavior without assuming an unsupported API;
- Dynamic Type or large-text rendering, clipping, truncation, and reflow;
- RTL order, alignment, reading order, and directional controls;
- reduced-motion behavior and preserved state communication;
- software and hardware keyboard interaction where supported;
- portrait and landscape rotation;
- safe-area handling around notches, status bars, and system navigation; and
- background interaction and announcement behavior while overlays are open.

Exercise representative controls, forms, overlays, and lists. Under the
existing manual performance policy, record observed interaction responsiveness,
overlay transitions, list behavior, frame-time concerns, and memory behavior.
Do not describe source inspection, simulators, Expo exports, or Metro bundles
as physical-device results.

Every failed, unavailable, or untested item keeps each affected native
component experimental and release-blocked. Checklist completion does not
automatically change lifecycle, publish a package, or promote an
implementation.
