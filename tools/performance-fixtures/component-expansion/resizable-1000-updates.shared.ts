export const RESIZABLE_UPDATE_COUNT = 1_000;

export const resizableSetup = Object.freeze({
  root: Object.freeze({
    left: 0,
    top: 0,
    width: 900,
    height: 240,
  }),
  orientation: 'horizontal',
  direction: 'ltr',
  defaultSizes: Object.freeze({ A: 40, B: 30, C: 30 }),
  bounds: Object.freeze({
    A: Object.freeze({ min: 20, max: 60 }),
    B: Object.freeze({ min: 20, max: 50 }),
    C: Object.freeze({ min: 10, max: 50 }),
  }),
  activeHandle: Object.freeze({
    id: 'h-ab',
    before: 'A',
    after: 'B',
  }),
  keyboardStep: 1,
  keyboardLargeStep: 10,
  precision: 4,
  pointer: Object.freeze({
    id: 1,
    button: 0,
    origin: Object.freeze({ clientX: 360, clientY: 20 }),
    completion: Object.freeze({ clientX: 450, clientY: 20 }),
  }),
});

export const resizablePositions = Object.freeze(
  Array.from({ length: RESIZABLE_UPDATE_COUNT }, (_, index) =>
    Object.freeze({
      clientX: 360 + 0.09 * (index + 1),
      clientY: 20,
    }),
  ),
);

export const resizableTimedBoundary = Object.freeze({
  clock: 'page:window.performance',
  operationCount: RESIZABLE_UPDATE_COUNT,
  included: Object.freeze([
    'one synchronous React.act',
    'one pointermove delivery',
    'resulting React render and callbacks',
  ]),
  excluded: Object.freeze([
    'Vite and Chromium startup',
    'fresh browser context and page creation',
    'component import and initial mount',
    'pointerdown acquisition',
    'pointerup completion',
    'final settlement and assertions',
  ]),
});
