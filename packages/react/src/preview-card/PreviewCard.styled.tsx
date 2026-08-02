import * as React from 'react';
import {
  PreviewTrigger as AriaPreviewTrigger,
  Pressable,
  Popover,
  Dialog,
  OverlayArrow,
} from 'react-aria-components';
import type {
  PreviewTriggerProps as AriaPreviewTriggerProps,
  PopoverProps,
  DialogProps,
  OverlayArrowProps,
} from 'react-aria-components';
import { cx } from '../_cx';

// ── Root ─────────────────────────────────────────────────────────────────────

export interface RootProps extends Omit<AriaPreviewTriggerProps, 'children'> {
  children: React.ReactNode;
  /** Delay in ms before opening on hover. @default 400 */
  delay?: number;
  /** Delay in ms before closing after hover ends. @default 300 */
  closeDelay?: number;
}

/**
 * A non-modal preview card that opens on hover, keyboard focus, or long press.
 *
 * @example
 * ```tsx
 * import { PreviewCard } from '@tale-ui/react/preview-card';
 *
 * <PreviewCard.Root>
 *   <PreviewCard.Trigger>Hover to preview</PreviewCard.Trigger>
 *   <PreviewCard.Popup placement="bottom" offset={8}>
 *     <PreviewCard.Content aria-label="Preview">
 *       <p>Preview content here</p>
 *     </PreviewCard.Content>
 *   </PreviewCard.Popup>
 * </PreviewCard.Root>
 * ```
 */
export const Root: React.FC<RootProps> = ({ delay = 400, closeDelay = 300, ...props }) => (
  <AriaPreviewTrigger delay={delay} closeDelay={closeDelay} {...props} />
);
Root.displayName = 'PreviewCard.Root';

// ── Trigger ──────────────────────────────────────────────────────────────────

export interface TriggerProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

/**
 * The preview target. Text-only children become a focusable button-like target.
 * A nested Tale UI Link remains the focusable target for link previews.
 */
export const Trigger = React.forwardRef<HTMLSpanElement, TriggerProps>(
  ({ className, children, ...props }, ref) => {
    const hasElementChild = React.Children.toArray(children).some(React.isValidElement);
    const trigger = (
      <span
        ref={ref}
        className={cx('tale-preview-card__trigger', className)}
        role={hasElementChild ? undefined : 'button'}
        tabIndex={hasElementChild ? undefined : 0}
        {...props}
      >
        {children}
      </span>
    );

    return hasElementChild ? trigger : <Pressable>{trigger}</Pressable>;
  },
);
Trigger.displayName = 'PreviewCard.Trigger';

// ── Arrow ────────────────────────────────────────────────────────────────────

export type ArrowProps = Omit<OverlayArrowProps, 'className'> & { className?: string };

const StyledArrow = React.forwardRef<HTMLDivElement, ArrowProps>(
  ({ className, children, ...props }, ref) => (
    <OverlayArrow
      ref={ref}
      className={cx('tale-preview-card__arrow', className as string | undefined)}
      {...props}
    >
      {children ?? (
        <svg viewBox="0 0 8 8" aria-hidden="true">
          <path d="M0 0 L4 4 L8 0 Z" />
        </svg>
      )}
    </OverlayArrow>
  ),
);
StyledArrow.displayName = 'PreviewCard.Arrow';
export const Arrow = StyledArrow;

// ── Popup ────────────────────────────────────────────────────────────────────

export const Popup = React.forwardRef<
  HTMLDivElement,
  Omit<PopoverProps, 'className' | 'isOpen' | 'triggerRef'> & { className?: string }
>(({ className, children, ...props }, ref) => {
  const arrowChildren: React.ReactNode[] = [];
  const otherChildren: React.ReactNode[] = [];

  React.Children.forEach(children as React.ReactNode, (child) => {
    if (React.isValidElement(child) && child.type === StyledArrow) {
      arrowChildren.push(child);
    } else {
      otherChildren.push(child);
    }
  });

  return (
    <Popover ref={ref} className={cx('tale-preview-card__popup', className)} {...props}>
      {arrowChildren}
      {otherChildren}
    </Popover>
  );
});
Popup.displayName = 'PreviewCard.Popup';

// ── Content ──────────────────────────────────────────────────────────────────

export const Content = React.forwardRef<
  HTMLElement,
  Omit<DialogProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <Dialog ref={ref} className={cx('tale-preview-card', className)} {...props} />
));
Content.displayName = 'PreviewCard.Content';
