import { View, type ViewProps } from 'react-native';
import { Text } from './text';
import { useTaleTheme } from './provider';

export type ProgressLabelPosition = 'top' | 'right' | 'bottom' | 'top-floating' | 'bottom-floating';
export type ProgressBarProps = ViewProps & {
  value?: number;
  minValue?: number;
  maxValue?: number;
  label?: string;
  labelPosition?: ProgressLabelPosition;
  isIndeterminate?: boolean;
};

export function ProgressBar({
  value = 0,
  minValue = 0,
  maxValue = 100,
  label = 'Progress',
  labelPosition = 'top',
  isIndeterminate = false,
  style,
  ...props
}: ProgressBarProps) {
  const { tokens } = useTaleTheme();
  const percent = Math.max(0, Math.min(1, (value - minValue) / (maxValue - minValue || 1)));
  const percentageLabel = `${Math.round(percent * 100)}%`;
  const floating = labelPosition === 'top-floating' || labelPosition === 'bottom-floating';
  const header = (
    <View
      style={{
        alignItems: 'baseline',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: labelPosition === 'top' ? tokens.space3xs : 0,
        marginTop: labelPosition === 'bottom' ? tokens.space3xs : 0,
      }}
    >
      <Text variant="label" style={{ color: tokens.neutral80 }}>
        {label}
      </Text>
      <Text size="s" variant="label" style={{ color: tokens.neutral60 }}>
        {percentageLabel}
      </Text>
    </View>
  );
  const track = (
    <View
      style={{
        backgroundColor: tokens.neutral24,
        borderRadius: tokens.radiusFull,
        flex: labelPosition === 'right' ? 1 : undefined,
        height: 8,
        overflow: 'hidden',
        width: labelPosition === 'right' ? undefined : '100%',
      }}
    >
      <View
        style={{
          backgroundColor: percent >= 1 ? tokens.green60 : tokens.neutral24Fg,
          borderRadius: tokens.radiusFull,
          height: '100%',
          width: isIndeterminate ? '40%' : `${percent * 100}%`,
        }}
      />
    </View>
  );
  return (
    <View
      accessible
      accessibilityLabel={label}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: minValue, max: maxValue, now: value }}
      {...props}
      style={[
        {
          flexDirection: labelPosition === 'right' ? 'row' : 'column',
          gap: labelPosition === 'right' ? tokens.spaceXs : tokens.space4xs,
          paddingBottom: labelPosition === 'bottom-floating' ? tokens.spaceL : 0,
          paddingTop: labelPosition === 'top-floating' ? tokens.spaceL : 0,
          position: floating ? 'relative' : undefined,
          width: '100%',
        },
        style,
      ]}
    >
      {labelPosition === 'top' ? header : null}
      {track}
      {labelPosition === 'bottom' ? header : null}
      {labelPosition === 'right' ? (
        <Text size="s" variant="label" style={{ color: tokens.neutral60 }}>
          {percentageLabel}
        </Text>
      ) : null}
      {floating && !isIndeterminate ? (
        <Text
          size="s"
          variant="label"
          style={{
            alignSelf: 'flex-start',
            backgroundColor: tokens.neutral90,
            borderRadius: tokens.radiusS,
            color: tokens.neutral90Fg,
            left: `${percent * 100}%`,
            paddingHorizontal: tokens.space2xs,
            paddingVertical: tokens.space4xs,
            position: 'absolute',
            transform: [{ translateX: -20 }],
            ...(labelPosition === 'top-floating'
              ? { bottom: tokens.spaceL + tokens.spaceXs }
              : { top: tokens.spaceL + tokens.spaceXs }),
          }}
        >
          {percentageLabel}
        </Text>
      ) : null}
    </View>
  );
}
