import { View, type ViewProps } from 'react-native';

export function Row({ style, ...props }: ViewProps) {
  return <View {...props} style={[{ flexDirection: 'row' }, style]} />;
}
