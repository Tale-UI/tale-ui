import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppShell } from '@tale-ui/react/app-shell';
import { HeaderNav } from '@tale-ui/react/header-nav';
import { Sidebar } from '@tale-ui/react/sidebar';
import { Text } from '@tale-ui/react/text';

const meta = {
  title: 'Components/AppShell',
  component: AppShell.Root,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AppShell.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SidebarLayout: Story = {
  render() {
    return (
      <AppShell.Root>
        <AppShell.SkipLink />
        <AppShell.Header>
          <HeaderNav.Root aria-label="Application header">
            <HeaderNav.Logo href="/">Tale</HeaderNav.Logo>
          </HeaderNav.Root>
        </AppShell.Header>
        <AppShell.Sidebar>
          <Sidebar.Root aria-label="Primary navigation">
            <Sidebar.Header>Workspace</Sidebar.Header>
            <Sidebar.NavList>
              <Sidebar.NavItem href="/" current>
                Overview
              </Sidebar.NavItem>
              <Sidebar.NavItem href="/settings">Settings</Sidebar.NavItem>
            </Sidebar.NavList>
          </Sidebar.Root>
        </AppShell.Sidebar>
        <AppShell.Main>
          <Text as="h1" variant="heading" size="l">
            Overview
          </Text>
          <Text>Application-owned route content.</Text>
        </AppShell.Main>
        <AppShell.MobileNavigation>Compose a Drawer here.</AppShell.MobileNavigation>
      </AppShell.Root>
    );
  },
};
