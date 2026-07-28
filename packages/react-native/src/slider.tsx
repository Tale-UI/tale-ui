import * as React from 'react';
import { View } from 'react-native';
import { ProgressBar } from './progress-bar';

export type SliderProps = {
  label: string;
  value: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  onValueChange: (value: number) => void;
};

export function Slider({
  label,
  value,
  minValue = 0,
  maxValue = 100,
  step = 1,
  onValueChange,
}: SliderProps) {
  const update = (delta: number) =>
    onValueChange(Math.max(minValue, Math.min(maxValue, value + delta)));
  return (
    <View
      accessible
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      accessibilityLabel={label}
      accessibilityRole="adjustable"
      accessibilityValue={{ min: minValue, max: maxValue, now: value }}
      onAccessibilityAction={({ nativeEvent }) =>
        update(nativeEvent.actionName === 'increment' ? step : -step)
      }
    >
      <ProgressBar label={label} maxValue={maxValue} minValue={minValue} value={value} />
    </View>
  );
}
