import * as React from 'react';
import { Pressable } from 'react-native';
import { Column } from './column';
import { Text } from './text';

export type DisclosureProps = React.PropsWithChildren<{
  title: string;
  isExpanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}>;

export function Disclosure({
  children,
  title,
  isExpanded,
  defaultExpanded = false,
  onExpandedChange,
}: DisclosureProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultExpanded);
  const expanded = isExpanded ?? uncontrolled;
  return (
    <Column>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => {
          const next = !expanded;
          if (isExpanded === undefined) {
            setUncontrolled(next);
          }
          onExpandedChange?.(next);
        }}
      >
        <Text>{title}</Text>
      </Pressable>
      {expanded ? children : null}
    </Column>
  );
}
