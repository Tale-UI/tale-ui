#!/usr/bin/env node

import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(
  readFileSync(path.join(root, 'registry/platforms/react-native.json'), 'utf8'),
);
const outputRoot = path.join(root, 'playground/react-native-storybook/src/components');
const metadataPath = path.join(root, 'registry/platforms/react-native-story-controls.json');
const controlsPath = path.join(
  root,
  'playground/react-native-storybook/src/NativeStoryControls.ts',
);
const check = process.argv.includes('--check');
const formatGenerated = async (source, filepath) =>
  format(source, { ...(await resolveConfig(filepath)), filepath });

const text = (name, defaultValue, description) => ({
  name,
  defaultValue,
  description,
  control: 'text',
});
const boolean = (name, defaultValue, description) => ({
  name,
  defaultValue,
  description,
  control: 'boolean',
});
const number = (name, defaultValue, description, min, max, step = 1) => ({
  name,
  defaultValue,
  description,
  control: { type: 'number', min, max, step },
});
const select = (name, defaultValue, options, description) => ({
  name,
  defaultValue,
  description,
  control: 'select',
  options,
});
const object = (name, defaultValue, description) => ({
  name,
  defaultValue,
  description,
  control: 'object',
});
const nativeToken = (name) => ({ __nativeToken: name });
const action = (name, description) => ({ name, description });

