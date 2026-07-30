/* eslint-disable no-nested-ternary -- Icon dimensions follow the four-size CSS matrix. */
import * as React from 'react';
import { View, type ViewProps } from 'react-native';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';
export type IconProps = ViewProps &
  React.PropsWithChildren<{
    label?: string;
    size?: IconSize;
  }>;

export function Icon({ label, size = 'md', style, ...props }: IconProps) {
  const dimension = size === 'sm' ? 16 : size === 'lg' ? 32 : size === 'xl' ? 48 : 24;
  return (
    <View
      accessibilityElementsHidden={!label}
      accessibilityLabel={label}
      accessibilityRole={label ? 'image' : 'none'}
      {...props}
      style={[
        {
          alignItems: 'center',
          flexShrink: 0,
          height: dimension,
          justifyContent: 'center',
          width: dimension,
        },
        style,
      ]}
    />
  );
}
