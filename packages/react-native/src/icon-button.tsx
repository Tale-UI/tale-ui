import { Button, type ButtonProps } from './button';

export type IconButtonProps = ButtonProps & {
  accessibilityLabel: string;
};

export function IconButton(props: IconButtonProps) {
  return <Button {...props} />;
}
