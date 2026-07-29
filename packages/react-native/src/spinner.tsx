/* eslint-disable no-nested-ternary -- Spinner dimensions follow the three-size CSS matrix. */
import * as React from 'react';
import {
  ActivityIndicator,
  Animated,
  View,
  type ActivityIndicatorProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTale, useTaleTheme } from './provider';

export type SpinnerVariant = 'circle' | 'line' | 'dots';
export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerProps = Omit<ActivityIndicatorProps, 'size' | 'style'> & {
  variant?: SpinnerVariant;
  size?: SpinnerSize;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export function Spinner({
  variant = 'circle',
  size = 'md',
  label = 'Loading',
  color,
  style,
  ...props
}: SpinnerProps) {
  const { tokens } = useTaleTheme();
  const { reducedMotion } = useTale();
  const dimension = size === 'sm' ? 16 : size === 'lg' ? 36 : 24;
  const progress = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    if (variant === 'circle' || reducedMotion) {
      return undefined;
    }
    const loop = Animated.loop(
      Animated.timing(progress, {
        duration: variant === 'line' ? 1500 : 1200,
        toValue: 1,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress, reducedMotion, variant]);
  if (variant === 'line') {
    return (
      <View
        accessibilityLabel={label}
        accessibilityRole="progressbar"
        style={[
          {
            backgroundColor: tokens.neutral20,
            borderRadius: tokens.radiusXs,
            height: size === 'sm' ? 2 : size === 'lg' ? 4 : 3,
            maxWidth: 200,
            overflow: 'hidden',
            width: '100%',
          },
          style,
        ]}
      >
        <Animated.View
          style={{
            backgroundColor: color ?? tokens.color60,
            borderRadius: tokens.radiusXs,
            height: '100%',
            transform: [
              {
                translateX: reducedMotion
                  ? 0
                  : progress.interpolate({ inputRange: [0, 1], outputRange: [-80, 240] }),
              },
            ],
            width: '40%',
          }}
        />
      </View>
    );
  }
  if (variant === 'dots') {
    return (
      <View
        accessibilityLabel={label}
        accessibilityRole="progressbar"
        style={[{ alignItems: 'center', flexDirection: 'row', gap: tokens.space3xs }, style]}
      >
        {[0, 0.15, 0.3].map((delay) => (
          <Animated.View
            key={delay}
            style={{
              backgroundColor: color ?? tokens.neutral50,
              borderRadius: tokens.radiusFull,
              height: dimension * 0.3,
              opacity: reducedMotion
                ? 1
                : progress.interpolate({
                    inputRange: [0, Math.max(0.001, delay), Math.min(0.8, delay + 0.4), 1],
                    outputRange: [0.3, 0.3, 1, 0.3],
                  }),
              width: dimension * 0.3,
            }}
          />
        ))}
      </View>
    );
  }
  return (
    <ActivityIndicator
      accessibilityLabel={label}
      color={color ?? tokens.color60}
      size={dimension}
      style={style}
      {...props}
    />
  );
}
