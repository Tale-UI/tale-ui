import { TextInput, type TextInputProps } from 'react-native';
import { useTaleTheme } from './provider';

export type InputProps = TextInputProps & { isDisabled?: boolean; isInvalid?: boolean };

export function Input({ isDisabled, isInvalid, style, ...props }: InputProps) {
  const { tokens } = useTaleTheme();
  return (
    <TextInput
      accessibilityState={{ disabled: isDisabled }}
      editable={!isDisabled}
      {...props}
      style={[
        {
          borderColor: isInvalid ? tokens.error60 : tokens.neutral30,
          borderRadius: tokens.radiusM,
          borderWidth: 1,
          color: tokens.textColor,
          minHeight: 44,
          paddingHorizontal: tokens.spaceS,
        },
        style,
      ]}
    />
  );
}
