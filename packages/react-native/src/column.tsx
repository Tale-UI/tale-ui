import { View, type ViewProps } from 'react-native';

export function Column({ style, ...props }: ViewProps) {
  return <View {...props} style={[{ flexDirection: 'column' }, style]} />;
}
