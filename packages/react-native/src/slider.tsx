import * as React from 'react';
import { Pressable, View } from 'react-native';
import { focusRing, shadow, useInteractionState } from './_style-utils';
import { Text } from './text';
import { useTaleTheme } from './provider';

export type SliderProps = {
  label: string;
  value: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  isDisabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  onValueChange: (value: number) => void;
};

export function Slider({
  label,
  value,
  minValue = 0,
  maxValue = 100,
  step = 1,
  isDisabled = false,
  orientation = 'horizontal',
  onValueChange,
}: SliderProps) {
  const { tokens } = useTaleTheme();
  const { focused, interactionHandlers } = useInteractionState();
  const percent = Math.max(0, Math.min(1, (value - minValue) / (maxValue - minValue || 1)));
  const update = (delta: number) =>
    onValueChange(Math.max(minValue, Math.min(maxValue, value + delta)));
  return (
    <View
      accessible
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      accessibilityLabel={label}
      accessibilityRole="adjustable"
      accessibilityState={{ disabled: isDisabled }}
      accessibilityValue={{ min: minValue, max: maxValue, now: value }}
      {...interactionHandlers}
      onAccessibilityAction={({ nativeEvent }) =>
        !isDisabled && update(nativeEvent.actionName === 'increment' ? step : -step)
      }
      style={{
        alignItems: orientation === 'vertical' ? 'flex-start' : 'stretch',
        flexDirection: 'column',
        gap: tokens.space4xs,
        opacity: isDisabled ? 0.45 : 1,
        width: orientation === 'vertical' ? 80 : '100%',
      }}
    >
      <View
        style={{
          alignItems: 'baseline',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text size="s" variant="label" style={{ color: tokens.neutral70 }}>
          {label}
        </Text>
        <Text size="s" variant="label" style={{ color: tokens.neutral60 }}>
          {value}
        </Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          height: orientation === 'vertical' ? 160 : 20,
          justifyContent: 'center',
          width: orientation === 'vertical' ? 20 : '100%',
        }}
      >
        <View
          style={{
            backgroundColor: tokens.neutral22,
            borderRadius: tokens.radiusFull,
            flex: 1,
            height: orientation === 'horizontal' ? 4 : undefined,
            overflow: 'hidden',
            width: orientation === 'vertical' ? 4 : undefined,
          }}
        >
          <View
            style={{
              alignSelf: orientation === 'vertical' ? 'stretch' : 'flex-start',
              backgroundColor: isDisabled ? tokens.neutral40 : tokens.color60,
              borderRadius: tokens.radiusFull,
              height: orientation === 'vertical' ? `${percent * 100}%` : '100%',
              marginTop: orientation === 'vertical' ? `${(1 - percent) * 100}%` : 0,
              width: orientation === 'horizontal' ? `${percent * 100}%` : '100%',
            }}
          />
        </View>
        <Pressable
          accessibilityElementsHidden
          disabled={isDisabled}
          onPress={() => update(step)}
          style={[
            {
              backgroundColor: tokens.neutral5,
              borderColor: tokens.neutral40,
              borderRadius: tokens.radiusFull,
              borderWidth: 2,
              boxShadow: shadow(tokens).s,
              height: 18,
              left: orientation === 'horizontal' ? `${percent * 100}%` : 1,
              position: 'absolute',
              top: orientation === 'vertical' ? `${(1 - percent) * 100}%` : 1,
              transform: [
                { translateX: orientation === 'horizontal' ? -9 : 0 },
                { translateY: orientation === 'vertical' ? -9 : 0 },
              ],
              width: 18,
            },
            focused ? focusRing(tokens) : undefined,
          ]}
        />
      </View>
    </View>
  );
}
