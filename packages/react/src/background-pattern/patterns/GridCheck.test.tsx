import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { GridCheck } from './GridCheck';

function hashMarkup(markup: string) {
  let hash = 0n;
  for (let index = 0; index < markup.length; index += 1) {
    hash = (hash * 131n + BigInt(markup.charCodeAt(index))) % 1_000_000_000_000_000_003n;
  }
  return hash.toString(16);
}

describe('GridCheck', () => {
  it.each([
    ['md', 27_238, '7342ccc56c650f8'],
    ['sm', 60_810, '9432b21dd4c365c'],
  ] as const)('preserves the exact %s SVG markup', (size, length, hash) => {
    const view = ReactDOMServer.renderToStaticMarkup(
      <GridCheck size={size} className="custom" aria-label="pattern" data-test="value" />,
    );

    expect(view).toHaveLength(length);
    expect(hashMarkup(view)).toBe(hash);
  });
});
