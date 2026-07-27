import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextEditor } from '@tale-ui/react/text-editor';

type Args = {
  'aria-label': string;
  isDisabled: boolean;
  limit: number;
  placeholder: string;
  isInvalid: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/TextEditor',
  parameters: { layout: 'padded' },
  argTypes: {
    'aria-label': { control: 'text' },
    isDisabled: { control: 'boolean' },
    limit: { control: { type: 'number', min: 1, step: 1 } },
    placeholder: { control: 'text' },
    isInvalid: { control: 'boolean' },
  },
  args: {
    'aria-label': 'Rich text editor',
    isDisabled: false,
    limit: 500,
    placeholder: 'Start writing…',
    isInvalid: false,
  },
};

export default meta;

export const Default: StoryObj<Args> = {
  render(args) {
    return (
      <TextEditor.Root {...args}>
        <TextEditor.Label>Body</TextEditor.Label>
        <TextEditor.Toolbar type="simple" />
        <TextEditor.Content />
        <TextEditor.HintText>Rich-text formatting supported.</TextEditor.HintText>
      </TextEditor.Root>
    );
  },
};

export const Advanced: StoryObj = {
  render() {
    return (
      <TextEditor.Root limit={500}>
        <TextEditor.Label>Description</TextEditor.Label>
        <TextEditor.Toolbar type="advanced" />
        <TextEditor.Content />
        <TextEditor.HintText />
      </TextEditor.Root>
    );
  },
};

export const Disabled: StoryObj = {
  render() {
    return (
      <TextEditor.Root isDisabled>
        <TextEditor.Label>Read-only</TextEditor.Label>
        <TextEditor.Toolbar type="simple" />
        <TextEditor.Content />
      </TextEditor.Root>
    );
  },
};

export const Invalid: StoryObj = {
  render() {
    return (
      <TextEditor.Root isInvalid>
        <TextEditor.Label>Required field</TextEditor.Label>
        <TextEditor.Toolbar type="simple" />
        <TextEditor.Content />
        <TextEditor.HintText>This field is required.</TextEditor.HintText>
      </TextEditor.Root>
    );
  },
};

export const WithBubbleMenu: StoryObj = {
  render() {
    return (
      <TextEditor.Root placeholder="Select text to see the bubble menu…">
        <TextEditor.Label>Notes</TextEditor.Label>
        <TextEditor.Content />
        <TextEditor.BubbleMenu>
          <TextEditor.Bold />
          <TextEditor.Italic />
          <TextEditor.Underline />
          <TextEditor.Link />
        </TextEditor.BubbleMenu>
      </TextEditor.Root>
    );
  },
};

export const FloatingToolbar: StoryObj = {
  render() {
    return (
      <TextEditor.Root>
        <TextEditor.Label>Floating toolbar</TextEditor.Label>
        <TextEditor.Toolbar type="simple" floating />
        <TextEditor.Content />
      </TextEditor.Root>
    );
  },
};
