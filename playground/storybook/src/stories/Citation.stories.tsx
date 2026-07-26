import type { Meta, StoryObj } from '@storybook/react-vite';
import { Citation } from '@tale-ui/react/citation';

const meta = {
  title: 'Components/Citation',
  component: Citation.Root,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Citation.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const sources = [
  {
    id: 'aria-apg',
    title: 'WAI-ARIA Authoring Practices Guide',
    href: '/WAI/ARIA/apg/',
    publisher: 'W3C',
    publishedAt: '2025-12-16T09:30:00+00:00',
  },
  {
    id: 'html-standard',
    title: 'HTML Living Standard',
    href: 'https://html.spec.whatwg.org/',
    publisher: 'WHATWG',
  },
] as const;

export const Default: Story = {
  args: {
    id: 'storybook-citations',
    sources,
    baseUrl: 'https://www.w3.org/',
    children: null,
  },
  render(args) {
    return (
      <Citation.Root {...args} style={{ maxWidth: '36rem' }}>
        <p>
          Use native semantics whenever possible
          <Citation.Reference sourceId="html-standard" />, then apply established accessible
          interaction patterns
          <Citation.Reference sourceId="aria-apg" />.
        </p>
        <Citation.List />
      </Citation.Root>
    );
  },
};

export const MissingSource: Story = {
  args: {
    id: 'missing-citation',
    sources,
    children: null,
  },
  render(args) {
    return (
      <Citation.Root {...args}>
        Unavailable research claim
        <Citation.Reference sourceId="removed-source" />.
        <Citation.List />
      </Citation.Root>
    );
  },
};
