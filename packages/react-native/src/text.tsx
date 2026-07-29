import { Text as NativeText, type TextProps as NativeTextProps } from 'react-native';
import { typography, type TextColor, type TextSize, type TextVariant } from './_style-utils';
import { useTale, useTaleTheme } from './provider';

export type TextProps = NativeTextProps & {
  variant?: TextVariant;
  size?: TextSize;
  color?: TextColor;
};

export function Text({
  variant = 'text',
  size = 'm',
  color = 'default',
  style,
  ...props
}: TextProps) {
  const { tokens } = useTaleTheme();
  const { textScale } = useTale();
  const typeStyle = typography(tokens, variant, size, color);
  return (
    <NativeText
      {...props}
      style={[
        typeStyle,
        {
          fontSize: typeStyle.fontSize ? typeStyle.fontSize * textScale : undefined,
          lineHeight: typeStyle.lineHeight ? typeStyle.lineHeight * textScale : undefined,
        },
        style,
      ]}
    />
  );
}
