/* eslint-disable no-nested-ternary -- Tab variant/state styling mirrors the CSS selector matrix. */
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { alpha, focusRing, transparentColor, useInteractionState } from './_style-utils';
import { Row } from './row';
import { Text } from './text';
import { useTaleTheme } from './provider';

export type TabItem = Readonly<{
  id: string;
  label: string;
  content: React.ReactNode;
  isDisabled?: boolean;
}>;
export type TabsProps = {
  items: readonly TabItem[];
  variant?: 'underline' | 'pills' | 'enclosed';
  size?: 'sm' | 'md';
  orientation?: 'horizontal' | 'vertical';
  selectedKey?: string;
  defaultSelectedKey?: string;
  onSelectionChange?: (key: string) => void;
};

function Tab({
  item,
  selected,
  variant,
  size,
  orientation,
  onPress,
}: {
  item: TabItem;
  selected: boolean;
  variant: 'underline' | 'pills' | 'enclosed';
  size: 'sm' | 'md';
  orientation: 'horizontal' | 'vertical';
  onPress: () => void;
}) {
  const { tokens } = useTaleTheme();
  const { hovered, focused, interactionHandlers } = useInteractionState();
  return (
    <Pressable
      accessibilityLabel={item.label}
      accessibilityRole="tab"
      accessibilityState={{ disabled: item.isDisabled, selected }}
      disabled={item.isDisabled}
      onPress={onPress}
      {...interactionHandlers}
      style={[
        {
          alignItems: 'center',
          alignSelf: 'stretch',
          backgroundColor:
            variant === 'pills' && selected
              ? tokens.neutral5
              : variant === 'enclosed' && selected
                ? tokens.neutral5
                : hovered && !selected
                  ? variant === 'pills'
                    ? transparentColor(tokens)
                    : tokens.neutral12
                  : transparentColor(tokens),
          borderBottomColor:
            variant === 'underline' && selected
              ? tokens.neutral90
              : variant === 'enclosed' && selected
                ? tokens.neutral5
                : transparentColor(tokens),
          borderBottomWidth:
            variant === 'underline' && selected ? 2 : variant === 'enclosed' ? 1 : 0,
          borderColor:
            variant === 'pills' && selected
              ? tokens.neutral14
              : variant === 'enclosed' && selected
                ? tokens.neutral18
                : transparentColor(tokens),
          borderRadius:
            variant === 'pills' ? tokens.radiusS : variant === 'enclosed' ? tokens.radiusS : 0,
          borderWidth: variant === 'pills' || variant === 'enclosed' ? 1 : 0,
          boxShadow:
            variant === 'pills' && selected
              ? `0 1px 2px ${alpha(tokens.neutralDefault100, 0.06)}`
              : undefined,
          justifyContent: orientation === 'vertical' ? 'flex-start' : 'center',
          opacity: item.isDisabled ? 0.45 : 1,
          paddingHorizontal: size === 'sm' ? tokens.spaceXs : tokens.spaceM,
          paddingVertical: size === 'sm' ? tokens.space3xs : tokens.space2xs,
        },
        focused ? focusRing(tokens) : undefined,
      ]}
    >
      <Text
        size={size === 'sm' ? 's' : 'm'}
        variant="label"
        style={{
          color: selected ? tokens.neutral90 : hovered ? tokens.neutral80 : tokens.neutral60,
        }}
      >
        {item.label}
      </Text>
    </Pressable>
  );
}

export function Tabs({
  items,
  variant = 'underline',
  size = 'md',
  orientation = 'horizontal',
  selectedKey,
  defaultSelectedKey,
  onSelectionChange,
}: TabsProps) {
  const { tokens } = useTaleTheme();
  const [uncontrolled, setUncontrolled] = React.useState(
    defaultSelectedKey ?? selectedKey ?? items[0]?.id ?? '',
  );
  const activeKey = selectedKey ?? uncontrolled;
  const selected = items.find(({ id }) => id === activeKey) ?? items[0];
  const select = (key: string) => {
    if (selectedKey === undefined) {
      setUncontrolled(key);
    }
    onSelectionChange?.(key);
  };
  return (
    <View style={{ flexDirection: orientation === 'vertical' ? 'row' : 'column' }}>
      <Row
        accessibilityRole="tablist"
        gap="4xs"
        style={{
          backgroundColor: variant === 'pills' ? tokens.neutral10 : transparentColor(tokens),
          borderBottomColor: variant === 'underline' ? tokens.neutral18 : tokens.neutral18,
          borderBottomWidth:
            orientation === 'horizontal' && variant !== 'pills'
              ? variant === 'underline'
                ? 2
                : 1
              : 0,
          borderRadius: variant === 'pills' ? tokens.radiusM : 0,
          borderRightColor: tokens.neutral18,
          borderRightWidth:
            orientation === 'vertical' && variant !== 'pills'
              ? variant === 'underline'
                ? 2
                : 1
              : 0,
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          padding: variant === 'pills' ? tokens.space4xs : 0,
        }}
      >
        {items.map((item) => (
          <Tab
            item={item}
            key={item.id}
            onPress={() => select(item.id)}
            orientation={orientation}
            selected={item.id === selected?.id}
            size={size}
            variant={variant}
          />
        ))}
      </Row>
      <View
        accessible
        style={{
          paddingHorizontal: orientation === 'vertical' ? tokens.spaceM : 0,
          paddingVertical: orientation === 'vertical' ? 0 : tokens.spaceM,
        }}
      >
        {selected?.content}
      </View>
    </View>
  );
}
