import { Form } from '@tale-ui/react/form';
import { Fieldset } from '@tale-ui/react/fieldset';
import { TextField } from '@tale-ui/react/text-field';
import { Select } from '@tale-ui/react/select';
import { Checkbox } from '@tale-ui/react/checkbox';
import { Button } from '@tale-ui/react/button';
import { Icon } from '@tale-ui/react/icon';
import { Row } from '@tale-ui/react/row';
import { Check } from 'lucide-react';

export function Example() {
  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault(); /* handle submit */
      }}
    >
      <Fieldset.Root>
        <Fieldset.Legend>Personal Information</Fieldset.Legend>

        <TextField.Root isRequired>
          <TextField.Label>Full Name</TextField.Label>
          <TextField.Input placeholder="Jane Doe" />
          <TextField.Description>As it appears on your ID.</TextField.Description>
          <TextField.ErrorMessage>Name is required.</TextField.ErrorMessage>
        </TextField.Root>

        <TextField.Root isRequired type="email">
          <TextField.Label>Email</TextField.Label>
          <TextField.Input placeholder="jane@example.com" />
          <TextField.ErrorMessage>Enter a valid email address.</TextField.ErrorMessage>
        </TextField.Root>

        <Select.Root isRequired placeholder="Select a country">
          <Select.Label>Country</Select.Label>
          <Select.Trigger />
          <Select.Popover>
            <Select.ListBox>
              <Select.Item id="us">United States</Select.Item>
              <Select.Item id="gb">United Kingdom</Select.Item>
              <Select.Item id="ca">Canada</Select.Item>
              <Select.Item id="au">Australia</Select.Item>
            </Select.ListBox>
          </Select.Popover>
        </Select.Root>
      </Fieldset.Root>

      <Checkbox.Root value="terms" isRequired>
        <Checkbox.Indicator>
          <Icon icon={Check} size="sm" />
        </Checkbox.Indicator>
        I agree to the terms of service
      </Checkbox.Root>

      <Row gap="xs" style={{ marginTop: 'var(--space-s)' }}>
        <Button type="submit" variant="primary">
          Sign Up
        </Button>
        <Button type="reset" variant="ghost">
          Reset
        </Button>
      </Row>
    </Form>
  );
}
