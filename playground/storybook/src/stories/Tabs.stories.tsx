import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, Settings, User } from 'lucide-react';
import { Icon } from '@tale-ui/react/icon';
import { Tabs } from '@tale-ui/react/tabs';

type Args = {
  orientation?: 'horizontal' | 'vertical';
  isDisabled?: boolean;
  size: 'sm' | 'md';
  variant: 'underline' | 'pills' | 'enclosed';
  defaultSelectedKey: string;
};

const meta: Meta<Args> = {
  title: 'Components/Tabs',
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    isDisabled: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    variant: {
      control: 'select',
      options: ['underline', 'pills', 'enclosed'],
    },
    defaultSelectedKey: {
      control: 'select',
      options: ['tab1', 'tab2', 'tab3'],
    },
  },
  args: {
    orientation: 'horizontal',
    isDisabled: false,
    size: 'md',
    variant: 'underline',
    defaultSelectedKey: 'tab1',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Tabs.Root
      key={args.defaultSelectedKey}
      defaultSelectedKey={args.defaultSelectedKey}
      orientation={args.orientation}
      isDisabled={args.isDisabled}
    >
      <Tabs.List size={args.size} variant={args.variant}>
        <Tabs.Tab id="tab1">Account</Tabs.Tab>
        <Tabs.Tab id="tab2">Settings</Tabs.Tab>
        <Tabs.Tab id="tab3">Notifications</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel id="tab1">
        <div className="story-tab-panel">
          <p>Manage your account details and preferences.</p>
        </div>
      </Tabs.Panel>
      <Tabs.Panel id="tab2">
        <div className="story-tab-panel">
          <p>Configure application settings and behavior.</p>
        </div>
      </Tabs.Panel>
      <Tabs.Panel id="tab3">
        <div className="story-tab-panel">
          <p>Control how and when you receive notifications.</p>
        </div>
      </Tabs.Panel>
    </Tabs.Root>
  ),
};

export const Vertical: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <Tabs.Root defaultSelectedKey="tab1" orientation="vertical">
      <div className="story-tabs-vertical">
        <Tabs.List>
          <Tabs.Tab id="tab1">General</Tabs.Tab>
          <Tabs.Tab id="tab2">Security</Tabs.Tab>
          <Tabs.Tab id="tab3">Privacy</Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <div>
          <Tabs.Panel id="tab1">
            <div className="story-tab-panel">
              <p>General settings for your application.</p>
            </div>
          </Tabs.Panel>
          <Tabs.Panel id="tab2">
            <div className="story-tab-panel">
              <p>Security and authentication options.</p>
            </div>
          </Tabs.Panel>
          <Tabs.Panel id="tab3">
            <div className="story-tab-panel">
              <p>Privacy and data management preferences.</p>
            </div>
          </Tabs.Panel>
        </div>
      </div>
    </Tabs.Root>
  ),
};

export const WithDisabledTab: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <Tabs.Root defaultSelectedKey="tab1">
      <Tabs.List>
        <Tabs.Tab id="tab1">Active</Tabs.Tab>
        <Tabs.Tab id="tab2" isDisabled>
          Disabled
        </Tabs.Tab>
        <Tabs.Tab id="tab3">Also Active</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel id="tab1">
        <div className="story-tab-panel">
          <p>This tab is active and can be selected.</p>
        </div>
      </Tabs.Panel>
      <Tabs.Panel id="tab2">
        <div className="story-tab-panel">
          <p>You should not see this content because the tab is disabled.</p>
        </div>
      </Tabs.Panel>
      <Tabs.Panel id="tab3">
        <div className="story-tab-panel">
          <p>This tab is also active and selectable.</p>
        </div>
      </Tabs.Panel>
    </Tabs.Root>
  ),
};

