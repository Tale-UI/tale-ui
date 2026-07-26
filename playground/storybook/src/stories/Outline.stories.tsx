import type { Meta, StoryObj } from '@storybook/react-vite';
import { Outline } from '@tale-ui/react/outline';

const items = [
  { id: 'introduction', targetId: 'outline-story-introduction', label: 'Introduction', level: 1 },
  { id: 'installation', targetId: 'outline-story-installation', label: 'Installation', level: 2 },
  {
    id: 'configuration',
    targetId: 'outline-story-configuration',
    label: 'Configuration',
    level: 2,
  },
  { id: 'api', targetId: 'outline-story-api', label: 'API reference', level: 1 },
] as const;

const meta = {
  title: 'Components/Outline',
  component: Outline,
  parameters: { layout: 'centered' },
  args: {
    'aria-label': 'On this page',
    defaultActiveId: 'introduction',
    items,
    observeTargets: false,
  },
} satisfies Meta<typeof Outline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render(args) {
    return <Outline {...args} style={{ width: 240 }} />;
  },
};

export const WithDocumentTargets: Story = {
  render() {
    return (
      <div
        style={{ display: 'grid', gridTemplateColumns: '14rem minmax(20rem, 36rem)', gap: '2rem' }}
      >
        <Outline aria-label="Article contents" items={items} />
        <article>
          <h2 id="outline-story-introduction">Introduction</h2>
          <p>Outline provides semantic navigation for longer documents.</p>
          <h3 id="outline-story-installation">Installation</h3>
          <p>Import the component and the Tale UI component styles.</p>
          <h3 id="outline-story-configuration">Configuration</h3>
          <p>Choose controlled state or an uncontrolled default when needed.</p>
          <h2 id="outline-story-api">API reference</h2>
          <p>Items map stable logical IDs to heading target IDs.</p>
        </article>
      </div>
    );
  },
};
