import * as React from 'react';
import { Column } from './column';
import { Text } from './text';
import { useTaleTheme } from './provider';

export type FieldProps = React.PropsWithChildren<{
  label: string;
  description?: string;
  errorMessage?: string;
  isRequired?: boolean;
}>;

export function Field({ children, label, description, errorMessage, isRequired }: FieldProps) {
  const { tokens } = useTaleTheme();
  return (
    <Column accessible={false} gap="3xs" style={{ width: '100%' }}>
      <Text
        size="s"
        variant="label"
        style={{ color: errorMessage ? tokens.red60 : tokens.neutral70 }}
      >
        {label}
        {isRequired ? <Text style={{ color: tokens.color60 }}> *</Text> : ''}
      </Text>
      {children}
      {description ? (
        <Text size="s" style={{ color: tokens.neutral60 }}>
          {description}
        </Text>
      ) : null}
      {errorMessage ? (
        <Text
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          size="s"
          style={{ color: tokens.red60 }}
        >
          {errorMessage}
        </Text>
      ) : null}
    </Column>
  );
}
