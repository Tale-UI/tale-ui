import * as React from 'react';
import { createRenderer, fireEvent, screen, within } from '@tale-ui/monorepo-tests/test-utils';
import { act } from '@testing-library/react';
import { Outline, type OutlineItem, type OutlineProps } from './index';

type ObserverCallback = ConstructorParameters<typeof IntersectionObserver>[0];

const defaultItems = [
  { id: 'overview', targetId: 'outline-overview', label: 'Overview', level: 1 },
  { id: 'install', targetId: 'outline-install', label: 'Install', level: 2 },
  { id: 'configure', targetId: 'outline-configure', label: 'Configure', level: 2 },
  { id: 'api', targetId: 'outline-api', label: 'API', level: 1 },
] as const;

let observerInstances: ObserverMock[] = [];
let animationFrameCallbacks = new Map<number, FrameRequestCallback>();
let nextAnimationFrameId = 1;

class ObserverMock implements IntersectionObserver {
  readonly root: Element | Document | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;
  readonly observed = new Set<Element>();
  disconnectCalls = 0;
  private callback: ObserverCallback;

  constructor(callback: ObserverCallback, options: IntersectionObserverInit = {}) {
    this.callback = callback;
    this.root = options.root ?? null;
    this.rootMargin = options.rootMargin ?? '0px';
    this.thresholds = Array.isArray(options.threshold)
      ? [...options.threshold]
      : [options.threshold ?? 0];
    observerInstances.push(this);
  }

  disconnect() {
    this.disconnectCalls += 1;
    this.observed.clear();
  }

  observe(target: Element) {
    this.observed.add(target);
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  unobserve(target: Element) {
    this.observed.delete(target);
  }

  trigger(entries: IntersectionObserverEntry[]) {
    this.callback(entries, this);
  }
}

function entry(target: Element, top: number, intersectionRatio = 1): IntersectionObserverEntry {
  const rect = DOMRect.fromRect({ y: top, height: 20, width: 100 });
  return {
    boundingClientRect: rect,
    intersectionRatio,
    intersectionRect: rect,
    isIntersecting: intersectionRatio > 0,
    rootBounds: DOMRect.fromRect({ y: 0, height: 800, width: 1000 }),
    target,
    time: 0,
  };
}

function addTargets(items: readonly OutlineItem[] = defaultItems) {
  const wrapper = document.createElement('div');
  wrapper.dataset.outlineTargets = '';
  for (const item of items) {
    const heading = document.createElement(item.level === 1 ? 'h2' : 'h3');
    heading.id = item.targetId;
    wrapper.append(heading);
  }
  document.body.append(wrapper);
  return wrapper;
}

function flushAnimationFrame() {
  const callbacks = [...animationFrameCallbacks.values()];
  animationFrameCallbacks.clear();
  act(() => {
    for (const callback of callbacks) {
      callback(0);
    }
  });
}

describe('Outline', () => {
  const { render, renderToString } = createRenderer();
  const originalIntersectionObserver = globalThis.IntersectionObserver;
  const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
  const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;

  beforeEach(() => {
    observerInstances = [];
    animationFrameCallbacks = new Map();
    nextAnimationFrameId = 1;
    globalThis.IntersectionObserver = ObserverMock as unknown as typeof IntersectionObserver;
    globalThis.requestAnimationFrame = (callback) => {
      const id = nextAnimationFrameId;
      nextAnimationFrameId += 1;
      animationFrameCallbacks.set(id, callback);
      return id;
    };
    globalThis.cancelAnimationFrame = (id) => {
      animationFrameCallbacks.delete(id);
    };
  });

  afterEach(() => {
    document.querySelectorAll('[data-outline-targets]').forEach((element) => element.remove());
  });

  afterAll(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver;
    globalThis.requestAnimationFrame = originalRequestAnimationFrame;
    globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
  });

  it('renders a named landmark, nested ordered lists, owned links, and a forwarded ref', async () => {
    const ref = React.createRef<HTMLElement>();
    await render(
      <Outline
        ref={ref}
        aria-label="On this page"
        items={defaultItems}
        observeTargets={false}
        className="article-outline"
      />,
    );

    const nav = screen.getByRole('navigation', { name: 'On this page' });
    expect(ref.current).toBe(nav);
    expect(nav.classList.contains('tale-outline')).toBe(true);
    expect(nav.classList.contains('article-outline')).toBe(true);
    expect(nav.querySelectorAll(':scope > ol')).toHaveLength(1);
    expect(nav.querySelectorAll('ol')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Install' }).getAttribute('href')).toBe(
      '#outline-install',
    );
  });

  it('renders a non-landmark and disables Tale actions when naming is invalid', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const onAction = vi.fn();
    const onActiveChange = vi.fn();
    const invalidProps = {
      'aria-label': 'On this page',
      'aria-labelledby': 'outline-heading',
      items: defaultItems,
      observeTargets: false,
      onAction,
      onActiveChange,
    } as unknown as OutlineProps;
    const { container } = await render(<Outline {...invalidProps} />);

    expect(screen.queryByRole('navigation')).toBeNull();
    expect(container.querySelector('div.tale-outline')?.hasAttribute('data-invalid')).toBe(true);
    fireEvent.click(screen.getByRole('link', { name: 'Overview' }));
    expect(onAction).not.toHaveBeenCalled();
    expect(onActiveChange).not.toHaveBeenCalled();
    warning.mockRestore();
  });

