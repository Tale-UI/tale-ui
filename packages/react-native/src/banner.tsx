/* eslint-disable no-nested-ternary -- Semantic palette selection is a closed variant table. */
import * as React from 'react';
import { View, type TextStyle, type ViewProps } from 'react-native';
import { Text } from './text';
import { useTaleTheme } from './provider';

export type BannerVariant = 'info' | 'success' | 'warning' | 'error';
export type BannerProps = ViewProps & {
  title: string;
  children?: React.ReactNode;
  variant?: BannerVariant;
  size?: 'sm' | 'md';
};

export function Banner({
  children,
  title,
  variant = 'info',
  size = 'md',
  style,
  ...props
}: BannerProps) {
  const { tokens } = useTaleTheme();
  const palette =
    variant === 'success'
      ? {
          background: tokens.success10,
          border: tokens.success30,
          title: tokens.success80,
          description: tokens.success70,
        }
      : variant === 'warning'
        ? {
            background: tokens.warning10,
            border: tokens.warning30,
            title: tokens.warning80,
            description: tokens.warning70,
          }
        : variant === 'error'
          ? {
              background: tokens.error10,
              border: tokens.error30,
              title: tokens.error80,
              description: tokens.error70,
            }
          : {
              background: tokens.neutral90,
              border: tokens.neutral80,
              title: tokens.neutral5,
              description: tokens.neutral14,
            };
  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      {...props}
      style={[
        {
          alignItems: 'center',
          backgroundColor: palette.background,
          borderColor: palette.border,
          borderRadius: tokens.radiusM,
          borderWidth: 1,
          flexDirection: 'row',
          gap: size === 'sm' ? tokens.space3xs : tokens.spaceXs,
          padding: tokens.space2xs,
        },
        style,
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text
          accessibilityRole="header"
          size={size === 'sm' ? 'xs' : 's'}
          style={{
            color: palette.title,
            fontWeight: String(tokens.titleFontWeight) as TextStyle['fontWeight'],
          }}
        >
          {title}
        </Text>
        <Text size={size === 'sm' ? 'xs' : 's'} style={{ color: palette.description }}>
          {children}
        </Text>
      </View>
    </View>
  );
}
