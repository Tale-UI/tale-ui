import * as React from 'react';
import { Pressable } from 'react-native';
import { Row } from './row';
import { Text } from './text';

export type CheckboxFieldProps = {
  children: React.ReactNode;
  accessibilityLabel?: string;
  isSelected?: boolean;
  defaultSelected?: boolean;
  isDisabled?: boolean;
  onSelectionChange?: (selected: boolean) => void;
};

export function CheckboxField({
  children,
  accessibilityLabel,
  isSelected,
  defaultSelected = false,
  isDisabled,
  onSelectionChange,
}: CheckboxFieldProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultSelected);
  const selected = isSelected ?? uncontrolled;
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={
        accessibilityLabel ?? (typeof children === 'string' ? children : undefined)
      }
      accessibilityState={{ checked: selected, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={() => {
        const next = !selected;
        if (isSelected === undefined) {
          setUncontrolled(next);
        }
        onSelectionChange?.(next);
      }}
    >
      <Row>
        <Text>{selected ? '☑' : '☐'}</Text>
        <Text>{children}</Text>
      </Row>
    </Pressable>
  );
}
