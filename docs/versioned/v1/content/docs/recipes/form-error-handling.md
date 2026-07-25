# Form Error Handling

Field-level validation errors with `isInvalid` and `ErrorMessage`.

## Pattern

```tsx
import { useState } from 'react';
import { Form } from '@tale-ui/react/form';
import { TextField } from '@tale-ui/react/text-field';
import { Button } from '@tale-ui/react/button';

interface FormErrors {
  name?: string;
  email?: string;
  role?: string;
}

export function ValidatedForm() {
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(formData: FormData): FormErrors {
    const errs: FormErrors = {};
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    if (!name?.trim()) errs.name = 'Name is required.';
    if (!email?.includes('@')) errs.email = 'Enter a valid email address.';
    return errs;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      // Submit to API
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <TextField.Root name="name" isRequired isInvalid={!!errors.name}>
        <TextField.Label>Name</TextField.Label>
        <TextField.Input />
        <TextField.ErrorMessage>{errors.name}</TextField.ErrorMessage>
      </TextField.Root>

      <TextField.Root name="email" isRequired isInvalid={!!errors.email}>
        <TextField.Label>Email</TextField.Label>
        <TextField.Input type="email" />
        <TextField.Description>We will never share your email.</TextField.Description>
        <TextField.ErrorMessage>{errors.email}</TextField.ErrorMessage>
      </TextField.Root>

      <Button type="submit" variant="primary">
        Submit
      </Button>
    </Form>
  );
}
```

## Key points

- Set `isInvalid` on the `TextField.Root` (or other field root) to show error styling.
- `ErrorMessage` only renders when `isInvalid` is true on the parent root.
- Use `isRequired` to mark fields as required (adds `aria-required`).
- Clear errors on resubmit by running validation fresh each time.
