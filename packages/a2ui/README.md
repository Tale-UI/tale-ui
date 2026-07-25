# @tale-ui/a2ui

A2UI protocol renderer for the Tale UI Design System. Maps A2UI agent messages to fully-themed, accessible Tale UI React components.

## What is A2UI?

[A2UI](https://a2ui.org/) is a declarative protocol where AI agents stream JSON messages describing UI surfaces. Clients render them using native components from a predefined catalog. This package bridges A2UI with Tale UI.

## Quick Start

```tsx
import { A2UIProvider, A2UISurface } from '@tale-ui/a2ui/renderer';
import { taleUICatalog } from '@tale-ui/a2ui/catalog';

function App() {
  const handleAction = (surfaceId: string, action: { name: string; context?: Record<string, unknown> }) => {
    // Route actions back to your agent
    console.log('Action:', surfaceId, action);
  };

  return (
    <A2UIProvider catalog={taleUICatalog} onAction={handleAction}>
      <A2UISurface surfaceId="main" />
    </A2UIProvider>
  );
}
```

## Feeding Messages

```tsx
import { useA2UI } from '@tale-ui/a2ui/renderer';

function AgentConnection() {
  const { processMessage } = useA2UI();

  useEffect(() => {
    // From WebSocket, SSE, or function call results
    ws.onmessage = (event) => {
      processMessage(JSON.parse(event.data));
    };
  }, [processMessage]);

  return null;
}
```

## Catalog

The default catalog maps all 151 A2UI standard component types:

For new surfaces, prefer `CheckboxField`, `RadioField` with `RadioFieldOption`
children, and `SwitchField`. `Checkbox`, `Radio` with `RadioOption` children,
and `Switch` remain available for compatibility with existing payloads.

| A2UI Type | Tale UI Component |
|-----------|-------------------|
| Text | Text |
| Kbd | Kbd |
| CodeBlock | CodeBlock |
| Button | Button |
| Row | Row |
| Column | Column |
| Card | Card.Root |
| Image | Image |
| List | List.Root |
| KeyValuePairs | KeyValuePairs.Root |
| KeyValuePair | KeyValuePairs.Item |
| KeyValuePairGroup | KeyValuePairs.Group |
| TextInput | TextField.Root |
| Checkbox | Checkbox.Root |
| CheckboxField | CheckboxField.Root |
| Radio | RadioGroup |
| RadioField | RadioGroup |
| Select | Select.Root |
| Switch | Switch.Root |
| SwitchField | SwitchField.Root |
| RadioFieldOption | RadioField.Root |
| Table | Table.Root |
| TableHeader | Table.Header |
| TableColumn | Table.Column |
| TableBody | Table.Body |
| TableRow | Table.Row |
| TableCell | Table.Cell |
| Tabs | Tabs.Root |
| TabList | Tabs.List |
| TabItem | Tabs.Tab |
| TabPanel | Tabs.Panel |
| Badge | Badge |
| Progress | ProgressBar.Root |
| Spinner | Spinner |
| Separator | Separator |
| Link | Link |
| Icon | Icon |
| Form | Form |
| Avatar | Avatar.Root |
| Banner | Banner.Root |
| Disclosure | Disclosure.Root |
| TextAreaInput | TextArea.Root |
| NumberInput | NumberField.Root |
| SliderInput | Slider.Root |
| SearchInput | SearchField.Root |
| Accordion | Accordion.Root |
| Menu | Menu.Root |
| Dialog | Dialog.Root |
| AlertDialog | AlertDialog.Root |
| Drawer | Drawer.Root |
| Tooltip | Tooltip.Root |
| TooltipTrigger | Tooltip.Trigger |
| TooltipPopup | Tooltip.Popup |
| Popover | Popover.Root |
| PopoverTrigger | Popover.Trigger |
| PopoverPopup | Popover.Popup |
| Breadcrumbs | Breadcrumbs.Root |
| BreadcrumbItem | Breadcrumbs.Item |
| BreadcrumbLink | Breadcrumbs.Link |
| Pagination | Pagination.Root |
| PaginationItem | Pagination.Item |
| PaginationPrevious | Pagination.PreviousTrigger |
| PaginationNext | Pagination.NextTrigger |
| PaginationEllipsis | Pagination.Ellipsis |
| TagGroup | TagGroup.Root |
| TagList | TagGroup.List |
| Tag | TagGroup.Tag |
| EmptyState | EmptyState.Root |
| Meter | Meter.Root |
| ProgressCircle | ProgressCircle.Root |
| ToggleButton | ToggleButton |
| ToggleButtonGroup | ToggleButtonGroup |
| Field | Field.Root |
| FieldLabel | Field.Label |
| FieldDescription | Field.Description |
| FieldError | Field.Error |
| CheckboxGroup | CheckboxGroup |
| Combobox | Combobox.Root |
| ComboboxItem | Combobox.Item |
| SelectNative | SelectNative |
| PinInput | PinInput.Root |
| Calendar | Calendar.Root |
| RangeCalendar | RangeCalendar.Root |
| DateField | DateField.Root |
| DatePicker | DatePicker.Root |
| DateRangePicker | DateRangePicker.Root |
| TimeField | TimeField.Root |
| ColorField | ColorField.Root |
| ColorArea | ColorArea.Root |
| ColorSlider | ColorSlider.Root |
| PreviewCard | PreviewCard.Root |
| ContextMenu | ContextMenu.Root |
| ContextMenuTrigger | ContextMenu.Trigger |
| ContextMenuPopup | ContextMenu.Popup |
| ContextMenuItem | ContextMenu.Item |
| ContextMenuSeparator | ContextMenu.Separator |
| NavigationMenu | NavigationMenu.Root |
| NavigationMenuItem | NavigationMenu.Item |
| NavigationMenuLink | NavigationMenu.Link |
| Carousel | Carousel.Root |
| CarouselItem | Carousel.Item |
| ScrollArea | ScrollArea.Root |
| Toolbar | Toolbar.Root |
| ToolbarButton | Toolbar.Button |
| ToolbarSeparator | Toolbar.Separator |
| GridList | GridList.Root |
| GridListItem | GridList.Item |
| Tree | Tree.Root |
| TreeItem | Tree.Item |
| IconButton | IconButton |
| Fieldset | Fieldset.Root |
| DropZone | DropZone |
| FileTrigger | FileTrigger |
| FileUpload | FileUpload.Root |
| RatingStars | RatingStars |
| RatingBadge | RatingBadge |
| FeaturedIcon | FeaturedIcon |
| DotIcon | DotIcon |
| AppStoreButton | AppStoreButton |
| SocialButton | SocialButton |
| PaymentInput | PaymentInput.Root |
| Autocomplete | Autocomplete.Root |
| AutocompleteItem | Autocomplete.Item |
| ColorWheel | ColorWheel.Root |
| ColorSwatch | ColorSwatch |
| ColorSwatchPicker | ColorSwatchPicker.Root |
| ColorPicker | ColorPicker.Root |
| BadgeGroup | BadgeGroup.Root |
| InputGroup | InputGroup.Root |
| InputTags | InputTags.Root |
| MultiSelect | MultiSelect.Root |
| SectionDivider | SectionDivider |
| TagSelect | TagSelect.Root |

### Custom Catalog

Extend with your own components:

```tsx
import { createCatalog } from '@tale-ui/a2ui/catalog';
import { MyWidget } from './MyWidget';

const catalog = createCatalog({
  MyWidget: {
    component: MyWidget,
    adapter: (props, ctx) => ({
      title: props.title,
      children: ctx.children,
    }),
  },
});
```

## Validation

Validate A2UI messages before rendering:

```tsx
import { validateMessages, formatErrors } from '@tale-ui/a2ui/validation';
import { taleUICatalog } from '@tale-ui/a2ui/catalog';

const result = validateMessages(messages, taleUICatalog);
if (!result.valid) {
  console.error(formatErrors(result.errors));
}
```

## Architecture

```
packages/a2ui/src/
├── types.ts              # A2UI protocol types
├── catalog.ts            # 151 standard + custom catalog entries
├── icon-registry.ts      # Icon name → lucide-react component
├── index.ts              # Public API
├── renderer/
│   ├── tree.ts           # Flat adjacency-list → tree
│   ├── useDataModel.ts   # Path-based reactive data store
│   ├── useActionDispatcher.ts  # Action routing
│   ├── A2UIProvider.tsx  # Context provider
│   ├── A2UISurface.tsx   # Surface renderer
│   └── A2UINode.tsx      # Recursive node renderer
├── validation/
│   └── validate.ts       # Message + catalog validation
└── agent/
    ├── system-prompt.md  # LLM-friendly catalog reference
    └── examples/         # Few-shot A2UI fixtures
```
