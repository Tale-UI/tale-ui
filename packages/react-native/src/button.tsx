/* eslint-disable no-nested-ternary -- Button state styling mirrors the CSS selector matrix. */
import * as React from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import {
  alpha,
  controlMetrics,
  disabledOpacity,
  focusRing,
  pendingOpacity,
  transparentColor,
  useInteractionState,
  type ControlSize,
} from './_style-utils';
import { Spinner } from './spinner';
import { Text } from './text';
import { useTaleTheme } from './provider';

export type ButtonVariant =
  | 'primary'
  | 'neutral'
  | 'ghost'
  | 'danger'
  | 'danger-neutral'
  | 'danger-ghost'
  | 'inverse';

export type ButtonProps = Omit<PressableProps, 'children' | 'disabled' | 'style'> & {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ControlSize;
  isDisabled?: boolean;
  isPending?: boolean;
  disabled?: boolean;
  pending?: boolean;
  showTextWhileLoading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isDisabled = false,
  isPending = false,
  disabled: disabledAlias = false,
  pending: pendingAlias = false,
  showTextWhileLoading = false,
  style,
  accessibilityLabel,
  onBlur,
  onFocus,
  onHoverIn,
  onHoverOut,
  ...props
}: ButtonProps) {
  const { tokens } = useTaleTheme();
  const pending = isPending || pendingAlias;
  const disabled = isDisabled || disabledAlias || pending;
  const metrics = controlMetrics(tokens, size);
  const { hovered, focused, interactionHandlers } = useInteractionState({
    onBlur,
    onFocus,
    onHoverIn,
    onHoverOut,
  });
  const variantColors = (
    pressed: boolean,
  ): Readonly<{ backgroundColor: string; borderColor: string; color: string }> => {
    if (variant === 'neutral') {
      return {
        backgroundColor: alpha(tokens.neutral90, pressed ? 0.16 : hovered ? 0.12 : 0.08),
        borderColor: transparentColor(tokens),
        color: tokens.neutral90,
      };
    }
    if (variant === 'ghost') {
      return {
        backgroundColor:
          pressed || hovered
            ? alpha(tokens.neutral100, pressed ? 0.05 : 0.1)
            : transparentColor(tokens),
        borderColor: transparentColor(tokens),
        color: hovered ? tokens.neutral90 : tokens.neutral80,
      };
    }
    if (variant === 'danger') {
      return {
        backgroundColor: pressed ? tokens.error40 : hovered ? tokens.error50 : tokens.error60,
        borderColor: transparentColor(tokens),
        color: tokens.error60Fg,
      };
    }
    if (variant === 'danger-neutral') {
      return {
        backgroundColor: pressed || hovered ? tokens.error20 : tokens.error10,
        borderColor: hovered ? tokens.error40 : tokens.error30,
        color: tokens.error70,
      };
    }
    if (variant === 'danger-ghost') {
      return {
        backgroundColor:
          pressed || hovered
            ? alpha(tokens.error60, pressed ? 0.05 : 0.1)
            : transparentColor(tokens),
        borderColor: transparentColor(tokens),
        color: hovered ? tokens.error80 : tokens.error70,
      };
    }
    if (variant === 'inverse') {
      return {
        backgroundColor: pressed ? tokens.neutral50 : hovered ? tokens.neutral80 : tokens.neutral90,
        borderColor: transparentColor(tokens),
        color: tokens.neutral5,
      };
    }
    return {
      backgroundColor: pressed ? tokens.color40 : hovered ? tokens.color50 : tokens.color60,
      borderColor: transparentColor(tokens),
      color: tokens.color60Fg,
    };
  };
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel ?? (typeof children === 'string' ? children : undefined)
      }
      accessibilityState={{ busy: pending, disabled }}
      disabled={disabled}
      {...props}
      {...interactionHandlers}
      style={({ pressed }) => [
        {
          alignItems: 'center',
          alignSelf: 'flex-start',
          backgroundColor: variantColors(pressed).backgroundColor,
          borderColor: variantColors(pressed).borderColor,
          borderRadius: metrics.radius,
          borderWidth: 1,
          boxShadow:
            variant === 'primary' || variant === 'danger'
              ? `inset 0 0 0 1px ${alpha(tokens.neutralDefault100, 0.18)}, inset 0 -2px 0 ${alpha(tokens.neutralDefault100, 0.05)}, 0 1px 2px ${alpha(tokens.neutralDefault100, 0.05)}`
              : undefined,
          flexDirection: 'row',
          gap: metrics.gap,
          justifyContent: 'center',
          minHeight: metrics.minHeight,
          opacity: disabled ? disabledOpacity : pending ? pendingOpacity : 1,
          paddingHorizontal: metrics.paddingHorizontal,
          paddingVertical: metrics.paddingVertical,
        },
        focused ? focusRing(tokens) : undefined,
        style,
      ]}
    >
      {pending ? (
        <Spinner
          color={variantColors(false).color}
          size="sm"
          style={showTextWhileLoading ? undefined : { position: 'absolute' }}
        />
      ) : null}
      {!pending || showTextWhileLoading ? (
        typeof children === 'string' || typeof children === 'number' ? (
          <Text
            size={size === 'sm' ? 's' : 'm'}
            variant="label"
            style={{
              color: variantColors(false).color,
              lineHeight: metrics.fontSize * tokens.labelLineHeight,
            }}
          >
            {children}
          </Text>
        ) : (
          children
        )
      ) : null}
    </Pressable>
  );
}
