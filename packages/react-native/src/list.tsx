import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { Column } from './column';

export type ListProps = ViewProps & React.PropsWithChildren<{ label?: string }>;

export function List({ label = 'List', ...props }: ListProps) {
  return <Column accessibilityLabel={label} {...props} />;
}

export function ListBox({ label = 'List box', ...props }: ListProps) {
  return <Column accessibilityLabel={label} {...props} />;
}

export function GridList({ label = 'Grid list', ...props }: ListProps) {
  return <View accessibilityLabel={label} {...props} />;
}

export function TagGroup({ label = 'Tag group', ...props }: ListProps) {
  return <View accessibilityLabel={label} {...props} />;
}
