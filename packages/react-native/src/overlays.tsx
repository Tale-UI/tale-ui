/* eslint-disable no-nested-ternary -- Toast semantic accent selection is a closed variant table. */
import * as React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { scrim, shadow } from './_style-utils';
import { Dialog, type DialogProps } from './dialog';
import { Text } from './text';
import { useTaleTheme } from './provider';

export function AlertDialog(props: DialogProps) {
  return <Dialog {...props} type="alert" />;
}

export type DrawerProps = React.PropsWithChildren<{
  isOpen: boolean;
  label: string;
  onOpenChange: (open: boolean) => void;
}>;

export function Drawer({ children, isOpen, label, onOpenChange }: DrawerProps) {
  const { tokens } = useTaleTheme();
  const requestClose = React.useCallback(() => onOpenChange(false), [onOpenChange]);
  return (
    <Modal
      accessibilityViewIsModal
      animationType="slide"
      onRequestClose={requestClose}
      transparent
      visible={isOpen}
    >
      <View
        style={{
          backgroundColor: scrim(tokens),
          flex: 1,
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: tokens.neutral10,
            borderColor: tokens.neutral20,
            borderTopLeftRadius: tokens.radius2xl,
            borderTopRightRadius: tokens.radius2xl,
            borderWidth: 1,
            boxShadow: shadow(tokens).m,
            flexDirection: 'column',
            gap: tokens.spaceXs,
            maxHeight: '90%',
            paddingBottom: tokens.spaceL,
            paddingHorizontal: tokens.spaceM,
            paddingTop: tokens.spaceM,
          }}
        >
          <View
            accessibilityElementsHidden
            style={{
              alignSelf: 'center',
              backgroundColor: tokens.neutral30,
              borderRadius: tokens.radiusFull,
              height: 4,
              marginBottom: tokens.space2xs,
              width: 40,
            }}
          />
          <Text
            accessibilityRole="header"
            size="l"
            variant="label"
            style={{ color: tokens.neutral94 }}
          >
            {label}
          </Text>
          {children}
          <Pressable
            accessibilityLabel="Close drawer"
            accessibilityRole="button"
            onPress={requestClose}
            style={{ alignSelf: 'flex-end', padding: tokens.space2xs }}
          >
            <Text size="s" variant="label" style={{ color: tokens.neutral70 }}>
              Close
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export type ToastVariant = 'neutral' | 'success' | 'warning' | 'danger';
export type ToastProps = React.PropsWithChildren<{
  label?: string;
  variant?: ToastVariant;
}>;

export function Toast({ children, label = 'Notification', variant = 'neutral' }: ToastProps) {
  const { tokens } = useTaleTheme();
  const accent =
    variant === 'success'
      ? tokens.success60
      : variant === 'warning'
        ? tokens.warning60
        : variant === 'danger'
          ? tokens.error60
          : tokens.neutral60;
  return (
    <View
      accessible
      accessibilityLabel={label}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={{
        backgroundColor: tokens.neutral10,
        borderColor: tokens.neutral20,
        borderLeftColor: accent,
        borderLeftWidth: 4,
        borderRadius: tokens.radiusM,
        borderWidth: 1,
        boxShadow: shadow(tokens).xl,
        gap: tokens.spaceXs,
        maxWidth: 384,
        padding: tokens.spaceXs,
        width: '100%',
      }}
    >
      <Text size="s" style={{ color: tokens.neutral90 }}>
        {children}
      </Text>
    </View>
  );
}
