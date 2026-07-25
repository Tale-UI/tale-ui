import { expect, test } from '@playwright/test';

const templates = [
  'app-header',
  'chart-dashboard',
  'chat-artifact-panel',
  'chat-mobile',
  'command-palette-dashboard',
  'empty-state',
  'loading-patterns',
  'react-hook-form',
  'settings-page',
  'sidebar-header',
  'sortable-table',
  'validated-form',
];

for (const template of templates) {
  for (const appearance of ['light', 'dark']) {
    test(`${template} template renders in ${appearance}`, async ({ page }) => {
      await page.goto(
        `/iframe.html?id=roadmap-templates--${template}-template&viewMode=story&globals=colorMode:${appearance}`,
        { waitUntil: 'networkidle' },
      );
      const root = page.locator('#storybook-root');
      await expect(root).not.toContainText('No Preview', { timeout: 10_000 });
      await expect(root).not.toContainText('Failed to fetch dynamically imported module');
      await page.mouse.move(0, 0);
      await expect(page).toHaveScreenshot(`${template}-${appearance}.png`, {
        clip: (await root.boundingBox()) ?? undefined,
        fullPage: false,
      });
    });
  }
}

for (const story of [
  'components-i18nprovider--pseudo-locale',
  'components-i18nprovider--forced-rtl',
  'foundations-motion-and-elevation--transition-matrix',
  'foundations-motion-and-elevation--elevation-hierarchy',
]) {
  test(`${story} roadmap visual evidence`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story}&viewMode=story`, { waitUntil: 'networkidle' });
    const root = page.locator('#storybook-root');
    await expect(root).not.toContainText('No Preview', { timeout: 10_000 });
    await page.mouse.move(0, 0);
    await expect(page).toHaveScreenshot(`${story}.png`, {
      clip: (await root.boundingBox()) ?? undefined,
    });
  });
}