export const SmallTabs: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Tabs.Root defaultSelectedKey="tab1">
      <Tabs.List size="sm">
        <Tabs.Tab id="tab1">Small Tab 1</Tabs.Tab>
        <Tabs.Tab id="tab2">Small Tab 2</Tabs.Tab>
        <Tabs.Tab id="tab3">Small Tab 3</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel id="tab1">Content 1</Tabs.Panel>
      <Tabs.Panel id="tab2">Content 2</Tabs.Panel>
      <Tabs.Panel id="tab3">Content 3</Tabs.Panel>
    </Tabs.Root>
  ),
};

export const WithIcons: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Tabs.Root defaultSelectedKey="account">
      <Tabs.List>
        <Tabs.Tab id="account" icon={<Icon icon={User} size="sm" />}>
          Account
        </Tabs.Tab>
        <Tabs.Tab id="settings" icon={<Icon icon={Settings} size="sm" />}>
          Settings
        </Tabs.Tab>
        <Tabs.Tab id="notifications" icon={<Icon icon={Bell} size="sm" />}>
          Notifications
        </Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel id="account">Account details.</Tabs.Panel>
      <Tabs.Panel id="settings">App settings.</Tabs.Panel>
      <Tabs.Panel id="notifications">Notification preferences.</Tabs.Panel>
    </Tabs.Root>
  ),
};

export const Controlled: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: function ControlledTabs() {
    const [selectedKey, setSelectedKey] = React.useState<string>('tab1');

    return (
      <div>
        <div className="story-tabs-status">
          Current tab: <strong>{selectedKey}</strong>
        </div>
        <Tabs.Root
          selectedKey={selectedKey}
          onSelectionChange={(key) => setSelectedKey(String(key))}
        >
          <Tabs.List>
            <Tabs.Tab id="tab1">First</Tabs.Tab>
            <Tabs.Tab id="tab2">Second</Tabs.Tab>
            <Tabs.Tab id="tab3">Third</Tabs.Tab>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Panel id="tab1">
            <div className="story-tab-panel">
              <p>First tab content — controlled externally.</p>
            </div>
          </Tabs.Panel>
          <Tabs.Panel id="tab2">
            <div className="story-tab-panel">
              <p>Second tab content — controlled externally.</p>
            </div>
          </Tabs.Panel>
          <Tabs.Panel id="tab3">
            <div className="story-tab-panel">
              <p>Third tab content — controlled externally.</p>
            </div>
          </Tabs.Panel>
        </Tabs.Root>
      </div>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const variants = ['underline', 'pills', 'enclosed'] as const;
    const sizes = ['sm', 'md'] as const;

    const orientations = ['horizontal', 'vertical'] as const;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-l)' }}>
        {orientations.map((orientation) =>
          variants.map((variant) =>
            sizes.map((size) => (
              <div
                key={`${orientation}-${variant}-${size}`}
                style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xs)' }}
              >
                <span className="story-label">
                  {orientation} / {variant} / {size}
                </span>
                <Tabs.Root defaultSelectedKey="t1" orientation={orientation}>
                  {orientation === 'vertical' ? (
                    <div className="story-tabs-vertical">
                      <Tabs.List variant={variant} size={size}>
                        <Tabs.Tab id="t1">Account</Tabs.Tab>
                        <Tabs.Tab id="t2">Settings</Tabs.Tab>
                        <Tabs.Tab id="t3">Notifications</Tabs.Tab>
                        <Tabs.Indicator />
                      </Tabs.List>
                      <Tabs.Panel id="t1">Account content</Tabs.Panel>
                      <Tabs.Panel id="t2">Settings content</Tabs.Panel>
                      <Tabs.Panel id="t3">Notifications content</Tabs.Panel>
                    </div>
                  ) : (
                    <Tabs.List variant={variant} size={size}>
                      <Tabs.Tab id="t1">Account</Tabs.Tab>
                      <Tabs.Tab id="t2">Settings</Tabs.Tab>
                      <Tabs.Tab id="t3">Notifications</Tabs.Tab>
                      <Tabs.Indicator />
                    </Tabs.List>
                  )}
                </Tabs.Root>
              </div>
            )),
          ),
        )}
      </div>
    );
  },
};
