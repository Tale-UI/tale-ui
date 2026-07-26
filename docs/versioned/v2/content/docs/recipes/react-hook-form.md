# React Hook Form Integration

Integrating React Hook Form with Tale UI compound parts using `Controller`. This pattern gives you RHF's form state management while keeping Tale UI's accessible, compound-part components.

> **Note:** `react-hook-form` is not included in Tale UI. Install it separately: `npm install react-hook-form`.

## Components Used

- `Form` from `@tale-ui/react/form`
- `Fieldset` from `@tale-ui/react/fieldset`
- `TextField` from `@tale-ui/react/text-field`
- `Select` from `@tale-ui/react/select`
- `Checkbox` from `@tale-ui/react/checkbox`
- `Switch` from `@tale-ui/react/switch`
- `Button` from `@tale-ui/react/button`
- `Icon` from `@tale-ui/react/icon`
- `Row` from `@tale-ui/react/row`
- `Check` from `lucide-react`
- `Controller`, `useForm` from `react-hook-form`

## Code

```tsx
import { Form } from '@tale-ui/react/form';
import { Fieldset } from '@tale-ui/react/fieldset';
import { TextField } from '@tale-ui/react/text-field';
import { Select } from '@tale-ui/react/select';
import { Checkbox } from '@tale-ui/react/checkbox';
import { Switch } from '@tale-ui/react/switch';
import { Button } from '@tale-ui/react/button';
import { Icon } from '@tale-ui/react/icon';
import { Row } from '@tale-ui/react/row';
import { Check } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

interface FormValues {
  name: string;
  email: string;
  country: string;
  newsletter: boolean;
  terms: boolean;
}

function SignUpForm() {
  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { name: '', email: '', country: '', newsletter: false, terms: false },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset.Root>
        <Fieldset.Legend>Account Details</Fieldset.Legend>

        {/* TextField — map value/onChange/onBlur/ref directly */}
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Name is required.' }}
          render={({ field, fieldState }) => (
            <TextField.Root
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              isInvalid={fieldState.invalid}
              isRequired
            >
              <TextField.Label>Full Name</TextField.Label>
              <TextField.Input placeholder="Jane Doe" />
              <TextField.ErrorMessage>{fieldState.error?.message}</TextField.ErrorMessage>
            </TextField.Root>
          )}
        />

        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email is required.',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email.' },
          }}
          render={({ field, fieldState }) => (
            <TextField.Root
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              isInvalid={fieldState.invalid}
              isRequired
              type="email"
            >
              <TextField.Label>Email</TextField.Label>
              <TextField.Input placeholder="jane@example.com" />
              <TextField.ErrorMessage>{fieldState.error?.message}</TextField.ErrorMessage>
            </TextField.Root>
          )}
        />

        {/* Select — use selectedKey / onSelectionChange (React Aria naming) */}
        <Controller
          name="country"
          control={control}
          rules={{ required: 'Country is required.' }}
          render={({ field, fieldState }) => (
            <Select.Root
              selectedKey={field.value}
              onSelectionChange={(key) => field.onChange(String(key))}
              onBlur={field.onBlur}
              isInvalid={fieldState.invalid}
              isRequired
              placeholder="Select a country"
            >
              <Select.Label>Country</Select.Label>
              <Select.Trigger />
              <Select.Popover>
                <Select.ListBox>
                  <Select.Item id="us">United States</Select.Item>
                  <Select.Item id="gb">United Kingdom</Select.Item>
                  <Select.Item id="ca">Canada</Select.Item>
                </Select.ListBox>
              </Select.Popover>
            </Select.Root>
          )}
        />
      </Fieldset.Root>

      {/* Switch — use isSelected / onChange */}
      <Controller
        name="newsletter"
        control={control}
        render={({ field }) => (
          <Switch.Root isSelected={field.value} onChange={field.onChange}>
            Subscribe to newsletter
          </Switch.Root>
        )}
      />

      {/* Checkbox — use isSelected / onChange */}
      <Controller
        name="terms"
        control={control}
        rules={{ validate: (v) => v || 'You must accept the terms.' }}
        render={({ field, fieldState }) => (
          <Checkbox.Root
            isSelected={field.value}
            onChange={field.onChange}
            isInvalid={fieldState.invalid}
            isRequired
          >
            <Checkbox.Indicator>
              <Icon icon={Check} size="sm" />
            </Checkbox.Indicator>
            I agree to the terms of service
          </Checkbox.Root>
        )}
      />

      <Row gap="xs" style={{ marginTop: 'var(--space-s)' }}>
        <Button type="submit" variant="primary" isDisabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Submitting…' : 'Sign Up'}
        </Button>
        <Button type="reset" variant="ghost">
          Reset
        </Button>
      </Row>
    </Form>
  );
}
```

## Customization Points

- **Prop mappings by component type:**
  - `TextField` — `value` / `onChange` / `onBlur` / `ref` map directly
  - `Select` — use `selectedKey` / `onSelectionChange` (React Aria naming, not `value` / `onChange`)
  - `Checkbox`, `Switch` — use `isSelected` / `onChange`
  - `RadioGroup` — use `value` / `onChange` (same as TextField)
- `isInvalid={fieldState.invalid}` on any field enables React Aria's error styling and shows `ErrorMessage` parts.
- `formState.isSubmitting` can be passed to `Button`'s `isDisabled` prop.
- Replace the `rules` object with a schema resolver (e.g., `@hookform/resolvers/zod`) for Zod-based validation.
- `react-hook-form` must be installed separately — it is NOT a Tale UI dependency.
