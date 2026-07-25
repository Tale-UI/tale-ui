/**
 * Tale UI A2UI Catalog
 *
 * Maps A2UI standard component types to Tale UI React components with
 * adapter functions that convert A2UI props to Tale UI props.
 */

import * as React from 'react';

/* ─── Lazy imports ────────────────────────────────────────────────────────── */
// Use dynamic imports so tree-shaking works and we don't pull every component
// into bundles that only use a subset of the catalog.

import { Text } from '@tale-ui/react/text';
import { Kbd } from '@tale-ui/react/kbd';
import { CodeBlock } from '@tale-ui/react/code-block';
import { Row } from '@tale-ui/react/row';
import { Column } from '@tale-ui/react/column';
import { Card } from '@tale-ui/react/card';
import { Image } from '@tale-ui/react/image';
import { KeyValuePairs } from '@tale-ui/react/key-value-pairs';
import { List } from '@tale-ui/react/list';
import { Button } from '@tale-ui/react/button';
import { TextField } from '@tale-ui/react/text-field';
import { Checkbox } from '@tale-ui/react/checkbox';
import { CheckboxField } from '@tale-ui/react/checkbox-field';
import { Radio } from '@tale-ui/react/radio';
import { RadioField } from '@tale-ui/react/radio-field';
import { RadioGroup } from '@tale-ui/react/radio-group';
import { Select } from '@tale-ui/react/select';
import { Switch } from '@tale-ui/react/switch';
import { SwitchField } from '@tale-ui/react/switch-field';
import { Table } from '@tale-ui/react/table';
import { Tabs } from '@tale-ui/react/tabs';
import { Badge } from '@tale-ui/react/badge';
import { ProgressBar } from '@tale-ui/react/progress-bar';
import { Spinner } from '@tale-ui/react/spinner';
import { Separator } from '@tale-ui/react/separator';
import { Link } from '@tale-ui/react/link';
import { Icon } from '@tale-ui/react/icon';
import { Form } from '@tale-ui/react/form';
import { Avatar } from '@tale-ui/react/avatar';
import { Banner } from '@tale-ui/react/banner';
import { Disclosure } from '@tale-ui/react/disclosure';
import { TextArea } from '@tale-ui/react/text-area';
import { NumberField } from '@tale-ui/react/number-field';
import { Slider } from '@tale-ui/react/slider';
import { SearchField } from '@tale-ui/react/search-field';
import { Accordion } from '@tale-ui/react/accordion';
import { Menu } from '@tale-ui/react/menu';
import { Dialog } from '@tale-ui/react/dialog';
import { AlertDialog } from '@tale-ui/react/alert-dialog';
import { Drawer } from '@tale-ui/react/drawer';
import { Tooltip } from '@tale-ui/react/tooltip';
import { Popover } from '@tale-ui/react/popover';
import { Breadcrumbs } from '@tale-ui/react/breadcrumbs';
import { Pagination } from '@tale-ui/react/pagination';
import { ToggleButton, ToggleButtonGroup } from '@tale-ui/react/toggle-button';
import { TagGroup } from '@tale-ui/react/tag-group';
import { EmptyState } from '@tale-ui/react/empty-state';
import { Meter } from '@tale-ui/react/meter';
import { ProgressCircle } from '@tale-ui/react/progress-circle';
import { Field } from '@tale-ui/react/field';
import { CheckboxGroup } from '@tale-ui/react/checkbox-group';
import { Combobox } from '@tale-ui/react/combobox';
import { PinInput } from '@tale-ui/react/pin-input';
import { SelectNative } from '@tale-ui/react/select-native';
import { Calendar } from '@tale-ui/react/calendar';
import { RangeCalendar } from '@tale-ui/react/range-calendar';
import { DateField } from '@tale-ui/react/date-field';
import { DatePicker } from '@tale-ui/react/date-picker';
import { DateRangePicker } from '@tale-ui/react/date-range-picker';
import { TimeField } from '@tale-ui/react/time-field';
import { ColorField } from '@tale-ui/react/color-field';
import { ColorArea } from '@tale-ui/react/color-area';
import { ColorSlider } from '@tale-ui/react/color-slider';
import { PreviewCard } from '@tale-ui/react/preview-card';
import { ContextMenu } from '@tale-ui/react/context-menu';
import { NavigationMenu } from '@tale-ui/react/navigation-menu';
import { Carousel } from '@tale-ui/react/carousel';
import { ScrollArea } from '@tale-ui/react/scroll-area';
import { Toolbar } from '@tale-ui/react/toolbar';
import { GridList } from '@tale-ui/react/grid-list';
import { Tree } from '@tale-ui/react/tree';
import { IconButton } from '@tale-ui/react/icon-button';
import { Fieldset } from '@tale-ui/react/fieldset';
import { DropZone } from '@tale-ui/react/drop-zone';
import { FileTrigger } from '@tale-ui/react/file-trigger';
import { RatingStars } from '@tale-ui/react/rating-stars';
import { RatingBadge } from '@tale-ui/react/rating-badge';
import { FeaturedIcon } from '@tale-ui/react/featured-icon';
import { DotIcon } from '@tale-ui/react/dot-icon';
import { AppStoreButton } from '@tale-ui/react/app-store-button';
import { SocialButton } from '@tale-ui/react/social-button';
import { BadgeGroup } from '@tale-ui/react/badge-group';
import { SectionDivider } from '@tale-ui/react/section-divider';
import { InputGroup } from '@tale-ui/react/input-group';
import { InputTags } from '@tale-ui/react/input-tags';
import { MultiSelect } from '@tale-ui/react/multi-select';
import { TagSelect } from '@tale-ui/react/tag-select';
import { PaymentInput } from '@tale-ui/react/payment-input';
import { Autocomplete } from '@tale-ui/react/autocomplete';
import { ColorWheel } from '@tale-ui/react/color-wheel';
import { ColorSwatch } from '@tale-ui/react/color-swatch';
import { ColorSwatchPicker } from '@tale-ui/react/color-swatch-picker';
import { ColorPicker } from '@tale-ui/react/color-picker';
import { FileUpload } from '@tale-ui/react/file-upload';
import { Check, X } from 'lucide-react';
import { resolveIcon } from './icon-registry.ts';
import { isDataBinding } from './types.ts';
import type { Catalog, CatalogEntry, A2UIAction, AdapterContext } from './types.ts';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

const h = React.createElement;

/** Resolve a prop value that may be a data binding. */
function resolve(value: unknown, ctx: AdapterContext): unknown {
  return isDataBinding(value) ? ctx.resolveBinding(value) : value;
}

/** Create an onPress handler if an action is defined. */
function pressHandler(action: unknown, ctx: AdapterContext): (() => void) | undefined {
  if (action && typeof action === 'object' && 'name' in action) {
    const handler = ctx.createActionHandler(action as A2UIAction);
    return () => {
      console.log('[A2UI] Action fired:', (action as A2UIAction).name);
      handler();
    };
  }
  return undefined;
}

/** Map A2UI usage hint to Tale UI Text variant + size. */
function mapTextHint(hint?: string): { variant: string; size: string; as: string } {
  switch (hint) {
    case 'display-l':
      return { variant: 'display', size: 'l', as: 'h1' };
    case 'display-m':
      return { variant: 'display', size: 'm', as: 'h1' };
    case 'display-s':
      return { variant: 'display', size: 's', as: 'h2' };
    case 'heading-l':
      return { variant: 'heading', size: 'l', as: 'h2' };
    case 'heading-m':
      return { variant: 'heading', size: 'm', as: 'h3' };
    case 'heading-s':
      return { variant: 'heading', size: 's', as: 'h4' };
    case 'heading':
      return { variant: 'heading', size: 'm', as: 'h3' };
    case 'title':
      return { variant: 'title', size: 'm', as: 'h4' };
    case 'label':
      return { variant: 'label', size: 'm', as: 'span' };
    case 'body':
      return { variant: 'text', size: 'm', as: 'p' };
    case 'body-s':
      return { variant: 'text', size: 's', as: 'p' };
    case 'caption':
      return { variant: 'text', size: 'xs', as: 'span' };
    case 'mono':
      return { variant: 'mono', size: 'm', as: 'span' };
    default:
      return { variant: 'text', size: 'm', as: 'span' };
  }
}

function normalizeKeyValuePairsColumns(value: unknown): 1 | 2 | 3 | 4 {
  const numeric = typeof value === 'number' && Number.isFinite(value) ? Math.trunc(value) : 1;
  if (numeric <= 1) {return 1;}
  if (numeric === 2) {return 2;}
  if (numeric === 3) {return 3;}
  return 4;
}

function normalizeKeyValuePairsMinColumnWidth(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 150;
}

/* ─── Standard Catalog ────────────────────────────────────────────────────── */

/**
 * The Tale UI A2UI catalog. Maps A2UI component types to their Tale UI equivalents.
 */
