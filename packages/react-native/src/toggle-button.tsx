/* eslint-disable no-nested-ternary -- Toggle state colours mirror the CSS selector matrix. */
import * as React from 'react';
import { Pressable, View, type PressableProps } from 'react-native';
import {
  controlMetrics,
  disabledOpacity,
  focusRing,
  transparentColor,
  useInteractionState,
  type ControlSize,
} from './_style-utils';
import { useTaleTheme } from './provider';
import { Text } from './text';

const ToggleGroupContext = React.createContext(false);

export type ToggleButtonProps = Omit<PressableProps, 'children' | 'disabled'> & {
  children?: React.ReactNode;
  size?: ControlSize;
  isSelected?: boolean;
  defaultSelected?: boolean;
  isDisabled?: boolean;
  onSelectionChange?: (selected: boolean) => void;
};

export function ToggleButton({
  children,
  size = 'md',
  isSelected,
  defaultSelected = false,
  isDisabled,
  onSelectionChange,
  style,
  ...props
}: ToggleButtonProps) {
  const { tokens } = useTaleTheme();
  const metrics = controlMetrics(tokens, size);
  const [uncontrolled, setUncontrolled] = React.useState(defaultSelected);
  const selected = isSelected ?? uncontrolled;
  const { hovered, focused, interactionHandlers } = useInteractionState();
  const grouped = React.useContext(ToggleGroupContext);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, selected }}
      disabled={isDisabled}
      onPress={() => {
        const next = !selected;
        if (isSelected === undefined) {
          setUncontrolled(next);
        }
        onSelectionChange?.(next);
      }}
      {...props}
      {...interactionHandlers}
      style={({ pressed }) => [
        {
          alignItems: 'center',
          alignSelf: 'flex-start',
          backgroundColor: selected
            ? hovered
              ? tokens.neutral90
              : tokens.neutral80
            : pressed
              ? tokens.neutral20
              : hovered
                ? tokens.neutral14
                : transparentColor(tokens),
          borderColor: selected
            ? hovered
              ? tokens.neutral90
              : tokens.neutral80
            : hovered
              ? tokens.neutral28
              : tokens.neutral22,
          borderRadius: grouped ? 0 : metrics.radius,
          borderWidth: grouped ? 0 : 1,
          gap: metrics.gap,
          justifyContent: 'center',
          minHeight: metrics.minHeight,
          opacity: isDisabled ? disabledOpacity : 1,
          paddingHorizontal: metrics.paddingHorizontal,
          paddingVertical: metrics.paddingVertical,
        },
        focused ? focusRing(tokens) : undefined,
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text
          size={size === 'sm' ? 's' : 'm'}
          variant="label"
          style={{
            color: selected ? tokens.neutral80Fg : hovered ? tokens.neutral90 : tokens.neutral70,
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export type ToggleButtonGroupProps = React.PropsWithChildren<{
  accessibilityLabel?: string;
  style?: PressableProps['style'];
}>;

export function ToggleButtonGroup({
  children,
  accessibilityLabel = 'Toggle button group',
  style,
}: ToggleButtonGroupProps) {
  const { tokens } = useTaleTheme();
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          alignItems: 'center',
          alignSelf: 'flex-start',
          borderColor: tokens.neutral22,
          borderRadius: tokens.radiusM,
          borderWidth: 1,
          flexDirection: 'row',
          overflow: 'hidden',
        },
        typeof style === 'function' ? undefined : style,
      ]}
    >
      <ToggleGroupContext.Provider value>
        {React.Children.map(children, (child, index) => (
          <View
            style={{
              borderRightColor: tokens.neutral22,
              borderRightWidth: index < React.Children.count(children) - 1 ? 1 : 0,
            }}
          >
            {child}
          </View>
        ))}
      </ToggleGroupContext.Provider>
    </View>
  );
}
