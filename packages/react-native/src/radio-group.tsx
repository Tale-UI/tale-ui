import * as React from 'react';
import { Pressable } from 'react-native';
import { Column } from './column';
import { Row } from './row';
import { Text } from './text';

export type RadioItem = Readonly<{ value: string; label: string; isDisabled?: boolean }>;
export type RadioGroupProps = {
  label: string;
  items: readonly RadioItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export function RadioGroup({ label, items, value, defaultValue, onValueChange }: RadioGroupProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const selected = value ?? uncontrolled;
  return (
    <Column accessible={false} accessibilityLabel={label}>
      <Text>{label}</Text>
      {items.map((item) => (
        <Pressable
          accessibilityLabel={item.label}
          accessibilityRole="radio"
          accessibilityState={{ checked: selected === item.value, disabled: item.isDisabled }}
          disabled={item.isDisabled}
          key={item.value}
          onPress={() => {
            if (value === undefined) {
              setUncontrolled(item.value);
            }
            onValueChange?.(item.value);
          }}
        >
          <Row>
            <Text>{selected === item.value ? '◉' : '○'}</Text>
            <Text>{item.label}</Text>
          </Row>
        </Pressable>
      ))}
    </Column>
  );
}
