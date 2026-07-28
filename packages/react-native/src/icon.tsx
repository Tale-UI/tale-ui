import { View, type ViewProps } from 'react-native';

export type IconProps = ViewProps & { label?: string };

export function Icon({ label, ...props }: IconProps) {
  return (
    <View
      accessibilityElementsHidden={!label}
      accessibilityLabel={label}
      accessibilityRole={label ? 'image' : 'none'}
      {...props}
    />
  );
}
