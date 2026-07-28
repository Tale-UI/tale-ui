import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';
import { useTaleTheme } from './provider';

export function Spinner(props: ActivityIndicatorProps) {
  const { tokens } = useTaleTheme();
  return <ActivityIndicator accessibilityLabel="Loading" color={tokens.color60} {...props} />;
}
