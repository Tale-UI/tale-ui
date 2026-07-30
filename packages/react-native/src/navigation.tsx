/* eslint-disable no-nested-ternary -- Pagination states mirror the CSS selector matrix. */
import * as React from 'react';
import { Pressable, type TextStyle, type ViewProps } from 'react-native';
import { focusRing, transparentColor, useInteractionState } from './_style-utils';
import { Row } from './row';
import { Text } from './text';
import { useTaleTheme } from './provider';

export function Toolbar({ style, ...props }: ViewProps) {
  const { tokens } = useTaleTheme();
  return (
    <Row
      accessibilityLabel="Toolbar"
      gap="4xs"
      {...props}
      style={[
        {
          backgroundColor: tokens.neutral12,
          borderColor: tokens.neutral20,
          borderRadius: tokens.radiusL,
          borderWidth: 1,
          paddingHorizontal: tokens.space3xs,
          paddingVertical: tokens.space4xs,
        },
        style,
      ]}
    />
  );
}

export function Breadcrumbs({ children, style, ...props }: ViewProps) {
  const { tokens } = useTaleTheme();
  const items = React.Children.toArray(children);
  return (
    <Row accessibilityLabel="Breadcrumbs" gap="3xs" {...props} style={style}>
      {items.map((child, index) => (
        <React.Fragment key={index}>
          <Text
            style={{
              color: index === items.length - 1 ? tokens.neutral90 : tokens.neutral60,
              fontWeight: String(
                index === items.length - 1 ? tokens.titleFontWeight : tokens.textFontWeight,
              ) as TextStyle['fontWeight'],
            }}
          >
            {child}
          </Text>
          {index < items.length - 1 ? <Text style={{ color: tokens.neutral40 }}>/</Text> : null}
        </React.Fragment>
      ))}
    </Row>
  );
}

export type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label?: string;
};

function PageButton({
  label,
  current,
  disabled,
  onPress,
}: {
  label: string;
  current?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  const { tokens } = useTaleTheme();
  const { hovered, focused, interactionHandlers } = useInteractionState();
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: current }}
      disabled={disabled || current}
      onPress={onPress}
      {...interactionHandlers}
      style={[
        {
          alignItems: 'center',
          // Non-current pagination controls intentionally have no painted surface or border.
          backgroundColor: current
            ? tokens.color60
            : hovered
              ? tokens.neutral12
              : transparentColor(tokens),
          borderColor: current ? tokens.color60 : transparentColor(tokens),
          borderRadius: tokens.radiusS,
          borderWidth: 1,
          height: 32,
          justifyContent: 'center',
          minWidth: 32,
          opacity: disabled ? 0.45 : 1,
          paddingHorizontal: tokens.space3xs,
        },
        focused ? focusRing(tokens) : undefined,
      ]}
    >
      <Text
        size="s"
        style={{
          color: current ? tokens.color60Fg : hovered ? tokens.neutral90 : tokens.neutral70,
          fontWeight: String(
            current ? tokens.titleFontWeight : tokens.labelFontWeight,
          ) as TextStyle['fontWeight'],
          lineHeight: tokens.textSFontSize * tokens.textLineHeight,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  label = 'Pagination',
}: PaginationProps) {
  const visiblePages = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
    if (totalPages <= 5) {
      return index + 1;
    }
    const start = Math.min(Math.max(1, page - 2), totalPages - 4);
    return start + index;
  });
  return (
    <Row accessibilityLabel={label} gap="4xs">
      <PageButton disabled={page <= 1} label="Previous" onPress={() => onPageChange(page - 1)} />
      {visiblePages.map((visiblePage) => (
        <PageButton
          current={visiblePage === page}
          key={visiblePage}
          label={String(visiblePage)}
          onPress={() => onPageChange(visiblePage)}
        />
      ))}
      <PageButton
        disabled={page >= totalPages}
        label="Next"
        onPress={() => onPageChange(page + 1)}
      />
    </Row>
  );
}
