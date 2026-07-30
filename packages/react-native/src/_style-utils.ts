/* eslint-disable no-nested-ternary -- Token-backed variant tables are clearest as expressions. */
import type { ResolvedTokenMap } from '@tale-ui/foundations/theme';
import { Platform, type PressableProps, type TextStyle, type ViewStyle } from 'react-native';
import * as React from 'react';

export type ControlSize = 'sm' | 'md' | 'lg';
export type Gap = '4xs' | '3xs' | '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl';
export type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type Justify = 'start' | 'center' | 'end' | 'between';

export const disabledOpacity = 0.45;
export const pendingOpacity = 0.7;

const normalizeHex = (color: string): string | undefined => {
  const match = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(color);
  if (!match) {
    return undefined;
  }
  const value = match[1];
  return value.length === 3
    ? value
        .split('')
        .map((character) => `${character}${character}`)
        .join('')
    : value;
};

export const alpha = (color: string, opacity: number): string => {
  const hex = normalizeHex(color);
  if (!hex) {
    return color;
  }
  const channel = Math.round(Math.max(0, Math.min(1, opacity)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `#${hex}${channel}`;
};

export const transparentColor = (tokens: ResolvedTokenMap): string =>
  alpha(tokens.neutralDefault100, 0);

export const mix = (foreground: string, foregroundWeight: number, background: string): string => {
  const foregroundHex = normalizeHex(foreground);
  const backgroundHex = normalizeHex(background);
  if (!foregroundHex || !backgroundHex) {
    return foreground;
  }
  const weight = Math.max(0, Math.min(1, foregroundWeight));
  const channels = [0, 2, 4].map((offset) => {
    const foregroundChannel = Number.parseInt(foregroundHex.slice(offset, offset + 2), 16);
    const backgroundChannel = Number.parseInt(backgroundHex.slice(offset, offset + 2), 16);
    return Math.round(foregroundChannel * weight + backgroundChannel * (1 - weight))
      .toString(16)
      .padStart(2, '0');
  });
  return `#${channels.join('')}`;
};

export const scrim = (tokens: ResolvedTokenMap, opacity = 0.48): string =>
  alpha(tokens.neutralDefault100, opacity);

export const shadow = (tokens: ResolvedTokenMap) =>
  ({
    xs: `0 1px 2px ${alpha(tokens.neutralDefault100, 0.15)}`,
    s: `0 1.5px 3px ${alpha(tokens.neutralDefault100, 0.15)}`,
    m: `0 4px 4px -10px ${alpha(tokens.neutralDefault100, 0.04)}, 0 13px 13px -10px ${alpha(tokens.neutralDefault100, 0.06)}, 0 40px 60px -10px ${alpha(tokens.neutralDefault100, 0.08)}`,
    l: `0 2.7px 3.6px -5px ${alpha(tokens.neutralDefault100, 0.04)}, 0 7.5px 10px -5px ${alpha(tokens.neutralDefault100, 0.06)}, 0 18px 24.1px -5px ${alpha(tokens.neutralDefault100, 0.08)}, 0 60px 80px -5px ${alpha(tokens.neutralDefault100, 0.1)}`,
    xl: `2.8px 2.8px 2.2px ${alpha(tokens.neutralDefault100, 0.02)}, 0 6.7px 5.3px -5px ${alpha(tokens.neutralDefault100, 0.04)}, 0 12.5px 10px -5px ${alpha(tokens.neutralDefault100, 0.06)}, 0 22.3px 17.9px -5px ${alpha(tokens.neutralDefault100, 0.08)}, 0 41.8px 33.4px -5px ${alpha(tokens.neutralDefault100, 0.1)}, 0 80px 80px -5px ${alpha(tokens.neutralDefault100, 0.105)}`,
  }) as const;

export const focusRing = (tokens: ResolvedTokenMap): ViewStyle => ({
  boxShadow: `0 0 0 2px ${tokens.neutral100}, 0 0 0 4px ${tokens.neutral50}`,
});

export const fieldFocusRing = (tokens: ResolvedTokenMap): ViewStyle => ({
  boxShadow: `0 0 0 3px ${alpha(tokens.neutral60, 0.3)}`,
});

export const insetSelectionRing = (color: string, width: number): ViewStyle => ({
  boxShadow: `inset 0 0 0 ${width}px ${color}`,
});

export const gapValue = (tokens: ResolvedTokenMap, gap: Gap): number => {
  const values: Record<Gap, number> = {
    '4xs': tokens.space4xs,
    '3xs': tokens.space3xs,
    '2xs': tokens.space2xs,
    xs: tokens.spaceXs,
    s: tokens.spaceS,
    m: tokens.spaceM,
    l: tokens.spaceL,
    xl: tokens.spaceXl,
    '2xl': tokens.space2xl,
  };
  return values[gap];
};

export const alignValue = (align: Align): ViewStyle['alignItems'] => {
  const values: Record<Align, ViewStyle['alignItems']> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
    baseline: 'baseline',
  };
  return values[align];
};

export const justifyValue = (justify: Justify): ViewStyle['justifyContent'] => {
  const values: Record<Justify, ViewStyle['justifyContent']> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
  };
  return values[justify];
};

