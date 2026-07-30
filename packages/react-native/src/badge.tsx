/* eslint-disable no-nested-ternary -- Badge size and variant tables are intentionally compact. */
import * as React from 'react';
import { View, type TextStyle, type ViewProps } from 'react-native';
import { alpha, mix } from './_style-utils';
import { Text } from './text';
import { useTaleTheme } from './provider';

export type BadgeVariant =
  | 'neutral'
  | 'brand'
  | 'error'
  | 'warning'
  | 'success'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeType = 'pill' | 'rounded' | 'modern';
export type BadgeProps = ViewProps & {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  type?: BadgeType;
};

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  type = 'pill',
  style,
  ...props
}: BadgeProps) {
  const { tokens } = useTaleTheme();
  const palettes: Record<Exclude<BadgeVariant, 'neutral'>, readonly [string, string, string]> = {
    brand: [tokens.color60, tokens.color30, tokens.color70],
    error: [tokens.error60, tokens.error30, tokens.error70],
    warning: [tokens.warning60, tokens.warning30, tokens.warning70],
    success: [tokens.success60, tokens.success30, tokens.success70],
    red: [tokens.red60, tokens.red30, tokens.red70],
    orange: [tokens.orange60, tokens.orange30, tokens.orange70],
    amber: [tokens.amber60, tokens.amber30, tokens.amber70],
    yellow: [tokens.yellow60, tokens.yellow30, tokens.yellow70],
    lime: [tokens.lime60, tokens.lime30, tokens.lime70],
    green: [tokens.green60, tokens.green30, tokens.green70],
    emerald: [tokens.emerald60, tokens.emerald30, tokens.emerald70],
    teal: [tokens.teal60, tokens.teal30, tokens.teal70],
    cyan: [tokens.cyan60, tokens.cyan30, tokens.cyan70],
    sky: [tokens.sky60, tokens.sky30, tokens.sky70],
    indigo: [tokens.indigo60, tokens.indigo30, tokens.indigo70],
    violet: [tokens.violet60, tokens.violet30, tokens.violet70],
    purple: [tokens.purple60, tokens.purple30, tokens.purple70],
    fuchsia: [tokens.fuchsia60, tokens.fuchsia30, tokens.fuchsia70],
    pink: [tokens.pink60, tokens.pink30, tokens.pink70],
    rose: [tokens.rose60, tokens.rose30, tokens.rose70],
  };
  const palette = variant === 'neutral' ? undefined : palettes[variant];
  const isColor = palette !== undefined;
  const isModern = type === 'modern';
  return (
    <View
      {...props}
      style={[
        {
          alignItems: 'center',
          alignSelf: 'flex-start',
          backgroundColor: palette ? mix(palette[0], 0.15, tokens.neutral5) : tokens.neutral5,
          borderColor: palette ? palette[1] : tokens.neutral18,
          borderRadius: type === 'rounded' || isModern ? tokens.radiusS : tokens.radiusFull,
          borderWidth: 1,
          boxShadow: isColor ? undefined : `0 1px 2px ${alpha(tokens.neutralDefault100, 0.05)}`,
          flexDirection: 'row',
          gap: tokens.space4xs,
          paddingHorizontal:
            size === 'sm' ? tokens.space3xs : size === 'lg' ? tokens.spaceXs : tokens.space2xs,
          paddingVertical: size === 'sm' ? 0 : tokens.space4xs,
        },
        style,
      ]}
    >
      <Text
        size={size === 'lg' ? 's' : 'xs'}
        style={{
          color: palette ? palette[2] : tokens.neutral70,
          fontWeight: String(tokens.labelFontWeight) as TextStyle['fontWeight'],
        }}
      >
        {children}
      </Text>
    </View>
  );
}
