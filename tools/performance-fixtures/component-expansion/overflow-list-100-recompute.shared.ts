export const OVERFLOW_LIST_ITEM_COUNT = 100;
export const OVERFLOW_LIST_ITEM_WIDTH = 36;
export const OVERFLOW_LIST_GAP = 4;
export const OVERFLOW_LIST_CONTROL_WIDTH = 44;
export const OVERFLOW_LIST_INITIAL_WIDTH = 83;
export const OVERFLOW_LIST_MEASUREMENT_KEY = 'benchmark-v1';

export const overflowListKeys = Array.from(
  { length: OVERFLOW_LIST_ITEM_COUNT },
  (_, index) => `item-${String(index).padStart(3, '0')}`,
);

export const overflowListWidths = Array.from(
  { length: OVERFLOW_LIST_ITEM_COUNT },
  (_, index) => 84 + 40 * index,
);

export function expectedOverflowListVisibleCount(width: number) {
  const allItemsWidth =
    OVERFLOW_LIST_ITEM_COUNT * OVERFLOW_LIST_ITEM_WIDTH +
    (OVERFLOW_LIST_ITEM_COUNT - 1) * OVERFLOW_LIST_GAP;
  if (width >= allItemsWidth) {
    return OVERFLOW_LIST_ITEM_COUNT;
  }
  return Math.max(
    0,
    Math.min(
      OVERFLOW_LIST_ITEM_COUNT - 1,
      Math.floor(
        (width - OVERFLOW_LIST_CONTROL_WIDTH) / (OVERFLOW_LIST_ITEM_WIDTH + OVERFLOW_LIST_GAP),
      ),
    ),
  );
}

export const overflowListExpectedVisibleCounts = overflowListWidths.map(
  expectedOverflowListVisibleCount,
);

export const overflowListExpectedCallbackCounts = [
  ...Array.from({ length: 98 }, (_, index) => index + 1),
  100,
];
