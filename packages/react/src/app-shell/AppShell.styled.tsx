import * as React from 'react';
import { cx } from '../_cx';

export interface AppShellRootProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  /** Reserve a desktop sidebar column. @default true */
  hasSidebar?: boolean | undefined;
  className?: string | undefined;
}

/**
 * Structural application-shell slots for composing Tale navigation and content.
 *
 * @example
 * ```tsx
 * import { AppShell } from '@tale-ui/react/app-shell';
 * import { HeaderNav } from '@tale-ui/react/header-nav';
 * import { Sidebar } from '@tale-ui/react/sidebar';
 *
 * <AppShell.Root>
 *   <AppShell.SkipLink />
 *   <AppShell.Header><HeaderNav.Root>Header</HeaderNav.Root></AppShell.Header>
 *   <AppShell.Sidebar><Sidebar.Root>Navigation</Sidebar.Root></AppShell.Sidebar>
 *   <AppShell.Main>Route content</AppShell.Main>
 * </AppShell.Root>
 * ```
 *
 * @status experimental
 */
export const Root = React.forwardRef<HTMLDivElement, AppShellRootProps>(
  ({ hasSidebar = true, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx(
        `tale-app-shell ${hasSidebar ? 'tale-app-shell--with-sidebar' : ''}`,
        className,
      )}
      {...props}
    />
  ),
);
Root.displayName = 'AppShell.Root';

export interface AppShellHeaderProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  className?: string | undefined;
}

/**
 * Header grid slot. Compose `HeaderNav.Root` inside it to provide the header
 * landmark and interactions.
 *
 * @status experimental
 */
export const Header = React.forwardRef<HTMLDivElement, AppShellHeaderProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-app-shell__header', className)} {...props} />
  ),
);
Header.displayName = 'AppShell.Header';

export interface AppShellSidebarProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  className?: string | undefined;
}

/**
 * Desktop sidebar grid slot. Compose `Sidebar.Root` inside it for the aside
 * landmark and navigation.
 *
 * @status experimental
 */
export const Sidebar = React.forwardRef<HTMLDivElement, AppShellSidebarProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-app-shell__sidebar', className)} {...props} />
  ),
);
Sidebar.displayName = 'AppShell.Sidebar';

export interface AppShellMainProps
  extends Omit<React.ComponentPropsWithoutRef<'main'>, 'className'> {
  className?: string | undefined;
}

/**
 * Main application content and the default target for `AppShell.SkipLink`.
 *
 * @status experimental
 */
export const Main = React.forwardRef<HTMLElement, AppShellMainProps>(
  ({ id = 'main-content', className, tabIndex = -1, ...props }, ref) => (
    <main
      ref={ref}
      id={id}
      tabIndex={tabIndex}
      className={cx('tale-app-shell__main', className)}
      {...props}
    />
  ),
);
Main.displayName = 'AppShell.Main';

export interface AppShellMobileNavigationProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  className?: string | undefined;
}

/**
 * Responsive-only slot for `Drawer` or `HeaderNav` mobile navigation.
 *
 * @status experimental
 */
export const MobileNavigation = React.forwardRef<
  HTMLDivElement,
  AppShellMobileNavigationProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cx('tale-app-shell__mobile-navigation', className)}
    {...props}
  />
));
MobileNavigation.displayName = 'AppShell.MobileNavigation';

export interface AppShellSkipLinkProps
  extends Omit<React.ComponentPropsWithoutRef<'a'>, 'className'> {
  className?: string | undefined;
}

/**
 * Keyboard bypass link targeting `AppShell.Main`.
 *
 * @status experimental
 */
export const SkipLink = React.forwardRef<HTMLAnchorElement, AppShellSkipLinkProps>(
  ({ href = '#main-content', className, children = 'Skip to main content', ...props }, ref) => (
    <a
      ref={ref}
      href={href}
      className={cx('tale-app-shell__skip-link', className)}
      {...props}
    >
      {children}
    </a>
  ),
);
SkipLink.displayName = 'AppShell.SkipLink';
