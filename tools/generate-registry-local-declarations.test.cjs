/* eslint-disable @typescript-eslint/no-require-imports, import/extensions */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const {
  extractConfiguredLocalProps,
  resolveConfiguredLocalProp,
} = require('./generate-registry.js');

test('configured local resolver flattens aliases, unions, intersections, and object members', () => {
  const source = `
    type Accessible =
      | { role?: 'group' | 'region' }
      | { role: 'presentation' };
    export type ButtonGroupProps =
      import('react-aria-components').GroupProps &
      Accessible & { orientation?: 'horizontal' | 'vertical' };
  `;
  assert.deepEqual(resolveConfiguredLocalProp(source, 'ButtonGroupProps', 'role'), {
    name: 'role',
    type: "'group' | 'region' | 'presentation'",
    required: false,
    description: null,
    default: null,
    allowedValues: ['group', 'region', 'presentation'],
  });
});

test('configured Timestamp and Toast props resolve without following imported types', () => {
  const timestamp = `
    interface Base extends React.TimeHTMLAttributes<HTMLTimeElement> {}
    interface Absolute extends Base { format?: 'date' | 'time' | 'datetime'; }
    interface Relative extends Base { format: 'relative'; }
    export type TimestampProps = Absolute | Relative;
  `;
  assert.deepEqual(
    resolveConfiguredLocalProp(timestamp, 'TimestampProps', 'format').allowedValues,
    ['date', 'time', 'datetime', 'relative'],
  );
  const toast = `
    export interface ToastRegionProps {
      placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
    }
  `;
  assert.deepEqual(extractConfiguredLocalProps('toast', toast)[0].allowedValues, [
    'top-start',
    'top-end',
    'bottom-start',
    'bottom-end',
  ]);
});

test('configured conflicts and non-string domains fail closed', () => {
  assert.throws(
    () =>
      resolveConfiguredLocalProp(
        "type Value = { role?: 'group' }; type Value = { role?: 'region' };",
        'Value',
        'role',
      ),
    /Conflicting local declaration Value/,
  );
  assert.throws(
    () =>
      resolveConfiguredLocalProp(
        'interface ToastRegionProps { placement?: string; }',
        'ToastRegionProps',
        'placement',
      ),
    /must resolve only to string literals/,
  );
});
