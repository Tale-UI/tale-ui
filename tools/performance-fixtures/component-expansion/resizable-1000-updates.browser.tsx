import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import { Resizable } from '@tale-ui/react/resizable';
import {
  RESIZABLE_UPDATE_COUNT,
  resizablePositions,
  resizableSetup,
} from './resizable-1000-updates.shared';

interface Proposal {
  A: number;
  B: number;
  C: number;
}

interface BenchmarkResult {
  duration: number;
  postcondition: {
    acts: number;
    aria: {
      controls: string;
      orientation: string;
      valueMax: string;
      valueMin: string;
      valueNow: string;
      valueText: string;
    };
    capture: {
      activePointerId: number | null;
      releases: number;
      sets: number;
    };
    changes: number;
    commits: number;
    finalSizes: Proposal;
    firstProposal: Proposal;
    flexBases: Record<string, string>;
    lastProposal: Proposal;
    markup: string;
    pendingWork: number;
    proposals: Proposal[];
    rootRect: {
      height: number;
      left: number;
      top: number;
      width: number;
    };
  };
}

interface BenchmarkApi {
  runSample: () => BenchmarkResult;
}

declare global {
  interface Window {
    taleResizableBenchmark?: BenchmarkApi;
    taleResizableBenchmarkError?: string;
  }
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function readProposal(sizes: Readonly<Record<string, number>>): Proposal {
  return {
    A: sizes.A!,
    B: sizes.B!,
    C: sizes.C!,
  };
}

function pointerEvent(
  type: 'pointerdown' | 'pointermove' | 'pointerup',
  position: { clientX: number; clientY: number },
) {
  return new PointerEvent(type, {
    bubbles: true,
    button: resizableSetup.pointer.button,
    buttons: type === 'pointerup' ? 0 : 1,
    clientX: position.clientX,
    clientY: position.clientY,
    isPrimary: true,
    pointerId: resizableSetup.pointer.id,
    pointerType: 'mouse',
  });
}

async function initialize() {
  const proposals: Proposal[] = [];
  const changeMetadata: Array<{ handleId: string; source: string }> = [];
  const commits: Proposal[] = [];
  const commitMetadata: Array<{ handleId: string; source: string }> = [];

  function BenchmarkApp() {
    return (
      <Resizable.Root
        defaultSizes={resizableSetup.defaultSizes}
        orientation={resizableSetup.orientation}
        keyboardStep={resizableSetup.keyboardStep}
        keyboardLargeStep={resizableSetup.keyboardLargeStep}
        precision={resizableSetup.precision}
        onSizesChange={(sizes, meta) => {
          proposals.push(readProposal(sizes));
          changeMetadata.push({ handleId: meta.handleId, source: meta.source });
        }}
        onSizesCommit={(sizes, meta) => {
          commits.push(readProposal(sizes));
          commitMetadata.push({ handleId: meta.handleId, source: meta.source });
        }}
        data-resizable-benchmark=""
        style={{
          boxSizing: 'border-box',
          direction: resizableSetup.direction,
          width: resizableSetup.root.width,
          height: resizableSetup.root.height,
        }}
      >
        <Resizable.Panel
          id="A"
          minSize={resizableSetup.bounds.A.min}
          maxSize={resizableSetup.bounds.A.max}
        >
          A
        </Resizable.Panel>
        <Resizable.Handle
          id={resizableSetup.activeHandle.id}
          before={resizableSetup.activeHandle.before}
          after={resizableSetup.activeHandle.after}
          aria-label="Resize A and B"
        />
        <Resizable.Panel
          id="B"
          minSize={resizableSetup.bounds.B.min}
          maxSize={resizableSetup.bounds.B.max}
        >
          B
        </Resizable.Panel>
        <Resizable.Handle id="h-bc" before="B" after="C" aria-label="Resize B and C" />
        <Resizable.Panel
          id="C"
          minSize={resizableSetup.bounds.C.min}
          maxSize={resizableSetup.bounds.C.max}
        >
          C
        </Resizable.Panel>
      </Resizable.Root>
    );
  }

  const container = document.querySelector<HTMLElement>('#app');
  invariant(container, 'Resizable benchmark container is missing');
  const root = ReactDOMClient.createRoot(container);
  React.act(() => {
    ReactDOM.flushSync(() => root.render(<BenchmarkApp />));
  });

  const rootElement = container.querySelector<HTMLDivElement>('[data-resizable-benchmark]');
  const handle = container.querySelector<HTMLDivElement>('[data-handle-id="h-ab"]');
  invariant(rootElement, 'Resizable benchmark Root is missing');
  invariant(handle, 'Resizable benchmark active Handle is missing');

  const rootRect = rootElement.getBoundingClientRect();
  invariant(rootRect.left === resizableSetup.root.left, 'Resizable Root left coordinate drifted');
  invariant(rootRect.top === resizableSetup.root.top, 'Resizable Root top coordinate drifted');
  invariant(rootRect.width === resizableSetup.root.width, 'Resizable Root width drifted');
  invariant(rootRect.height === resizableSetup.root.height, 'Resizable Root height drifted');

  let activePointerId: number | null = null;
  let captureSets = 0;
  let captureReleases = 0;
  Object.defineProperties(handle, {
    setPointerCapture: {
      configurable: true,
      value(pointerId: number) {
        invariant(activePointerId === null, 'Resizable acquired pointer capture twice');
        activePointerId = pointerId;
        captureSets += 1;
      },
    },
    hasPointerCapture: {
      configurable: true,
      value(pointerId: number) {
        return activePointerId === pointerId;
      },
    },
    releasePointerCapture: {
      configurable: true,
      value(pointerId: number) {
        invariant(activePointerId === pointerId, 'Resizable released the wrong pointer');
        activePointerId = null;
        captureReleases += 1;
      },
    },
  });

  window.taleResizableBenchmark = {
    runSample() {
      invariant(proposals.length === 0, 'Resizable benchmark sample must start without proposals');
      invariant(commits.length === 0, 'Resizable benchmark sample must start without commits');

      let acts = 0;
      let pendingWork = 0;
      React.act(() => {
        handle.dispatchEvent(pointerEvent('pointerdown', resizableSetup.pointer.origin));
      });
      invariant(
        activePointerId === resizableSetup.pointer.id,
        'Resizable did not capture pointer 1',
      );

      const deliverPosition = (position: (typeof resizablePositions)[number]) => {
        pendingWork += 1;
        React.act(() => {
          acts += 1;
          window.dispatchEvent(pointerEvent('pointermove', position));
        });
        pendingWork -= 1;
      };

      const started = window.performance.now();
      for (const position of resizablePositions) {
        deliverPosition(position);
      }
      const duration = window.performance.now() - started;

      React.act(() => {
        window.dispatchEvent(pointerEvent('pointerup', resizableSetup.pointer.completion));
      });
      React.act(() => {});

      invariant(acts === RESIZABLE_UPDATE_COUNT, 'Resizable benchmark act count drifted');
      invariant(
        proposals.length === RESIZABLE_UPDATE_COUNT,
        'Resizable benchmark change count drifted',
      );
      invariant(commits.length === 1, 'Resizable benchmark commit count drifted');
      invariant(pendingWork === 0, 'Resizable benchmark left act delivery work pending');
      invariant(captureSets === 1, 'Resizable benchmark pointer capture count drifted');
      invariant(captureReleases === 1, 'Resizable benchmark pointer release count drifted');
      invariant(activePointerId === null, 'Resizable benchmark left pointer capture active');

      for (let index = 0; index < proposals.length; index += 1) {
        const proposal = proposals[index]!;
        const metadata = changeMetadata[index]!;
        invariant(
          metadata.handleId === resizableSetup.activeHandle.id && metadata.source === 'pointer',
          `Resizable change metadata drifted at delivery ${index}`,
        );
        invariant(proposal.C === 30, `Resizable changed C at delivery ${index}`);
        invariant(
          Math.abs(proposal.A + proposal.B + proposal.C - 100) <= 10 ** -resizableSetup.precision,
          `Resizable proposal sum drifted at delivery ${index}`,
        );
        if (index > 0) {
          invariant(
            proposal.A >= proposals[index - 1]!.A,
            `Resizable A was not monotonic at delivery ${index}`,
          );
          invariant(
            proposal.B <= proposals[index - 1]!.B,
            `Resizable B was not monotonic at delivery ${index}`,
          );
        }
      }

      invariant(
        commitMetadata[0]?.handleId === resizableSetup.activeHandle.id &&
          commitMetadata[0]?.source === 'pointer',
        'Resizable commit metadata drifted',
      );
      const finalSizes = commits[0]!;
      invariant(
        finalSizes.A === 50 && finalSizes.B === 20 && finalSizes.C === 30,
        'Resizable final sizes drifted',
      );
      invariant(
        JSON.stringify(proposals.at(-1)) === JSON.stringify(finalSizes),
        'Resizable commit did not match the final proposal',
      );

      const panels = Object.fromEntries(
        Array.from(container.querySelectorAll<HTMLElement>('[data-panel-id]')).map((panel) => [
          panel.dataset.panelId!,
          panel.style.flexBasis,
        ]),
      );
      invariant(
        panels.A === '50%' && panels.B === '20%' && panels.C === '30%',
        'Resizable final flex bases drifted',
      );
      invariant(handle.getAttribute('aria-valuenow') === '50', 'Resizable aria-valuenow drifted');
      invariant(handle.getAttribute('aria-valuemin') === '20', 'Resizable aria-valuemin drifted');
      invariant(handle.getAttribute('aria-valuemax') === '50', 'Resizable aria-valuemax drifted');
      invariant(
        handle.getAttribute('aria-valuetext') === '50% / 20%',
        'Resizable aria-valuetext drifted',
      );
      invariant(
        handle.getAttribute('aria-orientation') === 'vertical',
        'Resizable aria-orientation drifted',
      );
      const controls = handle.getAttribute('aria-controls') ?? '';
      const controlledIds = controls.split(' ');
      invariant(
        controlledIds.length === 2 &&
          controlledIds.every((id) => document.getElementById(id) !== null),
        'Resizable aria-controls drifted',
      );

      return {
        duration,
        postcondition: {
          acts,
          aria: {
            controls,
            orientation: handle.getAttribute('aria-orientation')!,
            valueMax: handle.getAttribute('aria-valuemax')!,
            valueMin: handle.getAttribute('aria-valuemin')!,
            valueNow: handle.getAttribute('aria-valuenow')!,
            valueText: handle.getAttribute('aria-valuetext')!,
          },
          capture: {
            activePointerId,
            releases: captureReleases,
            sets: captureSets,
          },
          changes: proposals.length,
          commits: commits.length,
          finalSizes,
          firstProposal: proposals[0]!,
          flexBases: panels,
          lastProposal: proposals.at(-1)!,
          markup: container.innerHTML,
          pendingWork,
          proposals,
          rootRect: {
            height: rootRect.height,
            left: rootRect.left,
            top: rootRect.top,
            width: rootRect.width,
          },
        },
      };
    },
  };
}

void initialize().catch((error: unknown) => {
  window.taleResizableBenchmarkError = error instanceof Error ? error.message : String(error);
});
