import { View, type ViewProps } from 'react-native';
import { useTaleTheme } from './provider';

export type ProgressBarProps = ViewProps & {
  value?: number;
  minValue?: number;
  maxValue?: number;
  label?: string;
};

export function ProgressBar({
  value = 0,
  minValue = 0,
  maxValue = 100,
  label = 'Progress',
  style,
  ...props
}: ProgressBarProps) {
  const { tokens } = useTaleTheme();
  const percent = Math.max(0, Math.min(1, (value - minValue) / (maxValue - minValue || 1)));
  return (
    <View
      accessible
      accessibilityLabel={label}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: minValue, max: maxValue, now: value }}
      {...props}
      style={[{ backgroundColor: tokens.neutral20, borderRadius: tokens.radiusFull }, style]}
    >
      <View
        style={{
          backgroundColor: tokens.color60,
          borderRadius: tokens.radiusFull,
          height: tokens.spaceXs,
          width: `${percent * 100}%`,
        }}
      />
    </View>
  );
}