const definitions = {
  accordion: {
    properties: [
      object(
        'items',
        [
          { id: 'shipping', title: 'Shipping', content: 'Ships in 2–3 days.' },
          { id: 'returns', title: 'Returns', content: 'Returns accepted for 30 days.' },
        ],
        'Accordion items. String content is adapted to native Text in the playground.',
      ),
      boolean('allowsMultipleExpanded', false, 'Allows more than one item to stay expanded.'),
      boolean('isDisabled', false, 'Disables every accordion trigger.'),
    ],
    actions: [],
  },
  'alert-dialog': {
    properties: [
      boolean('isOpen', false, 'Whether the alert dialog is presented.'),
      text('title', 'Delete draft', 'Accessible dialog heading.'),
      text('children', 'This action cannot be undone.', 'Dialog body copy.'),
    ],
    actions: [action('onOpenChange', 'Reports open and close requests.')],
  },
  badge: {
    properties: [
      text('children', 'New', 'Badge label.'),
      select(
        'variant',
        'neutral',
        [
          'neutral',
          'brand',
          'error',
          'warning',
          'success',
          'red',
          'orange',
          'amber',
          'yellow',
          'lime',
          'green',
          'emerald',
          'teal',
          'cyan',
          'sky',
          'indigo',
          'violet',
          'purple',
          'fuchsia',
          'pink',
          'rose',
        ],
        'Badge colour treatment.',
      ),
      select('size', 'md', ['sm', 'md', 'lg'], 'Badge size.'),
      select('type', 'pill', ['pill', 'rounded', 'modern'], 'Badge shape treatment.'),
    ],
    actions: [],
  },
  banner: {
    properties: [
      text('title', 'Saved', 'Banner heading.'),
      text('children', 'Available offline.', 'Banner message.'),
      select(
        'variant',
        'info',
        ['info', 'success', 'warning', 'error'],
        'Semantic colour treatment.',
      ),
      select('size', 'md', ['sm', 'md'], 'Banner density.'),
    ],
    actions: [],
  },
  breadcrumbs: {
    properties: [
      text('accessibilityLabel', 'Breadcrumbs', 'Accessible navigation label.'),
      text('children', 'Home / Settings / Profile', 'Breadcrumb preview content.'),
    ],
    actions: [],
  },
  button: {
    properties: [
      text('children', 'Continue', 'Visible button label.'),
      text('accessibilityLabel', 'Continue', 'Explicit accessible name.'),
      boolean('isDisabled', false, 'Disables activation.'),
      boolean('isPending', false, 'Shows pending state and disables activation.'),
      select(
        'variant',
        'primary',
        ['primary', 'neutral', 'ghost', 'danger', 'danger-neutral', 'danger-ghost', 'inverse'],
        'Button visual treatment.',
      ),
      select('size', 'md', ['sm', 'md', 'lg'], 'Button size.'),
      boolean('showTextWhileLoading', false, 'Keeps the label beside the pending spinner.'),
    ],
    actions: [action('onPress', 'Reports button activation.')],
  },
  card: {
    properties: [
      text('accessibilityLabel', 'Summary card', 'Accessible card label.'),
      text('children', 'Card content', 'Card preview content.'),
      select('variant', 'outlined', ['outlined', 'elevated', 'filled'], 'Card surface treatment.'),
      select('padding', 'md', ['sm', 'md', 'lg'], 'Card inner padding.'),
      boolean('isSelected', false, 'Applies the selected ring.'),
      boolean('isDisabled', false, 'Applies disabled styling.'),
      boolean('isPending', false, 'Applies pending styling.'),
    ],
    actions: [action('onPress', 'Reports card activation.')],
  },
  'checkbox-field': {
    properties: [
      text('children', 'Send updates', 'Checkbox label.'),
      text('accessibilityLabel', 'Send updates', 'Explicit accessible name.'),
      boolean('isSelected', false, 'Controlled selected state.'),
      boolean('isDisabled', false, 'Disables selection.'),
      select('size', 'md', ['sm', 'md'], 'Checkbox indicator size.'),
      boolean('isInvalid', false, 'Applies invalid styling.'),
      boolean('isRequired', false, 'Marks the checkbox as required.'),
    ],
    actions: [action('onSelectionChange', 'Reports selection changes.')],
  },
  'checkbox-group': {
    properties: [
      text('accessibilityLabel', 'Notification choices', 'Accessible group label.'),
      text('children', 'Email, Push, SMS', 'Comma-separated checkbox labels.'),
      select('orientation', 'vertical', ['vertical', 'horizontal'], 'Choice layout direction.'),
    ],
    actions: [],
  },
  column: {
    properties: [
      text('accessibilityLabel', 'Vertical stack', 'Accessible layout label.'),
      text('children', 'First, Second, Third', 'Comma-separated child labels.'),
      select(
        'gap',
        'm',
        ['4xs', '3xs', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl'],
        'Token gap between children.',
      ),
      select(
        'align',
        'stretch',
        ['start', 'center', 'end', 'stretch', 'baseline'],
        'Cross-axis alignment.',
      ),
      select('justify', 'start', ['start', 'center', 'end', 'between'], 'Main-axis distribution.'),
    ],
    actions: [],
  },
  dialog: {
    properties: [
      boolean('isOpen', false, 'Whether the dialog is presented.'),
      text('title', 'Account settings', 'Accessible dialog heading.'),
      text('children', 'Dialog content', 'Dialog body copy.'),
    ],
    actions: [action('onOpenChange', 'Reports open and close requests.')],
  },
  disclosure: {
    properties: [
      text('title', 'More information', 'Disclosure trigger label.'),
      boolean('isExpanded', false, 'Controlled expanded state.'),
      text('children', 'Additional native content.', 'Disclosure panel content.'),
      boolean('isDisabled', false, 'Disables the disclosure trigger.'),
      select('align', 'start', ['start', 'end'], 'Trigger alignment.'),
    ],
    actions: [action('onExpandedChange', 'Reports expansion changes.')],
  },
  drawer: {
    properties: [
      boolean('isOpen', false, 'Whether the drawer is presented.'),
      text('label', 'Navigation drawer', 'Accessible drawer label.'),
      text('children', 'Drawer content', 'Drawer body copy.'),
    ],
    actions: [action('onOpenChange', 'Reports open and close requests.')],
  },
  field: {
    properties: [
      text('label', 'Email', 'Field label.'),
      text('description', 'Used for account notifications.', 'Supporting description.'),
      text('errorMessage', '', 'Validation message; leave empty for a valid field.'),
      boolean('isRequired', false, 'Marks the field as required.'),
    ],
    actions: [],
  },
  fieldset: {
    properties: [
      text('legend', 'Contact preferences', 'Accessible fieldset legend.'),
      boolean('disabled', false, 'Applies disabled styling to the group.'),
    ],
    actions: [],
  },
  form: {
    properties: [text('accessibilityLabel', 'Profile form', 'Accessible form label.')],
    actions: [],
  },
  'grid-list': {
    properties: [
      text('label', 'Photo grid', 'Accessible grid label.'),
      text('children', 'One, Two, Three, Four', 'Comma-separated grid item labels.'),
      select('layout', 'list', ['list', 'grid'], 'Native item layout.'),
    ],
    actions: [],
  },
  icon: {
    properties: [
      text('label', 'Favourite', 'Accessible label; empty makes it decorative.'),
      text('children', '★', 'Visible native glyph or icon content.'),
      select('size', 'md', ['sm', 'md', 'lg', 'xl'], 'Icon wrapper size.'),
    ],
    actions: [],
  },
  'icon-button': {
    properties: [
      text('children', '+', 'Visible icon glyph.'),
      text('accessibilityLabel', 'Add item', 'Required accessible name.'),
      boolean('isDisabled', false, 'Disables activation.'),
      boolean('isPending', false, 'Shows pending state and disables activation.'),
      select(
        'variant',
        'ghost',
        ['primary', 'neutral', 'ghost', 'danger', 'inverse'],
        'Button visual treatment.',
      ),
      select('size', 'md', ['sm', 'md', 'lg'], 'Icon button size.'),
    ],
    actions: [action('onPress', 'Reports button activation.')],
  },
  input: {
    properties: [
      text('accessibilityLabel', 'Email', 'Accessible input name.'),
      text('placeholder', 'name@example.com', 'Placeholder text.'),
      text('value', '', 'Controlled input value.'),
      boolean('isDisabled', false, 'Disables editing.'),
      boolean('isInvalid', false, 'Applies invalid styling.'),
      boolean('isReadOnly', false, 'Prevents editing without disabled opacity.'),
      select('size', 'md', ['sm', 'md', 'lg'], 'Field size.'),
      boolean('secureTextEntry', false, 'Masks entered text.'),
      select(
        'keyboardType',
        'default',
        ['default', 'email-address', 'numeric', 'phone-pad'],
        'Native keyboard layout.',
      ),
    ],
    actions: [action('onChangeText', 'Reports text changes.')],
  },
  list: {
    properties: [
      text('label', 'Messages', 'Accessible list label.'),
      text('children', 'First message, Second message', 'Comma-separated item labels.'),
      select('variant', 'plain', ['plain', 'divided'], 'List divider treatment.'),
      select('density', 'default', ['compact', 'default', 'spacious'], 'List item spacing.'),
    ],
    actions: [],
  },
  'list-box': {
    properties: [
      text('label', 'Options', 'Accessible list-box label.'),
      text('children', 'Selected option, Disabled option', 'Comma-separated option labels.'),
      boolean('frameless', false, 'Removes popup surface styling.'),
      select('layout', 'list', ['list', 'grid'], 'List or grid layout.'),
    ],
    actions: [],
  },
  pagination: {
    properties: [
      text('label', 'Pagination', 'Accessible pagination label.'),
      number('page', 2, 'Current page.', 1, 20),
      number('totalPages', 8, 'Total page count.', 1, 20),
    ],
    actions: [action('onPageChange', 'Reports requested page changes.')],
  },
  'progress-bar': {
    properties: [
      text('label', 'Upload progress', 'Accessible progress label.'),
      number('value', 64, 'Current value.', 0, 100),
      number('minValue', 0, 'Minimum value.', 0, 100),
      number('maxValue', 100, 'Maximum value.', 1, 100),
      select(
        'labelPosition',
        'top',
        ['top', 'right', 'bottom', 'top-floating', 'bottom-floating'],
        'Label and value position.',
      ),
      boolean('isIndeterminate', false, 'Shows indeterminate progress.'),
    ],
    actions: [],
  },
  'radio-field': {
    properties: [
      text('label', 'Delivery method', 'Accessible radio-field label.'),
      select('value', 'standard', ['standard', 'express'], 'Controlled selected value.'),
      object(
        'items',
        [
          { value: 'standard', label: 'Standard' },
          { value: 'express', label: 'Express' },
        ],
        'Radio choices.',
      ),
      select('size', 'md', ['sm', 'md'], 'Radio indicator size.'),
      select('orientation', 'vertical', ['vertical', 'horizontal'], 'Choice layout direction.'),
    ],
    actions: [action('onValueChange', 'Reports selected values.')],
  },
  'radio-group': {
    properties: [
      text('label', 'Delivery method', 'Accessible radio-group label.'),
      select('value', 'standard', ['standard', 'express'], 'Controlled selected value.'),
      object(
        'items',
        [
          { value: 'standard', label: 'Standard' },
          { value: 'express', label: 'Express' },
        ],
        'Radio choices.',
      ),
      select('size', 'md', ['sm', 'md'], 'Radio indicator size.'),
      select('orientation', 'vertical', ['vertical', 'horizontal'], 'Choice layout direction.'),
    ],
    actions: [action('onValueChange', 'Reports selected values.')],
  },
  row: {
    properties: [
      text('accessibilityLabel', 'Horizontal stack', 'Accessible layout label.'),
      text('children', 'First, Second, Third', 'Comma-separated child labels.'),
      select(
        'gap',
        'm',
        ['4xs', '3xs', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl'],
        'Token gap between children.',
      ),
      select(
        'align',
        'center',
        ['start', 'center', 'end', 'stretch', 'baseline'],
        'Cross-axis alignment.',
      ),
      select('justify', 'start', ['start', 'center', 'end', 'between'], 'Main-axis distribution.'),
      boolean('wrap', false, 'Allows children to wrap.'),
    ],
    actions: [],
  },
  'search-field': {
    properties: [
      text('accessibilityLabel', 'Search', 'Accessible search name.'),
      text('placeholder', 'Search components', 'Placeholder text.'),
      text('value', '', 'Controlled search value.'),
      boolean('isDisabled', false, 'Disables editing.'),
      boolean('isInvalid', false, 'Applies invalid styling.'),
      select('variant', 'default', ['default', 'inline'], 'Search field visual treatment.'),
    ],
    actions: [action('onChangeText', 'Reports query changes.')],
  },
  separator: {
    properties: [
      text('accessibilityLabel', 'Section separator', 'Optional accessible description.'),
      select('orientation', 'horizontal', ['horizontal', 'vertical'], 'Separator orientation.'),
    ],
    actions: [],
  },
  skeleton: {
    properties: [
      select('variant', 'text', ['text', 'rectangular', 'circular'], 'Skeleton shape.'),
      select('animation', 'pulse', ['pulse', 'none'], 'Skeleton animation treatment.'),
    ],
    actions: [],
  },
  slider: {
    properties: [
      text('label', 'Volume', 'Accessible slider label.'),
      number('value', 40, 'Current value.', 0, 100),
      number('minValue', 0, 'Minimum value.', 0, 100),
      number('maxValue', 100, 'Maximum value.', 1, 100),
      number('step', 5, 'Accessibility action increment.', 1, 20),
      boolean('isDisabled', false, 'Disables adjustment.'),
      select('orientation', 'horizontal', ['horizontal', 'vertical'], 'Slider orientation.'),
    ],
    actions: [action('onValueChange', 'Reports value changes.')],
  },
  spinner: {
    properties: [
      boolean('animating', true, 'Whether the spinner animates.'),
      select('variant', 'circle', ['circle', 'line', 'dots'], 'Spinner animation style.'),
      select('size', 'md', ['sm', 'md', 'lg'], 'Spinner size.'),
      text('label', 'Loading', 'Accessible loading label.'),
      {
        name: 'color',
        defaultValue: nativeToken('color60'),
        description: 'Spinner color.',
        control: 'color',
      },
    ],
    actions: [],
  },
  'switch-field': {
    properties: [
      text('label', 'Reduce notifications', 'Visible and accessible switch label.'),
      boolean('value', false, 'Controlled switch state.'),
      boolean('disabled', false, 'Disables interaction.'),
      boolean('isInvalid', false, 'Applies invalid styling.'),
      boolean('isRequired', false, 'Marks the switch as required.'),
    ],
    actions: [action('onValueChange', 'Reports switch state changes.')],
  },
  tabs: {
    properties: [
      select('selectedKey', 'one', ['one', 'two'], 'Controlled selected tab.'),
      object(
        'items',
        [
          { id: 'one', label: 'Overview', content: 'Overview panel' },
          { id: 'two', label: 'Details', content: 'Details panel' },
        ],
        'Tab labels and panel content.',
      ),
      select('variant', 'underline', ['underline', 'pills', 'enclosed'], 'Tab visual treatment.'),
      select('size', 'md', ['sm', 'md'], 'Tab size.'),
      select('orientation', 'horizontal', ['horizontal', 'vertical'], 'Tab orientation.'),
    ],
    actions: [action('onSelectionChange', 'Reports selected tab keys.')],
  },
  'tag-group': {
    properties: [
      text('label', 'Topics', 'Accessible tag-group label.'),
      text('children', 'Design, Native, Accessibility', 'Comma-separated tag labels.'),
    ],
    actions: [],
  },
  text: {
    properties: [
      text('children', 'Text with dynamic type support', 'Displayed text.'),
      boolean('selectable', false, 'Allows native text selection.'),
      number('numberOfLines', 0, 'Maximum lines; zero means unlimited.', 0, 8),
      select(
        'variant',
        'text',
        ['display', 'heading', 'title', 'label', 'text', 'mono'],
        'Typography role.',
      ),
      select('size', 'm', ['xs', 's', 'm', 'l'], 'Typography size.'),
      select('color', 'default', ['default', 'muted', 'accent'], 'Semantic text colour.'),
    ],
    actions: [],
  },
  'text-area': {
    properties: [
      text('accessibilityLabel', 'Message', 'Accessible text-area name.'),
      text('placeholder', 'Write a message', 'Placeholder text.'),
      text('value', '', 'Controlled text-area value.'),
      boolean('isDisabled', false, 'Disables editing.'),
      boolean('isInvalid', false, 'Applies invalid styling.'),
    ],
    actions: [action('onChangeText', 'Reports text changes.')],
  },
  toast: {
    properties: [
      text('label', 'Saved notification', 'Accessible notification label.'),
      text('children', 'Changes saved.', 'Notification message.'),
      select(
        'variant',
        'neutral',
        ['neutral', 'success', 'warning', 'danger'],
        'Notification accent.',
      ),
    ],
    actions: [],
  },
  'toggle-button': {
    properties: [
      text('children', 'Bold', 'Visible toggle label.'),
      boolean('isSelected', false, 'Controlled selected state.'),
      boolean('isDisabled', false, 'Disables activation.'),
      select('size', 'md', ['sm', 'md', 'lg'], 'Toggle button size.'),
    ],
    actions: [action('onSelectionChange', 'Reports selection changes.')],
  },
  'toggle-group': {
    properties: [
      text('children', 'Bold, Italic, Underline', 'Comma-separated toggle labels.'),
      text('accessibilityLabel', 'Text formatting', 'Accessible group label.'),
    ],
    actions: [],
  },
  toolbar: {
    properties: [
      text('accessibilityLabel', 'Editing toolbar', 'Accessible toolbar label.'),
      text('children', 'Undo, Redo', 'Comma-separated toolbar action labels.'),
    ],
    actions: [],
  },
};

const adapterContracts = {
  accordion: ['items', 'allowsMultipleExpanded', 'isDisabled'],
  'alert-dialog': ['children', 'isOpen', 'title', 'onOpenChange'],
  badge: ['children', 'variant', 'size', 'type'],
  banner: ['children', 'title', 'variant', 'size'],
  button: [
    'children',
    'variant',
    'size',
    'isDisabled',
    'isPending',
    'showTextWhileLoading',
    'style',
  ],
  'checkbox-field': [
    'children',
    'accessibilityLabel',
    'isSelected',
    'defaultSelected',
    'isDisabled',
    'isInvalid',
    'isRequired',
    'size',
    'onSelectionChange',
  ],
  dialog: ['children', 'isOpen', 'title', 'onOpenChange'],
  disclosure: [
    'children',
    'title',
    'isExpanded',
    'defaultExpanded',
    'isDisabled',
    'align',
    'onExpandedChange',
  ],
  drawer: ['children', 'isOpen', 'label', 'onOpenChange'],
  field: ['children', 'label', 'description', 'errorMessage', 'isRequired'],
  fieldset: ['children', 'legend', 'disabled'],
  form: ['children'],
  'grid-list': ['children', 'label', 'layout'],
  icon: ['children', 'label', 'size'],
  'icon-button': [
    'accessibilityLabel',
    'children',
    'variant',
    'size',
    'isDisabled',
    'isPending',
    'style',
  ],
  input: ['isDisabled', 'isInvalid', 'isReadOnly', 'size'],
  list: ['children', 'label', 'variant', 'density'],
  'list-box': ['children', 'label', 'frameless', 'layout'],
  pagination: ['page', 'totalPages', 'label', 'onPageChange'],
  'progress-bar': ['value', 'minValue', 'maxValue', 'label', 'labelPosition', 'isIndeterminate'],
  'radio-field': [
    'label',
    'items',
    'size',
    'orientation',
    'value',
    'defaultValue',
    'onValueChange',
  ],
  'radio-group': [
    'label',
    'items',
    'size',
    'orientation',
    'value',
    'defaultValue',
    'onValueChange',
  ],
  'search-field': ['isDisabled', 'isInvalid', 'variant'],
  skeleton: ['variant', 'animation'],
  slider: [
    'label',
    'value',
    'minValue',
    'maxValue',
    'step',
    'isDisabled',
    'orientation',
    'onValueChange',
  ],
  'switch-field': ['label', 'isInvalid', 'isRequired'],
  tabs: ['items', 'variant', 'size', 'orientation', 'selectedKey', 'onSelectionChange'],
  'tag-group': ['children', 'label'],
  'text-area': ['isDisabled', 'isInvalid'],
  toast: ['children', 'label', 'variant'],
  'toggle-button': ['children', 'isDisabled', 'size', 'style', 'isSelected', 'onSelectionChange'],
  'toggle-group': ['children', 'accessibilityLabel'],
};

const controlExclusions = {
  button: {
    style: 'React Native style objects are non-portable; visual states live in All Variations.',
  },
  'checkbox-field': {
    defaultSelected: 'Playground uses the controlled isSelected property.',
  },
  disclosure: {
    defaultExpanded: 'Playground uses the controlled isExpanded property.',
  },
  field: {
    children: 'ReactNode composition is represented by a fixed native Input fixture.',
  },
  fieldset: {
    children: 'ReactNode composition is represented by a fixed CheckboxField fixture.',
  },
  form: {
    children: 'ReactNode composition is represented by a fixed form fixture.',
  },
  'icon-button': {
    style: 'React Native style objects are non-portable; visual states live in All Variations.',
  },
  'radio-field': {
    defaultValue: 'Playground uses the controlled value property.',
  },
  'radio-group': {
    defaultValue: 'Playground uses the controlled value property.',
  },
  'toggle-button': {
    style: 'React Native style objects are non-portable; visual states live in All Variations.',
  },
};

const implemented = registry.components.filter(
  ({ delivery, strategy }) => delivery === 'stable' && strategy === 'adapted',
);
assert.equal(
  Object.keys(definitions).length,
  implemented.length,
  'Control definitions must match implemented native component count.',
);

const exportAliases = {
  'radio-field': 'RadioGroup as RadioField',
};

const categorySlug = (category) => category.toLowerCase().replaceAll(' ', '-');
const serialize = (value) => JSON.stringify(value, null, 2);
const generatedHeader = '// Generated by tools/generate-react-native-stories.mjs. Do not edit.\n';

const expectedFiles = new Map();
for (const component of implemented) {
  const definition = definitions[component.slug];
  assert.ok(definition, `${component.id} lacks a native control definition.`);
  assert.ok(
    definition.properties.length + definition.actions.length > 0,
    `${component.id} has no controllable properties or actions.`,
  );
  const covered = new Set([
    ...definition.properties.map(({ name }) => name),
    ...definition.actions.map(({ name }) => name),
    ...Object.keys(controlExclusions[component.slug] ?? {}),
  ]);
  for (const property of adapterContracts[component.slug] ?? []) {
    assert.ok(
      covered.has(property),
      `${component.id}.${property} lacks control coverage or rationale.`,
    );
  }
  const relativePath = path.join(categorySlug(component.category), `${component.slug}.stories.tsx`);
  const publicExport = exportAliases[component.slug] ?? component.id;
  const controlAccessor = /^[A-Za-z_$][\w$]*$/u.test(component.slug)
    ? `.${component.slug}`
    : `['${component.slug}']`;
  const source = `${generatedHeader}
import { ${publicExport} } from '@tale-ui/react-native/${component.slug}';
import type { Meta, StoryObj } from '@storybook/react-native';
import type * as React from 'react';
import { NativePlayground } from '../../NativePlayground';
import { nativeStoryControls } from '../../NativeStoryControls';
import { ${component.id}AllVariations as allVariationsFixture } from '../../Registry.fixtures';

const controls = nativeStoryControls${controlAccessor};
const meta = {
  title: 'Components/${component.category}/${component.id}',
  component: ${component.id},
  args: controls.args as Partial<React.ComponentProps<typeof ${component.id}>>,
  argTypes: controls.argTypes as Meta<typeof ${component.id}>['argTypes'],
  parameters: {
    nativeComponent: '${component.slug}',
    nativeControls: controls.properties,
    nativeActions: controls.actions,
  },
} satisfies Meta<typeof ${component.id}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <NativePlayground args={args} component="${component.slug}" />,
};

export const AllVariations: Story = {
  name: 'All Variations',
  render: allVariationsFixture.render as Story['render'],
};
`;
  expectedFiles.set(
    relativePath,
    await formatGenerated(source, path.join(outputRoot, relativePath)),
  );
}

const generatedControls = {};
const generatedMetadata = {};
for (const component of implemented) {
  const definition = definitions[component.slug];
  const args = Object.fromEntries(
    definition.properties.map(({ name, defaultValue }) => [name, defaultValue]),
  );
  const argTypes = Object.fromEntries([
    ...definition.properties.map(({ name, control, description, options }) => [
      name,
      { control, description, ...(options ? { options } : {}) },
    ]),
    ...definition.actions.map(({ name, description }) => [
      name,
      { action: name, description, control: false },
    ]),
  ]);
  generatedControls[component.slug] = {
    args,
    argTypes,
    properties: definition.properties.map(({ name }) => name),
    actions: definition.actions.map(({ name }) => name),
  };
  generatedMetadata[component.slug] = {
    component: component.id,
    category: component.category,
    title: `Components/${component.category}/${component.id}`,
    properties: definition.properties.map(({ name, description, control, options }) => ({
      name,
      description,
      control,
      ...(options ? { options } : {}),
    })),
    actions: definition.actions,
    adapterProperties: adapterContracts[component.slug] ?? [],
    excludedProperties: controlExclusions[component.slug] ?? {},
  };
}

const serializedControls = serialize(generatedControls).replace(
  /\{\s*"__nativeToken": "color60"\s*\}/u,
  'storybookTokens.color60',
);
const controlsSource = await formatGenerated(
  `${generatedHeader}
import { resolveTheme } from '@tale-ui/foundations/theme';
import { harbourTheme } from '@tale-ui/foundations/theme-presets';

export type NativeStoryControlDefinition = Readonly<{
  args: Readonly<Record<string, unknown>>;
  argTypes: Readonly<Record<string, unknown>>;
  properties: readonly string[];
  actions: readonly string[];
}>;

const storybookTokens = resolveTheme(harbourTheme, 'light').tokens;

export const nativeStoryControls = ${serializedControls} as const satisfies Record<
  string,
  NativeStoryControlDefinition
>;
`,
  controlsPath,
);
const metadataSource = await formatGenerated(serialize(generatedMetadata), metadataPath);

const actualStoryFiles = [];
const collectStoryFiles = (directory, prefix = '') => {
  try {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const relative = path.join(prefix, entry.name);
      if (entry.isDirectory()) {
        collectStoryFiles(path.join(directory, entry.name), relative);
      } else if (entry.name.endsWith('.stories.tsx')) {
        actualStoryFiles.push(relative);
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
};
collectStoryFiles(outputRoot);

if (check) {
  for (const [relativePath, source] of expectedFiles) {
    assert.equal(
      readFileSync(path.join(outputRoot, relativePath), 'utf8'),
      source,
      `${relativePath} is stale; run pnpm native:storybook:generate.`,
    );
  }
  assert.deepEqual(actualStoryFiles.sort(), [...expectedFiles.keys()].sort());
  assert.equal(readFileSync(controlsPath, 'utf8'), controlsSource);
  assert.equal(readFileSync(metadataPath, 'utf8'), metadataSource);
  console.log(`OK: ${expectedFiles.size} hierarchical native stories and control contracts.`);
} else {
  for (const relativePath of actualStoryFiles) {
    if (!expectedFiles.has(relativePath)) {
      throw new Error(`Unexpected generated native story: ${relativePath}`);
    }
  }
  for (const [relativePath, source] of expectedFiles) {
    const target = path.join(outputRoot, relativePath);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, source);
  }
  writeFileSync(controlsPath, controlsSource);
  writeFileSync(metadataPath, metadataSource);
  console.log(`Generated ${expectedFiles.size} hierarchical native stories and control contracts.`);
}
