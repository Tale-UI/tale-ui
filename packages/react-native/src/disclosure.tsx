/* eslint-disable no-nested-ternary -- Disclosure press states are a compact closed matrix. */
import * as React from 'react';
import { Pressable } from 'react-native';
import { alpha, focusRing, transparentColor, useInteractionState } from './_style-utils';
import { Column } from './column';
import { Text } from './text';
import { useTaleTheme } from './provider';

export type DisclosureProps = React.PropsWithChildren<{
  title: string;
  isExpanded?: boolean;
  defaultExpanded?: boolean;
  isDisabled?: boolean;
  align?: 'start' | 'end';
  onExpandedChange?: (expanded: boolean) => void;
}>;

export function Disclosure({
  children,
  title,
  isExpanded,
  defaultExpanded = false,
  isDisabled = false,
  align = 'start',
  onExpandedChange,
}: DisclosureProps) {
  const { tokens } = useTaleTheme();
  const [uncontrolled, setUncontrolled] = React.useState(defaultExpanded);
  const expanded = isExpanded ?? uncontrolled;
  const { hovered, focused, interactionHandlers } = useInteractionState();
  return (
    <Column align={align} gap="3xs" style={{ width: '100%' }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={isDisabled ? { disabled: true, expanded } : { expanded }}
        disabled={isDisabled || undefined}
        {...interactionHandlers}
        onPress={() => {
          const next = !expanded;
          if (isExpanded === undefined) {
            setUncontrolled(next);
          }
          onExpandedChange?.(next);
        }}
        style={({ pressed }) => [
          {
            alignItems: 'center',
            alignSelf: align === 'end' ? 'flex-end' : 'flex-start',
            backgroundColor: alpha(tokens.neutral90, pressed ? 0.16 : hovered ? 0.12 : 0.08),
            borderColor: transparentColor(tokens),
            borderRadius: tokens.radiusM,
            borderWidth: 1,
            flexDirection: 'row',
            gap: tokens.space3xs,
            justifyContent: 'center',
            minHeight: 36,
            opacity: isDisabled ? 0.45 : 1,
            paddingHorizontal: tokens.spaceXs,
            paddingVertical: tokens.space3xs,
          },
          focused ? focusRing(tokens) : undefined,
        ]}
      >
        <Text
          variant="label"
          style={{
            color: tokens.neutral90,
            lineHeight: tokens.labelMFontSize * tokens.labelLineHeight,
          }}
        >
          {title}
        </Text>
      </Pressable>
      {expanded ? children : null}
    </Column>
  );
}
