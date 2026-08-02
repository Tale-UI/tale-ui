/* eslint-disable no-nested-ternary -- Skeleton dimensions follow the three-variant CSS matrix. */
import * as React from 'react';
import { Animated, type ViewProps } from 'react-native';
import { useTale, useTaleTheme } from './provider';

export type SkeletonVariant = 'text' | 'rectangular' | 'circular';
export type SkeletonAnimation = 'pulse' | 'none';
export type SkeletonProps = ViewProps & {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
};

export function Skeleton({
  variant = 'text',
  animation = 'pulse',
  style,
  ...props
}: SkeletonProps) {
  const { tokens } = useTaleTheme();
  const { reducedMotion } = useTale();
  const opacity = React.useRef(new Animated.Value(0.55)).current;
  React.useEffect(() => {
    if (animation === 'none' || reducedMotion) {
      opacity.setValue(1);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          duration: tokens.motionDurationDeliberate * 3,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          duration: tokens.motionDurationDeliberate * 3,
          toValue: 0.55,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animation, opacity, reducedMotion, tokens.motionDurationDeliberate]);
  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      {...props}
      style={[
        {
          backgroundColor: tokens.neutral18,
          borderRadius:
            variant === 'circular'
              ? tokens.radiusFull
              : variant === 'rectangular'
                ? tokens.radiusM
                : tokens.radiusXs,
          height:
            variant === 'circular' ? 40 : variant === 'rectangular' ? 64 : tokens.textMFontSize,
          opacity,
          overflow: 'hidden',
          width: variant === 'circular' ? 40 : '100%',
        },
        style,
      ]}
    />
  );
}
