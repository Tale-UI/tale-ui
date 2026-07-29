import { Accordion } from '@tale-ui/react-native/accordion';
import { AlertDialog } from '@tale-ui/react-native/alert-dialog';
import { Badge } from '@tale-ui/react-native/badge';
import { Banner } from '@tale-ui/react-native/banner';
import { Breadcrumbs } from '@tale-ui/react-native/breadcrumbs';
import { Button } from '@tale-ui/react-native/button';
import { Card } from '@tale-ui/react-native/card';
import { CheckboxField } from '@tale-ui/react-native/checkbox-field';
import { CheckboxGroup } from '@tale-ui/react-native/checkbox-group';
import { Column } from '@tale-ui/react-native/column';
import { Dialog } from '@tale-ui/react-native/dialog';
import { Disclosure } from '@tale-ui/react-native/disclosure';
import { Drawer } from '@tale-ui/react-native/drawer';
import { Field } from '@tale-ui/react-native/field';
import { Fieldset } from '@tale-ui/react-native/fieldset';
import { Form } from '@tale-ui/react-native/form';
import { GridList } from '@tale-ui/react-native/grid-list';
import { Icon } from '@tale-ui/react-native/icon';
import { IconButton } from '@tale-ui/react-native/icon-button';
import { Input } from '@tale-ui/react-native/input';
import { List } from '@tale-ui/react-native/list';
import { ListBox } from '@tale-ui/react-native/list-box';
import { Pagination } from '@tale-ui/react-native/pagination';
import { ProgressBar } from '@tale-ui/react-native/progress-bar';
import { RadioGroup as RadioField } from '@tale-ui/react-native/radio-field';
import { RadioGroup } from '@tale-ui/react-native/radio-group';
import { Row } from '@tale-ui/react-native/row';
import { SearchField } from '@tale-ui/react-native/search-field';
import { Separator } from '@tale-ui/react-native/separator';
import { Skeleton } from '@tale-ui/react-native/skeleton';
import { Slider } from '@tale-ui/react-native/slider';
import { Spinner } from '@tale-ui/react-native/spinner';
import { SwitchField } from '@tale-ui/react-native/switch-field';
import { Tabs } from '@tale-ui/react-native/tabs';
import { TagGroup } from '@tale-ui/react-native/tag-group';
import { Text } from '@tale-ui/react-native/text';
import { TextArea } from '@tale-ui/react-native/text-area';
import { Toast } from '@tale-ui/react-native/toast';
import { ToggleButton } from '@tale-ui/react-native/toggle-button';
import { ToggleButtonGroup } from '@tale-ui/react-native/toggle-group';
import { Toolbar } from '@tale-ui/react-native/toolbar';
import * as React from 'react';

type NativePlaygroundProps = {
  component: string;
  args: object;
};

type DynamicProps = Record<string, unknown> & { children?: React.ReactNode };
type DynamicComponent = React.ComponentType<DynamicProps>;

const noop = () => {};
const components = {
  accordion: Accordion,
  'alert-dialog': AlertDialog,
  badge: Badge,
  banner: Banner,
  breadcrumbs: Breadcrumbs,
  button: Button,
  card: Card,
  'checkbox-field': CheckboxField,
  'checkbox-group': CheckboxGroup,
  column: Column,
  dialog: Dialog,
  disclosure: Disclosure,
  drawer: Drawer,
  field: Field,
  fieldset: Fieldset,
  form: Form,
  'grid-list': GridList,
  icon: Icon,
  'icon-button': IconButton,
  input: Input,
  list: List,
  'list-box': ListBox,
  pagination: Pagination,
  'progress-bar': ProgressBar,
  'radio-field': RadioField,
  'radio-group': RadioGroup,
  row: Row,
  'search-field': SearchField,
  separator: Separator,
  skeleton: Skeleton,
  slider: Slider,
  spinner: Spinner,
  'switch-field': SwitchField,
  tabs: Tabs,
  'tag-group': TagGroup,
  text: Text,
  'text-area': TextArea,
  toast: Toast,
  'toggle-button': ToggleButton,
  'toggle-group': ToggleButtonGroup,
  toolbar: Toolbar,
} as const;

const commaSeparated = (value: unknown, fallback: string): string[] =>
  String(value ?? fallback)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const textItems = (value: unknown, fallback: string) =>
  commaSeparated(value, fallback).map((item) => <Text key={item}>{item}</Text>);

function getStructuredProps(component: string, rawArgs: DynamicProps): DynamicProps {
  if (component === 'accordion') {
    const items = Array.isArray(rawArgs.items) ? rawArgs.items : [];
    return {
      ...rawArgs,
      items: items.map((item, index) => {
        const record = item as Record<string, unknown>;
        return {
          id: String(record.id ?? index),
          title: String(record.title ?? `Item ${index + 1}`),
          content: <Text>{String(record.content ?? '')}</Text>,
        };
      }),
    };
  }
  if (component === 'tabs') {
    const items = Array.isArray(rawArgs.items) ? rawArgs.items : [];
    return {
      ...rawArgs,
      items: items.map((item, index) => {
        const record = item as Record<string, unknown>;
        return {
          id: String(record.id ?? index),
          label: String(record.label ?? `Tab ${index + 1}`),
          content: <Text>{String(record.content ?? '')}</Text>,
        };
      }),
    };
  }
  return rawArgs;
}

