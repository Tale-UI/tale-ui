/* eslint-disable no-nested-ternary -- List density is a closed three-value token mapping. */
import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { shadow, transparentColor } from './_style-utils';
import { useTaleTheme } from './provider';

export type ListProps = ViewProps &
  React.PropsWithChildren<{
    label?: string;
    variant?: 'plain' | 'divided';
    density?: 'compact' | 'default' | 'spacious';
    frameless?: boolean;
    layout?: 'list' | 'grid';
  }>;

const childrenWithRows = (children: React.ReactNode, padding: number, borderColor?: string) =>
  React.Children.map(children, (child, index) => (
    <View
      style={{
        borderTopColor: borderColor,
        borderTopWidth: borderColor && index > 0 ? 1 : 0,
        paddingVertical: padding,
      }}
    >
      {child}
    </View>
  ));

export function List({
  label = 'List',
  variant = 'plain',
  density = 'default',
  style,
  children,
  ...props
}: ListProps) {
  const { tokens } = useTaleTheme();
  const padding =
    density === 'compact'
      ? tokens.space2xs
      : density === 'spacious'
        ? tokens.spaceS
        : tokens.spaceXs;
  return (
    <View accessibilityLabel={label} {...props} style={style}>
      {childrenWithRows(children, padding, variant === 'divided' ? tokens.neutral18 : undefined)}
    </View>
  );
}

export function ListBox({
  label = 'List box',
  frameless = false,
  layout = 'list',
  style,
  children,
  ...props
}: ListProps) {
  const { tokens } = useTaleTheme();
  return (
    <View
      accessibilityLabel={label}
      {...props}
      style={[
        {
          backgroundColor: frameless ? transparentColor(tokens) : tokens.neutral10,
          borderColor: frameless ? transparentColor(tokens) : tokens.neutral20,
          borderRadius: tokens.radiusM,
          borderWidth: frameless ? 0 : 1,
          boxShadow: frameless ? undefined : shadow(tokens).m,
          flexDirection: layout === 'grid' ? 'row' : 'column',
          flexWrap: layout === 'grid' ? 'wrap' : 'nowrap',
          gap: tokens.space4xs,
          maxHeight: 280,
          overflow: 'scroll',
          padding: frameless ? 0 : tokens.space4xs,
        },
        style,
      ]}
    >
      {React.Children.map(children, (child) => (
        <View
          style={{
            alignItems: 'center',
            borderRadius: tokens.radiusS,
            flexDirection: 'row',
            gap: tokens.space2xs,
            paddingHorizontal: tokens.space2xs,
            paddingVertical: tokens.space4xs,
          }}
        >
          {child}
        </View>
      ))}
    </View>
  );
}

export function GridList({ label = 'Grid list', style, children, ...props }: ListProps) {
  const { tokens } = useTaleTheme();
  return (
    <View
      accessibilityLabel={label}
      {...props}
      style={[
        {
          borderColor: tokens.neutral22,
          borderRadius: tokens.space4xs,
          borderWidth: 1,
          flexDirection: 'column',
          gap: 1,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {React.Children.map(children, (child) => (
        <View
          style={{
            alignItems: 'center',
            backgroundColor: tokens.neutral5,
            flexDirection: 'row',
            gap: tokens.space2xs,
            paddingHorizontal: tokens.space2xs,
            paddingVertical: tokens.space3xs,
          }}
        >
          {child}
        </View>
      ))}
    </View>
  );
}

export function TagGroup({ label = 'Tag group', style, children, ...props }: ListProps) {
  const { tokens } = useTaleTheme();
  return (
    <View accessibilityLabel={label} {...props} style={[{ gap: tokens.space3xs }, style]}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.space3xs }}>
        {children}
      </View>
    </View>
  );
}
