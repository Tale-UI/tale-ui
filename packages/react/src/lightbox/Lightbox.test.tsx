import * as React from 'react';
import { expect } from 'chai';
import {
  act,
  fireEvent,
  flushMicrotasks,
  screen,
  waitFor,
} from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer } from '#test-utils';
import { Lightbox } from './index';

const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;
let frameId = 0;
let frameTimers = new Map<number, ReturnType<typeof setTimeout>>();

beforeEach(() => {
  frameTimers = new Map();
  globalThis.requestAnimationFrame = (callback) => {
    frameId += 1;
    const id = frameId;
    frameTimers.set(
      id,
      setTimeout(() => {
        frameTimers.delete(id);
        callback(Date.now());
      }, 0),
    );
    return id;
  };
  globalThis.cancelAnimationFrame = (id) => {
    const timer = frameTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      frameTimers.delete(id);
    }
  };
});

afterEach(() => {
  for (const timer of frameTimers.values()) {
    clearTimeout(timer);
  }
  frameTimers.clear();
  globalThis.requestAnimationFrame = originalRequestAnimationFrame;
  globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
});

const items = [
  { id: 'one', label: 'First image' },
  { id: 'two', label: 'Second image' },
  { id: 'three', label: 'Third image' },
] as const;

function TestLightbox({
  defaultOpen,
  defaultSelectedKey,
  loop,
}: {
  defaultOpen?: boolean;
  defaultSelectedKey?: React.Key | null;
  loop?: boolean;
}) {
  return (
    <Lightbox.Root
      items={items}
      getKey={(item) => item.id}
      getLabel={(item) => item.label}
      renderContent={(item, context) => (
        <span data-testid="content">
          {item.label} ({context.index + 1}/{context.count})
        </span>
      )}
      defaultOpen={defaultOpen}
      defaultSelectedKey={defaultSelectedKey}
      loop={loop}
    >
      {items.map((item) => (
        <Lightbox.Trigger key={item.id} itemKey={item.id}>
          Open {item.label}
        </Lightbox.Trigger>
      ))}
      <Lightbox.Backdrop isDismissable>
        <Lightbox.Popup>
          <Lightbox.Content />
          <Lightbox.Caption />
          <Lightbox.Previous />
          <Lightbox.Next />
          <Lightbox.Close />
        </Lightbox.Popup>
      </Lightbox.Backdrop>
    </Lightbox.Root>
  );
}

