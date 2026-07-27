import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '@tale-ui/react/switch';

type Args = {
  defaultSelected?: boolean;
  isDisabled?: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/Switch',
  argTypes: {
    defaultSelected: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
  },
  args: {
    defaultSelected: false,
    isDisabled: false,
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render: (args) => (
    <Switch.Root
      key={String(args.defaultSelected)}
      defaultSelected={args.defaultSelected}
      isDisabled={args.isDisabled}
    >
      <Switch.Thumb />
      Enable notifications
    </Switch.Root>
  ),
};

export const Selected: Story = {
  args: {
    defaultSelected: true,
    isDisabled: false,
  },
  render: (args) => (
    <Switch.Root
      key={String(args.defaultSelected)}
      defaultSelected={args.defaultSelected}
      isDisabled={args.isDisabled}
    >
      <Switch.Thumb />
      Dark mode
    </Switch.Root>
  ),
};

export const Disabled: Story = {
  args: {
    defaultSelected: false,
    isDisabled: true,
  },
  render: (args) => (
    <Switch.Root
      key={String(args.defaultSelected)}
      defaultSelected={args.defaultSelected}
      isDisabled={args.isDisabled}
    >
      <Switch.Thumb />
      Disabled switch
    </Switch.Root>
  ),
};

export const DisabledSelected: Story = {
  args: {
    defaultSelected: true,
    isDisabled: true,
  },
  render: (args) => (
    <Switch.Root
      key={String(args.defaultSelected)}
      defaultSelected={args.defaultSelected}
      isDisabled={args.isDisabled}
    >
      <Switch.Thumb />
      Disabled and on
    </Switch.Root>
  ),
};

export const AllStates: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="story-col story-col--m">
      <Switch.Root>
        <Switch.Thumb />
        Default (off)
      </Switch.Root>

      <Switch.Root defaultSelected>
        <Switch.Thumb />
        Default (on)
      </Switch.Root>

      <Switch.Root isDisabled>
        <Switch.Thumb />
        Disabled (off)
      </Switch.Root>

      <Switch.Root isDisabled defaultSelected>
        <Switch.Thumb />
        Disabled (on)
      </Switch.Root>
    </div>
  ),
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    const states = [
      { label: 'Off', props: {} },
      { label: 'On', props: { defaultSelected: true } },
      { label: 'Disabled off', props: { isDisabled: true } },
      { label: 'Disabled on', props: { isDisabled: true, defaultSelected: true } },
    ] as const;
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto auto',
          gap: '0.5rem 1rem',
          alignItems: 'center',
        }}
      >
        {states.map((state) => (
          <div key={state.label} style={{ display: 'contents' }}>
            <div className="story-label">{state.label}</div>
            <Switch.Root {...state.props}>
              <Switch.Thumb />
            </Switch.Root>
          </div>
        ))}
      </div>
    );
  },
};
