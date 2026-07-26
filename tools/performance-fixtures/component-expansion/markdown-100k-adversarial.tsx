import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Markdown } from '../../../packages/react/src/markdown/index.ts';
import {
  parseMarkdown,
  type MarkdownBlockNode,
  type MarkdownInlineNode,
} from '../../../packages/react/src/markdown/markdownParser.ts';
import type {
  ComponentPerformanceFixture,
  ComponentPerformanceSample,
} from './types.ts';

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export const markdownAdversarialSource =
  Array.from({ length: 6 }, () => `---${' '.repeat(9997)}\n`).join('') +
  `---${' '.repeat(88)}\n` +
  Array.from({ length: 9959 }, () => '---\n').join('') +
  `${'> '.repeat(32)}x\n`;

function appendInlineVector(nodes: readonly MarkdownInlineNode[], vector: string[]) {
  for (const node of nodes) {
    vector.push(node.type === 'text' || node.type === 'code' ? `${node.type}:${node.value}` : node.type);
    if ('children' in node) {
      appendInlineVector(node.children, vector);
    }
  }
}

function appendBlockVector(nodes: readonly MarkdownBlockNode[], vector: string[]) {
  for (const node of nodes) {
    vector.push(node.type);
    if (node.type === 'paragraph' || node.type === 'heading') {
      appendInlineVector(node.children, vector);
    } else if (node.type === 'blockquote') {
      appendBlockVector(node.children, vector);
    } else if (node.type === 'list') {
      for (const item of node.items) {
        vector.push('list-item');
        appendBlockVector(item, vector);
      }
    }
  }
}

const parsed = parseMarkdown(markdownAdversarialSource);
assert.equal(markdownAdversarialSource.length, 100_000);
assert.equal(
  Math.max(...markdownAdversarialSource.split('\n').map((line) => line.length)),
  10_000,
);
assert.equal(parsed.ok, true);
assert.ok(parsed.ok);
assert.equal(parsed.parsedNodeCount, 10_000);

const vector: string[] = [];
appendBlockVector(parsed.nodes, vector);
assert.equal(vector.length, 10_000);

const sourceDigest = sha256(markdownAdversarialSource);
const vectorDigest = sha256(JSON.stringify(vector));
const expectedMarkup = renderToStaticMarkup(
  <Markdown>{markdownAdversarialSource}</Markdown>,
);
const markupDigest = sha256(expectedMarkup);
const semanticCounts = {
  blockquotes: vector.filter((entry) => entry === 'blockquote').length,
  paragraphs: vector.filter((entry) => entry === 'paragraph').length,
  text: vector.filter((entry) => entry.startsWith('text:')).length,
  thematicBreaks: vector.filter((entry) => entry === 'thematic-break').length,
};
assert.deepEqual(semanticCounts, {
  blockquotes: 32,
  paragraphs: 1,
  text: 1,
  thematicBreaks: 9966,
});

function assertSafeMarkup(markup: string) {
  assert.ok(markup.startsWith('<div class="tale-markdown">'));
  assert.ok(!/<(?:img|audio|video|source|iframe|object|embed|script)\b/i.test(markup));
  assert.ok(!/\b(?:javascript|vbscript|data):/i.test(markup));
  assert.ok(!/https?:\/\/[^/\s]+:[^@\s]+@/i.test(markup));
  assert.ok(!/Content unavailable/.test(markup));
}
assertSafeMarkup(expectedMarkup);

const expectedPostconditionDigest = sha256(
  JSON.stringify({
    sourceLength: markdownAdversarialSource.length,
    maxLineLength: 10_000,
    nestingDepth: 32,
    normalizedNodes: vector.length,
    sourceDigest,
    vectorDigest,
    markupDigest,
    semanticCounts,
  }),
);

function runSample(): ComponentPerformanceSample {
  const started = performance.now();
  const markup = renderToStaticMarkup(
    <Markdown>{markdownAdversarialSource}</Markdown>,
  );
  const duration = performance.now() - started;

  assert.equal(sha256(markup), markupDigest);
  assertSafeMarkup(markup);

  return {
    duration,
    postconditionDigest: expectedPostconditionDigest,
  };
}

export const markdown100kAdversarialFixture: ComponentPerformanceFixture = {
  id: 'markdown-100k-adversarial',
  description:
    'One bounded validate, parse, filter, and static-render operation for the exact 100k adversarial Markdown vector.',
  path: 'tools/performance-fixtures/component-expansion/markdown-100k-adversarial.tsx',
  setup:
    'Construct and digest the exact 100,000-unit vector outside timing; each sample performs one fresh renderToStaticMarkup call.',
  operationCount: 1,
  sourceDigest,
  vectorDigest,
  markupDigest,
  expectedPostconditionDigest,
  runSample,
};
