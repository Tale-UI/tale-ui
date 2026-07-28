import * as React from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { Spinner } from './spinner';
import { Text } from './text';
import { useTaleTheme } from './provider';

export type ButtonProps = Omit<PressableProps, 'children' | 'disabled' | 'style'> & {
  children?: React.ReactNode;
  isDisabled?: boolean;
  isPending?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  children,
  isDisabled = false,
  isPending = false,
  style,
  accessibilityLabel,
  ...props
}: ButtonProps) {
  const { tokens } = useTaleTheme();
  const disabled = isDisabled || isPending;
  const getOpacity = (pressed: boolean): number => {
    if (disabled) {
      return 0.45;
    }
    return pressed ? 0.8 : 1;
  };
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel ?? (typeof children === 'string' ? children : undefined)
      }
      accessibilityState={{ busy: isPending, disabled }}
      disabled={disabled}
      {...props}
      style={({ pressed }) => [
        {
          alignItems: 'center',
          backgroundColor: tokens.color60,
          borderRadius: tokens.radiusM,
          flexDirection: 'row',
          justifyContent: 'center',
          minHeight: 44,
          opacity: getOpacity(pressed),
          paddingHorizontal: tokens.spaceM,
          paddingVertical: tokens.spaceS,
        },
        style,
      ]}
    >
      {isPending ? <Spinner color={tokens.color60Fg} /> : null}
      <Text style={{ color: tokens.color60Fg }}>{children}</Text>
    </Pressable>
  );
}
