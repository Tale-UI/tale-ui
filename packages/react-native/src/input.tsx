/* eslint-disable no-nested-ternary -- Input state precedence mirrors the CSS selector cascade. */
import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import {
  alpha,
  fieldControl,
  fieldFocusRing,
  mix,
  type ControlSize,
} from './_style-utils';
import { useTaleTheme } from './provider';

export type InputProps = TextInputProps & {
  size?: ControlSize;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isReadOnly?: boolean;
};

export function Input({
  size = 'md',
  isDisabled,
  isInvalid,
  isReadOnly,
  style,
  onBlur,
  onFocus,
  ...props
}: InputProps) {
  const { tokens } = useTaleTheme();
  const [focused, setFocused] = React.useState(false);
  const borderColor = isInvalid ? tokens.red60 : focused ? tokens.neutral50 : tokens.neutral26;
  return (
    <TextInput
      accessibilityState={{ disabled: isDisabled }}
      editable={!isDisabled && !isReadOnly}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      placeholderTextColor={tokens.neutral50}
      {...props}
      style={[
        {
          ...fieldControl(tokens, size),
          backgroundColor: isDisabled
            ? tokens.neutral14
            : mix(tokens.neutral10, 0.4, tokens.neutral5),
          borderColor,
          borderRadius: tokens.radiusS,
          borderWidth: 1,
          boxShadow:
            isInvalid && focused
              ? `0 0 0 3px ${alpha(tokens.red60, 0.2)}`
              : focused
                ? fieldFocusRing(tokens).boxShadow
                : undefined,
          color: tokens.neutral90,
          opacity: isDisabled ? 0.45 : 1,
          outlineWidth: 0,
          width: '100%',
        },
        style,
      ]}
    />
  );
}
