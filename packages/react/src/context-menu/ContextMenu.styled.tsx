import * as React from 'react';
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  Popover as AriaPopover,
  Pressable,
  Separator as AriaSeparator,
} from 'react-aria-components';
import type {
  MenuProps as AriaMenuProps,
  MenuItemProps as AriaMenuItemProps,
  MenuSectionProps as AriaMenuSectionProps,
  MenuTriggerProps as AriaMenuTriggerProps,
  PopoverProps as AriaPopoverProps,
  SeparatorProps as AriaSeparatorProps,
} from 'react-aria-components';
import { cx } from '../_cx';

/* ─── Root (right-click context menu controller) ─────────────────────────── */

type Size = 'sm' | 'md';

export interface RootProps extends Omit<AriaMenuTriggerProps, 'children' | 'trigger'> {
  children: React.ReactNode;
  /** Size of context menu items. @default 'md' */
  size?: Size | undefined;
}

/**
 * A context menu that opens through mouse, keyboard, or touch input.
 * It uses React Aria's context-menu MenuTrigger while retaining Tale UI's
 * public namespace and shared menu styling.
 *
 * @example
 * ```tsx
 * import { ContextMenu } from '@tale-ui/react/context-menu';
 *
 * <ContextMenu.Root>
 *   <ContextMenu.Trigger>Right-click here</ContextMenu.Trigger>
 *   <ContextMenu.Popup>
 *     <ContextMenu.MenuList>
 *       <ContextMenu.Item id="cut">Cut</ContextMenu.Item>
 *       <ContextMenu.Item id="copy">Copy</ContextMenu.Item>
 *       <ContextMenu.Separator />
 *       <ContextMenu.Item id="paste">Paste</ContextMenu.Item>
 *     </ContextMenu.MenuList>
 *   </ContextMenu.Popup>
 * </ContextMenu.Root>
 * ```
 */
export function Root({ children, size = 'md', ...props }: RootProps) {
  return (
    <ContextMenuContext.Provider value={{ size }}>
      <AriaMenuTrigger trigger="contextMenu" {...props}>
        {children}
      </AriaMenuTrigger>
    </ContextMenuContext.Provider>
  );
}
Root.displayName = 'ContextMenu.Root';

interface ContextMenuContextValue {
  size: Size;
}

const ContextMenuContext = React.createContext<ContextMenuContextValue>({
  size: 'md',
});

/* ─── Trigger (right-click area) ─────────────────────────────────────────── */

export type TriggerProps = React.HTMLAttributes<HTMLDivElement> & { className?: string };

export const Trigger = React.forwardRef<HTMLDivElement, TriggerProps>(
  ({ className, ...props }, ref) => (
    <Pressable ref={ref}>
      <div
        className={cx('tale-context-menu__trigger', className)}
        role="button"
        tabIndex={0}
        {...props}
      />
    </Pressable>
  ),
);
Trigger.displayName = 'ContextMenu.Trigger';

/* ─── Popup (positioned at cursor) ───────────────────────────────────────── */

export type PopupProps = Omit<AriaPopoverProps, 'className' | 'isOpen' | 'triggerRef' | 'style'> & {
  className?: string;
};

export const Popup = React.forwardRef<HTMLDivElement, PopupProps>(
  ({ className, ...props }, ref) => (
    <AriaPopover ref={ref} className={cx('tale-context-menu', className)} {...props} />
  ),
);
Popup.displayName = 'ContextMenu.Popup';

/* ─── MenuList ───────────────────────────────────────────────────────────── */

export function MenuList<T extends object>(
  props: Omit<AriaMenuProps<T>, 'className'> & { className?: string },
) {
  const { className, ...rest } = props;
  const { size } = React.useContext(ContextMenuContext);
  const sizeClass = size !== 'md' ? ` tale-context-menu__list--${size}` : '';
  return <AriaMenu className={cx(`tale-context-menu__list${sizeClass}`, className)} {...rest} />;
}
MenuList.displayName = 'ContextMenu.MenuList';

/* ─── Item ───────────────────────────────────────────────────────────────── */

export const Item = React.forwardRef<
  HTMLDivElement,
  Omit<AriaMenuItemProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <AriaMenuItem ref={ref} className={cx('tale-context-menu__item', className)} {...props} />
));
Item.displayName = 'ContextMenu.Item';

/* ─── Group ──────────────────────────────────────────────────────────────── */

export function Group<T extends object>(
  props: Omit<AriaMenuSectionProps<T>, 'className'> & { className?: string },
) {
  const { className, ...rest } = props;
  return <AriaMenuSection className={cx('tale-context-menu__group', className)} {...rest} />;
}
Group.displayName = 'ContextMenu.Group';

/* ─── Separator ──────────────────────────────────────────────────────────── */

export const Separator = React.forwardRef<
  HTMLElement,
  Omit<AriaSeparatorProps, 'className'> & { className?: string }
>(({ className, ...props }, ref) => (
  <AriaSeparator ref={ref} className={cx('tale-context-menu__separator', className)} {...props} />
));
Separator.displayName = 'ContextMenu.Separator';
