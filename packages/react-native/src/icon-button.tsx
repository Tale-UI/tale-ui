/* eslint-disable no-nested-ternary -- Icon button padding follows the three-size CSS matrix. */
import { controlMetrics } from './_style-utils';
import { Button, type ButtonProps } from './button';
import { useTaleTheme } from './provider';

export type IconButtonProps = ButtonProps & {
  accessibilityLabel: string;
};

export function IconButton({ size = 'md', variant = 'ghost', style, ...props }: IconButtonProps) {
  const { tokens } = useTaleTheme();
  const metrics = controlMetrics(tokens, size);
  return (
    <Button
      {...props}
      size={size}
      variant={variant}
      style={[
        {
          aspectRatio: 1,
          minWidth: metrics.minHeight,
          paddingHorizontal:
            size === 'sm' ? tokens.space4xs : size === 'lg' ? tokens.space2xs : tokens.space3xs,
        },
        style,
      ]}
    />
  );
}
