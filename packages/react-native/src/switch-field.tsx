/* eslint-disable no-nested-ternary -- Switch state colours mirror the CSS selector matrix. */
import * as React from 'react';
import { Pressable, View, type PressableProps } from 'react-native';
import { focusRing, shadow, useInteractionState } from './_style-utils';
import { Row } from './row';
import { Text } from './text';
import { useTaleTheme } from './provider';

export type SwitchFieldProps = Omit<PressableProps, 'children' | 'disabled' | 'onPress'> & {
  label: string;
  value?: boolean;
  defaultValue?: boolean;
  disabled?: boolean;
  isSelected?: boolean;
  defaultSelected?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  onValueChange?: (selected: boolean) => void;
  onChange?: (selected: boolean) => void;
};

export function SwitchField({
  label,
  value,
  defaultValue,
  disabled,
  isSelected,
  defaultSelected,
  isDisabled,
  isInvalid,
  isRequired,
  onValueChange,
  onChange,
  style,
  ...props
}: SwitchFieldProps) {
  const { tokens } = useTaleTheme();
  const controlled = isSelected ?? value;
  const [uncontrolled, setUncontrolled] = React.useState(defaultSelected ?? defaultValue ?? false);
  const selected = controlled ?? uncontrolled;
  const unavailable = isDisabled ?? disabled ?? false;
  const { hovered, focused, interactionHandlers } = useInteractionState();
  const update = () => {
    const next = !selected;
    if (controlled === undefined) {
      setUncontrolled(next);
    }
    onValueChange?.(next);
    onChange?.(next);
  };
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="switch"
      accessibilityState={{ checked: selected, disabled: unavailable }}
      disabled={unavailable}
      onPress={update}
      {...props}
      {...interactionHandlers}
      style={({ pressed }) => [
        { opacity: unavailable ? 0.45 : 1 },
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
    >
      <Row gap="3xs">
        <View
          style={[
            {
              backgroundColor: selected
                ? hovered
                  ? tokens.color50
                  : tokens.color60
                : hovered
                  ? tokens.neutral26
                  : tokens.neutral20,
              borderColor: isInvalid
                ? tokens.red60
                : selected
                  ? hovered
                    ? tokens.color50
                    : tokens.color60
                  : hovered
                    ? tokens.neutral50
                    : tokens.neutral30,
              borderRadius: tokens.radiusFull,
              borderWidth: 1.5,
              height: 22,
              justifyContent: 'center',
              width: 40,
            },
            focused ? focusRing(tokens) : undefined,
          ]}
        >
          <View
            style={{
              backgroundColor: selected ? tokens.color60Fg : tokens.neutral80,
              borderRadius: tokens.radiusFull,
              boxShadow: shadow(tokens).s,
              height: 14,
              transform: [{ translateX: selected ? 21 : 4 }],
              width: 14,
            }}
          />
        </View>
        <Text variant="label" style={{ color: tokens.neutral80 }}>
          {label}
          {isRequired ? <Text style={{ color: tokens.color60 }}> *</Text> : null}
        </Text>
      </Row>
    </Pressable>
  );
}
