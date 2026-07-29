/* eslint-disable no-nested-ternary -- Radio state colours mirror the CSS selector matrix. */
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { focusRing, useInteractionState } from './_style-utils';
import { Column } from './column';
import { Row } from './row';
import { Text } from './text';
import { useTaleTheme } from './provider';

export type RadioItem = Readonly<{
  value: string;
  label: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
}>;
export type RadioGroupProps = {
  label: string;
  items: readonly RadioItem[];
  size?: 'sm' | 'md';
  orientation?: 'horizontal' | 'vertical';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

function RadioOption({
  item,
  selected,
  size,
  onPress,
}: {
  item: RadioItem;
  selected: boolean;
  size: 'sm' | 'md';
  onPress: () => void;
}) {
  const { tokens } = useTaleTheme();
  const { hovered, focused, interactionHandlers } = useInteractionState();
  const dimension = size === 'sm' ? tokens.spaceXs : 18;
  return (
    <Pressable
      accessibilityLabel={item.label}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled: item.isDisabled }}
      disabled={item.isDisabled}
      onPress={onPress}
      {...interactionHandlers}
      style={{ opacity: item.isDisabled ? 0.45 : 1 }}
    >
      <Row gap="3xs">
        <View
          style={[
            {
              alignItems: 'center',
              backgroundColor: hovered && !selected ? tokens.neutral14 : tokens.neutral10,
              borderColor: item.isInvalid
                ? tokens.red60
                : selected
                  ? hovered
                    ? tokens.color50
                    : tokens.color60
                  : hovered
                    ? tokens.neutral60
                    : tokens.neutral40,
              borderRadius: tokens.radiusFull,
              borderWidth: 1.5,
              height: dimension,
              justifyContent: 'center',
              width: dimension,
            },
            focused ? focusRing(tokens) : undefined,
          ]}
        >
          {selected ? (
            <View
              style={{
                backgroundColor: tokens.color60,
                borderRadius: tokens.radiusFull,
                height: size === 'sm' ? 6 : 8,
                width: size === 'sm' ? 6 : 8,
              }}
            />
          ) : null}
        </View>
        <Text variant="label">{item.label}</Text>
      </Row>
    </Pressable>
  );
}

export function RadioGroup({
  label,
  items,
  size = 'md',
  orientation = 'vertical',
  value,
  defaultValue,
  onValueChange,
}: RadioGroupProps) {
  const { tokens } = useTaleTheme();
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const selected = value ?? uncontrolled;
  return (
    <Column accessible={false} accessibilityLabel={label} gap="3xs">
      <Text variant="label" style={{ color: tokens.neutral90 }}>
        {label}
      </Text>
      <View
        style={{
          flexDirection: orientation === 'horizontal' ? 'row' : 'column',
          flexWrap: orientation === 'horizontal' ? 'wrap' : 'nowrap',
          gap: orientation === 'horizontal' ? tokens.spaceM : tokens.space3xs,
        }}
      >
        {items.map((item) => (
          <RadioOption
            item={item}
            key={item.value}
            onPress={() => {
              if (value === undefined) {
                setUncontrolled(item.value);
              }
              onValueChange?.(item.value);
            }}
            selected={selected === item.value}
            size={size}
          />
        ))}
      </View>
    </Column>
  );
}
