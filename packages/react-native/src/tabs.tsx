import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Row } from './row';
import { Text } from './text';

export type TabItem = Readonly<{ id: string; label: string; content: React.ReactNode }>;
export type TabsProps = {
  items: readonly TabItem[];
  selectedKey: string;
  onSelectionChange: (key: string) => void;
};

export function Tabs({ items, selectedKey, onSelectionChange }: TabsProps) {
  const selected = items.find(({ id }) => id === selectedKey) ?? items[0];
  return (
    <View>
      <Row accessibilityRole="tablist">
        {items.map((item) => (
          <Pressable
            accessibilityLabel={item.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: item.id === selected?.id }}
            key={item.id}
            onPress={() => onSelectionChange(item.id)}
          >
            <Text>{item.label}</Text>
          </Pressable>
        ))}
      </Row>
      <View accessible>{selected?.content}</View>
    </View>
  );
}
