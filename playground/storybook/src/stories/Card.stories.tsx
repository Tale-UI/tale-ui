import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '@tale-ui/react/card';
import { Button } from '@tale-ui/react/button';
import { Text } from '@tale-ui/react/text';

type Args = {
  variant: 'outlined' | 'elevated' | 'filled';
  padding: 'sm' | 'md' | 'lg';
  isSelected: boolean;
  isDisabled: boolean;
  isPending: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Card',
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['outlined', 'elevated', 'filled'] },
    padding: { control: 'select', options: ['sm', 'md', 'lg'] },
    isSelected: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isPending: { control: 'boolean' },
  },
  args: {
    variant: 'outlined',
    padding: 'md',
    isSelected: false,
    isDisabled: false,
    isPending: false,
  },
};

export default meta;
type Story = StoryObj<Args>;

function InteractiveCards() {
  const themes = [
    { id: 'harbour', name: 'Harbour', description: 'Deep teal and warm stone.' },
    { id: 'violet', name: 'Violet Dusk', description: 'Soft violet and balanced slate.' },
    { id: 'fern', name: 'Fern', description: 'Leaf green and botanical grey.' },
  ];
  const [selectedTheme, setSelectedTheme] = React.useState(themes[0].id);

  return (
    <div
      role="group"
      aria-label="Theme actions"
      style={{ display: 'flex', gap: 'var(--space-s)', alignItems: 'stretch' }}
    >
      {themes.map((theme) => (
        <Card.Button
          key={theme.id}
          padding="sm"
          isSelected={selectedTheme === theme.id}
          onPress={() => setSelectedTheme(theme.id)}
          style={{ width: '12rem' }}
        >
          <Text as="span" variant="label" size="m">
            {theme.name}
          </Text>
          <Text as="span" variant="text" size="s" color="muted">
            {theme.description}
          </Text>
        </Card.Button>
      ))}
    </div>
  );
}

export const Default: Story = {
  render(args) {
    return (
      <Card.Root variant={args.variant} padding={args.padding} style={{ maxWidth: '22.5rem' }}>
        <Card.Header>Card title</Card.Header>
        <Card.Body>This is the card body content. It can contain any elements.</Card.Body>
        <Card.Footer>
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button variant="primary" size="sm">
            Confirm
          </Button>
        </Card.Footer>
      </Card.Root>
    );
  },
};

export const InteractiveProperties: Story = {
  render(args) {
    return (
      <Card.Button
        variant={args.variant}
        padding={args.padding}
        isSelected={args.isSelected}
        isDisabled={args.isDisabled}
        isPending={args.isPending}
        style={{ maxWidth: '22.5rem' }}
      >
        <Text as="span" variant="label" size="m">
          Interactive card
        </Text>
        <Text as="span" variant="text" size="s" color="muted">
          This story exposes the complete Card.Button state surface.
        </Text>
      </Card.Button>
    );
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const variants = ['outlined', 'elevated', 'filled'] as const;
    return (
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
        {variants.map((v) => (
          <Card.Root key={v} variant={v} style={{ maxWidth: '15rem' }}>
            <Card.Header>{v}</Card.Header>
            <Card.Body>Card content with the {v} variant.</Card.Body>
          </Card.Root>
        ))}
      </div>
    );
  },
};

export const AllPaddings: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const paddings = ['sm', 'md', 'lg'] as const;
    return (
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
        {paddings.map((p) => (
          <Card.Root key={p} padding={p} style={{ maxWidth: '15rem' }}>
            <Card.Header>Padding: {p}</Card.Header>
            <Card.Body>Card with {p} padding.</Card.Body>
          </Card.Root>
        ))}
      </div>
    );
  },
};

export const Interactive: Story = {
  parameters: { controls: { disable: true } },
  render: () => <InteractiveCards />,
};
