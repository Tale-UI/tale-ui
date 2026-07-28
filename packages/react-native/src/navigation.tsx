import * as React from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import { Row } from './row';
import { Text } from './text';

export function Toolbar(props: ViewProps) {
  return <Row accessibilityLabel="Toolbar" {...props} />;
}

export function Breadcrumbs(props: ViewProps) {
  return <Row accessibilityLabel="Breadcrumbs" {...props} />;
}

export type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <View accessibilityLabel="Pagination">
      <Pressable
        accessibilityLabel="Previous"
        accessibilityRole="button"
        disabled={page <= 1}
        onPress={() => onPageChange(page - 1)}
      >
        <Text>Previous</Text>
      </Pressable>
      <Text>{`Page ${page} of ${totalPages}`}</Text>
      <Pressable
        accessibilityLabel="Next"
        accessibilityRole="button"
        disabled={page >= totalPages}
        onPress={() => onPageChange(page + 1)}
      >
        <Text>Next</Text>
      </Pressable>
    </View>
  );
}
