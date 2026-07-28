import { Text as NativeText, type TextProps as NativeTextProps } from 'react-native';
import { useTaleTheme } from './provider';

export type TextProps = NativeTextProps;

export function Text({ style, ...props }: TextProps) {
  const theme = useTaleTheme();
  return (
    <NativeText
      {...props}
      style={[{ color: theme.tokens.textColor, fontFamily: theme.tokens.bodyFont }, style]}
    />
  );
}