export const taleUICatalog: Catalog = {
  /* ── Typography ──────────────────────────────────────────────────────── */

  Text: {
    component: Text,
    adapter: (props, ctx) => {
      const { variant, size, as: asTag } = mapTextHint(props.usageHint as string | undefined);
      return {
        variant,
        size,
        as: asTag,
        color: props.color as string | undefined,
        children: props.content ?? ctx.children,
      };
    },
  } as CatalogEntry,

  Kbd: {
    component: Kbd,
    adapter: (props, ctx) => ({
      size: props.size as string | undefined,
      children: props.content ?? ctx.children,
    }),
  } as CatalogEntry,

  CodeBlock: {
    component: CodeBlock,
    adapter: (props) => ({
      language: props.language as string | undefined,
      wrap: props.wrap === true,
      children: String(props.content ?? ''),
    }),
  } as CatalogEntry,

  /* ── Layout ──────────────────────────────────────────────────────────── */

  Row: {
    component: Row,
    adapter: (props, ctx) => ({
      gap: props.spacing as string | undefined,
      align: props.alignment as string | undefined,
      justify: props.justify as string | undefined,
      wrap: props.wrap as boolean | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  Column: {
    component: Column,
    adapter: (props, ctx) => ({
      gap: props.spacing as string | undefined,
      align: props.alignment as string | undefined,
      justify: props.justify as string | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  Card: {
    component: Card.Root,
    adapter: (props, ctx) => ({
      variant: props.variant as string | undefined,
      padding: props.padding as string | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  /* ── Display ─────────────────────────────────────────────────────────── */

  Image: {
    component: Image,
    adapter: (props, ctx) => ({
      src: resolve(props.src, ctx) as string,
      alt: (props.alt as string) ?? '',
      radius: props.radius as string | undefined,
      fit: props.fit as string | undefined,
      width: props.width as number | string | undefined,
      height: props.height as number | string | undefined,
    }),
  } as CatalogEntry,

  List: {
    component: List.Root,
    adapter: (props, ctx) => ({
      variant: props.variant as string | undefined,
      density: props.density as string | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  ListItem: {
    component: List.Item,
    adapter: (props, ctx) => ({
      children: props.content ?? ctx.children,
    }),
  } as CatalogEntry,

  KeyValuePairs: {
    component: KeyValuePairs.Root,
    adapter: (props, ctx) => ({
      'aria-label': (props.label as string) ?? 'Key-value pairs',
      columns: normalizeKeyValuePairsColumns(props.columns),
      minColumnWidth: normalizeKeyValuePairsMinColumnWidth(props.minColumnWidth),
      variant: props.variant as string | undefined,
      density: props.density as string | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  KeyValuePair: {
    component: KeyValuePairs.Item,
    adapter: (props, ctx) => ({
      children: [
        h(KeyValuePairs.Term, { key: 'term' }, props.label != null ? String(props.label) : ''),
        h(KeyValuePairs.Details, { key: 'details' }, props.value != null ? String(props.value) : ctx.children),
      ],
    }),
  } as CatalogEntry,

  KeyValuePairGroup: {
    component: KeyValuePairs.Group,
    adapter: (props, ctx) => ({
      children: [
        h(KeyValuePairs.GroupTitle, { key: 'title' }, props.title != null ? String(props.title) : ''),
        h(KeyValuePairs.GroupList, { key: 'list' }, ctx.children),
      ],
    }),
  } as CatalogEntry,

  Badge: {
    component: Badge,
    adapter: (props, ctx) => ({
      variant: props.tone as string | undefined,
      size: props.size as string | undefined,
      type: props.type as string | undefined,
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  Icon: {
    component: Icon,
    adapter: (props) => {
      const iconComponent = resolveIcon(props.name as string);
      return {
        icon: iconComponent,
        size: props.size as string | undefined,
        'aria-label': props.label as string | undefined,
      };
    },
  } as CatalogEntry,

  Separator: {
    component: Separator,
    adapter: (props) => ({
      orientation: props.orientation as string | undefined,
    }),
  } as CatalogEntry,

  Link: {
    component: Link,
    adapter: (props, ctx) => ({
      href: props.href as string,
      target: props.target as string | undefined,
      rel: props.rel as string | undefined,
      download: props.download as string | boolean | undefined,
      iconLeading: props.iconLeading
        ? h(Icon, { icon: resolveIcon(props.iconLeading as string), size: 'sm' })
        : undefined,
      iconTrailing: props.iconTrailing
        ? h(Icon, { icon: resolveIcon(props.iconTrailing as string), size: 'sm' })
        : undefined,
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  /* ── Interactive ─────────────────────────────────────────────────────── */

  Button: {
    component: Button,
    adapter: (props, ctx) => ({
      variant: props.variant as string | undefined,
      size: props.size as string | undefined,
      isDisabled: props.disabled as boolean | undefined,
      isPending: props.isPending as boolean | undefined,
      showTextWhileLoading: props.showTextWhileLoading as boolean | undefined,
      onPress: pressHandler(props.action, ctx),
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  /* ── Form Controls ───────────────────────────────────────────────────── */

  TextInput: {
    component: TextField.Root,
    adapter: (props, ctx) => {
      const boundValue = props.binding ? resolve(props.binding, ctx) : undefined;
      return {
        'aria-label': !props.label ? 'Text input' : undefined,
        defaultValue:
          (props.defaultValue as string | undefined) ?? (boundValue as string | undefined),
        isDisabled: props.disabled as boolean | undefined,
        isReadOnly: props.readOnly as boolean | undefined,
        isRequired: props.required as boolean | undefined,
        isInvalid: props.isInvalid as boolean | undefined,
        name: props.name as string | undefined,
        onChange: props.binding
          ? (_v: string) => {
              const handler = pressHandler(props.action, ctx);
              if (handler) {
                handler();
              }
            }
          : undefined,
        children: h(
          React.Fragment,
          null,
          props.label ? h(TextField.Label, null, String(props.label)) : null,
          h(TextField.Input, {
            type: props.type as string | undefined,
            placeholder: props.placeholder as string | undefined,
          }),
          props.description ? h(TextField.Description, null, String(props.description)) : null,
          props.errorMessage ? h(TextField.ErrorMessage, null, String(props.errorMessage)) : null,
        ),
      };
    },
  } as CatalogEntry,

  Checkbox: {
    component: Checkbox.Root,
    adapter: (props, ctx) => {
      const boundValue = props.binding ? resolve(props.binding, ctx) : undefined;
      return {
        'aria-label': (props.label as string) ?? 'Checkbox',
        defaultSelected: (props.defaultSelected as boolean) ?? (boundValue as boolean | undefined),
        isDisabled: props.disabled as boolean | undefined,
        isReadOnly: props.readOnly as boolean | undefined,
        isIndeterminate: props.isIndeterminate as boolean | undefined,
        isRequired: props.isRequired as boolean | undefined,
        size: props.size as string | undefined,
        value: props.value as string | undefined,
        name: props.name as string | undefined,
        onChange: props.action
          ? (_isSelected: boolean) => pressHandler(props.action, ctx)?.()
          : undefined,
        children: h(
          React.Fragment,
          null,
          h(Checkbox.Indicator, null, h(Icon, { icon: Check, size: 'sm' })),
          (props.label as string) ?? ctx.children,
        ),
      };
    },
  } as CatalogEntry,

  CheckboxField: {
    component: CheckboxField.Root,
    adapter: (props, ctx) => {
      const boundValue = props.binding ? resolve(props.binding, ctx) : undefined;
      return {
        'aria-label': !props.label ? 'Checkbox' : undefined,
        defaultSelected: (props.defaultSelected as boolean) ?? (boundValue as boolean | undefined),
        isDisabled: props.disabled as boolean | undefined,
        isReadOnly: props.readOnly as boolean | undefined,
        isIndeterminate: props.isIndeterminate as boolean | undefined,
        isRequired: props.isRequired as boolean | undefined,
        isInvalid: props.isInvalid as boolean | undefined,
        size: props.size as string | undefined,
        value: props.value as string | undefined,
        name: props.name as string | undefined,
        onChange: props.action
          ? (_isSelected: boolean) => pressHandler(props.action, ctx)?.()
          : undefined,
        children: h(
          React.Fragment,
          null,
          h(
            CheckboxField.Button,
            null,
            h(CheckboxField.Indicator, null, h(Icon, { icon: Check, size: 'sm' })),
            (props.label as string) ?? ctx.children,
          ),
          props.description ? h(CheckboxField.Description, null, String(props.description)) : null,
          props.errorMessage ? h(CheckboxField.Error, null, String(props.errorMessage)) : null,
        ),
      };
    },
  } as CatalogEntry,

  Radio: {
    component: RadioGroup,
    adapter: (props, ctx) => {
      const boundValue = props.binding ? resolve(props.binding, ctx) : undefined;
      return {
        'aria-label': !props.label ? 'Radio group' : undefined,
        defaultValue:
          (props.defaultValue as string | undefined) ?? (boundValue as string | undefined),
        isDisabled: props.disabled as boolean | undefined,
        isReadOnly: props.readOnly as boolean | undefined,
        isRequired: props.isRequired as boolean | undefined,
        isInvalid: props.isInvalid as boolean | undefined,
        size: props.size as string | undefined,
        name: props.name as string | undefined,
        label: props.label as string | undefined,
        description: props.description as string | undefined,
        onChange: props.binding
          ? () => {
              const handler = pressHandler(props.action, ctx);
              if (handler) {
                handler();
              }
            }
          : undefined,
        children: ctx.children,
      };
    },
  } as CatalogEntry,

  RadioField: {
    component: RadioGroup,
    adapter: (props, ctx) => {
      const boundValue = props.binding ? resolve(props.binding, ctx) : undefined;
      return {
        'aria-label': !props.label ? 'Radio group' : undefined,
        defaultValue:
          (props.defaultValue as string | undefined) ?? (boundValue as string | undefined),
        isDisabled: props.disabled as boolean | undefined,
        isReadOnly: props.readOnly as boolean | undefined,
        isRequired: props.isRequired as boolean | undefined,
        isInvalid: props.isInvalid as boolean | undefined,
        size: props.size as string | undefined,
        name: props.name as string | undefined,
        label: props.label as string | undefined,
        description: props.description as string | undefined,
        onChange: props.binding
          ? () => {
              const handler = pressHandler(props.action, ctx);
              if (handler) {
                handler();
              }
            }
          : undefined,
        children: ctx.children,
      };
    },
  } as CatalogEntry,

  Select: {
    component: Select.Root,
    adapter: (props, ctx) => {
      const boundValue = props.binding ? resolve(props.binding, ctx) : undefined;
      return {
        'aria-label': !props.label ? 'Select' : undefined,
        defaultSelectedKey:
          (props.defaultValue as string | undefined) ?? (boundValue as string | undefined),
        isDisabled: props.disabled as boolean | undefined,
        isReadOnly: props.readOnly as boolean | undefined,
        isRequired: props.isRequired as boolean | undefined,
        isInvalid: props.isInvalid as boolean | undefined,
        size: props.size as string | undefined,
        name: props.name as string | undefined,
        placeholder: props.placeholder as string | undefined,
        onSelectionChange: props.binding
          ? () => {
              const handler = pressHandler(props.action, ctx);
              if (handler) {
                handler();
              }
            }
          : undefined,
        children: h(
          React.Fragment,
          null,
          props.label ? h(Select.Label, null, String(props.label)) : null,
          h(Select.Trigger, null, h(Select.Value), h(Select.Icon)),
          h(Select.Popover, null, h(Select.ListBox as React.ComponentType, null, ctx.children)),
        ),
      };
    },
  } as CatalogEntry,

  Switch: {
    component: Switch.Root,
    adapter: (props, ctx) => {
      const boundValue = props.binding ? resolve(props.binding, ctx) : undefined;
      return {
        'aria-label': (props.label as string) ?? 'Switch',
        defaultSelected: (props.defaultSelected as boolean) ?? (boundValue as boolean | undefined),
        isDisabled: props.disabled as boolean | undefined,
        isReadOnly: props.readOnly as boolean | undefined,
        isRequired: props.isRequired as boolean | undefined,
        size: props.size as string | undefined,
        value: props.value as string | undefined,
        name: props.name as string | undefined,
        onChange: props.action
          ? (_isSelected: boolean) => pressHandler(props.action, ctx)?.()
          : undefined,
        children: h(React.Fragment, null, h(Switch.Thumb), (props.label as string) ?? ctx.children),
      };
    },
  } as CatalogEntry,

  SwitchField: {
    component: SwitchField.Root,
    adapter: (props, ctx) => {
      const boundValue = props.binding ? resolve(props.binding, ctx) : undefined;
      return {
        'aria-label': !props.label ? 'Switch' : undefined,
        defaultSelected: (props.defaultSelected as boolean) ?? (boundValue as boolean | undefined),
        isDisabled: props.disabled as boolean | undefined,
        isReadOnly: props.readOnly as boolean | undefined,
        isRequired: props.isRequired as boolean | undefined,
        isInvalid: props.isInvalid as boolean | undefined,
        value: props.value as string | undefined,
        name: props.name as string | undefined,
        onChange: props.action
          ? (_isSelected: boolean) => pressHandler(props.action, ctx)?.()
          : undefined,
        children: h(
          React.Fragment,
          null,
          h(
            SwitchField.Button,
            null,
            h(SwitchField.Thumb),
            (props.label as string) ?? ctx.children,
          ),
          props.description ? h(SwitchField.Description, null, String(props.description)) : null,
          props.errorMessage ? h(SwitchField.Error, null, String(props.errorMessage)) : null,
        ),
      };
    },
  } as CatalogEntry,

  RadioOption: {
    component: Radio.Root,
    adapter: (props, ctx) => ({
      value: props.value as string,
      isDisabled: props.disabled as boolean | undefined,
      size: props.size as string | undefined,
      children: h(
        React.Fragment,
        null,
        h(Radio.Indicator),
        (props.label as string) ?? ctx.children,
      ),
    }),
  } as CatalogEntry,

  RadioFieldOption: {
    component: RadioField.Root,
    adapter: (props, ctx) => ({
      value: props.value as string,
      isDisabled: props.disabled as boolean | undefined,
      size: props.size as string | undefined,
      children: h(
        React.Fragment,
        null,
        h(
          RadioField.Button,
          null,
          h(RadioField.Indicator, null, h(RadioField.Dot)),
          (props.label as string) ?? ctx.children,
        ),
        props.description ? h(RadioField.Description, null, String(props.description)) : null,
        props.errorMessage ? h(RadioField.Error, null, String(props.errorMessage)) : null,
      ),
    }),
  } as CatalogEntry,

  SelectItem: {
    component: Select.Item,
    adapter: (props, ctx) => ({
      id: props.value as string,
      textValue: props.label as string | undefined,
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  /* ── Data Display ────────────────────────────────────────────────────── */

  Table: {
    component: Table.Root,
    adapter: (props, ctx) => ({
      'aria-label': (props.label as string) ?? 'Table',
      selectionMode: props.selectionMode as string | undefined,
      selectionBehavior: props.selectionBehavior as string | undefined,
      disabledKeys: props.disabledKeys as string[] | undefined,
      onSelectionChange: props.onSelectionChange
        ? (_keys: unknown) => pressHandler(props.onSelectionChange, ctx)?.()
        : undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  TableHeader: {
    component: Table.Header,
    adapter: (_props, ctx) => ({
      children: ctx.children,
    }),
  } as CatalogEntry,

  TableColumn: {
    component: Table.Column,
    adapter: (props, ctx) => ({
      isRowHeader: props.isRowHeader as boolean | undefined,
      allowsSorting: props.allowsSorting as boolean | undefined,
      width: props.width as number | string | undefined,
      minWidth: props.minWidth as number | undefined,
      maxWidth: props.maxWidth as number | undefined,
      children: props.label ? String(props.label) : ctx.children,
    }),
  } as CatalogEntry,

  TableBody: {
    component: Table.Body,
    adapter: (_props, ctx) => ({
      children: ctx.children,
    }),
  } as CatalogEntry,

  TableRow: {
    component: Table.Row,
    adapter: (props, ctx) => ({
      id: props.id as string | undefined,
      onAction: props.action ? pressHandler(props.action, ctx) : undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  TableCell: {
    component: Table.Cell,
    adapter: (props, ctx) => ({
      children: props.content ? String(props.content) : ctx.children,
    }),
  } as CatalogEntry,

  Tabs: {
    component: Tabs.Root,
    adapter: (props, ctx) => ({
      'aria-label': (props.label as string) ?? 'Tabs',
      defaultSelectedKey: props.defaultTab as string | undefined,
      orientation: props.orientation as string | undefined,
      isDisabled: props.isDisabled as boolean | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  TabList: {
    component: Tabs.List,
    adapter: (props, ctx) => ({
      size: props.size as string | undefined,
      variant: props.variant as string | undefined,
      children: [ctx.children, h(Tabs.Indicator, { key: '__indicator' })],
    }),
  } as CatalogEntry,

  TabItem: {
    component: Tabs.Tab,
    adapter: (props, ctx) => ({
      id: props.id as string,
      isDisabled: props.isDisabled as boolean | undefined,
      icon: props.icon
        ? h(Icon, { icon: resolveIcon(props.icon as string), size: 'sm' })
        : undefined,
      children: props.label ? String(props.label) : ctx.children,
    }),
  } as CatalogEntry,

  TabPanel: {
    component: Tabs.Panel,
    adapter: (props, ctx) => ({
      id: props.id as string,
      children: ctx.children,
    }),
  } as CatalogEntry,

  Progress: {
    component: ProgressBar.Root,
    adapter: (props, ctx) => {
      const val = resolve(props.value, ctx) as number | undefined;
      const min = (props.minValue as number) ?? 0;
      const max = (props.maxValue as number) ?? 100;
      const pct = val != null ? Math.round(((val - min) / (max - min)) * 100) : undefined;
      return {
        value: val,
        minValue: min !== 0 ? min : undefined,
        maxValue: max !== 100 ? max : undefined,
        isIndeterminate: props.indeterminate as boolean | undefined,
        labelPosition: props.labelPosition as string | undefined,
        'aria-label': (props.label as string) ?? 'Progress',
        children:
          ctx.children ??
          h(
            React.Fragment,
            null,
            h(
              ProgressBar.Header,
              null,
              props.label ? h(ProgressBar.Label, null, String(props.label)) : null,
              !props.indeterminate && pct != null ? h(ProgressBar.Value, null, `${pct}%`) : null,
            ),
            h(ProgressBar.Track, null, h(ProgressBar.Indicator, { value: val ?? 0, min, max })),
          ),
      };
    },
  } as CatalogEntry,

  Spinner: {
    component: Spinner,
    adapter: (props) => ({
      variant: props.variant as string | undefined,
      size: props.size as string | undefined,
      label: props.label as string | undefined,
    }),
  } as CatalogEntry,

  /* ── Form Structure ──────────────────────────────────────────────────── */

  Form: {
    component: Form,
    adapter: (props, ctx) => ({
      validationBehavior: props.validationBehavior as string | undefined,
      onSubmit: props.action
        ? (event: React.FormEvent) => {
            event.preventDefault();
            const handler = pressHandler(props.action, ctx);
            if (handler) {
              handler();
            }
          }
        : undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  /* ── Card Sub-Parts ──────────────────────────────────────────────────── */

  CardHeader: {
    component: Card.Header,
    adapter: (_props, ctx) => ({
      children: ctx.children,
    }),
  } as CatalogEntry,

  CardBody: {
    component: Card.Body,
    adapter: (_props, ctx) => ({
      children: ctx.children,
    }),
  } as CatalogEntry,

  CardFooter: {
    component: Card.Footer,
    adapter: (_props, ctx) => ({
      children: ctx.children,
    }),
  } as CatalogEntry,

  /* ── Extended Catalog (Tale UI extras) ───────────────────────────────── */

  Avatar: {
    component: Avatar.Root,
    adapter: (props, ctx) => ({
      size: props.size as string | undefined,
      children: ctx.children ?? h(Avatar.Fallback, null, props.initials as string | undefined),
    }),
  } as CatalogEntry,

  AvatarImage: {
    component: Avatar.Image,
    adapter: (props) => ({
      src: props.src as string,
      alt: (props.alt as string) ?? '',
    }),
  } as CatalogEntry,

  AvatarFallback: {
    component: Avatar.Fallback,
    adapter: (props, ctx) => ({
      children: props.initials ?? ctx.children,
    }),
  } as CatalogEntry,

  Banner: {
    component: Banner.Root,
    adapter: (props, ctx) => ({
      variant: props.variant as string | undefined,
      size: props.size as string | undefined,
      children: h(
        React.Fragment,
        null,
        props.icon !== false ? h(Banner.Icon) : null,
        props.title ? h(Banner.Title, null, String(props.title)) : null,
        props.description ? h(Banner.Description, null, String(props.description)) : null,
        ctx.children,
      ),
    }),
  } as CatalogEntry,

  Disclosure: {
    component: Disclosure.Root,
    adapter: (props, ctx) => ({
      defaultExpanded: props.defaultExpanded as boolean | undefined,
      isExpanded: props.isExpanded as boolean | undefined,
      onExpandedChange: props.onExpandedChange
        ? (isExp: boolean) => {
            void isExp;
            pressHandler(props.onExpandedChange, ctx)?.();
          }
        : undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  DisclosureTrigger: {
    component: Disclosure.Trigger,
    adapter: (props, ctx) => ({
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  DisclosurePanel: {
    component: Disclosure.Panel,
    adapter: (_props, ctx) => ({
      children: ctx.children,
    }),
  } as CatalogEntry,

  TextAreaInput: {
    component: TextArea.Root,
    adapter: (props, ctx) => {
      const boundValue = props.binding ? resolve(props.binding, ctx) : undefined;
      return {
        'aria-label': !props.label ? 'Text area' : undefined,
        defaultValue:
          (props.defaultValue as string | undefined) ?? (boundValue as string | undefined),
        isDisabled: props.disabled as boolean | undefined,
        isReadOnly: props.readOnly as boolean | undefined,
        isRequired: props.required as boolean | undefined,
        isInvalid: props.isInvalid as boolean | undefined,
        name: props.name as string | undefined,
        children: h(
          React.Fragment,
          null,
          props.label ? h(TextArea.Label, null, String(props.label)) : null,
          h(TextArea.TextArea, { placeholder: props.placeholder as string | undefined }),
          props.description ? h(TextArea.Description, null, String(props.description)) : null,
        ),
      };
    },
  } as CatalogEntry,

  NumberInput: {
    component: NumberField.Root,
    adapter: (props, ctx) => {
      const boundValue = props.binding ? resolve(props.binding, ctx) : undefined;
      return {
        'aria-label': !props.label ? 'Number input' : undefined,
        defaultValue:
          (props.defaultValue as number | undefined) ?? (boundValue as number | undefined),
        minValue: props.minValue as number | undefined,
        maxValue: props.maxValue as number | undefined,
        step: props.step as number | undefined,
        isDisabled: props.disabled as boolean | undefined,
        isReadOnly: props.readOnly as boolean | undefined,
        isRequired: props.required as boolean | undefined,
        isInvalid: props.isInvalid as boolean | undefined,
        formatOptions: props.formatOptions as Intl.NumberFormatOptions | undefined,
        name: props.name as string | undefined,
        children: h(
          React.Fragment,
          null,
          props.label ? h(NumberField.Label, null, String(props.label)) : null,
          h(
            NumberField.Group,
            null,
            h(NumberField.Decrement),
            h(NumberField.Input),
            h(NumberField.Increment),
          ),
          props.description ? h(NumberField.Description, null, String(props.description)) : null,
        ),
      };
    },
  } as CatalogEntry,

  SliderInput: {
    component: Slider.Root,
    adapter: (props, ctx) => {
      const boundValue = props.binding ? resolve(props.binding, ctx) : undefined;
      return {
        'aria-label': !props.label ? 'Slider' : undefined,
        defaultValue:
          props.defaultValue != null
            ? [props.defaultValue as number]
            : boundValue != null
              ? [boundValue as number]
              : undefined,
        minValue: props.minValue as number | undefined,
        maxValue: props.maxValue as number | undefined,
        step: props.step as number | undefined,
        isDisabled: props.disabled as boolean | undefined,
        isReadOnly: props.readOnly as boolean | undefined,
        isRequired: props.isRequired as boolean | undefined,
        orientation: props.orientation as string | undefined,
        name: props.name as string | undefined,
        children: h(
          React.Fragment,
          null,
          h(
            Slider.Header,
            null,
            props.label ? h(Slider.Label, null, String(props.label)) : null,
            h(Slider.Output),
          ),
          h(Slider.Control, null, h(Slider.Track, null, h(Slider.Indicator), h(Slider.Thumb))),
        ),
      };
    },
  } as CatalogEntry,

  SearchInput: {
    component: SearchField.Root,
    adapter: (props, ctx) => {
      const boundValue = props.binding ? resolve(props.binding, ctx) : undefined;
      return {
        'aria-label': !props.label ? 'Search' : undefined,
        defaultValue:
          (props.defaultValue as string | undefined) ?? (boundValue as string | undefined),
        isDisabled: props.disabled as boolean | undefined,
        isReadOnly: props.readOnly as boolean | undefined,
        isRequired: props.isRequired as boolean | undefined,
        isInvalid: props.isInvalid as boolean | undefined,
        variant: props.variant as 'default' | 'inline' | undefined,
        name: props.name as string | undefined,
        onSubmit: props.action
          ? () => {
              const handler = pressHandler(props.action, ctx);
              if (handler) {
                handler();
              }
            }
          : undefined,
        children: h(
          React.Fragment,
          null,
          props.label ? h(SearchField.Label, null, String(props.label)) : null,
          h(SearchField.Input, { placeholder: props.placeholder as string | undefined }),
          h(SearchField.ClearButton, null, h(Icon, { icon: X, size: 'sm' })),
        ),
      };
    },
  } as CatalogEntry,

  Accordion: {
    component: Accordion.Root,
    adapter: (props, ctx) => ({
      allowsMultipleExpanded: props.allowsMultipleExpanded as boolean | undefined,
      defaultExpandedKeys: props.defaultExpandedKeys as string[] | undefined,
      expandedKeys: props.expandedKeys as string[] | undefined,
      isDisabled: props.isDisabled as boolean | undefined,
      onExpandedChange: props.onExpandedChange
        ? (_keys: unknown) => pressHandler(props.onExpandedChange, ctx)?.()
        : undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  AccordionItem: {
    component: Accordion.Item,
    adapter: (props, ctx) => ({
      id: props.id as string,
      isDisabled: props.isDisabled as boolean | undefined,
      defaultExpanded: props.defaultExpanded as boolean | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  AccordionHeader: {
    component: Accordion.Header,
    adapter: (_props, ctx) => ({
      children: ctx.children,
    }),
  } as CatalogEntry,

  AccordionTrigger: {
    component: Accordion.Trigger,
    adapter: (props, ctx) => ({
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  AccordionPanel: {
    component: Accordion.Panel,
    adapter: (_props, ctx) => ({
      children: ctx.children,
    }),
  } as CatalogEntry,

  Menu: {
    component: Menu.Root,
    adapter: (_props, ctx) => ({
      children: ctx.children,
    }),
  } as CatalogEntry,

  MenuTrigger: {
    component: Menu.Trigger,
    adapter: (props, ctx) => ({
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  MenuPopover: {
    component: Menu.Popover,
    adapter: (props, ctx) => ({
      placement: props.placement as string | undefined,
      offset: props.offset as number | undefined,
      crossOffset: props.crossOffset as number | undefined,
      shouldFlip: props.shouldFlip as boolean | undefined,
      maxHeight: props.maxHeight as number | undefined,
      children: h(Menu.MenuList as React.ComponentType, null, ctx.children),
    }),
  } as CatalogEntry,

  MenuItem: {
    component: Menu.Item,
    adapter: (props, ctx) => ({
      id: props.id as string | undefined,
      textValue: props.textValue as string | undefined,
      href: props.href as string | undefined,
      target: props.target as string | undefined,
      isDisabled: props.disabled as boolean | undefined,
      onAction: props.action ? pressHandler(props.action, ctx) : undefined,
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  MenuSeparator: {
    component: Menu.Separator,
    adapter: () => ({}),
  } as CatalogEntry,

  /* ── Overlays ───────────────────────────────────────────────────────── */

  Dialog: {
    component: Dialog.Root,
    adapter: (props, ctx) => ({
      children: h(
        React.Fragment,
        null,
        h(
          Dialog.Trigger,
          { className: 'tale-button tale-button--neutral' },
          String(props.triggerLabel ?? props.title ?? 'Open'),
        ),
        h(
          Dialog.Backdrop,
          null,
          h(
            Dialog.Popup,
            {
              modalProps:
                props.isKeyboardDismissDisabled || props.isDismissable === false
                  ? {
                      isKeyboardDismissDisabled: props.isKeyboardDismissDisabled as
                        | boolean
                        | undefined,
                      isDismissable: props.isDismissable as boolean | undefined,
                    }
                  : undefined,
            },
            props.title ? h(Dialog.Title, null, String(props.title)) : null,
            props.description ? h(Dialog.Description, null, String(props.description)) : null,
            ctx.children,
            h(Dialog.Close),
          ),
        ),
      ),
    }),
  } as CatalogEntry,

  AlertDialog: {
    component: AlertDialog.Root,
    adapter: (props, ctx) => ({
      children: h(
        React.Fragment,
        null,
        h(
          AlertDialog.Trigger,
          { className: 'tale-button tale-button--danger' },
          String(props.triggerLabel ?? props.title ?? 'Open'),
        ),
        h(
          AlertDialog.Backdrop,
          null,
          h(
            AlertDialog.Popup,
            {
              isKeyboardDismissDisabled: props.isKeyboardDismissDisabled as boolean | undefined,
            },
            h(
              AlertDialog.Content,
              null,
              props.title ? h(AlertDialog.Title, null, String(props.title)) : null,
              props.description
                ? h(AlertDialog.Description, null, String(props.description))
                : null,
              ctx.children,
            ),
          ),
        ),
      ),
    }),
  } as CatalogEntry,

  Drawer: {
    component: Drawer.Root,
    adapter: (props, ctx) => ({
      placement: props.placement as string | undefined,
      children: h(
        React.Fragment,
        null,
        h(
          Drawer.Trigger,
          { className: 'tale-button tale-button--neutral' },
          String(props.triggerLabel ?? props.title ?? 'Open'),
        ),
        h(Drawer.Backdrop),
        h(
          Drawer.Popup,
          null,
          props.title ? h(Drawer.Title, null, String(props.title)) : null,
          props.description ? h(Drawer.Description, null, String(props.description)) : null,
          ctx.children,
          h(Drawer.Close),
        ),
      ),
    }),
  } as CatalogEntry,

  Tooltip: {
    component: Tooltip.Root,
    adapter: (props, ctx) => ({
      delay: props.delay as number | undefined,
      closeDelay: props.closeDelay as number | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  TooltipTrigger: {
    component: Tooltip.Trigger,
    adapter: (props, ctx) => ({
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  TooltipPopup: {
    component: Tooltip.Popup,
    adapter: (props, ctx) => ({
      placement: props.placement as string | undefined,
      offset: props.offset as number | undefined,
      crossOffset: props.crossOffset as number | undefined,
      shouldFlip: props.shouldFlip as boolean | undefined,
      children: h(
        React.Fragment,
        null,
        h(Tooltip.Arrow),
        ctx.children ?? String(props.content ?? ''),
      ),
    }),
  } as CatalogEntry,

  Popover: {
    component: Popover.Root,
    adapter: (props, ctx) => ({
      isDismissable: props.isDismissable as boolean | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  PopoverTrigger: {
    component: Popover.Trigger,
    adapter: (props, ctx) => ({
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  PopoverPopup: {
    component: Popover.Popup,
    adapter: (props, ctx) => ({
      placement: props.placement as string | undefined,
      offset: props.offset as number | undefined,
      crossOffset: props.crossOffset as number | undefined,
      shouldFlip: props.shouldFlip as boolean | undefined,
      isKeyboardDismissDisabled: props.isKeyboardDismissDisabled as boolean | undefined,
      children: h(
        React.Fragment,
        null,
        h(Popover.Arrow),
        props.title ? h(Popover.Title, null, String(props.title)) : null,
        props.description ? h(Popover.Description, null, String(props.description)) : null,
        ctx.children,
      ),
    }),
  } as CatalogEntry,

  /* ── Navigation ─────────────────────────────────────────────────────── */

  Breadcrumbs: {
    component: Breadcrumbs.Root,
    adapter: (_props, ctx) => ({
      children: ctx.children,
    }),
  } as CatalogEntry,

  BreadcrumbItem: {
    component: Breadcrumbs.Item,
    adapter: (props, ctx) => ({
      children: props.label ? String(props.label) : ctx.children,
    }),
  } as CatalogEntry,

  BreadcrumbLink: {
    component: Breadcrumbs.Link,
    adapter: (props, ctx) => ({
      href: props.href as string,
      rel: props.rel as string | undefined,
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  Pagination: {
    component: Pagination.Root,
    adapter: (props, ctx) => ({
      'aria-label': (props.label as string) ?? 'Pagination',
      children: ctx.children,
    }),
  } as CatalogEntry,

  PaginationItem: {
    component: Pagination.Item,
    adapter: (props, ctx) => ({
      page: props.page as number,
      current: props.current as boolean | undefined,
      isDisabled: props.isDisabled as boolean | undefined,
      onClick: pressHandler(props.action, ctx),
      children: ctx.children,
    }),
  } as CatalogEntry,

  PaginationPrevious: {
    component: Pagination.PreviousTrigger,
    adapter: (props, ctx) => ({
      disabled: props.disabled as boolean | undefined,
      onClick: pressHandler(props.action, ctx),
    }),
  } as CatalogEntry,

  PaginationNext: {
    component: Pagination.NextTrigger,
    adapter: (props, ctx) => ({
      disabled: props.disabled as boolean | undefined,
      onClick: pressHandler(props.action, ctx),
    }),
  } as CatalogEntry,

  PaginationEllipsis: {
    component: Pagination.Ellipsis,
    adapter: () => ({}),
  } as CatalogEntry,

  /* ── Display ────────────────────────────────────────────────────────── */

  TagGroup: {
    component: TagGroup.Root,
    adapter: (props, ctx) => ({
      'aria-label': (props.label as string) ?? 'Tags',
      selectionMode: props.selectionMode as string | undefined,
      defaultSelectedKeys: props.defaultSelectedKeys as string[] | undefined,
      isDisabled: props.isDisabled as boolean | undefined,
      onSelectionChange: props.onSelectionChange
        ? (_keys: unknown) => pressHandler(props.onSelectionChange, ctx)?.()
        : undefined,
      onRemove: props.onRemove
        ? (_keys: unknown) => pressHandler(props.onRemove, ctx)?.()
        : undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  TagList: {
    component: TagGroup.List,
    adapter: (_props, ctx) => ({
      children: ctx.children,
    }),
  } as CatalogEntry,

  Tag: {
    component: TagGroup.Tag,
    adapter: (props, ctx) => ({
      id: String(props.id ?? ''),
      textValue: props.textValue as string | undefined,
      href: props.href as string | undefined,
      isDisabled: props.disabled as boolean | undefined,
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  EmptyState: {
    component: EmptyState.Root,
    adapter: (props, ctx) => ({
      size: props.size as string | undefined,
      children: h(
        React.Fragment,
        null,
        props.icon
          ? h(
              EmptyState.Icon,
              null,
              h(Icon, { icon: resolveIcon(props.icon as string), size: 'lg' }),
            )
          : null,
        props.title ? h(EmptyState.Title, null, String(props.title)) : null,
        props.description ? h(EmptyState.Description, null, String(props.description)) : null,
        ctx.children ? h(EmptyState.Actions, null, ctx.children) : null,
      ),
    }),
  } as CatalogEntry,

  /* ── Feedback ───────────────────────────────────────────────────────── */

  Meter: {
    component: Meter.Root,
    adapter: (props, ctx) => ({
      value: resolve(props.value, ctx) as number | undefined,
      minValue: props.minValue as number | undefined,
      maxValue: props.maxValue as number | undefined,
      'aria-label': (props.label as string) ?? 'Meter',
      children: h(
        React.Fragment,
        null,
        h(
          Meter.Header,
          null,
          props.label ? h(Meter.Label, null, String(props.label)) : null,
          h(Meter.Value),
        ),
        h(
          Meter.Track,
          null,
          h(Meter.Indicator, {
            value: (resolve(props.value, ctx) as number) ?? 0,
            min: (props.minValue as number) ?? 0,
            max: (props.maxValue as number) ?? 100,
          }),
        ),
      ),
    }),
  } as CatalogEntry,

  ProgressCircle: {
    component: ProgressCircle.Root,
    adapter: (props, ctx) => ({
      value: resolve(props.value, ctx) as number | undefined,
      minValue: props.minValue as number | undefined,
      maxValue: props.maxValue as number | undefined,
      isIndeterminate: props.isIndeterminate as boolean | undefined,
      'aria-label': (props.label as string) ?? 'Progress',
      size: props.size as string | undefined,
      children: h(React.Fragment, null, h(ProgressCircle.Track), h(ProgressCircle.Value)),
    }),
  } as CatalogEntry,

  ToggleButton: {
    component: ToggleButton,
    adapter: (props, ctx) => {
      const boundValue = props.binding ? resolve(props.binding, ctx) : undefined;
      return {
        defaultSelected: boundValue as boolean | undefined,
        size: props.size as string | undefined,
        isDisabled: props.disabled as boolean | undefined,
        isReadOnly: props.readOnly as boolean | undefined,
        isRequired: props.isRequired as boolean | undefined,
        value: props.value as string | undefined,
        name: props.name as string | undefined,
        children: props.label ?? ctx.children,
      };
    },
  } as CatalogEntry,

  ToggleButtonGroup: {
    component: ToggleButtonGroup,
    adapter: (props, ctx) => ({
      selectionMode: (props.selectionMode as string) ?? 'single',
      disallowEmptySelection: props.disallowEmptySelection as boolean | undefined,
      defaultSelectedKeys: props.defaultSelectedKeys as string[] | undefined,
      isReadOnly: props.readOnly as boolean | undefined,
      size: props.size as string | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  /* ── Form Structure ─────────────────────────────────────────────────── */

  Field: {
    component: Field.Root,
    adapter: (_props, ctx) => ({
      children: ctx.children,
    }),
  } as CatalogEntry,

  FieldLabel: {
    component: Field.Label,
    adapter: (props, ctx) => ({
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  FieldDescription: {
    component: Field.Description,
    adapter: (props, ctx) => ({
      children: props.content ?? ctx.children,
    }),
  } as CatalogEntry,

  FieldError: {
    component: Field.Error,
    adapter: (props, ctx) => ({
      children: props.message ?? ctx.children,
    }),
  } as CatalogEntry,

  /* ── Additional Form Controls ───────────────────────────────────────── */

  CheckboxGroup: {
    component: CheckboxGroup,
    adapter: (props, ctx) => ({
      label: props.label as string | undefined,
      description: props.description as string | undefined,
      orientation: props.orientation as string | undefined,
      size: props.size as string | undefined,
      isDisabled: props.disabled as boolean | undefined,
      isRequired: props.required as boolean | undefined,
      isInvalid: props.isInvalid as boolean | undefined,
      name: props.name as string | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  Combobox: {
    component: Combobox.Root,
    adapter: (props, ctx) => ({
      'aria-label': !props.label ? 'Combobox' : undefined,
      isDisabled: props.disabled as boolean | undefined,
      isRequired: props.required as boolean | undefined,
      isInvalid: props.isInvalid as boolean | undefined,
      name: props.name as string | undefined,
      children: h(
        React.Fragment,
        null,
        props.label ? h(Combobox.Label, null, String(props.label)) : null,
        h(
          Combobox.InputGroup,
          null,
          h(Combobox.Input, { placeholder: props.placeholder as string | undefined }),
          h(Combobox.Trigger),
        ),
        h(Combobox.Popover, null, h(Combobox.ListBox as React.ComponentType, null, ctx.children)),
        props.description
          ? h('p', { className: 'tale-combobox__description' }, String(props.description))
          : null,
      ),
    }),
  } as CatalogEntry,

  ComboboxItem: {
    component: Combobox.Item,
    adapter: (props, ctx) => ({
      id: props.id as string,
      textValue: props.textValue as string | undefined,
      isDisabled: props.disabled as boolean | undefined,
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  SelectNative: {
    component: SelectNative,
    adapter: (props) => ({
      'aria-label': (props.label as string) ?? 'Select',
      size: props.size as string | undefined,
      disabled: props.disabled as boolean | undefined,
      name: props.name as string | undefined,
      children: Array.isArray(props.options)
        ? (props.options as Array<{ value: string; label: string }>).map((opt) =>
            h('option', { key: opt.value, value: opt.value }, opt.label),
          )
        : undefined,
    }),
  } as CatalogEntry,

  PinInput: {
    component: PinInput.Root,
    adapter: (props) => {
      const len = (props.maxLength as number) ?? 4;
      return {
        maxLength: len,
        disabled: props.disabled as boolean | undefined,
        children: h(
          PinInput.Group,
          null,
          ...Array.from({ length: len }, (_, i) => h(PinInput.Slot, { key: i, index: i })),
        ),
      };
    },
  } as CatalogEntry,

  /* ── Date & Time ────────────────────────────────────────────────────── */

  Calendar: {
    component: Calendar.Root,
    adapter: (props) => ({
      'aria-label': (props.label as string) ?? 'Calendar',
      isDisabled: props.disabled as boolean | undefined,
      isReadOnly: props.readOnly as boolean | undefined,
      children: h(
        React.Fragment,
        null,
        h(
          Calendar.Header,
          null,
          h(Calendar.PreviousButton),
          h(Calendar.Heading),
          h(Calendar.NextButton),
        ),
        h(
          Calendar.Grid,
          null,
          h(Calendar.GridHeader as React.ComponentType<any>, null, ((day: unknown) =>
            h(Calendar.GridHeaderCell, { key: String(day) }, String(day))) as any),
          h(Calendar.GridBody as React.ComponentType<any>, null, ((date: unknown) =>
            h(Calendar.Cell as React.ComponentType<any>, { key: String(date), date })) as any),
        ),
      ),
    }),
  } as CatalogEntry,

  RangeCalendar: {
    component: RangeCalendar.Root,
    adapter: (props) => ({
      'aria-label': (props.label as string) ?? 'Calendar',
      isDisabled: props.disabled as boolean | undefined,
      isReadOnly: props.readOnly as boolean | undefined,
      children: h(
        React.Fragment,
        null,
        h(
          RangeCalendar.Header,
          null,
          h(RangeCalendar.PreviousButton),
          h(RangeCalendar.Heading),
          h(RangeCalendar.NextButton),
        ),
        h(
          RangeCalendar.Grid,
          null,
          h(RangeCalendar.GridHeader as React.ComponentType<any>, null, ((day: unknown) =>
            h(RangeCalendar.GridHeaderCell, { key: String(day) }, String(day))) as any),
          h(RangeCalendar.GridBody as React.ComponentType<any>, null, ((date: unknown) =>
            h(RangeCalendar.Cell as React.ComponentType<any>, { key: String(date), date })) as any),
        ),
      ),
    }),
  } as CatalogEntry,

  DateField: {
    component: DateField.Root,
    adapter: (props) => ({
      'aria-label': !props.label ? 'Date' : undefined,
      isDisabled: props.disabled as boolean | undefined,
      isReadOnly: props.readOnly as boolean | undefined,
      isRequired: props.required as boolean | undefined,
      isInvalid: props.isInvalid as boolean | undefined,
      name: props.name as string | undefined,
      children: h(
        React.Fragment,
        null,
        props.label ? h(DateField.Label, null, String(props.label)) : null,
        h(DateField.DateInput as React.ComponentType<any>, null, ((seg: any) =>
          h(DateField.Segment as React.ComponentType<any>, {
            key: seg.type,
            segment: seg,
          })) as any),
        props.description ? h(DateField.Description, null, String(props.description)) : null,
        props.errorMessage ? h(DateField.ErrorMessage, null, String(props.errorMessage)) : null,
      ),
    }),
  } as CatalogEntry,

  DatePicker: {
    component: DatePicker.Root,
    adapter: (props) => ({
      'aria-label': !props.label ? 'Date' : undefined,
      isDisabled: props.disabled as boolean | undefined,
      isReadOnly: props.readOnly as boolean | undefined,
      isRequired: props.required as boolean | undefined,
      isInvalid: props.isInvalid as boolean | undefined,
      name: props.name as string | undefined,
      children: h(
        React.Fragment,
        null,
        props.label ? h(DatePicker.Label, null, String(props.label)) : null,
        h(
          DatePicker.Group,
          null,
          h(DatePicker.DateInput as React.ComponentType<any>, null, ((seg: any) =>
            h(DatePicker.Segment as React.ComponentType<any>, {
              key: seg.type,
              segment: seg,
            })) as any),
          h(DatePicker.Trigger),
        ),
        h(
          DatePicker.Popover,
          null,
          h(
            DatePicker.Dialog,
            null,
            h(
              Calendar.Root,
              null,
              h(
                Calendar.Header,
                null,
                h(Calendar.PreviousButton),
                h(Calendar.Heading),
                h(Calendar.NextButton),
              ),
              h(
                Calendar.Grid,
                null,
                h(Calendar.GridHeader as React.ComponentType<any>, null, ((day: unknown) =>
                  h(Calendar.GridHeaderCell, { key: String(day) }, String(day))) as any),
                h(Calendar.GridBody as React.ComponentType<any>, null, ((date: unknown) =>
                  h(Calendar.Cell as React.ComponentType<any>, {
                    key: String(date),
                    date,
                  })) as any),
              ),
            ),
          ),
        ),
        props.description ? h(DatePicker.Description, null, String(props.description)) : null,
        props.errorMessage ? h(DatePicker.ErrorMessage, null, String(props.errorMessage)) : null,
      ),
    }),
  } as CatalogEntry,

  DateRangePicker: {
    component: DateRangePicker.Root,
    adapter: (props) => ({
      'aria-label': !props.label ? 'Date range' : undefined,
      isDisabled: props.disabled as boolean | undefined,
      isReadOnly: props.readOnly as boolean | undefined,
      isRequired: props.required as boolean | undefined,
      isInvalid: props.isInvalid as boolean | undefined,
      name: props.name as string | undefined,
      children: h(
        React.Fragment,
        null,
        props.label ? h(DateRangePicker.Label, null, String(props.label)) : null,
        h(
          DateRangePicker.Group,
          null,
          h(DateRangePicker.StartDate as React.ComponentType<any>, null, ((seg: any) =>
            h(DateRangePicker.Segment as React.ComponentType<any>, {
              key: seg.type,
              segment: seg,
            })) as any),
          h('span', { 'aria-hidden': true }, '–'),
          h(DateRangePicker.EndDate as React.ComponentType<any>, null, ((seg: any) =>
            h(DateRangePicker.Segment as React.ComponentType<any>, {
              key: seg.type,
              segment: seg,
            })) as any),
          h(DateRangePicker.Trigger),
        ),
        h(
          DateRangePicker.Popover,
          null,
          h(
            DateRangePicker.Dialog,
            null,
            h(
              RangeCalendar.Root,
              null,
              h(
                RangeCalendar.Header,
                null,
                h(RangeCalendar.PreviousButton),
                h(RangeCalendar.Heading),
                h(RangeCalendar.NextButton),
              ),
              h(
                RangeCalendar.Grid,
                null,
                h(RangeCalendar.GridHeader as React.ComponentType<any>, null, ((day: unknown) =>
                  h(RangeCalendar.GridHeaderCell, { key: String(day) }, String(day))) as any),
                h(RangeCalendar.GridBody as React.ComponentType<any>, null, ((date: unknown) =>
                  h(RangeCalendar.Cell as React.ComponentType<any>, {
                    key: String(date),
                    date,
                  })) as any),
              ),
            ),
          ),
        ),
        props.description ? h(DateRangePicker.Description, null, String(props.description)) : null,
        props.errorMessage
          ? h(DateRangePicker.ErrorMessage, null, String(props.errorMessage))
          : null,
      ),
    }),
  } as CatalogEntry,

  TimeField: {
    component: TimeField.Root,
    adapter: (props) => ({
      'aria-label': !props.label ? 'Time' : undefined,
      isDisabled: props.disabled as boolean | undefined,
      isReadOnly: props.readOnly as boolean | undefined,
      isRequired: props.required as boolean | undefined,
      isInvalid: props.isInvalid as boolean | undefined,
      name: props.name as string | undefined,
      children: h(
        React.Fragment,
        null,
        props.label ? h(TimeField.Label, null, String(props.label)) : null,
        h(TimeField.DateInput as React.ComponentType<any>, null, ((seg: any) =>
          h(TimeField.Segment as React.ComponentType<any>, {
            key: seg.type,
            segment: seg,
          })) as any),
        props.description ? h(TimeField.Description, null, String(props.description)) : null,
        props.errorMessage ? h(TimeField.ErrorMessage, null, String(props.errorMessage)) : null,
      ),
    }),
  } as CatalogEntry,

  /* ── Color ──────────────────────────────────────────────────────────── */

  ColorField: {
    component: ColorField.Root,
    adapter: (props) => ({
      'aria-label': !props.label ? 'Color' : undefined,
      isDisabled: props.disabled as boolean | undefined,
      isReadOnly: props.readOnly as boolean | undefined,
      isRequired: props.required as boolean | undefined,
      isInvalid: props.isInvalid as boolean | undefined,
      name: props.name as string | undefined,
      children: h(
        React.Fragment,
        null,
        props.label ? h(ColorField.Label, null, String(props.label)) : null,
        h(ColorField.Input, { placeholder: props.placeholder as string | undefined }),
        props.description ? h(ColorField.Description, null, String(props.description)) : null,
        props.errorMessage ? h(ColorField.ErrorMessage, null, String(props.errorMessage)) : null,
      ),
    }),
  } as CatalogEntry,

  ColorArea: {
    component: ColorArea.Root,
    adapter: (props) => ({
      'aria-label': (props.label as string) ?? 'Color area',
      xChannel: (props.xChannel as string) ?? 'saturation',
      yChannel: (props.yChannel as string) ?? 'brightness',
      children: h(ColorArea.Thumb),
    }),
  } as CatalogEntry,

  ColorSlider: {
    component: ColorSlider.Root,
    adapter: (props) => ({
      channel: (props.channel as string) ?? 'hue',
      children: h(
        React.Fragment,
        null,
        props.label ? h(ColorSlider.Label, null, String(props.label)) : null,
        h(ColorSlider.Output),
        h(ColorSlider.Track, null, h(ColorSlider.Thumb)),
      ),
    }),
  } as CatalogEntry,

  /* ── Overlays (additional) ──────────────────────────────────────────── */

  PreviewCard: {
    component: PreviewCard.Root,
    adapter: (props, ctx) => ({
      delay: props.delay as number | undefined,
      closeDelay: props.closeDelay as number | undefined,
      children: h(
        React.Fragment,
        null,
        h(
          PreviewCard.Trigger as React.ComponentType<any>,
          null,
          (props.label as string) ?? 'Preview',
        ),
        h(
          PreviewCard.Popup as React.ComponentType<any>,
          {
            placement: (props.placement as string) ?? 'bottom',
            offset: 8,
          },
          h(PreviewCard.Arrow as React.ComponentType, null),
          h(
            PreviewCard.Content as React.ComponentType<any>,
            { 'aria-label': (props.title as string) ?? 'Preview' },
            props.title ? h('strong', null, String(props.title)) : null,
            ctx.children,
          ),
        ),
      ),
    }),
  } as CatalogEntry,

  ContextMenu: {
    component: ContextMenu.Root,
    adapter: (_props, ctx) => ({
      children: ctx.children,
    }),
  } as CatalogEntry,

  ContextMenuTrigger: {
    component: ContextMenu.Trigger,
    adapter: (props, ctx) => ({
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  ContextMenuPopup: {
    component: ContextMenu.Popup,
    adapter: (_props, ctx) => ({
      children: h(ContextMenu.MenuList as React.ComponentType, null, ctx.children),
    }),
  } as CatalogEntry,

  ContextMenuItem: {
    component: ContextMenu.Item,
    adapter: (props, ctx) => ({
      id: props.id as string | undefined,
      textValue: props.textValue as string | undefined,
      isDisabled: props.disabled as boolean | undefined,
      onAction: props.action ? pressHandler(props.action, ctx) : undefined,
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  ContextMenuSeparator: {
    component: ContextMenu.Separator,
    adapter: () => ({}),
  } as CatalogEntry,

  /* ── Navigation (additional) ────────────────────────────────────────── */

  NavigationMenu: {
    component: NavigationMenu.Root,
    adapter: (_props, ctx) => ({
      children: h(NavigationMenu.List, null, ctx.children),
    }),
  } as CatalogEntry,

  NavigationMenuItem: {
    component: NavigationMenu.Item,
    adapter: (_props, ctx) => ({
      children: ctx.children,
    }),
  } as CatalogEntry,

  NavigationMenuLink: {
    component: NavigationMenu.Link,
    adapter: (props, ctx) => ({
      href: props.href as string | undefined,
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  /* ── Layout (additional) ────────────────────────────────────────────── */

  Carousel: {
    component: Carousel.Root,
    adapter: (props, ctx) => ({
      loop: props.loop as boolean | undefined,
      autoplay: props.autoplay as boolean | undefined,
      slidesPerView: props.slidesPerView as number | undefined,
      orientation: props.orientation as string | undefined,
      children: h(
        React.Fragment,
        null,
        h(Carousel.Content, null, ctx.children),
        h(Carousel.PreviousTrigger),
        h(Carousel.NextTrigger),
      ),
    }),
  } as CatalogEntry,

  CarouselItem: {
    component: Carousel.Item,
    adapter: (_props, ctx) => ({
      children: ctx.children,
    }),
  } as CatalogEntry,

  ScrollArea: {
    component: ScrollArea.Root,
    adapter: (_props, ctx) => ({
      children: h(
        React.Fragment,
        null,
        h(ScrollArea.Viewport, null, h(ScrollArea.Content, null, ctx.children)),
        h(ScrollArea.Scrollbar, { orientation: 'vertical' }, h(ScrollArea.Thumb)),
        h(ScrollArea.Corner),
      ),
    }),
  } as CatalogEntry,

  Toolbar: {
    component: Toolbar.Root,
    adapter: (props, ctx) => ({
      'aria-label': (props.label as string) ?? 'Toolbar',
      children: ctx.children,
    }),
  } as CatalogEntry,

  ToolbarButton: {
    component: Toolbar.Button,
    adapter: (props, ctx) => ({
      isDisabled: props.disabled as boolean | undefined,
      onPress: pressHandler(props.action, ctx),
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  ToolbarSeparator: {
    component: Toolbar.Separator,
    adapter: () => ({}),
  } as CatalogEntry,

  /* ── Display (additional) ───────────────────────────────────────────── */

  GridList: {
    component: GridList.Root,
    adapter: (props, ctx) => ({
      'aria-label': (props.label as string) ?? 'List',
      selectionMode: props.selectionMode as string | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  GridListItem: {
    component: GridList.Item,
    adapter: (props, ctx) => ({
      id: props.id as string,
      textValue: props.textValue as string | undefined,
      isDisabled: props.disabled as boolean | undefined,
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  Tree: {
    component: Tree.Root,
    adapter: (props, ctx) => ({
      'aria-label': (props.label as string) ?? 'Tree',
      selectionMode: props.selectionMode as string | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  TreeItem: {
    component: Tree.Item,
    adapter: (props, ctx) => ({
      id: props.id as string,
      textValue: (props.textValue as string) ?? (props.label as string) ?? (props.id as string),
      children: h(
        React.Fragment,
        null,
        h(Tree.ItemContent, null, props.label ? String(props.label) : null),
        ctx.children,
      ),
    }),
  } as CatalogEntry,

  RatingStars: {
    component: RatingStars,
    adapter: (props) => ({
      value: props.value as number,
      max: props.max as number | undefined,
      size: props.size as string | undefined,
    }),
  } as CatalogEntry,

  RatingBadge: {
    component: RatingBadge,
    adapter: (props) => ({
      value: props.value as number,
      size: props.size as string | undefined,
    }),
  } as CatalogEntry,

  FeaturedIcon: {
    component: FeaturedIcon,
    adapter: (props, ctx) => ({
      variant: props.variant as string | undefined,
      shape: props.shape as string | undefined,
      size: props.size as string | undefined,
      theme: props.theme as string | undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  DotIcon: {
    component: DotIcon,
    adapter: (props) => ({
      color: props.color as string | undefined,
      size: props.size as string | undefined,
    }),
  } as CatalogEntry,

  /* ── Form Structure (additional) ────────────────────────────────────── */

  Fieldset: {
    component: Fieldset.Root,
    adapter: (props, ctx) => ({
      children: h(
        React.Fragment,
        null,
        props.label ? h(Fieldset.Legend, null, String(props.label)) : null,
        ctx.children,
      ),
    }),
  } as CatalogEntry,

  /* ── Interaction ────────────────────────────────────────────────────── */

  IconButton: {
    component: IconButton,
    adapter: (props, ctx) => ({
      variant: (props.variant as string) ?? 'ghost',
      size: props.size as string | undefined,
      isDisabled: props.disabled as boolean | undefined,
      'aria-label': (props.label as string) ?? 'Button',
      onPress: pressHandler(props.action, ctx),
      children: ctx.children,
    }),
  } as CatalogEntry,

  DropZone: {
    component: DropZone,
    adapter: (props, ctx) => ({
      onDrop: props.action ? () => pressHandler(props.action, ctx)?.() : undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  FileTrigger: {
    component: FileTrigger,
    adapter: (props, ctx) => ({
      acceptedFileTypes: props.acceptedFileTypes as string[] | undefined,
      allowsMultiple: props.allowsMultiple as boolean | undefined,
      onSelect: props.action ? () => pressHandler(props.action, ctx)?.() : undefined,
      children: ctx.children,
    }),
  } as CatalogEntry,

  FileUpload: {
    component: FileUpload.Root,
    adapter: (_props, ctx) => ({
      children: h(
        React.Fragment,
        null,
        h(FileUpload.DropZone, {}),
        ctx.children ? h(FileUpload.List, null, ctx.children) : null,
      ),
    }),
  } as CatalogEntry,

  /* ── Additional Specialized Inputs ─────────────────────────────────── */

  PaymentInput: {
    component: PaymentInput.Root,
    adapter: (props) => ({
      'aria-label': !props.label ? 'Card number' : undefined,
      isDisabled: props.disabled as boolean | undefined,
      isReadOnly: props.readOnly as boolean | undefined,
      isRequired: props.required as boolean | undefined,
      isInvalid: props.isInvalid as boolean | undefined,
      name: props.name as string | undefined,
      children: h(
        React.Fragment,
        null,
        props.label ? h(PaymentInput.Label, null, String(props.label)) : null,
        h(
          PaymentInput.Group,
          null,
          h(PaymentInput.Input, { placeholder: props.placeholder as string | undefined }),
          h(PaymentInput.CardIcon),
        ),
        props.description ? h(PaymentInput.Description, null, String(props.description)) : null,
        props.errorMessage ? h(PaymentInput.ErrorMessage, null, String(props.errorMessage)) : null,
      ),
    }),
  } as CatalogEntry,

  Autocomplete: {
    component: Autocomplete.Root,
    adapter: (props, ctx) => ({
      children: h(
        React.Fragment,
        null,
        h(
          Autocomplete.SearchField as React.ComponentType<any>,
          null,
          props.label ? h('label' as any, null, String(props.label)) : null,
          h(Autocomplete.Input as React.ComponentType<any>, {
            placeholder: props.placeholder as string | undefined,
          }),
        ),
        h(Autocomplete.ListBox as React.ComponentType, null, ctx.children),
      ),
    }),
  } as CatalogEntry,

  AutocompleteItem: {
    component: Autocomplete.Item,
    adapter: (props, ctx) => ({
      id: props.id as string,
      textValue: props.textValue as string | undefined,
      isDisabled: props.disabled as boolean | undefined,
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  /* ── Additional Color ───────────────────────────────────────────────── */

  ColorWheel: {
    component: ColorWheel.Root,
    adapter: (props) => ({
      'aria-label': (props.label as string) ?? 'Color wheel',
      outerRadius: (props.outerRadius as number) ?? 100,
      innerRadius: (props.innerRadius as number) ?? 70,
      children: h(React.Fragment, null, h(ColorWheel.Track), h(ColorWheel.Thumb)),
    }),
  } as CatalogEntry,

  ColorSwatch: {
    component: ColorSwatch,
    adapter: (props) => ({
      color: props.color as string,
      shape: props.shape as 'square' | 'circle' | undefined,
      secondaryColor: props.secondaryColor as string | undefined,
    }),
  } as CatalogEntry,

  ColorSwatchPicker: {
    component: ColorSwatchPicker.Root,
    adapter: (props, ctx) => {
      const shape = props.shape as 'square' | 'circle' | undefined;
      // `colors` may be an array of strings (single colour per swatch) or an
      // array of { color, secondaryColor } objects (theme preview swatches).
      const colors = Array.isArray(props.colors) ? props.colors : null;
      return {
        shape,
        children: colors
          ? colors.map((entry, i) => {
              const color = typeof entry === 'string' ? entry : (entry as { color: string }).color;
              const secondaryColor =
                typeof entry === 'string'
                  ? undefined
                  : (entry as { secondaryColor?: string }).secondaryColor;
              return h(
                ColorSwatchPicker.Item as React.ComponentType<any>,
                { key: i, color },
                h(ColorSwatch, { secondaryColor } as any),
              );
            })
          : ctx.children,
      };
    },
  } as CatalogEntry,

  ColorPicker: {
    component: ColorPicker.Root,
    adapter: (_props, ctx) => ({
      children: ctx.children,
    }),
  } as CatalogEntry,

  /* ── Marketing ──────────────────────────────────────────────────────── */

  AppStoreButton: {
    component: AppStoreButton,
    adapter: (props) => ({
      store: props.store as 'apple' | 'google',
      size: props.size as string | undefined,
      href: props.href as string | undefined,
    }),
  } as CatalogEntry,

  SocialButton: {
    component: SocialButton,
    adapter: (props) => ({
      provider: props.provider as string,
      size: props.size as string | undefined,
      href: props.href as string | undefined,
      children: props.label as string | undefined,
    }),
  } as CatalogEntry,

  BadgeGroup: {
    component: BadgeGroup.Root,
    adapter: (props, ctx) => ({
      addonText: props.addonText as string | undefined,
      size: props.size as 'md' | 'lg' | undefined,
      color: props.color as 'brand' | 'warning' | 'error' | 'gray' | 'success' | undefined,
      theme: props.theme as 'light' | 'modern' | undefined,
      align: props.align as 'leading' | 'trailing' | undefined,
      children: props.label ?? ctx.children,
    }),
  } as CatalogEntry,

  SectionDivider: {
    component: SectionDivider,
    adapter: () => ({}),
  } as CatalogEntry,

  InputGroup: {
    component: InputGroup.Root,
    adapter: (_props, ctx) => ({
      children: ctx.children,
    }),
  } as CatalogEntry,

  InputTags: {
    component: InputTags.Root,
    adapter: (props) => ({
      label: props.label as string | undefined,
      placeholder: props.placeholder as string | undefined,
      description: props.description as string | undefined,
      defaultValue: props.defaultValue as string[] | undefined,
      tagPlacement: props.tagPlacement as 'inline' | 'below' | undefined,
      isDisabled: props.isDisabled as boolean | undefined,
      isRequired: props.isRequired as boolean | undefined,
      isInvalid: props.isInvalid as boolean | undefined,
    }),
  } as CatalogEntry,

  MultiSelect: {
    component: MultiSelect.Root,
    adapter: (props) => ({
      label: props.label as string | undefined,
      placeholder: props.placeholder as string | undefined,
      description: props.description as string | undefined,
      isDisabled: props.isDisabled as boolean | undefined,
      isRequired: props.isRequired as boolean | undefined,
      isInvalid: props.isInvalid as boolean | undefined,
      showSearch: props.showSearch as boolean | undefined,
      showFooter: props.showFooter as boolean | undefined,
    }),
  } as CatalogEntry,

  TagSelect: {
    component: TagSelect.Root,
    adapter: (props) => ({
      label: props.label as string | undefined,
      placeholder: props.placeholder as string | undefined,
      description: props.description as string | undefined,
      isDisabled: props.isDisabled as boolean | undefined,
      isRequired: props.isRequired as boolean | undefined,
      isInvalid: props.isInvalid as boolean | undefined,
    }),
  } as CatalogEntry,
};

/** Create a new catalog by merging the standard Tale UI catalog with custom entries. */
export function createCatalog(overrides: Record<string, CatalogEntry>): Catalog {
  return { ...taleUICatalog, ...overrides };
}
