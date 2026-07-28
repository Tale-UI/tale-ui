# React Native accessibility verification

Automated checks validate public roles, state, values, labels, announcements,
and package contracts where React Native exposes them to JavaScript.

Stable promotion additionally requires retained platform evidence:

- VoiceOver on the supported iOS baseline;
- TalkBack on the supported Android baseline;
- touch and accessible activation;
- dynamic type and long text;
- RTL ordering;
- reduced motion;
- modal entry, dismissal, background hiding, and focus return; and
- Android hardware-back behavior.

Automated adapter tests now exercise accessible button activation and pending
state, checkbox and radio selection, disclosure expansion, tab and toggle
selection, adjustable actions, progress values, live-region notifications,
modal close, and Android-style native back requests.

The Storybook has been rendered on iOS 26.5 and Android 16 simulators, and the
native Xcode and Gradle projects build successfully. These simulator results
do not replace the physical-device checklist: no VoiceOver, TalkBack, device
frame-time, or device-memory result is claimed until a human records it on
supported hardware.
