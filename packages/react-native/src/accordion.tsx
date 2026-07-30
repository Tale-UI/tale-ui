import * as React from 'react';
import { Pressable, View } from 'react-native';
import { focusRing, transparentColor, useInteractionState } from './_style-utils';
import { Text } from './text';
import { useTaleTheme } from './provider';

export type AccordionItem = Readonly<{
  id: string;
  title: string;
  content: React.ReactNode;
  isDisabled?: boolean;
  defaultExpanded?: boolean;
}>;
export type AccordionProps = {
  items: readonly AccordionItem[];
  allowsMultipleExpanded?: boolean;
  isDisabled?: boolean;
};

function AccordionRow({
  item,
  expanded,
  onExpandedChange,
  isLast,
  isDisabled,
}: {
  item: AccordionItem;
  expanded: boolean;
  onExpandedChange: () => void;
  isLast: boolean;
  isDisabled: boolean;
}) {
  const { tokens } = useTaleTheme();
  const { hovered, focused, interactionHandlers } = useInteractionState();
  return (
    <View
      style={{
        borderBottomColor: tokens.neutral20,
        borderBottomWidth: isLast ? 0 : 1,
        width: '100%',
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, expanded }}
        disabled={isDisabled}
        onPress={onExpandedChange}
        {...interactionHandlers}
        style={[
          {
            alignItems: 'center',
            backgroundColor: hovered ? tokens.neutral12 : transparentColor(tokens),
            flexDirection: 'row',
            gap: tokens.spaceXs,
            justifyContent: 'space-between',
            opacity: isDisabled ? 0.45 : 1,
            paddingBottom: tokens.spaceXs,
            paddingLeft: tokens.spaceXs,
            paddingRight: tokens.spaceM,
            paddingTop: tokens.spaceXs,
            width: '100%',
          },
          focused ? focusRing(tokens) : undefined,
        ]}
      >
        <Text variant="label" style={{ color: tokens.neutral90, flex: 1 }}>
          {item.title}
        </Text>
        <Text
          accessibilityElementsHidden
          size="s"
          style={{
            color: tokens.neutral50,
            transform: [{ rotate: expanded ? '180deg' : '0deg' }],
          }}
        >
          ⌄
        </Text>
      </Pressable>
      {expanded ? (
        <View style={{ paddingBottom: tokens.spaceXs, paddingHorizontal: tokens.spaceXs }}>
          {item.content}
        </View>
      ) : null}
    </View>
  );
}

export function Accordion({
  items,
  allowsMultipleExpanded = false,
  isDisabled = false,
}: AccordionProps) {
  const { tokens } = useTaleTheme();
  const [expandedIds, setExpandedIds] = React.useState<ReadonlySet<string>>(
    () => new Set(items.filter((item) => item.defaultExpanded).map((item) => item.id)),
  );
  const toggle = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(allowsMultipleExpanded ? current : []);
      if (current.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  return (
    <View
      style={{
        borderColor: tokens.neutral20,
        borderRadius: tokens.radiusL,
        borderWidth: 1,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {items.map((item, index) => (
        <AccordionRow
          expanded={expandedIds.has(item.id)}
          isDisabled={isDisabled || Boolean(item.isDisabled)}
          isLast={index === items.length - 1}
          item={item}
          key={item.id}
          onExpandedChange={() => toggle(item.id)}
        />
      ))}
    </View>
  );
}
