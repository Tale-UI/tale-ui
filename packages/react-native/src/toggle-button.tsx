import * as React from 'react';
import { Button, type ButtonProps } from './button';
import { Row } from './row';

export type ToggleButtonProps = ButtonProps & {
  isSelected: boolean;
  onSelectionChange: (selected: boolean) => void;
};

export function ToggleButton({ isSelected, onSelectionChange, ...props }: ToggleButtonProps) {
  return (
    <Button
      accessibilityState={{ selected: isSelected }}
      onPress={() => onSelectionChange(!isSelected)}
      {...props}
    />
  );
}

export function ToggleButtonGroup({ children }: React.PropsWithChildren) {
  return <Row accessibilityLabel="Toggle button group">{children}</Row>;
}
