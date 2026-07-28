import * as React from 'react';
import { Modal, View } from 'react-native';
import { Dialog, type DialogProps } from './dialog';
import { Text } from './text';

export function AlertDialog(props: DialogProps) {
  return <Dialog {...props} />;
}

export type DrawerProps = React.PropsWithChildren<{
  isOpen: boolean;
  label: string;
  onOpenChange: (open: boolean) => void;
}>;

export function Drawer({ children, isOpen, label, onOpenChange }: DrawerProps) {
  return (
    <Modal
      accessibilityViewIsModal
      animationType="slide"
      onRequestClose={() => onOpenChange(false)}
      visible={isOpen}
    >
      <View accessible accessibilityLabel={label}>
        {children}
      </View>
    </Modal>
  );
}

export type ToastProps = React.PropsWithChildren<{ label?: string }>;

export function Toast({ children, label = 'Notification' }: ToastProps) {
  return (
    <View
      accessible
      accessibilityLabel={label}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
    >
      <Text>{children}</Text>
    </View>
  );
}
