import * as React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Text } from './text';

export type DialogProps = React.PropsWithChildren<{
  isOpen: boolean;
  title: string;
  onOpenChange: (open: boolean) => void;
}>;

export function Dialog({ children, isOpen, title, onOpenChange }: DialogProps) {
  return (
    <Modal
      accessibilityViewIsModal
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
      transparent
      visible={isOpen}
    >
      <View accessible accessibilityLabel={title}>
        <Text accessibilityRole="header">{title}</Text>
        {children}
        <Pressable accessibilityRole="button" onPress={() => onOpenChange(false)}>
          <Text>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
