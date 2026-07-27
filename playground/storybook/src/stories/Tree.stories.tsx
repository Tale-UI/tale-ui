import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tree } from '@tale-ui/react/tree';

type Args = {
  selectionMode?: 'none' | 'single' | 'multiple';
  label: string;
  defaultExpandedKeys: string[];
};

const meta: Meta<Args> = {
  title: 'Components/Tree',
  parameters: { layout: 'centered' },
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
    },
    label: { control: 'text' },
    defaultExpandedKeys: { control: 'object' },
  },
  args: {
    selectionMode: 'none',
    label: 'Files',
    defaultExpandedKeys: [],
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <Tree.Root
        key={args.defaultExpandedKeys.join(',')}
        aria-label={args.label}
        selectionMode={args.selectionMode}
        defaultExpandedKeys={args.defaultExpandedKeys}
      >
        <Tree.Item id="1" textValue="Documents">
          <Tree.ItemContent>Documents</Tree.ItemContent>
          <Tree.Item id="1.1" textValue="report.pdf">
            <Tree.ItemContent>report.pdf</Tree.ItemContent>
          </Tree.Item>
          <Tree.Item id="1.2" textValue="notes.txt">
            <Tree.ItemContent>notes.txt</Tree.ItemContent>
          </Tree.Item>
        </Tree.Item>
        <Tree.Item id="2" textValue="Photos">
          <Tree.ItemContent>Photos</Tree.ItemContent>
          <Tree.Item id="2.1" textValue="vacation.jpg">
            <Tree.ItemContent>vacation.jpg</Tree.ItemContent>
          </Tree.Item>
        </Tree.Item>
        <Tree.Item id="3" textValue="Music">
          <Tree.ItemContent>Music</Tree.ItemContent>
        </Tree.Item>
      </Tree.Root>
    );
  },
};

export const WithExpanded: Story = {
  parameters: {
    controls: { disable: true },
  },
  render() {
    return (
      <Tree.Root aria-label="Files" defaultExpandedKeys={new Set(['1', '2'])}>
        <Tree.Item id="1" textValue="Documents">
          <Tree.ItemContent>Documents</Tree.ItemContent>
          <Tree.Item id="1.1" textValue="report.pdf">
            <Tree.ItemContent>report.pdf</Tree.ItemContent>
          </Tree.Item>
          <Tree.Item id="1.2" textValue="notes.txt">
            <Tree.ItemContent>notes.txt</Tree.ItemContent>
          </Tree.Item>
          <Tree.Item id="1.3" textValue="budget.xlsx">
            <Tree.ItemContent>budget.xlsx</Tree.ItemContent>
          </Tree.Item>
        </Tree.Item>
        <Tree.Item id="2" textValue="Photos">
          <Tree.ItemContent>Photos</Tree.ItemContent>
          <Tree.Item id="2.1" textValue="vacation.jpg">
            <Tree.ItemContent>vacation.jpg</Tree.ItemContent>
          </Tree.Item>
          <Tree.Item id="2.2" textValue="portrait.png">
            <Tree.ItemContent>portrait.png</Tree.ItemContent>
          </Tree.Item>
        </Tree.Item>
        <Tree.Item id="3" textValue="Music">
          <Tree.ItemContent>Music</Tree.ItemContent>
        </Tree.Item>
      </Tree.Root>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 250px' }}>
          <p className="story-label">Single select</p>
          <Tree.Root
            aria-label="Files — single"
            selectionMode="single"
            defaultExpandedKeys={new Set(['1'])}
          >
            <Tree.Item id="1" textValue="Documents">
              <Tree.ItemContent>Documents</Tree.ItemContent>
              <Tree.Item id="1.1" textValue="report.pdf">
                <Tree.ItemContent>report.pdf</Tree.ItemContent>
              </Tree.Item>
              <Tree.Item id="1.2" textValue="notes.txt">
                <Tree.ItemContent>notes.txt</Tree.ItemContent>
              </Tree.Item>
            </Tree.Item>
            <Tree.Item id="2" textValue="Photos">
              <Tree.ItemContent>Photos</Tree.ItemContent>
              <Tree.Item id="2.1" textValue="vacation.jpg">
                <Tree.ItemContent>vacation.jpg</Tree.ItemContent>
              </Tree.Item>
            </Tree.Item>
          </Tree.Root>
        </div>
        <div style={{ flex: '1 1 250px' }}>
          <p className="story-label">Multiple select</p>
          <Tree.Root
            aria-label="Files — multi"
            selectionMode="multiple"
            defaultExpandedKeys={new Set(['1'])}
          >
            <Tree.Item id="1" textValue="Documents">
              <Tree.ItemContent>Documents</Tree.ItemContent>
              <Tree.Item id="1.1" textValue="report.pdf">
                <Tree.ItemContent>report.pdf</Tree.ItemContent>
              </Tree.Item>
              <Tree.Item id="1.2" textValue="notes.txt">
                <Tree.ItemContent>notes.txt</Tree.ItemContent>
              </Tree.Item>
            </Tree.Item>
            <Tree.Item id="2" textValue="Photos">
              <Tree.ItemContent>Photos</Tree.ItemContent>
              <Tree.Item id="2.1" textValue="vacation.jpg">
                <Tree.ItemContent>vacation.jpg</Tree.ItemContent>
              </Tree.Item>
            </Tree.Item>
          </Tree.Root>
        </div>
      </div>
    );
  },
};
