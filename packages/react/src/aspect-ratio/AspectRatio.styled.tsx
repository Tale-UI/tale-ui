import * as React from 'react';
import { cx } from '../_cx';

type SafeDomProps<T> = Omit<T, 'dangerouslySetInnerHTML'>;

export interface AspectRatioProps extends SafeDomProps<
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>
> {
  /** Sizing behavior for direct-child `img` and `video` elements. */
  objectFit?: 'cover' | 'contain' | undefined;
  /** Width-to-height ratio. Invalid runtime values fall back to `1`. @default 1 */
  ratio?: number | `${number}/${number}` | `${number} / ${number}` | undefined;
  children: React.ReactNode;
}

type RuntimeAspectRatioProps = AspectRatioProps & {
  dangerouslySetInnerHTML?: unknown;
  objectFit?: unknown;
  ratio?: unknown;
};

const DECIMAL = String.raw`(?:\d+(?:\.\d+)?|\.\d+)`;
const RATIO_PATTERN = new RegExp(`^(${DECIMAL})(?:/| / )(${DECIMAL})$`);

function normalizeRatio(ratio: unknown): number | string {
  if (typeof ratio === 'number') {
    return Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
  }

  if (typeof ratio !== 'string') {
    return 1;
  }

  const match = RATIO_PATTERN.exec(ratio);
  if (!match) {
    return 1;
  }

  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
    return 1;
  }

  return `${width} / ${height}`;
}

/**
 * A native CSS aspect-ratio container for media and other responsive content.
 *
 * @example
 * ```tsx
 * import { AspectRatio } from '@tale-ui/react/aspect-ratio';
 *
 * <AspectRatio ratio="16 / 9" objectFit="cover">
 *   <img src="/landscape.jpg" alt="A mountain landscape" />
 * </AspectRatio>
 * ```
 *
 * @status experimental
 */
export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  (
    {
      children,
      className,
      dangerouslySetInnerHTML: _dangerouslySetInnerHTML,
      objectFit,
      ratio = 1,
      style,
      ...props
    }: RuntimeAspectRatioProps,
    ref,
  ) => {
    const normalizedObjectFit =
      objectFit === 'cover' || objectFit === 'contain' ? objectFit : undefined;
    const objectFitClassName = normalizedObjectFit
      ? `tale-aspect-ratio--${normalizedObjectFit}`
      : undefined;

    return (
      <div
        {...props}
        ref={ref}
        className={cx(
          `tale-aspect-ratio${objectFitClassName ? ` ${objectFitClassName}` : ''}`,
          className,
        )}
        data-object-fit={normalizedObjectFit}
        style={{ ...style, aspectRatio: normalizeRatio(ratio) }}
      >
        {children}
      </div>
    );
  },
);
AspectRatio.displayName = 'AspectRatio';
