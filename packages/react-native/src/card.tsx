/* eslint-disable no-nested-ternary -- Card variant/state styling mirrors the CSS selector matrix. */
import * as React from 'react';
import {
  Pressable,
  View,
  type GestureResponderEvent,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import {
  disabledOpacity,
  focusRing,
  insetSelectionRing,
  pendingOpacity,
  shadow,
  transparentColor,
  useInteractionState,
} from './_style-utils';
import { useTaleTheme } from './provider';

export type CardVariant = 'elevated' | 'outlined' | 'filled';
export type CardPadding = 'sm' | 'md' | 'lg';
export type CardProps = Omit<ViewProps, 'style'> & {
  variant?: CardVariant;
  padding?: CardPadding;
  isSelected?: boolean;
  isDisabled?: boolean;
  isPending?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
};

export function Card({
  variant = 'outlined',
  padding = 'md',
  isSelected = false,
  isDisabled = false,
  isPending = false,
  onPress,
  style,
  children,
  ...props
}: CardProps) {
  const { tokens } = useTaleTheme();
  const { hovered, focused, interactionHandlers } = useInteractionState();
  const baseStyle: ViewStyle = {
    backgroundColor: variant === 'filled' ? tokens.neutral10 : tokens.neutral5,
    borderColor: variant === 'outlined' ? tokens.neutral22 : transparentColor(tokens),
    borderRadius: tokens.radiusL,
    borderWidth: variant === 'outlined' ? 1 : 0,
    boxShadow: variant === 'elevated' ? shadow(tokens).m : undefined,
    flexDirection: 'column',
    opacity: isDisabled ? disabledOpacity : isPending ? pendingOpacity : 1,
    overflow: 'hidden',
    padding: padding === 'sm' ? tokens.spaceXs : padding === 'lg' ? tokens.spaceM : tokens.spaceS,
  };
  const interactiveStyle = (pressed: boolean): ViewStyle => {
    if (!onPress || isDisabled || isPending) {
      return {};
    }
    if (variant === 'outlined') {
      return {
        backgroundColor: pressed ? tokens.neutral18 : hovered ? tokens.neutral10 : tokens.neutral5,
        borderColor: pressed ? tokens.neutral40 : hovered ? tokens.neutral30 : tokens.neutral22,
      };
    }
    if (variant === 'elevated') {
      return {
        backgroundColor: pressed ? tokens.neutral14 : hovered ? tokens.neutral10 : tokens.neutral5,
        boxShadow: pressed ? shadow(tokens).s : hovered ? shadow(tokens).l : shadow(tokens).m,
      };
    }
    return {
      backgroundColor: pressed ? tokens.neutral18 : hovered ? tokens.neutral14 : tokens.neutral10,
    };
  };
  const selectedStyle = isSelected
    ? variant === 'outlined'
      ? insetSelectionRing(tokens.color60, 1)
      : insetSelectionRing(tokens.color60, 2)
    : undefined;
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ busy: isPending, disabled: isDisabled, selected: isSelected }}
        disabled={isDisabled || isPending}
        onPress={onPress}
        {...props}
        {...interactionHandlers}
        style={({ pressed }) => [
          baseStyle,
          interactiveStyle(pressed),
          selectedStyle,
          focused ? focusRing(tokens) : undefined,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View {...props} style={[baseStyle, selectedStyle, style]}>
      {children}
    </View>
  );
}
