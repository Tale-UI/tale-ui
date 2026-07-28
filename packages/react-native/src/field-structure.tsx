import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { Column } from './column';
import { Text } from './text';

export type FieldsetProps = ViewProps & React.PropsWithChildren<{ legend: string }>;

export function Fieldset({ children, legend, ...props }: FieldsetProps) {
  return (
    <Column accessible accessibilityLabel={legend} {...props}>
      <Text accessibilityRole="header">{legend}</Text>
      {children}
    </Column>
  );
}

export type FormProps = ViewProps & React.PropsWithChildren;

export function Form(props: FormProps) {
  return <View accessibilityLabel="Form" {...props} />;
}

export function CheckboxGroup(props: ViewProps) {
  return <Column accessibilityLabel="Checkbox group" {...props} />;
}
