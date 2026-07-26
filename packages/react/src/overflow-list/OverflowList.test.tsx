import * as React from 'react';
import { act, createRenderer, screen } from '@tale-ui/monorepo-tests/test-utils';
import { OverflowList, type OverflowListProps } from './index';

interface Item {
  id: React.Key;
  label: string;
}

const items: readonly Item[] = [
  { id: 'edit', label: 'Edit' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'archive', label: 'Archive' },
];

let animationFrameCallbacks = new Map<number, FrameRequestCallback>();
let nextAnimationFrameId = 1;
let resizeCallbacks: ResizeObserverCallback[] = [];
let rootWidth = 160;

class ResizeObserverMock implements ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    resizeCallbacks.push(callback);
  }

  disconnect() {}
  observe() {}
  unobserve() {}
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

function settleMeasurements() {
  for (let index = 0; index < 6; index += 1) {
    flushAnimationFrame();
  }
}

function triggerResize() {
  act(() => {
    for (const callback of resizeCallbacks) {
      callback([], {} as ResizeObserver);
    }
  });
}

function rect(width: number, height = 24): DOMRect {
  return {
    bottom: height,
    height,
    left: 0,
    right: width,
    top: 0,
    width,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  };
}

function createProps(overrides: Partial<OverflowListProps<Item>> = {}): OverflowListProps<Item> {
  return {
    items,
    getKey: (item) => item.id,
    renderItem: (item) => <button>{item.label}</button>,
    renderOverflow: (hidden, { overflowControlRef }) => (
      <button ref={overflowControlRef}>More {hidden.length}</button>
    ),
    ...overrides,
  };
}

