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

const meta = {
  title: 'Registry fixtures',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => {};
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
  render: () => (
    <AlertDialog isOpen={false} onOpenChange={noop} title="Delete draft">
      <Text>This cannot be undone.</Text>
    </AlertDialog>
  ),
};
export const BadgeAllVariations: Story = {
  name: 'Badge / All Variations',
  parameters: { nativeComponent: 'badge' },
  render: () => (
    <Row style={{ gap: 8 }}>
      <Badge>New</Badge>
      <Badge>Long badge label</Badge>
    </Row>
  ),
};
export const BannerAllVariations: Story = {
  name: 'Banner / All Variations',
  parameters: { nativeComponent: 'banner' },
  render: () => <Banner title="Saved">Available offline.</Banner>,
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
    <Column style={{ gap: 8 }}>
      <Button onPress={noop}>Default</Button>
      <Button isDisabled>Disabled</Button>
      <Button isPending>Pending</Button>
      <Button onPress={noop}>A button with a deliberately long label</Button>
    </Column>
  ),
};
export const CardAllVariations: Story = {
  name: 'Card / All Variations',
  parameters: { nativeComponent: 'card' },
  render: () => (
    <Card>
      <Text>Card content</Text>
    </Card>
  ),
};
export const CheckboxFieldAllVariations: Story = {
  name: 'CheckboxField / All Variations',
  parameters: { nativeComponent: 'checkbox-field' },
  render: () => (
    <Column>
      <CheckboxField>Unchecked</CheckboxField>
      <CheckboxField isSelected>Checked</CheckboxField>
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
  render: () => (
    <Dialog isOpen={false} onOpenChange={noop} title="Account settings">
      <Text>Dialog content</Text>
    </Dialog>
  ),
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
  render: () => (
    <Drawer isOpen={false} label="Navigation drawer" onOpenChange={noop}>
      <Text>Drawer content</Text>
    </Drawer>
  ),
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
      <Icon label="Favourite" />
      <Icon />
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
      <Input accessibilityLabel="Default input" placeholder="Type here" />
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
    </Column>
  ),
};
export const RadioFieldAllVariations: Story = {
  name: 'RadioField / All Variations',
  parameters: { nativeComponent: 'radio-field' },
  render: () => <RadioField defaultValue="one" items={radioItems} label="Radio field" />,
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
  render: () => <SearchField accessibilityLabel="Search" placeholder="Search" />,
};
export const SeparatorAllVariations: Story = {
  name: 'Separator / All Variations',
  parameters: { nativeComponent: 'separator' },
  render: () => <Separator />,
};
export const SliderAllVariations: Story = {
  name: 'Slider / All Variations',
  parameters: { nativeComponent: 'slider' },
  render: () => <Slider label="Volume" onValueChange={noop} value={40} />,
};
export const SpinnerAllVariations: Story = {
  name: 'Spinner / All Variations',
  parameters: { nativeComponent: 'spinner' },
  render: () => <Spinner />,
};
export const SwitchFieldAllVariations: Story = {
  name: 'SwitchField / All Variations',
  parameters: { nativeComponent: 'switch-field' },
  render: () => (
    <Column>
      <SwitchField label="Enabled switch" value />
      <SwitchField disabled label="Disabled switch" />
    </Column>
  ),
};
export const TabsAllVariations: Story = {
  name: 'Tabs / All Variations',
  parameters: { nativeComponent: 'tabs' },
  render: () => <Tabs items={tabItems} onSelectionChange={noop} selectedKey="one" />,
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
      <Text>Default text</Text>
      <Text>Long text wraps while respecting the device text scale and locale.</Text>
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
  render: () => <Toast label="Saved notification">Changes saved.</Toast>,
};
export const ToggleButtonAllVariations: Story = {
  name: 'ToggleButton / All Variations',
  parameters: { nativeComponent: 'toggle-button' },
  render: () => (
    <Column>
      <ToggleButton isSelected onSelectionChange={noop}>
        Selected
      </ToggleButton>
      <ToggleButton isSelected={false} onSelectionChange={noop}>
        Not selected
      </ToggleButton>
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
