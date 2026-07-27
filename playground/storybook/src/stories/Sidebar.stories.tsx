import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayoutDashboard, Settings, Users } from 'lucide-react';
import { Sidebar } from '@tale-ui/react/sidebar';

type Args = {
  hideBorder: boolean;
  placeholder: string;
};

const meta: Meta<Args> = {
  title: 'Components/Sidebar',
  parameters: { layout: 'fullscreen' },
  argTypes: {
    hideBorder: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  args: {
    hideBorder: false,
    placeholder: 'Search navigation…',
  },
};

export default meta;

type Story = StoryObj<Args>;

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', current: true },
  { href: '/team', icon: Users, label: 'Team' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export const Default: Story = {
  render: (args) => (
    <div style={{ height: '100vh', display: 'flex' }}>
      <Sidebar.Root hideBorder={args.hideBorder}>
        <Sidebar.Header>
          <strong>MyApp</strong>
          <Sidebar.Search placeholder={args.placeholder} />
        </Sidebar.Header>
        <Sidebar.NavList>
          {navItems.map((item) => (
            <Sidebar.NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              current={item.current}
            >
              {item.label}
            </Sidebar.NavItem>
          ))}
        </Sidebar.NavList>
        <Sidebar.AccountCard name="Alex Chen" email="alex@example.com" />
      </Sidebar.Root>
    </div>
  ),
};

export const WithSearch: Story = {
  render: () => (
    <div style={{ height: '100vh', display: 'flex' }}>
      <Sidebar.Root>
        <Sidebar.Header>
          <strong>MyApp</strong>
          <Sidebar.Search placeholder="Search…" />
        </Sidebar.Header>
        <Sidebar.NavList>
          {navItems.map((item) => (
            <Sidebar.NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              current={item.current}
            >
              {item.label}
            </Sidebar.NavItem>
          ))}
        </Sidebar.NavList>
        <Sidebar.AccountCard name="Alex Chen" email="alex@example.com" status="online" />
      </Sidebar.Root>
    </div>
  ),
};

export const WithCollapsibleItem: Story = {
  render: () => (
    <div style={{ height: '100vh', display: 'flex' }}>
      <Sidebar.Root>
        <Sidebar.Header>
          <strong>MyApp</strong>
        </Sidebar.Header>
        <Sidebar.NavList>
          <Sidebar.NavItem href="/dashboard" icon={LayoutDashboard} current>
            Dashboard
          </Sidebar.NavItem>
          <Sidebar.NavItem
            icon={Users}
            items={[
              { href: '/team/members', label: 'Members', current: false },
              { href: '/team/invites', label: 'Invitations' },
            ]}
          >
            Team
          </Sidebar.NavItem>
          <Sidebar.NavItem href="/settings" icon={Settings}>
            Settings
          </Sidebar.NavItem>
        </Sidebar.NavList>
        <Sidebar.AccountCard name="Alex Chen" email="alex@example.com" />
      </Sidebar.Root>
    </div>
  ),
};

export const WithFeatureCard: Story = {
  render: () => (
    <div style={{ height: '100vh', display: 'flex' }}>
      <Sidebar.Root>
        <Sidebar.Header>
          <strong>MyApp</strong>
        </Sidebar.Header>
        <Sidebar.NavList>
          {navItems.map((item) => (
            <Sidebar.NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              current={item.current}
            >
              {item.label}
            </Sidebar.NavItem>
          ))}
        </Sidebar.NavList>
        <Sidebar.FeatureCard
          title="New Feature"
          description="Try our latest dashboard improvements."
          dismissLabel="Maybe later"
          onDismiss={() => undefined}
        />
        <Sidebar.AccountCard name="Alex Chen" email="alex@example.com" />
      </Sidebar.Root>
    </div>
  ),
};

export const WithDivider: Story = {
  render: () => (
    <div style={{ height: '100vh', display: 'flex' }}>
      <Sidebar.Root>
        <Sidebar.Header>
          <strong>MyApp</strong>
        </Sidebar.Header>
        <Sidebar.NavList>
          <Sidebar.NavItem href="/dashboard" icon={LayoutDashboard} current>
            Dashboard
          </Sidebar.NavItem>
          <Sidebar.NavItem href="/team" icon={Users}>
            Team
          </Sidebar.NavItem>
        </Sidebar.NavList>
        <Sidebar.Divider />
        <Sidebar.NavList>
          <Sidebar.NavItem href="/settings" icon={Settings}>
            Settings
          </Sidebar.NavItem>
        </Sidebar.NavList>
        <Sidebar.AccountCard name="Alex Chen" email="alex@example.com" />
      </Sidebar.Root>
    </div>
  ),
};
