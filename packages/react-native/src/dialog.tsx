import * as React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { scrim, shadow, transparentColor } from './_style-utils';
import { Text } from './text';
import { useTaleTheme } from './provider';

export type DialogProps = React.PropsWithChildren<{
  isOpen: boolean;
  title: string;
  onOpenChange: (open: boolean) => void;
  type?: 'dialog' | 'alert';
}>;

export function Dialog({ children, isOpen, title, onOpenChange, type = 'dialog' }: DialogProps) {
  const { tokens } = useTaleTheme();
  return (
    <Modal
      accessibilityViewIsModal
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
      transparent
      visible={isOpen}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: scrim(tokens),
          flex: 1,
          justifyContent: 'center',
          padding: tokens.spaceS,
        }}
      >
        <View
          accessible
          accessibilityLabel={title}
          style={{
            backgroundColor: tokens.neutral10,
            borderColor: tokens.neutral20,
            borderRadius: tokens.radiusXl,
            borderWidth: 1,
            boxShadow: shadow(tokens).l,
            flexDirection: 'column',
            gap: tokens.spaceXs,
            maxHeight: 640,
            maxWidth: type === 'alert' ? 440 : 480,
            padding: tokens.spaceS,
            width: '90%',
          }}
        >
          <Text
            accessibilityRole="header"
            size="l"
            variant="label"
            style={{
              color: tokens.neutral94,
              paddingRight: tokens.spaceM,
            }}
          >
            {title}
          </Text>
          <View style={{ gap: tokens.spaceXs }}>{children}</View>
          <Pressable
            accessibilityLabel="Close"
            accessibilityRole="button"
            onPress={() => onOpenChange(false)}
            style={({ pressed }) => ({
              alignSelf: 'flex-end',
              // The resting close action intentionally has no painted surface.
              backgroundColor: pressed ? tokens.neutral18 : transparentColor(tokens),
              borderRadius: tokens.radiusS,
              paddingHorizontal: tokens.space2xs,
              paddingVertical: tokens.space4xs,
            })}
          >
            <Text size="s" variant="label" style={{ color: tokens.neutral60 }}>
              Close
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
