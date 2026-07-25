import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sanitizeFigmaObservation } from './check-figma-live.mjs';

test('live Figma normalization isolates protected references from the public report', () => {
  const reports = sanitizeFigmaObservation(
    [
      {
        alias: 'fixture',
        fileKey: 'private-file-key',
        payload: {
          document: {
            children: [
              {
                id: 'private-node-id',
                name: 'Button',
                type: 'COMPONENT',
              },
            ],
          },
        },
      },
    ],
    ['Button', 'Card'],
  );
  assert.match(JSON.stringify(reports.internal), /private-file-key|private-node-id/);
  assert.doesNotMatch(JSON.stringify(reports.public), /private-file-key|private-node-id|Button/);
  assert.deepEqual(reports.public.mismatchCategories, {
    designWithoutCodeName: 0,
    codeWithoutDesignName: 1,
  });
});
