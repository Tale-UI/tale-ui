/**
 * storybook.spec.ts — Visual regression snapshots for Tale UI components.
 *
 * Each test navigates to a Storybook story iframe and takes a screenshot.
 * On the first run the screenshot is saved as a baseline (committed to the repo
 * inside test/visual/snapshots/). On subsequent runs it is compared against the
 * baseline; the test fails if the pixel diff exceeds the threshold defined in
 * playwright.config.ts (0.3% of total pixels).
 *
 * Coverage: one "Default" story per component — enough to catch token/CSS
 * regressions without requiring all variants.
 *
 * Story ID format: "<category>-<component>--<story>" (all lowercase, spaces → hyphens).
 * e.g. title "Components/Button" + export "Default" → "components-button--default"
 *
 * Updating baselines:
 *   pnpm test:visual -- --update-snapshots
 */

import { test, expect } from '@playwright/test';

// ─── Story list ───────────────────────────────────────────────────────────────
// One Default story per component. Story IDs are derived from Meta.title and
// the exported story name. Adjust if a component's Storybook title differs.
const STORIES: { id: string; label: string; variant?: string; fullViewport?: boolean }[] = [
  // Form Controls
  { id: 'components-button--default', label: 'Button' },
  { id: 'components-buttongroup--default', label: 'ButtonGroup' },
  { id: 'components-input--default', label: 'Input' },
  { id: 'components-checkbox--default', label: 'Checkbox' },
  { id: 'components-checkboxfield--default', label: 'CheckboxField' },
  { id: 'components-checkboxgroup--default', label: 'CheckboxGroup' },
  { id: 'components-radio--default', label: 'Radio' },
  { id: 'components-radiofield--default', label: 'RadioField' },
  { id: 'components-radiogroup--default', label: 'RadioGroup' },
  { id: 'components-switch--default', label: 'Switch' },
  { id: 'components-switchfield--default', label: 'SwitchField' },
  { id: 'components-togglebutton--default', label: 'ToggleButton' },
  { id: 'components-select--default', label: 'Select' },
  { id: 'components-combobox--default', label: 'Combobox' },
  { id: 'components-autocomplete--default', label: 'Autocomplete' },
  { id: 'components-numberfield--default', label: 'NumberField' },
  { id: 'components-slider--default', label: 'Slider' },
  { id: 'components-searchfield--default', label: 'SearchField' },
  { id: 'components-textfield--default', label: 'TextField' },
  { id: 'components-textarea--default', label: 'TextArea' },
  { id: 'components-paymentinput--default', label: 'PaymentInput' },
  { id: 'components-pininput--default', label: 'PinInput' },
  { id: 'components-selectnative--default', label: 'SelectNative' },
  // Date & Time
  { id: 'components-datefield--default', label: 'DateField' },
  { id: 'components-datepicker--default', label: 'DatePicker' },
  { id: 'components-timefield--default', label: 'TimeField' },
  { id: 'components-timestamp--default', label: 'Timestamp' },
  // Layout
  { id: 'components-accordion--default', label: 'Accordion' },
  { id: 'components-aspectratio--default', label: 'AspectRatio' },
  { id: 'components-card--default', label: 'Card' },
  { id: 'components-disclosure--default', label: 'Disclosure' },
  { id: 'components-tabs--default', label: 'Tabs' },
  { id: 'components-separator--default', label: 'Separator' },
  { id: 'components-overflowlist--default', label: 'OverflowList' },
  { id: 'components-overflowlist--measured', label: 'OverflowList', variant: 'Measured' },
  { id: 'components-resizable--default', label: 'Resizable' },
  { id: 'components-resizable--vertical', label: 'Resizable', variant: 'Vertical' },
  // Overlay
  { id: 'components-dialog--default', label: 'Dialog' },
  { id: 'components-popover--default', label: 'Popover' },
  { id: 'components-tooltip--default', label: 'Tooltip' },
  { id: 'components-lightbox--default', label: 'Lightbox' },
  {
    id: 'components-lightbox--open',
    label: 'Lightbox',
    variant: 'Open',
    fullViewport: true,
  },
  // Navigation
  { id: 'components-menu--default', label: 'Menu' },
  { id: 'components-breadcrumbs--default', label: 'Breadcrumbs' },
  { id: 'components-outline--default', label: 'Outline' },
  { id: 'components-pagination--default', label: 'Pagination' },
  // Feedback
  { id: 'components-progressbar--default', label: 'ProgressBar' },
  { id: 'components-meter--default', label: 'Meter' },
  { id: 'components-skeleton--default', label: 'Skeleton' },
  { id: 'components-spinner--default', label: 'Spinner' },
  { id: 'components-banner--default', label: 'Banner' },
  // Display
  { id: 'components-avatar--default', label: 'Avatar' },
  { id: 'components-badge--default', label: 'Badge' },
  { id: 'components-table--default', label: 'Table' },
  { id: 'components-taggroup--default', label: 'TagGroup' },
  // Utility
  { id: 'components-icon--default', label: 'Icon' },
  { id: 'components-iconbutton--default', label: 'IconButton' },
  // Typography
  { id: 'components-blockquote--default', label: 'Blockquote' },
  { id: 'components-citation--default', label: 'Citation' },
  { id: 'components-code--default', label: 'Code' },
  { id: 'components-markdown--default', label: 'Markdown' },
  { id: 'components-text--default', label: 'Text' },
];

// ─── Test factory ─────────────────────────────────────────────────────────────

for (const { id, label, variant = 'Default', fullViewport = false } of STORIES) {
  test(`${label} ${variant} story`, async ({ page }) => {
    // The Storybook dev server serves the preview at /iframe.html and has no
    // /iframe route (404). Static builds may redirect /iframe.html → /iframe;
    // page.goto follows that redirect, so /iframe.html works in both modes.
    await page.goto(`/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle' });

    // Guard: verify the story actually rendered — if the lazy bundle wasn't
    // found, Storybook shows a "No Preview" placeholder in #storybook-root
    await expect(page.locator('#storybook-root')).not.toContainText('No Preview', {
      timeout: 10_000,
    });

    await page.evaluate(async () => {
      await document.fonts.ready;
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
    });

    // Move mouse offscreen to avoid hover states
    await page.mouse.move(0, 0);

    // Capture and compare against baseline
    const clip = fullViewport ? undefined : await page.locator('#storybook-root').boundingBox();
    await expect(page).toHaveScreenshot(`${id}.png`, clip ? { clip } : {});
  });
}