describe('OverflowList', () => {
  const { render, renderToString } = createRenderer({ strict: false });
  const originalResizeObserver = globalThis.ResizeObserver;
  const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
  const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;
  const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;

  beforeEach(() => {
    animationFrameCallbacks = new Map();
    nextAnimationFrameId = 1;
    resizeCallbacks = [];
    rootWidth = 160;
    globalThis.ResizeObserver = ResizeObserverMock;
    globalThis.requestAnimationFrame = (callback) => {
      const id = nextAnimationFrameId;
      nextAnimationFrameId += 1;
      animationFrameCallbacks.set(id, callback);
      return id;
    };
    globalThis.cancelAnimationFrame = (id) => {
      animationFrameCallbacks.delete(id);
    };
    HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
      if (this.classList.contains('tale-overflow-list')) {
        return rect(rootWidth);
      }
      if (this.classList.contains('tale-overflow-list__item')) {
        return rect(60);
      }
      if (this.matches('[data-cycle-control]')) {
        return rect(this.textContent?.includes('3') ? 0 : 100);
      }
      if (this.matches('[data-testid="overflow-control"]')) {
        return rect(40);
      }
      return rect(0);
    };
  });

  afterAll(() => {
    globalThis.ResizeObserver = originalResizeObserver;
    globalThis.requestAnimationFrame = originalRequestAnimationFrame;
    globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
    HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('renders all items first with a merged class and forwarded root ref', async () => {
    const ref = React.createRef<HTMLDivElement>();
    await render(<OverflowList {...createProps()} ref={ref} className="consumer-list" />);

    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
      'Edit',
      'Duplicate',
      'Archive',
    ]);
    expect(screen.queryByRole('button', { name: /More/ })).toBeNull();
    expect(ref.current?.classList.contains('tale-overflow-list')).toBe(true);
    expect(ref.current?.classList.contains('consumer-list')).toBe(true);
    expect(ref.current?.tabIndex).toBe(-1);
  });

  it('invokes each key accessor and item renderer once per non-strict collection render', async () => {
    const getKey = vi.fn((item: Item) => item.id);
    const renderItem = vi.fn((item: Item) => <button>{item.label}</button>);

    await render(<OverflowList {...createProps({ getKey, renderItem })} />);

    expect(getKey).toHaveBeenCalledTimes(items.length);
    expect(renderItem).toHaveBeenCalledTimes(items.length);
  });

  it('renders an empty root for a non-array collection without invoking callbacks', async () => {
    const getKey = vi.fn();
    const renderItem = vi.fn();
    const renderOverflow = vi.fn();
    const onVisibilityChange = vi.fn();
    const invalid = createProps({
      getKey,
      renderItem,
      renderOverflow,
      onVisibilityChange,
    }) as unknown as OverflowListProps<Item>;
    Object.assign(invalid, { items: { length: 3 } });

    const { container } = await render(<OverflowList {...invalid} />);

    expect(container.querySelector('.tale-overflow-list')?.children).toHaveLength(0);
    expect(getKey).not.toHaveBeenCalled();
    expect(renderItem).not.toHaveBeenCalled();
    expect(renderOverflow).not.toHaveBeenCalled();
    expect(onVisibilityChange).not.toHaveBeenCalled();
  });

  it('renders an empty root when renderItem is not a function', async () => {
    const getKey = vi.fn();
    const invalid = createProps({ getKey }) as unknown as OverflowListProps<Item>;
    Object.assign(invalid, { renderItem: null });

    const { container } = await render(<OverflowList {...invalid} />);

    expect(container.querySelector('.tale-overflow-list')?.children).toHaveLength(0);
    expect(getKey).not.toHaveBeenCalled();
  });

  it.each([
    ['missing accessor', { getKey: null }],
    [
      'thrown accessor',
      { getKey: (item: Item) => (item.label === 'Duplicate' ? fail() : item.id) },
    ],
    ['unsupported key', { getKey: () => Number.NaN }],
    ['duplicate keys', { getKey: () => 'duplicate' }],
    ['invalid minimum', { minVisibleItems: -1 }],
    ['invalid measurement key', { measurementKey: Number.POSITIVE_INFINITY }],
    ['missing overflow renderer', { renderOverflow: null }],
  ])('renders every item without measurement for %s', async (_name, override) => {
    const renderItem = vi.fn((item: Item) => <button>{item.label}</button>);
    const renderOverflow = vi.fn();
    const onVisibilityChange = vi.fn();
    const props = createProps({
      renderItem,
      renderOverflow,
      onVisibilityChange,
      ...override,
    } as Partial<OverflowListProps<Item>>) as unknown as OverflowListProps<Item>;

    await render(<OverflowList {...props} />);
    settleMeasurements();

    expect(screen.getAllByRole('button')).toHaveLength(items.length);
    expect(renderItem).toHaveBeenCalledTimes(items.length);
    expect(renderOverflow).not.toHaveBeenCalled();
    expect(onVisibilityChange).not.toHaveBeenCalled();
    expect(resizeCallbacks).toHaveLength(0);
  });

  it('treats 0 and -0 as duplicates while preserving cross-type key identity', async () => {
    const numericItems = [
      { id: 0, label: 'Zero' },
      { id: -0, label: 'Negative zero' },
    ];
    const onInvalidVisibilityChange = vi.fn();
    const invalidProps = createProps({
      items: numericItems,
      onVisibilityChange: onInvalidVisibilityChange,
    });
    const { rerender } = await render(<OverflowList {...invalidProps} />);
    settleMeasurements();
    expect(onInvalidVisibilityChange).not.toHaveBeenCalled();

    const distinctItems = [
      { id: '1', label: 'String' },
      { id: 1, label: 'Number' },
      { id: 1n, label: 'Bigint' },
    ];
    const onValidVisibilityChange = vi.fn();
    await rerender(
      <OverflowList
        {...createProps({
          items: distinctItems,
          onVisibilityChange: onValidVisibilityChange,
        })}
      />,
    );
    settleMeasurements();
    expect(onValidVisibilityChange).toHaveBeenCalledOnce();
  });

  it('runtime-strips raw HTML and owns tabIndex', async () => {
    const props = {
      ...createProps(),
      dangerouslySetInnerHTML: { __html: '<img src=x alt="unsafe">' },
      tabIndex: 9,
    } as unknown as OverflowListProps<Item>;

    const { container } = await render(<OverflowList {...props} />);

    const root = container.querySelector<HTMLDivElement>('.tale-overflow-list');
    expect(root?.querySelector('img')).toBeNull();
    expect(root?.tabIndex).toBe(-1);
    expect(screen.getByRole('button', { name: 'Edit' })).not.toBeNull();
  });

  it('keeps SSR and the first hydrated render expanded', () => {
    const view = renderToString(<OverflowList {...createProps()} />);

    expect(screen.getAllByRole('button')).toHaveLength(items.length);
    expect(screen.queryByRole('button', { name: /More/ })).toBeNull();

    const hydrated = view.hydrate();
    expect(screen.getAllByRole('button')).toHaveLength(items.length);
    hydrated.unmount();
  });

  it('settles end and start partitions with one overflow-control tree', async () => {
    const renderOverflow = vi.fn((hidden: readonly Item[], context) => (
      <button ref={context.overflowControlRef} data-testid="overflow-control">
        More {hidden.length}
      </button>
    ));
    const onVisibilityChange = vi.fn();
    const { rerender } = await render(
      <OverflowList {...createProps({ renderOverflow, onVisibilityChange })} />,
    );

    settleMeasurements();

    expect(
      screen.getByText('Edit').closest('.tale-overflow-list__item')?.hasAttribute('hidden'),
    ).toBe(false);
    expect(
      screen.getByText('Duplicate').closest('.tale-overflow-list__item')?.hasAttribute('hidden'),
    ).toBe(false);
    expect(
      screen.getByText('Archive').closest('.tale-overflow-list__item')?.hasAttribute('hidden'),
    ).toBe(true);
    expect(screen.getAllByTestId('overflow-control')).toHaveLength(1);
    expect(onVisibilityChange).toHaveBeenLastCalledWith([items[0], items[1]], [items[2]]);

    await rerender(
      <OverflowList
        {...createProps({ collapseFrom: 'start', renderOverflow, onVisibilityChange })}
      />,
    );
    settleMeasurements();

    expect(
      screen.getByText('Edit').closest('.tale-overflow-list__item')?.hasAttribute('hidden'),
    ).toBe(true);
    expect(
      screen.getByText('Duplicate').closest('.tale-overflow-list__item')?.hasAttribute('hidden'),
    ).toBe(false);
    expect(
      screen.getByText('Archive').closest('.tale-overflow-list__item')?.hasAttribute('hidden'),
    ).toBe(false);
    expect(screen.getAllByTestId('overflow-control')).toHaveLength(1);
  });

  it('falls invalid collapseFrom back to end collapse', async () => {
    const props = {
      ...createProps({
        renderOverflow: (hidden, context) => (
          <button ref={context.overflowControlRef} data-testid="overflow-control">
            More {hidden.length}
          </button>
        ),
      }),
      collapseFrom: 'middle',
    } as unknown as OverflowListProps<Item>;
    await render(<OverflowList {...props} />);
    settleMeasurements();

    expect(
      screen.getByText('Edit').closest('.tale-overflow-list__item')?.hasAttribute('hidden'),
    ).toBe(false);
    expect(
      screen.getByText('Archive').closest('.tale-overflow-list__item')?.hasAttribute('hidden'),
    ).toBe(true);
  });

  it('retains the minimum and control when they cannot fit', async () => {
    rootWidth = 20;
    await render(
      <OverflowList
        {...createProps({
          minVisibleItems: 2,
          renderOverflow: (hidden, context) => (
            <button ref={context.overflowControlRef} data-testid="overflow-control">
              More {hidden.length}
            </button>
          ),
        })}
      />,
    );
    settleMeasurements();

    expect(
      screen
        .getAllByRole('button')
        .filter((button) => button.closest('.tale-overflow-list__item:not([hidden])')),
    ).toHaveLength(2);
    expect(screen.getAllByTestId('overflow-control')).toHaveLength(1);
  });

  it('renders all items for a zero-width root and retries on resize', async () => {
    rootWidth = 0;
    const onVisibilityChange = vi.fn();
    await render(<OverflowList {...createProps({ onVisibilityChange })} />);
    settleMeasurements();

    expect(
      screen
        .getAllByRole('button')
        .filter((button) => button.closest('.tale-overflow-list__item:not([hidden])')),
    ).toHaveLength(3);
    expect(onVisibilityChange).not.toHaveBeenCalled();

    rootWidth = 160;
    triggerResize();
    settleMeasurements();
    expect(onVisibilityChange).toHaveBeenCalledOnce();
  });

  it('publishes only settled ordered partitions and suppresses unchanged resize callbacks', async () => {
    const onVisibilityChange = vi.fn();
    await render(
      <OverflowList
        {...createProps({
          onVisibilityChange,
          renderOverflow: (hidden, context) => (
            <button ref={context.overflowControlRef} data-testid="overflow-control">
              More {hidden.length}
            </button>
          ),
        })}
      />,
    );
    settleMeasurements();

    expect(onVisibilityChange).toHaveBeenCalledTimes(1);
    triggerResize();
    settleMeasurements();
    expect(onVisibilityChange).toHaveBeenCalledTimes(1);

    rootWidth = 400;
    triggerResize();
    settleMeasurements();
    expect(onVisibilityChange).toHaveBeenCalledTimes(2);
    expect(onVisibilityChange).toHaveBeenLastCalledWith(items, []);
  });

  it('continues measurement when the runtime visibility callback is not a function', async () => {
    const props = {
      ...createProps({
        renderOverflow: (hidden, context) => (
          <button ref={context.overflowControlRef} data-testid="overflow-control">
            More {hidden.length}
          </button>
        ),
      }),
      onVisibilityChange: 'invalid',
    } as unknown as OverflowListProps<Item>;
    await render(<OverflowList {...props} />);

    settleMeasurements();

    expect(screen.getByTestId('overflow-control')).not.toBeNull();
    expect(
      screen.getByText('Archive').closest('.tale-overflow-list__item')?.hasAttribute('hidden'),
    ).toBe(true);
  });

  it('stops a control-width partition cycle without duplicating the control tree', async () => {
    rootWidth = 150;
    const renderOverflow = vi.fn((hidden: readonly Item[], context) => (
      <button ref={context.overflowControlRef} data-cycle-control="">
        Cycle {hidden.length}
      </button>
    ));
    const onVisibilityChange = vi.fn();
    await render(<OverflowList {...createProps({ renderOverflow, onVisibilityChange })} />);

    settleMeasurements();

    expect(screen.getAllByText(/Cycle/)).toHaveLength(1);
    expect(renderOverflow.mock.calls.length).toBeLessThanOrEqual(3);
    expect(onVisibilityChange).toHaveBeenCalledOnce();
  });

  it('hands focus to the overflow control and restores the exact descendant on expansion', async () => {
    rootWidth = 400;
    await render(
      <OverflowList
        {...createProps({
          renderOverflow: (hidden, context) => (
            <button ref={context.overflowControlRef} data-testid="overflow-control">
              More {hidden.length}
            </button>
          ),
        })}
      />,
    );
    settleMeasurements();
    const archive = screen.getByRole('button', { name: 'Archive' });
    archive.focus();

    rootWidth = 160;
    triggerResize();
    settleMeasurements();
    expect(screen.getByTestId('overflow-control')).toHaveFocus();

    rootWidth = 400;
    triggerResize();
    settleMeasurements();
    expect(archive).toHaveFocus();
  });

  it('does not restore focus after the user moves it', async () => {
    rootWidth = 400;
    await render(
      <OverflowList
        {...createProps({
          renderOverflow: (hidden, context) => (
            <button ref={context.overflowControlRef} data-testid="overflow-control">
              More {hidden.length}
            </button>
          ),
        })}
      />,
    );
    settleMeasurements();
    const archive = screen.getByRole('button', { name: 'Archive' });
    archive.focus();

    rootWidth = 160;
    triggerResize();
    settleMeasurements();
    screen.getByRole('button', { name: 'Edit' }).focus();

    rootWidth = 400;
    triggerResize();
    settleMeasurements();
    expect(archive).not.toHaveFocus();
    expect(screen.getByRole('button', { name: 'Edit' })).toHaveFocus();
  });
});

function fail(): never {
  throw new Error('access failed');
}