export const controlMetrics = (
  tokens: ResolvedTokenMap,
  size: ControlSize,
): Readonly<{
  minHeight: number;
  paddingHorizontal: number;
  paddingVertical: number;
  gap: number;
  radius: number;
  fontSize: number;
}> => {
  if (size === 'sm') {
    return {
      minHeight: tokens.spaceM,
      paddingHorizontal: tokens.space2xs,
      paddingVertical: tokens.space4xs,
      gap: tokens.space4xs,
      radius: tokens.radiusS,
      fontSize: tokens.labelSFontSize,
    };
  }
  if (size === 'lg') {
    return {
      minHeight: 44,
      paddingHorizontal: tokens.spaceS,
      paddingVertical: tokens.space2xs,
      gap: tokens.space2xs,
      radius: tokens.radiusM,
      fontSize: tokens.labelMFontSize,
    };
  }
  return {
    minHeight: 36,
    paddingHorizontal: tokens.spaceXs,
    paddingVertical: tokens.space2xs,
    gap: tokens.space3xs,
    radius: tokens.radiusM,
    fontSize: tokens.labelMFontSize,
  };
};

export type TextVariant = 'display' | 'heading' | 'title' | 'label' | 'text' | 'mono';
export type TextSize = 'xs' | 's' | 'm' | 'l';
export type TextColor = 'default' | 'muted' | 'accent';

export const platformFontFamily = (family: string, monospace = false): string =>
  Platform.OS === 'web' ? `${family}, ${monospace ? 'monospace' : 'sans-serif'}` : family;

