import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { Text } from './text';
import { useTaleTheme } from './provider';

export type BadgeProps = ViewProps & { children?: React.ReactNode };

export function Badge({ children, style, ...props }: BadgeProps) {
  const { tokens } = useTaleTheme();
  return (
    <View
      {...props}
      style={[
        {
          alignSelf: 'flex-start',
          backgroundColor: tokens.color10,
          borderRadius: tokens.radiusFull,
          paddingHorizontal: tokens.spaceS,
          paddingVertical: tokens.space3xs,
        },
        style,
      ]}
    >
      <Text>{children}</Text>
    </View>
  );
}
