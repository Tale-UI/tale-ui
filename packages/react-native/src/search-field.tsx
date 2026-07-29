/* eslint-disable no-nested-ternary -- Search field state precedence mirrors the CSS cascade. */
import * as React from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';
import { alpha, fieldControl, fieldFocusRing, transparentColor } from './_style-utils';
import { useTaleTheme } from './provider';
import { Text } from './text';

export type SearchFieldProps = TextInputProps & {
  variant?: 'default' | 'inline';
  isDisabled?: boolean;
  isInvalid?: boolean;
};

export function SearchField({
  variant = 'default',
  isDisabled,
  isInvalid,
  value,
  defaultValue,
  onChangeText,
  style,
  onBlur,
  onFocus,
  ...props
}: SearchFieldProps) {
  const { tokens } = useTaleTheme();
  const [focused, setFocused] = React.useState(false);
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? '');
  const currentValue = value ?? uncontrolled;
  const update = (next: string) => {
    if (value === undefined) {
      setUncontrolled(next);
    }
    onChangeText?.(next);
  };
  return (
    <View style={{ position: 'relative', width: '100%' }}>
      <TextInput
        accessibilityRole="search"
        accessibilityState={{ disabled: isDisabled }}
        editable={!isDisabled}
        enterKeyHint="search"
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        onChangeText={update}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        placeholderTextColor={tokens.neutral50}
        returnKeyType="search"
        value={currentValue}
        {...props}
        style={[
          {
            ...fieldControl(tokens),
            backgroundColor:
              variant === 'inline'
                ? transparentColor(tokens)
                : isDisabled
                  ? tokens.neutral14
                  : tokens.neutral5,
            borderColor:
              variant === 'inline'
                ? transparentColor(tokens)
                : isInvalid
                  ? tokens.red60
                  : focused
                    ? tokens.neutral50
                    : tokens.neutral26,
            borderRadius: tokens.radiusS,
            borderWidth: variant === 'inline' ? 0 : 1,
            boxShadow:
              variant === 'inline'
                ? undefined
                : isInvalid && focused
                  ? `0 0 0 3px ${alpha(tokens.red60, 0.2)}`
                  : focused
                    ? fieldFocusRing(tokens).boxShadow
                    : undefined,
            color: tokens.neutral90,
            opacity: isDisabled ? 0.45 : 1,
            outlineWidth: 0,
            paddingRight: currentValue ? 32 : tokens.space2xs,
            width: '100%',
          },
          style,
        ]}
      />
      {currentValue ? (
        <Pressable
          accessibilityLabel="Clear search"
          accessibilityRole="button"
          disabled={isDisabled}
          onPress={() => update('')}
          style={({ pressed }) => ({
            alignItems: 'center',
            backgroundColor: pressed ? tokens.neutral18 : transparentColor(tokens),
            borderRadius: tokens.radiusFull,
            height: 24,
            justifyContent: 'center',
            opacity: isDisabled ? 0.45 : 1,
            position: 'absolute',
            right: tokens.space4xs,
            top: 6,
            width: 24,
          })}
        >
          <Text
            style={{
              color: tokens.neutral50,
              lineHeight: tokens.textMFontSize * tokens.textLineHeight,
            }}
          >
            ×
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