describe('<Lightbox />', () => {
  const { render, renderToString } = createRenderer();

  it('selects before opening and renders the selected item with its default caption', async () => {
    const { user } = await render(<TestLightbox />);

    await user.click(screen.getByRole('button', { name: 'Open Second image' }));

    expect(screen.getByRole('dialog', { name: 'Second image' })).to.exist;
    expect(screen.getByTestId('content')).to.have.text('Second image (2/3)');
    expect(screen.getByText('Second image', { selector: 'p' })).to.have.class(
      'tale-lightbox__caption',
    );
  });

  it('navigates with owned localized controls and respects non-looping boundaries', async () => {
    const { user } = await render(<TestLightbox defaultOpen defaultSelectedKey="one" />);

    const previous = screen.getByRole('button', { name: 'Previous item' });
    const next = screen.getByRole('button', { name: 'Next item' });
    expect(previous).to.have.attribute('disabled');

    await user.click(next);
    expect(screen.getByTestId('content')).to.have.text('Second image (2/3)');
    await user.click(next);
    expect(screen.getByTestId('content')).to.have.text('Third image (3/3)');
    expect(next).to.have.attribute('disabled');
  });

  it('reverses arrow-key navigation in RTL from the popup owner document', async () => {
    document.documentElement.dir = 'rtl';
    try {
      const { user } = await render(<TestLightbox defaultOpen defaultSelectedKey="two" />);

      await user.keyboard('{ArrowRight}');
      expect(screen.getByTestId('content')).to.have.text('First image (1/3)');
    } finally {
      document.documentElement.removeAttribute('dir');
    }
  });

  it('fails closed atomically for duplicate SameValueZero keys', async () => {
    const invalidItems = [
      { id: 0, label: 'Zero' },
      { id: -0, label: 'Negative zero' },
    ];
    await render(
      <Lightbox.Root
        items={invalidItems}
        getKey={(item) => item.id}
        getLabel={(item) => item.label}
        renderContent={(item) => item.label}
        defaultOpen
      >
        <Lightbox.Trigger itemKey={0}>Open</Lightbox.Trigger>
        <Lightbox.Backdrop>
          <Lightbox.Popup>
            <Lightbox.Content />
          </Lightbox.Popup>
        </Lightbox.Backdrop>
      </Lightbox.Root>,
    );

    expect(screen.queryByRole('dialog')).to.equal(null);
    expect(screen.getByRole('button', { name: 'Open' })).to.have.attribute('disabled');
  });

  it('strips owned action handlers from controls at runtime', async () => {
    const hostileClick = vi.fn();
    const { user } = await render(
      <Lightbox.Root
        items={items}
        getKey={(item) => item.id}
        getLabel={(item) => item.label}
        renderContent={(item) => item.label}
      >
        <Lightbox.Trigger itemKey="one" {...({ onClick: hostileClick } as Record<string, unknown>)}>
          Open
        </Lightbox.Trigger>
        <Lightbox.Backdrop>
          <Lightbox.Popup>
            <Lightbox.Content />
          </Lightbox.Popup>
        </Lightbox.Backdrop>
      </Lightbox.Root>,
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(hostileClick.mock.calls.length).to.equal(0);
    expect(screen.getByRole('dialog', { name: 'First image' })).to.exist;
  });

  it('emits selection before open for a controlled trigger proposal', async () => {
    const calls: string[] = [];
    const { user } = await render(
      <Lightbox.Root
        items={items}
        getKey={(item: (typeof items)[number]) => item.id}
        getLabel={(item: (typeof items)[number]) => item.label}
        renderContent={(item: (typeof items)[number]) => item.label}
        selectedKey="one"
        isOpen={false}
        onSelectionChange={(key) => calls.push(`selection:${String(key)}`)}
        onOpenChange={(open) => calls.push(`open:${String(open)}`)}
      >
        <Lightbox.Trigger itemKey="two">Open second</Lightbox.Trigger>
      </Lightbox.Root>,
    );

    await user.click(screen.getByRole('button', { name: 'Open second' }));
    expect(calls).to.deep.equal(['selection:two', 'open:true']);
  });

  it('correlates arrow dispatch once and runs permitted Root bubbling afterward', async () => {
    const calls: string[] = [];
    const strippedCapture = vi.fn();
    const { user } = await render(
      <Lightbox.Root
        items={items}
        getKey={(item: (typeof items)[number]) => item.id}
        getLabel={(item: (typeof items)[number]) => item.label}
        renderContent={(item: (typeof items)[number]) => item.label}
        isOpen
        selectedKey="one"
        onSelectionChange={(key) => calls.push(`selection:${String(key)}`)}
        onKeyDown={() => calls.push('bubble')}
        {...({ onKeyDownCapture: strippedCapture } as any)}
      >
        <Lightbox.Backdrop>
          <Lightbox.Popup>
            <Lightbox.Content />
            <Lightbox.Next />
          </Lightbox.Popup>
        </Lightbox.Backdrop>
      </Lightbox.Root>,
    );

    await user.keyboard('{ArrowRight}');
    expect(calls).to.deep.equal(['selection:two', 'bubble']);
    expect(strippedCapture.mock.calls.length).to.equal(0);
  });

  it('coalesces repeated controlled dismissal signals into one close proposal', async () => {
    const onOpenChange = vi.fn();
    const { user } = await render(
      <Lightbox.Root
        items={items}
        getKey={(item) => item.id}
        getLabel={(item) => item.label}
        renderContent={(item) => item.label}
        isOpen
        selectedKey="one"
        onOpenChange={onOpenChange}
      >
        <Lightbox.Backdrop isDismissable>
          <Lightbox.Popup>
            <Lightbox.Content />
            <Lightbox.Close />
          </Lightbox.Popup>
        </Lightbox.Backdrop>
      </Lightbox.Root>,
    );

    await user.click(screen.getByRole('button', { name: 'Close lightbox' }));
    await user.keyboard('{Escape}');
    expect(onOpenChange.mock.calls).to.deep.equal([[false]]);
  });

  it('restores focus to the initiating trigger after dismissal', async () => {
    const { user } = await render(<TestLightbox />);
    const trigger = screen.getByRole('button', { name: 'Open First image' });
    await user.click(trigger);
    await new Promise((resolve) => {
      setTimeout(resolve, 10);
    });
    await user.click(screen.getByRole('button', { name: 'Close lightbox' }));

    await waitFor(() => {
      expect(document.activeElement).to.equal(trigger);
    });
    await new Promise((resolve) => {
      setTimeout(resolve, 10);
    });
  });

  it('invokes key and label accessors once per collection generation', async () => {
    const getKey = vi.fn((item: (typeof items)[number]) => item.id);
    const getLabel = vi.fn((item: (typeof items)[number]) => item.label);
    const renderContent = (item: (typeof items)[number]) => item.label;
    function AccessorHarness() {
      const [, setRevision] = React.useState(0);
      return (
        <React.Fragment>
          <button type="button" onClick={() => setRevision((value) => value + 1)}>
            Rerender
          </button>
          <Lightbox.Root
            items={items}
            getKey={getKey}
            getLabel={getLabel}
            renderContent={renderContent}
          >
            <Lightbox.Trigger itemKey="one">Open</Lightbox.Trigger>
          </Lightbox.Root>
        </React.Fragment>
      );
    }
    const view = await render(<AccessorHarness />);

    // The test renderer intentionally uses StrictMode, so the initial generation is replayed.
    expect(getKey.mock.calls.length).to.equal(items.length * 2);
    expect(getLabel.mock.calls.length).to.equal(items.length * 2);
    await view.user.click(screen.getByRole('button', { name: 'Rerender' }));
    expect(getKey.mock.calls.length).to.equal(items.length * 2);
    expect(getLabel.mock.calls.length).to.equal(items.length * 2);
  });

  it('atomically rejects hostile collections, labels, keys, callback shapes, and options', async () => {
    const cases: Array<{
      name: string;
      rootProps: Record<string, unknown>;
    }> = [
      {
        name: 'throwing key accessor',
        rootProps: {
          getKey: () => {
            throw new Error('bad key');
          },
        },
      },
      {
        name: 'throwing label accessor',
        rootProps: {
          getLabel: () => {
            throw new Error('bad label');
          },
        },
      },
      { name: 'blank label', rootProps: { getLabel: () => '  ' } },
      { name: 'unsupported key', rootProps: { getKey: () => Symbol('key') } },
      { name: 'non-array items', rootProps: { items: { 0: items[0], length: 1 } } },
      { name: 'invalid callback', rootProps: { onOpenChange: 'not callable' } },
      { name: 'invalid option', rootProps: { swipeNavigation: 'yes' } },
      { name: 'invalid controlled open', rootProps: { defaultOpen: undefined, isOpen: 'yes' } },
      {
        name: 'invalid controlled selection',
        rootProps: { defaultOpen: undefined, selectedKey: { bad: true } },
      },
    ];

    for (const testCase of cases) {
      const renderContent = vi.fn((item: (typeof items)[number]) => item.label);
      // Each invalid generation needs an isolated React Aria portal/focus scope.
      // eslint-disable-next-line no-await-in-loop
      const view = await render(
        <Lightbox.Root
          {...({
            items,
            getKey: (item: (typeof items)[number]) => item.id,
            getLabel: (item: (typeof items)[number]) => item.label,
            renderContent,
            defaultOpen: true,
            ...testCase.rootProps,
          } as any)}
          data-case={testCase.name}
        >
          <Lightbox.Trigger itemKey="one">Open hostile</Lightbox.Trigger>
          <Lightbox.Backdrop>
            <Lightbox.Popup>
              <Lightbox.Content />
            </Lightbox.Popup>
          </Lightbox.Backdrop>
        </Lightbox.Root>,
      );
      expect(screen.queryByRole('dialog'), testCase.name).to.equal(null);
      expect(screen.getByRole('button', { name: 'Open hostile' }), testCase.name).to.have.attribute(
        'disabled',
      );
      expect(renderContent.mock.calls.length, testCase.name).to.equal(0);
      view.unmount();
    }
  });

  it('normalizes malformed uncontrolled defaults without invalidating the Root', async () => {
    const base = {
      items,
      getKey: (item: (typeof items)[number]) => item.id,
      getLabel: (item: (typeof items)[number]) => item.label,
      renderContent: (item: (typeof items)[number]) => item.label,
    };
    const view = await render(
      <Lightbox.Root
        {...({ ...base, defaultOpen: true, defaultSelectedKey: { invalid: true } } as any)}
      >
        <Lightbox.Trigger itemKey="two">Open second</Lightbox.Trigger>
        <Lightbox.Backdrop>
          <Lightbox.Popup>
            <Lightbox.Content />
          </Lightbox.Popup>
        </Lightbox.Backdrop>
      </Lightbox.Root>,
    );
    expect(screen.getByRole('dialog', { name: 'First image' })).to.exist;
    view.unmount();

    await render(
      <Lightbox.Root {...({ ...base, defaultOpen: 'yes', defaultSelectedKey: 'two' } as any)}>
        <Lightbox.Trigger itemKey="two">Open normalized</Lightbox.Trigger>
        <Lightbox.Backdrop>
          <Lightbox.Popup>
            <Lightbox.Content />
          </Lightbox.Popup>
        </Lightbox.Backdrop>
      </Lightbox.Root>,
    );
    expect(screen.queryByRole('dialog')).to.equal(null);
    expect(screen.getByRole('button', { name: 'Open normalized' })).not.to.have.attribute(
      'disabled',
    );
  });

  it('keeps invalid and stale triggers inert without disabling valid triggers', async () => {
    const { user } = await render(
      <Lightbox.Root
        items={items}
        getKey={(item) => item.id}
        getLabel={(item) => item.label}
        renderContent={(item) => item.label}
      >
        <Lightbox.Trigger itemKey={{} as React.Key}>Invalid key</Lightbox.Trigger>
        <Lightbox.Trigger itemKey="missing">Stale key</Lightbox.Trigger>
        <Lightbox.Trigger itemKey="two">Valid key</Lightbox.Trigger>
        <Lightbox.Backdrop>
          <Lightbox.Popup>
            <Lightbox.Content />
          </Lightbox.Popup>
        </Lightbox.Backdrop>
      </Lightbox.Root>,
    );

    expect(screen.getByRole('button', { name: 'Invalid key' })).to.have.attribute('disabled');
    expect(screen.getByRole('button', { name: 'Stale key' })).to.have.attribute('disabled');
    expect(screen.getByRole('button', { name: 'Valid key' })).not.to.have.attribute('disabled');
    await user.click(screen.getByRole('button', { name: 'Valid key' }));
    expect(screen.getByRole('dialog', { name: 'Second image' })).to.exist;
  });

  it('recovers from a colliding first render, then fails closed on a mode switch', async () => {
    const base = {
      items,
      getKey: (item: (typeof items)[number]) => item.id,
      getLabel: (item: (typeof items)[number]) => item.label,
      renderContent: (item: (typeof items)[number]) => item.label,
    };
    const children = (
      <React.Fragment>
        <Lightbox.Trigger itemKey="one">Open</Lightbox.Trigger>
        <Lightbox.Backdrop>
          <Lightbox.Popup>
            <Lightbox.Content />
          </Lightbox.Popup>
        </Lightbox.Backdrop>
      </React.Fragment>
    );
    let setPhase: React.Dispatch<React.SetStateAction<number>> = () => {};
    function ModeHarness() {
      const [phase, setPhaseState] = React.useState(0);
      setPhase = setPhaseState;
      const stateProps =
        phase === 0
          ? { isOpen: true, defaultOpen: true }
          : phase === 1
            ? { defaultOpen: true }
            : { isOpen: true };
      return <Lightbox.Root {...({ ...base, ...stateProps } as any)}>{children}</Lightbox.Root>;
    }
    await render(<ModeHarness />);
    expect(screen.queryByRole('dialog')).to.equal(null);

    await act(async () => setPhase(1));
    expect(screen.getByRole('dialog', { name: 'First image' })).to.exist;

    await act(async () => setPhase(2));
    expect(screen.queryByRole('dialog')).to.equal(null);
    expect(screen.getByRole('button', { name: 'Open' })).to.have.attribute('disabled');
  });

  it('normalizes a removed uncontrolled selection before closing', async () => {
    const calls: string[] = [];
    let removeSelection: () => void = () => {};
    function RemovalHarness() {
      const [nextItems, setItems] = React.useState<readonly (typeof items)[number][]>(items);
      removeSelection = () => setItems([items[0], items[2]]);
      return (
        <Lightbox.Root
          items={nextItems}
          getKey={(item) => item.id}
          getLabel={(item) => item.label}
          renderContent={(item) => item.label}
          defaultOpen
          defaultSelectedKey="two"
          onSelectionChange={(key) => calls.push(`selection:${String(key)}`)}
          onOpenChange={(open) => calls.push(`open:${String(open)}`)}
        >
          <Lightbox.Backdrop>
            <Lightbox.Popup>
              <Lightbox.Content />
            </Lightbox.Popup>
          </Lightbox.Backdrop>
        </Lightbox.Root>
      );
    }
    await render(<RemovalHarness />);

    await act(async () => removeSelection());
    expect(calls).to.deep.equal(['selection:one', 'open:false']);
    expect(screen.queryByRole('dialog')).to.equal(null);
  });

  it('proposes null then close once for an absent controlled selection', async () => {
    const calls: string[] = [];
    function ControlledMissingHarness() {
      const [, setRevision] = React.useState(0);
      return (
        <React.Fragment>
          <button type="button" onClick={() => setRevision((value) => value + 1)}>
            Rerender missing
          </button>
          <Lightbox.Root
            items={items.slice(0, 2)}
            getKey={(item) => item.id}
            getLabel={(item) => item.label}
            renderContent={(item) => item.label}
            isOpen
            selectedKey="three"
            onSelectionChange={(key, item) =>
              calls.push(`selection:${String(key)}:${String(item)}`)
            }
            onOpenChange={(open) => calls.push(`open:${String(open)}`)}
          >
            <Lightbox.Backdrop>
              <Lightbox.Popup>
                <Lightbox.Content />
              </Lightbox.Popup>
            </Lightbox.Backdrop>
          </Lightbox.Root>
        </React.Fragment>
      );
    }
    const { user } = await render(<ControlledMissingHarness />);

    expect(calls).to.deep.equal(['selection:null:null', 'open:false']);
    await user.click(screen.getByRole('button', { name: 'Rerender missing' }));
    expect(calls).to.deep.equal(['selection:null:null', 'open:false']);
  });

  it('loops when enabled and disables navigation for one item', async () => {
    const view = await render(<TestLightbox defaultOpen defaultSelectedKey="three" loop />);
    await view.user.click(screen.getByRole('button', { name: 'Next item' }));
    expect(screen.getByTestId('content')).to.have.text('First image (1/3)');
    view.unmount();

    await render(
      <Lightbox.Root
        items={[items[0]]}
        getKey={(item) => item.id}
        getLabel={(item) => item.label}
        renderContent={(item) => item.label}
        defaultOpen
      >
        <Lightbox.Backdrop>
          <Lightbox.Popup>
            <Lightbox.Content />
            <Lightbox.Previous />
            <Lightbox.Next />
          </Lightbox.Popup>
        </Lightbox.Backdrop>
      </Lightbox.Root>,
    );
    expect(screen.getByRole('button', { name: 'Previous item' })).to.have.attribute('disabled');
    expect(screen.getByRole('button', { name: 'Next item' })).to.have.attribute('disabled');
  });

  it('validates explicit control names and distinguishes an omitted caption from null', async () => {
    await render(
      <Lightbox.Root
        items={items}
        getKey={(item) => item.id}
        getLabel={(item) => item.label}
        renderContent={(item) => item.label}
        defaultOpen
      >
        <Lightbox.Backdrop>
          <Lightbox.Popup>
            <Lightbox.Caption data-testid="default-caption" />
            <Lightbox.Caption data-testid="empty-caption">{null}</Lightbox.Caption>
            <Lightbox.Previous {...({ 'aria-label': ' ', 'aria-labelledby': 'both' } as any)} />
            <span id="next-name">Advance gallery</span>
            <Lightbox.Next aria-labelledby="next-name" />
            <Lightbox.Close {...({ 'aria-label': 42 } as any)} />
          </Lightbox.Popup>
        </Lightbox.Backdrop>
      </Lightbox.Root>,
    );

    expect(screen.getByTestId('default-caption')).to.have.text('First image');
    expect(screen.getByTestId('empty-caption')).to.have.text('');
    const previous = screen.getByRole('button', { name: 'Previous item' });
    expect(previous).not.to.have.attribute('aria-labelledby');
    expect(screen.getByRole('button', { name: 'Advance gallery' })).to.exist;
    expect(screen.getByRole('button', { name: 'Close lightbox' })).to.exist;
  });

  it('uses a 40px physical swipe threshold and reverses swipe mapping in RTL', async () => {
    if (window.navigator.userAgent.includes('jsdom')) {
      (window as any).PointerEvent = window.MouseEvent;
    }
    document.documentElement.dir = 'rtl';
    const originalElementFromPoint = document.elementFromPoint;
    try {
      await render(<TestLightbox defaultOpen defaultSelectedKey="two" />);
      const popup = screen.getByRole('dialog', { name: 'Second image' });
      expect(popup.contains(document.activeElement)).to.equal(true);
      document.elementFromPoint = () => popup;

      const swipeLeft = async (distance: number, pointerId: number) => {
        fireEvent.pointerDown(popup, {
          button: 0,
          buttons: 1,
          pointerId,
          clientX: 100,
          clientY: 0,
          pointerType: 'mouse',
        });
        await flushMicrotasks();
        fireEvent.pointerMove(popup, {
          buttons: 1,
          pointerId,
          clientX: 100,
          clientY: 0,
        });
        await flushMicrotasks();
        fireEvent.pointerMove(popup, {
          buttons: 1,
          pointerId,
          clientX: 100 - distance,
          clientY: 0,
        });
        await flushMicrotasks();
        fireEvent.pointerUp(popup, {
          pointerId,
          clientX: 100 - distance,
          clientY: 0,
        });
        await flushMicrotasks();
      };

      await swipeLeft(39, 1);
      expect(screen.getByTestId('content')).to.have.text('Second image (2/3)');
      await swipeLeft(41, 2);
      expect(screen.getByTestId('content')).to.have.text('First image (1/3)');
    } finally {
      document.elementFromPoint = originalElementFromPoint;
      document.documentElement.removeAttribute('dir');
    }
  });

  it('keeps swipe tracking event-only so reduced-motion users receive no drag transform', async () => {
    if (window.navigator.userAgent.includes('jsdom')) {
      (window as any).PointerEvent = window.MouseEvent;
    }
    const originalElementFromPoint = document.elementFromPoint;
    try {
      await render(<TestLightbox defaultOpen defaultSelectedKey="two" />);
      const popup = screen.getByRole('dialog', { name: 'Second image' });
      document.elementFromPoint = () => popup;
      fireEvent.pointerDown(popup, {
        button: 0,
        buttons: 1,
        pointerId: 3,
        clientX: 100,
        clientY: 0,
        pointerType: 'mouse',
      });
      fireEvent.pointerMove(popup, {
        buttons: 1,
        pointerId: 3,
        clientX: 100,
        clientY: 0,
      });
      fireEvent.pointerMove(popup, {
        buttons: 1,
        pointerId: 3,
        clientX: 50,
        clientY: 0,
      });
      await flushMicrotasks();

      expect(popup.style.transform).to.equal('');
      expect(popup.style.getPropertyValue('--tale-lightbox-swipe-x')).to.equal('');
      fireEvent.pointerCancel(popup, { pointerId: 3 });
    } finally {
      document.elementFromPoint = originalElementFromPoint;
    }
  });

  it('excludes interactive and scrollable descendants from swipe navigation', async () => {
    if (window.navigator.userAgent.includes('jsdom')) {
      (window as any).PointerEvent = window.MouseEvent;
    }
    const originalElementFromPoint = document.elementFromPoint;
    try {
      await render(
        <Lightbox.Root
          items={items}
          getKey={(item) => item.id}
          getLabel={(item) => item.label}
          renderContent={(item) => <button type="button">{item.label}</button>}
          defaultOpen
          defaultSelectedKey="two"
        >
          <Lightbox.Backdrop>
            <Lightbox.Popup>
              <Lightbox.Content data-testid="scrollable" />
              <Lightbox.Caption />
            </Lightbox.Popup>
          </Lightbox.Backdrop>
        </Lightbox.Root>,
      );
      const popup = screen.getByRole('dialog', { name: 'Second image' });
      const interactive = screen.getByRole('button', { name: 'Second image' });
      expect(popup.contains(document.activeElement)).to.equal(true);
      document.elementFromPoint = () => interactive;
      fireEvent.pointerDown(interactive, {
        button: 0,
        buttons: 1,
        pointerId: 4,
        clientX: 100,
        clientY: 0,
        pointerType: 'mouse',
      });
      fireEvent.pointerMove(interactive, {
        buttons: 1,
        pointerId: 4,
        clientX: 100,
        clientY: 0,
      });
      fireEvent.pointerMove(interactive, {
        buttons: 1,
        pointerId: 4,
        clientX: 0,
        clientY: 0,
      });
      fireEvent.pointerUp(interactive, { pointerId: 4, clientX: 0, clientY: 0 });
      await flushMicrotasks();
      expect(screen.getByText('Second image', { selector: 'p' })).to.exist;

      const scrollable = screen.getByTestId('scrollable');
      Object.defineProperty(scrollable, 'scrollWidth', { value: 200, configurable: true });
      Object.defineProperty(scrollable, 'clientWidth', { value: 100, configurable: true });
      scrollable.style.overflowX = 'auto';
      document.elementFromPoint = () => scrollable;
      fireEvent.pointerDown(scrollable, {
        button: 0,
        buttons: 1,
        pointerId: 5,
        clientX: 100,
        clientY: 0,
        pointerType: 'mouse',
      });
      fireEvent.pointerMove(scrollable, {
        buttons: 1,
        pointerId: 5,
        clientX: 100,
        clientY: 0,
      });
      fireEvent.pointerMove(scrollable, {
        buttons: 1,
        pointerId: 5,
        clientX: 0,
        clientY: 0,
      });
      fireEvent.pointerUp(scrollable, { pointerId: 5, clientX: 0, clientY: 0 });
      await flushMicrotasks();
      expect(screen.getByText('Second image', { selector: 'p' })).to.exist;
    } finally {
      document.elementFromPoint = originalElementFromPoint;
    }
  });

  it('lets only the topmost focused instance navigate and cleans its stack lease on unmount', async () => {
    const firstItems = items.map((item) => ({ ...item, label: `A ${item.label}` }));
    const secondItems = items.map((item) => ({ ...item, label: `B ${item.label}` }));
    const Instance = ({
      instanceItems,
      testId,
      defaultOpen = false,
    }: {
      instanceItems: readonly { id: string; label: string }[];
      testId: string;
      defaultOpen?: boolean;
    }) => (
      <Lightbox.Root
        items={instanceItems}
        getKey={(item) => item.id}
        getLabel={(item) => item.label}
        renderContent={(item) => <span data-testid={testId}>{item.label}</span>}
        defaultOpen={defaultOpen}
      >
        <Lightbox.Trigger itemKey="one">Open nested lightbox</Lightbox.Trigger>
        <Lightbox.Backdrop>
          <Lightbox.Popup>
            <Lightbox.Content />
            <Lightbox.Next />
            <Lightbox.Close />
          </Lightbox.Popup>
        </Lightbox.Backdrop>
      </Lightbox.Root>
    );
    const view = await render(
      <Lightbox.Root
        items={firstItems}
        getKey={(item) => item.id}
        getLabel={(item) => item.label}
        renderContent={(item) => <span data-testid="first-content">{item.label}</span>}
        defaultOpen
      >
        <Lightbox.Backdrop>
          <Lightbox.Popup>
            <Lightbox.Content />
            <Lightbox.Next />
            <Instance instanceItems={secondItems} testId="second-content" />
          </Lightbox.Popup>
        </Lightbox.Backdrop>
      </Lightbox.Root>,
    );
    await view.user.click(screen.getByRole('button', { name: 'Open nested lightbox' }));
    await new Promise((resolve) => {
      setTimeout(resolve, 20);
    });
    const topDialog = screen.getByRole('dialog', { name: 'B First image' });
    expect(topDialog.contains(document.activeElement)).to.equal(true);
    fireEvent.keyDown(topDialog, { key: 'ArrowRight' });
    expect(screen.getByTestId('first-content')).to.have.text('A First image');
    expect(screen.getByTestId('second-content')).to.have.text('B Second image');

    view.unmount();
    const { user } = await render(<TestLightbox defaultOpen defaultSelectedKey="one" />);
    await user.keyboard('{ArrowRight}');
    expect(screen.getByTestId('content')).to.have.text('Second image (2/3)');
  });

  it('contains focus and restores to another trigger for the selected item if the initiator unmounts', async () => {
    function FocusHarness() {
      const [hideInitiator, setHideInitiator] = React.useState(false);
      return (
        <React.Fragment>
          <button type="button">Outside</button>
          <Lightbox.Root
            items={items}
            getKey={(item) => item.id}
            getLabel={(item) => item.label}
            renderContent={(item) => item.label}
            onOpenChange={(open) => setHideInitiator(open)}
          >
            {!hideInitiator && <Lightbox.Trigger itemKey="two">Initiator</Lightbox.Trigger>}
            <Lightbox.Trigger itemKey="two">Selected fallback</Lightbox.Trigger>
            <Lightbox.Backdrop>
              <Lightbox.Popup>
                <Lightbox.Content />
                <Lightbox.Close />
              </Lightbox.Popup>
            </Lightbox.Backdrop>
          </Lightbox.Root>
        </React.Fragment>
      );
    }
    const { user } = await render(<FocusHarness />);
    await user.click(screen.getByRole('button', { name: 'Initiator' }));
    await new Promise((resolve) => {
      setTimeout(resolve, 10);
    });
    expect(screen.queryByRole('button', { name: 'Initiator' })).to.equal(null);
    await user.tab();
    expect(screen.getByRole('dialog').contains(document.activeElement)).to.equal(true);
    await user.click(screen.getByRole('button', { name: 'Close lightbox' }));
    await waitFor(() => {
      expect(document.activeElement).to.equal(
        screen.getByRole('button', { name: 'Selected fallback' }),
      );
    });
    await new Promise((resolve) => {
      setTimeout(resolve, 10);
    });
  });

  it('has deterministic closed SSR markup and hydrates without opening or invoking content', () => {
    const renderContent = vi.fn((item: (typeof items)[number]) => item.label);
    const view = renderToString(
      <Lightbox.Root
        items={items}
        getKey={(item) => item.id}
        getLabel={(item) => item.label}
        renderContent={renderContent}
      >
        <Lightbox.Trigger itemKey="one">Open SSR</Lightbox.Trigger>
        <Lightbox.Backdrop>
          <Lightbox.Popup>
            <Lightbox.Content />
          </Lightbox.Popup>
        </Lightbox.Backdrop>
      </Lightbox.Root>,
    );
    expect(screen.getByRole('button', { name: 'Open SSR' })).to.exist;
    expect(screen.queryByRole('dialog')).to.equal(null);
    expect(renderContent.mock.calls.length).to.equal(0);
    const hydrated = view.hydrate();
    expect(screen.queryByRole('dialog')).to.equal(null);
    expect(renderContent.mock.calls.length).to.equal(0);
    hydrated.unmount();
  });
});
