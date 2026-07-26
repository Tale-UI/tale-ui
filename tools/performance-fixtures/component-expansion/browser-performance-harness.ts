import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { chromium, type Browser, type BrowserContext, type Page } from '@playwright/test';
import { createServer, type ViteDevServer } from 'vite';

const REPOSITORY_ROOT = resolve(process.cwd());

/**
 * Reuses the expensive Vite and Chromium processes while giving every sample
 * an isolated browser context and page.
 */
class BrowserPerformanceHarness {
  private browser: Browser | null = null;
  private server: ViteDevServer | null = null;
  private baseUrl = '';
  private starting: Promise<void> | null = null;

  private async start() {
    if (this.browser && this.server) {
      return;
    }
    if (this.starting) {
      await this.starting;
      return;
    }

    this.starting = (async () => {
      const server = await createServer({
        root: REPOSITORY_ROOT,
        appType: 'mpa',
        logLevel: 'silent',
        // Clean performance captures do not prebuild private workspace packages.
        // Mirror their source export targets so browser fixtures can use the
        // public package spellings that package tests also verify.
        resolve: {
          alias: {
            '@tale-ui/react': resolve(REPOSITORY_ROOT, 'packages/react/src'),
            '@tale-ui/utils': resolve(REPOSITORY_ROOT, 'packages/utils/src'),
            react: resolve(REPOSITORY_ROOT, 'node_modules/react'),
            'react-dom': resolve(REPOSITORY_ROOT, 'node_modules/react-dom'),
          },
          dedupe: ['react', 'react-dom'],
        },
        server: {
          host: '127.0.0.1',
          hmr: false,
          port: 0,
          strictPort: false,
        },
      });
      try {
        await server.listen();
        const baseUrl = server.resolvedUrls?.local[0];
        assert.ok(baseUrl, 'The component-performance Vite server must expose a local URL');
        const browser = await chromium.launch({ headless: true });
        this.server = server;
        this.browser = browser;
        this.baseUrl = baseUrl;
      } catch (error) {
        await server.close();
        throw error;
      }
    })();

    try {
      await this.starting;
    } finally {
      this.starting = null;
    }
  }

  async withFreshPage<T>(path: string, run: (page: Page) => Promise<T>): Promise<T> {
    await this.start();
    assert.ok(this.browser);
    let context: BrowserContext | null = null;
    try {
      context = await this.browser.newContext();
      const page = await context.newPage();
      await page.goto(new URL(path, this.baseUrl).href, { waitUntil: 'networkidle' });
      return await run(page);
    } finally {
      await context?.close();
    }
  }

  async close() {
    if (this.starting) {
      await this.starting;
    }
    const browser = this.browser;
    const server = this.server;
    this.browser = null;
    this.server = null;
    this.baseUrl = '';
    await browser?.close();
    await server?.close();
  }
}

export const componentPerformanceBrowserHarness = new BrowserPerformanceHarness();
