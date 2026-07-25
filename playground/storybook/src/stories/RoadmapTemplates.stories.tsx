import type { Meta, StoryObj } from '@storybook/react-vite';
/* eslint-disable import/no-relative-packages -- snapshots exercise the materialized template sources directly. */
import { Example as AppHeader } from '../../../../packages/tooling/templates/app-header/source/App';
import { Example as ChartDashboard } from '../../../../packages/tooling/templates/chart-dashboard/source/App';
import { Example as ChatArtifactPanel } from '../../../../packages/tooling/templates/chat-artifact-panel/source/App';
import { Example as ChatMobile } from '../../../../packages/tooling/templates/chat-mobile/source/App';
import { Example as CommandPaletteDashboard } from '../../../../packages/tooling/templates/command-palette-dashboard/source/App';
import { Example as EmptyState } from '../../../../packages/tooling/templates/empty-state/source/App';
import { Example as LoadingPatterns } from '../../../../packages/tooling/templates/loading-patterns/source/App';
import { Example as ReactHookForm } from '../../../../packages/tooling/templates/react-hook-form/source/App';
import { Example as SettingsPage } from '../../../../packages/tooling/templates/settings-page/source/App';
import { Example as SidebarHeader } from '../../../../packages/tooling/templates/sidebar-header/source/App';
import { Example as SortableTable } from '../../../../packages/tooling/templates/sortable-table/source/App';
import { Example as ValidatedForm } from '../../../../packages/tooling/templates/validated-form/source/App';

const meta = {
  title: 'Roadmap/Templates',
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AppHeaderTemplate: Story = { render: () => <AppHeader /> };
export const ChartDashboardTemplate: Story = { render: () => <ChartDashboard /> };
export const ChatArtifactPanelTemplate: Story = { render: () => <ChatArtifactPanel /> };
export const ChatMobileTemplate: Story = { render: () => <ChatMobile /> };
export const CommandPaletteDashboardTemplate: Story = {
  render: () => <CommandPaletteDashboard />,
};
export const EmptyStateTemplate: Story = { render: () => <EmptyState /> };
export const LoadingPatternsTemplate: Story = { render: () => <LoadingPatterns /> };
export const ReactHookFormTemplate: Story = { render: () => <ReactHookForm /> };
export const SettingsPageTemplate: Story = { render: () => <SettingsPage /> };
export const SidebarHeaderTemplate: Story = {
  render: () => (
    <SidebarHeader>
      <main style={{ padding: 'var(--space-l)' }}>Application content</main>
    </SidebarHeader>
  ),
};
export const SortableTableTemplate: Story = { render: () => <SortableTable /> };
export const ValidatedFormTemplate: Story = { render: () => <ValidatedForm /> };
