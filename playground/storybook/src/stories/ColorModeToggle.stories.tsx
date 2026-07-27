import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorModeToggle } from '@tale-ui/react/color-mode-toggle';

type Args = {
  isDisabled?: boolean;
  defaultMode: 'light' | 'dark';
  storageKey: string;
};

const meta: Meta<Args> = {
  title: 'Components/ColorModeToggle',
  parameters: { layout: 'centered' },
  argTypes: {
    isDisabled: { control: 'boolean' },
    defaultMode: {
      control: 'inline-radio',
      options: ['light', 'dark'],
    },
    storageKey: { control: 'text' },
  },
  args: {
    isDisabled: false,
    defaultMode: 'light',
    storageKey: 'tale-ui-storybook-color-mode',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <ColorModeToggle
      key={`${args.defaultMode}-${args.storageKey}`}
      isDisabled={args.isDisabled}
      defaultMode={args.defaultMode}
      storageKey={args.storageKey}
    />
  ),
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
  render: (args) => <ColorModeToggle isDisabled={args.isDisabled} />,
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-row story-row--m">
        <div className="story-col" style={{ alignItems: 'center' }}>
          <ColorModeToggle />
          <span style={{ fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)' }}>
            Default
          </span>
        </div>
        <div className="story-col" style={{ alignItems: 'center' }}>
          <ColorModeToggle isDisabled />
          <span style={{ fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-60)' }}>
            Disabled
          </span>
        </div>
      </div>
    );
  },
};