  it('fails invalid item data closed while retaining only safely derived flat links', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const invalidItems = [
      { id: 'overview', targetId: 'outline-overview', label: 'Overview', level: 1 },
      { id: 'skipped', targetId: 'bad target', label: 'Skipped', level: 3 },
      { id: 'api', targetId: 'outline-api', label: 'API', level: 3 },
    ];
    const onActiveChange = vi.fn();
    const { container } = await render(
      <Outline
        aria-label="On this page"
        items={invalidItems}
        observeTargets={false}
        onActiveChange={onActiveChange}
      />,
    );

    expect(container.querySelectorAll('.tale-outline__list')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Overview' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Skipped' })).toBeNull();
    expect(screen.getByRole('link', { name: 'API' })).toBeTruthy();
    fireEvent.click(screen.getByRole('link', { name: 'API' }));
    expect(onActiveChange).not.toHaveBeenCalled();
    warning.mockRestore();
  });

  it('contains throwing item getters and derives an inert fallback from snapshots', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const throwingItem = {
      get id(): string {
        throw new Error('private item detail');
      },
      targetId: 'outline-hostile',
      label: 'Hostile',
      level: 1,
    };
    const onActiveChange = vi.fn();
    const { container } = await render(
      <Outline
        aria-label="On this page"
        items={
          [defaultItems[0], throwingItem, defaultItems[3]] as unknown as readonly OutlineItem[]
        }
        observeTargets={false}
        onActiveChange={onActiveChange}
      />,
    );

    expect(container.querySelector('.tale-outline')?.hasAttribute('data-invalid')).toBe(true);
    expect(screen.getByRole('link', { name: 'Overview' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Hostile' })).toBeNull();
    expect(screen.getByRole('link', { name: 'API' })).toBeTruthy();
    fireEvent.click(screen.getByRole('link', { name: 'API' }));
    expect(onActiveChange).not.toHaveBeenCalled();
    warning.mockRestore();
  });

  it('fails hostile item-array proxies closed without rendering partial data', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const hostileItems = new Proxy([...defaultItems], {
      get(target, property, receiver) {
        if (property === Symbol.iterator) {
          throw new Error('private array detail');
        }
        return Reflect.get(target, property, receiver);
      },
    });
    const { container } = await render(
      <Outline aria-label="On this page" items={hostileItems} observeTargets={false} />,
    );

    expect(container.querySelector('.tale-outline')?.hasAttribute('data-invalid')).toBe(true);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    warning.mockRestore();
  });

  it('runs onAction first and lets preventDefault suppress an uncontrolled proposal', async () => {
    const calls: string[] = [];
    const onActiveChange = vi.fn((id: string | null) => calls.push(`change:${id}`));
    const onAction = vi.fn((id: string, event: React.MouseEvent<HTMLAnchorElement>) => {
      calls.push(`action:${id}`);
      event.preventDefault();
    });
    await render(
      <Outline
        aria-label="On this page"
        items={defaultItems}
        observeTargets={false}
        defaultActiveId="overview"
        onAction={onAction}
        onActiveChange={onActiveChange}
      />,
    );

    fireEvent.click(screen.getByRole('link', { name: 'API' }), { button: 0 });
    expect(calls).toEqual(['action:api']);
    expect(screen.getByRole('link', { name: 'Overview' }).getAttribute('aria-current')).toBe(
      'location',
    );
    expect(screen.getByRole('link', { name: 'API' }).hasAttribute('aria-current')).toBe(false);
  });

  it('updates uncontrolled state before notifying and ignores modified activation', async () => {
    const calls: Array<string | null> = [];
    await render(
      <Outline
        aria-label="On this page"
        items={defaultItems}
        observeTargets={false}
        defaultActiveId="overview"
        onActiveChange={(id) => calls.push(id)}
      />,
    );

    fireEvent.click(screen.getByRole('link', { name: 'API' }), { ctrlKey: true });
    expect(calls).toEqual([]);
    fireEvent.click(screen.getByRole('link', { name: 'API' }), { button: 0 });
    expect(calls).toEqual(['api']);
    expect(screen.getByRole('link', { name: 'API' }).getAttribute('aria-current')).toBe('location');
  });

  it('proposes in controlled mode without projecting and recovers after an invalid omission', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const onActiveChange = vi.fn();
    const view = await render(
      <Outline
        aria-label="On this page"
        items={defaultItems}
        observeTargets={false}
        activeId="overview"
        onActiveChange={onActiveChange}
      />,
    );

    fireEvent.click(screen.getByRole('link', { name: 'API' }));
    expect(onActiveChange).toHaveBeenCalledWith('api');
    expect(screen.getByRole('link', { name: 'Overview' }).getAttribute('aria-current')).toBe(
      'location',
    );

    await view.setProps({ activeId: undefined });
    expect(screen.getByRole('navigation').hasAttribute('data-invalid')).toBe(true);
    fireEvent.click(screen.getByRole('link', { name: 'API' }));
    expect(onActiveChange).toHaveBeenCalledTimes(1);

    await view.setProps({ activeId: 'api' });
    expect(screen.getByRole('navigation').hasAttribute('data-invalid')).toBe(false);
    expect(screen.getByRole('link', { name: 'API' }).getAttribute('aria-current')).toBe('location');
    warning.mockRestore();
  });

  it('keeps a colliding first state inert until one valid mode is supplied', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const onActiveChange = vi.fn();
    const collidingProps = {
      'aria-label': 'On this page',
      items: defaultItems,
      observeTargets: false,
      activeId: 'overview',
      defaultActiveId: 'api',
      onActiveChange,
    } as unknown as OutlineProps;
    const view = await render(<Outline {...collidingProps} />);

    expect(screen.getByRole('navigation').hasAttribute('data-invalid')).toBe(true);
    fireEvent.click(screen.getByRole('link', { name: 'API' }));
    expect(onActiveChange).not.toHaveBeenCalled();

    view.setProps({ defaultActiveId: undefined });
    expect(screen.getByRole('navigation').hasAttribute('data-invalid')).toBe(false);
    expect(screen.getByRole('link', { name: 'Overview' }).getAttribute('aria-current')).toBe(
      'location',
    );
    warning.mockRestore();
  });

  it('defers uncontrolled initialization until the item generation is valid', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const invalidItems = [{ id: 'api', targetId: 'outline-api', label: 'API', level: 2 }] as const;
    const view = await render(
      <Outline
        aria-label="On this page"
        items={invalidItems}
        observeTargets={false}
        defaultActiveId="api"
      />,
    );

    expect(screen.getByRole('navigation').hasAttribute('data-invalid')).toBe(true);
    view.setProps({ items: [defaultItems[3]] });
    expect(screen.getByRole('navigation').hasAttribute('data-invalid')).toBe(false);
    expect(screen.getByRole('link', { name: 'API' }).getAttribute('aria-current')).toBe('location');
    warning.mockRestore();
  });

  it('preserves uncontrolled IDs on reorder, ignores new defaults, and clears removal once', async () => {
    const onActiveChange = vi.fn();
    const view = await render(
      <Outline
        aria-label="On this page"
        items={defaultItems}
        observeTargets={false}
        defaultActiveId="install"
        onActiveChange={onActiveChange}
      />,
    );
    const reordered = [
      defaultItems[3],
      { ...defaultItems[0], level: 1 },
      defaultItems[1],
      defaultItems[2],
    ] as const;

    await view.setProps({ items: reordered, defaultActiveId: 'api' });
    expect(screen.getByRole('link', { name: 'Install' }).getAttribute('aria-current')).toBe(
      'location',
    );
    expect(onActiveChange).not.toHaveBeenCalled();

    await view.setProps({
      items: [defaultItems[0], defaultItems[3]],
      defaultActiveId: 'api',
    });
    expect(onActiveChange).toHaveBeenCalledTimes(1);
    expect(onActiveChange).toHaveBeenCalledWith(null);
    expect(screen.queryByRole('link', { current: 'location' })).toBeNull();

    await view.setProps({
      items: [defaultItems[3], defaultItems[0]],
      defaultActiveId: 'api',
    });
    expect(onActiveChange).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('link', { current: 'location' })).toBeNull();
  });

  it('uses one owner-document observer and one pending frame with deterministic selection', async () => {
    addTargets();
    const lookup = vi.spyOn(document, 'getElementById');
    const onActiveChange = vi.fn();
    await render(
      <Outline aria-label="On this page" items={defaultItems} onActiveChange={onActiveChange} />,
    );

    const activeObservers = observerInstances.filter((observer) => observer.disconnectCalls === 0);
    expect(activeObservers).toHaveLength(1);
    const observer = activeObservers[0]!;
    expect(observer.rootMargin).toBe('0px 0px -70% 0px');
    expect(observer.thresholds).toEqual([0, 0.25, 0.5, 0.75, 1]);
    expect(observer.observed).toHaveLength(4);
    expect(lookup).toHaveBeenCalledWith('outline-overview');

    const overview = document.getElementById('outline-overview')!;
    const install = document.getElementById('outline-install')!;
    observer.trigger([entry(overview, 120), entry(install, 20)]);
    observer.trigger([entry(overview, 10), entry(install, 20)]);
    expect(animationFrameCallbacks).toHaveLength(1);
    flushAnimationFrame();

    expect(onActiveChange).toHaveBeenCalledTimes(1);
    expect(onActiveChange).toHaveBeenCalledWith('overview');
    lookup.mockRestore();
  });

  it('resolves targets and observers through the navigation owner document', async () => {
    const item = defaultItems[0];
    const globalTarget = addTargets([item]).querySelector('h2')!;
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument!;
    const frameWindow = frame.contentWindow!;
    Object.defineProperty(frameWindow, 'IntersectionObserver', {
      configurable: true,
      value: ObserverMock,
    });
    const frameTarget = frameDocument.createElement('h2');
    frameTarget.id = item.targetId;
    const mount = frameDocument.createElement('div');
    frameDocument.body.append(frameTarget, mount);
    const globalLookup = vi.spyOn(document, 'getElementById');
    const frameLookup = vi.spyOn(frameDocument, 'getElementById');

    await render(<Outline aria-label="On this page" items={[item]} />, { container: mount });

    const observer = observerInstances.find((candidate) => candidate.disconnectCalls === 0)!;
    expect(within(mount).getByRole('navigation', { name: 'On this page' }).ownerDocument).toBe(
      frameDocument,
    );
    expect(frameLookup).toHaveBeenCalledWith(item.targetId);
    expect(globalLookup).not.toHaveBeenCalledWith(item.targetId);
    expect(observer.observed.has(frameTarget)).toBe(true);
    expect(observer.observed.has(globalTarget)).toBe(false);

    globalLookup.mockRestore();
    frameLookup.mockRestore();
    frame.remove();
  });

  it('disconnects reconfigured generations and rejects their stale frame work', async () => {
    addTargets();
    const onActiveChange = vi.fn();
    const view = await render(
      <Outline aria-label="On this page" items={defaultItems} onActiveChange={onActiveChange} />,
    );
    const oldObserver = observerInstances.find((observer) => observer.disconnectCalls === 0)!;
    oldObserver.trigger([entry(document.getElementById('outline-overview')!, 10)]);

    await view.setProps({ observerRootMargin: '0px 0px -50% 0px' });
    expect(oldObserver.disconnectCalls).toBe(1);
    expect(observerInstances.filter((observer) => observer.disconnectCalls === 0)).toHaveLength(1);
    flushAnimationFrame();
    expect(onActiveChange).not.toHaveBeenCalled();
  });

  it('contains observer-root failures while preserving valid click behavior', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    addTargets();
    const onActiveChange = vi.fn();
    await render(
      <Outline
        aria-label="On this page"
        items={defaultItems}
        getObserverRoot={() => {
          throw new Error('private consumer detail');
        }}
        onActiveChange={onActiveChange}
      />,
    );

    expect(observerInstances.filter((observer) => observer.disconnectCalls === 0)).toHaveLength(0);
    fireEvent.click(screen.getByRole('link', { name: 'API' }));
    expect(onActiveChange).toHaveBeenCalledWith('api');
    warning.mockRestore();
  });

  it('contains hostile observer-root node getters while preserving click behavior', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    addTargets();
    const onActiveChange = vi.fn();
    const nodeTypeFailure = new Proxy(
      {},
      {
        get(_target, property) {
          if (property === 'nodeType') {
            throw new Error('private node detail');
          }
          return undefined;
        },
      },
    );
    const ownerDocumentFailure = new Proxy(
      { nodeType: 1 },
      {
        get(target, property, receiver) {
          if (property === 'ownerDocument') {
            throw new Error('private owner-document detail');
          }
          return Reflect.get(target, property, receiver);
        },
      },
    );
    const view = await render(
      <Outline
        aria-label="On this page"
        items={defaultItems}
        getObserverRoot={() => nodeTypeFailure as unknown as Element}
        onActiveChange={onActiveChange}
      />,
    );

    expect(observerInstances.filter((observer) => observer.disconnectCalls === 0)).toHaveLength(0);
    fireEvent.click(screen.getByRole('link', { name: 'API' }));
    expect(onActiveChange).toHaveBeenLastCalledWith('api');

    await view.setProps({
      getObserverRoot: () => ownerDocumentFailure as unknown as Element,
    });
    expect(observerInstances.filter((observer) => observer.disconnectCalls === 0)).toHaveLength(0);
    fireEvent.click(screen.getByRole('link', { name: 'Overview' }));
    expect(onActiveChange).toHaveBeenLastCalledWith('overview');
    warning.mockRestore();
  });

  it('disables only observation for invalid observer settings', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const onActiveChange = vi.fn();
    await render(
      <Outline
        aria-label="On this page"
        items={defaultItems}
        observerThreshold={2}
        onActiveChange={onActiveChange}
      />,
    );

    expect(observerInstances).toHaveLength(0);
    fireEvent.click(screen.getByRole('link', { name: 'API' }));
    expect(onActiveChange).toHaveBeenCalledWith('api');
    warning.mockRestore();
  });

  it('contains throwing threshold iterators and disables only observation', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const hostileThresholds = new Proxy([0, 0.5, 1], {
      get(target, property, receiver) {
        if (property === Symbol.iterator) {
          throw new Error('private threshold detail');
        }
        return Reflect.get(target, property, receiver);
      },
    });
    const onActiveChange = vi.fn();
    await render(
      <Outline
        aria-label="On this page"
        items={defaultItems}
        observerThreshold={hostileThresholds}
        onActiveChange={onActiveChange}
      />,
    );

    expect(observerInstances).toHaveLength(0);
    fireEvent.click(screen.getByRole('link', { name: 'API' }));
    expect(onActiveChange).toHaveBeenCalledWith('api');
    warning.mockRestore();
  });

  it('runtime-strips dangerous HTML and preserves deterministic SSR hydration output', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const unsafe = {
      dangerouslySetInnerHTML: { __html: '<img src=x onerror=alert(1)>' },
    };
    const view = renderToString(
      <Outline
        {...unsafe}
        aria-label="On this page"
        items={defaultItems}
        observeTargets={false}
        defaultActiveId="overview"
      />,
    );

    expect(document.querySelector('img')).toBeNull();
    expect(screen.getByRole('link', { name: 'Overview' }).getAttribute('aria-current')).toBe(
      'location',
    );
    const hydrated = view.hydrate();
    expect(document.querySelector('img')).toBeNull();
    expect(screen.getByRole('navigation', { name: 'On this page' })).toBeTruthy();
    hydrated.unmount();
    warning.mockRestore();
  });
});
