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

export type RowProps = ViewProps & {
  gap?: Gap;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
};

export function Row({
  gap = 'm',
  align = 'center',
  justify = 'start',
  wrap = false,
  style,
  ...props
}: RowProps) {
  const { tokens } = useTaleTheme();
  return (
    <View
      {...props}
      style={[
        {
          alignItems: alignValue(align),
          flexDirection: 'row',
          flexWrap: wrap ? 'wrap' : 'nowrap',
          gap: gapValue(tokens, gap),
          justifyContent: justifyValue(justify),
        },
        style,
      ]}
    />
  );
}
