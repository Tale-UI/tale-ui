import * as React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { useTaleUiId } from '../../src/utils/useTaleUiId';
import {
  assertUniqueOwnedIds,
  createDispatchProbe,
  renderInOwnedDocument,
  type OwnedDocumentRender,
} from './harness';

const renders: OwnedDocumentRender[] = [];

function IdentityFixture({ suffix }: { suffix: string }) {
  const id = useTaleUiId();
  return <div id={id} data-suffix={suffix} />;
}

afterEach(async () => {
  await renders
    .splice(0)
    .reduce((pending, render) => pending.then(() => render.unmount()), Promise.resolve());
});

describe('component-equivalence test harness', () => {
  it('renders strict multi-instance fixtures in independent owner documents', async () => {
    renders.push(
      await renderInOwnedDocument(
        <React.Fragment>
          <IdentityFixture suffix="first" />
          <IdentityFixture suffix="second" />
        </React.Fragment>,
        { strict: true },
      ),
      await renderInOwnedDocument(<IdentityFixture suffix="third" />, { strict: true }),
    );

    expect(renders[0].container.ownerDocument).toBe(renders[0].document);
    expect(renders[1].container.ownerDocument).toBe(renders[1].document);
    expect(renders[0].document).not.toBe(renders[1].document);
    expect(assertUniqueOwnedIds(renders.map(({ container }) => container))).toHaveLength(3);
  });

  it('makes duplicate semantic dispatch observable', () => {
    const probe = createDispatchProbe();
    probe.record('change');
    expect(() => probe.assertOnce('change')).not.toThrow();
    probe.record('change');
    expect(probe.count('change')).toBe(2);
    expect(() => probe.assertOnce('change')).toThrow('Expected one change dispatch, received 2');
  });
});
