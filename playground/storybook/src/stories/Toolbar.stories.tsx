import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toolbar } from '@tale-ui/react/toolbar';

type Args = {
  label: string;
};

const meta: Meta<Args> = {
  title: 'Components/Toolbar',
  parameters: { layout: 'centered' },
  argTypes: {
    label: { control: 'text' },
  },
  args: {
    label: 'Formatting',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <Toolbar.Root aria-label={args.label}>
        <Toolbar.Group>
          <Toolbar.Button>Bold</Toolbar.Button>
          <Toolbar.Button>Italic</Toolbar.Button>
          <Toolbar.Button>Underline</Toolbar.Button>
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Group>
          <Toolbar.Button>Left</Toolbar.Button>
          <Toolbar.Button>Center</Toolbar.Button>
          <Toolbar.Button>Right</Toolbar.Button>
        </Toolbar.Group>
      </Toolbar.Root>
    );
  },
};

export const WithInput: Story = {
  render() {
    return (
      <Toolbar.Root aria-label="Search toolbar">
        <Toolbar.Group>
          <Toolbar.Button>Filter</Toolbar.Button>
          <Toolbar.Button>Sort</Toolbar.Button>
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Group>
          <Toolbar.Input placeholder="Search..." aria-label="Search" />
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Group>
          <Toolbar.Button>Reset</Toolbar.Button>
        </Toolbar.Group>
      </Toolbar.Root>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-sections">
        <div>
          <p className="story-label">Toolbar with buttons and separators</p>
          <Toolbar.Root aria-label="Formatting">
            <Toolbar.Group>
              <Toolbar.Button>Bold</Toolbar.Button>
              <Toolbar.Button>Italic</Toolbar.Button>
              <Toolbar.Button>Underline</Toolbar.Button>
            </Toolbar.Group>
            <Toolbar.Separator />
            <Toolbar.Group>
              <Toolbar.Button>Left</Toolbar.Button>
              <Toolbar.Button>Center</Toolbar.Button>
              <Toolbar.Button>Right</Toolbar.Button>
            </Toolbar.Group>
            <Toolbar.Separator />
            <Toolbar.Group>
              <Toolbar.Input placeholder="Search..." aria-label="Search" />
            </Toolbar.Group>
          </Toolbar.Root>
        </div>
      </div>
    );
  },
};
