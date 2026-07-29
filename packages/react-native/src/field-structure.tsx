import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { Column } from './column';
import { Text } from './text';
import { useTaleTheme } from './provider';

export type FieldsetProps = ViewProps &
  React.PropsWithChildren<{ legend: string; disabled?: boolean }>;

export function Fieldset({ children, legend, disabled, style, ...props }: FieldsetProps) {
  const { tokens } = useTaleTheme();
  return (
    <Column
      accessible
      accessibilityLabel={legend}
      gap="s"
      {...props}
      style={[{ marginBottom: tokens.spaceM, opacity: disabled ? 0.45 : 1 }, style]}
    >
      <Text accessibilityRole="header" variant="label" style={{ color: tokens.neutral90 }}>
        {legend}
      </Text>
      {children}
    </Column>
  );
}

export type FormProps = ViewProps & React.PropsWithChildren;

export function Form({ style, ...props }: FormProps) {
  const { tokens } = useTaleTheme();
  return (
    <View
      accessibilityLabel="Form"
      {...props}
      style={[{ flexDirection: 'column', gap: tokens.spaceS, width: '100%' }, style]}
    />
  );
}

export type CheckboxGroupProps = ViewProps & {
  label?: string;
  description?: string;
  orientation?: 'horizontal' | 'vertical';
};

export function CheckboxGroup({
  label = 'Checkbox group',
  description,
  orientation = 'vertical',
  style,
  children,
  ...props
}: CheckboxGroupProps) {
  const { tokens } = useTaleTheme();
  return (
    <View
      accessibilityLabel={label}
      {...props}
      style={[
        {
          flexDirection: orientation === 'horizontal' ? 'row' : 'column',
          flexWrap: orientation === 'horizontal' ? 'wrap' : 'nowrap',
          gap: orientation === 'horizontal' ? tokens.spaceM : tokens.space3xs,
        },
        style,
      ]}
    >
      {children}
      {description ? (
        <Text size="s" style={{ color: tokens.neutral60 }}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}
