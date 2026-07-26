import * as React from 'react';
import { Group as AriaGroup } from 'react-aria-components';
import type { GroupProps as AriaGroupProps } from 'react-aria-components';
import { cx } from '../_cx';

type ButtonGroupAccessibleName =
  | {
      role?: 'group' | 'region';
      'aria-label': string;
      'aria-labelledby'?: never;
    }
  | {
      role?: 'group' | 'region';
      'aria-label'?: never;
      'aria-labelledby': string;
    }
  | {
      role: 'presentation';
      'aria-label'?: never;
      'aria-labelledby'?: never;
    };

export type ButtonGroupProps = Omit<
  AriaGroupProps,
  | 'children'
  | 'className'
  | 'style'
  | 'role'
  | 'aria-label'
  | 'aria-labelledby'
  | 'dangerouslySetInnerHTML'
> &
  ButtonGroupAccessibleName & {
    /** Layout axis. Invalid runtime values fall back to horizontal. */
    orientation?: 'horizontal' | 'vertical';
    /** Removes gaps and joins compatible action-control borders. */
    isAttached?: boolean;
    /** Static action controls. Render-function children are intentionally unsupported. */
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  };

type RuntimeButtonGroupInput = ButtonGroupProps & {
  dangerouslySetInnerHTML?: unknown;
};

function isAccessibleName(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function resolveAccessibleName(
  role: unknown,
  ariaLabel: unknown,
  ariaLabelledby: unknown,
): {
  role: 'group' | 'region' | 'presentation';
  'aria-label'?: string;
  'aria-labelledby'?: string;
} {
  if (role === 'presentation') {
    return ariaLabel === undefined && ariaLabelledby === undefined
      ? { role: 'presentation' }
      : { role: 'presentation' };
  }

  const resolvedRole = role === undefined || role === 'group' ? 'group' : role;
  const hasLabel = isAccessibleName(ariaLabel);
  const hasLabelledby = isAccessibleName(ariaLabelledby);

  if (resolvedRole === 'group' || resolvedRole === 'region') {
    if (hasLabel && !hasLabelledby) {
      return { role: resolvedRole, 'aria-label': ariaLabel };
    }

    if (hasLabelledby && !hasLabel) {
      return { role: resolvedRole, 'aria-labelledby': ariaLabelledby };
    }
  }

  return { role: 'presentation' };
}

/**
 * Groups related action controls without adding selection semantics.
 *
 * @status experimental
 *
 * @example
 * ```tsx
 * import { Button } from '@tale-ui/react/button';
 * import { ButtonGroup } from '@tale-ui/react/button-group';
 *
 * <ButtonGroup aria-label="Document actions" isAttached>
 *   <Button>Save</Button>
 *   <Button>Share</Button>
 * </ButtonGroup>
 * ```
 */
export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (runtimeProps, ref) => {
    const {
      children,
      className,
      style,
      role,
      orientation,
      isAttached,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      dangerouslySetInnerHTML: blockedDangerouslySetInnerHTML,
      ...rest
    } = runtimeProps as RuntimeButtonGroupInput;
    void blockedDangerouslySetInnerHTML;

    const resolvedOrientation = orientation === 'vertical' ? 'vertical' : 'horizontal';
    const resolvedAttached = isAttached === true;
    const accessibleName = resolveAccessibleName(role, ariaLabel, ariaLabelledby);
    const safeChildren = typeof children === 'function' ? null : children;
    const safeClassName = typeof className === 'string' ? className : undefined;
    const safeStyle =
      style !== null && typeof style === 'object' && !Array.isArray(style) ? style : undefined;

    return (
      <AriaGroup
        {...rest}
        {...accessibleName}
        ref={ref}
        data-orientation={resolvedOrientation}
        className={cx(
          [
            'tale-button-group',
            `tale-button-group--${resolvedOrientation}`,
            resolvedAttached ? 'tale-button-group--attached' : undefined,
          ]
            .filter(Boolean)
            .join(' '),
          safeClassName,
        )}
        style={safeStyle}
      >
        {safeChildren}
      </AriaGroup>
    );
  },
);
ButtonGroup.displayName = 'ButtonGroup';
