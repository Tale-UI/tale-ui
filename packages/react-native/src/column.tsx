import { View, type ViewProps } from 'react-native';
import {
  alignValue,
  gapValue,
  justifyValue,
  type Align,
  type Gap,
  type Justify,
} from './_style-utils';
import { useTaleTheme } from './provider';

export type ColumnProps = ViewProps & {
  gap?: Gap;
  align?: Align;
  justify?: Justify;
};

export function Column({
  gap = 'm',
  align = 'stretch',
  justify = 'start',
  style,
  ...props
}: ColumnProps) {
  const { tokens } = useTaleTheme();
  return (
    <View
      {...props}
      style={[
        {
          alignItems: alignValue(align),
          flexDirection: 'column',
          gap: gapValue(tokens, gap),
          justifyContent: justifyValue(justify),
        },
        style,
      ]}
    />
  );
}
