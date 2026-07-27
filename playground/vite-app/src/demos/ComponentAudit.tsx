import * as React from 'react';
import { useFilter, parseColor, Switch as AriaSwitch } from 'react-aria-components';
import '@tale-ui/react-styles/index.css';
import './ComponentAudit.css';

// Simple components
import { Button } from '@tale-ui/react/button';
import { ButtonGroup } from '@tale-ui/react/button-group';
import { IconButton } from '@tale-ui/react/icon-button';
import { Input } from '@tale-ui/react/input';
import { ToggleButton, ToggleButtonGroup } from '@tale-ui/react/toggle-button';
import { Separator } from '@tale-ui/react/separator';
import { I18nProvider, useTaleI18n } from '@tale-ui/react/i18n-provider';

// Compound components
import { Checkbox } from '@tale-ui/react/checkbox';
import { CheckboxField } from '@tale-ui/react/checkbox-field';
import { CheckboxGroup } from '@tale-ui/react/checkbox-group';
import { Radio } from '@tale-ui/react/radio';
import { RadioField } from '@tale-ui/react/radio-field';
import { Switch } from '@tale-ui/react/switch';
import { SwitchField } from '@tale-ui/react/switch-field';
import { Select } from '@tale-ui/react/select';
import { Autocomplete } from '@tale-ui/react/autocomplete';
import { Combobox } from '@tale-ui/react/combobox';
import { NumberField } from '@tale-ui/react/number-field';
import { Slider } from '@tale-ui/react/slider';
import { Calendar } from '@tale-ui/react/calendar';

// Overlay
import { Dialog } from '@tale-ui/react/dialog';
import { AlertDialog } from '@tale-ui/react/alert-dialog';
import { Popover } from '@tale-ui/react/popover';
import { PreviewCard } from '@tale-ui/react/preview-card';
import { Drawer } from '@tale-ui/react/drawer';
import { Lightbox } from '@tale-ui/react/lightbox';
import { Tooltip } from '@tale-ui/react/tooltip';

// Navigation
import { Menu } from '@tale-ui/react/menu';
import { ContextMenu } from '@tale-ui/react/context-menu';
import { CommandPalette } from '@tale-ui/react/command-palette';
import { NavigationMenu } from '@tale-ui/react/navigation-menu';
import { Menubar } from '@tale-ui/react/menubar';
import { Outline } from '@tale-ui/react/outline';

// Layout
import { Carousel } from '@tale-ui/react/carousel';
import { Accordion } from '@tale-ui/react/accordion';
import { Disclosure } from '@tale-ui/react/disclosure';
import { Tabs } from '@tale-ui/react/tabs';
import { ScrollArea } from '@tale-ui/react/scroll-area';
import { Container } from '@tale-ui/react/container';
import { Card } from '@tale-ui/react/card';
import { AspectRatio } from '@tale-ui/react/aspect-ratio';
import { AppShell } from '@tale-ui/react/app-shell';
import { Chat } from '@tale-ui/react/chat';
import { Column } from '@tale-ui/react/column';
import { OverflowList } from '@tale-ui/react/overflow-list';
import { Resizable } from '@tale-ui/react/resizable';
import { Row as LayoutRow } from '@tale-ui/react/row';

// Feedback
import { Banner } from '@tale-ui/react/banner';
import { ProgressBar } from '@tale-ui/react/progress-bar';
import { ProgressCircle } from '@tale-ui/react/progress-circle';
import { Meter } from '@tale-ui/react/meter';
import { Spinner } from '@tale-ui/react/spinner';
import { Skeleton } from '@tale-ui/react/skeleton';
import { createToastQueue, ToastRegion } from '@tale-ui/react/toast';
// Display
import { Avatar } from '@tale-ui/react/avatar';
import { EmptyState } from '@tale-ui/react/empty-state';
import { Image } from '@tale-ui/react/image';
import { KeyValuePairs } from '@tale-ui/react/key-value-pairs';
import { List } from '@tale-ui/react/list';
import { ListBox } from '@tale-ui/react/list-box';

// Form Structure
import { Field } from '@tale-ui/react/field';
import { Fieldset } from '@tale-ui/react/fieldset';
import { Form } from '@tale-ui/react/form';

// Other
import { Toolbar } from '@tale-ui/react/toolbar';
import { Icon } from '@tale-ui/react/icon';
import {
  Heart,
  Star,
  Bell,
  Settings,
  Search,
  Plus,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle,
  Info,
  Mail,
  User,
  Home,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Check,
  Minus as MinusLucide,
  X as XLucide,
} from 'lucide-react';

// Additional form controls
import { RadioGroup } from '@tale-ui/react/radio-group';
import { SearchField } from '@tale-ui/react/search-field';
import { TextField } from '@tale-ui/react/text-field';
import { TextArea } from '@tale-ui/react/text-area';

// Date & Time
import { DateField } from '@tale-ui/react/date-field';
import { DatePicker } from '@tale-ui/react/date-picker';
import { DateRangePicker } from '@tale-ui/react/date-range-picker';
import { TimeField } from '@tale-ui/react/time-field';
import { RangeCalendar } from '@tale-ui/react/range-calendar';
import { Timestamp } from '@tale-ui/react/timestamp';

// Color
import { ColorArea } from '@tale-ui/react/color-area';
import { ColorField } from '@tale-ui/react/color-field';
import { ColorPicker } from '@tale-ui/react/color-picker';
import { ColorSlider } from '@tale-ui/react/color-slider';
import { ColorSwatch } from '@tale-ui/react/color-swatch';
import { ColorSwatchPicker } from '@tale-ui/react/color-swatch-picker';
import { ColorWheel } from '@tale-ui/react/color-wheel';

// Data display
import { Breadcrumbs } from '@tale-ui/react/breadcrumbs';
import { GridList } from '@tale-ui/react/grid-list';
import { Link } from '@tale-ui/react/link';
import { Pagination } from '@tale-ui/react/pagination';
import { PinInput } from '@tale-ui/react/pin-input';
import { Table, useTableController } from '@tale-ui/react/table';
import { TagGroup } from '@tale-ui/react/tag-group';
import { Tree } from '@tale-ui/react/tree';

// Interaction
import { DropZone } from '@tale-ui/react/drop-zone';
import { FileTrigger } from '@tale-ui/react/file-trigger';

// New components
import { Badge } from '@tale-ui/react/badge';
import { DotIcon } from '@tale-ui/react/dot-icon';
import { FeaturedIcon } from '@tale-ui/react/featured-icon';
import { RatingStars } from '@tale-ui/react/rating-stars';
import { RatingBadge } from '@tale-ui/react/rating-badge';
import { SelectNative } from '@tale-ui/react/select-native';
import { AppStoreButton } from '@tale-ui/react/app-store-button';
import { SocialButton, SocialButtonGroup } from '@tale-ui/react/social-button';
import { BadgeGroup } from '@tale-ui/react/badge-group';
import { SectionDivider } from '@tale-ui/react/section-divider';
import { BackgroundPattern } from '@tale-ui/react/background-pattern';
import { Illustration } from '@tale-ui/react/illustration';
import { IPhoneMockup } from '@tale-ui/react/iphone-mockup';
import { CreditCard } from '@tale-ui/react/credit-card';
import { InputGroup } from '@tale-ui/react/input-group';
import { InputTags } from '@tale-ui/react/input-tags';
import { MultiSelect } from '@tale-ui/react/multi-select';
import { TagSelect } from '@tale-ui/react/tag-select';
import { PaginationDot } from '@tale-ui/react/pagination-dot';
import { PaginationLine } from '@tale-ui/react/pagination-line';
import { PaymentInput } from '@tale-ui/react/payment-input';
import { Text } from '@tale-ui/react/text';
import { Kbd } from '@tale-ui/react/kbd';
import { Blockquote } from '@tale-ui/react/blockquote';
import { Citation } from '@tale-ui/react/citation';
import { Code } from '@tale-ui/react/code';
import { CodeBlock } from '@tale-ui/react/code-block';
import { Markdown } from '@tale-ui/react/markdown';
import { QRCode } from '@tale-ui/react/qr-code';
import { ImageCropper } from '@tale-ui/react/image-cropper';
import { VideoPlayer } from '@tale-ui/react/video-player';
import { FileUpload } from '@tale-ui/react/file-upload';
import { TextEditor } from '@tale-ui/react/text-editor';
import { Sidebar } from '@tale-ui/react/sidebar';
import { HeaderNav } from '@tale-ui/react/header-nav';

type NumberFieldSizingStyle = React.CSSProperties & {
  '--tale-number-field-width'?: string;
  '--tale-number-field-group-width'?: string;
};

const numberFieldCustomControlStyle: NumberFieldSizingStyle = {
  '--tale-number-field-width': '20rem',
  '--tale-number-field-group-width': '8.75rem',
};

const auditOverflowActions = [
  { id: 'edit', label: 'Edit' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'archive', label: 'Archive' },
  { id: 'share', label: 'Share' },
] as const;

const auditLightboxItems = [
  { id: 'coast', label: 'Rocky coast', color: 'var(--neutral-30)' },
  { id: 'forest', label: 'Forest trail', color: 'var(--neutral-50)' },
] as const;

function ToastAuditDemo() {
  const toastCount = React.useRef(0);
  const [queue] = React.useState(() => {
    const nextQueue = createToastQueue({ maxVisibleToasts: 2, defaultTimeout: 0 });
    nextQueue.add({
      title: 'Changes saved',
      description: 'Your component audit preferences are up to date.',
      variant: 'success',
    });
    return nextQueue;
  });

  return (
    <React.Fragment>
      <Button
        onPress={() => {
          toastCount.current += 1;
          queue.add({
            title: `Background task ${toastCount.current} complete`,
            variant: 'neutral',
          });
        }}
      >
        Show notification
      </Button>
      <ToastRegion queue={queue} />
    </React.Fragment>
  );
}

// ---------------------------------------------------------------------------
// Layout helpers
// ---------------------------------------------------------------------------

function Section({
  id,
  title,
  classes,
  children,
}: {
  id: string;
  title: string;
  classes: string[];
  children: React.ReactNode;
}) {
  const meta = getComponentAuditMeta(id);
  const isDeprecated = meta?.status === 'deprecated';
  const isNew = meta?.status === 'new';

  return (
    <section id={id} className="audit__section">
      <div className="audit__heading-row">
        <h2 className="audit__heading">{title}</h2>
        {isDeprecated && <span className="audit__status-badge">Deprecated</span>}
        {isNew && <span className="audit__status-badge audit__status-badge--new">New</span>}
      </div>
      {isDeprecated && (
        <p className="audit__status-note">
          <strong>{title} is deprecated.</strong> {meta.note}
        </p>
      )}
      <div className="audit__class-list">
        {classes.map((c) => (
          <code key={c} className="audit__class-tag">
            .{c}
          </code>
        ))}
      </div>
      {children}
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="audit__subheading">{children}</h3>;
}

function Row({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`audit__demo-row${className ? ` ${className}` : ''}`}>{children}</div>;
}

/** Visual-only ColorModeToggle that delegates to the Scale app instead of touching <html>. */
function InertColorModeToggle({ disabled }: { disabled?: boolean }) {
  const [dark, setDark] = React.useState(
    () => document.documentElement.getAttribute('data-color-mode') === 'dark',
  );

  React.useEffect(() => {
    const obs = new MutationObserver(() => {
      setDark(document.documentElement.getAttribute('data-color-mode') === 'dark');
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-color-mode'],
    });
    return () => obs.disconnect();
  }, []);

  return (
    <AriaSwitch
      aria-label="Toggle dark mode"
      isSelected={dark}
      onChange={(v) => {
        window.dispatchEvent(new CustomEvent('scale:set-bg', { detail: v ? 'dark' : 'light' }));
      }}
      className="tale-color-mode-toggle"
      isDisabled={disabled}
    />
  );
}

// ---------------------------------------------------------------------------
// TOC data
// ---------------------------------------------------------------------------

// TOC source — grouping matches the content sections below.
const COLOR_SHADES = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const;
const NEUTRAL_SHADES = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const;

const COMPONENT_AUDIT_META = {
  // Component-equivalence expansion (Bundles 1–4).
  'aspect-ratio': {
    status: 'new',
    note: 'Added in the component-equivalence expansion.',
  },
  blockquote: {
    status: 'new',
    note: 'Added in the component-equivalence expansion.',
  },
  'button-group': {
    status: 'new',
    note: 'Added in the component-equivalence expansion.',
  },
  code: {
    status: 'new',
    note: 'Added in the component-equivalence expansion.',
  },
  skeleton: {
    status: 'new',
    note: 'Added in the component-equivalence expansion.',
  },
  citation: {
    status: 'new',
    note: 'Added in the component-equivalence expansion.',
  },
  markdown: {
    status: 'new',
    note: 'Added in the component-equivalence expansion.',
  },
  timestamp: {
    status: 'new',
    note: 'Added in the component-equivalence expansion.',
  },
  outline: {
    status: 'new',
    note: 'Added in the component-equivalence expansion.',
  },
  'overflow-list': {
    status: 'new',
    note: 'Added in the component-equivalence expansion.',
  },
  resizable: {
    status: 'new',
    note: 'Added in the component-equivalence expansion.',
  },
  lightbox: {
    status: 'new',
    note: 'Added in the component-equivalence expansion.',
  },
  toast: {
    status: 'new',
    note: 'Added in the component-equivalence expansion.',
  },
  checkbox: {
    status: 'deprecated',
    note: 'Use CheckboxField for new code. Checkbox remains functional for existing code.',
  },
  radio: {
    status: 'deprecated',
    note: 'Use RadioField for new code. Radio remains functional for existing code.',
  },
  switch: {
    status: 'deprecated',
    note: 'Use SwitchField for new code. Switch remains functional for existing code.',
  },
} as const;

function getComponentAuditMeta(id: string) {
  return Object.prototype.hasOwnProperty.call(COMPONENT_AUDIT_META, id)
    ? COMPONENT_AUDIT_META[id as keyof typeof COMPONENT_AUDIT_META]
    : undefined;
}

const TOC = [
  { category: 'Palette', items: [{ id: 'palette', label: 'Color & Neutral' }] },
  {
    category: 'Form Controls',
    items: [
      { id: 'button', label: 'Button' },
      { id: 'button-group', label: 'ButtonGroup' },
      { id: 'icon-button', label: 'IconButton' },
      { id: 'input', label: 'Input' },
      { id: 'input-group', label: 'InputGroup' },
      { id: 'input-tags', label: 'InputTags' },
      { id: 'multi-select', label: 'MultiSelect' },
      { id: 'tag-select', label: 'TagSelect' },
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'checkbox-field', label: 'CheckboxField' },
      { id: 'checkbox-group', label: 'CheckboxGroup' },
      { id: 'radio', label: 'Radio' },
      { id: 'radio-field', label: 'RadioField' },
      { id: 'radio-group', label: 'RadioGroup' },
      { id: 'switch', label: 'Switch' },
      { id: 'switch-field', label: 'SwitchField' },
      { id: 'toggle-button', label: 'ToggleButton' },
      { id: 'toggle-button-group', label: 'ToggleButtonGroup' },
      { id: 'select', label: 'Select' },
      { id: 'autocomplete', label: 'Autocomplete' },
      { id: 'combobox', label: 'Combobox' },
      { id: 'number-field', label: 'NumberField' },
      { id: 'pin-input', label: 'PinInput' },
      { id: 'payment-input', label: 'PaymentInput' },
      { id: 'slider', label: 'Slider' },
      { id: 'search-field', label: 'SearchField' },
      { id: 'text-field', label: 'TextField' },
      { id: 'text-area', label: 'TextArea' },
      { id: 'select-native', label: 'SelectNative' },
    ],
  },
  {
    category: 'Date & Time',
    items: [
      { id: 'calendar', label: 'Calendar' },
      { id: 'date-field', label: 'DateField' },
      { id: 'time-field', label: 'TimeField' },
      { id: 'date-picker', label: 'DatePicker' },
      { id: 'date-range-picker', label: 'DateRangePicker' },
      { id: 'range-calendar', label: 'RangeCalendar' },
      { id: 'timestamp', label: 'Timestamp' },
    ],
  },
  {
    category: 'Color',
    items: [
      { id: 'color-area', label: 'ColorArea' },
      { id: 'color-slider', label: 'ColorSlider' },
      { id: 'color-wheel', label: 'ColorWheel' },
      { id: 'color-swatch', label: 'ColorSwatch' },
      { id: 'color-swatch-picker', label: 'ColorSwatchPicker' },
      { id: 'color-field', label: 'ColorField' },
      { id: 'color-picker', label: 'ColorPicker' },
    ],
  },
  {
    category: 'Overlay',
    items: [
      { id: 'dialog', label: 'Dialog' },
      { id: 'alert-dialog', label: 'AlertDialog' },
      { id: 'popover', label: 'Popover' },
      { id: 'preview-card', label: 'PreviewCard' },
      { id: 'drawer', label: 'Drawer' },
      { id: 'tooltip', label: 'Tooltip' },
      { id: 'lightbox', label: 'Lightbox' },
    ],
  },
  {
    category: 'Navigation',
    items: [
      { id: 'menu', label: 'Menu' },
      { id: 'context-menu', label: 'ContextMenu' },
      { id: 'command-palette', label: 'CommandPalette' },
      { id: 'navigation-menu', label: 'NavigationMenu' },
      { id: 'menubar', label: 'Menubar' },
      { id: 'breadcrumbs', label: 'Breadcrumbs' },
      { id: 'link', label: 'Link' },
      { id: 'outline', label: 'Outline' },
      { id: 'pagination', label: 'Pagination' },
      { id: 'pagination-dot', label: 'PaginationDot' },
      { id: 'pagination-line', label: 'PaginationLine' },
      { id: 'sidebar', label: 'Sidebar' },
      { id: 'header-nav', label: 'HeaderNav' },
    ],
  },
  {
    category: 'Layout',
    items: [
      { id: 'app-shell', label: 'AppShell' },
      { id: 'carousel', label: 'Carousel' },
      { id: 'accordion', label: 'Accordion' },
      { id: 'disclosure', label: 'Disclosure' },
      { id: 'tabs', label: 'Tabs' },
      { id: 'scroll-area', label: 'ScrollArea' },
      { id: 'separator', label: 'Separator' },
      { id: 'toolbar', label: 'Toolbar' },
      { id: 'card', label: 'Card' },
      { id: 'aspect-ratio', label: 'AspectRatio' },
      { id: 'chat', label: 'Chat' },
      { id: 'column', label: 'Column' },
      { id: 'row', label: 'Row' },
      { id: 'overflow-list', label: 'OverflowList' },
      { id: 'resizable', label: 'Resizable' },
    ],
  },
  {
    category: 'Feedback',
    items: [
      { id: 'banner', label: 'Banner' },
      { id: 'progress-bar', label: 'ProgressBar' },
      { id: 'progress-circle', label: 'ProgressCircle' },
      { id: 'meter', label: 'Meter' },
      { id: 'skeleton', label: 'Skeleton' },
      { id: 'spinner', label: 'Spinner' },
      { id: 'toast', label: 'Toast' },
    ],
  },
  {
    category: 'Display',
    items: [
      { id: 'avatar', label: 'Avatar' },
      { id: 'badge', label: 'Badge' },
      { id: 'dot-icon', label: 'DotIcon' },
      { id: 'empty-state', label: 'EmptyState' },
      { id: 'featured-icon', label: 'FeaturedIcon' },
      { id: 'grid-list', label: 'GridList' },
      { id: 'key-value-pairs', label: 'KeyValuePairs' },
      { id: 'rating-badge', label: 'RatingBadge' },
      { id: 'rating-stars', label: 'RatingStars' },
      { id: 'table', label: 'Table' },
      { id: 'tag-group', label: 'TagGroup' },
      { id: 'tree', label: 'Tree' },
      { id: 'image', label: 'Image' },
      { id: 'list', label: 'List' },
      { id: 'list-box', label: 'ListBox' },
      { id: 'qr-code', label: 'QRCode' },
      { id: 'video-player', label: 'VideoPlayer' },
    ],
  },
  {
    category: 'Form Structure',
    items: [
      { id: 'field', label: 'Field' },
      { id: 'fieldset', label: 'Fieldset' },
      { id: 'form', label: 'Form' },
    ],
  },
  {
    category: 'Interaction',
    items: [
      { id: 'drop-zone', label: 'DropZone' },
      { id: 'file-trigger', label: 'FileTrigger' },
      { id: 'file-upload', label: 'FileUpload' },
      { id: 'image-cropper', label: 'ImageCropper' },
      { id: 'text-editor', label: 'TextEditor' },
    ],
  },
  {
    category: 'Typography',
    items: [
      { id: 'blockquote', label: 'Blockquote' },
      { id: 'citation', label: 'Citation' },
      { id: 'code', label: 'Code' },
      { id: 'code-block', label: 'CodeBlock' },
      { id: 'kbd', label: 'Kbd' },
      { id: 'markdown', label: 'Markdown' },
      { id: 'text', label: 'Text' },
    ],
  },
  {
    category: 'Marketing',
    items: [
      { id: 'app-store-button', label: 'AppStoreButton' },
      { id: 'social-button', label: 'SocialButton' },
      { id: 'social-button-group', label: 'SocialButtonGroup' },
      { id: 'badge-group', label: 'BadgeGroup' },
      { id: 'section-divider', label: 'SectionDivider' },
      { id: 'background-pattern', label: 'BackgroundPattern' },
      { id: 'illustration', label: 'Illustration' },
      { id: 'iphone-mockup', label: 'IphoneMockup' },
      { id: 'credit-card', label: 'CreditCard' },
    ],
  },
  {
    category: 'Utility',
    items: [
      { id: 'color-mode-toggle', label: 'ColorModeToggle' },
      { id: 'i18n-provider', label: 'I18nProvider' },
      { id: 'icon', label: 'Icon' },
      { id: 'container', label: 'Container' },
    ],
  },
];

function I18nAuditValue() {
  const { formatMessage, mode } = useTaleI18n();
  return (
    <Text>
      {mode}: {formatMessage('table.page', { page: 2, pageCount: 8 })}
    </Text>
  );
}

const TOC_ITEMS = TOC.flatMap(({ items }) => items).sort((a, b) => a.label.localeCompare(b.label));

// ---------------------------------------------------------------------------
// Calendar section (react-aria-components)
// ---------------------------------------------------------------------------

function CalendarSection() {
  return (
    <Section
      id="calendar"
      title="Calendar"
      classes={[
        'tale-calendar',
        'tale-calendar__header',
        'tale-calendar__grid',
        'tale-calendar__grid-header',
        'tale-calendar__grid-body',
        'tale-calendar__cell',
        'tale-calendar__heading',
        'tale-calendar__prev-button',
        'tale-calendar__next-button',
      ]}
    >
      <SubHeading>Interactive</SubHeading>
      <Calendar.Root>
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
      <SubHeading>Disabled</SubHeading>
      <Calendar.Root isDisabled>
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
      <SubHeading>Read Only</SubHeading>
      <Calendar.Root isReadOnly>
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
      <SubHeading>Month and Year Pickers</SubHeading>
      <Calendar.Root>
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
    </Section>
  );
}

// ---------------------------------------------------------------------------
// ColorPicker section (nested controls share state through ColorPicker.Root)
// ---------------------------------------------------------------------------

const multiSelectItems = [
  { id: 'react', name: 'React' },
  { id: 'vue', name: 'Vue' },
  { id: 'angular', name: 'Angular' },
  { id: 'svelte', name: 'Svelte' },
  { id: 'solid', name: 'SolidJS' },
];

function MultiSelectAuditDemo({ size = 'md' as 'sm' | 'md' | 'lg', label = 'Frameworks' } = {}) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  return (
    <MultiSelect.Root
      label={label}
      size={size}
      placeholder="Select frameworks"
      items={multiSelectItems}
      selectedKeys={selected}
      onSelectionChange={(keys) => setSelected(keys as Set<string>)}
      onReset={() => setSelected(new Set())}
      onSelectAll={() => setSelected(new Set(multiSelectItems.map((i) => i.id)))}
    >
      {(item: { id: string; name: string }) => (
        <MultiSelect.Item id={item.id} textValue={item.name}>
          {item.name}
        </MultiSelect.Item>
      )}
    </MultiSelect.Root>
  );
}

const tagSelectPeople = [
  { id: 'alice', name: 'Alice Johnson' },
  { id: 'bob', name: 'Bob Smith' },
  { id: 'carol', name: 'Carol Davis' },
  { id: 'dave', name: 'Dave Wilson' },
  { id: 'eve', name: 'Eve Martinez' },
  { id: 'frank', name: 'Frank Lee' },
];

function TagSelectAuditSection() {
  const [selected, setSelected] = React.useState<Set<import('react-aria-components').Key>>(
    new Set(['alice', 'bob']),
  );
  return (
    <React.Fragment>
      <SubHeading>Default</SubHeading>
      <div className="audit__demo-narrow audit__demo-spaced">
        <TagSelect.Root
          label="Team members"
          placeholder="Search members…"
          description="Select everyone who should have access."
          items={tagSelectPeople}
          selectedKeys={selected}
          onSelectionChange={setSelected}
        >
          {(person: { id: string; name: string }) => (
            <TagSelect.Item id={person.id} textValue={person.name}>
              {person.name}
            </TagSelect.Item>
          )}
        </TagSelect.Root>
      </div>
      <SubHeading>Sizes</SubHeading>
      <div className="audit__demo-narrow audit__demo-spaced">
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <TagSelect.Root
            key={size}
            size={size}
            label={`${size.toUpperCase()} size`}
            placeholder="Search…"
            items={tagSelectPeople}
            defaultSelectedKeys={new Set(['alice'])}
          >
            {(person: { id: string; name: string }) => (
              <TagSelect.Item id={person.id} textValue={person.name}>
                {person.name}
              </TagSelect.Item>
            )}
          </TagSelect.Root>
        ))}
      </div>
      <SubHeading>States</SubHeading>
      <div className="audit__demo-narrow audit__demo-spaced">
        <TagSelect.Root
          label="Invalid"
          isInvalid
          isRequired
          errorMessage="Please select at least one member."
          items={tagSelectPeople}
          defaultSelectedKeys={new Set()}
        >
          {(person: { id: string; name: string }) => (
            <TagSelect.Item id={person.id} textValue={person.name}>
              {person.name}
            </TagSelect.Item>
          )}
        </TagSelect.Root>
        <TagSelect.Root
          label="Disabled"
          isDisabled
          items={tagSelectPeople}
          defaultSelectedKeys={new Set(['alice', 'carol'])}
        >
          {(person: { id: string; name: string }) => (
            <TagSelect.Item id={person.id} textValue={person.name}>
              {person.name}
            </TagSelect.Item>
          )}
        </TagSelect.Root>
      </div>
    </React.Fragment>
  );
}

function NavMenuDropdownDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#">Home</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger onClick={() => setOpen((o) => !o)}>
            Products <NavigationMenu.Icon />
          </NavigationMenu.Trigger>
          {open && (
            <NavigationMenu.Popup>
              <NavigationMenu.Content>
                <NavigationMenu.Link href="#">Widget</NavigationMenu.Link>
                <NavigationMenu.Link href="#">Gadget</NavigationMenu.Link>
              </NavigationMenu.Content>
            </NavigationMenu.Popup>
          )}
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

function ColorPickerDemo() {
  const [color, setColor] = React.useState(parseColor('hsb(200, 100%, 100%)'));
  return (
    <ColorPicker.Root value={color} onChange={setColor}>
      <div className="display--flex flex--col gap--2xs audit__color-area-wrap">
        <ColorArea.Root xChannel="saturation" yChannel="brightness" className="audit__color-area">
          <ColorArea.Thumb />
        </ColorArea.Root>
        <ColorSlider.Root channel="hue">
          <ColorSlider.Track>
            <ColorSlider.Thumb />
          </ColorSlider.Track>
        </ColorSlider.Root>
        <ColorSlider.Root channel="alpha">
          <ColorSlider.Track>
            <ColorSlider.Thumb />
          </ColorSlider.Track>
        </ColorSlider.Root>
      </div>
    </ColorPicker.Root>
  );
}

// ---------------------------------------------------------------------------
// Combobox section (needs state)
// ---------------------------------------------------------------------------

const countries = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Argentina',
  'Australia',
  'Austria',
  'Belgium',
  'Brazil',
  'Canada',
  'Chile',
  'China',
  'Colombia',
  'Denmark',
  'Egypt',
  'Finland',
  'France',
  'Germany',
  'Greece',
];

