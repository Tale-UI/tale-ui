import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Icon } from '@tale-ui/react/icon';
import { Pagination } from '@tale-ui/react/pagination';

type Args = {
  label: string;
};

const meta: Meta<Args> = {
  title: 'Components/Pagination',
  parameters: { layout: 'centered' },
  argTypes: {
    label: { control: 'text' },
  },
  args: {
    label: 'Pagination',
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  render(args) {
    return (
      <Pagination.Root aria-label={args.label}>
        <Pagination.PreviousTrigger />
        <Pagination.Item page={1} />
        <Pagination.Item page={2} current />
        <Pagination.Item page={3} />
        <Pagination.NextTrigger />
      </Pagination.Root>
    );
  },
};

export const ManyPages: Story = {
  render() {
    return (
      <Pagination.Root aria-label="Pagination">
        <Pagination.PreviousTrigger />
        <Pagination.Item page={1} />
        <Pagination.Ellipsis />
        <Pagination.Item page={4} />
        <Pagination.Item page={5} current />
        <Pagination.Item page={6} />
        <Pagination.Ellipsis />
        <Pagination.Item page={20} />
        <Pagination.NextTrigger />
      </Pagination.Root>
    );
  },
};

export const FirstPage: Story = {
  render() {
    return (
      <Pagination.Root aria-label="Pagination">
        <Pagination.PreviousTrigger disabled />
        <Pagination.Item page={1} current />
        <Pagination.Item page={2} />
        <Pagination.Item page={3} />
        <Pagination.NextTrigger />
      </Pagination.Root>
    );
  },
};

export const LastPage: Story = {
  render() {
    return (
      <Pagination.Root aria-label="Pagination">
        <Pagination.PreviousTrigger />
        <Pagination.Item page={8} />
        <Pagination.Item page={9} />
        <Pagination.Item page={10} current />
        <Pagination.NextTrigger disabled />
      </Pagination.Root>
    );
  },
};

export const CustomLabels: Story = {
  render() {
    return (
      <Pagination.Root aria-label="Pagination">
        <Pagination.PreviousTrigger>
          <Icon icon={ChevronLeft} size="sm" /> Prev
        </Pagination.PreviousTrigger>
        <Pagination.Item page={1} />
        <Pagination.Item page={2} current />
        <Pagination.Item page={3} />
        <Pagination.NextTrigger>
          Next <Icon icon={ChevronRight} size="sm" />
        </Pagination.NextTrigger>
      </Pagination.Root>
    );
  },
};

export const DotDisplay: Story = {
  render() {
    return (
      <Pagination.Root aria-label="Slides">
        <Pagination.Dot page={1} />
        <Pagination.Dot page={2} current />
        <Pagination.Dot page={3} />
        <Pagination.Dot page={4} />
        <Pagination.Dot page={5} />
      </Pagination.Root>
    );
  },
};

export const LineDisplay: Story = {
  render() {
    return (
      <Pagination.Root aria-label="Steps" style={{ width: 240 }}>
        <Pagination.Line page={1} />
        <Pagination.Line page={2} current />
        <Pagination.Line page={3} />
      </Pagination.Root>
    );
  },
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-sections">
        <div>
          <div className="story-heading">Items (numbered)</div>
          <Pagination.Root aria-label="Numbered pagination">
            <Pagination.PreviousTrigger />
            <Pagination.Item page={1} />
            <Pagination.Ellipsis />
            <Pagination.Item page={4} />
            <Pagination.Item page={5} current />
            <Pagination.Item page={6} />
            <Pagination.Ellipsis />
            <Pagination.Item page={20} />
            <Pagination.NextTrigger />
          </Pagination.Root>
        </div>
        <div>
          <div className="story-heading">Dots</div>
          <Pagination.Root aria-label="Dot pagination">
            <Pagination.Dot page={1} />
            <Pagination.Dot page={2} />
            <Pagination.Dot page={3} current />
            <Pagination.Dot page={4} />
            <Pagination.Dot page={5} />
          </Pagination.Root>
        </div>
        <div>
          <div className="story-heading">Lines</div>
          <Pagination.Root aria-label="Line pagination" style={{ width: 240 }}>
            <Pagination.Line page={1} />
            <Pagination.Line page={2} current />
            <Pagination.Line page={3} />
            <Pagination.Line page={4} />
          </Pagination.Root>
        </div>
        <div>
          <div className="story-heading">With custom labels</div>
          <Pagination.Root aria-label="Custom pagination">
            <Pagination.PreviousTrigger>
              <Icon icon={ChevronLeft} size="sm" /> Prev
            </Pagination.PreviousTrigger>
            <Pagination.Item page={1} />
            <Pagination.Item page={2} current />
            <Pagination.Item page={3} />
            <Pagination.NextTrigger>
              Next <Icon icon={ChevronRight} size="sm" />
            </Pagination.NextTrigger>
          </Pagination.Root>
        </div>
        <div>
          <div className="story-heading">Disabled navigation</div>
          <Pagination.Root aria-label="Disabled navigation">
            <Pagination.PreviousTrigger disabled />
            <Pagination.Item page={1} current />
            <Pagination.Item page={2} />
            <Pagination.Item page={3} />
            <Pagination.NextTrigger />
          </Pagination.Root>
        </div>
      </div>
    );
  },
};