export const typography = (
  tokens: ResolvedTokenMap,
  variant: TextVariant,
  size: TextSize,
  color: TextColor = 'default',
): TextStyle => {
  const fontSizes = {
    display: {
      xs: tokens.displaySFontSize,
      s: tokens.displaySFontSize,
      m: tokens.displayMFontSize,
      l: tokens.displayLFontSize,
    },
    heading: {
      xs: tokens.headingSFontSize,
      s: tokens.headingSFontSize,
      m: tokens.headingMFontSize,
      l: tokens.headingLFontSize,
    },
    title: {
      xs: tokens.titleSFontSize,
      s: tokens.titleSFontSize,
      m: tokens.titleMFontSize,
      l: tokens.titleLFontSize,
    },
    label: {
      xs: tokens.labelXsFontSize,
      s: tokens.labelSFontSize,
      m: tokens.labelMFontSize,
      l: tokens.labelLFontSize,
    },
    text: {
      xs: tokens.textXsFontSize,
      s: tokens.textSFontSize,
      m: tokens.textMFontSize,
      l: tokens.textLFontSize,
    },
    mono: {
      xs: tokens.monoXsFontSize,
      s: tokens.monoSFontSize,
      m: tokens.monoMFontSize,
      l: tokens.monoLFontSize,
    },
  } as const;
  const families = {
    display: tokens.displayFontFamily,
    heading: tokens.headingFontFamily,
    title: tokens.titleFontFamily,
    label: tokens.labelFontFamily,
    text: tokens.textFontFamily,
    mono: tokens.monoFontFamily,
  } as const;
  const weights = {
    display: tokens.displayFontWeight,
    heading: tokens.headingFontWeight,
    title: tokens.titleFontWeight,
    label: tokens.labelFontWeight,
    text: tokens.textFontWeight,
    mono: tokens.monoFontWeight,
  } as const;
  const lineHeights = {
    display: tokens.displayLineHeight,
    heading: tokens.headingLineHeight,
    title: tokens.titleLineHeight,
    label: tokens.labelLineHeight,
    text: tokens.textLineHeight,
    mono: tokens.monoLineHeight,
  } as const;
  const fontSize = fontSizes[variant][size];
  return {
    color:
      color === 'muted' ? tokens.neutral60 : color === 'accent' ? tokens.color60 : tokens.textColor,
    fontFamily: platformFontFamily(families[variant], variant === 'mono'),
    fontSize,
    fontWeight: String(weights[variant]) as TextStyle['fontWeight'],
    lineHeight: fontSize * lineHeights[variant],
  };
};

export const fieldControl = (tokens: ResolvedTokenMap, size: ControlSize = 'md'): TextStyle => {
  if (size === 'sm') {
    return {
      fontFamily: platformFontFamily(tokens.textFontFamily),
      minHeight: tokens.spaceM,
      paddingHorizontal: tokens.space3xs,
      paddingVertical: tokens.space4xs,
      fontSize: tokens.textSFontSize,
      fontWeight: String(tokens.textFontWeight) as TextStyle['fontWeight'],
      lineHeight: tokens.textSFontSize * tokens.textLineHeight,
    };
  }
  if (size === 'lg') {
    return {
      fontFamily: platformFontFamily(tokens.textFontFamily),
      minHeight: 44,
      paddingHorizontal: tokens.spaceXs,
      paddingVertical: tokens.space2xs,
      fontSize: tokens.textLFontSize,
      fontWeight: String(tokens.textFontWeight) as TextStyle['fontWeight'],
      lineHeight: tokens.textLFontSize * tokens.textLineHeight,
    };
  }
  return {
    fontFamily: platformFontFamily(tokens.textFontFamily),
    minHeight: 36,
    paddingHorizontal: tokens.space2xs,
    paddingVertical: tokens.space3xs,
    fontSize: tokens.textMFontSize,
    fontWeight: String(tokens.textFontWeight) as TextStyle['fontWeight'],
    lineHeight: tokens.textMFontSize * tokens.textLineHeight,
  };
};

type InteractionHandlers = Pick<PressableProps, 'onBlur' | 'onFocus' | 'onHoverIn' | 'onHoverOut'>;

export const useInteractionState = (handlers: InteractionHandlers = {}) => {
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  return {
    hovered,
    focused,
    interactionHandlers: {
      onHoverIn: (event: Parameters<NonNullable<PressableProps['onHoverIn']>>[0]) => {
        setHovered(true);
        handlers.onHoverIn?.(event);
      },
      onHoverOut: (event: Parameters<NonNullable<PressableProps['onHoverOut']>>[0]) => {
        setHovered(false);
        handlers.onHoverOut?.(event);
      },
      onFocus: (event: Parameters<NonNullable<PressableProps['onFocus']>>[0]) => {
        setFocused(true);
        handlers.onFocus?.(event);
      },
      onBlur: (event: Parameters<NonNullable<PressableProps['onBlur']>>[0]) => {
        setFocused(false);
        handlers.onBlur?.(event);
      },
    },
  };
};
