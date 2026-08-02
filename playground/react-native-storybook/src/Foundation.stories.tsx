import { Badge } from '@tale-ui/react-native/badge';
import { Button } from '@tale-ui/react-native/button';
import { Banner } from '@tale-ui/react-native/banner';
import { CheckboxField } from '@tale-ui/react-native/checkbox-field';
import { Card } from '@tale-ui/react-native/card';
import { Column } from '@tale-ui/react-native/column';
import { Dialog } from '@tale-ui/react-native/dialog';
import { Disclosure } from '@tale-ui/react-native/disclosure';
import { Field } from '@tale-ui/react-native/field';
import { Icon } from '@tale-ui/react-native/icon';
import { IconButton } from '@tale-ui/react-native/icon-button';
import { Input } from '@tale-ui/react-native/input';
import { ProgressBar } from '@tale-ui/react-native/progress-bar';
import { Row } from '@tale-ui/react-native/row';
import { SearchField } from '@tale-ui/react-native/search-field';
import { Separator } from '@tale-ui/react-native/separator';
import { Skeleton } from '@tale-ui/react-native/skeleton';
import { Spinner } from '@tale-ui/react-native/spinner';
import { SwitchField } from '@tale-ui/react-native/switch-field';
import { Tabs } from '@tale-ui/react-native/tabs';
import { Text } from '@tale-ui/react-native/text';
import { TextArea } from '@tale-ui/react-native/text-area';
import type { Meta, StoryObj } from '@storybook/react-native';

const meta = {
  title: 'Foundation/All Variations',
  component: Button,
  parameters: {
    nativeCoverage: [
      '@tale-ui/react-native/accordion',
      '@tale-ui/react-native/alert-dialog',
      '@tale-ui/react-native/breadcrumbs',
      '@tale-ui/react-native/checkbox-group',
      '@tale-ui/react-native/drawer',
      '@tale-ui/react-native/fieldset',
      '@tale-ui/react-native/form',
      '@tale-ui/react-native/grid-list',
      '@tale-ui/react-native/list',
      '@tale-ui/react-native/list-box',
      '@tale-ui/react-native/pagination',
      '@tale-ui/react-native/radio-group',
      '@tale-ui/react-native/slider',
      '@tale-ui/react-native/tag-group',
      '@tale-ui/react-native/toast',
      '@tale-ui/react-native/toggle-button',
      '@tale-ui/react-native/toggle-group',
      '@tale-ui/react-native/toolbar',
    ],
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariations: Story = {
  render: () => (
    <Column style={{ gap: 16 }}>
      <Text>Text with dynamic type support</Text>
      <Icon accessibilityLabel="Decorative icon preview" />
      <Row style={{ gap: 8 }}>
        <Button onPress={() => {}}>Continue</Button>
        <Button isDisabled>Disabled</Button>
        <Button isPending>Pending</Button>
        <IconButton accessibilityLabel="Add item">+</IconButton>
      </Row>
      <Card>
        <Badge>New</Badge>
        <Separator />
        <ProgressBar value={64} label="Upload progress" />
        <Spinner />
        <Skeleton style={{ width: 160 }} />
      </Card>
      <Input accessibilityLabel="Name" placeholder="Name" />
      <Field label="Email" description="Used for account notifications">
        <Input accessibilityLabel="Email" inputMode="email" />
      </Field>
      <SearchField accessibilityLabel="Search" placeholder="Search" />
      <TextArea accessibilityLabel="Message" placeholder="Message" />
      <CheckboxField>Send me updates</CheckboxField>
      <SwitchField label="Reduce notifications" />
      <Disclosure title="More information">
        <Text>Native disclosure content</Text>
      </Disclosure>
      <Tabs
        items={[
          { id: 'one', label: 'One', content: <Text>First panel</Text> },
          { id: 'two', label: 'Two', content: <Text>Second panel</Text> },
        ]}
        onSelectionChange={() => {}}
        selectedKey="one"
      />
      <Dialog isOpen={false} onOpenChange={() => {}} title="Example dialog">
        <Text>Dialog content</Text>
      </Dialog>
      <Banner title="Saved">Your changes are available offline.</Banner>
    </Column>
  ),
};
