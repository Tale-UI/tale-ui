import * as React from 'react';
import { act, fireEvent, screen } from '@tale-ui/monorepo-tests/test-utils';
import { createRenderer, isJSDOM } from '#test-utils';
import {
  Resizable,
  type ResizableHandleProps,
  type ResizablePanelProps,
  type ResizableRootProps,
  type ResizableSizes,
} from './index';

function sizesFromPanels() {
  return Object.fromEntries(
    Array.from(document.querySelectorAll<HTMLElement>('[data-panel-id]')).map((panel) => [
      panel.dataset.panelId!,
      Number.parseFloat(panel.style.flexBasis),
    ]),
  );
}

function mockRootSize(root: HTMLDivElement, width = 1000, height = 200) {
  vi.spyOn(root, 'getBoundingClientRect').mockReturnValue({
    bottom: height,
    height,
    left: 0,
    right: width,
    top: 0,
    width,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
}

function Basic({ rootProps }: { rootProps?: Partial<ResizableRootProps> }) {
  const resolvedRootProps = {
    defaultSizes: { A: 40, B: 60 },
    ...rootProps,
  } as ResizableRootProps;
  return (
    <Resizable.Root {...resolvedRootProps}>
      <Resizable.Panel id="A" minSize={20} maxSize={70}>
        Alpha
      </Resizable.Panel>
      <Resizable.Handle id="h-ab" before="A" after="B" aria-label="Resize Alpha and Beta" />
      <Resizable.Panel id="B" minSize={20} maxSize={80}>
        Beta
      </Resizable.Panel>
    </Resizable.Root>
  );
}

function assertPublicTypes() {
  const root: ResizableRootProps = {
    defaultSizes: { A: 50, B: 50 },
    children: null,
  };
  const controlled: ResizableRootProps = {
    sizes: { A: 50, B: 50 },
    children: null,
  };
  const panel: ResizablePanelProps = { id: 'A' };
  const handle: ResizableHandleProps = {
    id: 'h',
    before: 'A',
    after: 'B',
    'aria-label': 'Resize',
  };
  // @ts-expect-error Root ownership branches are mutually exclusive.
  const invalidRoot: ResizableRootProps = {
    sizes: { A: 50, B: 50 },
    defaultSizes: { A: 50, B: 50 },
    children: null,
  };
  const invalidHandle = {
    id: 'h',
    before: 'A',
    after: 'B',
    'aria-label': 'Resize',
    // @ts-expect-error Handles own pointer handlers.
    onPointerDown: () => {},
  } satisfies ResizableHandleProps;
  void [root, controlled, panel, handle, invalidRoot, invalidHandle];
}
void assertPublicTypes;

describe('Resizable', () => {
  const { render, renderToString } = createRenderer();

  it('renders exact topology, owned flex and ARIA values, classes, and refs', async () => {
    const rootRef = React.createRef<HTMLDivElement>();
    const panelRef = React.createRef<HTMLDivElement>();
    const handleRef = React.createRef<HTMLDivElement>();
    await render(
      <Resizable.Root
        ref={rootRef}
        defaultSizes={{ A: 40, B: 30, C: 30 }}
        className="consumer-root"
      >
        <React.Fragment>
          <Resizable.Panel ref={panelRef} id="A" minSize={20} maxSize={60}>
            Alpha
          </Resizable.Panel>
          <Resizable.Handle
            ref={handleRef}
            id="h-ab"
            before="A"
            after="B"
            aria-label="Resize Alpha and Beta"
          />
        </React.Fragment>
        {false}
        {[
          <Resizable.Panel key="B" id="B" minSize={20} maxSize={50}>
            Beta
          </Resizable.Panel>,
          <Resizable.Handle
            key="h-bc"
            id="h-bc"
            before="B"
            after="C"
            aria-labelledby="resize-c-label"
          />,
          <Resizable.Panel key="C" id="C" minSize={10} maxSize={50}>
            Charlie
          </Resizable.Panel>,
        ]}
      </Resizable.Root>,
    );

    expect(rootRef.current?.className).toContain('tale-resizable--horizontal');
    expect(rootRef.current?.className).toContain('consumer-root');
    expect(panelRef.current?.style.flexBasis).toBe('40%');
    expect(handleRef.current?.getAttribute('role')).toBe('separator');
    expect(handleRef.current?.getAttribute('aria-orientation')).toBe('vertical');
    expect(handleRef.current?.getAttribute('aria-valuenow')).toBe('40');
    expect(handleRef.current?.getAttribute('aria-valuemin')).toBe('20');
    expect(handleRef.current?.getAttribute('aria-valuemax')).toBe('50');
    const controls = handleRef.current?.getAttribute('aria-controls')?.split(' ') ?? [];
    expect(controls).toHaveLength(2);
    expect(document.getElementById(controls[0]!)).toBe(panelRef.current);
    expect(handleRef.current?.tabIndex).toBe(0);
  });

  it('initializes every Panel at minimum and water-fills remaining capacity', async () => {
    await render(
      <Resizable.Root precision={4}>
        <Resizable.Panel id="A" minSize={20} maxSize={30} />
        <Resizable.Handle id="h-ab" before="A" after="B" aria-label="Resize A and B" />
        <Resizable.Panel id="B" minSize={10} maxSize={80} />
        <Resizable.Handle id="h-bc" before="B" after="C" aria-label="Resize B and C" />
        <Resizable.Panel id="C" minSize={10} maxSize={80} />
      </Resizable.Root>,
    );

    expect(sizesFromPanels()).toEqual({ A: 30, B: 35, C: 35 });
  });

  it('fails invalid topology closed while preserving safely renderable content', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const onSizesChange = vi.fn();
    const { container } = await render(
      <Resizable.Root defaultSizes={{ A: 50, B: 50 }} onSizesChange={onSizesChange}>
        <Resizable.Panel id="A">Alpha</Resizable.Panel>
        <span>Foreign child</span>
        <Resizable.Handle id="h-ab" before="B" after="A" aria-label="Wrong adjacency" />
        <Resizable.Panel id="B">Beta</Resizable.Panel>
      </Resizable.Root>,
    );

    expect(container.querySelector('.tale-resizable')?.hasAttribute('data-invalid')).toBe(true);
    expect(screen.getByText('Alpha').style.flexBasis).toBe('');
    expect(screen.getByText('Foreign child')).toBeTruthy();
    const handle = screen.getByRole('separator', { name: 'Wrong adjacency' });
    expect(handle.getAttribute('aria-valuenow')).toBeNull();
    expect(handle.tabIndex).toBe(-1);
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(onSizesChange).not.toHaveBeenCalled();
    warning.mockRestore();
  });

  it.each([
    {
      name: 'duplicate panel IDs',
      children: (
        <React.Fragment>
          <Resizable.Panel id="A" />
          <Resizable.Handle id="h" before="A" after="A" aria-label="Resize" />
          <Resizable.Panel id="A" />
        </React.Fragment>
      ),
    },
    {
      name: 'cross-kind collision',
      children: (
        <React.Fragment>
          <Resizable.Panel id="A" />
          <Resizable.Handle id="A" before="A" after="B" aria-label="Resize" />
          <Resizable.Panel id="B" />
        </React.Fragment>
      ),
    },
    {
      name: 'infeasible bounds',
      children: (
        <React.Fragment>
          <Resizable.Panel id="A" minSize={60} />
          <Resizable.Handle id="h" before="A" after="B" aria-label="Resize" />
          <Resizable.Panel id="B" minSize={60} />
        </React.Fragment>
      ),
    },
    {
      name: 'invalid handle name',
      children: (
        <React.Fragment>
          <Resizable.Panel id="A" />
          <Resizable.Handle
            {...({
              id: 'h',
              before: 'A',
              after: 'B',
              'aria-label': 'One',
              'aria-labelledby': 'two',
            } as unknown as ResizableHandleProps)}
          />
          <Resizable.Panel id="B" />
        </React.Fragment>
      ),
    },
    {
      name: 'invalid local disabled state',
      children: (
        <React.Fragment>
          <Resizable.Panel id="A" />
          <Resizable.Handle
            {...({
              id: 'h',
              before: 'A',
              after: 'B',
              'aria-label': 'Resize',
              isDisabled: 'sometimes',
            } as unknown as ResizableHandleProps)}
          />
          <Resizable.Panel id="B" />
        </React.Fragment>
      ),
    },
  ])('rejects $name atomically', async ({ children }) => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = await render(
      <Resizable.Root defaultSizes={{ A: 50, B: 50 }}>{children}</Resizable.Root>,
    );
    expect(container.querySelector('.tale-resizable')?.hasAttribute('data-invalid')).toBe(true);
    expect(container.querySelector('[style*="flex-basis"]')).toBeNull();
    warning.mockRestore();
  });

  it('projects uncontrolled add, remove, reorder, and tightened bounds without callbacks', async () => {
    const onSizesChange = vi.fn();
    const onSizesCommit = vi.fn();
    type Stage = 'initial' | 'reorder' | 'add' | 'tighten' | 'remove';
    let setStage!: React.Dispatch<React.SetStateAction<Stage>>;
    function Layout() {
      const [stage, updateStage] = React.useState<Stage>('initial');
      setStage = updateStage;
      const panels =
        stage === 'add'
          ? [
              <Resizable.Panel key="A" id="A" minSize={10} />,
              <Resizable.Panel key="C" id="C" minSize={20} />,
              <Resizable.Panel key="B" id="B" minSize={10} />,
            ]
          : stage === 'remove'
            ? [
                <Resizable.Panel key="A" id="A" minSize={10} />,
                <Resizable.Panel key="B" id="B" minSize={10} />,
              ]
            : stage === 'reorder'
              ? [
                  <Resizable.Panel key="B" id="B" minSize={10} />,
                  <Resizable.Panel key="A" id="A" minSize={10} />,
                ]
              : [
                  <Resizable.Panel
                    key="A"
                    id="A"
                    minSize={10}
                    maxSize={stage === 'tighten' ? 45 : 90}
                  />,
                  <Resizable.Panel key="B" id="B" minSize={10} maxSize={90} />,
                ];
      const children: React.ReactNode[] = [];
      panels.forEach((panel, index) => {
        if (index > 0) {
          const before = panels[index - 1]!.props.id;
          const after = panel.props.id;
          children.push(
            <Resizable.Handle
              key={`h-${before}-${after}`}
              id={`h-${before}-${after}`}
              before={before}
              after={after}
              aria-label={`Resize ${before} and ${after}`}
            />,
          );
        }
        children.push(panel);
      });
      return (
        <Resizable.Root
          defaultSizes={{ A: 60, B: 40 }}
          onSizesChange={onSizesChange}
          onSizesCommit={onSizesCommit}
        >
          {children}
        </Resizable.Root>
      );
    }

    await render(<Layout />);
    expect(sizesFromPanels()).toEqual({ A: 60, B: 40 });
    act(() => setStage('reorder'));
    expect(sizesFromPanels()).toEqual({ B: 40, A: 60 });
    act(() => setStage('add'));
    expect(sizesFromPanels()).toEqual({ A: 50, C: 20, B: 30 });
    act(() => setStage('tighten'));
    expect(sizesFromPanels()).toEqual({ A: 45, B: 55 });
    act(() => setStage('remove'));
    expect(sizesFromPanels()).toEqual({ A: 45, B: 55 });
    expect(onSizesChange).not.toHaveBeenCalled();
    expect(onSizesCommit).not.toHaveBeenCalled();
  });

  it('ignores post-mount defaults and recovers once from invalid uncontrolled input', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let setRootProps!: React.Dispatch<React.SetStateAction<Partial<ResizableRootProps>>>;
    function Harness() {
      const [rootProps, updateRootProps] = React.useState<Partial<ResizableRootProps>>({});
      setRootProps = updateRootProps;
      return <Basic rootProps={rootProps} />;
    }
    await render(<Harness />);
    expect(sizesFromPanels()).toEqual({ A: 40, B: 60 });
    act(() => setRootProps({ defaultSizes: { A: 60, B: 40 } }));
    expect(sizesFromPanels()).toEqual({ A: 40, B: 60 });
    act(() => setRootProps({ defaultSizes: { A: Number.NaN, B: 60 } }));
    expect(sizesFromPanels()).toEqual({ A: 40, B: 60 });

    act(() =>
      setRootProps({
        defaultSizes: { A: 60, B: 40 },
        orientation: 'diagonal' as 'horizontal',
      }),
    );
    expect(screen.getByText('Alpha').style.flexBasis).toBe('');
    act(() => setRootProps({ defaultSizes: { A: 60, B: 40 } }));
    expect(sizesFromPanels()).toEqual({ A: 40, B: 60 });
    warning.mockRestore();
  });

  it('rejects controlled missing, extra, bound, and sum records and recovers synchronously', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const onSizesChange = vi.fn();
    let setSizes!: React.Dispatch<React.SetStateAction<ResizableSizes>>;
    function Harness() {
      const [sizes, updateSizes] = React.useState<ResizableSizes>({ A: 40, B: 60 });
      setSizes = updateSizes;
      return (
        <Basic
          rootProps={{
            defaultSizes: undefined,
            sizes,
            onSizesChange,
          }}
        />
      );
    }
    await render(<Harness />);
    expect(sizesFromPanels()).toEqual({ A: 40, B: 60 });

    const invalidRecords: ResizableSizes[] = [
      { A: 100 },
      { A: 40, B: 60, C: 0 },
      { A: 80, B: 20 },
      { A: 40, B: 50 },
    ];
    invalidRecords.forEach((invalidSizes) => {
      act(() => setSizes(invalidSizes));
      expect(screen.getByText('Alpha').style.flexBasis).toBe('');
      const separator = screen.queryByRole('separator');
      expect(separator).not.toBeNull();
      expect(separator?.getAttribute('aria-valuenow')).toBeNull();
    });

    act(() => setSizes({ A: 45, B: 55 }));
    expect(sizesFromPanels()).toEqual({ A: 45, B: 55 });
    expect(onSizesChange).not.toHaveBeenCalled();
    warning.mockRestore();
  });

  it('keeps ownership mode mount-stable and a colliding first render inert', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const collision = {
      sizes: { A: 40, B: 60 },
      defaultSizes: { A: 40, B: 60 },
    } as unknown as Partial<ResizableRootProps>;
    let setRootProps!: React.Dispatch<React.SetStateAction<Partial<ResizableRootProps>>>;
    function Harness() {
      const [rootProps, updateRootProps] = React.useState<Partial<ResizableRootProps>>(collision);
      setRootProps = updateRootProps;
      return <Basic rootProps={rootProps} />;
    }
    await render(<Harness />);
    expect(screen.getByText('Alpha').style.flexBasis).toBe('');
    act(() => setRootProps({ defaultSizes: undefined, sizes: { A: 40, B: 60 } }));
    expect(sizesFromPanels()).toEqual({ A: 40, B: 60 });
    act(() => setRootProps({ defaultSizes: { A: 40, B: 60 }, sizes: undefined }));
    expect(screen.getByText('Alpha').style.flexBasis).toBe('');
    warning.mockRestore();
  });

  it('applies keyboard mutations with exact ordering, steps, no-op suppression, Home, and End', async () => {
    const calls: string[] = [];
    await render(
      <Basic
        rootProps={{
          keyboardStep: 1,
          keyboardLargeStep: 10,
          onSizesChange(sizes, meta) {
            calls.push(`change:${sizes.A}:${meta.handleId}:${meta.source}`);
          },
          onSizesCommit(sizes, meta) {
            calls.push(`commit:${sizes.A}:${meta.handleId}:${meta.source}`);
          },
        }}
      />,
    );
    const handle = screen.getByRole('separator');

    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(sizesFromPanels()).toEqual({ A: 41, B: 59 });
    expect(calls).toEqual(['change:41:h-ab:keyboard', 'commit:41:h-ab:keyboard']);

    fireEvent.keyDown(handle, { key: 'ArrowRight', shiftKey: true });
    expect(sizesFromPanels()).toEqual({ A: 51, B: 49 });
    fireEvent.keyDown(handle, { key: 'PageDown' });
    expect(sizesFromPanels()).toEqual({ A: 41, B: 59 });
    fireEvent.keyDown(handle, { key: 'Home' });
    expect(sizesFromPanels()).toEqual({ A: 20, B: 80 });
    fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    expect(calls).toHaveLength(8);
    fireEvent.keyDown(handle, { key: 'End' });
    expect(sizesFromPanels()).toEqual({ A: 70, B: 30 });
  });

  it('runs permitted Root bubble handlers after the Tale-owned Handle action', async () => {
    const calls: string[] = [];
    await render(
      <Basic
        rootProps={{
          onSizesChange: () => calls.push('change'),
          onSizesCommit: () => calls.push('commit'),
          onKeyDown: () => calls.push('root'),
        }}
      />,
    );

    fireEvent.keyDown(screen.getByRole('separator'), { key: 'ArrowRight' });
    expect(calls).toEqual(['change', 'commit', 'root']);
  });

  it('supports vertical keyboard movement and rejects another Handle while owned', async () => {
    const onSizesChange = vi.fn();
    await render(
      <Resizable.Root
        orientation="vertical"
        defaultSizes={{ A: 40, B: 30, C: 30 }}
        onSizesChange={onSizesChange}
      >
        <Resizable.Panel id="A" />
        <Resizable.Handle id="h-ab" before="A" after="B" aria-label="Resize A and B" />
        <Resizable.Panel id="B" />
        <Resizable.Handle id="h-bc" before="B" after="C" aria-label="Resize B and C" />
        <Resizable.Panel id="C" />
      </Resizable.Root>,
    );
    const handles = screen.getAllByRole('separator');
    expect(handles[0]?.getAttribute('aria-orientation')).toBe('horizontal');
    fireEvent.keyDown(handles[0]!, { key: 'ArrowDown' });
    expect(sizesFromPanels()).toEqual({ A: 41, B: 29, C: 30 });
    expect(onSizesChange).toHaveBeenCalledTimes(1);
  });

  it('keeps logical IDs and interaction state isolated between Roots', async () => {
    await render(
      <React.Fragment>
        <Basic />
        <Basic />
      </React.Fragment>,
    );
    const roots = document.querySelectorAll<HTMLDivElement>('.tale-resizable');
    const handles = screen.getAllByRole('separator');

    fireEvent.keyDown(handles[0]!, { key: 'ArrowRight' });
    expect(
      Array.from(roots[0]!.querySelectorAll<HTMLElement>('[data-panel-id]')).map(
        (panel) => panel.style.flexBasis,
      ),
    ).toEqual(['41%', '59%']);
    expect(
      Array.from(roots[1]!.querySelectorAll<HTMLElement>('[data-panel-id]')).map(
        (panel) => panel.style.flexBasis,
      ),
    ).toEqual(['40%', '60%']);
    expect(handles[0]!.getAttribute('aria-controls')).not.toBe(
      handles[1]!.getAttribute('aria-controls'),
    );
  });

  it.runIf(isJSDOM)(
    'contains hostile controlled record access and local disabled/read-only values',
    async () => {
      const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const hostile = new Proxy(
        { A: 40, B: 60 },
        {
          get(_target, property) {
            if (property === 'A') {
              throw new Error('private size');
            }
            return 60;
          },
        },
      );
      const onSizesChange = vi.fn();
      let setRootProps!: React.Dispatch<React.SetStateAction<Partial<ResizableRootProps>>>;
      function Harness() {
        const [rootProps, updateRootProps] = React.useState<Partial<ResizableRootProps>>({
          defaultSizes: undefined,
          sizes: hostile,
          onSizesChange,
        });
        setRootProps = updateRootProps;
        return <Basic rootProps={rootProps} />;
      }
      await render(<Harness />);
      expect(screen.getByText('Alpha').style.flexBasis).toBe('');

      act(() =>
        setRootProps({
          defaultSizes: undefined,
          sizes: { A: 40, B: 60 },
          isReadOnly: true,
          onSizesChange,
        }),
      );
      const handle = screen.getByRole('separator');
      expect(handle.getAttribute('aria-disabled')).toBe('true');
      fireEvent.keyDown(handle, { key: 'ArrowRight' });
      expect(onSizesChange).not.toHaveBeenCalled();
      warning.mockRestore();
    },
  );

  it('runtime-strips raw HTML and owned handlers without executing them', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const unsafe = vi.fn();
    const rootProps = {
      defaultSizes: { A: 40, B: 60 },
      onPointerDownCapture: unsafe,
    } as unknown as ResizableRootProps;
    const panelProps = {
      id: 'A',
      dangerouslySetInnerHTML: { __html: '<img src=x onerror=alert(1)>' },
    } as unknown as ResizablePanelProps;
    const handleProps = {
      id: 'h-ab',
      before: 'A',
      after: 'B',
      'aria-label': 'Resize',
      onPointerDown: unsafe,
      role: 'button',
      tabIndex: 12,
    } as unknown as ResizableHandleProps;
    await render(
      <Resizable.Root {...rootProps}>
        <Resizable.Panel {...panelProps}>Safe</Resizable.Panel>
        <Resizable.Handle {...handleProps} />
        <Resizable.Panel id="B" />
      </Resizable.Root>,
    );

    const handle = screen.getByRole('separator');
    expect(handle.tabIndex).toBe(0);
    expect(document.querySelector('img')).toBeNull();
    expect(unsafe).not.toHaveBeenCalled();
    expect(warning).toHaveBeenCalledWith('Tale UI: RESIZABLE_OWNED_HANDLER_OMITTED');
    expect(warning).toHaveBeenCalledWith('Tale UI: RESIZABLE_DANGEROUS_HTML_OMITTED');
    warning.mockRestore();
  });

  it.runIf(isJSDOM)('preserves deterministic SSR and first hydration output', () => {
    const view = renderToString(<Basic />);
    expect(sizesFromPanels()).toEqual({ A: 40, B: 60 });
    expect(screen.getByRole('separator').getAttribute('aria-valuenow')).toBe('40');
    const hydrated = view.hydrate();
    expect(sizesFromPanels()).toEqual({ A: 40, B: 60 });
    expect(screen.getByRole('separator').getAttribute('aria-valuenow')).toBe('40');
    hydrated.unmount();
  });

  it.skipIf(isJSDOM)(
    'uses useMove for pointer updates, commits once, and releases capture',
    async () => {
      const changes: ResizableSizes[] = [];
      const commits: ResizableSizes[] = [];
      const view = await render(
        <Basic
          rootProps={{
            onSizesChange: (sizes) => changes.push(sizes),
            onSizesCommit: (sizes) => commits.push(sizes),
          }}
        />,
      );
      const root = view.container.querySelector<HTMLDivElement>('.tale-resizable')!;
      const handle = screen.getByRole('separator') as HTMLDivElement;
      mockRootSize(root);
      const setCapture = vi.spyOn(handle, 'setPointerCapture');
      const releaseCapture = vi.spyOn(handle, 'releasePointerCapture');
      vi.spyOn(handle, 'hasPointerCapture').mockReturnValue(true);

      fireEvent.pointerDown(handle, {
        button: 0,
        clientX: 400,
        clientY: 20,
        pointerId: 1,
        pointerType: 'mouse',
      });
      fireEvent.pointerMove(window, {
        clientX: 450,
        clientY: 20,
        pointerId: 1,
        pointerType: 'mouse',
      });
      fireEvent.pointerMove(window, {
        clientX: 500,
        clientY: 20,
        pointerId: 1,
        pointerType: 'mouse',
      });
      expect(sizesFromPanels()).toEqual({ A: 50, B: 50 });
      expect(changes).toHaveLength(2);
      expect(commits).toHaveLength(0);

      fireEvent.pointerUp(window, {
        button: 0,
        clientX: 500,
        clientY: 20,
        pointerId: 1,
        pointerType: 'mouse',
      });
      expect(commits).toHaveLength(1);
      expect(commits[0]).toEqual({ A: 50, B: 50 });
      expect(setCapture).toHaveBeenCalledWith(1);
      expect(releaseCapture).toHaveBeenCalledWith(1);
    },
  );

  it.skipIf(isJSDOM)('cancels pointer ownership on capture loss and resize', async () => {
    const onSizesCommit = vi.fn();
    const view = await render(<Basic rootProps={{ onSizesCommit }} />);
    const root = view.container.querySelector<HTMLDivElement>('.tale-resizable')!;
    const handle = screen.getByRole('separator') as HTMLDivElement;
    mockRootSize(root);
    vi.spyOn(handle, 'hasPointerCapture').mockReturnValue(false);

    fireEvent.pointerDown(handle, { button: 0, clientX: 400, pointerId: 1 });
    fireEvent.pointerMove(window, { clientX: 450, pointerId: 1 });
    fireEvent(handle, new PointerEvent('lostpointercapture', { pointerId: 1, bubbles: true }));
    fireEvent.pointerUp(window, { button: 0, clientX: 450, pointerId: 1 });
    expect(onSizesCommit).not.toHaveBeenCalled();

    fireEvent.pointerDown(handle, { button: 0, clientX: 450, pointerId: 2 });
    fireEvent.pointerMove(window, { clientX: 500, pointerId: 2 });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    fireEvent.pointerUp(window, { button: 0, clientX: 500, pointerId: 2 });
    expect(onSizesCommit).not.toHaveBeenCalled();
  });

  it.skipIf(isJSDOM)(
    'continues controlled pointer movement only after exact acknowledgement',
    async () => {
      const changes: ResizableSizes[] = [];
      const commits: ResizableSizes[] = [];
      function Harness() {
        const [sizes, setSizes] = React.useState<ResizableSizes>({ A: 40, B: 60 });
        return (
          <Basic
            rootProps={{
              defaultSizes: undefined,
              sizes,
              onSizesChange(next) {
                changes.push(next);
                setSizes(next);
              },
              onSizesCommit: (next) => commits.push(next),
            }}
          />
        );
      }
      const view = await render(<Harness />);
      const root = view.container.querySelector<HTMLDivElement>('.tale-resizable')!;
      const handle = screen.getByRole('separator') as HTMLDivElement;
      mockRootSize(root);

      fireEvent.pointerDown(handle, { button: 0, clientX: 400, pointerId: 1 });
      fireEvent.pointerMove(window, { clientX: 450, pointerId: 1 });
      fireEvent.pointerMove(window, { clientX: 500, pointerId: 1 });
      fireEvent.pointerUp(window, { button: 0, clientX: 500, pointerId: 1 });

      expect(changes).toEqual([
        { A: 45, B: 55 },
        { A: 50, B: 50 },
      ]);
      expect(commits).toEqual([{ A: 50, B: 50 }]);
      expect(sizesFromPanels()).toEqual({ A: 50, B: 50 });
    },
  );

  it.skipIf(isJSDOM)(
    'cancels unacknowledged controlled movement and rejects competing ownership',
    async () => {
      const changes: ResizableSizes[] = [];
      const commits: ResizableSizes[] = [];
      const view = await render(
        <Resizable.Root
          sizes={{ A: 40, B: 30, C: 30 }}
          onSizesChange={(next) => changes.push(next)}
          onSizesCommit={(next) => commits.push(next)}
        >
          <Resizable.Panel id="A" />
          <Resizable.Handle id="h-ab" before="A" after="B" aria-label="Resize A and B" />
          <Resizable.Panel id="B" />
          <Resizable.Handle id="h-bc" before="B" after="C" aria-label="Resize B and C" />
          <Resizable.Panel id="C" />
        </Resizable.Root>,
      );
      const root = view.container.querySelector<HTMLDivElement>('.tale-resizable')!;
      const handles = screen.getAllByRole('separator') as HTMLDivElement[];
      mockRootSize(root);

      fireEvent.pointerDown(handles[0]!, { button: 0, clientX: 400, pointerId: 1 });
      fireEvent.pointerDown(handles[0]!, { button: 0, clientX: 400, pointerId: 2 });
      fireEvent.pointerDown(handles[1]!, { button: 0, clientX: 400, pointerId: 3 });
      fireEvent.keyDown(handles[1]!, { key: 'ArrowRight' });
      fireEvent.pointerMove(window, { clientX: 450, pointerId: 1 });
      fireEvent.pointerMove(window, { clientX: 500, pointerId: 1 });
      fireEvent.pointerUp(window, { button: 0, clientX: 500, pointerId: 1 });

      expect(changes).toEqual([{ A: 45, B: 25, C: 30 }]);
      expect(commits).toEqual([]);
      expect(sizesFromPanels()).toEqual({ A: 40, B: 30, C: 30 });
    },
  );

  it.skipIf(isJSDOM)(
    'cancels on bound reconfiguration and applies horizontal RTL pointer direction',
    async () => {
      const commits: ResizableSizes[] = [];
      let tighten!: () => void;
      function Harness() {
        const [tight, setTight] = React.useState(false);
        tighten = () => setTight(true);
        return (
          <Resizable.Root
            defaultSizes={{ A: 40, B: 60 }}
            onSizesCommit={(next) => commits.push(next)}
            style={{ direction: 'rtl' }}
          >
            <Resizable.Panel id="A" minSize={20} maxSize={tight ? 34 : 70} />
            <Resizable.Handle id="h-ab" before="A" after="B" aria-label="Resize A and B" />
            <Resizable.Panel id="B" minSize={20} maxSize={80} />
          </Resizable.Root>
        );
      }
      const view = await render(<Harness />);
      const root = view.container.querySelector<HTMLDivElement>('.tale-resizable')!;
      const handle = screen.getByRole('separator') as HTMLDivElement;
      mockRootSize(root);

      fireEvent.pointerDown(handle, { button: 0, clientX: 400, pointerId: 1 });
      fireEvent.pointerMove(window, { clientX: 450, pointerId: 1 });
      expect(sizesFromPanels()).toEqual({ A: 35, B: 65 });
      act(tighten);
      expect(sizesFromPanels()).toEqual({ A: 34, B: 66 });
      fireEvent.pointerUp(window, { button: 0, clientX: 450, pointerId: 1 });
      expect(commits).toEqual([]);
    },
  );
});
