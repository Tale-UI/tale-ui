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
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';

const meta = {
  title: 'Registry fixtures',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => {};
function AlertDialogFixture() {
  const [isOpen, setOpen] = useState(true);
  return (
    <AlertDialog isOpen={isOpen} onOpenChange={setOpen} title="Delete draft">
      <Text>This cannot be undone.</Text>
    </AlertDialog>
  );
}

function DialogFixture() {
  const [isOpen, setOpen] = useState(true);
  return (
    <Dialog isOpen={isOpen} onOpenChange={setOpen} title="Account settings">
      <Text>Dialog content</Text>
    </Dialog>
  );
}

function DrawerFixture() {
  const [isOpen, setOpen] = useState(true);
  return (
    <Drawer isOpen={isOpen} label="Navigation drawer" onOpenChange={setOpen}>
      <Text>Drawer content</Text>
    </Drawer>
  );
}

const radioItems = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two', isDisabled: true },
];
const tabItems = [
  { id: 'one', label: 'One', content: <Text>First panel</Text> },
  { id: 'two', label: 'Two', content: <Text>Second panel</Text> },
];

export const AccordionAllVariations: Story = {
  name: 'Accordion / All Variations',
  parameters: { nativeComponent: 'accordion' },
  render: () => (
    <Accordion
      items={[
        { id: 'open', title: 'Expanded item', content: <Text>Expanded content</Text> },
        { id: 'closed', title: 'Collapsed item', content: <Text>Collapsed content</Text> },
      ]}
    />
  ),
};
export const AlertDialogAllVariations: Story = {
  name: 'AlertDialog / All Variations',
  parameters: { nativeComponent: 'alert-dialog' },
  render: () => <AlertDialogFixture />,
};
export const BadgeAllVariations: Story = {
  name: 'Badge / All Variations',
  parameters: { nativeComponent: 'badge' },
  render: () => (
    <Column gap="3xs">
      <Row gap="3xs" wrap>
        <Badge size="sm">Small</Badge>
        <Badge>Medium</Badge>
        <Badge size="lg">Large</Badge>
      </Row>
      <Row gap="3xs" wrap>
        <Badge variant="brand">Brand pill</Badge>
        <Badge type="rounded" variant="brand">
          Colour rounded
        </Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
        <Badge variant="violet">Violet</Badge>
        <Badge type="modern">Modern</Badge>
      </Row>
    </Column>
  ),
};
export const BannerAllVariations: Story = {
  name: 'Banner / All Variations',
  parameters: { nativeComponent: 'banner' },
  render: () => (
    <Column gap="3xs">
      <Banner title="Information">Available offline.</Banner>
      <Banner title="Saved" variant="success">
        Changes were saved.
      </Banner>
      <Banner title="Check this" variant="warning">
        Review this setting.
      </Banner>
      <Banner size="sm" title="Error" variant="error">
        Could not save.
      </Banner>
    </Column>
  ),
};
export const BreadcrumbsAllVariations: Story = {
  name: 'Breadcrumbs / All Variations',
  parameters: { nativeComponent: 'breadcrumbs' },
  render: () => (
    <Breadcrumbs>
      <Text>Home</Text>
      <Text>Details</Text>
    </Breadcrumbs>
  ),
};
export const ButtonAllVariations: Story = {
  name: 'Button / All Variations',
  parameters: { nativeComponent: 'button' },
  render: () => (
    <Column gap="3xs">
      <Row gap="3xs" wrap>
        <Button onPress={noop} variant="primary">
          Primary
        </Button>
        <Button onPress={noop} variant="neutral">
          Neutral
        </Button>
        <Button onPress={noop} variant="ghost">
          Ghost
        </Button>
        <Button onPress={noop} variant="inverse">
          Inverse
        </Button>
      </Row>
      <Row gap="3xs" wrap>
        <Button onPress={noop} variant="danger">
          Danger
        </Button>
        <Button onPress={noop} variant="danger-neutral">
          Danger neutral
        </Button>
        <Button onPress={noop} variant="danger-ghost">
          Danger ghost
        </Button>
      </Row>
      <Row gap="3xs" wrap>
        <Button onPress={noop} size="sm">
          Small
        </Button>
        <Button onPress={noop}>Medium</Button>
        <Button onPress={noop} size="lg">
          Large
        </Button>
        <Button isDisabled>Disabled</Button>
        <Button isPending>Pending</Button>
      </Row>
    </Column>
  ),
};
export const CardAllVariations: Story = {
  name: 'Card / All Variations',
  parameters: { nativeComponent: 'card' },
  render: () => (
    <Column gap="3xs">
      <Card variant="outlined">
        <Text>Outlined card</Text>
      </Card>
      <Card variant="elevated">
        <Text>Elevated card</Text>
      </Card>
      <Card variant="filled">
        <Text>Filled card</Text>
      </Card>
      <Card isSelected onPress={noop}>
        <Text>Selected interactive card</Text>
      </Card>
    </Column>
  ),
};
export const CheckboxFieldAllVariations: Story = {
  name: 'CheckboxField / All Variations',
  parameters: { nativeComponent: 'checkbox-field' },
  render: () => (
    <Column>
      <CheckboxField>Unchecked</CheckboxField>
      <CheckboxField isSelected>Checked</CheckboxField>
      <CheckboxField isInvalid>Invalid</CheckboxField>
      <CheckboxField size="sm">Small</CheckboxField>
      <CheckboxField isDisabled>Disabled</CheckboxField>
    </Column>
  ),
};
export const CheckboxGroupAllVariations: Story = {
  name: 'CheckboxGroup / All Variations',
  parameters: { nativeComponent: 'checkbox-group' },
  render: () => (
    <CheckboxGroup>
      <CheckboxField>First choice</CheckboxField>
      <CheckboxField isSelected>Second choice</CheckboxField>
    </CheckboxGroup>
  ),
};
export const ColumnAllVariations: Story = {
  name: 'Column / All Variations',
  parameters: { nativeComponent: 'column' },
  render: () => (
    <Column style={{ gap: 8 }}>
      <Text>First</Text>
      <Text>Second</Text>
    </Column>
  ),
};
export const DialogAllVariations: Story = {
  name: 'Dialog / All Variations',
  parameters: { nativeComponent: 'dialog' },
  render: () => <DialogFixture />,
};
export const DisclosureAllVariations: Story = {
  name: 'Disclosure / All Variations',
  parameters: { nativeComponent: 'disclosure' },
  render: () => (
    <Column>
      <Disclosure defaultExpanded title="Expanded">
        <Text>Visible content</Text>
      </Disclosure>
      <Disclosure title="Collapsed">
        <Text>Hidden content</Text>
      </Disclosure>
    </Column>
  ),
};
export const DrawerAllVariations: Story = {
  name: 'Drawer / All Variations',
  parameters: { nativeComponent: 'drawer' },
  render: () => <DrawerFixture />,
};
export const FieldAllVariations: Story = {
  name: 'Field / All Variations',
  parameters: { nativeComponent: 'field' },
  render: () => (
    <Column>
      <Field description="Used for receipts" label="Email" isRequired>
        <Input accessibilityLabel="Email" />
      </Field>
      <Field errorMessage="Enter a valid email" label="Invalid email">
        <Input accessibilityLabel="Invalid email" isInvalid />
      </Field>
    </Column>
  ),
};
export const FieldsetAllVariations: Story = {
  name: 'Fieldset / All Variations',
  parameters: { nativeComponent: 'fieldset' },
  render: () => (
    <Fieldset legend="Contact preferences">
      <CheckboxField>Email</CheckboxField>
    </Fieldset>
  ),
};
export const FormAllVariations: Story = {
  name: 'Form / All Variations',
  parameters: { nativeComponent: 'form' },
  render: () => (
    <Form>
      <Input accessibilityLabel="Name" />
      <Button onPress={noop}>Submit</Button>
    </Form>
  ),
};
export const GridListAllVariations: Story = {
  name: 'GridList / All Variations',
  parameters: { nativeComponent: 'grid-list' },
  render: () => (
    <GridList label="Photo grid">
      <Text>One</Text>
      <Text>Two</Text>
    </GridList>
  ),
};
export const IconAllVariations: Story = {
  name: 'Icon / All Variations',
  parameters: { nativeComponent: 'icon' },
  render: () => (
    <Row>
      <Icon label="Favourite" size="sm">
        <Text>★</Text>
      </Icon>
      <Icon label="Favourite" size="md">
        <Text>★</Text>
      </Icon>
      <Icon label="Favourite" size="lg">
        <Text>★</Text>
      </Icon>
      <Icon label="Favourite" size="xl">
        <Text>★</Text>
      </Icon>
    </Row>
  ),
};
export const IconButtonAllVariations: Story = {
  name: 'IconButton / All Variations',
  parameters: { nativeComponent: 'icon-button' },
  render: () => (
    <Row>
      <IconButton accessibilityLabel="Add item">+</IconButton>
      <IconButton accessibilityLabel="Disabled add item" isDisabled>
        +
      </IconButton>
    </Row>
  ),
};
export const InputAllVariations: Story = {
  name: 'Input / All Variations',
  parameters: { nativeComponent: 'input' },
  render: () => (
    <Column>
      <Input accessibilityLabel="Small input" placeholder="Small" size="sm" />
      <Input accessibilityLabel="Default input" placeholder="Type here" />
      <Input accessibilityLabel="Large input" placeholder="Large" size="lg" />
      <Input accessibilityLabel="Invalid input" isInvalid value="Invalid" />
      <Input accessibilityLabel="Disabled input" isDisabled value="Disabled" />
    </Column>
  ),
};
export const ListAllVariations: Story = {
  name: 'List / All Variations',
  parameters: { nativeComponent: 'list' },
  render: () => (
    <List label="Messages">
      <Text>First message</Text>
      <Text>Empty states are represented explicitly.</Text>
    </List>
  ),
};
export const ListBoxAllVariations: Story = {
  name: 'ListBox / All Variations',
  parameters: { nativeComponent: 'list-box' },
  render: () => (
    <ListBox label="Options">
      <Text>Selected option</Text>
      <Text>Disabled option</Text>
    </ListBox>
  ),
};
export const PaginationAllVariations: Story = {
  name: 'Pagination / All Variations',
  parameters: { nativeComponent: 'pagination' },
  render: () => <Pagination onPageChange={noop} page={2} totalPages={8} />,
};
export const ProgressBarAllVariations: Story = {
  name: 'ProgressBar / All Variations',
  parameters: { nativeComponent: 'progress-bar' },
  render: () => (
    <Column>
      <ProgressBar label="Empty progress" value={0} />
      <ProgressBar label="Upload progress" value={64} />
      <ProgressBar label="Complete progress" value={100} />
      <ProgressBar label="Right value" labelPosition="right" value={42} />
      <ProgressBar label="Floating value" labelPosition="top-floating" value={72} />
      <ProgressBar isIndeterminate label="Indeterminate" />
    </Column>
  ),
};
export const RadioGroupAllVariations: Story = {
  name: 'RadioGroup / All Variations',
  parameters: { nativeComponent: 'radio-group' },
  render: () => <RadioGroup defaultValue="one" items={radioItems} label="Radio group" />,
};
export const RowAllVariations: Story = {
  name: 'Row / All Variations',
  parameters: { nativeComponent: 'row' },
  render: () => (
    <Row style={{ gap: 8 }}>
      <Text>First</Text>
      <Text>Second</Text>
    </Row>
  ),
};
export const SearchFieldAllVariations: Story = {
  name: 'SearchField / All Variations',
  parameters: { nativeComponent: 'search-field' },
  render: () => (
    <Column gap="3xs">
      <SearchField accessibilityLabel="Search" placeholder="Search" />
      <SearchField
        accessibilityLabel="Inline search"
        placeholder="Inline search"
        variant="inline"
      />
    </Column>
  ),
};
export const SeparatorAllVariations: Story = {
  name: 'Separator / All Variations',
  parameters: { nativeComponent: 'separator' },
  render: () => <Separator />,
};
export const SkeletonAllVariations: Story = {
  name: 'Skeleton / All Variations',
  parameters: { nativeComponent: 'skeleton' },
  render: () => (
    <Column gap="3xs">
      <Skeleton variant="text" />
      <Skeleton variant="rectangular" />
      <Skeleton variant="circular" />
      <Skeleton animation="none" variant="rectangular" />
    </Column>
  ),
};
export const SliderAllVariations: Story = {
  name: 'Slider / All Variations',
  parameters: { nativeComponent: 'slider' },
  render: () => <Slider label="Volume" onValueChange={noop} value={40} />,
};
export const SpinnerAllVariations: Story = {
  name: 'Spinner / All Variations',
  parameters: { nativeComponent: 'spinner' },
  render: () => (
    <Column gap="3xs">
      <Row gap="3xs">
        <Spinner size="sm" />
        <Spinner />
        <Spinner size="lg" />
      </Row>
      <Spinner variant="line" />
      <Spinner variant="dots" />
    </Column>
  ),
};
export const SwitchFieldAllVariations: Story = {
  name: 'SwitchField / All Variations',
  parameters: { nativeComponent: 'switch-field' },
  render: () => (
    <Column>
      <SwitchField label="Enabled switch" value />
      <SwitchField label="Off switch" value={false} />
      <SwitchField isInvalid label="Invalid switch" />
      <SwitchField disabled label="Disabled switch" />
    </Column>
  ),
};
export const TabsAllVariations: Story = {
  name: 'Tabs / All Variations',
  parameters: { nativeComponent: 'tabs' },
  render: () => (
    <Column gap="s">
      <Tabs defaultSelectedKey="one" items={tabItems} variant="underline" />
      <Tabs defaultSelectedKey="one" items={tabItems} variant="pills" />
      <Tabs defaultSelectedKey="one" items={tabItems} variant="enclosed" />
    </Column>
  ),
};
export const TagGroupAllVariations: Story = {
  name: 'TagGroup / All Variations',
  parameters: { nativeComponent: 'tag-group' },
  render: () => (
    <TagGroup label="Topics">
      <Badge>Design</Badge>
      <Badge>Native</Badge>
    </TagGroup>
  ),
};
export const TextAllVariations: Story = {
  name: 'Text / All Variations',
  parameters: { nativeComponent: 'text' },
  render: () => (
    <Column>
      <Text size="l" variant="display">
        Display
      </Text>
      <Text size="l" variant="heading">
        Heading
      </Text>
      <Text size="l" variant="title">
        Title
      </Text>
      <Text variant="label">Label</Text>
      <Text>Body text</Text>
      <Text variant="mono">Monospace text</Text>
      <Text color="muted">Muted text</Text>
      <Text color="accent">Accent text</Text>
    </Column>
  ),
};
export const TextAreaAllVariations: Story = {
  name: 'TextArea / All Variations',
  parameters: { nativeComponent: 'text-area' },
  render: () => <TextArea accessibilityLabel="Message" multiline placeholder="Message" />,
};
export const ToastAllVariations: Story = {
  name: 'Toast / All Variations',
  parameters: { nativeComponent: 'toast' },
  render: () => (
    <Column gap="3xs">
      <Toast>Neutral notification</Toast>
      <Toast variant="success">Changes saved.</Toast>
      <Toast variant="warning">Review this setting.</Toast>
      <Toast variant="danger">Could not save.</Toast>
    </Column>
  ),
};
export const ToggleButtonAllVariations: Story = {
  name: 'ToggleButton / All Variations',
  parameters: { nativeComponent: 'toggle-button' },
  render: () => (
    <Column>
      <ToggleButton defaultSelected onSelectionChange={noop}>
        Selected
      </ToggleButton>
      <ToggleButton onSelectionChange={noop}>Not selected</ToggleButton>
      <ToggleButton isDisabled>Disabled</ToggleButton>
    </Column>
  ),
};
export const ToggleButtonGroupAllVariations: Story = {
  name: 'ToggleButtonGroup / All Variations',
  parameters: { nativeComponent: 'toggle-group' },
  render: () => (
    <ToggleButtonGroup>
      <ToggleButton isSelected onSelectionChange={noop}>
        Bold
      </ToggleButton>
      <ToggleButton isSelected={false} onSelectionChange={noop}>
        Italic
      </ToggleButton>
    </ToggleButtonGroup>
  ),
};
export const ToolbarAllVariations: Story = {
  name: 'Toolbar / All Variations',
  parameters: { nativeComponent: 'toolbar' },
  render: () => (
    <Toolbar>
      <IconButton accessibilityLabel="Undo">↶</IconButton>
      <IconButton accessibilityLabel="Redo">↷</IconButton>
    </Toolbar>
  ),
};
