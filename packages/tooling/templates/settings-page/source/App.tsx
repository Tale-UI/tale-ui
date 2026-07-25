import { Form } from '@tale-ui/react/form';
import { Fieldset } from '@tale-ui/react/fieldset';
import { Switch } from '@tale-ui/react/switch';
import { Radio } from '@tale-ui/react/radio';
import { TextField } from '@tale-ui/react/text-field';
import { Select } from '@tale-ui/react/select';
import { Button } from '@tale-ui/react/button';
import { Separator } from '@tale-ui/react/separator';
import { Row } from '@tale-ui/react/row';
import { Text } from '@tale-ui/react/text';

export function Example() {
  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault(); /* save settings */
      }}
    >
      <Text as="h2" variant="heading" size="m">
        Settings
      </Text>

      <Fieldset.Root>
        <Fieldset.Legend>Notifications</Fieldset.Legend>

        <Switch.Root defaultSelected>
          <Switch.Thumb />
          Email notifications
        </Switch.Root>

        <Switch.Root>
          <Switch.Thumb />
          Push notifications
        </Switch.Root>

        <Switch.Root defaultSelected>
          <Switch.Thumb />
          Weekly digest
        </Switch.Root>
      </Fieldset.Root>

      <Separator />

      <Fieldset.Root>
        <Fieldset.Legend>Appearance</Fieldset.Legend>

        <Radio.Group defaultValue="system">
          <Radio.Root value="light">
            <Radio.Indicator />
            Light
          </Radio.Root>
          <Radio.Root value="dark">
            <Radio.Indicator />
            Dark
          </Radio.Root>
          <Radio.Root value="system">
            <Radio.Indicator />
            System
          </Radio.Root>
        </Radio.Group>

        <Select.Root defaultValue="comfortable" placeholder="Select density">
          <Select.Label>Display Density</Select.Label>
          <Select.Trigger />
          <Select.Popover>
            <Select.ListBox>
              <Select.Item id="compact">Compact</Select.Item>
              <Select.Item id="comfortable">Comfortable</Select.Item>
              <Select.Item id="spacious">Spacious</Select.Item>
            </Select.ListBox>
          </Select.Popover>
        </Select.Root>
      </Fieldset.Root>

      <Separator />

      <Fieldset.Root>
        <Fieldset.Legend>Profile</Fieldset.Legend>

        <TextField.Root>
          <TextField.Label>Display Name</TextField.Label>
          <TextField.Input defaultValue="Jane Doe" />
        </TextField.Root>

        <TextField.Root type="email">
          <TextField.Label>Email</TextField.Label>
          <TextField.Input defaultValue="jane@example.com" />
        </TextField.Root>
      </Fieldset.Root>

      <Separator />

      <Row gap="xs" justify="end">
        <Button type="reset" variant="ghost">
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Changes
        </Button>
      </Row>
    </Form>
  );
}
