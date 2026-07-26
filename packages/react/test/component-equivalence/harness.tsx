import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';

export interface OwnedDocumentRender {
  container: HTMLDivElement;
  document: Document;
  root: ReactDOMClient.Root;
  rerender(element: React.ReactNode): Promise<void>;
  unmount(): Promise<void>;
}

export async function renderInOwnedDocument(
  element: React.ReactNode,
  options: { strict?: boolean } = {},
): Promise<OwnedDocumentRender> {
  const ownedDocument = document.implementation.createHTMLDocument('Tale UI test document');
  const container = ownedDocument.createElement('div');
  ownedDocument.body.append(container);
  const root = ReactDOMClient.createRoot(container);
  const wrap = (value: React.ReactNode) =>
    options.strict ? <React.StrictMode>{value}</React.StrictMode> : value;

  await React.act(async () => {
    root.render(wrap(element));
  });

  return {
    container,
    document: ownedDocument,
    root,
    async rerender(next) {
      await React.act(async () => {
        root.render(wrap(next));
      });
    },
    async unmount() {
      await React.act(async () => {
        root.unmount();
      });
    },
  };
}

export function assertUniqueOwnedIds(containers: ParentNode[], selector = '[id]'): string[] {
  const ids = containers.flatMap((container) =>
    Array.from(container.querySelectorAll<HTMLElement>(selector))
      .map((element) => element.id)
      .filter(Boolean),
  );
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length > 0) {
    throw new Error(`Duplicate document ID(s): ${[...new Set(duplicates)].join(', ')}`);
  }
  return ids;
}

export function createDispatchProbe() {
  const counts = new Map<string, number>();
  return {
    record(key: string) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    },
    assertOnce(key: string) {
      const count = counts.get(key) ?? 0;
      if (count !== 1) {
        throw new Error(`Expected one ${key} dispatch, received ${count}`);
      }
    },
    count(key: string) {
      return counts.get(key) ?? 0;
    },
  };
}
