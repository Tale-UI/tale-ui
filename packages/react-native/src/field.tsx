import * as React from 'react';
import { Column } from './column';
import { Text } from './text';

export type FieldProps = React.PropsWithChildren<{
  label: string;
  description?: string;
  errorMessage?: string;
  isRequired?: boolean;
}>;

export function Field({ children, label, description, errorMessage, isRequired }: FieldProps) {
  return (
    <Column accessible={false}>
      <Text>
        {label}
        {isRequired ? ' (required)' : ''}
      </Text>
      {children}
      {description ? <Text>{description}</Text> : null}
      {errorMessage ? (
        <Text accessibilityLiveRegion="polite" accessibilityRole="alert">
          {errorMessage}
        </Text>
      ) : null}
    </Column>
  );
}