function ComboboxDemo() {
  return (
    <div className="audit__demo-narrow">
      <Combobox.Root>
        <Combobox.InputGroup>
          <Combobox.Input placeholder="Search country…" />
          <Combobox.Trigger />
        </Combobox.InputGroup>
        <Combobox.Popover offset={4}>
          <Combobox.ListBox>
            {countries.map((c) => (
              <Combobox.Item key={c} id={c} textValue={c}>
                {c}
              </Combobox.Item>
            ))}
          </Combobox.ListBox>
        </Combobox.Popover>
      </Combobox.Root>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Autocomplete section (needs state)
// ---------------------------------------------------------------------------

const cities = [
  'Amsterdam',
  'Berlin',
  'Chicago',
  'Dublin',
  'Edinburgh',
  'Florence',
  'Geneva',
  'Helsinki',
];

function AutocompleteDemo() {
  const { contains } = useFilter({ sensitivity: 'base' });
  return (
    <div className="audit__demo-narrow">
      <Autocomplete.Root filter={contains}>
        <Autocomplete.SearchField aria-label="Search city">
          <Autocomplete.Input placeholder="Search city…" />
        </Autocomplete.SearchField>
        <Autocomplete.ListBox aria-label="Cities">
          {cities.map((c) => (
            <Autocomplete.Item key={c} id={c} textValue={c}>
              {c}
            </Autocomplete.Item>
          ))}
        </Autocomplete.ListBox>
      </Autocomplete.Root>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Menu with checkbox items (needs state)
// ---------------------------------------------------------------------------

function MenuCheckboxDemo() {
  return (
    <Menu.Root>
      <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
        Format <Icon icon={ChevronDown} size="sm" />
      </Menu.Trigger>
      <Menu.Popover offset={4}>
        <Menu.MenuList aria-label="Format">
          <Menu.CheckboxItem textValue="Bold">Bold</Menu.CheckboxItem>
          <Menu.CheckboxItem textValue="Italic">Italic</Menu.CheckboxItem>
          <Menu.CheckboxItem textValue="Underline">Underline</Menu.CheckboxItem>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}

function MenuRadioDemo() {
  return (
    <Menu.Root>
      <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
        View <Icon icon={ChevronDown} size="sm" />
      </Menu.Trigger>
      <Menu.Popover offset={4}>
        <Menu.MenuList aria-label="View">
          <Menu.RadioItem textValue="List">List</Menu.RadioItem>
          <Menu.RadioItem textValue="Grid">Grid</Menu.RadioItem>
          <Menu.RadioItem textValue="Board">Board</Menu.RadioItem>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}

function MenuLinkDemo() {
  return (
    <Menu.Root>
      <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
        Links <Icon icon={ChevronDown} size="sm" />
      </Menu.Trigger>
      <Menu.Popover offset={4}>
        <Menu.MenuList aria-label="Links">
          <Menu.LinkItem textValue="Documentation" href="#">
            Documentation
          </Menu.LinkItem>
          <Menu.LinkItem textValue="GitHub" href="#">
            GitHub
          </Menu.LinkItem>
          <Menu.Separator />
          <Menu.LinkItem textValue="Report Issue" href="#">
            Report Issue
          </Menu.LinkItem>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}

// ---------------------------------------------------------------------------
// Dialog demo (controlled, matches Storybook patterns)
// ---------------------------------------------------------------------------

function DialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog.Root isOpen={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="tale-button--primary">Open Dialog</Dialog.Trigger>
      <Dialog.Backdrop>
        <Dialog.Popup>
          <Dialog.Close aria-label="Close" />
          <Dialog.Title>Dialog Title</Dialog.Title>
          <Dialog.Description>
            This is a modal dialog. It traps focus and requires the user to take action.
          </Dialog.Description>
          <Dialog.Actions>
            <Button variant="neutral" onPress={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onPress={() => setOpen(false)}>
              Confirm
            </Button>
          </Dialog.Actions>
        </Dialog.Popup>
      </Dialog.Backdrop>
    </Dialog.Root>
  );
}

function DestructiveDialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog.Root isOpen={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="tale-button--danger">Delete Account</Dialog.Trigger>
      <Dialog.Backdrop>
        <Dialog.Popup>
          <Dialog.Close aria-label="Close" />
          <Dialog.Title>Delete your account?</Dialog.Title>
          <Dialog.Description>
            This action is permanent and cannot be undone. All your data will be lost.
          </Dialog.Description>
          <Dialog.Actions>
            <Button variant="neutral" onPress={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onPress={() => setOpen(false)}>
              Delete Account
            </Button>
          </Dialog.Actions>
        </Dialog.Popup>
      </Dialog.Backdrop>
    </Dialog.Root>
  );
}

function DismissableDialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog.Root isOpen={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="tale-button--neutral">Open Dismissable</Dialog.Trigger>
      <Dialog.Backdrop isDismissable>
        <Dialog.Popup>
          <Dialog.Close aria-label="Close" />
          <Dialog.Title>Dismissable Dialog</Dialog.Title>
          <Dialog.Description>
            Click the backdrop or press Escape to dismiss this dialog.
          </Dialog.Description>
          <Dialog.Actions>
            <Button variant="neutral" onPress={() => setOpen(false)}>
              Dismiss
            </Button>
          </Dialog.Actions>
        </Dialog.Popup>
      </Dialog.Backdrop>
    </Dialog.Root>
  );
}

function ScrollableDialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog.Root isOpen={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="tale-button--primary">Terms &amp; Conditions</Dialog.Trigger>
      <Dialog.Backdrop>
        <Dialog.Popup>
          <Dialog.Close aria-label="Close" />
          <Dialog.Title>Terms of Service</Dialog.Title>
          <Dialog.Description>Please read the following terms carefully.</Dialog.Description>
          <div className="audit__dialog-scroll">
            {Array.from({ length: 12 }, (_, i) => (
              <p key={i} className="audit__dialog-scroll-paragraph">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            ))}
          </div>
          <Dialog.Actions>
            <Button variant="neutral" onPress={() => setOpen(false)}>
              Decline
            </Button>
            <Button variant="primary" onPress={() => setOpen(false)}>
              Accept
            </Button>
          </Dialog.Actions>
        </Dialog.Popup>
      </Dialog.Backdrop>
    </Dialog.Root>
  );
}

// ---------------------------------------------------------------------------
// AlertDialog demo (controlled, matches Storybook patterns)
// ---------------------------------------------------------------------------

function AlertDialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <AlertDialog.Root isOpen={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger className="tale-button tale-button--danger">
        Delete Item
      </AlertDialog.Trigger>
      <AlertDialog.Backdrop>
        <AlertDialog.Popup>
          <AlertDialog.Content>
            <AlertDialog.Title>Are you sure?</AlertDialog.Title>
            <AlertDialog.Description>
              This will permanently delete the item. This action cannot be undone.
            </AlertDialog.Description>
            <AlertDialog.Actions>
              <Button variant="neutral" onPress={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onPress={() => setOpen(false)}>
                Delete
              </Button>
            </AlertDialog.Actions>
          </AlertDialog.Content>
        </AlertDialog.Popup>
      </AlertDialog.Backdrop>
    </AlertDialog.Root>
  );
}

// ---------------------------------------------------------------------------
// Sortable Table demo
// ---------------------------------------------------------------------------

const tableRows = [
  { id: '1', name: 'Alice', role: 'Engineer', status: 'Active' },
  { id: '2', name: 'Bob', role: 'Designer', status: 'Away' },
  { id: '3', name: 'Charlie', role: 'Manager', status: 'Active' },
  { id: '4', name: 'Dave', role: 'Editor', status: 'Active' },
  { id: '5', name: 'Eve', role: 'Admin', status: 'Away' },
];

function SortableTableDemo() {
  const controller = useTableController({
    tableId: 'audit-people',
    defaultSortDescriptor: { column: 'name', direction: 'ascending' },
    defaultSelectedKeys: new Set(['2']),
    defaultFilter: { schemaVersion: '1.0.0', value: 'a' },
    defaultPageSize: 3,
    totalRows: tableRows.length,
  });
  const filtered = controller.filtering.filterRows(tableRows, (row, filter) =>
    `${row.name} ${row.role} ${row.status}`.toLowerCase().includes(filter.value.toLowerCase()),
  );
  const sorted = controller.sorting.sortRows(filtered, (left, right, column) => {
    if (column === 'role') {
      return left.role.localeCompare(right.role);
    }
    if (column === 'status') {
      return left.status.localeCompare(right.status);
    }
    return left.name.localeCompare(right.name);
  });
  const visibleRows = controller.pagination.paginateRows(sorted);

  return (
    <Table.Root
      {...controller.tableProps}
      aria-label="Sortable people"
      selectionMode="multiple"
      className="audit__demo-extra-wide"
    >
      <Table.Header>
        <Table.Column id="name" isRowHeader allowsSorting>
          Name
        </Table.Column>
        <Table.Column id="role" allowsSorting>
          Role
        </Table.Column>
        <Table.Column id="status" allowsSorting>
          Status
        </Table.Column>
      </Table.Header>
      <Table.Body>
        {visibleRows.map((row) => (
          <Table.Row key={row.id} id={row.id}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.role}</Table.Cell>
            <Table.Cell>{row.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

// ---------------------------------------------------------------------------
// FileUpload section (needs state for live upload simulation)
// ---------------------------------------------------------------------------

function FileUploadAuditSection() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [progress, setProgress] = React.useState<Record<number, number>>({});

  const addFiles = (fl: FileList) => {
    const arr = Array.from(fl);
    setFiles((prev) => {
      const next = [...prev, ...arr];
      arr.forEach((_, i) => {
        const idx = prev.length + i;
        let pct = 0;
        const timer = setInterval(() => {
          pct += 10;
          setProgress((p) => ({ ...p, [idx]: pct }));
          if (pct >= 100) {
            clearInterval(timer);
          }
        }, 200);
      });
      return next;
    });
  };

  return (
    <React.Fragment>
      <SubHeading>Default (ProgressBar)</SubHeading>
      <div style={{ maxWidth: 480 }}>
        <FileUpload.Root>
          <FileUpload.DropZone
            hint="PNG, JPG, PDF (max 5 MB)"
            accept="image/*,.pdf"
            maxSize={5 * 1024 * 1024}
            onDropFiles={addFiles}
          />
          {files.length > 0 && (
            <FileUpload.List>
              {files.map((f, i) => (
                <FileUpload.ListItemProgressBar
                  key={`${f.name}-${i}`}
                  name={f.name}
                  size={f.size}
                  progress={progress[i] ?? 0}
                  onDelete={() => {
                    setFiles((p) => p.filter((_, j) => j !== i));
                    setProgress((p) => {
                      const n = { ...p };
                      delete n[i];
                      return n;
                    });
                  }}
                />
              ))}
            </FileUpload.List>
          )}
        </FileUpload.Root>
      </div>
      <SubHeading>ProgressFill Variant</SubHeading>
      <div style={{ maxWidth: 480 }}>
        <FileUpload.Root>
          <FileUpload.DropZone hint="Any file type accepted" />
          <FileUpload.List>
            <FileUpload.ListItemProgressFill
              name="design-system.fig"
              size={2_400_000}
              progress={65}
              onDelete={() => {}}
            />
            <FileUpload.ListItemProgressFill
              name="brand-assets.zip"
              size={8_100_000}
              progress={100}
              onDelete={() => {}}
            />
          </FileUpload.List>
        </FileUpload.Root>
      </div>
      <SubHeading>Error States</SubHeading>
      <div style={{ maxWidth: 480 }}>
        <FileUpload.List>
          <FileUpload.ListItemProgressBar
            name="huge-video.mp4"
            size={500_000_000}
            progress={0}
            failed
            onDelete={() => {}}
            onRetry={() => {}}
          />
          <FileUpload.ListItemProgressFill
            name="corrupt.psd"
            size={1_200_000}
            progress={0}
            failed
            onDelete={() => {}}
            onRetry={() => {}}
          />
        </FileUpload.List>
      </div>
      <SubHeading>Disabled DropZone</SubHeading>
      <div style={{ maxWidth: 480 }}>
        <FileUpload.Root>
          <FileUpload.DropZone hint="Uploads are disabled" isDisabled />
        </FileUpload.Root>
      </div>
    </React.Fragment>
  );
}

// ---------------------------------------------------------------------------
// ImageCropper section (needs state)
// ---------------------------------------------------------------------------

function ImageCropperAuditSection() {
  const [crop1, setCrop1] = React.useState<import('@tale-ui/react/image-cropper').Crop>();
  const [crop2, setCrop2] = React.useState<import('@tale-ui/react/image-cropper').Crop>();

  return (
    <React.Fragment>
      <SubHeading>Free crop</SubHeading>
      <div style={{ maxWidth: 480 }}>
        <ImageCropper.Root crop={crop1} onChange={setCrop1}>
          <ImageCropper.Img
            src="https://placehold.co/600x400/6366f1/ffffff?text=Crop+Me"
            alt="Demo"
          />
        </ImageCropper.Root>
      </div>
      <SubHeading>Circular 1:1 (avatar)</SubHeading>
      <div style={{ maxWidth: 360 }}>
        <ImageCropper.Root crop={crop2} onChange={setCrop2} aspect={1} circularCrop>
          <ImageCropper.Img
            src="https://placehold.co/400x400/6366f1/ffffff?text=Avatar"
            alt="Avatar crop"
          />
        </ImageCropper.Root>
      </div>
    </React.Fragment>
  );
}

// ---------------------------------------------------------------------------
// Main audit page
// ---------------------------------------------------------------------------

function ControlledTabsDemo() {
  const [selected, setSelected] = React.useState<string>('tab-home');
  return (
    <div className="audit__demo-extra-wide">
      <Tabs.Root selectedKey={selected} onSelectionChange={(key) => setSelected(key as string)}>
        <Tabs.List>
          <Tabs.Tab id="tab-home">Home</Tabs.Tab>
          <Tabs.Tab id="tab-profile">Profile</Tabs.Tab>
          <Tabs.Tab id="tab-settings">Settings</Tabs.Tab>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Panel id="tab-home">Home content.</Tabs.Panel>
        <Tabs.Panel id="tab-profile">Profile content.</Tabs.Panel>
        <Tabs.Panel id="tab-settings">Settings content.</Tabs.Panel>
      </Tabs.Root>
      <span className="audit__controlled-tab-label">Selected: {String(selected)}</span>
    </div>
  );
}

function CardButtonAuditDemo() {
  const [selected, setSelected] = React.useState('harbour');
  const themes = [
    { id: 'harbour', name: 'Harbour' },
    { id: 'violet', name: 'Violet Dusk' },
    { id: 'fern', name: 'Fern' },
  ];

  return (
    <div
      role="group"
      aria-label="Theme actions"
      style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}
    >
      {themes.map((theme) => (
        <Card.Button
          key={theme.id}
          padding="sm"
          isSelected={selected === theme.id}
          onPress={() => setSelected(theme.id)}
          style={{ width: '10rem' }}
        >
          <Text as="span" variant="label" size="m">
            {theme.name}
          </Text>
          <Text as="span" variant="text" size="s" color="muted">
            Apply theme
          </Text>
        </Card.Button>
      ))}
      <Card.Button padding="sm" isDisabled style={{ width: '10rem' }}>
        <Text as="span" variant="label" size="m">
          Unavailable
        </Text>
      </Card.Button>
    </div>
  );
}

const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];

export default function ComponentAudit() {
  return (
    <div className="audit">
      <div className="audit__floating-mode-toggle">
        <span className="audit__floating-mode-label">Dark mode</span>
        <InertColorModeToggle />
      </div>
      {/* TOC */}
      <nav className="audit__sidebar">
        <div className="audit__sidebar-header">
          <span className="audit__sidebar-title">Component Audit</span>
        </div>
        {TOC_ITEMS.map(({ id, label }) => {
          const meta = getComponentAuditMeta(id);
          const isDeprecated = meta?.status === 'deprecated';
          const isNew = meta?.status === 'new';

          return (
            <a
              key={id}
              href={`#${id}`}
              className={`audit__toc-link${isDeprecated ? ' audit__toc-link--deprecated' : ''}${isNew ? ' audit__toc-link--new' : ''}`}
              aria-label={isDeprecated ? `${label}, deprecated` : isNew ? `${label}, new` : label}
            >
              <span>{label}</span>
              {isDeprecated && <span className="audit__toc-status">Deprecated</span>}
              {isNew && <span className="audit__toc-status audit__toc-status--new">New</span>}
            </a>
          );
        })}
      </nav>

      {/* Content */}
      <main>
        {/* ============================================================= */}
        {/* PALETTE */}
        {/* ============================================================= */}

        <Section id="palette" title="Color & Neutral Palette" classes={[]}>
          <SubHeading>Color shades</SubHeading>
          <div className="audit__palette-grid">
            {COLOR_SHADES.map((s) => (
              <div
                key={s}
                className="audit__palette-swatch"
                style={{ background: `var(--color-${s})`, color: `var(--color-${s}-fg)` }}
              >
                <div className="audit__palette-shade">{s}</div>
                <div className="audit__palette-ag">Ag</div>
                <div className="audit__palette-token">--color-{s}-fg</div>
              </div>
            ))}
          </div>

          <SubHeading>Neutral shades</SubHeading>
          <div className="audit__palette-grid">
            {NEUTRAL_SHADES.map((s) => (
              <div
                key={s}
                className="audit__palette-swatch"
                style={{ background: `var(--neutral-${s})`, color: `var(--neutral-${s}-fg)` }}
              >
                <div className="audit__palette-shade">{s}</div>
                <div className="audit__palette-ag">Ag</div>
                <div className="audit__palette-token">--neutral-{s}-fg</div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="lightbox"
          title="Lightbox"
          classes={[
            'tale-lightbox',
            'tale-lightbox__trigger',
            'tale-lightbox__backdrop',
            'tale-lightbox__popup',
            'tale-lightbox__content',
            'tale-lightbox__caption',
            'tale-lightbox__previous',
            'tale-lightbox__next',
            'tale-lightbox__close',
          ]}
        >
          <SubHeading>Collection viewer</SubHeading>
          <Lightbox.Root
            items={auditLightboxItems}
            getKey={(item) => item.id}
            getLabel={(item) => item.label}
            renderContent={(item) => (
              <div
                role="img"
                aria-label={item.label}
                style={{
                  width: '32rem',
                  maxWidth: '70vw',
                  aspectRatio: '3 / 2',
                  borderRadius: 'var(--radius-m)',
                  background: item.color,
                }}
              />
            )}
          >
            <LayoutRow gap="s">
              {auditLightboxItems.map((item) => (
                <Lightbox.Trigger key={item.id} itemKey={item.id} variant="neutral">
                  Open {item.label}
                </Lightbox.Trigger>
              ))}
            </LayoutRow>
            <Lightbox.Backdrop isDismissable>
              <Lightbox.Popup>
                <Lightbox.Content />
                <Lightbox.Caption />
                <Lightbox.Previous />
                <Lightbox.Next />
                <Lightbox.Close />
              </Lightbox.Popup>
            </Lightbox.Backdrop>
          </Lightbox.Root>
        </Section>

        {/* ============================================================= */}
        {/* UTILITY */}
        {/* ============================================================= */}

        <Section
          id="color-mode-toggle"
          title="ColorModeToggle"
          classes={['tale-color-mode-toggle']}
        >
          <SubHeading>Default (controls Theme Playground background)</SubHeading>
          <Row>
            <InertColorModeToggle />
          </Row>
          <SubHeading>Disabled</SubHeading>
          <Row>
            <InertColorModeToggle disabled />
          </Row>
        </Section>

        <Section id="i18n-provider" title="I18nProvider" classes={[]}>
          <SubHeading>Pseudo-locale expansion</SubHeading>
          <I18nProvider mode="pseudo">
            <I18nAuditValue />
          </I18nProvider>
          <SubHeading>Forced RTL</SubHeading>
          <I18nProvider mode="rtl">
            <I18nAuditValue />
          </I18nProvider>
        </Section>

        <Section
          id="icon"
          title="Icon"
          classes={['tale-icon', 'tale-icon--sm', 'tale-icon--lg', 'tale-icon--xl']}
        >
          <SubHeading>All Sizes</SubHeading>
          <Row>
            <Icon icon={Star} size="sm" />
            <Icon icon={Star} />
            <Icon icon={Star} size="lg" />
            <Icon icon={Star} size="xl" />
          </Row>
          <SubHeading>Icon Gallery</SubHeading>
          <Row>
            <Icon icon={Heart} />
            <Icon icon={Star} />
            <Icon icon={Bell} />
            <Icon icon={Settings} />
            <Icon icon={Search} />
            <Icon icon={Plus} />
            <Icon icon={Trash2} />
            <Icon icon={Download} />
            <Icon icon={AlertCircle} />
            <Icon icon={CheckCircle} />
            <Icon icon={Info} />
            <Icon icon={Mail} />
            <Icon icon={User} />
            <Icon icon={Home} />
            <Icon icon={ChevronRight} />
            <Icon icon={ArrowRight} />
          </Row>
          <SubHeading>Color Inheritance</SubHeading>
          <Row>
            <span style={{ color: 'var(--color-60)' }}>
              <Icon icon={Heart} />
            </span>
            <span style={{ color: 'var(--neutral-50)' }}>
              <Icon icon={Heart} />
            </span>
            <span style={{ color: 'var(--neutral-80)' }}>
              <Icon icon={Heart} />
            </span>
          </Row>
          <SubHeading>With Button</SubHeading>
          <Row>
            <Button variant="primary">
              <Icon icon={Plus} size="sm" /> Add
            </Button>
            <Button variant="neutral">
              <Icon icon={Download} size="sm" /> Download
            </Button>
            <Button variant="ghost">
              <Icon icon={Settings} size="sm" /> Settings
            </Button>
            <Button variant="danger">
              <Icon icon={Trash2} size="sm" /> Delete
            </Button>
          </Row>
        </Section>

        <Section id="container" title="Container" classes={[]}>
          <SubHeading>Color overrides</SubHeading>
          <Row>
            {(['brand', 'red', 'indigo', 'green', 'random'] as const).map((color) => (
              <Container key={color} color={color} className="audit__palette-demo">
                <span className="audit__palette-label">{color}</span>
              </Container>
            ))}
          </Row>
        </Section>

        {/* FORM CONTROLS */}
        {/* ============================================================= */}

        <Section
          id="button"
          title="Button"
          classes={[
            'tale-button',
            'tale-button--primary',
            'tale-button--neutral',
            'tale-button--ghost',
            'tale-button--danger',
            'tale-button--danger-neutral',
            'tale-button--danger-ghost',
            'tale-button--inverse',
            'tale-button--sm',
            'tale-button--md',
            'tale-button--lg',
            'tale-button__content',
            'tale-button__spinner',
            'tale-button__content--with-spinner',
            'tale-button__spinner--inline',
          ]}
        >
          <SubHeading>Variants</SubHeading>
          <Row>
            <Button variant="primary">Primary</Button>
            <Button variant="neutral">Neutral</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="danger-neutral">Danger Neutral</Button>
            <Button variant="danger-ghost">Danger Ghost</Button>
            <Button variant="inverse">Inverse</Button>
          </Row>
          <SubHeading>Sizes</SubHeading>
          <Row>
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="md">
              Medium
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
          </Row>
          <SubHeading>Disabled</SubHeading>
          <Row>
            <Button disabled variant="primary">
              Primary
            </Button>
            <Button disabled variant="neutral">
              Neutral
            </Button>
            <Button disabled variant="ghost">
              Ghost
            </Button>
            <Button disabled variant="danger">
              Danger
            </Button>
            <Button disabled variant="danger-neutral">
              Danger Neutral
            </Button>
            <Button disabled variant="danger-ghost">
              Danger Ghost
            </Button>
            <Button disabled variant="inverse">
              Inverse
            </Button>
          </Row>
          <SubHeading>With Icons</SubHeading>
          <Row>
            <Button variant="primary" size="md">
              <Icon icon={Plus} size="sm" />
              Add Item
            </Button>
            <Button variant="neutral" size="md">
              Settings
              <Icon icon={ChevronDown} size="sm" />
            </Button>
          </Row>
          <SubHeading>Pending</SubHeading>
          <Row>
            <Button isPending variant="primary">
              Primary
            </Button>
            <Button isPending variant="neutral">
              Neutral
            </Button>
            <Button isPending variant="ghost">
              Ghost
            </Button>
            <Button isPending variant="danger">
              Danger
            </Button>
            <Button isPending variant="danger-neutral">
              Danger Neutral
            </Button>
            <Button isPending variant="danger-ghost">
              Danger Ghost
            </Button>
            <Button isPending variant="inverse">
              Inverse
            </Button>
          </Row>
          <SubHeading>Pending with Text</SubHeading>
          <Row>
            <Button isPending showTextWhileLoading variant="primary">
              Saving…
            </Button>
            <Button isPending showTextWhileLoading variant="neutral">
              Loading
            </Button>
            <Button isPending showTextWhileLoading variant="danger">
              Deleting…
            </Button>
          </Row>
        </Section>

        <Section
          id="button-group"
          title="ButtonGroup"
          classes={[
            'tale-button-group',
            'tale-button-group--horizontal',
            'tale-button-group--vertical',
            'tale-button-group--attached',
          ]}
        >
          <SubHeading>Related actions</SubHeading>
          <ButtonGroup aria-label="Editing actions">
            <Button variant="neutral">Cut</Button>
            <Button variant="neutral">Copy</Button>
            <Button variant="neutral">Paste</Button>
          </ButtonGroup>
          <SubHeading>Attached vertical group</SubHeading>
          <ButtonGroup aria-label="Alignment actions" orientation="vertical" isAttached>
            <Button variant="neutral">Start</Button>
            <Button variant="neutral">Center</Button>
            <Button variant="neutral">End</Button>
          </ButtonGroup>
        </Section>

        <Section
          id="icon-button"
          title="IconButton"
          classes={[
            'tale-icon-button',
            'tale-icon-button--sm',
            'tale-icon-button--md',
            'tale-icon-button--lg',
          ]}
        >
          <SubHeading>Variants</SubHeading>
          <Row>
            <IconButton variant="primary" aria-label="Add">
              <Icon icon={Plus} />
            </IconButton>
            <IconButton variant="neutral" aria-label="Settings">
              <Icon icon={Settings} />
            </IconButton>
            <IconButton variant="ghost" aria-label="Search">
              <Icon icon={Search} />
            </IconButton>
            <IconButton variant="danger" aria-label="Delete">
              <Icon icon={Trash2} />
            </IconButton>
            <IconButton variant="inverse" aria-label="Download">
              <Icon icon={Download} />
            </IconButton>
          </Row>
          <SubHeading>Sizes</SubHeading>
          <Row>
            <IconButton variant="primary" size="sm" aria-label="Small">
              <Icon icon={Heart} />
            </IconButton>
            <IconButton variant="primary" size="md" aria-label="Medium">
              <Icon icon={Heart} />
            </IconButton>
            <IconButton variant="primary" size="lg" aria-label="Large">
              <Icon icon={Heart} />
            </IconButton>
          </Row>
          <SubHeading>Disabled</SubHeading>
          <Row>
            <IconButton disabled variant="primary" aria-label="Add">
              <Icon icon={Plus} />
            </IconButton>
            <IconButton disabled variant="neutral" aria-label="Settings">
              <Icon icon={Settings} />
            </IconButton>
            <IconButton disabled variant="ghost" aria-label="Search">
              <Icon icon={Search} />
            </IconButton>
            <IconButton disabled variant="danger" aria-label="Delete">
              <Icon icon={Trash2} />
            </IconButton>
            <IconButton disabled variant="inverse" aria-label="Download">
              <Icon icon={Download} />
            </IconButton>
          </Row>
          <SubHeading>Pending</SubHeading>
          <Row>
            <IconButton isPending variant="primary" aria-label="Add">
              <Icon icon={Plus} />
            </IconButton>
            <IconButton isPending variant="neutral" aria-label="Settings">
              <Icon icon={Settings} />
            </IconButton>
            <IconButton isPending variant="ghost" aria-label="Search">
              <Icon icon={Search} />
            </IconButton>
            <IconButton isPending variant="danger" aria-label="Delete">
              <Icon icon={Trash2} />
            </IconButton>
            <IconButton isPending variant="inverse" aria-label="Download">
              <Icon icon={Download} />
            </IconButton>
          </Row>
        </Section>

        <Section
          id="input"
          title="Input"
          classes={['tale-input', 'tale-input--sm', 'tale-input--lg']}
        >
          <SubHeading>Sizes</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced display--flex flex--col gap--2xs">
            <Input.Input size="sm" placeholder="Small input" />
            <Input.Input placeholder="Medium input (default)" />
            <Input.Input size="lg" placeholder="Large input" />
          </div>
          <SubHeading>States</SubHeading>
          <div className="audit__demo-narrow display--flex flex--col gap--2xs">
            <Input.Input placeholder="Default" />
            <Input.Input defaultValue="With value" />
            <Input.Input disabled placeholder="Disabled" />
          </div>
          <SubHeading>With Label &amp; Description</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Input.Root>
              <Input.Label>Username</Input.Label>
              <Input.Input placeholder="Enter username…" />
              <Input.Description>Your unique display name.</Input.Description>
            </Input.Root>
          </div>
          <SubHeading>Error State</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Input.Root isInvalid>
              <Input.Label>Email</Input.Label>
              <Input.Input defaultValue="not-an-email" />
              <Input.ErrorMessage>Please enter a valid email address.</Input.ErrorMessage>
            </Input.Root>
          </div>
          <SubHeading>Read Only</SubHeading>
          <div className="audit__demo-narrow">
            <Input.Root isReadOnly>
              <Input.Label>Account ID</Input.Label>
              <Input.Input defaultValue="acct_12345" />
            </Input.Root>
          </div>
        </Section>

        <Section
          id="input-group"
          title="InputGroup"
          classes={[
            'tale-input-group',
            'tale-input-group__addon',
            'tale-input-group__addon--leading',
            'tale-input-group__addon--trailing',
          ]}
        >
          <SubHeading>Leading addon</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <InputGroup.Root>
              <InputGroup.Addon position="leading">https://</InputGroup.Addon>
              <Input.Root>
                <Input.Label>Website URL</Input.Label>
                <Input.Input placeholder="example.com" />
              </Input.Root>
            </InputGroup.Root>
          </div>
          <SubHeading>Trailing addon</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <InputGroup.Root>
              <Input.Root>
                <Input.Label>Duration</Input.Label>
                <Input.Input type="number" placeholder="30" />
              </Input.Root>
              <InputGroup.Addon position="trailing">minutes</InputGroup.Addon>
            </InputGroup.Root>
          </div>
          <SubHeading>Both addons</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <InputGroup.Root>
              <InputGroup.Addon position="leading">$</InputGroup.Addon>
              <Input.Root>
                <Input.Label>Amount</Input.Label>
                <Input.Input type="number" placeholder="0.00" />
              </Input.Root>
              <InputGroup.Addon position="trailing">USD</InputGroup.Addon>
            </InputGroup.Root>
          </div>
        </Section>

        <Section
          id="input-tags"
          title="InputTags"
          classes={[
            'tale-input-tags',
            'tale-input-tags--sm',
            'tale-input-tags--lg',
            'tale-input-tags--below',
            'tale-input-tags__label',
            'tale-input-tags__group',
            'tale-input-tags__tag-list',
            'tale-input-tags__tag',
            'tale-input-tags__input',
            'tale-input-tags__tags',
            'tale-input-tags__description',
            'tale-input-tags__error',
          ]}
        >
          <SubHeading>Inline placement (default)</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <InputTags.Root
              label="Skills"
              placeholder="Add a skill…"
              description="Press Enter to add."
              defaultValue={['React', 'TypeScript']}
            />
          </div>
          <SubHeading>Below placement</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <InputTags.Root
              label="Tags"
              placeholder="Add a tag…"
              tagPlacement="below"
              defaultValue={['design', 'ui']}
            />
          </div>
          <SubHeading>Sizes</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <InputTags.Root size="sm" label="Small" placeholder="Add tag…" />
            <InputTags.Root size="md" label="Medium" placeholder="Add tag…" />
            <InputTags.Root size="lg" label="Large" placeholder="Add tag…" />
          </div>
          <SubHeading>States</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <InputTags.Root
              label="Invalid"
              isInvalid
              isRequired
              errorMessage="At least one skill is required."
            />
            <InputTags.Root label="Disabled" isDisabled defaultValue={['React', 'TypeScript']} />
          </div>
        </Section>

        <Section
          id="multi-select"
          title="MultiSelect"
          classes={[
            'tale-multi-select',
            'tale-multi-select__label',
            'tale-multi-select__trigger',
            'tale-multi-select__trigger--invalid',
            'tale-multi-select__trigger-inner',
            'tale-multi-select__value',
            'tale-multi-select__value--selected',
            'tale-multi-select__value--placeholder',
            'tale-multi-select__icon',
            'tale-multi-select__popup',
            'tale-multi-select__search-wrapper',
            'tale-multi-select__search',
            'tale-multi-select__search-input',
            'tale-multi-select__listbox',
            'tale-multi-select__item',
            'tale-multi-select__item-check',
            'tale-multi-select__item-text',
            'tale-multi-select__footer',
            'tale-multi-select__footer-btn',
            'tale-multi-select__empty',
            'tale-multi-select__description',
            'tale-multi-select__error',
          ]}
        >
          <SubHeading>Default (with search + footer)</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <MultiSelectAuditDemo />
          </div>
          <SubHeading>Sizes</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <MultiSelectAuditDemo size="sm" label="Small" />
            <MultiSelectAuditDemo size="md" label="Medium" />
            <MultiSelectAuditDemo size="lg" label="Large" />
          </div>
          <SubHeading>States</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <MultiSelect.Root
              label="Invalid"
              isInvalid
              isRequired
              errorMessage="Please select at least one option."
              items={[{ id: 'react', name: 'React' }]}
              onSelectionChange={() => {}}
            >
              {(item: { id: string; name: string }) => (
                <MultiSelect.Item id={item.id} textValue={item.name}>
                  {item.name}
                </MultiSelect.Item>
              )}
            </MultiSelect.Root>
            <MultiSelect.Root
              label="Disabled"
              isDisabled
              items={[{ id: 'react', name: 'React' }]}
              defaultSelectedKeys={new Set(['react'])}
              onSelectionChange={() => {}}
            >
              {(item: { id: string; name: string }) => (
                <MultiSelect.Item id={item.id} textValue={item.name}>
                  {item.name}
                </MultiSelect.Item>
              )}
            </MultiSelect.Root>
          </div>
        </Section>

        <Section
          id="tag-select"
          title="TagSelect"
          classes={[
            'tale-tag-select',
            'tale-tag-select__combobox',
            'tale-tag-select__group',
            'tale-tag-select__group--invalid',
            'tale-tag-select__group--sm',
            'tale-tag-select__group--lg',
            'tale-tag-select__input',
            'tale-tag-select__tag',
            'tale-tag-select__tag--sm',
            'tale-tag-select__tag--lg',
            'tale-tag-select__tag-text',
            'tale-tag-select__tag-remove',
            'tale-tag-select__popup',
            'tale-tag-select__listbox',
            'tale-tag-select__item',
            'tale-tag-select__label',
            'tale-tag-select__description',
            'tale-tag-select__error',
          ]}
        >
          <TagSelectAuditSection />
        </Section>

        <Section
          id="checkbox"
          title="Checkbox"
          classes={['tale-checkbox', 'tale-checkbox--sm', 'tale-checkbox__indicator']}
        >
          <SubHeading>Sizes</SubHeading>
          <div className="display--flex flex--col gap--2xs">
            <Checkbox.Root size="sm" defaultSelected>
              <Checkbox.Indicator>
                <Icon icon={Check} size="sm" />
              </Checkbox.Indicator>
              Small
            </Checkbox.Root>
            <Checkbox.Root size="md" defaultSelected>
              <Checkbox.Indicator>
                <Icon icon={Check} size="sm" />
              </Checkbox.Indicator>
              Medium (default)
            </Checkbox.Root>
          </div>
          <SubHeading>States</SubHeading>
          <div className="display--flex flex--col gap--2xs">
            {[
              { label: 'Unchecked', checked: false },
              { label: 'Checked', checked: true },
              { label: 'Disabled', checked: false, disabled: true },
              { label: 'Disabled + Checked', checked: true, disabled: true },
            ].map(({ label, checked, disabled }) => (
              <Checkbox.Root key={label} defaultSelected={checked} isDisabled={disabled}>
                <Checkbox.Indicator>
                  <Icon icon={Check} size="sm" />
                </Checkbox.Indicator>
                {label}
              </Checkbox.Root>
            ))}
            <Checkbox.Root isIndeterminate>
              <Checkbox.Indicator>
                <Icon icon={MinusLucide} size="sm" />
              </Checkbox.Indicator>
              Indeterminate
            </Checkbox.Root>
          </div>
        </Section>

        <Section
          id="checkbox-field"
          title="CheckboxField"
          classes={[
            'tale-checkbox-field',
            'tale-checkbox-field--sm',
            'tale-checkbox-field__button',
            'tale-checkbox-field__indicator',
            'tale-checkbox-field__description',
            'tale-checkbox-field__error',
          ]}
        >
          <SubHeading>With Description</SubHeading>
          <CheckboxField.Root defaultSelected>
            <CheckboxField.Button>
              <CheckboxField.Indicator>
                <Icon icon={Check} size="sm" />
              </CheckboxField.Indicator>
              Email me product updates
            </CheckboxField.Button>
            <CheckboxField.Description>You can unsubscribe at any time.</CheckboxField.Description>
          </CheckboxField.Root>
          <SubHeading>With Error</SubHeading>
          <CheckboxField.Root isRequired isInvalid>
            <CheckboxField.Button>
              <CheckboxField.Indicator>
                <Icon icon={Check} size="sm" />
              </CheckboxField.Indicator>
              Accept terms and conditions
            </CheckboxField.Button>
            <CheckboxField.Error>You must accept the terms to continue.</CheckboxField.Error>
          </CheckboxField.Root>
          <SubHeading>Sizes and States</SubHeading>
          <div className="display--flex flex--col gap--2xs">
            <CheckboxField.Root size="sm" defaultSelected>
              <CheckboxField.Button>
                <CheckboxField.Indicator>
                  <Icon icon={Check} size="sm" />
                </CheckboxField.Indicator>
                Small
              </CheckboxField.Button>
            </CheckboxField.Root>
            <CheckboxField.Root isDisabled>
              <CheckboxField.Button>
                <CheckboxField.Indicator>
                  <Icon icon={Check} size="sm" />
                </CheckboxField.Indicator>
                Disabled
              </CheckboxField.Button>
            </CheckboxField.Root>
          </div>
        </Section>

        <Section id="checkbox-group" title="CheckboxGroup" classes={['tale-checkbox-group']}>
          <SubHeading>Default</SubHeading>
          <CheckboxGroup aria-label="Interests">
            <div className="display--flex flex--col gap--3xs">
              {['Reading', 'Gaming', 'Cooking'].map((label) => (
                <Checkbox.Root key={label} value={label.toLowerCase()}>
                  <Checkbox.Indicator>
                    <Icon icon={Check} size="sm" />
                  </Checkbox.Indicator>
                  {label}
                </Checkbox.Root>
              ))}
            </div>
          </CheckboxGroup>
          <SubHeading>Disabled</SubHeading>
          <CheckboxGroup aria-label="Disabled group" isDisabled>
            <div className="display--flex flex--col gap--3xs">
              {['Option A', 'Option B'].map((label) => (
                <Checkbox.Root key={label} value={label.toLowerCase().replace(' ', '-')} isDisabled>
                  <Checkbox.Indicator>
                    <Icon icon={Check} size="sm" />
                  </Checkbox.Indicator>
                  {label}
                </Checkbox.Root>
              ))}
            </div>
          </CheckboxGroup>
          <SubHeading>With Description</SubHeading>
          <CheckboxGroup aria-label="Notification preferences">
            <Field.Description>Select how you would like to be notified.</Field.Description>
            {['Email', 'SMS', 'Push notification'].map((label) => (
              <Checkbox.Root key={label} value={label.toLowerCase().replace(/\s+/g, '-')}>
                <Checkbox.Indicator>
                  <Icon icon={Check} size="sm" />
                </Checkbox.Indicator>
                {label}
              </Checkbox.Root>
            ))}
          </CheckboxGroup>
          <SubHeading>Horizontal</SubHeading>
          <CheckboxGroup aria-label="Pick toppings" orientation="horizontal">
            {['Cheese', 'Pepperoni', 'Mushrooms'].map((label) => (
              <Checkbox.Root key={label} value={label.toLowerCase()}>
                <Checkbox.Indicator>
                  <Icon icon={Check} size="sm" />
                </Checkbox.Indicator>
                {label}
              </Checkbox.Root>
            ))}
          </CheckboxGroup>
          <SubHeading>Size Propagation</SubHeading>
          <CheckboxGroup aria-label="Small group" size="sm">
            <div className="display--flex flex--col gap--3xs">
              {['Alpha', 'Beta'].map((label) => (
                <Checkbox.Root key={label} value={label.toLowerCase()}>
                  <Checkbox.Indicator>
                    <Icon icon={Check} size="sm" />
                  </Checkbox.Indicator>
                  {label}
                </Checkbox.Root>
              ))}
            </div>
          </CheckboxGroup>
        </Section>

        <Section
          id="radio"
          title="Radio"
          classes={['tale-radio', 'tale-radio__indicator', 'tale-radio__dot', 'tale-radio--sm']}
        >
          <SubHeading>States</SubHeading>
          <div className="audit__demo-spaced display--flex flex--col gap--2xs">
            <Radio.Group aria-label="Radio states">
              <Radio.Root value="unchecked">
                <Radio.Indicator />
                Unchecked
              </Radio.Root>
            </Radio.Group>
            <Radio.Group value="checked" aria-label="Checked demo">
              <Radio.Root value="checked">
                <Radio.Indicator />
                Checked
              </Radio.Root>
            </Radio.Group>
            <Radio.Group aria-label="Disabled demo" isDisabled>
              <Radio.Root value="disabled">
                <Radio.Indicator />
                Disabled
              </Radio.Root>
            </Radio.Group>
          </div>
          <SubHeading>Radio Group</SubHeading>
          <Radio.Group defaultValue="option-a">
            {['Option A', 'Option B', 'Option C'].map((label, i) => {
              const value = `option-${String.fromCharCode(97 + i)}`;
              return (
                <Radio.Root key={value} value={value}>
                  <Radio.Indicator />
                  {label}
                </Radio.Root>
              );
            })}
          </Radio.Group>
          <SubHeading>Horizontal</SubHeading>
          <Radio.Group aria-label="Pick a plan" orientation="horizontal">
            {['Free', 'Pro', 'Enterprise'].map((label) => (
              <Radio.Root key={label} value={label.toLowerCase()}>
                <Radio.Indicator />
                {label}
              </Radio.Root>
            ))}
          </Radio.Group>
        </Section>

        <Section
          id="radio-field"
          title="RadioField"
          classes={[
            'tale-radio-field',
            'tale-radio-field--sm',
            'tale-radio-field__button',
            'tale-radio-field__indicator',
            'tale-radio-field__dot',
            'tale-radio-field__description',
            'tale-radio-field__error',
          ]}
        >
          <SubHeading>With Descriptions</SubHeading>
          <RadioGroup aria-label="Subscription plan" defaultValue="pro">
            <div className="display--flex flex--col gap--2xs">
              <RadioField.Root value="free">
                <RadioField.Button>
                  <RadioField.Indicator>
                    <RadioField.Dot />
                  </RadioField.Indicator>
                  Free
                </RadioField.Button>
              </RadioField.Root>
              <RadioField.Root value="pro">
                <RadioField.Button>
                  <RadioField.Indicator>
                    <RadioField.Dot />
                  </RadioField.Indicator>
                  Pro
                </RadioField.Button>
                <RadioField.Description>
                  Unlimited projects and priority support.
                </RadioField.Description>
              </RadioField.Root>
              <RadioField.Root value="enterprise" isDisabled>
                <RadioField.Button>
                  <RadioField.Indicator>
                    <RadioField.Dot />
                  </RadioField.Indicator>
                  Enterprise
                </RadioField.Button>
              </RadioField.Root>
            </div>
          </RadioGroup>
        </Section>

        <Section id="switch" title="Switch" classes={['tale-switch', 'tale-switch__thumb']}>
          <SubHeading>States</SubHeading>
          <div className="display--flex flex--col gap--xs">
            {[
              { label: 'Off', checked: false },
              { label: 'On', checked: true },
              { label: 'Disabled (Off)', checked: false, disabled: true },
              { label: 'Disabled (On)', checked: true, disabled: true },
            ].map(({ label, checked, disabled }) => (
              <Switch.Root key={label} defaultSelected={checked} isDisabled={disabled}>
                <Switch.Thumb />
                {label}
              </Switch.Root>
            ))}
          </div>
        </Section>

        <Section
          id="switch-field"
          title="SwitchField"
          classes={[
            'tale-switch-field',
            'tale-switch-field__button',
            'tale-switch-field__thumb',
            'tale-switch-field__description',
            'tale-switch-field__error',
          ]}
        >
          <SubHeading>With Description</SubHeading>
          <SwitchField.Root defaultSelected>
            <SwitchField.Button>
              <SwitchField.Thumb />
              Enable notifications
            </SwitchField.Button>
            <SwitchField.Description>We send at most one email per day.</SwitchField.Description>
          </SwitchField.Root>
          <SubHeading>With Error</SubHeading>
          <SwitchField.Root isRequired isInvalid>
            <SwitchField.Button>
              <SwitchField.Thumb />
              Accept data processing
            </SwitchField.Button>
            <SwitchField.Error>This setting is required.</SwitchField.Error>
          </SwitchField.Root>
          <SubHeading>States</SubHeading>
          <div className="display--flex flex--col gap--xs">
            <SwitchField.Root>
              <SwitchField.Button>
                <SwitchField.Thumb />
                Off
              </SwitchField.Button>
            </SwitchField.Root>
            <SwitchField.Root defaultSelected isDisabled>
              <SwitchField.Button>
                <SwitchField.Thumb />
                Disabled (On)
              </SwitchField.Button>
            </SwitchField.Root>
          </div>
        </Section>

        <Section
          id="toggle-button"
          title="ToggleButton"
          classes={[
            'tale-toggle-button',
            'tale-toggle-button--sm',
            'tale-toggle-button--md',
            'tale-toggle-button--lg',
          ]}
        >
          <SubHeading>Sizes</SubHeading>
          <Row>
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <ToggleButton key={size} size={size}>
                {size.toUpperCase()}
              </ToggleButton>
            ))}
          </Row>
          <SubHeading>States</SubHeading>
          <Row>
            <ToggleButton size="md">Unpressed</ToggleButton>
            <ToggleButton size="md" defaultSelected>
              Pressed
            </ToggleButton>
            <ToggleButton size="md" isDisabled>
              Disabled
            </ToggleButton>
          </Row>
        </Section>

        <Section
          id="toggle-button-group"
          title="ToggleButtonGroup"
          classes={['tale-toggle-button-group']}
        >
          <SubHeading>Default</SubHeading>
          <Row>
            <ToggleButtonGroup aria-label="Text alignment">
              <ToggleButton size="md">Left</ToggleButton>
              <ToggleButton size="md" defaultSelected>
                Center
              </ToggleButton>
              <ToggleButton size="md">Right</ToggleButton>
            </ToggleButtonGroup>
          </Row>
        </Section>

        <Section
          id="select"
          title="Select"
          classes={[
            'tale-select__trigger',
            'tale-select__trigger--sm',
            'tale-select__trigger--lg',
            'tale-select__value',
            'tale-select__icon',
            'tale-select__popover',
            'tale-select__listbox',
            'tale-select__item',
            'tale-select__header',
            'tale-select__separator',
          ]}
        >
          <SubHeading>Sizes</SubHeading>
          <Row>
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <Select.Root key={size} size={size} placeholder={`Size: ${size}`}>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Icon />
                </Select.Trigger>
                <Select.Popover offset={4}>
                  <Select.ListBox>
                    {fruits.map((fruit) => (
                      <Select.Item
                        key={fruit}
                        id={`${size}-${fruit.toLowerCase()}`}
                        textValue={fruit}
                      >
                        {fruit}
                      </Select.Item>
                    ))}
                  </Select.ListBox>
                </Select.Popover>
              </Select.Root>
            ))}
          </Row>
          <SubHeading>Default</SubHeading>
          <Row>
            <Select.Root placeholder="Select a fruit…">
              <Select.Trigger>
                <Select.Value />
                <Select.Icon />
              </Select.Trigger>
              <Select.Popover offset={4}>
                <Select.ListBox>
                  {fruits.map((fruit) => (
                    <Select.Item key={fruit} id={fruit.toLowerCase()} textValue={fruit}>
                      {fruit}
                    </Select.Item>
                  ))}
                </Select.ListBox>
              </Select.Popover>
            </Select.Root>
          </Row>
          <SubHeading>Long Selected Value</SubHeading>
          <Row>
            <div style={{ width: '13.75rem' }}>
              <Select.Root defaultSelectedKey="enterprise-plan" placeholder="Select a plan…">
                <Select.Label>Plan</Select.Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Icon />
                </Select.Trigger>
                <Select.Popover offset={4}>
                  <Select.ListBox>
                    <Select.Item id="basic-plan" textValue="Basic">
                      Basic
                    </Select.Item>
                    <Select.Item
                      id="enterprise-plan"
                      textValue="Enterprise compliance plan with dedicated support"
                    >
                      Enterprise compliance plan with dedicated support
                    </Select.Item>
                  </Select.ListBox>
                </Select.Popover>
              </Select.Root>
            </div>
          </Row>
          <SubHeading>Disabled</SubHeading>
          <Row>
            <Select.Root isDisabled placeholder="Disabled select">
              <Select.Trigger>
                <Select.Value />
                <Select.Icon />
              </Select.Trigger>
            </Select.Root>
          </Row>
          <SubHeading>With Label</SubHeading>
          <Row>
            <Select.Root placeholder="Select a fruit…">
              <Select.Label>Fruit</Select.Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Icon />
              </Select.Trigger>
              <Select.Popover offset={4}>
                <Select.ListBox>
                  {fruits.map((fruit) => (
                    <Select.Item key={fruit} id={fruit.toLowerCase()} textValue={fruit}>
                      {fruit}
                    </Select.Item>
                  ))}
                </Select.ListBox>
              </Select.Popover>
            </Select.Root>
          </Row>
          <SubHeading>With Groups</SubHeading>
          <Row>
            <Select.Root placeholder="Select a country…">
              <Select.Trigger>
                <Select.Value />
                <Select.Icon />
              </Select.Trigger>
              <Select.Popover offset={4}>
                <Select.ListBox>
                  <Select.Section>
                    <Select.Header>Europe</Select.Header>
                    {['France', 'Germany', 'Spain'].map((c) => (
                      <Select.Item key={c} id={c.toLowerCase()} textValue={c}>
                        {c}
                      </Select.Item>
                    ))}
                  </Select.Section>
                  <Select.Separator />
                  <Select.Section>
                    <Select.Header>Americas</Select.Header>
                    {['Brazil', 'Canada', 'Mexico'].map((c) => (
                      <Select.Item key={c} id={c.toLowerCase()} textValue={c}>
                        {c}
                      </Select.Item>
                    ))}
                  </Select.Section>
                </Select.ListBox>
              </Select.Popover>
            </Select.Root>
          </Row>
          <SubHeading>With Disabled Items</SubHeading>
          <Row>
            <Select.Root placeholder="Select a fruit…">
              <Select.Trigger>
                <Select.Value />
                <Select.Icon />
              </Select.Trigger>
              <Select.Popover offset={4}>
                <Select.ListBox>
                  <Select.Item id="apple-d" textValue="Apple">
                    Apple
                  </Select.Item>
                  <Select.Item id="banana-d" textValue="Banana" isDisabled>
                    Banana
                  </Select.Item>
                  <Select.Item id="cherry-d" textValue="Cherry">
                    Cherry
                  </Select.Item>
                  <Select.Item id="date-d" textValue="Date" isDisabled>
                    Date
                  </Select.Item>
                  <Select.Item id="elderberry-d" textValue="Elderberry">
                    Elderberry
                  </Select.Item>
                </Select.ListBox>
              </Select.Popover>
            </Select.Root>
          </Row>
        </Section>

        <Section
          id="autocomplete"
          title="Autocomplete"
          classes={[
            'tale-combobox__input',
            'tale-combobox__popup',
            'tale-combobox__item',
            'tale-combobox__empty',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <AutocompleteDemo />
        </Section>

        <Section
          id="combobox"
          title="Combobox"
          classes={[
            'tale-combobox__input',
            'tale-combobox__input-group',
            'tale-combobox__trigger',
            'tale-combobox__popup',
            'tale-combobox__item',
            'tale-combobox__empty',
            'tale-combobox__section',
            'tale-combobox__header',
            'tale-combobox__chips',
            'tale-combobox__chip',
            'tale-combobox__chip-remove',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <ComboboxDemo />
          <SubHeading>With Label</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Combobox.Root>
              <Combobox.Label>Country</Combobox.Label>
              <Combobox.InputGroup>
                <Combobox.Input placeholder="Search country…" />
                <Combobox.Trigger />
              </Combobox.InputGroup>
              <Combobox.Popover offset={4}>
                <Combobox.ListBox>
                  {countries.slice(0, 8).map((c) => (
                    <Combobox.Item key={c} id={c} textValue={c}>
                      {c}
                    </Combobox.Item>
                  ))}
                </Combobox.ListBox>
              </Combobox.Popover>
            </Combobox.Root>
          </div>
          <SubHeading>With Sections</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Combobox.Root>
              <Combobox.Label>Food</Combobox.Label>
              <Combobox.InputGroup>
                <Combobox.Input placeholder="Search food…" />
                <Combobox.Trigger />
              </Combobox.InputGroup>
              <Combobox.Popover offset={4}>
                <Combobox.ListBox>
                  <Combobox.Section>
                    <Combobox.Header>Fruits</Combobox.Header>
                    <Combobox.Item id="apple" textValue="Apple">
                      Apple
                    </Combobox.Item>
                    <Combobox.Item id="banana" textValue="Banana">
                      Banana
                    </Combobox.Item>
                    <Combobox.Item id="cherry" textValue="Cherry">
                      Cherry
                    </Combobox.Item>
                  </Combobox.Section>
                  <Combobox.Section>
                    <Combobox.Header>Vegetables</Combobox.Header>
                    <Combobox.Item id="carrot" textValue="Carrot">
                      Carrot
                    </Combobox.Item>
                    <Combobox.Item id="broccoli" textValue="Broccoli">
                      Broccoli
                    </Combobox.Item>
                    <Combobox.Item id="spinach" textValue="Spinach">
                      Spinach
                    </Combobox.Item>
                  </Combobox.Section>
                </Combobox.ListBox>
              </Combobox.Popover>
            </Combobox.Root>
          </div>
          <SubHeading>Empty</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Combobox.Root>
              <Combobox.Label>Search (try typing something not in list)</Combobox.Label>
              <Combobox.InputGroup>
                <Combobox.Input placeholder="Type to filter…" />
                <Combobox.Trigger />
              </Combobox.InputGroup>
              <Combobox.Popover offset={4}>
                <Combobox.ListBox>
                  <Combobox.Empty>No results found.</Combobox.Empty>
                  <Combobox.Item id="apple-e" textValue="Apple">
                    Apple
                  </Combobox.Item>
                  <Combobox.Item id="banana-e" textValue="Banana">
                    Banana
                  </Combobox.Item>
                  <Combobox.Item id="cherry-e" textValue="Cherry">
                    Cherry
                  </Combobox.Item>
                </Combobox.ListBox>
              </Combobox.Popover>
            </Combobox.Root>
          </div>
          <SubHeading>Multi-select Chips</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Combobox.Root>
              <Combobox.Label>Frameworks</Combobox.Label>
              <Combobox.Chips>
                <Combobox.Chip>
                  React <Combobox.ChipRemove aria-label="Remove React" />
                </Combobox.Chip>
                <Combobox.Chip>
                  Vue <Combobox.ChipRemove aria-label="Remove Vue" />
                </Combobox.Chip>
                <Combobox.Chip>
                  Angular <Combobox.ChipRemove aria-label="Remove Angular" />
                </Combobox.Chip>
              </Combobox.Chips>
              <Combobox.InputGroup>
                <Combobox.Input placeholder="Add framework…" />
                <Combobox.Trigger />
              </Combobox.InputGroup>
              <Combobox.Popover offset={4}>
                <Combobox.ListBox>
                  <Combobox.Item id="react-ms" textValue="React">
                    React
                  </Combobox.Item>
                  <Combobox.Item id="vue-ms" textValue="Vue">
                    Vue
                  </Combobox.Item>
                  <Combobox.Item id="angular-ms" textValue="Angular">
                    Angular
                  </Combobox.Item>
                  <Combobox.Item id="svelte-ms" textValue="Svelte">
                    Svelte
                  </Combobox.Item>
                </Combobox.ListBox>
              </Combobox.Popover>
            </Combobox.Root>
          </div>
        </Section>

        <Section
          id="number-field"
          title="NumberField"
          classes={[
            'tale-number-field',
            'tale-number-field__group',
            'tale-number-field__input',
            'tale-number-field__decrement',
            'tale-number-field__increment',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <Row>
            <NumberField.Root defaultValue={0} minValue={0} maxValue={100}>
              <NumberField.Group>
                <NumberField.Decrement />
                <NumberField.Input />
                <NumberField.Increment />
              </NumberField.Group>
            </NumberField.Root>
          </Row>
          <SubHeading>With Label</SubHeading>
          <Row>
            <NumberField.Root defaultValue={1}>
              <NumberField.Label>Quantity</NumberField.Label>
              <NumberField.Group>
                <NumberField.Decrement />
                <NumberField.Input />
                <NumberField.Increment />
              </NumberField.Group>
            </NumberField.Root>
          </Row>
          <SubHeading>Custom Control Width</SubHeading>
          <Row>
            <NumberField.Root defaultValue={920} style={numberFieldCustomControlStyle}>
              <NumberField.Label>Default panel width (px)</NumberField.Label>
              <NumberField.Group>
                <NumberField.Decrement />
                <NumberField.Input />
                <NumberField.Increment />
              </NumberField.Group>
              <NumberField.Description>
                Width applied to newly opened panels.
              </NumberField.Description>
            </NumberField.Root>
          </Row>
          <SubHeading>Disabled</SubHeading>
          <Row>
            <NumberField.Root isDisabled defaultValue={42}>
              <NumberField.Group>
                <NumberField.Decrement />
                <NumberField.Input />
                <NumberField.Increment />
              </NumberField.Group>
            </NumberField.Root>
          </Row>
          <SubHeading>Currency Format</SubHeading>
          <Row>
            <NumberField.Root
              defaultValue={99.99}
              formatOptions={{ style: 'currency', currency: 'USD' }}
            >
              <NumberField.Label>Price</NumberField.Label>
              <NumberField.Group>
                <NumberField.Decrement />
                <NumberField.Input />
                <NumberField.Increment />
              </NumberField.Group>
            </NumberField.Root>
          </Row>
        </Section>

        <Section
          id="slider"
          title="Slider"
          classes={[
            'tale-slider',
            'tale-slider__header',
            'tale-slider__label',
            'tale-slider__output',
            'tale-slider__output--top',
            'tale-slider__output--bottom',
            'tale-slider__control',
            'tale-slider__track',
            'tale-slider__indicator',
            'tale-slider__thumb',
          ]}
        >
          <SubHeading>With Header &amp; Output</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Slider.Root defaultValue={50}>
              <Slider.Header>
                <Slider.Label>Volume</Slider.Label>
                <Slider.Output />
              </Slider.Header>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                  <Slider.Thumb />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
          <SubHeading>Default</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Slider.Root defaultValue={40}>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                  <Slider.Thumb />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
          <SubHeading>Range (two thumbs)</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Slider.Root defaultValue={[20, 80]}>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                  <Slider.Thumb index={0} />
                  <Slider.Thumb index={1} />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
          <SubHeading>Steps</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Slider.Root defaultValue={50} step={10}>
              <Slider.Header>
                <Slider.Label>Brightness</Slider.Label>
                <Slider.Output />
              </Slider.Header>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                  <Slider.Thumb />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
          <SubHeading>Vertical</SubHeading>
          <div className="audit__slider-vertical audit__demo-spaced">
            <Slider.Root defaultValue={60} orientation="vertical">
              <Slider.Header>
                <Slider.Label>Level</Slider.Label>
                <Slider.Output />
              </Slider.Header>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                  <Slider.Thumb />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
          <SubHeading>Disabled</SubHeading>
          <div className="audit__demo-narrow">
            <Slider.Root isDisabled defaultValue={60}>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                  <Slider.Thumb />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
          <SubHeading>Thumb Label — Bottom</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Slider.Root defaultValue={50}>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                  <Slider.Thumb>
                    <Slider.Output position="bottom" />
                  </Slider.Thumb>
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
          <SubHeading>Thumb Label — Floating Top</SubHeading>
          <div className="audit__demo-narrow audit__demo-spaced">
            <Slider.Root defaultValue={50}>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                  <Slider.Thumb>
                    <Slider.Output position="top" />
                  </Slider.Thumb>
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
        </Section>

        <CalendarSection />

        {/* ============================================================= */}
        {/* OVERLAY */}
        {/* ============================================================= */}

        <Section
          id="dialog"
          title="Dialog"
          classes={[
            'tale-dialog__backdrop',
            'tale-dialog__popup',
            'tale-dialog__title',
            'tale-dialog__description',
            'tale-dialog__close',
            'tale-dialog__actions',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <Row>
            <DialogDemo />
          </Row>
          <SubHeading>Destructive</SubHeading>
          <Row>
            <DestructiveDialogDemo />
          </Row>
          <SubHeading>Dismissable</SubHeading>
          <Row>
            <DismissableDialogDemo />
          </Row>
          <SubHeading>Scrollable Content</SubHeading>
          <Row>
            <ScrollableDialogDemo />
          </Row>
        </Section>

        <Section
          id="alert-dialog"
          title="AlertDialog"
          classes={[
            'tale-alert-dialog__backdrop',
            'tale-alert-dialog__popup',
            'tale-alert-dialog__title',
            'tale-alert-dialog__description',
            'tale-alert-dialog__actions',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <Row>
            <AlertDialogDemo />
          </Row>
        </Section>

        <Section
          id="popover"
          title="Popover"
          classes={[
            'tale-popover__popup',
            'tale-popover__title',
            'tale-popover__description',
            'tale-popover__close',
            'tale-popover__arrow',
          ]}
        >
          <SubHeading>All sides</SubHeading>
          <Row className="audit__demo-row--padded">
            {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
              <Popover.Root key={side}>
                <Popover.Trigger className="tale-button tale-button--neutral tale-button--md">
                  {side}
                </Popover.Trigger>
                <Popover.Popup placement={side} offset={8}>
                  <Popover.Close aria-label="Close" />
                  <Popover.Title>Popover ({side})</Popover.Title>
                  <Popover.Description>Appears on the {side}.</Popover.Description>
                </Popover.Popup>
              </Popover.Root>
            ))}
          </Row>
          <SubHeading>With Arrow</SubHeading>
          <Row className="audit__demo-row--padded">
            <Popover.Root>
              <Popover.Trigger className="tale-button tale-button--neutral tale-button--md">
                With Arrow
              </Popover.Trigger>
              <Popover.Popup placement="bottom" offset={8}>
                <Popover.Arrow />
                <Popover.Title>Arrow Popover</Popover.Title>
                <Popover.Description>
                  This popover includes an arrow pointing to the trigger.
                </Popover.Description>
              </Popover.Popup>
            </Popover.Root>
          </Row>
        </Section>

        <Section
          id="preview-card"
          title="PreviewCard"
          classes={[
            'tale-preview-card',
            'tale-preview-card__trigger',
            'tale-preview-card__popup',
            'tale-preview-card__arrow',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <Row>
            <PreviewCard.Root>
              <PreviewCard.Trigger>Hover to preview</PreviewCard.Trigger>
              <PreviewCard.Popup>
                <PreviewCard.Content aria-label="Preview">
                  <div className="audit__preview-content">
                    <strong className="audit__preview-title">Preview Card</strong>
                    <p className="audit__preview-description">
                      A card that appears on hover to show a preview of linked content.
                    </p>
                  </div>
                </PreviewCard.Content>
              </PreviewCard.Popup>
            </PreviewCard.Root>
          </Row>
          <SubHeading>With Arrow</SubHeading>
          <Row>
            <PreviewCard.Root>
              <PreviewCard.Trigger>Hover to preview</PreviewCard.Trigger>
              <PreviewCard.Popup>
                <PreviewCard.Arrow />
                <PreviewCard.Content aria-label="Preview">
                  <div className="audit__preview-content">
                    <strong className="audit__preview-title">Arrow Preview</strong>
                    <p className="audit__preview-description">
                      This preview card includes an arrow pointing to the trigger.
                    </p>
                  </div>
                </PreviewCard.Content>
              </PreviewCard.Popup>
            </PreviewCard.Root>
          </Row>
        </Section>

        <Section
          id="drawer"
          title="Drawer"
          classes={[
            'tale-drawer',
            'tale-drawer__trigger',
            'tale-drawer__popup',
            'tale-drawer__backdrop',
            'tale-drawer__title',
            'tale-drawer__description',
            'tale-drawer__close',
            'tale-drawer__handle',
            'tale-drawer__swipe-area',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <Row>
            <Drawer.Root>
              <Drawer.Trigger className="tale-button tale-button--neutral">
                Open Drawer
              </Drawer.Trigger>
              <Drawer.Popup>
                <p>Drawer content goes here.</p>
                <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
              </Drawer.Popup>
            </Drawer.Root>
          </Row>
          <SubHeading>With Title</SubHeading>
          <Row>
            <Drawer.Root>
              <Drawer.Trigger className="tale-button tale-button--neutral">
                Open Drawer
              </Drawer.Trigger>
              <Drawer.Popup>
                <Drawer.Title>Drawer Title</Drawer.Title>
                <Drawer.Description>
                  This is a description of the drawer content.
                </Drawer.Description>
                <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
              </Drawer.Popup>
            </Drawer.Root>
          </Row>
          <SubHeading>With Backdrop</SubHeading>
          <Row>
            <Drawer.Root>
              <Drawer.Trigger className="tale-button tale-button--neutral">
                Open Drawer
              </Drawer.Trigger>
              <Drawer.Backdrop />
              <Drawer.Popup>
                <Drawer.Title>Drawer with Backdrop</Drawer.Title>
                <Drawer.Description>Click the backdrop to close.</Drawer.Description>
                <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
              </Drawer.Popup>
            </Drawer.Root>
          </Row>
          <SubHeading>With Handle</SubHeading>
          <Row>
            <Drawer.Root>
              <Drawer.Trigger className="tale-button tale-button--neutral">
                Open Drawer
              </Drawer.Trigger>
              <Drawer.Backdrop />
              <Drawer.Popup>
                <Drawer.Handle />
                <Drawer.Title>Drawer with Handle</Drawer.Title>
                <Drawer.Description>
                  The handle bar indicates this drawer is draggable.
                </Drawer.Description>
                <Drawer.Close className="tale-button tale-button--neutral">Close</Drawer.Close>
              </Drawer.Popup>
            </Drawer.Root>
          </Row>
          <SubHeading>With Actions</SubHeading>
          <Row>
            <Drawer.Root>
              <Drawer.Trigger className="tale-button tale-button--neutral">
                Open Drawer
              </Drawer.Trigger>
              <Drawer.Backdrop />
              <Drawer.Popup>
                <Drawer.Handle />
                <Drawer.Title>Confirm Action</Drawer.Title>
                <Drawer.Description>Are you sure you want to proceed?</Drawer.Description>
                <div className="audit__drawer-actions">
                  <Drawer.Close className="tale-button tale-button--neutral audit__drawer-action">
                    Cancel
                  </Drawer.Close>
                  <Drawer.Close className="tale-button tale-button--primary audit__drawer-action">
                    Confirm
                  </Drawer.Close>
                </div>
              </Drawer.Popup>
            </Drawer.Root>
          </Row>
        </Section>

        <Section
          id="tooltip"
          title="Tooltip"
          classes={[
            'tale-tooltip__popup',
            'tale-tooltip__arrow',
            'tale-tooltip__title',
            'tale-tooltip__description',
          ]}
        >
          <SubHeading>Without arrow</SubHeading>
          <Row className="audit__demo-row--padded">
            {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
              <Tooltip.Root key={side} delay={300} closeDelay={150}>
                <Tooltip.Trigger className="tale-button tale-button--neutral tale-button--md">
                  Hover ({side})
                </Tooltip.Trigger>
                <Tooltip.Popup placement={side} offset={8}>
                  Appears on the {side}
                </Tooltip.Popup>
              </Tooltip.Root>
            ))}
          </Row>
          <SubHeading>With arrow</SubHeading>
          <Row className="audit__demo-row--padded">
            {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
              <Tooltip.Root key={side} delay={300} closeDelay={150}>
                <Tooltip.Trigger className="tale-button tale-button--neutral tale-button--md">
                  Arrow ({side})
                </Tooltip.Trigger>
                <Tooltip.Popup placement={side} offset={4}>
                  <Tooltip.Arrow />
                  Appears on the {side}
                </Tooltip.Popup>
              </Tooltip.Root>
            ))}
          </Row>
          <SubHeading>Long Text</SubHeading>
          <Row className="audit__demo-row--padded">
            <Tooltip.Root>
              <Tooltip.Trigger className="tale-button tale-button--neutral tale-button--md">
                Long tooltip
              </Tooltip.Trigger>
              <Tooltip.Popup placement="top" offset={8}>
                <Tooltip.Arrow />
                This is a tooltip with a longer description that wraps across multiple lines to
                demonstrate how the tooltip handles extended content gracefully.
              </Tooltip.Popup>
            </Tooltip.Root>
          </Row>
          <SubHeading>With Supporting Text</SubHeading>
          <Row className="audit__demo-row--padded">
            {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
              <Tooltip.Root key={side} delay={300} closeDelay={150}>
                <Tooltip.Trigger className="tale-button tale-button--neutral tale-button--md">
                  Info ({side})
                </Tooltip.Trigger>
                <Tooltip.Popup placement={side} offset={8}>
                  <Tooltip.Arrow />
                  <Tooltip.Title>Feature Name</Tooltip.Title>
                  <Tooltip.Description>Supporting text on {side}</Tooltip.Description>
                </Tooltip.Popup>
              </Tooltip.Root>
            ))}
          </Row>
          <SubHeading>With Delay</SubHeading>
          <Row className="audit__demo-row--padded">
            <Tooltip.Root delay={500}>
              <Tooltip.Trigger className="tale-button tale-button--neutral tale-button--md">
                500ms delay
              </Tooltip.Trigger>
              <Tooltip.Popup placement="top" offset={8}>
                <Tooltip.Arrow />
                Appeared after 500ms
              </Tooltip.Popup>
            </Tooltip.Root>
            <Tooltip.Root delay={0}>
              <Tooltip.Trigger className="tale-button tale-button--neutral tale-button--md">
                No delay
              </Tooltip.Trigger>
              <Tooltip.Popup placement="top" offset={8}>
                <Tooltip.Arrow />
                Instant tooltip
              </Tooltip.Popup>
            </Tooltip.Root>
          </Row>
        </Section>

        {/* ============================================================= */}
        {/* NAVIGATION */}
        {/* ============================================================= */}

        <Section
          id="menu"
          title="Menu"
          classes={[
            'tale-menu__popup',
            'tale-menu__item',
            'tale-menu__separator',
            'tale-menu__group-label',
            'tale-menu__trigger',
            'tale-menu__popover',
            'tale-menu__arrow',
            'tale-menu__checkbox-item',
            'tale-menu__radio-item',
            'tale-menu__link-item',
            'tale-menu__submenu-trigger',
          ]}
        >
          <SubHeading>Basic</SubHeading>
          <Row>
            <Menu.Root>
              <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
                Options <Icon icon={ChevronDown} size="sm" />
              </Menu.Trigger>
              <Menu.Popover offset={4}>
                <Menu.MenuList aria-label="Options">
                  <Menu.Item id="edit" textValue="Edit">
                    Edit
                  </Menu.Item>
                  <Menu.Item id="duplicate" textValue="Duplicate">
                    Duplicate
                  </Menu.Item>
                  <Menu.Separator />
                  <Menu.Item id="share" textValue="Share">
                    Share
                  </Menu.Item>
                  <Menu.Separator />
                  <Menu.Item id="delete" textValue="Delete">
                    Delete
                  </Menu.Item>
                </Menu.MenuList>
              </Menu.Popover>
            </Menu.Root>
          </Row>
          <SubHeading>With Group Labels</SubHeading>
          <Row>
            <Menu.Root>
              <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
                Account <Icon icon={ChevronDown} size="sm" />
              </Menu.Trigger>
              <Menu.Popover offset={4}>
                <Menu.MenuList aria-label="Account">
                  <Menu.Group>
                    <Menu.Header>Account</Menu.Header>
                    <Menu.Item id="profile" textValue="Profile">
                      Profile
                    </Menu.Item>
                    <Menu.Item id="settings" textValue="Settings">
                      Settings
                    </Menu.Item>
                  </Menu.Group>
                  <Menu.Separator />
                  <Menu.Group>
                    <Menu.Header>Danger Zone</Menu.Header>
                    <Menu.Item id="sign-out" textValue="Sign out">
                      Sign out
                    </Menu.Item>
                  </Menu.Group>
                </Menu.MenuList>
              </Menu.Popover>
            </Menu.Root>
          </Row>
          <SubHeading>Checkbox Items</SubHeading>
          <Row>
            <MenuCheckboxDemo />
          </Row>
          <SubHeading>Radio Items</SubHeading>
          <Row>
            <MenuRadioDemo />
          </Row>
          <SubHeading>Link Items</SubHeading>
          <Row>
            <MenuLinkDemo />
          </Row>
          <SubHeading>With Disabled Items</SubHeading>
          <Row>
            <Menu.Root>
              <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
                Actions <Icon icon={ChevronDown} size="sm" />
              </Menu.Trigger>
              <Menu.Popover offset={4}>
                <Menu.MenuList aria-label="Actions">
                  <Menu.Item id="edit" textValue="Edit">
                    Edit
                  </Menu.Item>
                  <Menu.Item id="duplicate" textValue="Duplicate" isDisabled>
                    Duplicate
                  </Menu.Item>
                  <Menu.Separator />
                  <Menu.Item id="archive" textValue="Archive">
                    Archive
                  </Menu.Item>
                  <Menu.Item id="delete" textValue="Delete" isDisabled>
                    Delete
                  </Menu.Item>
                </Menu.MenuList>
              </Menu.Popover>
            </Menu.Root>
          </Row>
        </Section>

        <Section
          id="context-menu"
          title="ContextMenu"
          classes={[
            'tale-context-menu',
            'tale-context-menu__trigger',
            'tale-context-menu__list',
            'tale-context-menu__item',
            'tale-context-menu__separator',
            'tale-context-menu__group',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <Row>
            <ContextMenu.Root>
              <ContextMenu.Trigger>
                <div className="audit__context-trigger">Right-click this area</div>
              </ContextMenu.Trigger>
              <ContextMenu.Popup aria-label="Context menu">
                <ContextMenu.MenuList aria-label="Context menu">
                  <ContextMenu.Item textValue="Cut">Cut</ContextMenu.Item>
                  <ContextMenu.Item textValue="Copy">Copy</ContextMenu.Item>
                  <ContextMenu.Item textValue="Paste">Paste</ContextMenu.Item>
                  <ContextMenu.Separator />
                  <ContextMenu.Item textValue="Delete">Delete</ContextMenu.Item>
                </ContextMenu.MenuList>
              </ContextMenu.Popup>
            </ContextMenu.Root>
          </Row>
          <SubHeading>With Groups</SubHeading>
          <Row>
            <ContextMenu.Root>
              <ContextMenu.Trigger>
                <div className="audit__context-trigger">Right-click for grouped menu</div>
              </ContextMenu.Trigger>
              <ContextMenu.Popup aria-label="Grouped context menu">
                <ContextMenu.MenuList aria-label="Grouped context menu">
                  <ContextMenu.Group>
                    <ContextMenu.Item textValue="Cut">Cut</ContextMenu.Item>
                    <ContextMenu.Item textValue="Copy">Copy</ContextMenu.Item>
                    <ContextMenu.Item textValue="Paste">Paste</ContextMenu.Item>
                  </ContextMenu.Group>
                  <ContextMenu.Separator />
                  <ContextMenu.Group>
                    <ContextMenu.Item textValue="Find">Find</ContextMenu.Item>
                    <ContextMenu.Item textValue="Replace">Replace</ContextMenu.Item>
                  </ContextMenu.Group>
                  <ContextMenu.Separator />
                  <ContextMenu.Group>
                    <ContextMenu.Item textValue="Inspect">Inspect</ContextMenu.Item>
                  </ContextMenu.Group>
                </ContextMenu.MenuList>
              </ContextMenu.Popup>
            </ContextMenu.Root>
          </Row>
        </Section>

        <Section
          id="command-palette"
          title="CommandPalette"
          classes={[
            'tale-command-palette',
            'tale-command-palette__trigger',
            'tale-command-palette__backdrop',
            'tale-command-palette__popup',
            'tale-command-palette__dialog',
            'tale-command-palette__title',
            'tale-command-palette__content',
            'tale-command-palette__search-field',
            'tale-command-palette__input',
            'tale-command-palette__listbox',
            'tale-command-palette__section-header',
            'tale-command-palette__item',
            'tale-command-palette__shortcut',
            'tale-command-palette__footer',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <Row>
            <CommandPalette.Root>
              <CommandPalette.Trigger>Open command palette</CommandPalette.Trigger>
              <CommandPalette.Backdrop>
                <CommandPalette.Popup>
                  <CommandPalette.Title>Command Palette</CommandPalette.Title>
                  <CommandPalette.Close aria-label="Close command palette" />
                  <CommandPalette.Content>
                    <CommandPalette.SearchField>
                      <CommandPalette.Input placeholder="Search commands..." />
                      <CommandPalette.ClearButton aria-label="Clear search" />
                    </CommandPalette.SearchField>
                    <CommandPalette.ListBox aria-label="Commands">
                      <CommandPalette.Section>
                        <CommandPalette.SectionHeader>Navigation</CommandPalette.SectionHeader>
                        <CommandPalette.Item id="dashboard" textValue="Dashboard">
                          <CommandPalette.ItemContent>
                            <CommandPalette.ItemTitle>Dashboard</CommandPalette.ItemTitle>
                            <CommandPalette.ItemDescription>
                              Open the workspace overview.
                            </CommandPalette.ItemDescription>
                          </CommandPalette.ItemContent>
                          <CommandPalette.ItemMeta>
                            <CommandPalette.Shortcut keys={['Mod', '1']} />
                          </CommandPalette.ItemMeta>
                        </CommandPalette.Item>
                        <CommandPalette.Item id="settings" textValue="Settings">
                          <CommandPalette.ItemContent>
                            <CommandPalette.ItemTitle>Settings</CommandPalette.ItemTitle>
                            <CommandPalette.ItemDescription>
                              Manage workspace preferences.
                            </CommandPalette.ItemDescription>
                          </CommandPalette.ItemContent>
                        </CommandPalette.Item>
                      </CommandPalette.Section>
                    </CommandPalette.ListBox>
                    <CommandPalette.Footer>Press Esc to close.</CommandPalette.Footer>
                  </CommandPalette.Content>
                </CommandPalette.Popup>
              </CommandPalette.Backdrop>
            </CommandPalette.Root>
          </Row>
        </Section>

        <Section
          id="navigation-menu"
          title="NavigationMenu"
          classes={[
            'tale-navigation-menu',
            'tale-navigation-menu__list',
            'tale-navigation-menu__item',
            'tale-navigation-menu__trigger',
            'tale-navigation-menu__link',
            'tale-navigation-menu__icon',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <NavigationMenu.Root>
            <NavigationMenu.List>
              <NavigationMenu.Item>
                <NavigationMenu.Link href="#">Home</NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link href="#">Products</NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link href="#">About</NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link href="#">Contact</NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
          <SubHeading>With Dropdown &amp; Icon</SubHeading>
          <NavMenuDropdownDemo />
        </Section>

        <Section id="menubar" title="Menubar" classes={['tale-menubar', 'tale-menubar__item']}>
          <SubHeading>Default</SubHeading>
          <Menubar.Root>
            <Menubar.Item>
              <Menu.Root>
                <Menu.Trigger>File</Menu.Trigger>
                <Menu.Popover offset={4}>
                  <Menu.MenuList aria-label="File">
                    <Menu.Item id="new" textValue="New">
                      New
                    </Menu.Item>
                    <Menu.Item id="open" textValue="Open">
                      Open
                    </Menu.Item>
                    <Menu.Separator />
                    <Menu.Item id="save" textValue="Save">
                      Save
                    </Menu.Item>
                  </Menu.MenuList>
                </Menu.Popover>
              </Menu.Root>
            </Menubar.Item>
            <Menubar.Item>
              <Menu.Root>
                <Menu.Trigger>Edit</Menu.Trigger>
                <Menu.Popover offset={4}>
                  <Menu.MenuList aria-label="Edit">
                    <Menu.Item id="undo" textValue="Undo">
                      Undo
                    </Menu.Item>
                    <Menu.Item id="redo" textValue="Redo">
                      Redo
                    </Menu.Item>
                    <Menu.Separator />
                    <Menu.Item id="cut" textValue="Cut">
                      Cut
                    </Menu.Item>
                    <Menu.Item id="copy" textValue="Copy">
                      Copy
                    </Menu.Item>
                    <Menu.Item id="paste" textValue="Paste">
                      Paste
                    </Menu.Item>
                  </Menu.MenuList>
                </Menu.Popover>
              </Menu.Root>
            </Menubar.Item>
            <Menubar.Item>
              <Menu.Root>
                <Menu.Trigger>View</Menu.Trigger>
                <Menu.Popover offset={4}>
                  <Menu.MenuList aria-label="View">
                    <Menu.Item id="zoom-in" textValue="Zoom In">
                      Zoom In
                    </Menu.Item>
                    <Menu.Item id="zoom-out" textValue="Zoom Out">
                      Zoom Out
                    </Menu.Item>
                    <Menu.Separator />
                    <Menu.Item id="full-screen" textValue="Full Screen">
                      Full Screen
                    </Menu.Item>
                  </Menu.MenuList>
                </Menu.Popover>
              </Menu.Root>
            </Menubar.Item>
          </Menubar.Root>
        </Section>

        <Section
          id="breadcrumbs"
          title="Breadcrumbs"
          classes={['tale-breadcrumbs', 'tale-breadcrumbs__item', 'tale-breadcrumbs__link']}
        >
          <SubHeading>Default</SubHeading>
          <Breadcrumbs.Root>
            <Breadcrumbs.Item>
              <Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>
              <Breadcrumbs.Link href="#">Products</Breadcrumbs.Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>
              <Breadcrumbs.Link>Current Page</Breadcrumbs.Link>
            </Breadcrumbs.Item>
          </Breadcrumbs.Root>
        </Section>

        <Section
          id="link"
          title="Link"
          classes={['tale-link', 'tale-link--has-icon', 'tale-link__icon']}
        >
          <SubHeading>Default</SubHeading>
          <Row>
            <Link href="#">Default link</Link>
            <Link href="#" isDisabled>
              Disabled link
            </Link>
          </Row>
          <SubHeading>With Icons</SubHeading>
          <Row>
            <Link href="/docs" iconLeading={<Icon icon={BookOpen} size="sm" />}>
              Documentation
            </Link>
            <Link href="/changelog" iconTrailing={<Icon icon={ArrowRight} size="sm" />}>
              View changelog
            </Link>
          </Row>
          <SubHeading>External</SubHeading>
          <Row>
            <Link
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
              iconTrailing={<Icon icon={ExternalLink} size="sm" />}
            >
              Opens in new tab
            </Link>
          </Row>
        </Section>

        <Section
          id="pagination"
          title="Pagination"
          classes={[
            'tale-pagination',
            'tale-pagination__item',
            'tale-pagination__item--current',
            'tale-pagination__ellipsis',
            'tale-pagination__previous',
            'tale-pagination__next',
            'tale-pagination__dot',
            'tale-pagination__dot--current',
            'tale-pagination__line',
            'tale-pagination__line--current',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <Pagination.Root aria-label="Pagination">
            <Pagination.PreviousTrigger />
            <Pagination.Item page={1} />
            <Pagination.Item page={2} current />
            <Pagination.Item page={3} />
            <Pagination.NextTrigger />
          </Pagination.Root>
          <SubHeading>Many Pages</SubHeading>
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
          <SubHeading>First Page (Previous Disabled)</SubHeading>
          <Pagination.Root aria-label="Pagination">
            <Pagination.PreviousTrigger disabled />
            <Pagination.Item page={1} current />
            <Pagination.Item page={2} />
            <Pagination.Item page={3} />
            <Pagination.NextTrigger />
          </Pagination.Root>
          <SubHeading>Dot Display</SubHeading>
          <Pagination.Root aria-label="Slides">
            <Pagination.Dot page={1} />
            <Pagination.Dot page={2} current />
            <Pagination.Dot page={3} />
            <Pagination.Dot page={4} />
            <Pagination.Dot page={5} />
          </Pagination.Root>
          <SubHeading>Line Display</SubHeading>
          <Pagination.Root aria-label="Steps" style={{ width: 240 }}>
            <Pagination.Line page={1} />
            <Pagination.Line page={2} current />
            <Pagination.Line page={3} />
          </Pagination.Root>
        </Section>

        <Section
          id="pagination-dot"
          title="PaginationDot"
          classes={[
            'tale-pagination-dot',
            'tale-pagination-dot--lg',
            'tale-pagination-dot--framed',
          ]}
        >
          <SubHeading>Default (md)</SubHeading>
          <PaginationDot page={2} total={5} />
          <SubHeading>Large</SubHeading>
          <PaginationDot page={1} total={4} size="lg" />
          <SubHeading>Framed</SubHeading>
          <div
            style={{
              padding: '0.625rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 8,
              display: 'inline-block',
            }}
          >
            <PaginationDot page={2} total={5} framed />
          </div>
          <SubHeading>Framed + Large</SubHeading>
          <div
            style={{
              padding: '0.625rem',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: 8,
              display: 'inline-block',
            }}
          >
            <PaginationDot page={1} total={3} size="lg" framed />
          </div>
        </Section>

        <Section
          id="pagination-line"
          title="PaginationLine"
          classes={[
            'tale-pagination-line',
            'tale-pagination-line--lg',
            'tale-pagination-line--framed',
          ]}
        >
          <SubHeading>Default (md)</SubHeading>
          <PaginationLine page={2} total={5} style={{ width: 240 }} />
          <SubHeading>Large</SubHeading>
          <PaginationLine page={1} total={4} size="lg" style={{ width: 240 }} />
          <SubHeading>Framed</SubHeading>
          <div
            style={{
              padding: '0.625rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 8,
              display: 'inline-block',
              width: 240,
            }}
          >
            <PaginationLine page={2} total={5} framed style={{ width: '100%' }} />
          </div>
          <SubHeading>Framed + Large</SubHeading>
          <div
            style={{
              padding: '0.625rem',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: 8,
              display: 'inline-block',
              width: 240,
            }}
          >
            <PaginationLine page={1} total={3} size="lg" framed style={{ width: '100%' }} />
          </div>
        </Section>

        <Section
          id="pin-input"
          title="PinInput"
          classes={[
            'tale-pin-input',
            'tale-pin-input__group',
            'tale-pin-input__slot',
            'tale-pin-input__separator',
            'tale-pin-input__caret',
          ]}
        >
          <SubHeading>4-digit</SubHeading>
          <PinInput.Root maxLength={4}>
            <PinInput.Group>
              <PinInput.Slot index={0} />
              <PinInput.Slot index={1} />
              <PinInput.Slot index={2} />
              <PinInput.Slot index={3} />
            </PinInput.Group>
          </PinInput.Root>
          <SubHeading>6-digit with separator</SubHeading>
          <PinInput.Root maxLength={6}>
            <PinInput.Group>
              <PinInput.Slot index={0} />
              <PinInput.Slot index={1} />
              <PinInput.Slot index={2} />
            </PinInput.Group>
            <PinInput.Separator />
            <PinInput.Group>
              <PinInput.Slot index={3} />
              <PinInput.Slot index={4} />
              <PinInput.Slot index={5} />
            </PinInput.Group>
          </PinInput.Root>
          <SubHeading>Disabled</SubHeading>
          <PinInput.Root maxLength={4} disabled>
            <PinInput.Group>
              <PinInput.Slot index={0} />
              <PinInput.Slot index={1} />
              <PinInput.Slot index={2} />
              <PinInput.Slot index={3} />
            </PinInput.Group>
          </PinInput.Root>
        </Section>

        <Section
          id="payment-input"
          title="PaymentInput"
          classes={[
            'tale-payment-input',
            'tale-payment-input__group',
            'tale-payment-input__input',
            'tale-payment-input__label',
            'tale-payment-input__card-icon',
            'tale-payment-input__description',
            'tale-payment-input__error',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <PaymentInput.Root>
            <PaymentInput.Group>
              <PaymentInput.Input placeholder="1234 5678 9012 3456" />
              <PaymentInput.CardIcon />
            </PaymentInput.Group>
          </PaymentInput.Root>
          <SubHeading>With Label</SubHeading>
          <PaymentInput.Root>
            <PaymentInput.Label>Card number</PaymentInput.Label>
            <PaymentInput.Group>
              <PaymentInput.Input placeholder="1234 5678 9012 3456" />
              <PaymentInput.CardIcon />
            </PaymentInput.Group>
            <PaymentInput.Description>Visa, Mastercard, Amex, or Discover</PaymentInput.Description>
          </PaymentInput.Root>
        </Section>

        {/* ============================================================= */}
        {/* LAYOUT */}
        {/* ============================================================= */}

        <Section
          id="carousel"
          title="Carousel"
          classes={[
            'tale-carousel',
            'tale-carousel__content',
            'tale-carousel__container',
            'tale-carousel__item',
            'tale-carousel__previous',
            'tale-carousel__next',
            'tale-carousel__indicators',
            'tale-carousel__indicator',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <div style={{ maxWidth: 400 }}>
            <Carousel.Root>
              <Carousel.Content>
                <Carousel.Item>
                  <div
                    style={{
                      height: 120,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--neutral-12)',
                      borderRadius: 'var(--radius-m)',
                    }}
                  >
                    Slide 1
                  </div>
                </Carousel.Item>
                <Carousel.Item>
                  <div
                    style={{
                      height: 120,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--neutral-12)',
                      borderRadius: 'var(--radius-m)',
                    }}
                  >
                    Slide 2
                  </div>
                </Carousel.Item>
                <Carousel.Item>
                  <div
                    style={{
                      height: 120,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--neutral-12)',
                      borderRadius: 'var(--radius-m)',
                    }}
                  >
                    Slide 3
                  </div>
                </Carousel.Item>
              </Carousel.Content>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 'var(--space-xs)',
                  marginTop: 'var(--space-xs)',
                }}
              >
                <Carousel.PreviousTrigger />
                <Carousel.NextTrigger />
              </div>
            </Carousel.Root>
          </div>
          <SubHeading>With indicators + loop</SubHeading>
          <div style={{ maxWidth: 400 }}>
            <Carousel.Root loop>
              <Carousel.Content>
                <Carousel.Item>
                  <div
                    style={{
                      height: 120,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--neutral-12)',
                      borderRadius: 'var(--radius-m)',
                    }}
                  >
                    Slide 1
                  </div>
                </Carousel.Item>
                <Carousel.Item>
                  <div
                    style={{
                      height: 120,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--neutral-12)',
                      borderRadius: 'var(--radius-m)',
                    }}
                  >
                    Slide 2
                  </div>
                </Carousel.Item>
                <Carousel.Item>
                  <div
                    style={{
                      height: 120,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--neutral-12)',
                      borderRadius: 'var(--radius-m)',
                    }}
                  >
                    Slide 3
                  </div>
                </Carousel.Item>
              </Carousel.Content>
              <Carousel.Indicators>
                <Carousel.Indicator index={0} />
                <Carousel.Indicator index={1} />
                <Carousel.Indicator index={2} />
              </Carousel.Indicators>
            </Carousel.Root>
          </div>
        </Section>

        <Section
          id="accordion"
          title="Accordion"
          classes={[
            'tale-accordion',
            'tale-accordion__item',
            'tale-accordion__trigger',
            'tale-accordion__trigger-icon',
            'tale-accordion__panel',
          ]}
        >
          <SubHeading>Default Open</SubHeading>
          <div className="audit__demo-extra-wide">
            <Accordion.Root defaultExpandedKeys={['a']}>
              {[
                {
                  id: 'a',
                  title: 'What is Tale UI?',
                  content:
                    'Tale UI is a styled component library providing accessible headless components with opinionated CSS via @tale-ui/css design tokens.',
                },
                {
                  id: 'b',
                  title: 'How does styling work?',
                  content:
                    'Styling lives in @tale-ui/react-styles. Components are headless — you apply CSS classes like .tale-button.',
                },
                {
                  id: 'c',
                  title: 'Can I use dark mode?',
                  content:
                    'Yes! Set data-color-mode="dark" on the <html> element. Tokens auto-invert.',
                },
              ].map(({ id, title, content }) => (
                <Accordion.Item key={id} id={id}>
                  <Accordion.Header>
                    <Accordion.Trigger>{title}</Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Panel>{content}</Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
          <SubHeading>Multiple Open</SubHeading>
          <div className="audit__demo-extra-wide audit__demo-spaced">
            <Accordion.Root allowsMultipleExpanded defaultExpandedKeys={['m-a', 'm-b']}>
              {[
                {
                  id: 'm-a',
                  title: 'First Section',
                  content:
                    'This section starts open. Multiple sections can be expanded simultaneously.',
                },
                { id: 'm-b', title: 'Second Section', content: 'This section also starts open.' },
                {
                  id: 'm-c',
                  title: 'Third Section',
                  content: 'Click to expand alongside the others.',
                },
              ].map(({ id, title, content }) => (
                <Accordion.Item key={id} id={id}>
                  <Accordion.Header>
                    <Accordion.Trigger>{title}</Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Panel>{content}</Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
          <SubHeading>Disabled</SubHeading>
          <div className="audit__demo-extra-wide">
            <Accordion.Root isDisabled>
              {[
                { id: 'd-a', title: 'Disabled Item A', content: 'Cannot be expanded.' },
                { id: 'd-b', title: 'Disabled Item B', content: 'Cannot be expanded.' },
              ].map(({ id, title, content }) => (
                <Accordion.Item key={id} id={id}>
                  <Accordion.Header>
                    <Accordion.Trigger>{title}</Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Panel>{content}</Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </Section>

        <Section
          id="disclosure"
          title="Disclosure"
          classes={['tale-disclosure', 'tale-disclosure__trigger', 'tale-disclosure__panel']}
        >
          <SubHeading>Default Expanded</SubHeading>
          <div className="audit__demo-wide">
            <Disclosure.Root defaultExpanded>
              <Disclosure.Trigger>Open by default</Disclosure.Trigger>
              <Disclosure.Panel>
                <div className="audit__disclosure-content">This content is visible by default.</div>
              </Disclosure.Panel>
            </Disclosure.Root>
          </div>
          <SubHeading>Collapsed</SubHeading>
          <div className="audit__demo-wide">
            <Disclosure.Root>
              <Disclosure.Trigger>Click to expand</Disclosure.Trigger>
              <Disclosure.Panel>
                <div className="audit__disclosure-content">This content is hidden by default.</div>
              </Disclosure.Panel>
            </Disclosure.Root>
          </div>
          <SubHeading>Disabled</SubHeading>
          <div className="audit__demo-wide">
            <Disclosure.Root isDisabled>
              <Disclosure.Trigger>Disabled</Disclosure.Trigger>
              <Disclosure.Panel>
                <div className="audit__disclosure-content">Content</div>
              </Disclosure.Panel>
            </Disclosure.Root>
          </div>
        </Section>

        <Section
          id="tabs"
          title="Tabs"
          classes={[
            'tale-tabs',
            'tale-tabs__list',
            'tale-tabs__list--pills',
            'tale-tabs__list--enclosed',
            'tale-tabs__tab',
            'tale-tabs__tab-icon',
            'tale-tabs__tab--sm',
            'tale-tabs__tab--pills',
            'tale-tabs__tab--enclosed',
            'tale-tabs__panel',
            'tale-tabs__indicator',
          ]}
        >
          <SubHeading>Horizontal</SubHeading>
          <div className="audit__demo-extra-wide audit__demo-spaced">
            <Tabs.Root defaultSelectedKey="overview">
              <Tabs.List>
                <Tabs.Tab id="overview" icon={<Icon icon={Home} size="sm" />}>
                  Overview
                </Tabs.Tab>
                <Tabs.Tab id="features" icon={<Icon icon={Star} size="sm" />}>
                  Features
                </Tabs.Tab>
                <Tabs.Tab id="disabled-tab" isDisabled>
                  Disabled
                </Tabs.Tab>
                <Tabs.Tab id="docs" icon={<Icon icon={Info} size="sm" />}>
                  Docs
                </Tabs.Tab>
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Panel id="overview">Overview content goes here.</Tabs.Panel>
              <Tabs.Panel id="features">Features list.</Tabs.Panel>
              <Tabs.Panel id="disabled-tab">Disabled tab content.</Tabs.Panel>
              <Tabs.Panel id="docs">Documentation.</Tabs.Panel>
            </Tabs.Root>
          </div>
          <SubHeading>Small</SubHeading>
          <div className="audit__demo-extra-wide audit__demo-spaced">
            <Tabs.Root defaultSelectedKey="sm-overview">
              <Tabs.List size="sm">
                <Tabs.Tab id="sm-overview">Overview</Tabs.Tab>
                <Tabs.Tab id="sm-features">Features</Tabs.Tab>
                <Tabs.Tab id="sm-docs">Docs</Tabs.Tab>
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Panel id="sm-overview">Overview content (small).</Tabs.Panel>
              <Tabs.Panel id="sm-features">Features (small).</Tabs.Panel>
              <Tabs.Panel id="sm-docs">Docs (small).</Tabs.Panel>
            </Tabs.Root>
          </div>
          <SubHeading>Vertical</SubHeading>
          <div className="audit__demo-extra-wide audit__tabs-vertical">
            <Tabs.Root defaultSelectedKey="overview2" orientation="vertical">
              <Tabs.List>
                <Tabs.Tab id="overview2">Overview</Tabs.Tab>
                <Tabs.Tab id="features2">Features</Tabs.Tab>
                <Tabs.Tab id="docs2">Docs</Tabs.Tab>
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Panel id="overview2">Overview content.</Tabs.Panel>
              <Tabs.Panel id="features2">Features.</Tabs.Panel>
              <Tabs.Panel id="docs2">Docs.</Tabs.Panel>
            </Tabs.Root>
          </div>
          <SubHeading>Controlled</SubHeading>
          <ControlledTabsDemo />
          <SubHeading>With Disabled Tab</SubHeading>
          <div className="audit__demo-extra-wide audit__demo-spaced">
            <Tabs.Root defaultSelectedKey="active">
              <Tabs.List>
                <Tabs.Tab id="active">Active</Tabs.Tab>
                <Tabs.Tab id="disabled-only" isDisabled>
                  Disabled
                </Tabs.Tab>
                <Tabs.Tab id="another">Another</Tabs.Tab>
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Panel id="active">This tab is active.</Tabs.Panel>
              <Tabs.Panel id="disabled-only">
                This tab is disabled and cannot be selected.
              </Tabs.Panel>
              <Tabs.Panel id="another">Another tab panel.</Tabs.Panel>
            </Tabs.Root>
          </div>
          <SubHeading>Pills Variant</SubHeading>
          <div className="audit__demo-extra-wide audit__demo-spaced">
            <Tabs.Root defaultSelectedKey="pills-overview">
              <Tabs.List variant="pills">
                <Tabs.Tab id="pills-overview">Overview</Tabs.Tab>
                <Tabs.Tab id="pills-features">Features</Tabs.Tab>
                <Tabs.Tab id="pills-docs">Docs</Tabs.Tab>
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Panel id="pills-overview">Overview content (pills).</Tabs.Panel>
              <Tabs.Panel id="pills-features">Features (pills).</Tabs.Panel>
              <Tabs.Panel id="pills-docs">Docs (pills).</Tabs.Panel>
            </Tabs.Root>
          </div>
          <SubHeading>Enclosed Variant</SubHeading>
          <div className="audit__demo-extra-wide audit__demo-spaced">
            <Tabs.Root defaultSelectedKey="enclosed-overview">
              <Tabs.List variant="enclosed">
                <Tabs.Tab id="enclosed-overview">Overview</Tabs.Tab>
                <Tabs.Tab id="enclosed-features">Features</Tabs.Tab>
                <Tabs.Tab id="enclosed-docs">Docs</Tabs.Tab>
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Panel id="enclosed-overview">Overview content (enclosed).</Tabs.Panel>
              <Tabs.Panel id="enclosed-features">Features (enclosed).</Tabs.Panel>
              <Tabs.Panel id="enclosed-docs">Docs (enclosed).</Tabs.Panel>
            </Tabs.Root>
          </div>
        </Section>

        <Section
          id="scroll-area"
          title="ScrollArea"
          classes={[
            'tale-scroll-area',
            'tale-scroll-area__viewport',
            'tale-scroll-area__content',
            'tale-scroll-area__scrollbar',
            'tale-scroll-area__thumb',
            'tale-scroll-area__corner',
          ]}
        >
          <ScrollArea.Root className="audit__scroll-area">
            <ScrollArea.Viewport>
              <ScrollArea.Content>
                {Array.from({ length: 20 }, (_, i) => (
                  <p key={i} className="audit__scroll-text">
                    Line {i + 1}: Scrollable content with custom styled scrollbars.
                  </p>
                ))}
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
          </ScrollArea.Root>
        </Section>

        <Section id="separator" title="Separator" classes={['tale-separator']}>
          <SubHeading>Horizontal</SubHeading>
          <div className="audit__demo-medium audit__demo-spaced">
            <p className="audit__separator-text audit__separator-above">Content above</p>
            <Separator />
            <p className="audit__separator-text audit__separator-below">Content below</p>
          </div>
          <SubHeading>Vertical</SubHeading>
          <div className="audit__separator-vertical">
            <span className="audit__separator-text">Left</span>
            <Separator orientation="vertical" />
            <span className="audit__separator-text">Right</span>
          </div>
        </Section>

        <Section
          id="toolbar"
          title="Toolbar"
          classes={[
            'tale-toolbar',
            'tale-toolbar__group',
            'tale-toolbar__button',
            'tale-toolbar__separator',
            'tale-toolbar__link',
            'tale-toolbar__input',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <Toolbar.Root aria-label="Text formatting">
            <Toolbar.Group>
              <Toolbar.Button aria-label="Bold">
                <strong>B</strong>
              </Toolbar.Button>
              <Toolbar.Button aria-label="Italic">
                <em>I</em>
              </Toolbar.Button>
              <Toolbar.Button aria-label="Underline">
                <u>U</u>
              </Toolbar.Button>
            </Toolbar.Group>
            <Toolbar.Separator />
            <Toolbar.Group>
              <Toolbar.Button disabled>Undo</Toolbar.Button>
              <Toolbar.Button disabled>Redo</Toolbar.Button>
            </Toolbar.Group>
            <Toolbar.Separator />
            <Toolbar.Link href="#">Help</Toolbar.Link>
          </Toolbar.Root>
          <SubHeading>With Input</SubHeading>
          <Toolbar.Root aria-label="Search toolbar" className="audit__demo-spaced">
            <Toolbar.Group>
              <Toolbar.Button>Filter</Toolbar.Button>
              <Toolbar.Button>Sort</Toolbar.Button>
            </Toolbar.Group>
            <Toolbar.Separator />
            <Toolbar.Input placeholder="Search…" aria-label="Search" />
          </Toolbar.Root>
        </Section>

        <Section
          id="app-shell"
          title="AppShell"
          classes={[
            'tale-app-shell',
            'tale-app-shell--with-sidebar',
            'tale-app-shell__header',
            'tale-app-shell__sidebar',
            'tale-app-shell__main',
            'tale-app-shell__mobile-navigation',
            'tale-app-shell__skip-link',
          ]}
        >
          <AppShell.Root style={{ minHeight: '24rem' }}>
            <AppShell.SkipLink />
            <AppShell.Header>
              <HeaderNav.Root aria-label="Audit header">
                <HeaderNav.Logo href="#">Tale</HeaderNav.Logo>
              </HeaderNav.Root>
            </AppShell.Header>
            <AppShell.Sidebar>
              <Sidebar.Root aria-label="Audit navigation">
                <Sidebar.NavList>
                  <Sidebar.NavItem href="#" current>
                    Overview
                  </Sidebar.NavItem>
                </Sidebar.NavList>
              </Sidebar.Root>
            </AppShell.Sidebar>
            <AppShell.Main>Application-owned content</AppShell.Main>
            <AppShell.MobileNavigation>Mobile navigation slot</AppShell.MobileNavigation>
          </AppShell.Root>
        </Section>

        <Section
          id="chat"
          title="Chat"
          classes={[
            'tale-chat',
            'tale-chat--with-artifact-panel',
            'tale-chat__conversation',
            'tale-chat__artifact-panel',
            'tale-chat__message-list',
            'tale-chat__message',
            'tale-chat__bubble',
            'tale-chat__metadata',
            'tale-chat__composer',
            'tale-chat__tool-call',
          ]}
        >
          <Chat.Root
            aria-label="Audit conversation"
            artifactPanel={<Text>Artifact preview</Text>}
            style={{ minHeight: '24rem' }}
          >
            <Chat.List aria-label="Messages">
              <Chat.Message speaker="user" aria-label="User message">
                <Chat.Bubble>Check the build status.</Chat.Bubble>
              </Chat.Message>
              <Chat.Message speaker="assistant" aria-label="Assistant message">
                <Chat.Bubble>The build passed.</Chat.Bubble>
                <Chat.Metadata>Just now</Chat.Metadata>
                <Chat.ToolCall state="success" label="Read checks" statusLabel="Complete" open>
                  All checks passed.
                </Chat.ToolCall>
              </Chat.Message>
            </Chat.List>
            <Chat.Composer
              aria-label="Message composer"
              onSubmit={(event) => event.preventDefault()}
            >
              <TextArea.Root>
                <TextArea.TextArea aria-label="Message" />
              </TextArea.Root>
              <Button type="submit">Send</Button>
            </Chat.Composer>
          </Chat.Root>
        </Section>

        <Section
          id="aspect-ratio"
          title="AspectRatio"
          classes={['tale-aspect-ratio', 'tale-aspect-ratio--cover', 'tale-aspect-ratio--contain']}
        >
          <SubHeading>16:9 media frame</SubHeading>
          <AspectRatio ratio="16 / 9" style={{ width: '20rem', background: 'var(--neutral-12)' }}>
            <div className="display--flex align--center justify--center">16:9 content</div>
          </AspectRatio>
        </Section>

        <Section
          id="card"
          title="Card"
          classes={[
            'tale-card',
            'tale-card--button',
            'tale-card--outlined',
            'tale-card--elevated',
            'tale-card--filled',
            'tale-card--sm',
            'tale-card--md',
            'tale-card--lg',
            'tale-card__header',
            'tale-card__body',
            'tale-card__footer',
          ]}
        >
          <SubHeading>Outlined (default)</SubHeading>
          <Card.Root variant="outlined" style={{ maxWidth: '20rem' }}>
            <Card.Header>Card title</Card.Header>
            <Card.Body>Card body content goes here.</Card.Body>
            <Card.Footer>
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
              <Button variant="primary" size="sm">
                Confirm
              </Button>
            </Card.Footer>
          </Card.Root>
          <SubHeading>Elevated</SubHeading>
          <Card.Root variant="elevated" style={{ maxWidth: '20rem' }}>
            <Card.Header>Elevated card</Card.Header>
            <Card.Body>Content with shadow.</Card.Body>
          </Card.Root>
          <SubHeading>Filled</SubHeading>
          <Card.Root variant="filled" style={{ maxWidth: '20rem' }}>
            <Card.Header>Filled card</Card.Header>
            <Card.Body>Background fill variant.</Card.Body>
          </Card.Root>
          <SubHeading>Interactive, selected, and disabled</SubHeading>
          <CardButtonAuditDemo />
        </Section>

        <Section id="column" title="Column" classes={['tale-column']}>
          <SubHeading>Default</SubHeading>
          <Column gap="s" style={{ maxWidth: '20rem' }}>
            <span>First child</span>
            <span>Second child</span>
            <span>Third child</span>
          </Column>
        </Section>

        <Section id="row" title="Row" classes={['tale-row', 'tale-row--wrap']}>
          <SubHeading>Default</SubHeading>
          <LayoutRow gap="s">
            <Button variant="ghost">Cancel</Button>
            <Button variant="primary">Save</Button>
          </LayoutRow>
          <SubHeading>Justify end</SubHeading>
          <LayoutRow gap="s" justify="end">
            <Button variant="ghost">Cancel</Button>
            <Button variant="primary">Save</Button>
          </LayoutRow>
          <SubHeading>Wrapped</SubHeading>
          <LayoutRow gap="xs" wrap style={{ maxWidth: '12.5rem' }}>
            {['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map((t) => (
              <span
                key={t}
                style={{
                  padding: '0.25rem 0.5rem',
                  background: 'var(--neutral-10)',
                  borderRadius: 'var(--radius-s)',
                }}
              >
                {t}
              </span>
            ))}
          </LayoutRow>
        </Section>

        <Section
          id="overflow-list"
          title="OverflowList"
          classes={[
            'tale-overflow-list',
            'tale-overflow-list__item',
            'tale-overflow-list__overflow',
          ]}
        >
          <SubHeading>Measured actions</SubHeading>
          <OverflowList
            aria-label="Document actions"
            items={auditOverflowActions}
            getKey={(action) => action.id}
            renderItem={(action) => <Button variant="neutral">{action.label}</Button>}
            renderOverflow={(hidden, { overflowControlRef }) => (
              <Button
                ref={overflowControlRef}
                variant="neutral"
                aria-label={`${hidden.length} more actions`}
              >
                More
              </Button>
            )}
            style={{ width: '16.25rem' }}
          />
        </Section>

        <Section
          id="resizable"
          title="Resizable"
          classes={[
            'tale-resizable',
            'tale-resizable--horizontal',
            'tale-resizable__panel',
            'tale-resizable__handle',
          ]}
        >
          <SubHeading>Bounded workspace</SubHeading>
          <Resizable.Root
            defaultSizes={{ navigation: 30, content: 70 }}
            style={{ height: '12rem' }}
          >
            <Resizable.Panel
              id="navigation"
              minSize={20}
              maxSize={50}
              style={{ padding: 'var(--space-s)', background: 'var(--neutral-10)' }}
            >
              Navigation
            </Resizable.Panel>
            <Resizable.Handle
              id="navigation-content"
              before="navigation"
              after="content"
              aria-label="Resize navigation and content"
            />
            <Resizable.Panel
              id="content"
              minSize={40}
              style={{ padding: 'var(--space-s)', background: 'var(--neutral-5)' }}
            >
              Content
            </Resizable.Panel>
          </Resizable.Root>
        </Section>

        {/* ============================================================= */}
        {/* FEEDBACK */}
        {/* ============================================================= */}

        <Section
          id="banner"
          title="Banner"
          classes={[
            'tale-banner',
            'tale-banner--success',
            'tale-banner--warning',
            'tale-banner--error',
            'tale-banner--sm',
            'tale-banner__icon',
            'tale-banner__title',
            'tale-banner__description',
            'tale-banner__actions',
            'tale-banner__close',
          ]}
        >
          <SubHeading>Info (default)</SubHeading>
          <Banner.Root variant="info">
            <Banner.Title>Heads up</Banner.Title>
            <Banner.Description>Your trial expires in 3 days.</Banner.Description>
          </Banner.Root>
          <SubHeading>Success</SubHeading>
          <Banner.Root variant="success">
            <Banner.Title>Success</Banner.Title>
            <Banner.Description>Operation completed.</Banner.Description>
          </Banner.Root>
          <SubHeading>Warning</SubHeading>
          <Banner.Root variant="warning">
            <Banner.Title>Warning</Banner.Title>
            <Banner.Description>Please review before continuing.</Banner.Description>
          </Banner.Root>
          <SubHeading>Error</SubHeading>
          <Banner.Root variant="error">
            <Banner.Title>Error</Banner.Title>
            <Banner.Description>Something went wrong.</Banner.Description>
          </Banner.Root>
          <SubHeading>With Close</SubHeading>
          <Banner.Root variant="info">
            <Banner.Title>Tip</Banner.Title>
            <Banner.Description>You can customise your dashboard.</Banner.Description>
            <Banner.Close aria-label="Dismiss" />
          </Banner.Root>
          <SubHeading>With Actions</SubHeading>
          <Banner.Root variant="info">
            <Banner.Title>Update available</Banner.Title>
            <Banner.Description>A new version is ready to install.</Banner.Description>
            <Banner.Actions>
              <Button variant="ghost" size="sm">
                Later
              </Button>
              <Button variant="ghost" size="sm">
                Update now
              </Button>
            </Banner.Actions>
          </Banner.Root>
          <SubHeading>Small</SubHeading>
          <Banner.Root variant="info" size="sm">
            <Banner.Title>Note</Banner.Title>
            <Banner.Description>Compact banner.</Banner.Description>
          </Banner.Root>
        </Section>

        <Section
          id="progress-bar"
          title="ProgressBar"
          classes={[
            'tale-progress-bar',
            'tale-progress-bar__header',
            'tale-progress-bar__label',
            'tale-progress-bar__value',
            'tale-progress-bar__track',
            'tale-progress-bar__indicator',
          ]}
        >
          <SubHeading>With Header, Label &amp; Value</SubHeading>
          <div className="audit__demo-wide display--flex flex--col gap--s">
            <ProgressBar.Root value={20}>
              <ProgressBar.Header>
                <ProgressBar.Label>Downloading</ProgressBar.Label>
                <ProgressBar.Value>20%</ProgressBar.Value>
              </ProgressBar.Header>
              <ProgressBar.Track>
                <ProgressBar.Indicator value={20} />
              </ProgressBar.Track>
            </ProgressBar.Root>
            <ProgressBar.Root value={60}>
              <ProgressBar.Header>
                <ProgressBar.Label>Upload</ProgressBar.Label>
                <ProgressBar.Value>60%</ProgressBar.Value>
              </ProgressBar.Header>
              <ProgressBar.Track>
                <ProgressBar.Indicator value={60} />
              </ProgressBar.Track>
            </ProgressBar.Root>
            <ProgressBar.Root value={100}>
              <ProgressBar.Header>
                <ProgressBar.Label>Complete</ProgressBar.Label>
                <ProgressBar.Value>100%</ProgressBar.Value>
              </ProgressBar.Header>
              <ProgressBar.Track>
                <ProgressBar.Indicator value={100} />
              </ProgressBar.Track>
            </ProgressBar.Root>
          </div>
          <SubHeading>Indeterminate</SubHeading>
          <div className="audit__demo-wide">
            <ProgressBar.Root isIndeterminate>
              <ProgressBar.Header>
                <ProgressBar.Label>Processing</ProgressBar.Label>
              </ProgressBar.Header>
              <ProgressBar.Track>
                <ProgressBar.Indicator />
              </ProgressBar.Track>
            </ProgressBar.Root>
          </div>
          <SubHeading>Label position: right</SubHeading>
          <div className="audit__demo-wide display--flex flex--col gap--s">
            {[20, 60, 100].map((value) => (
              <ProgressBar.Root key={value} value={value} labelPosition="right">
                <ProgressBar.Header>
                  <ProgressBar.Value>{value}%</ProgressBar.Value>
                </ProgressBar.Header>
                <ProgressBar.Track>
                  <ProgressBar.Indicator value={value} />
                </ProgressBar.Track>
              </ProgressBar.Root>
            ))}
          </div>
          <SubHeading>Label position: bottom</SubHeading>
          <div className="audit__demo-wide display--flex flex--col gap--s">
            {[20, 60, 100].map((value) => (
              <ProgressBar.Root key={value} value={value} labelPosition="bottom">
                <ProgressBar.Header>
                  <ProgressBar.Label>Uploading</ProgressBar.Label>
                  <ProgressBar.Value>{value}%</ProgressBar.Value>
                </ProgressBar.Header>
                <ProgressBar.Track>
                  <ProgressBar.Indicator value={value} />
                </ProgressBar.Track>
              </ProgressBar.Root>
            ))}
          </div>
          <SubHeading>Label position: top-floating</SubHeading>
          <div className="audit__demo-wide display--flex flex--col gap--s">
            {[20, 60, 100].map((value) => (
              <ProgressBar.Root key={value} value={value} labelPosition="top-floating">
                <ProgressBar.Header>
                  <ProgressBar.Value>{value}%</ProgressBar.Value>
                </ProgressBar.Header>
                <ProgressBar.Track>
                  <ProgressBar.Indicator value={value} />
                </ProgressBar.Track>
              </ProgressBar.Root>
            ))}
          </div>
          <SubHeading>Label position: bottom-floating</SubHeading>
          <div className="audit__demo-wide display--flex flex--col gap--s">
            {[20, 60, 100].map((value) => (
              <ProgressBar.Root key={value} value={value} labelPosition="bottom-floating">
                <ProgressBar.Header>
                  <ProgressBar.Value>{value}%</ProgressBar.Value>
                </ProgressBar.Header>
                <ProgressBar.Track>
                  <ProgressBar.Indicator value={value} />
                </ProgressBar.Track>
              </ProgressBar.Root>
            ))}
          </div>
        </Section>

        <Section
          id="progress-circle"
          title="ProgressCircle"
          classes={[
            'tale-progress-circle',
            'tale-progress-circle--sm',
            'tale-progress-circle--lg',
            'tale-progress-circle__track',
            'tale-progress-circle__rail',
            'tale-progress-circle__indicator',
            'tale-progress-circle__label',
            'tale-progress-circle__value',
          ]}
        >
          <SubHeading>Determinate</SubHeading>
          <Row>
            <ProgressCircle.Root value={25} size="sm">
              <ProgressCircle.Track />
            </ProgressCircle.Root>
            <ProgressCircle.Root value={50}>
              <ProgressCircle.Track />
            </ProgressCircle.Root>
            <ProgressCircle.Root value={75} size="lg">
              <ProgressCircle.Track />
            </ProgressCircle.Root>
          </Row>
          <SubHeading>Indeterminate</SubHeading>
          <Row>
            <ProgressCircle.Root value={undefined} size="sm">
              <ProgressCircle.Track />
            </ProgressCircle.Root>
            <ProgressCircle.Root value={undefined}>
              <ProgressCircle.Track />
            </ProgressCircle.Root>
            <ProgressCircle.Root value={undefined} size="lg">
              <ProgressCircle.Track />
            </ProgressCircle.Root>
          </Row>
          <SubHeading>Complete</SubHeading>
          <Row>
            <ProgressCircle.Root value={100}>
              <ProgressCircle.Track />
              <ProgressCircle.Value />
            </ProgressCircle.Root>
          </Row>
          <SubHeading>With Label</SubHeading>
          <Row>
            <ProgressCircle.Root value={60}>
              <ProgressCircle.Track />
              <ProgressCircle.Label>Upload</ProgressCircle.Label>
              <ProgressCircle.Value />
            </ProgressCircle.Root>
          </Row>
        </Section>

        <Section
          id="meter"
          title="Meter"
          classes={[
            'tale-meter',
            'tale-meter__header',
            'tale-meter__label',
            'tale-meter__value',
            'tale-meter__track',
            'tale-meter__indicator',
          ]}
        >
          <SubHeading>With Header, Label &amp; Value</SubHeading>
          <div className="audit__demo-wide display--flex flex--col gap--s">
            <Meter.Root value={25}>
              <Meter.Header>
                <Meter.Label>Battery</Meter.Label>
                <Meter.Value>25%</Meter.Value>
              </Meter.Header>
              <Meter.Track>
                <Meter.Indicator value={25} />
              </Meter.Track>
            </Meter.Root>
            <Meter.Root value={60}>
              <Meter.Header>
                <Meter.Label>Memory</Meter.Label>
                <Meter.Value>60%</Meter.Value>
              </Meter.Header>
              <Meter.Track>
                <Meter.Indicator value={60} />
              </Meter.Track>
            </Meter.Root>
            <Meter.Root value={72}>
              <Meter.Header>
                <Meter.Label>Storage</Meter.Label>
                <Meter.Value>72%</Meter.Value>
              </Meter.Header>
              <Meter.Track>
                <Meter.Indicator value={72} />
              </Meter.Track>
            </Meter.Root>
            <Meter.Root value={90}>
              <Meter.Header>
                <Meter.Label>CPU</Meter.Label>
                <Meter.Value>90%</Meter.Value>
              </Meter.Header>
              <Meter.Track>
                <Meter.Indicator value={90} />
              </Meter.Track>
            </Meter.Root>
          </div>
        </Section>

        <Section
          id="skeleton"
          title="Skeleton"
          classes={[
            'tale-skeleton',
            'tale-skeleton--text',
            'tale-skeleton--rectangular',
            'tale-skeleton--circular',
            'tale-skeleton--pulse',
            'tale-skeleton--none',
          ]}
        >
          <SubHeading>Variants</SubHeading>
          <div className="audit__demo-wide display--flex flex--col gap--s">
            <Skeleton width="100%" />
            <Skeleton variant="rectangular" width="100%" height={80} />
            <Skeleton variant="circular" width={48} height={48} animation="none" />
          </div>
        </Section>

        <Section
          id="spinner"
          title="Spinner"
          classes={[
            'tale-spinner',
            'tale-spinner--line',
            'tale-spinner--dots',
            'tale-spinner--sm',
            'tale-spinner--lg',
          ]}
        >
          <SubHeading>Circle (default)</SubHeading>
          <Row>
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </Row>
          <SubHeading>Dots</SubHeading>
          <Row>
            <Spinner variant="dots" size="sm" />
            <Spinner variant="dots" size="md" />
            <Spinner variant="dots" size="lg" />
          </Row>
          <SubHeading>Line</SubHeading>
          <div className="audit__demo-wide">
            <Spinner variant="line" />
          </div>
        </Section>

        <Section
          id="toast"
          title="Toast"
          classes={[
            'tale-toast-region',
            'tale-toast-list',
            'tale-toast',
            'tale-toast__content',
            'tale-toast__title',
            'tale-toast__description',
            'tale-toast__dismiss',
            'tale-toast__announcer',
          ]}
        >
          <SubHeading>Persistent queued feedback</SubHeading>
          <ToastAuditDemo />
        </Section>

        {/* ============================================================= */}
        {/* DISPLAY */}
        {/* ============================================================= */}

        <Section
          id="avatar"
          title="Avatar"
          classes={[
            'tale-avatar',
            'tale-avatar--xs',
            'tale-avatar--sm',
            'tale-avatar--md',
            'tale-avatar--lg',
            'tale-avatar--xl',
            'tale-avatar--2xl',
            'tale-avatar__image',
            'tale-avatar__fallback',
            'tale-avatar-group',
            'tale-avatar-count',
            'tale-avatar-count--xs',
            'tale-avatar-count--2xl',
            'tale-avatar-indicator',
            'tale-avatar-indicator--bottom-right',
            'tale-avatar-indicator--top-right',
            'tale-avatar-indicator__badge',
            'tale-avatar-label-group',
            'tale-avatar-label-group--sm',
            'tale-avatar-label-group--md',
            'tale-avatar-label-group--lg',
            'tale-avatar-label-group__title',
            'tale-avatar-label-group__subtitle',
            'tale-avatar-add-button',
            'tale-avatar-add-button--xs',
            'tale-avatar-add-button--sm',
            'tale-avatar-add-button--md',
            'tale-avatar-add-button__icon',
            'tale-avatar-company-icon',
            'tale-avatar-company-icon--md',
            'tale-avatar-company-icon--lg',
            'tale-avatar-company-icon__badge',
            'tale-avatar-verified-tick',
            'tale-avatar-verified-tick--xs',
            'tale-avatar-verified-tick--sm',
            'tale-avatar-verified-tick--md',
            'tale-avatar-verified-tick--lg',
            'tale-avatar-profile-photo',
            'tale-avatar-profile-photo--sm',
            'tale-avatar-profile-photo--md',
            'tale-avatar-profile-photo--lg',
            'tale-avatar-profile-photo__inner',
            'tale-avatar-profile-photo__badge',
          ]}
        >
          <SubHeading>Sizes (fallback)</SubHeading>
          <Row>
            {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
              <Avatar.Root key={size} size={size}>
                <Avatar.Fallback>AB</Avatar.Fallback>
              </Avatar.Root>
            ))}
          </Row>
          <SubHeading>With image</SubHeading>
          <Row>
            <Avatar.Root size="lg">
              <Avatar.Image src="https://placehold.co/96x96" alt="User" />
              <Avatar.Fallback>AB</Avatar.Fallback>
            </Avatar.Root>
          </Row>
          <SubHeading>Group with Count</SubHeading>
          <Row>
            <Avatar.Group size="md">
              <Avatar.Root>
                <Avatar.Fallback>AB</Avatar.Fallback>
              </Avatar.Root>
              <Avatar.Root>
                <Avatar.Fallback>CD</Avatar.Fallback>
              </Avatar.Root>
              <Avatar.Root>
                <Avatar.Fallback>EF</Avatar.Fallback>
              </Avatar.Root>
              <Avatar.Count>+5</Avatar.Count>
            </Avatar.Group>
          </Row>
          <SubHeading>Indicator (bottom-right)</SubHeading>
          <Row>
            {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
              <Avatar.Indicator key={size} badge={<DotIcon color="success" />}>
                <Avatar.Root size={size}>
                  <Avatar.Fallback>AB</Avatar.Fallback>
                </Avatar.Root>
              </Avatar.Indicator>
            ))}
          </Row>
          <SubHeading>Indicator (top-right)</SubHeading>
          <Row>
            <Avatar.Indicator badge={<DotIcon color="error" />} position="top-right">
              <Avatar.Root size="lg">
                <Avatar.Fallback>CD</Avatar.Fallback>
              </Avatar.Root>
            </Avatar.Indicator>
          </Row>
          <SubHeading>LabelGroup sizes</SubHeading>
          <Row>
            <Avatar.LabelGroup size="sm">
              <Avatar.Root>
                <Avatar.Fallback>JD</Avatar.Fallback>
              </Avatar.Root>
              <Avatar.LabelGroupTitle>Jane Doe</Avatar.LabelGroupTitle>
              <Avatar.LabelGroupSubtitle>Product Designer</Avatar.LabelGroupSubtitle>
            </Avatar.LabelGroup>
            <Avatar.LabelGroup size="md">
              <Avatar.Root>
                <Avatar.Fallback>JD</Avatar.Fallback>
              </Avatar.Root>
              <Avatar.LabelGroupTitle>Jane Doe</Avatar.LabelGroupTitle>
              <Avatar.LabelGroupSubtitle>Product Designer</Avatar.LabelGroupSubtitle>
            </Avatar.LabelGroup>
            <Avatar.LabelGroup size="lg">
              <Avatar.Root>
                <Avatar.Fallback>JD</Avatar.Fallback>
              </Avatar.Root>
              <Avatar.LabelGroupTitle>Jane Doe</Avatar.LabelGroupTitle>
              <Avatar.LabelGroupSubtitle>Product Designer</Avatar.LabelGroupSubtitle>
            </Avatar.LabelGroup>
          </Row>
          <SubHeading>LabelGroup with Indicator</SubHeading>
          <Row>
            <Avatar.LabelGroup size="md">
              <Avatar.Indicator badge={<DotIcon color="success" />}>
                <Avatar.Root>
                  <Avatar.Image src="https://placehold.co/72x72" alt="User" />
                  <Avatar.Fallback>JD</Avatar.Fallback>
                </Avatar.Root>
              </Avatar.Indicator>
              <Avatar.LabelGroupTitle>Jane Doe</Avatar.LabelGroupTitle>
              <Avatar.LabelGroupSubtitle>Online</Avatar.LabelGroupSubtitle>
            </Avatar.LabelGroup>
          </Row>
          <SubHeading>AddButton sizes</SubHeading>
          <Row>
            {(['xs', 'sm', 'md'] as const).map((size) => (
              <Avatar.AddButton key={size} size={size} aria-label={`Add member (${size})`} />
            ))}
          </Row>
          <SubHeading>AddButton in Group</SubHeading>
          <Row>
            <Avatar.Group size="md">
              <Avatar.Root>
                <Avatar.Fallback>AB</Avatar.Fallback>
              </Avatar.Root>
              <Avatar.Root>
                <Avatar.Fallback>CD</Avatar.Fallback>
              </Avatar.Root>
              <Avatar.AddButton size="md" aria-label="Add team member" />
            </Avatar.Group>
          </Row>
          <SubHeading>CompanyIcon sizes</SubHeading>
          <Row>
            {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
              <Avatar.CompanyIcon
                key={size}
                src="https://placehold.co/64x64/6366f1/ffffff"
                alt="Company"
                size={size}
              >
                <Avatar.Root size={size}>
                  <Avatar.Fallback>JD</Avatar.Fallback>
                </Avatar.Root>
              </Avatar.CompanyIcon>
            ))}
          </Row>
          <SubHeading>VerifiedTick sizes</SubHeading>
          <Row>
            {(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] as const).map((size) => (
              <Avatar.VerifiedTick key={size} size={size} />
            ))}
          </Row>
          <SubHeading>VerifiedTick on Indicator</SubHeading>
          <Row>
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <Avatar.Indicator key={size} badge={<Avatar.VerifiedTick size="sm" />}>
                <Avatar.Root size={size}>
                  <Avatar.Fallback>JD</Avatar.Fallback>
                </Avatar.Root>
              </Avatar.Indicator>
            ))}
          </Row>
          <SubHeading>ProfilePhoto sizes</SubHeading>
          <Row>
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <Avatar.ProfilePhoto key={size} size={size}>
                <Avatar.Fallback>JD</Avatar.Fallback>
              </Avatar.ProfilePhoto>
            ))}
          </Row>
          <SubHeading>ProfilePhoto with VerifiedTick badge</SubHeading>
          <Row>
            <Avatar.ProfilePhoto size="sm" badge={<Avatar.VerifiedTick size="xs" />}>
              <Avatar.Fallback>AB</Avatar.Fallback>
            </Avatar.ProfilePhoto>
            <Avatar.ProfilePhoto size="md" badge={<Avatar.VerifiedTick size="sm" />}>
              <Avatar.Fallback>CD</Avatar.Fallback>
            </Avatar.ProfilePhoto>
            <Avatar.ProfilePhoto size="lg" badge={<Avatar.VerifiedTick size="md" />}>
              <Avatar.Image src="https://placehold.co/160x160" alt="User" />
              <Avatar.Fallback>EF</Avatar.Fallback>
            </Avatar.ProfilePhoto>
          </Row>
        </Section>

        <Section
          id="badge"
          title="Badge"
          classes={[
            'tale-badge',
            'tale-badge--neutral',
            'tale-badge--brand',
            'tale-badge--error',
            'tale-badge--warning',
            'tale-badge--success',
            'tale-badge--red',
            'tale-badge--orange',
            'tale-badge--amber',
            'tale-badge--yellow',
            'tale-badge--lime',
            'tale-badge--green',
            'tale-badge--emerald',
            'tale-badge--teal',
            'tale-badge--cyan',
            'tale-badge--sky',
            'tale-badge--indigo',
            'tale-badge--violet',
            'tale-badge--purple',
            'tale-badge--fuchsia',
            'tale-badge--pink',
            'tale-badge--rose',
            'tale-badge--sm',
            'tale-badge--md',
            'tale-badge--lg',
            'tale-badge--rounded',
            'tale-badge--modern',
          ]}
        >
          <SubHeading>Variants</SubHeading>
          <Row>
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="brand">Brand</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="success">Success</Badge>
          </Row>
          <SubHeading>Named Colors</SubHeading>
          <Row>
            <Badge variant="red">Red</Badge>
            <Badge variant="orange">Orange</Badge>
            <Badge variant="amber">Amber</Badge>
            <Badge variant="yellow">Yellow</Badge>
            <Badge variant="lime">Lime</Badge>
            <Badge variant="green">Green</Badge>
            <Badge variant="emerald">Emerald</Badge>
            <Badge variant="teal">Teal</Badge>
            <Badge variant="cyan">Cyan</Badge>
            <Badge variant="sky">Sky</Badge>
            <Badge variant="indigo">Indigo</Badge>
            <Badge variant="violet">Violet</Badge>
            <Badge variant="purple">Purple</Badge>
            <Badge variant="fuchsia">Fuchsia</Badge>
            <Badge variant="pink">Pink</Badge>
            <Badge variant="rose">Rose</Badge>
          </Row>
          <SubHeading>Sizes</SubHeading>
          <Row>
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
          </Row>
          <SubHeading>Types</SubHeading>
          <Row>
            <Badge variant="neutral" type="pill">
              Neutral Pill
            </Badge>
            <Badge variant="neutral" type="rounded">
              Neutral Rounded
            </Badge>
            <Badge variant="brand" type="pill">
              Brand Pill
            </Badge>
            <Badge variant="brand" type="rounded">
              Brand Rounded
            </Badge>
          </Row>
          <SubHeading>Deprecated type</SubHeading>
          <Row>
            <Badge type="modern">Modern</Badge>
          </Row>
        </Section>

        <Section
          id="dot-icon"
          title="DotIcon"
          classes={[
            'tale-dot-icon',
            'tale-dot-icon--neutral',
            'tale-dot-icon--brand',
            'tale-dot-icon--error',
            'tale-dot-icon--warning',
            'tale-dot-icon--success',
            'tale-dot-icon--sm',
            'tale-dot-icon--md',
            'tale-dot-icon--lg',
          ]}
        >
          <SubHeading>Colors</SubHeading>
          <Row>
            <DotIcon color="neutral" />
            <DotIcon color="brand" />
            <DotIcon color="error" />
            <DotIcon color="warning" />
            <DotIcon color="success" />
          </Row>
          <SubHeading>Sizes</SubHeading>
          <Row>
            <DotIcon size="sm" />
            <DotIcon size="md" />
            <DotIcon size="lg" />
          </Row>
        </Section>

        <Section
          id="empty-state"
          title="EmptyState"
          classes={[
            'tale-empty-state',
            'tale-empty-state--sm',
            'tale-empty-state--lg',
            'tale-empty-state__icon',
            'tale-empty-state__title',
            'tale-empty-state__description',
            'tale-empty-state__actions',
          ]}
        >
          <SubHeading>Default (md)</SubHeading>
          <EmptyState.Root>
            <EmptyState.Title>No items</EmptyState.Title>
            <EmptyState.Description>Nothing here yet.</EmptyState.Description>
          </EmptyState.Root>
          <SubHeading>With Actions</SubHeading>
          <EmptyState.Root>
            <EmptyState.Title>No projects</EmptyState.Title>
            <EmptyState.Description>
              Get started by creating your first project.
            </EmptyState.Description>
            <EmptyState.Actions>
              <Button variant="primary" size="sm">
                Create project
              </Button>
            </EmptyState.Actions>
          </EmptyState.Root>
          <SubHeading>Small</SubHeading>
          <EmptyState.Root size="sm">
            <EmptyState.Title>No results</EmptyState.Title>
            <EmptyState.Description>Try adjusting your filters.</EmptyState.Description>
          </EmptyState.Root>
          <SubHeading>Large</SubHeading>
          <EmptyState.Root size="lg">
            <EmptyState.Title>Welcome</EmptyState.Title>
            <EmptyState.Description>Your dashboard is empty.</EmptyState.Description>
          </EmptyState.Root>
        </Section>

        <Section
          id="image"
          title="Image"
          classes={[
            'tale-image',
            'tale-image--sm',
            'tale-image--md',
            'tale-image--lg',
            'tale-image--full',
            'tale-image--contain',
            'tale-image--fill',
            'tale-image--none',
          ]}
        >
          <SubHeading>Default (cover)</SubHeading>
          <Image
            src="https://picsum.photos/seed/taleui/300/200"
            alt="Demo"
            width={300}
            height={200}
          />
          <SubHeading>Radius variants</SubHeading>
          <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
            <Image
              src="https://picsum.photos/seed/taleui/120/120"
              alt="none"
              radius="none"
              width={120}
              height={120}
            />
            <Image
              src="https://picsum.photos/seed/taleui/120/120"
              alt="sm"
              radius="sm"
              width={120}
              height={120}
            />
            <Image
              src="https://picsum.photos/seed/taleui/120/120"
              alt="md"
              radius="md"
              width={120}
              height={120}
            />
            <Image
              src="https://picsum.photos/seed/taleui/120/120"
              alt="lg"
              radius="lg"
              width={120}
              height={120}
            />
            <Image
              src="https://picsum.photos/seed/taleui/120/120"
              alt="full"
              radius="full"
              width={120}
              height={120}
            />
          </div>
        </Section>

        <Section
          id="list"
          title="List"
          classes={[
            'tale-list',
            'tale-list--divided',
            'tale-list--compact',
            'tale-list--spacious',
            'tale-list__item',
          ]}
        >
          <SubHeading>Plain</SubHeading>
          <List.Root style={{ maxWidth: '15rem' }}>
            <List.Item>First item</List.Item>
            <List.Item>Second item</List.Item>
            <List.Item>Third item</List.Item>
          </List.Root>
          <SubHeading>Divided</SubHeading>
          <List.Root variant="divided" style={{ maxWidth: '15rem' }}>
            <List.Item>Apple</List.Item>
            <List.Item>Banana</List.Item>
            <List.Item>Cherry</List.Item>
          </List.Root>
          <SubHeading>Compact</SubHeading>
          <List.Root variant="divided" density="compact" style={{ maxWidth: '15rem' }}>
            <List.Item>Compact one</List.Item>
            <List.Item>Compact two</List.Item>
            <List.Item>Compact three</List.Item>
          </List.Root>
          <SubHeading>Spacious</SubHeading>
          <List.Root variant="divided" density="spacious" style={{ maxWidth: '15rem' }}>
            <List.Item>Spacious one</List.Item>
            <List.Item>Spacious two</List.Item>
            <List.Item>Spacious three</List.Item>
          </List.Root>
        </Section>

        <Section
          id="list-box"
          title="ListBox"
          classes={[
            'tale-list-box',
            'tale-list-box__item',
            'tale-list-box__section',
            'tale-list-box__header',
            'tale-list-box__text',
            'tale-list-box__selection-indicator',
            'tale-list-box__load-more-item',
          ]}
        >
          <SubHeading>Single select</SubHeading>
          <ListBox.Root
            aria-label="Project status"
            selectionMode="single"
            className="audit__demo-medium"
          >
            <ListBox.Item id="todo" textValue="To do">
              To do
            </ListBox.Item>
            <ListBox.Item id="doing" textValue="In progress">
              In progress
            </ListBox.Item>
            <ListBox.Item id="done" textValue="Done">
              Done
            </ListBox.Item>
          </ListBox.Root>
          <SubHeading>With Sections</SubHeading>
          <ListBox.Root aria-label="Foods" selectionMode="single" className="audit__demo-medium">
            <ListBox.Section id="fruit">
              <ListBox.Header>Fruit</ListBox.Header>
              <ListBox.Item id="apple" textValue="Apple">
                Apple
              </ListBox.Item>
              <ListBox.Item id="banana" textValue="Banana">
                Banana
              </ListBox.Item>
            </ListBox.Section>
            <ListBox.Section id="vegetables">
              <ListBox.Header>Vegetables</ListBox.Header>
              <ListBox.Item id="carrot" textValue="Carrot">
                Carrot
              </ListBox.Item>
              <ListBox.Item id="broccoli" textValue="Broccoli">
                Broccoli
              </ListBox.Item>
            </ListBox.Section>
          </ListBox.Root>
          <SubHeading>Multiple select</SubHeading>
          <ListBox.Root
            aria-label="Channels"
            selectionMode="multiple"
            className="audit__demo-medium"
          >
            {['Email', 'SMS', 'Push'].map((item) => (
              <ListBox.Item key={item} id={item.toLowerCase()} textValue={item}>
                {item}
                <ListBox.SelectionIndicator />
              </ListBox.Item>
            ))}
          </ListBox.Root>
        </Section>

        <Section
          id="key-value-pairs"
          title="KeyValuePairs"
          classes={[
            'tale-key-value-pairs',
            'tale-key-value-pairs--divided',
            'tale-key-value-pairs--compact',
            'tale-key-value-pairs--spacious',
            'tale-key-value-pairs__item',
            'tale-key-value-pairs__term',
            'tale-key-value-pairs__details',
            'tale-key-value-pairs__info',
            'tale-key-value-pairs__group',
            'tale-key-value-pairs__group-title',
            'tale-key-value-pairs__group-details',
            'tale-key-value-pairs__group-list',
          ]}
        >
          <SubHeading>Plain</SubHeading>
          <KeyValuePairs.Root aria-label="Service metadata" style={{ maxWidth: '17.5rem' }}>
            <KeyValuePairs.Item>
              <KeyValuePairs.Term>Status</KeyValuePairs.Term>
              <KeyValuePairs.Details>
                <Badge variant="success">Active</Badge>
              </KeyValuePairs.Details>
            </KeyValuePairs.Item>
            <KeyValuePairs.Item>
              <KeyValuePairs.Term>Owner</KeyValuePairs.Term>
              <KeyValuePairs.Details>Platform Team</KeyValuePairs.Details>
            </KeyValuePairs.Item>
          </KeyValuePairs.Root>
          <SubHeading>Divided responsive columns</SubHeading>
          <KeyValuePairs.Root
            aria-label="Production API metadata"
            columns={3}
            minColumnWidth={180}
            variant="divided"
            density="compact"
            style={{ maxWidth: '27.5rem' }}
          >
            <KeyValuePairs.Item>
              <KeyValuePairs.Term>
                Region
                <KeyValuePairs.Info>primary</KeyValuePairs.Info>
              </KeyValuePairs.Term>
              <KeyValuePairs.Details>us-east-1</KeyValuePairs.Details>
            </KeyValuePairs.Item>
            <KeyValuePairs.Item>
              <KeyValuePairs.Term>Endpoint</KeyValuePairs.Term>
              <KeyValuePairs.Details>
                <Link href="https://api.example.com">api.example.com</Link>
              </KeyValuePairs.Details>
            </KeyValuePairs.Item>
            <KeyValuePairs.Item>
              <KeyValuePairs.Term>Last deployment</KeyValuePairs.Term>
              <KeyValuePairs.Details>June 17, 2026</KeyValuePairs.Details>
            </KeyValuePairs.Item>
          </KeyValuePairs.Root>
          <SubHeading>Grouped</SubHeading>
          <KeyValuePairs.Root
            aria-label="Infrastructure summary"
            columns={2}
            density="spacious"
            style={{ maxWidth: '27.5rem' }}
          >
            <KeyValuePairs.Group>
              <KeyValuePairs.GroupTitle>Network</KeyValuePairs.GroupTitle>
              <KeyValuePairs.GroupList>
                <KeyValuePairs.Item>
                  <KeyValuePairs.Term>VPC</KeyValuePairs.Term>
                  <KeyValuePairs.Details>vpc-1234</KeyValuePairs.Details>
                </KeyValuePairs.Item>
                <KeyValuePairs.Item>
                  <KeyValuePairs.Term>Subnet</KeyValuePairs.Term>
                  <KeyValuePairs.Details>subnet-5678</KeyValuePairs.Details>
                </KeyValuePairs.Item>
              </KeyValuePairs.GroupList>
            </KeyValuePairs.Group>
            <KeyValuePairs.Group>
              <KeyValuePairs.GroupTitle>Runtime</KeyValuePairs.GroupTitle>
              <KeyValuePairs.GroupList>
                <KeyValuePairs.Item>
                  <KeyValuePairs.Term>Language</KeyValuePairs.Term>
                  <KeyValuePairs.Details>Node.js</KeyValuePairs.Details>
                </KeyValuePairs.Item>
                <KeyValuePairs.Item>
                  <KeyValuePairs.Term>Instances</KeyValuePairs.Term>
                  <KeyValuePairs.Details>4</KeyValuePairs.Details>
                </KeyValuePairs.Item>
              </KeyValuePairs.GroupList>
            </KeyValuePairs.Group>
          </KeyValuePairs.Root>
        </Section>

        <Section
          id="qr-code"
          title="QRCode"
          classes={[
            'tale-qr-code',
            'tale-qr-code--md',
            'tale-qr-code--lg',
            'tale-qr-code__canvas',
            'tale-qr-code__handle',
            'tale-qr-code__handle--tl',
            'tale-qr-code__handle--tr',
            'tale-qr-code__handle--br',
            'tale-qr-code__handle--bl',
            'tale-qr-code-scan',
          ]}
        >
          <SubHeading>Sizes</SubHeading>
          <LayoutRow gap="l">
            <div>
              <p
                style={{
                  marginBottom: '0.25rem',
                  fontSize: 'var(--label-s-font-size)',
                  color: 'var(--neutral-60)',
                }}
              >
                md
              </p>
              <QRCode.Root value="https://example.com" size="md" />
            </div>
            <div>
              <p
                style={{
                  marginBottom: '0.25rem',
                  fontSize: 'var(--label-s-font-size)',
                  color: 'var(--neutral-60)',
                }}
              >
                lg
              </p>
              <QRCode.Root value="https://example.com" size="lg" />
            </div>
          </LayoutRow>
          <SubHeading>With Scan Overlay</SubHeading>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <QRCode.Root value="https://example.com" size="lg" />
            <QRCode.Scan />
          </div>
        </Section>

        <Section
          id="video-player"
          title="VideoPlayer"
          classes={[
            'tale-video-player',
            'tale-video-player--sm',
            'tale-video-player--md',
            'tale-video-player--lg',
            'tale-video-player__video',
            'tale-video-player__thumbnail',
            'tale-video-player__thumbnail--visible',
            'tale-video-player__thumbnail-img',
            'tale-video-player__thumbnail-play',
            'tale-video-player__controls',
            'tale-video-player__controls--visible',
            'tale-video-player__btn',
            'tale-video-player__btn-icon',
            'tale-video-player__progress-area',
            'tale-video-player__progress',
            'tale-video-player__progress-fill',
            'tale-video-player__progress-buffered',
            'tale-video-player__progress-thumb',
            'tale-video-player__time',
            'tale-video-player__volume',
            'tale-video-player__volume-slider',
          ]}
        >
          <SubHeading>Sizes</SubHeading>
          <Column gap="l" style={{ maxWidth: 640 }}>
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <div key={size}>
                <p
                  style={{
                    marginBottom: '0.25rem',
                    fontSize: 'var(--label-s-font-size)',
                    color: 'var(--neutral-60)',
                  }}
                >
                  {size}
                </p>
                <VideoPlayer.Root
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  size={size}
                  thumbnailUrl="https://placehold.co/640x360/1e293b/ffffff?text=▶+Play"
                  thumbnailAlt="Play video"
                />
              </div>
            ))}
          </Column>
        </Section>

        {/* ============================================================= */}
        {/* FORM STRUCTURE */}
        {/* ============================================================= */}

        <Section
          id="field"
          title="Field"
          classes={[
            'tale-field',
            'tale-field__label',
            'tale-field__control',
            'tale-field__description',
            'tale-field__error',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <div className="audit__demo-medium">
            <Field.Root>
              <Field.Label>Label</Field.Label>
              <Field.Control>
                <Input.Input placeholder="Type here…" />
              </Field.Control>
            </Field.Root>
          </div>
          <SubHeading>With Description</SubHeading>
          <div className="audit__demo-medium">
            <Field.Root>
              <Field.Label>Email</Field.Label>
              <Field.Control>
                <Input.Input placeholder="you@example.com" />
              </Field.Control>
              <Field.Description>We will never share your email.</Field.Description>
            </Field.Root>
          </div>
          <SubHeading>With Error</SubHeading>
          <div className="audit__demo-medium">
            <Input.Root isInvalid>
              <Input.Label>Password</Input.Label>
              <Input.Input type="password" defaultValue="123" />
              <Input.ErrorMessage>Password must be at least 8 characters.</Input.ErrorMessage>
            </Input.Root>
          </div>
          <SubHeading>Disabled</SubHeading>
          <div className="audit__demo-medium">
            <Field.Root data-disabled>
              <Field.Label>Disabled</Field.Label>
              <Field.Control>
                <Input.Input disabled placeholder="Cannot edit" />
              </Field.Control>
              <Field.Description>This field is disabled.</Field.Description>
            </Field.Root>
          </div>
        </Section>

        <Section
          id="fieldset"
          title="Fieldset"
          classes={['tale-fieldset', 'tale-fieldset__legend']}
        >
          <SubHeading>Default</SubHeading>
          <Fieldset.Root>
            <Fieldset.Legend>Personal Information</Fieldset.Legend>
            <div className="audit__fieldset-content">
              <Field.Root>
                <Field.Label>First name</Field.Label>
                <Input.Input placeholder="John" />
              </Field.Root>
              <Field.Root>
                <Field.Label>Last name</Field.Label>
                <Input.Input placeholder="Doe" />
              </Field.Root>
            </div>
          </Fieldset.Root>
          <SubHeading>Disabled</SubHeading>
          <Fieldset.Root data-disabled>
            <Fieldset.Legend>Billing Address</Fieldset.Legend>
            <div className="audit__fieldset-content">
              <Field.Root data-disabled>
                <Field.Label>Street</Field.Label>
                <Input.Input placeholder="123 Main St" disabled />
              </Field.Root>
              <Field.Root data-disabled>
                <Field.Label>City</Field.Label>
                <Input.Input placeholder="Springfield" disabled />
              </Field.Root>
            </div>
          </Fieldset.Root>
        </Section>

        <Section id="form" title="Form" classes={['tale-form']}>
          <SubHeading>Default</SubHeading>
          <Form className="audit__demo-medium display--flex flex--col gap--xs">
            <Field.Root>
              <Field.Label>Email</Field.Label>
              <Input.Input type="email" placeholder="you@example.com" />
            </Field.Root>
            <Field.Root>
              <Field.Label>Password</Field.Label>
              <Input.Input type="password" placeholder="Enter password" />
            </Field.Root>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
          <SubHeading>With Validation</SubHeading>
          <Form className="audit__demo-medium display--flex flex--col gap--xs">
            <Field.Root>
              <Field.Label>Full name</Field.Label>
              <Input.Input placeholder="Jane Doe" required />
              <Field.Description>Required field.</Field.Description>
            </Field.Root>
            <Field.Root>
              <Field.Label>Password</Field.Label>
              <Input.Input type="password" placeholder="Min 8 characters" minLength={8} required />
            </Field.Root>
            <Button variant="primary" type="submit">
              Create Account
            </Button>
          </Form>
        </Section>

        {/* ============================================================= */}
        {/* ADDITIONAL FORM CONTROLS                                       */}
        {/* ============================================================= */}

        <Section id="radio-group" title="RadioGroup" classes={['tale-radio']}>
          <SubHeading>Standalone RadioGroup</SubHeading>
          <RadioGroup aria-label="Favourite colour" className="display--flex flex--col gap--3xs">
            {['Red', 'Green', 'Blue'].map((c) => (
              <Radio.Root key={c} value={c.toLowerCase()}>
                <Radio.Indicator />
                {c}
              </Radio.Root>
            ))}
          </RadioGroup>
        </Section>

        <Section
          id="search-field"
          title="SearchField"
          classes={[
            'tale-search-field',
            'tale-search-field--inline',
            'tale-search-field__input',
            'tale-search-field__clear',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <div className="audit__demo-narrow display--flex flex--col gap--2xs">
            <SearchField.Root>
              <SearchField.Label>Search</SearchField.Label>
              <SearchField.Input placeholder="Search…" />
              <SearchField.ClearButton>
                <Icon icon={XLucide} size="sm" />
              </SearchField.ClearButton>
            </SearchField.Root>
          </div>
          <SubHeading>Inline</SubHeading>
          <div className="audit__demo-narrow">
            <SearchField.Root variant="inline" defaultValue="Keyboard">
              <SearchField.Label>Search docs</SearchField.Label>
              <SearchField.Input placeholder="Search..." />
              <SearchField.ClearButton>
                <Icon icon={XLucide} size="sm" />
              </SearchField.ClearButton>
            </SearchField.Root>
          </div>
          <SubHeading>Disabled</SubHeading>
          <div className="audit__demo-narrow">
            <SearchField.Root isDisabled>
              <SearchField.Input placeholder="Disabled search" />
            </SearchField.Root>
          </div>
        </Section>

        <Section id="text-field" title="TextField" classes={['tale-text-field__input']}>
          <SubHeading>Default</SubHeading>
          <div className="audit__demo-narrow display--flex flex--col gap--2xs">
            <TextField.Root>
              <TextField.Label>Name</TextField.Label>
              <TextField.Input placeholder="Enter name…" />
              <TextField.Description>Your full name.</TextField.Description>
            </TextField.Root>
            <TextField.Root isDisabled>
              <TextField.Label>Disabled</TextField.Label>
              <TextField.Input placeholder="Cannot edit" />
            </TextField.Root>
          </div>
        </Section>

        <Section
          id="text-area"
          title="TextArea"
          classes={['tale-text-area', 'tale-text-area__textarea']}
        >
          <SubHeading>Default</SubHeading>
          <div className="audit__demo-narrow display--flex flex--col gap--2xs">
            <TextArea.Root>
              <TextArea.Label>Bio</TextArea.Label>
              <TextArea.TextArea placeholder="Tell us about yourself…" />
              <TextArea.Description>Max 200 characters.</TextArea.Description>
            </TextArea.Root>
            <TextArea.Root isDisabled>
              <TextArea.Label>Disabled</TextArea.Label>
              <TextArea.TextArea placeholder="Cannot edit" />
            </TextArea.Root>
          </div>
        </Section>

        <Section
          id="select-native"
          title="SelectNative"
          classes={[
            'tale-select-native',
            'tale-select-native--sm',
            'tale-select-native--md',
            'tale-select-native--lg',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <div className="audit__demo-narrow display--flex flex--col gap--2xs">
            <SelectNative>
              <option value="">Select an option</option>
              <option value="a">Option A</option>
              <option value="b">Option B</option>
              <option value="c">Option C</option>
            </SelectNative>
          </div>
          <SubHeading>Sizes</SubHeading>
          <div className="audit__demo-narrow display--flex flex--col gap--2xs">
            <SelectNative size="sm">
              <option>Small</option>
            </SelectNative>
            <SelectNative size="md">
              <option>Medium</option>
            </SelectNative>
          </div>
          <SubHeading>Disabled</SubHeading>
          <div className="audit__demo-narrow">
            <SelectNative disabled>
              <option>Disabled</option>
            </SelectNative>
          </div>
        </Section>

        <Section
          id="grid-list"
          title="GridList"
          classes={['tale-grid-list', 'tale-grid-list__item']}
        >
          <SubHeading>Default</SubHeading>
          <GridList.Root aria-label="Items" className="audit__demo-medium">
            {['Item One', 'Item Two', 'Item Three', 'Item Four'].map((item) => (
              <GridList.Item key={item} id={item} textValue={item}>
                {item}
              </GridList.Item>
            ))}
          </GridList.Root>
          <SubHeading>With Selection</SubHeading>
          <GridList.Root
            aria-label="Selectable items"
            selectionMode="multiple"
            className="audit__demo-medium"
          >
            {['Design tokens', 'Components', 'Documentation', 'Testing'].map((item) => (
              <GridList.Item key={item} id={item} textValue={item}>
                {item}
              </GridList.Item>
            ))}
          </GridList.Root>
          <SubHeading>With Icons</SubHeading>
          <GridList.Root
            aria-label="Items with icons"
            selectionMode="single"
            className="audit__demo-medium"
          >
            {(
              [
                ['Favorites', Star],
                ['Liked', Heart],
                ['Alerts', Bell],
                ['Settings', Settings],
              ] as const
            ).map(([label, icon]) => (
              <GridList.Item key={label} id={label} textValue={label}>
                <Icon icon={icon} size="sm" />
                {label}
              </GridList.Item>
            ))}
          </GridList.Root>
        </Section>

        <Section
          id="table"
          title="Table"
          classes={[
            'tale-table',
            'tale-table__header',
            'tale-table__footer',
            'tale-table__column',
            'tale-table__body',
            'tale-table__row',
            'tale-table__cell',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <Table.Root aria-label="People" className="audit__demo-extra-wide">
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Role</Table.Column>
              <Table.Column>Status</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="alice-default">
                <Table.Cell>Alice</Table.Cell>
                <Table.Cell>Engineer</Table.Cell>
                <Table.Cell>Active</Table.Cell>
              </Table.Row>
              <Table.Row id="bob-default">
                <Table.Cell>Bob</Table.Cell>
                <Table.Cell>Designer</Table.Cell>
                <Table.Cell>Away</Table.Cell>
              </Table.Row>
              <Table.Row id="charlie-default">
                <Table.Cell>Charlie</Table.Cell>
                <Table.Cell>Manager</Table.Cell>
                <Table.Cell>Active</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
          <SubHeading>With Footer</SubHeading>
          <Table.Root aria-label="People with totals" className="audit__demo-extra-wide">
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Role</Table.Column>
              <Table.Column>Status</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="alice-footer">
                <Table.Cell>Alice</Table.Cell>
                <Table.Cell>Engineer</Table.Cell>
                <Table.Cell>Active</Table.Cell>
              </Table.Row>
              <Table.Row id="bob-footer">
                <Table.Cell>Bob</Table.Cell>
                <Table.Cell>Designer</Table.Cell>
                <Table.Cell>Away</Table.Cell>
              </Table.Row>
              <Table.Row id="charlie-footer">
                <Table.Cell>Charlie</Table.Cell>
                <Table.Cell>Manager</Table.Cell>
                <Table.Cell>Active</Table.Cell>
              </Table.Row>
            </Table.Body>
            <Table.Footer>
              <Table.Row id="people-total">
                <Table.Cell>Total</Table.Cell>
                <Table.Cell>3 roles</Table.Cell>
                <Table.Cell>2 active</Table.Cell>
              </Table.Row>
            </Table.Footer>
          </Table.Root>
          <SubHeading>With Selection</SubHeading>
          <Table.Root
            aria-label="Selectable people"
            selectionMode="multiple"
            className="audit__demo-extra-wide"
          >
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Role</Table.Column>
              <Table.Column>Status</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="alice">
                <Table.Cell>Alice</Table.Cell>
                <Table.Cell>Engineer</Table.Cell>
                <Table.Cell>Active</Table.Cell>
              </Table.Row>
              <Table.Row id="bob">
                <Table.Cell>Bob</Table.Cell>
                <Table.Cell>Designer</Table.Cell>
                <Table.Cell>Away</Table.Cell>
              </Table.Row>
              <Table.Row id="charlie">
                <Table.Cell>Charlie</Table.Cell>
                <Table.Cell>Manager</Table.Cell>
                <Table.Cell>Active</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
          <SubHeading>With Sorting</SubHeading>
          <SortableTableDemo />
        </Section>

        <Section
          id="featured-icon"
          title="FeaturedIcon"
          classes={[
            'tale-featured-icon',
            'tale-featured-icon--brand',
            'tale-featured-icon--error',
            'tale-featured-icon--warning',
            'tale-featured-icon--success',
            'tale-featured-icon--neutral',
            'tale-featured-icon--square',
            'tale-featured-icon--sm',
            'tale-featured-icon--md',
            'tale-featured-icon--lg',
            'tale-featured-icon--xl',
            'tale-featured-icon--gradient',
            'tale-featured-icon--dark',
            'tale-featured-icon--outline',
            'tale-featured-icon--modern',
            'tale-featured-icon--modern-neue',
          ]}
        >
          <SubHeading>Variants</SubHeading>
          <Row>
            <FeaturedIcon variant="brand">
              <Icon icon={Star} />
            </FeaturedIcon>
            <FeaturedIcon variant="error">
              <Icon icon={AlertCircle} />
            </FeaturedIcon>
            <FeaturedIcon variant="warning">
              <Icon icon={AlertCircle} />
            </FeaturedIcon>
            <FeaturedIcon variant="success">
              <Icon icon={CheckCircle} />
            </FeaturedIcon>
            <FeaturedIcon variant="neutral">
              <Icon icon={Info} />
            </FeaturedIcon>
          </Row>
          <SubHeading>Square shape</SubHeading>
          <Row>
            <FeaturedIcon variant="brand" shape="square">
              <Icon icon={Star} />
            </FeaturedIcon>
            <FeaturedIcon variant="error" shape="square">
              <Icon icon={AlertCircle} />
            </FeaturedIcon>
          </Row>
          <SubHeading>Sizes</SubHeading>
          <Row>
            <FeaturedIcon size="sm">
              <Icon icon={Star} />
            </FeaturedIcon>
            <FeaturedIcon size="md">
              <Icon icon={Star} />
            </FeaturedIcon>
            <FeaturedIcon size="lg">
              <Icon icon={Star} />
            </FeaturedIcon>
            <FeaturedIcon size="xl">
              <Icon icon={Star} />
            </FeaturedIcon>
          </Row>
          <SubHeading>Themes</SubHeading>
          <Row>
            <FeaturedIcon variant="brand" theme="light">
              <Icon icon={Star} />
            </FeaturedIcon>
            <FeaturedIcon variant="brand" theme="gradient">
              <Icon icon={Star} />
            </FeaturedIcon>
            <FeaturedIcon variant="brand" theme="dark">
              <Icon icon={Star} />
            </FeaturedIcon>
            <FeaturedIcon variant="brand" theme="outline">
              <Icon icon={Star} />
            </FeaturedIcon>
            <FeaturedIcon variant="brand" theme="modern">
              <Icon icon={Star} />
            </FeaturedIcon>
            <FeaturedIcon variant="brand" theme="modern-neue">
              <Icon icon={Star} />
            </FeaturedIcon>
          </Row>
          <SubHeading>Themes × Error</SubHeading>
          <Row>
            <FeaturedIcon variant="error" theme="light">
              <Icon icon={AlertCircle} />
            </FeaturedIcon>
            <FeaturedIcon variant="error" theme="gradient">
              <Icon icon={AlertCircle} />
            </FeaturedIcon>
            <FeaturedIcon variant="error" theme="dark">
              <Icon icon={AlertCircle} />
            </FeaturedIcon>
            <FeaturedIcon variant="error" theme="outline">
              <Icon icon={AlertCircle} />
            </FeaturedIcon>
            <FeaturedIcon variant="error" theme="modern">
              <Icon icon={AlertCircle} />
            </FeaturedIcon>
            <FeaturedIcon variant="error" theme="modern-neue">
              <Icon icon={AlertCircle} />
            </FeaturedIcon>
          </Row>
        </Section>

        <Section
          id="rating-badge"
          title="RatingBadge"
          classes={[
            'tale-rating-badge',
            'tale-rating-badge--sm',
            'tale-rating-badge--md',
            'tale-rating-badge--lg',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <Row>
            <RatingBadge value={4.5} />
            <RatingBadge value={3.8} />
            <RatingBadge value={5.0} />
          </Row>
          <SubHeading>Sizes</SubHeading>
          <Row>
            <RatingBadge value={4.5} size="sm" />
            <RatingBadge value={4.5} size="md" />
            <RatingBadge value={4.5} size="lg" />
          </Row>
        </Section>

        <Section
          id="rating-stars"
          title="RatingStars"
          classes={[
            'tale-rating-stars',
            'tale-rating-stars__star',
            'tale-rating-stars__star--filled',
            'tale-rating-stars__star--half',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <Row>
            <RatingStars value={3} />
            <RatingStars value={3.5} />
            <RatingStars value={5} />
          </Row>
          <SubHeading>Sizes</SubHeading>
          <Row>
            <RatingStars value={4} size="sm" />
            <RatingStars value={4} size="md" />
            <RatingStars value={4} size="lg" />
          </Row>
        </Section>

        <Section
          id="tag-group"
          title="TagGroup"
          classes={[
            'tale-tag-group',
            'tale-tag-group__list',
            'tale-tag-group__tag',
            'tale-tag-group__label',
            'tale-tag-group__description',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <TagGroup.Root>
            <TagGroup.Label>Categories</TagGroup.Label>
            <TagGroup.List>
              <TagGroup.Tag id="react">React</TagGroup.Tag>
              <TagGroup.Tag id="css">CSS</TagGroup.Tag>
              <TagGroup.Tag id="design">Design</TagGroup.Tag>
              <TagGroup.Tag id="a11y">Accessibility</TagGroup.Tag>
            </TagGroup.List>
          </TagGroup.Root>
          <SubHeading>With Description</SubHeading>
          <TagGroup.Root>
            <TagGroup.Label>Interests</TagGroup.Label>
            <TagGroup.Description>Select your areas of interest.</TagGroup.Description>
            <TagGroup.List>
              <TagGroup.Tag id="frontend">Frontend</TagGroup.Tag>
              <TagGroup.Tag id="backend">Backend</TagGroup.Tag>
              <TagGroup.Tag id="devops">DevOps</TagGroup.Tag>
            </TagGroup.List>
          </TagGroup.Root>
          <SubHeading>Removable</SubHeading>
          <TagGroup.Root onRemove={() => {}}>
            <TagGroup.Label>Skills</TagGroup.Label>
            <TagGroup.List>
              <TagGroup.Tag id="ts">TypeScript</TagGroup.Tag>
              <TagGroup.Tag id="node">Node.js</TagGroup.Tag>
              <TagGroup.Tag id="gql">GraphQL</TagGroup.Tag>
            </TagGroup.List>
          </TagGroup.Root>
          <SubHeading>With Selection</SubHeading>
          <TagGroup.Root selectionMode="multiple" defaultSelectedKeys={['rust']}>
            <TagGroup.Label>Languages</TagGroup.Label>
            <TagGroup.List>
              <TagGroup.Tag id="ts2">TypeScript</TagGroup.Tag>
              <TagGroup.Tag id="rust">Rust</TagGroup.Tag>
              <TagGroup.Tag id="python">Python</TagGroup.Tag>
              <TagGroup.Tag id="go">Go</TagGroup.Tag>
            </TagGroup.List>
          </TagGroup.Root>
        </Section>

        <Section
          id="tree"
          title="Tree"
          classes={['tale-tree', 'tale-tree__item', 'tale-tree__item-content']}
        >
          <SubHeading>Default</SubHeading>
          <Tree.Root aria-label="File browser" className="audit__demo-medium">
            <Tree.Item id="src" textValue="src">
              <Tree.ItemContent>src/</Tree.ItemContent>
              <Tree.Item id="components" textValue="components">
                <Tree.ItemContent>components/</Tree.ItemContent>
                <Tree.Item id="button" textValue="Button.tsx">
                  <Tree.ItemContent>Button.tsx</Tree.ItemContent>
                </Tree.Item>
                <Tree.Item id="input" textValue="Input.tsx">
                  <Tree.ItemContent>Input.tsx</Tree.ItemContent>
                </Tree.Item>
              </Tree.Item>
              <Tree.Item id="utils" textValue="utils">
                <Tree.ItemContent>utils/</Tree.ItemContent>
                <Tree.Item id="helpers" textValue="helpers.ts">
                  <Tree.ItemContent>helpers.ts</Tree.ItemContent>
                </Tree.Item>
              </Tree.Item>
            </Tree.Item>
          </Tree.Root>
          <SubHeading>With Expanded</SubHeading>
          <Tree.Root
            aria-label="Documents"
            defaultExpandedKeys={['docs', 'guides']}
            className="audit__demo-medium"
          >
            <Tree.Item id="docs" textValue="docs">
              <Tree.ItemContent>docs/</Tree.ItemContent>
              <Tree.Item id="guides" textValue="guides">
                <Tree.ItemContent>guides/</Tree.ItemContent>
                <Tree.Item id="getting-started" textValue="getting-started.md">
                  <Tree.ItemContent>getting-started.md</Tree.ItemContent>
                </Tree.Item>
                <Tree.Item id="advanced" textValue="advanced.md">
                  <Tree.ItemContent>advanced.md</Tree.ItemContent>
                </Tree.Item>
              </Tree.Item>
              <Tree.Item id="api" textValue="api">
                <Tree.ItemContent>api/</Tree.ItemContent>
                <Tree.Item id="ref" textValue="reference.md">
                  <Tree.ItemContent>reference.md</Tree.ItemContent>
                </Tree.Item>
              </Tree.Item>
            </Tree.Item>
          </Tree.Root>
        </Section>

        {/* ============================================================= */}
        {/* DATE & TIME                                                    */}
        {/* ============================================================= */}

        <Section id="date-field" title="DateField" classes={['tale-date-field']}>
          <SubHeading>Default</SubHeading>
          <div className="audit__demo-narrow display--flex flex--col gap--2xs">
            <DateField.Root>
              <DateField.Label>Date</DateField.Label>
              <DateField.DateInput>
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.DateInput>
            </DateField.Root>
            <DateField.Root isDisabled>
              <DateField.Label>Disabled</DateField.Label>
              <DateField.DateInput>
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.DateInput>
            </DateField.Root>
          </div>
        </Section>

        <Section id="time-field" title="TimeField" classes={['tale-time-field']}>
          <SubHeading>Default</SubHeading>
          <div className="audit__demo-narrow display--flex flex--col gap--2xs">
            <TimeField.Root>
              <TimeField.Label>Time</TimeField.Label>
              <TimeField.DateInput>
                {(segment) => <TimeField.Segment segment={segment} />}
              </TimeField.DateInput>
            </TimeField.Root>
            <TimeField.Root isDisabled>
              <TimeField.Label>Disabled</TimeField.Label>
              <TimeField.DateInput>
                {(segment) => <TimeField.Segment segment={segment} />}
              </TimeField.DateInput>
            </TimeField.Root>
          </div>
        </Section>

        <Section id="date-picker" title="DatePicker" classes={['tale-date-picker']}>
          <SubHeading>Default</SubHeading>
          <div className="audit__demo-narrow">
            <DatePicker.Root>
              <DatePicker.Label>Date</DatePicker.Label>
              <DatePicker.Group>
                <DatePicker.DateInput>
                  {(segment) => <DatePicker.Segment segment={segment} />}
                </DatePicker.DateInput>
                <DatePicker.Trigger />
              </DatePicker.Group>
              <DatePicker.Popover>
                <DatePicker.Dialog>
                  <Calendar.Root>
                    <Calendar.Header>
                      <Calendar.PreviousButton />
                      <Calendar.Heading />
                      <Calendar.NextButton />
                    </Calendar.Header>
                    <Calendar.Grid>
                      <Calendar.GridHeader>
                        {(day) => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
                      </Calendar.GridHeader>
                      <Calendar.GridBody>
                        {(date) => <Calendar.Cell date={date} />}
                      </Calendar.GridBody>
                    </Calendar.Grid>
                  </Calendar.Root>
                </DatePicker.Dialog>
              </DatePicker.Popover>
            </DatePicker.Root>
          </div>
        </Section>

        <Section
          id="date-range-picker"
          title="DateRangePicker"
          classes={['tale-date-range-picker']}
        >
          <SubHeading>Default</SubHeading>
          <div className="audit__demo-wide">
            <DateRangePicker.Root>
              <DateRangePicker.Label>Trip dates</DateRangePicker.Label>
              <DateRangePicker.Group>
                <DateRangePicker.StartDate>
                  {(segment) => <DateRangePicker.Segment segment={segment} />}
                </DateRangePicker.StartDate>
                <span aria-hidden="true" className="audit__date-separator">
                  –
                </span>
                <DateRangePicker.EndDate>
                  {(segment) => <DateRangePicker.Segment segment={segment} />}
                </DateRangePicker.EndDate>
                <DateRangePicker.Trigger />
              </DateRangePicker.Group>
              <DateRangePicker.Popover>
                <DateRangePicker.Dialog>
                  <RangeCalendar.Root>
                    <RangeCalendar.Header>
                      <RangeCalendar.PreviousButton />
                      <RangeCalendar.Heading />
                      <RangeCalendar.NextButton />
                    </RangeCalendar.Header>
                    <RangeCalendar.Grid>
                      <RangeCalendar.GridHeader>
                        {(day) => (
                          <RangeCalendar.GridHeaderCell>{day}</RangeCalendar.GridHeaderCell>
                        )}
                      </RangeCalendar.GridHeader>
                      <RangeCalendar.GridBody>
                        {(date) => <RangeCalendar.Cell date={date} />}
                      </RangeCalendar.GridBody>
                    </RangeCalendar.Grid>
                  </RangeCalendar.Root>
                </DateRangePicker.Dialog>
              </DateRangePicker.Popover>
            </DateRangePicker.Root>
          </div>
        </Section>

        <Section
          id="range-calendar"
          title="RangeCalendar"
          classes={[
            'tale-range-calendar__header',
            'tale-range-calendar__heading',
            'tale-range-calendar__grid',
            'tale-range-calendar__grid-header',
            'tale-range-calendar__grid-body',
            'tale-range-calendar__cell',
          ]}
        >
          <SubHeading>Interactive</SubHeading>
          <RangeCalendar.Root>
            <RangeCalendar.Header>
              <RangeCalendar.PreviousButton />
              <RangeCalendar.Heading />
              <RangeCalendar.NextButton />
            </RangeCalendar.Header>
            <RangeCalendar.Grid>
              <RangeCalendar.GridHeader>
                {(day) => <RangeCalendar.GridHeaderCell>{day}</RangeCalendar.GridHeaderCell>}
              </RangeCalendar.GridHeader>
              <RangeCalendar.GridBody>
                {(date) => <RangeCalendar.Cell date={date} />}
              </RangeCalendar.GridBody>
            </RangeCalendar.Grid>
          </RangeCalendar.Root>
        </Section>

        <Section id="timestamp" title="Timestamp" classes={['tale-timestamp']}>
          <SubHeading>Absolute and relative</SubHeading>
          <LayoutRow gap="m">
            <Timestamp
              value="2026-07-27T04:30:00Z"
              locale="en-AU"
              timeZone="Australia/Melbourne"
              format="datetime"
            />
            <Timestamp
              value="2026-07-27T04:35:00Z"
              locale="en-AU"
              timeZone="Australia/Melbourne"
              format="relative"
              now="2026-07-27T04:30:00Z"
              refreshInterval={0}
            />
          </LayoutRow>
        </Section>

        {/* ============================================================= */}
        {/* COLOR                                                          */}
        {/* ============================================================= */}

        <Section id="color-area" title="ColorArea" classes={['tale-color-area']}>
          <SubHeading>Default</SubHeading>
          <ColorArea.Root defaultValue="hsl(0, 100%, 50%)" className="audit__color-area">
            <ColorArea.Thumb />
          </ColorArea.Root>
        </Section>

        <Section
          id="color-slider"
          title="ColorSlider"
          classes={[
            'tale-color-slider',
            'tale-color-slider__label',
            'tale-color-slider__output',
            'tale-color-slider__track',
            'tale-color-slider__thumb',
          ]}
        >
          <SubHeading>Hue</SubHeading>
          <div className="audit__demo-narrow">
            <ColorSlider.Root channel="hue" defaultValue="hsl(0, 100%, 50%)">
              <ColorSlider.Label />
              <ColorSlider.Track>
                <ColorSlider.Thumb />
              </ColorSlider.Track>
              <ColorSlider.Output />
            </ColorSlider.Root>
          </div>
        </Section>

        <Section
          id="color-wheel"
          title="ColorWheel"
          classes={['tale-color-wheel', 'tale-color-wheel__track']}
        >
          <SubHeading>Default</SubHeading>
          <ColorWheel.Root defaultValue="hsl(0, 100%, 50%)" outerRadius={100} innerRadius={70}>
            <ColorWheel.Track />
            <ColorWheel.Thumb />
          </ColorWheel.Root>
        </Section>

        <Section
          id="color-swatch"
          title="ColorSwatch"
          classes={[
            'tale-color-swatch',
            'tale-color-swatch--square',
            'tale-color-swatch--circle',
            'tale-color-swatch--split',
          ]}
        >
          <SubHeading>Default (square)</SubHeading>
          <Row>
            {['#ff0000', '#00ff00', '#0000ff', '#ff8800', '#8800ff'].map((color) => (
              <ColorSwatch key={color} color={color} />
            ))}
          </Row>
          <SubHeading>Circle shape</SubHeading>
          <Row>
            {['#ff0000', '#00ff00', '#0000ff', '#ff8800', '#8800ff'].map((color) => (
              <ColorSwatch key={color} color={color} shape="circle" />
            ))}
          </Row>
          <SubHeading>Diagonal split (brand + neutral)</SubHeading>
          <Row>
            {[
              { brand: '#ff0000', neutral: '#fef2f2' },
              { brand: '#ff8800', neutral: '#fff7ed' },
              { brand: '#00ff00', neutral: '#f0fdf4' },
              { brand: '#0088ff', neutral: '#eff6ff' },
              { brand: '#8800ff', neutral: '#faf5ff' },
            ].map(({ brand, neutral }) => (
              <ColorSwatch key={brand} color={brand} secondaryColor={neutral} />
            ))}
          </Row>
          <SubHeading>Diagonal split (circle)</SubHeading>
          <Row>
            {[
              { brand: '#ff0000', neutral: '#fef2f2' },
              { brand: '#ff8800', neutral: '#fff7ed' },
              { brand: '#00ff00', neutral: '#f0fdf4' },
              { brand: '#0088ff', neutral: '#eff6ff' },
              { brand: '#8800ff', neutral: '#faf5ff' },
            ].map(({ brand, neutral }) => (
              <ColorSwatch key={brand} color={brand} shape="circle" secondaryColor={neutral} />
            ))}
          </Row>
        </Section>

        <Section
          id="color-swatch-picker"
          title="ColorSwatchPicker"
          classes={[
            'tale-color-swatch-picker',
            'tale-color-swatch-picker--square',
            'tale-color-swatch-picker--circle',
            'tale-color-swatch-picker__item',
          ]}
        >
          <SubHeading>Default (square)</SubHeading>
          <ColorSwatchPicker.Root>
            {['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#8800ff'].map((color) => (
              <ColorSwatchPicker.Item key={color} color={color}>
                <ColorSwatch color={color} />
              </ColorSwatchPicker.Item>
            ))}
          </ColorSwatchPicker.Root>
          <SubHeading>Circle shape</SubHeading>
          <ColorSwatchPicker.Root shape="circle">
            {['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#8800ff'].map((color) => (
              <ColorSwatchPicker.Item key={color} color={color}>
                <ColorSwatch color={color} />
              </ColorSwatchPicker.Item>
            ))}
          </ColorSwatchPicker.Root>
          <SubHeading>Theme preview (circle + diagonal split)</SubHeading>
          <ColorSwatchPicker.Root shape="circle">
            {[
              { brand: '#ff0000', neutral: '#fef2f2' },
              { brand: '#ff8800', neutral: '#fff7ed' },
              { brand: '#00ff00', neutral: '#f0fdf4' },
              { brand: '#0088ff', neutral: '#eff6ff' },
              { brand: '#8800ff', neutral: '#faf5ff' },
            ].map(({ brand, neutral }) => (
              <ColorSwatchPicker.Item key={brand} color={brand}>
                <ColorSwatch color={brand} secondaryColor={neutral} />
              </ColorSwatchPicker.Item>
            ))}
          </ColorSwatchPicker.Root>
        </Section>

        <Section
          id="color-field"
          title="ColorField"
          classes={[
            'tale-color-field',
            'tale-color-field__input',
            'tale-color-field__description',
            'tale-color-field__error',
          ]}
        >
          <SubHeading>Default</SubHeading>
          <div className="audit__demo-narrow display--flex flex--col gap--2xs">
            <ColorField.Root defaultValue="#ff0000">
              <ColorField.Label>Color</ColorField.Label>
              <ColorField.Input />
              <ColorField.Description>Enter a hex colour value.</ColorField.Description>
            </ColorField.Root>
            <ColorField.Root isDisabled defaultValue="#cccccc">
              <ColorField.Label>Disabled</ColorField.Label>
              <ColorField.Input />
            </ColorField.Root>
          </div>
        </Section>

        <Section id="color-picker" title="ColorPicker" classes={[]}>
          <SubHeading>Nested controls with shared picker state</SubHeading>
          <ColorPickerDemo />
        </Section>

        {/* ============================================================= */}
        {/* MARKETING                                                      */}
        {/* ============================================================= */}

        <Section
          id="app-store-button"
          title="AppStoreButton"
          classes={[
            'tale-app-store-button',
            'tale-app-store-button--apple',
            'tale-app-store-button--google',
            'tale-app-store-button--sm',
            'tale-app-store-button--md',
            'tale-app-store-button--lg',
          ]}
        >
          <SubHeading>Both stores</SubHeading>
          <Row>
            <AppStoreButton store="apple" href="#" />
            <AppStoreButton store="google" href="#" />
          </Row>
          <SubHeading>Sizes</SubHeading>
          <Row>
            <AppStoreButton store="apple" size="sm" href="#" />
            <AppStoreButton store="apple" size="md" href="#" />
            <AppStoreButton store="apple" size="lg" href="#" />
          </Row>
        </Section>

        <Section
          id="social-button"
          title="SocialButton"
          classes={[
            'tale-social-button',
            'tale-social-button--google',
            'tale-social-button--github',
            'tale-social-button--apple',
            'tale-social-button--x',
            'tale-social-button--facebook',
            'tale-social-button--sm',
            'tale-social-button--md',
          ]}
        >
          <SubHeading>Providers</SubHeading>
          <Row>
            <SocialButton provider="google">Continue with Google</SocialButton>
            <SocialButton provider="github">Continue with GitHub</SocialButton>
            <SocialButton provider="apple">Continue with Apple</SocialButton>
          </Row>
          <SubHeading>Sizes</SubHeading>
          <Row>
            <SocialButton provider="google" size="sm">
              Google (sm)
            </SocialButton>
            <SocialButton provider="google" size="md">
              Google (md)
            </SocialButton>
          </Row>
        </Section>

        <Section
          id="social-button-group"
          title="SocialButtonGroup"
          classes={['tale-social-button-group']}
        >
          <SubHeading>Default</SubHeading>
          <SocialButtonGroup>
            <SocialButton provider="google">Sign in with Google</SocialButton>
            <SocialButton provider="github">Continue with GitHub</SocialButton>
            <SocialButton provider="apple">Sign in with Apple</SocialButton>
            <SocialButton provider="x">Sign in with X</SocialButton>
            <SocialButton provider="facebook">Continue with Facebook</SocialButton>
          </SocialButtonGroup>
          <SubHeading>Size propagation (sm)</SubHeading>
          <SocialButtonGroup size="sm">
            <SocialButton provider="google">Sign in with Google</SocialButton>
            <SocialButton provider="github">Continue with GitHub</SocialButton>
            <SocialButton provider="apple">Sign in with Apple</SocialButton>
          </SocialButtonGroup>
        </Section>

        <Section
          id="badge-group"
          title="BadgeGroup"
          classes={[
            'tale-badge-group',
            'tale-badge-group--md',
            'tale-badge-group--lg',
            'tale-badge-group--light',
            'tale-badge-group--modern',
            'tale-badge-group--brand',
            'tale-badge-group--success',
            'tale-badge-group--warning',
            'tale-badge-group--error',
            'tale-badge-group--gray',
            'tale-badge-group--leading',
            'tale-badge-group--trailing',
            'tale-badge-group__addon',
            'tale-badge-group__dot',
            'tale-badge-group__icon',
          ]}
        >
          <SubHeading>Colors (light theme)</SubHeading>
          <Row>
            {(['brand', 'success', 'warning', 'error', 'gray'] as const).map((c) => (
              <BadgeGroup.Root key={c} color={c} addonText="v1.0">
                {c}
              </BadgeGroup.Root>
            ))}
          </Row>
          <SubHeading>Colors (modern theme)</SubHeading>
          <Row>
            {(['brand', 'success', 'warning', 'error', 'gray'] as const).map((c) => (
              <BadgeGroup.Root key={c} color={c} theme="modern" addonText="v1.0">
                {c}
              </BadgeGroup.Root>
            ))}
          </Row>
          <SubHeading>Sizes</SubHeading>
          <Row>
            <BadgeGroup.Root size="md" addonText="md">
              Medium
            </BadgeGroup.Root>
            <BadgeGroup.Root size="lg" addonText="lg">
              Large
            </BadgeGroup.Root>
          </Row>
          <SubHeading>Leading addon</SubHeading>
          <Row>
            <BadgeGroup.Root align="leading" addonText="PRO">
              Unlock all features
            </BadgeGroup.Root>
          </Row>
        </Section>

        <Section
          id="section-divider"
          title="SectionDivider"
          classes={['tale-section-divider', 'tale-section-divider__rule']}
        >
          <SubHeading>Default</SubHeading>
          <div style={{ width: '100%' }}>
            <p style={{ margin: '0.625rem 0' }}>Content above</p>
            <SectionDivider />
            <p style={{ margin: '0.625rem 0' }}>Content below</p>
          </div>
        </Section>

        <Section
          id="background-pattern"
          title="BackgroundPattern"
          classes={['tale-background-pattern']}
        >
          <SubHeading>All patterns (md size)</SubHeading>
          <Row>
            {(['circle', 'square', 'grid'] as const).map((p) => (
              <div key={p} style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 0.3125rem' }}>{p}</p>
                <BackgroundPattern pattern={p} size="md" />
              </div>
            ))}
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 0.3125rem' }}>grid-check</p>
              <BackgroundPattern pattern="grid-check" size="md" />
            </div>
          </Row>
          <SubHeading>Custom color</SubHeading>
          <BackgroundPattern pattern="circle" size="sm" style={{ color: 'var(--color-30)' }} />
        </Section>

        <Section
          id="illustration"
          title="Illustration"
          classes={['tale-illustration', 'tale-illustration__svg', 'tale-illustration__overlay']}
        >
          <SubHeading>All types (md)</SubHeading>
          <Row>
            {(['box', 'cloud', 'documents', 'credit-card'] as const).map((t) => (
              <div key={t} style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 0.3125rem' }}>{t}</p>
                <Illustration type={t} size="md" />
              </div>
            ))}
          </Row>
          <SubHeading>Sizes (box)</SubHeading>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.625rem' }}>
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <div key={s} style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 0.3125rem' }}>{s}</p>
                <Illustration type="box" size={s} />
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="iphone-mockup"
          title="IphoneMockup"
          classes={[
            'tale-iphone-mockup',
            'tale-iphone-mockup__image',
            'tale-iphone-mockup__image--dark',
          ]}
        >
          <SubHeading>Default (scaled to 200 px)</SubHeading>
          <IPhoneMockup
            image="https://placehold.co/750x1624/e2e8f0/64748b?text=Screenshot"
            width={200}
            height={408}
          />
        </Section>

        <Section
          id="credit-card"
          title="CreditCard"
          classes={[
            'tale-credit-card',
            'tale-credit-card__inner',
            'tale-credit-card__inner--brand-dark',
            'tale-credit-card__inner--brand-light',
            'tale-credit-card__inner--gray-dark',
            'tale-credit-card__inner--gray-light',
            'tale-credit-card__inner--transparent',
            'tale-credit-card__inner--gradient-strip',
            'tale-credit-card__header',
            'tale-credit-card__company',
            'tale-credit-card__paypass',
            'tale-credit-card__footer',
            'tale-credit-card__number',
            'tale-credit-card__holder',
            'tale-credit-card__expiration',
            'tale-credit-card__logo-wrap',
            'tale-credit-card__strip',
            'tale-credit-card__strip-vertical',
          ]}
        >
          <SubHeading>Normal variants</SubHeading>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
            {(
              [
                'brand-dark',
                'brand-light',
                'gray-dark',
                'gray-light',
                'transparent',
                'transparent-gradient',
              ] as const
            ).map((t) => (
              <CreditCard.Root key={t} type={t} width={200} />
            ))}
          </div>
          <SubHeading>Strip variants</SubHeading>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
            {(['transparent-strip', 'gray-strip', 'gradient-strip', 'salmon-strip'] as const).map(
              (t) => (
                <CreditCard.Root key={t} type={t} width={200} />
              ),
            )}
          </div>
          <SubHeading>Vertical strip variants</SubHeading>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
            {(
              ['gray-strip-vertical', 'gradient-strip-vertical', 'salmon-strip-vertical'] as const
            ).map((t) => (
              <CreditCard.Root key={t} type={t} width={200} />
            ))}
          </div>
        </Section>

        {/* ============================================================= */}
        {/* INTERACTION                                                    */}
        {/* ============================================================= */}

        <Section id="drop-zone" title="DropZone" classes={['tale-drop-zone']}>
          <SubHeading>Default</SubHeading>
          <DropZone onDrop={() => {}}>
            <div className="audit__dropzone-content">Drop files here</div>
          </DropZone>
          <SubHeading>With FileTrigger (click or drag)</SubHeading>
          <DropZone onDrop={() => {}}>
            <FileTrigger onSelect={() => {}}>
              <Button variant="neutral">Click or drag files here</Button>
            </FileTrigger>
          </DropZone>
        </Section>

        <Section id="file-trigger" title="FileTrigger" classes={[]}>
          <SubHeading>Default</SubHeading>
          <Row>
            <FileTrigger onSelect={() => {}}>
              <Button variant="neutral">Choose file…</Button>
            </FileTrigger>
          </Row>
        </Section>

        <Section
          id="file-upload"
          title="FileUpload"
          classes={[
            'tale-file-upload',
            'tale-file-upload-drop-zone',
            'tale-file-upload-drop-zone--drag-over',
            'tale-file-upload-drop-zone--disabled',
            'tale-file-upload-drop-zone__icon-wrap',
            'tale-file-upload-drop-zone__icon',
            'tale-file-upload-drop-zone__body',
            'tale-file-upload-drop-zone__trigger-row',
            'tale-file-upload-drop-zone__trigger',
            'tale-file-upload-drop-zone__or',
            'tale-file-upload-drop-zone__hint',
            'tale-file-upload-drop-zone__hint--invalid',
            'tale-file-upload-list',
            'tale-file-upload-list-item',
            'tale-file-upload-item',
            'tale-file-upload-item--bar',
            'tale-file-upload-item--fill',
            'tale-file-upload-item--failed',
            'tale-file-upload-item__icon',
            'tale-file-upload-item__content',
            'tale-file-upload-item__name',
            'tale-file-upload-item__size',
            'tale-file-upload-item__actions',
            'tale-file-upload-item__progress',
            'tale-file-upload-item__progress-fill',
            'tale-file-upload-item__fill-bg',
          ]}
        >
          <FileUploadAuditSection />
        </Section>

        <Section
          id="image-cropper"
          title="ImageCropper"
          classes={['tale-image-cropper', 'tale-image-cropper__img']}
        >
          <ImageCropperAuditSection />
        </Section>

        <Section
          id="text-editor"
          title="TextEditor"
          classes={[
            'tale-text-editor',
            'tale-text-editor__label',
            'tale-text-editor__hint',
            'tale-text-editor__hint--invalid',
            'tale-text-editor__content',
            'tale-text-editor__toolbar',
            'tale-text-editor__toolbar--floating',
            'tale-text-editor__toolbar--advanced',
            'tale-text-editor__separator',
            'tale-text-editor__btn',
            'tale-text-editor__btn--active',
            'tale-text-editor__bubble-menu',
            'tale-text-editor__color-popup',
            'tale-text-editor__color-swatches',
            'tale-text-editor__color-swatch',
            'tale-text-editor__color-field',
            'tale-text-editor__select',
          ]}
        >
          <SubHeading>Simple toolbar</SubHeading>
          <TextEditor.Root>
            <TextEditor.Label>Body</TextEditor.Label>
            <TextEditor.Toolbar type="simple" />
            <TextEditor.Content />
          </TextEditor.Root>
          <SubHeading>Advanced toolbar</SubHeading>
          <TextEditor.Root limit={300}>
            <TextEditor.Label>Description</TextEditor.Label>
            <TextEditor.Toolbar type="advanced" />
            <TextEditor.Content />
            <TextEditor.HintText />
          </TextEditor.Root>
          <SubHeading>Disabled</SubHeading>
          <TextEditor.Root isDisabled>
            <TextEditor.Toolbar type="simple" />
            <TextEditor.Content />
          </TextEditor.Root>
          <SubHeading>Invalid</SubHeading>
          <TextEditor.Root isInvalid>
            <TextEditor.Toolbar type="simple" />
            <TextEditor.Content />
            <TextEditor.HintText>This field is required</TextEditor.HintText>
          </TextEditor.Root>
        </Section>

        {/* ============================================================= */}
        {/* NAVIGATION: Sidebar + HeaderNav                                */}
        {/* ============================================================= */}

        <Section
          id="sidebar"
          title="Sidebar"
          classes={[
            'tale-sidebar',
            'tale-sidebar--no-border',
            'tale-sidebar__header',
            'tale-sidebar__search',
            'tale-sidebar__search-input',
            'tale-sidebar__search-icon',
            'tale-sidebar__divider',
            'tale-sidebar__nav-list',
            'tale-sidebar__nav-item',
            'tale-sidebar__nav-link',
            'tale-sidebar__nav-link--current',
            'tale-sidebar__nav-icon',
            'tale-sidebar__nav-btn',
            'tale-sidebar__nav-btn--current',
            'tale-sidebar__account-card',
            'tale-sidebar__account-avatar',
            'tale-sidebar__account-info',
            'tale-sidebar__account-name',
            'tale-sidebar__account-email',
            'tale-sidebar__account-trigger',
            'tale-sidebar__account-menu',
            'tale-sidebar__feature-card',
            'tale-sidebar__mobile-header',
            'tale-sidebar__mobile-menu-btn',
          ]}
        >
          <SubHeading>Basic sidebar</SubHeading>
          <div
            style={{
              height: 400,
              display: 'flex',
              border: '1px solid var(--neutral-90)',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <Sidebar.Root style={{ width: 280 }}>
              <Sidebar.Header>
                <strong style={{ fontSize: 16 }}>MyApp</strong>
              </Sidebar.Header>
              <Sidebar.Search placeholder="Search..." />
              <Sidebar.NavList>
                <Sidebar.NavItem href="/dashboard" current>
                  Dashboard
                </Sidebar.NavItem>
                <Sidebar.NavItem href="/team">Team</Sidebar.NavItem>
                <Sidebar.NavItem href="/settings">Settings</Sidebar.NavItem>
                <Sidebar.Divider />
                <Sidebar.NavItem href="/help">Help &amp; Support</Sidebar.NavItem>
              </Sidebar.NavList>
              <Sidebar.AccountCard name="Alex Chen" email="alex@example.com" />
            </Sidebar.Root>
          </div>
        </Section>

        <Section
          id="header-nav"
          title="HeaderNav"
          classes={[
            'tale-header-nav',
            'tale-header-nav__logo',
            'tale-header-nav__secondary',
            'tale-header-nav__nav-btn',
            'tale-header-nav__nav-btn--current',
            'tale-header-nav__actions',
            'tale-header-nav__mobile-trigger',
          ]}
        >
          <SubHeading>Basic header</SubHeading>
          <div
            style={{ border: '1px solid var(--neutral-90)', borderRadius: 8, overflow: 'hidden' }}
          >
            <HeaderNav.Root>
              <HeaderNav.Logo href="/">MyApp</HeaderNav.Logo>
              <HeaderNav.Secondary>
                <HeaderNav.NavButton href="/features" current>
                  Features
                </HeaderNav.NavButton>
                <HeaderNav.NavButton href="/pricing">Pricing</HeaderNav.NavButton>
                <HeaderNav.NavButton href="/docs">Docs</HeaderNav.NavButton>
              </HeaderNav.Secondary>
              <HeaderNav.Actions>
                <a href="/login" className="tale-button tale-button--neutral tale-button--sm">
                  Log in
                </a>
                <a href="/signup" className="tale-button tale-button--primary tale-button--sm">
                  Sign up
                </a>
              </HeaderNav.Actions>
            </HeaderNav.Root>
          </div>
        </Section>

        <Section
          id="outline"
          title="Outline"
          classes={[
            'tale-outline',
            'tale-outline__list',
            'tale-outline__list--nested',
            'tale-outline__item',
            'tale-outline__link',
          ]}
        >
          <SubHeading>Nested document navigation</SubHeading>
          <Outline
            aria-label="On this page"
            observeTargets={false}
            defaultActiveId="overview"
            items={[
              { id: 'overview', targetId: 'audit-outline-overview', label: 'Overview', level: 1 },
              { id: 'setup', targetId: 'audit-outline-setup', label: 'Setup', level: 2 },
              { id: 'api', targetId: 'audit-outline-api', label: 'API', level: 1 },
            ]}
          />
        </Section>

        {/* ============================================================= */}
        {/* TYPOGRAPHY                                                     */}
        {/* ============================================================= */}

        <Section
          id="blockquote"
          title="Blockquote"
          classes={['tale-blockquote', 'tale-blockquote__content', 'tale-blockquote__attribution']}
        >
          <Blockquote.Root cite="https://example.com/design-systems">
            <Blockquote.Content>
              A design system is a shared language, not merely a component catalogue.
            </Blockquote.Content>
            <Blockquote.Attribution>Tale UI</Blockquote.Attribution>
          </Blockquote.Root>
        </Section>

        <Section
          id="citation"
          title="Citation"
          classes={[
            'tale-citation',
            'tale-citation__reference',
            'tale-citation__reference-link',
            'tale-citation__list',
            'tale-citation__source',
            'tale-citation__title',
            'tale-citation__metadata',
          ]}
        >
          <Citation.Root
            id="component-audit-note"
            baseUrl="https://www.w3.org/"
            sources={[
              {
                id: 'aria-apg',
                title: 'WAI-ARIA Authoring Practices Guide',
                href: '/WAI/ARIA/apg/',
                publisher: 'W3C',
              },
            ]}
          >
            <Text>
              Use established interaction patterns
              <Citation.Reference sourceId="aria-apg" />.
            </Text>
            <Citation.List />
          </Citation.Root>
        </Section>

        <Section id="code" title="Code" classes={['tale-code']}>
          <SubHeading>Inline code</SubHeading>
          <Text>
            Import the component from <Code>@tale-ui/react/code</Code>.
          </Text>
        </Section>

        <Section
          id="code-block"
          title="CodeBlock"
          classes={['tale-code-block', 'tale-code-block--wrap']}
        >
          <SubHeading>Plain text</SubHeading>
          <CodeBlock language="tsx">{`export function App() {
  return <main>Hello</main>;
}`}</CodeBlock>
          <SubHeading>Wrapped</SubHeading>
          <CodeBlock wrap>
            This long plain-text line wraps without loading a parser or syntax highlighter.
          </CodeBlock>
        </Section>

        <Section id="kbd" title="Kbd" classes={['tale-kbd', 'tale-kbd--sm', 'tale-kbd--md']}>
          <SubHeading>Shortcut</SubHeading>
          <Text>
            Open search with <Kbd>⌘</Kbd> <Kbd>K</Kbd>
          </Text>
          <SubHeading>Sizes</SubHeading>
          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
            <Kbd size="sm">Esc</Kbd>
            <Kbd size="md">Enter</Kbd>
          </div>
        </Section>

        <Section id="markdown" title="Markdown" classes={['tale-markdown']}>
          <Markdown baseUrl="https://docs.example.com/">
            {
              '## Bounded content\n\nUse **semantic output** and a [safe relative link](./trust-guide).\n\n> Raw HTML remains outside the trust boundary.'
            }
          </Markdown>
        </Section>

        <Section
          id="text"
          title="Text"
          classes={['tale-text', 'tale-text--muted', 'tale-text--accent']}
        >
          <SubHeading>Variants</SubHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Text variant="display" size="m" as="div">
              display-m
            </Text>
            <Text variant="heading" size="m" as="div">
              heading-m
            </Text>
            <Text variant="title" size="m" as="div">
              title-m
            </Text>
            <Text variant="label" size="m" as="div">
              label-m
            </Text>
            <Text variant="text" size="m" as="div">
              text-m (body)
            </Text>
            <Text variant="mono" size="m" as="div">
              mono-m
            </Text>
          </div>
          <SubHeading>Sizes (text variant)</SubHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <Text variant="text" size="l">
              text-l
            </Text>
            <Text variant="text" size="m">
              text-m
            </Text>
            <Text variant="text" size="s">
              text-s
            </Text>
            <Text variant="text" size="xs">
              text-xs
            </Text>
          </div>
          <SubHeading>Colours</SubHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <Text color="default">Default colour</Text>
            <Text color="muted">Muted colour</Text>
            <Text color="accent">Accent colour</Text>
          </div>
        </Section>
      </main>
    </div>
  );
}
