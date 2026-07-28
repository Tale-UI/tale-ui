import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { Text } from './text';

export type BannerProps = ViewProps & { title: string; children?: React.ReactNode };

export function Banner({ children, title, ...props }: BannerProps) {
  return (
    <View accessibilityLiveRegion="polite" accessibilityRole="alert" {...props}>
      <Text accessibilityRole="header">{title}</Text>
      <Text>{children}</Text>
    </View>
  );
}
