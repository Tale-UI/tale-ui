import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from '@tale-ui/react/calendar';
import { today, getLocalTimeZone, parseDate } from '@internationalized/date';

type Args = {
  isDisabled?: boolean;
  isReadOnly?: boolean;
  defaultValue: string;
  selectionMode: 'single' | 'multiple';
};

const meta: Meta<Args> = {
  title: 'Components/Calendar',
  parameters: { layout: 'centered' },
  argTypes: {
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
    defaultValue: { control: 'text' },
    selectionMode: {
      control: 'inline-radio',
      options: ['single', 'multiple'],
    },
  },
  args: {
    isDisabled: false,
    isReadOnly: false,
    defaultValue: '2026-07-27',
    selectionMode: 'single',
  },
};

export default meta;

type Story = StoryObj<Args>;

function CalendarTemplate(args: Args) {
  const defaultValue =
    args.selectionMode === 'multiple'
      ? [parseDate(args.defaultValue)]
      : parseDate(args.defaultValue);
  return (
    <Calendar.Root
      key={`${args.defaultValue}-${args.selectionMode}`}
      isDisabled={args.isDisabled}
      isReadOnly={args.isReadOnly}
      selectionMode={args.selectionMode}
      defaultValue={defaultValue}
    >
      <Calendar.Header>
        <Calendar.PreviousButton />
        <Calendar.Heading />
        <Calendar.NextButton />
      </Calendar.Header>
      <Calendar.Grid>
        <Calendar.GridHeader>
          {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
        </Calendar.GridHeader>
        <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
      </Calendar.Grid>
    </Calendar.Root>
  );
}

function MonthYearPickerCalendarTemplate(args: Args) {
  return (
    <Calendar.Root {...args}>
      <Calendar.Header>
        <Calendar.PreviousButton />
        <Calendar.MonthPicker format="short" />
        <Calendar.YearPicker visibleYears={8} />
        <Calendar.NextButton />
      </Calendar.Header>
      <Calendar.Grid>
        <Calendar.GridHeader>
          {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
        </Calendar.GridHeader>
        <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
      </Calendar.Grid>
    </Calendar.Root>
  );
}

export const Default: Story = {
  render: (args) => <CalendarTemplate {...args} />,
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
  render: (args) => <CalendarTemplate {...args} />,
};

export const ReadOnly: Story = {
  args: {
    isReadOnly: true,
  },
  render: (args) => (
    <Calendar.Root defaultValue={today(getLocalTimeZone())} {...args}>
      <Calendar.Header>
        <Calendar.PreviousButton />
        <Calendar.Heading />
        <Calendar.NextButton />
      </Calendar.Header>
      <Calendar.Grid>
        <Calendar.GridHeader>
          {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
        </Calendar.GridHeader>
        <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
      </Calendar.Grid>
    </Calendar.Root>
  ),
};

export const WithMonthYearPickers: Story = {
  render: (args) => <MonthYearPickerCalendarTemplate {...args} />,
};

export const AllVariations: Story = {
  parameters: { controls: { disable: true } },
  render() {
    return (
      <div className="story-sections">
        <div>
          <p className="story-label">Default calendar</p>
          <CalendarTemplate />
        </div>
        <div>
          <p className="story-label">Month and year pickers</p>
          <MonthYearPickerCalendarTemplate />
        </div>
      </div>
    );
  },
};
