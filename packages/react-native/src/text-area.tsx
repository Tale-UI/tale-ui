/* eslint-disable no-nested-ternary -- TextArea state precedence mirrors the CSS cascade. */
import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { alpha, fieldControl, fieldFocusRing, transparentColor } from './_style-utils';
import { useTaleTheme } from './provider';

export type TextAreaProps = TextInputProps & {
  isDisabled?: boolean;
  isInvalid?: boolean;
};

export function TextArea({
  isDisabled,
  isInvalid,
  style,
  onBlur,
  onFocus,
  ...props
}: TextAreaProps) {
  const { tokens } = useTaleTheme();
  const [focused, setFocused] = React.useState(false);
  return (
    <TextInput
      accessibilityState={{ disabled: isDisabled }}
      editable={!isDisabled}
      multiline
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      placeholderTextColor={tokens.neutral50}
      textAlignVertical="top"
      {...props}
      style={[
        {
          ...fieldControl(tokens),
          backgroundColor: isDisabled ? tokens.neutral14 : transparentColor(tokens),
          borderColor: isInvalid ? tokens.red60 : focused ? tokens.neutral50 : tokens.neutral26,
          borderRadius: tokens.radiusS,
          borderWidth: 1,
          boxShadow:
            isInvalid && focused
              ? `0 0 0 3px ${alpha(tokens.red60, 0.2)}`
              : focused
                ? fieldFocusRing(tokens).boxShadow
                : undefined,
          color: tokens.neutral90,
          minHeight: 80,
          opacity: isDisabled ? 0.45 : 1,
          outlineWidth: 0,
          paddingHorizontal: tokens.spaceXs,
          paddingVertical: tokens.space3xs,
          width: '100%',
        },
        style,
      ]}
    />
  );
}