function getStructuredChildren(component: string, children: unknown): React.ReactNode | undefined {
  switch (component) {
    case 'breadcrumbs':
      return textItems(children, 'Home, Settings, Profile');
    case 'card':
      return <Text>{String(children ?? 'Card content')}</Text>;
    case 'drawer':
      return <Text>{String(children ?? 'Drawer content')}</Text>;
    case 'checkbox-group':
      return commaSeparated(children, 'Email, Push, SMS').map((label) => (
        <CheckboxField key={label}>{label}</CheckboxField>
      ));
    case 'column':
    case 'grid-list':
    case 'list':
    case 'list-box':
    case 'row':
      return textItems(children, 'First, Second, Third');
    case 'icon':
      return <Text>{String(children ?? '★')}</Text>;
    case 'field':
      return <Input accessibilityLabel="Field value" placeholder="Enter a value" />;
    case 'fieldset':
      return <CheckboxField>Email</CheckboxField>;
    case 'form':
      return (
        <Column style={{ gap: 12 }}>
          <Input accessibilityLabel="Name" placeholder="Name" />
          <Button onPress={noop}>Submit</Button>
        </Column>
      );
    case 'tag-group':
      return commaSeparated(children, 'Design, Native, Accessibility').map((label) => (
        <Badge key={label}>{label}</Badge>
      ));
    case 'toggle-group':
      return commaSeparated(children, 'Bold, Italic, Underline').map((label, index) => (
        <ToggleButton isSelected={index === 0} key={label} onSelectionChange={noop}>
          {label}
        </ToggleButton>
      ));
    case 'toolbar':
      return commaSeparated(children, 'Undo, Redo').map((label) => (
        <IconButton accessibilityLabel={label} key={label} onPress={noop}>
          {label}
        </IconButton>
      ));
    default:
      return children as React.ReactNode;
  }
}

export function NativePlayground({ component, args }: NativePlaygroundProps) {
  const selected = components[component as keyof typeof components];
  const suppliedArgs = args as DynamicProps;
  const [interactiveArgs, setInteractiveArgs] = React.useState<DynamicProps>(suppliedArgs);
  React.useEffect(() => setInteractiveArgs(suppliedArgs), [selected, suppliedArgs]);
  if (!selected) {
    return <Text>{`Unknown native story component: ${component}`}</Text>;
  }
  const report = (name: string, value?: unknown) => {
    const callback = suppliedArgs[name];
    if (typeof callback === 'function') {
      callback(value);
    }
  };
  const statefulCallbacks: Record<string, DynamicProps> = {
    'alert-dialog': {
      onOpenChange: (isOpen: boolean) => {
        setInteractiveArgs((current) => ({ ...current, isOpen }));
        report('onOpenChange', isOpen);
      },
    },
    button: { onPress: () => report('onPress') },
    card: { onPress: () => report('onPress') },
    'checkbox-field': {
      onSelectionChange: (isSelected: boolean) => {
        setInteractiveArgs((current) => ({ ...current, isSelected }));
        report('onSelectionChange', isSelected);
      },
    },
    dialog: {
      onOpenChange: (isOpen: boolean) => {
        setInteractiveArgs((current) => ({ ...current, isOpen }));
        report('onOpenChange', isOpen);
      },
    },
    disclosure: {
      onExpandedChange: (isExpanded: boolean) => {
        setInteractiveArgs((current) => ({ ...current, isExpanded }));
        report('onExpandedChange', isExpanded);
      },
    },
    drawer: {
      onOpenChange: (isOpen: boolean) => {
        setInteractiveArgs((current) => ({ ...current, isOpen }));
        report('onOpenChange', isOpen);
      },
    },
    'icon-button': { onPress: () => report('onPress') },
    input: {
      onChangeText: (value: string) => {
        setInteractiveArgs((current) => ({ ...current, value }));
        report('onChangeText', value);
      },
    },
    pagination: {
      onPageChange: (page: number) => {
        setInteractiveArgs((current) => ({ ...current, page }));
        report('onPageChange', page);
      },
    },
    'radio-field': {
      onValueChange: (value: string) => {
        setInteractiveArgs((current) => ({ ...current, value }));
        report('onValueChange', value);
      },
    },
    'radio-group': {
      onValueChange: (value: string) => {
        setInteractiveArgs((current) => ({ ...current, value }));
        report('onValueChange', value);
      },
    },
    'search-field': {
      onChangeText: (value: string) => {
        setInteractiveArgs((current) => ({ ...current, value }));
        report('onChangeText', value);
      },
    },
    slider: {
      onValueChange: (value: number) => {
        setInteractiveArgs((current) => ({ ...current, value }));
        report('onValueChange', value);
      },
    },
    'switch-field': {
      onValueChange: (value: boolean) => {
        setInteractiveArgs((current) => ({ ...current, value }));
        report('onValueChange', value);
      },
    },
    tabs: {
      onSelectionChange: (selectedKey: string) => {
        setInteractiveArgs((current) => ({ ...current, selectedKey }));
        report('onSelectionChange', selectedKey);
      },
    },
    'text-area': {
      onChangeText: (value: string) => {
        setInteractiveArgs((current) => ({ ...current, value }));
        report('onChangeText', value);
      },
    },
    'toggle-button': {
      onSelectionChange: (isSelected: boolean) => {
        setInteractiveArgs((current) => ({ ...current, isSelected }));
        report('onSelectionChange', isSelected);
      },
    },
  };
  const rawArgs = interactiveArgs;
  const { children, ...propsWithoutChildren } = rawArgs;
  const props = getStructuredProps(component, {
    ...propsWithoutChildren,
    ...(statefulCallbacks[component] ?? {}),
  });
  const structuredChildren = getStructuredChildren(component, children);
  const Component = selected as unknown as DynamicComponent;

  return <Component {...props}>{structuredChildren}</Component>;
}
