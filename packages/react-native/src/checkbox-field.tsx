/* eslint-disable no-nested-ternary -- Checkbox state colours mirror the CSS selector matrix. */
import * as React from 'react';
import { Pressable, View, type TextStyle } from 'react-native';
import { focusRing, platformFontFamily, useInteractionState } from './_style-utils';
import { Row } from './row';
import { Text } from './text';
import { useTaleTheme } from './provider';

export type CheckboxFieldProps = {
  children: React.ReactNode;
  accessibilityLabel?: string;
  size?: 'sm' | 'md';
  isSelected?: boolean;
  defaultSelected?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  onChange?: (selected: boolean) => void;
};

export function CheckboxField({
  children,
  accessibilityLabel,
  size = 'md',
  isSelected,
  defaultSelected = false,
  isDisabled,
  isInvalid,
  isRequired,
  onSelectionChange,
  onChange,
}: CheckboxFieldProps) {
  const { tokens } = useTaleTheme();
  const [uncontrolled, setUncontrolled] = React.useState(defaultSelected);
  const selected = isSelected ?? uncontrolled;
  const { hovered, focused, interactionHandlers } = useInteractionState();
  const dimension = size === 'sm' ? 14 : 18;
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={
        accessibilityLabel ?? (typeof children === 'string' ? children : undefined)
      }
      accessibilityState={{ checked: selected, disabled: isDisabled }}
      disabled={isDisabled}
      {...interactionHandlers}
      onPress={() => {
        const next = !selected;
        if (isSelected === undefined) {
          setUncontrolled(next);
        }
        onSelectionChange?.(next);
        onChange?.(next);
      }}
      style={{ opacity: isDisabled ? 0.45 : 1 }}
    >
      <Row gap="3xs">
        <View
          style={[
            {
              alignItems: 'center',
              backgroundColor: selected
                ? hovered && !isDisabled
                  ? tokens.color50
                  : tokens.color60
                : hovered && !isDisabled
                  ? tokens.neutral14
                  : tokens.neutral10,
              borderColor: isInvalid
                ? tokens.red60
                : selected
                  ? hovered && !isDisabled
                    ? tokens.color50
                    : tokens.color60
                  : hovered && !isDisabled
                    ? tokens.neutral60
                    : tokens.neutral40,
              borderRadius: tokens.radiusXs,
              borderWidth: 1.5,
              height: dimension,
              justifyContent: 'center',
              width: dimension,
            },
            focused ? focusRing(tokens) : undefined,
          ]}
        >
          {selected ? (
            <Text
              style={{
                color: tokens.color60Fg,
                fontFamily: platformFontFamily(tokens.labelFontFamily),
                fontSize: tokens.labelXsFontSize,
                fontWeight: String(tokens.headingFontWeight) as TextStyle['fontWeight'],
                lineHeight: tokens.labelXsFontSize * tokens.labelLineHeight,
              }}
            >
              ✓
            </Text>
          ) : null}
        </View>
        <Text variant="label">
          {children}
          {isRequired ? <Text style={{ color: tokens.color60 }}> *</Text> : null}
        </Text>
      </Row>
    </Pressable>
  );
}
