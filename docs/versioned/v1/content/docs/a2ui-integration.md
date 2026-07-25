# A2UI Integration Guide

Render AI agent UIs using the Tale UI Design System. This guide covers setting up `@tale-ui/a2ui` — a renderer that takes [A2UI protocol](https://a2ui.org/) messages and renders them as fully-themed, accessible Tale UI components.

---

## Quick Start

```tsx
import { A2UIProvider, A2UISurface, useA2UI } from '@tale-ui/a2ui/renderer';
import { taleUICatalog } from '@tale-ui/a2ui/catalog';

function App() {
  return (
    <A2UIProvider catalog={taleUICatalog} onAction={handleAction}>
      <AgentConnection />
      <A2UISurface surfaceId="main" />
    </A2UIProvider>
  );
}

function AgentConnection() {
  const { processMessage } = useA2UI();

  useEffect(() => {
    ws.onmessage = (e) => processMessage(JSON.parse(e.data));
  }, [processMessage]);

  return null;
}

function handleAction(
  surfaceId: string,
  action: { name: string; context?: Record<string, unknown> },
) {
  // Route actions back to your agent via WebSocket, API call, etc.
  ws.send(JSON.stringify({ surfaceId, action }));
}
```

---

## Architecture

```
Agent (LLM)                              Your React App
    │                                         │
    │  A2UI JSON messages                     │
    │  (beginRendering, surfaceUpdate,        │
    │   dataModelUpdate, deleteSurface)       │
    ▼                                         ▼
┌─────────────────────────────────────────────────┐
│  A2UIProvider                                   │
│  ├── catalog    (component type → Tale UI)      │
│  ├── surfaces   (component tree state)          │
│  ├── dataStores (reactive path-based stores)    │
│  └── onAction   (routes user actions to agent)  │
│                                                 │
│  A2UISurface                                    │
│  └── A2UINode (recursive)                       │
│      ├── catalog lookup                         │
│      ├── adapter (A2UI props → Tale UI props)   │
│      ├── data binding resolution                │
│      └── action handler wiring                  │
└─────────────────────────────────────────────────┘
                    │
                    ▼
         Tale UI React Components
         (Button, Card, Table, etc.)
```

---

## How It Works

### 1. Protocol Messages

A2UI defines four message types:

| Message           | Purpose               | Example                                                                        |
| ----------------- | --------------------- | ------------------------------------------------------------------------------ |
| `beginRendering`  | Start a new surface   | `{ type: "beginRendering", surfaceId: "main", rootComponentId: "root" }`       |
| `surfaceUpdate`   | Add/update components | `{ type: "surfaceUpdate", surfaceId: "main", components: [...] }`              |
| `dataModelUpdate` | Set data at a path    | `{ type: "dataModelUpdate", surfaceId: "main", path: "name", value: "Alice" }` |
| `deleteSurface`   | Remove a surface      | `{ type: "deleteSurface", surfaceId: "main" }`                                 |

### 2. Adjacency-List Component Model

Components are a **flat array** — not a nested tree. Parent-child relationships are encoded by referencing child IDs in props:

```json
{
  "type": "surfaceUpdate",
  "surfaceId": "main",
  "components": [
    { "id": "root", "component": { "Column": { "spacing": "m", "children": ["heading", "btn"] } } },
    { "id": "heading", "component": { "Text": { "content": "Hello", "usageHint": "heading-m" } } },
    {
      "id": "btn",
      "component": {
        "Button": { "label": "Click me", "variant": "primary", "action": { "name": "click" } }
      }
    }
  ]
}
```

The renderer reconstructs this into a tree and renders:

```tsx
<Column gap="m">
  <Text variant="heading" size="m" as="h3">
    Hello
  </Text>
  <Button variant="primary" onPress={() => dispatch('click')}>
    Click me
  </Button>
</Column>
```

### 3. Data Binding

Components can bind to the surface's data model using `{ path: "..." }` references:

```json
{
  "id": "name-input",
  "component": { "TextInput": { "label": "Name", "binding": { "path": "userName" } } }
}
```

Set the value via `dataModelUpdate`:

```json
{ "type": "dataModelUpdate", "surfaceId": "main", "path": "userName", "value": "Alice" }
```

The component reactively reads the value and re-renders when it changes.

### 4. Actions

Interactive components declare actions that are routed back to the agent:

```json
{
  "id": "save",
  "component": {
    "Button": { "label": "Save", "action": { "name": "save", "context": { "formId": "profile" } } }
  }
}
```

When clicked, your `onAction` callback receives `("main", { name: "save", context: { formId: "profile" } })`.

---

## Catalog Reference

The default catalog maps all 149 A2UI standard component types to Tale UI.

For new surfaces, prefer `CheckboxField`, `RadioField` with `RadioFieldOption`
children, and `SwitchField`. `Checkbox`, `Radio` with `RadioOption` children,
and `Switch` remain available for compatibility with existing payloads.

<!-- BEGIN:A2UI_CATALOG_TABLES -->
| A2UI Type | Tale UI Component | Key A2UI Props |
|-----------|-------------------|----------------|
| `Text` | `Text` | `usageHint`, `color`, `content` |
| `Row` | `Row` | `spacing`, `alignment`, `justify`, `wrap` |
| `Column` | `Column` | `spacing`, `alignment`, `justify` |
| `Card` | `Card.Root` | `variant`, `padding` |
| `Image` | `Image` | `src`, `alt`, `radius`, `fit`, `width`, `height` |
| `List` | `List.Root` | `variant`, `density` |
| `ListItem` | `List.Item` | `content` |
| `KeyValuePairs` | `KeyValuePairs.Root` | `label`, `columns`, `minColumnWidth`, `variant`, `density` |
| `KeyValuePair` | `KeyValuePairs.Item` | `label`, `value` |
| `KeyValuePairGroup` | `KeyValuePairs.Group` | `title` |
| `Badge` | `Badge` | `tone`, `size`, `type`, `label` |
| `Icon` | `Icon` | `name`, `size`, `label` |
| `Separator` | `Separator` | `orientation` |
| `Link` | `Link` | `href`, `target`, `rel`, `download`, `iconLeading`, `iconTrailing`, `label` |
| `Button` | `Button` | `variant`, `size`, `disabled`, `isPending`, `showTextWhileLoading`, `action`, `label` |
| `TextInput` | `TextField.Root` | `binding`, `label`, `defaultValue`, `disabled`, `readOnly`, `required`, `isInvalid`, `name`, `action`, `type`, `placeholder`, `description`, `errorMessage` |
| `Checkbox` | `Checkbox.Root` | `binding`, `label`, `defaultSelected`, `disabled`, `readOnly`, `isIndeterminate`, `isRequired`, `size`, `value`, `name`, `action` |
| `CheckboxField` | `CheckboxField.Root` | `binding`, `label`, `defaultSelected`, `disabled`, `readOnly`, `isIndeterminate`, `isRequired`, `isInvalid`, `size`, `value`, `name`, `action`, `description`, `errorMessage` |
| `Radio` | `RadioGroup` | `binding`, `label`, `defaultValue`, `disabled`, `readOnly`, `isRequired`, `isInvalid`, `size`, `name`, `description`, `action` |
| `RadioField` | `RadioGroup` | `binding`, `label`, `defaultValue`, `disabled`, `readOnly`, `isRequired`, `isInvalid`, `size`, `name`, `description`, `action` |
| `Select` | `Select.Root` | `binding`, `label`, `defaultValue`, `disabled`, `readOnly`, `isRequired`, `isInvalid`, `size`, `name`, `placeholder`, `action` |
| `Switch` | `Switch.Root` | `binding`, `label`, `defaultSelected`, `disabled`, `readOnly`, `isRequired`, `size`, `value`, `name`, `action` |
| `SwitchField` | `SwitchField.Root` | `binding`, `label`, `defaultSelected`, `disabled`, `readOnly`, `isRequired`, `isInvalid`, `value`, `name`, `action`, `description`, `errorMessage` |
| `RadioOption` | `Radio.Root` | `value`, `disabled`, `size`, `label` |
| `RadioFieldOption` | `RadioField.Root` | `value`, `disabled`, `size`, `label`, `description`, `errorMessage` |
| `SelectItem` | `Select.Item` | `value`, `label` |
| `Table` | `Table.Root` | `label`, `selectionMode`, `selectionBehavior`, `disabledKeys`, `onSelectionChange` |
| `TableHeader` | `Table.Header` | -- |
| `TableColumn` | `Table.Column` | `isRowHeader`, `allowsSorting`, `width`, `minWidth`, `maxWidth`, `label` |
| `TableBody` | `Table.Body` | -- |
| `TableRow` | `Table.Row` | `id`, `action` |
| `TableCell` | `Table.Cell` | `content` |
| `Tabs` | `Tabs.Root` | `label`, `defaultTab`, `orientation`, `isDisabled` |
| `TabList` | `Tabs.List` | `size`, `variant` |
| `TabItem` | `Tabs.Tab` | `id`, `isDisabled`, `icon`, `label` |
| `TabPanel` | `Tabs.Panel` | `id` |
| `Progress` | `ProgressBar.Root` | `value`, `minValue`, `maxValue`, `indeterminate`, `labelPosition`, `label` |
| `Spinner` | `Spinner` | `variant`, `size`, `label` |
| `Form` | `Form` | `validationBehavior`, `action` |
| `CardHeader` | `Card.Header` | -- |
| `CardBody` | `Card.Body` | -- |
| `CardFooter` | `Card.Footer` | -- |
| `Avatar` | `Avatar.Root` | `size`, `initials` |
| `AvatarImage` | `Avatar.Image` | `src`, `alt` |
| `AvatarFallback` | `Avatar.Fallback` | `initials` |
| `Banner` | `Banner.Root` | `variant`, `size`, `icon`, `title`, `description` |
| `Disclosure` | `Disclosure.Root` | `defaultExpanded`, `isExpanded`, `onExpandedChange` |
| `DisclosureTrigger` | `Disclosure.Trigger` | `label` |
| `DisclosurePanel` | `Disclosure.Panel` | -- |
| `TextAreaInput` | `TextArea.Root` | `binding`, `label`, `defaultValue`, `disabled`, `readOnly`, `required`, `isInvalid`, `name`, `placeholder`, `description` |
| `NumberInput` | `NumberField.Root` | `binding`, `label`, `defaultValue`, `minValue`, `maxValue`, `step`, `disabled`, `readOnly`, `required`, `isInvalid`, `formatOptions`, `name`, `description` |
| `SliderInput` | `Slider.Root` | `binding`, `label`, `defaultValue`, `minValue`, `maxValue`, `step`, `disabled`, `readOnly`, `isRequired`, `orientation`, `name` |
| `SearchInput` | `SearchField.Root` | `binding`, `label`, `defaultValue`, `disabled`, `readOnly`, `isRequired`, `isInvalid`, `variant`, `name`, `action`, `placeholder` |
| `Accordion` | `Accordion.Root` | `allowsMultipleExpanded`, `defaultExpandedKeys`, `expandedKeys`, `isDisabled`, `onExpandedChange` |
| `AccordionItem` | `Accordion.Item` | `id`, `isDisabled`, `defaultExpanded` |
| `AccordionHeader` | `Accordion.Header` | -- |
| `AccordionTrigger` | `Accordion.Trigger` | `label` |
| `AccordionPanel` | `Accordion.Panel` | -- |
| `Menu` | `Menu.Root` | -- |
| `MenuTrigger` | `Menu.Trigger` | `label` |
| `MenuPopover` | `Menu.Popover` | `placement`, `offset`, `crossOffset`, `shouldFlip`, `maxHeight` |
| `MenuItem` | `Menu.Item` | `id`, `textValue`, `href`, `target`, `disabled`, `action`, `label` |
| `MenuSeparator` | `Menu.Separator` | -- |
| `Dialog` | `Dialog.Root` | `triggerLabel`, `title`, `isKeyboardDismissDisabled`, `isDismissable`, `description` |
| `AlertDialog` | `AlertDialog.Root` | `triggerLabel`, `title`, `isKeyboardDismissDisabled`, `description` |
| `Drawer` | `Drawer.Root` | `placement`, `triggerLabel`, `title`, `description` |
| `Tooltip` | `Tooltip.Root` | `delay`, `closeDelay` |
| `TooltipTrigger` | `Tooltip.Trigger` | `label` |
| `TooltipPopup` | `Tooltip.Popup` | `placement`, `offset`, `crossOffset`, `shouldFlip`, `content` |
| `Popover` | `Popover.Root` | `isDismissable` |
| `PopoverTrigger` | `Popover.Trigger` | `label` |
| `PopoverPopup` | `Popover.Popup` | `placement`, `offset`, `crossOffset`, `shouldFlip`, `isKeyboardDismissDisabled`, `title`, `description` |
| `Breadcrumbs` | `Breadcrumbs.Root` | -- |
| `BreadcrumbItem` | `Breadcrumbs.Item` | `label` |
| `BreadcrumbLink` | `Breadcrumbs.Link` | `href`, `rel`, `label` |
| `Pagination` | `Pagination.Root` | `label` |
| `PaginationItem` | `Pagination.Item` | `page`, `current`, `isDisabled`, `action` |
| `PaginationPrevious` | `Pagination.PreviousTrigger` | `disabled`, `action` |
| `PaginationNext` | `Pagination.NextTrigger` | `disabled`, `action` |
| `PaginationEllipsis` | `Pagination.Ellipsis` | -- |
| `TagGroup` | `TagGroup.Root` | `label`, `selectionMode`, `defaultSelectedKeys`, `isDisabled`, `onSelectionChange`, `onRemove` |
| `TagList` | `TagGroup.List` | -- |
| `Tag` | `TagGroup.Tag` | `id`, `textValue`, `href`, `disabled`, `label` |
| `EmptyState` | `EmptyState.Root` | `size`, `icon`, `title`, `description` |
| `Meter` | `Meter.Root` | `value`, `minValue`, `maxValue`, `label` |
| `ProgressCircle` | `ProgressCircle.Root` | `value`, `minValue`, `maxValue`, `isIndeterminate`, `label`, `size` |
| `ToggleButton` | `ToggleButton` | `binding`, `size`, `disabled`, `readOnly`, `isRequired`, `value`, `name`, `label` |
| `ToggleButtonGroup` | `ToggleButtonGroup` | `selectionMode`, `disallowEmptySelection`, `defaultSelectedKeys`, `readOnly`, `size` |
| `Field` | `Field.Root` | -- |
| `FieldLabel` | `Field.Label` | `label` |
| `FieldDescription` | `Field.Description` | `content` |
| `FieldError` | `Field.Error` | `message` |
| `CheckboxGroup` | `CheckboxGroup` | `label`, `description`, `orientation`, `size`, `disabled`, `required`, `isInvalid`, `name` |
| `Combobox` | `Combobox.Root` | `label`, `disabled`, `required`, `isInvalid`, `name`, `placeholder`, `description` |
| `ComboboxItem` | `Combobox.Item` | `id`, `textValue`, `disabled`, `label` |
| `SelectNative` | `SelectNative` | `label`, `size`, `disabled`, `name`, `options` |
| `PinInput` | `PinInput.Root` | `maxLength`, `disabled` |
| `Calendar` | `Calendar.Root` | `label`, `disabled`, `readOnly` |
| `RangeCalendar` | `RangeCalendar.Root` | `label`, `disabled`, `readOnly` |
| `DateField` | `DateField.Root` | `label`, `disabled`, `readOnly`, `required`, `isInvalid`, `name`, `description`, `errorMessage` |
| `DatePicker` | `DatePicker.Root` | `label`, `disabled`, `readOnly`, `required`, `isInvalid`, `name`, `description`, `errorMessage` |
| `DateRangePicker` | `DateRangePicker.Root` | `label`, `disabled`, `readOnly`, `required`, `isInvalid`, `name`, `description`, `errorMessage` |
| `TimeField` | `TimeField.Root` | `label`, `disabled`, `readOnly`, `required`, `isInvalid`, `name`, `description`, `errorMessage` |
| `ColorField` | `ColorField.Root` | `label`, `disabled`, `readOnly`, `required`, `isInvalid`, `name`, `placeholder`, `description`, `errorMessage` |
| `ColorArea` | `ColorArea.Root` | `label`, `xChannel`, `yChannel` |
| `ColorSlider` | `ColorSlider.Root` | `channel`, `label` |
| `PreviewCard` | `PreviewCard.Root` | `delay`, `closeDelay`, `label`, `placement`, `title` |
| `ContextMenu` | `ContextMenu.Root` | -- |
| `ContextMenuTrigger` | `ContextMenu.Trigger` | `label` |
| `ContextMenuPopup` | `ContextMenu.Popup` | -- |
| `ContextMenuItem` | `ContextMenu.Item` | `id`, `textValue`, `disabled`, `action`, `label` |
| `ContextMenuSeparator` | `ContextMenu.Separator` | -- |
| `NavigationMenu` | `NavigationMenu.Root` | -- |
| `NavigationMenuItem` | `NavigationMenu.Item` | -- |
| `NavigationMenuLink` | `NavigationMenu.Link` | `href`, `label` |
| `Carousel` | `Carousel.Root` | `loop`, `autoplay`, `slidesPerView`, `orientation` |
| `CarouselItem` | `Carousel.Item` | -- |
| `ScrollArea` | `ScrollArea.Root` | -- |
| `Toolbar` | `Toolbar.Root` | `label` |
| `ToolbarButton` | `Toolbar.Button` | `disabled`, `action`, `label` |
| `ToolbarSeparator` | `Toolbar.Separator` | -- |
| `GridList` | `GridList.Root` | `label`, `selectionMode` |
| `GridListItem` | `GridList.Item` | `id`, `textValue`, `disabled`, `label` |
| `Tree` | `Tree.Root` | `label`, `selectionMode` |
| `TreeItem` | `Tree.Item` | `id`, `textValue`, `label` |
| `RatingStars` | `RatingStars` | `value`, `max`, `size` |
| `RatingBadge` | `RatingBadge` | `value`, `size` |
| `FeaturedIcon` | `FeaturedIcon` | `variant`, `shape`, `size`, `theme` |
| `DotIcon` | `DotIcon` | `color`, `size` |
| `Fieldset` | `Fieldset.Root` | `label` |
| `IconButton` | `IconButton` | `variant`, `size`, `disabled`, `label`, `action` |
| `DropZone` | `DropZone` | `action` |
| `FileTrigger` | `FileTrigger` | `acceptedFileTypes`, `allowsMultiple`, `action` |
| `FileUpload` | `FileUpload.Root` | -- |
| `PaymentInput` | `PaymentInput.Root` | `label`, `disabled`, `readOnly`, `required`, `isInvalid`, `name`, `placeholder`, `description`, `errorMessage` |
| `Autocomplete` | `Autocomplete.Root` | `label`, `placeholder` |
| `AutocompleteItem` | `Autocomplete.Item` | `id`, `textValue`, `disabled`, `label` |
| `ColorWheel` | `ColorWheel.Root` | `label`, `outerRadius`, `innerRadius` |
| `ColorSwatch` | `ColorSwatch` | `color`, `shape`, `secondaryColor` |
| `ColorSwatchPicker` | `ColorSwatchPicker.Root` | `shape`, `colors` |
| `ColorPicker` | `ColorPicker.Root` | -- |
| `AppStoreButton` | `AppStoreButton` | `store`, `size`, `href` |
| `SocialButton` | `SocialButton` | `provider`, `size`, `href`, `label` |
| `BadgeGroup` | `BadgeGroup.Root` | `addonText`, `size`, `color`, `theme`, `align`, `label` |
| `SectionDivider` | `SectionDivider` | -- |
| `InputGroup` | `InputGroup.Root` | -- |
| `InputTags` | `InputTags.Root` | `label`, `placeholder`, `description`, `defaultValue`, `tagPlacement`, `isDisabled`, `isRequired`, `isInvalid` |
| `MultiSelect` | `MultiSelect.Root` | `label`, `placeholder`, `description`, `isDisabled`, `isRequired`, `isInvalid`, `showSearch`, `showFooter` |
| `TagSelect` | `TagSelect.Root` | `label`, `placeholder`, `description`, `isDisabled`, `isRequired`, `isInvalid` |

**Text `usageHint` values:**

| Hint | Maps to | HTML element |
|------|---------|-------------|
| `display-l` | display (l) | `h1` |
| `display-m` | display (m) | `h1` |
| `display-s` | display (s) | `h2` |
| `heading-l` | heading (l) | `h2` |
| `heading-m` | heading (m) | `h3` |
| `heading-s` | heading (s) | `h4` |
| `heading` | heading (m) | `h3` |
| `title` | title (m) | `h4` |
| `label` | label (m) | `span` |
| `body` | text (m) | `p` |
| `body-s` | text (s) | `p` |
| `caption` | text (xs) | `span` |
| `mono` | mono (m) | `span` |
<!-- END:A2UI_CATALOG_TABLES -->

---

## Custom Catalog

Extend the standard catalog with your own component types:

```tsx
import { createCatalog } from '@tale-ui/a2ui/catalog';
import { Dialog } from '@tale-ui/react/dialog';

const catalog = createCatalog({
  // Override existing type
  Button: {
    component: MyCustomButton,
    adapter: (props, ctx) => ({ ...defaultAdapter(props, ctx), theme: 'custom' }),
  },
  // Add new type
  ConfirmDialog: {
    component: Dialog.Root,
    adapter: (props, ctx) => ({
      isOpen: true,
      children: ctx.children,
    }),
  },
});

<A2UIProvider catalog={catalog} onAction={handleAction}>
  <A2UISurface surfaceId="main" />
</A2UIProvider>;
```

---

## Icon Registry

A2UI `Icon` components reference icons by name string (e.g. `"search"`, `"user"`). The package includes 65 built-in lucide-react icons. Add more at runtime:

```tsx
import { registerIcons, getIconNames } from '@tale-ui/a2ui';
import { Rocket, Flame } from 'lucide-react';

registerIcons({ rocket: Rocket, flame: Flame });

console.log(getIconNames()); // [...built-in, "flame", "rocket"]
```

Unknown icon names fall back to `HelpCircle`.

---

## Validation

Validate A2UI messages before rendering to catch agent errors early:

```tsx
import { validateMessages, formatErrors } from '@tale-ui/a2ui/validation';
import { taleUICatalog } from '@tale-ui/a2ui/catalog';

const result = validateMessages(messages, taleUICatalog);

if (!result.valid) {
  // Feed errors back to the agent for self-correction
  agent.send({
    role: 'user',
    content: `Your A2UI output has errors:\n${formatErrors(result.errors)}\nPlease fix and resend.`,
  });
}
```

**What it checks:**

| Check             | Error type               | Example                              |
| ----------------- | ------------------------ | ------------------------------------ |
| Message structure | `missing_field`          | Missing `surfaceId` on surfaceUpdate |
| Message type      | `invalid_message_type`   | Unknown message type `"renderUI"`    |
| Component types   | `unknown_component_type` | `"Dropdown"` not in catalog          |
| Duplicate IDs     | `duplicate_id`           | Two components with id `"root"`      |
| Orphaned refs     | `orphaned_reference`     | Child ID `"missing"` doesn't exist   |

---

## Multiple Surfaces

Render multiple independent surfaces in the same app:

```tsx
<A2UIProvider catalog={taleUICatalog} onAction={handleAction}>
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
    <A2UISurface surfaceId="left-panel" fallback={<Spinner />} />
    <A2UISurface surfaceId="right-panel" fallback={<Spinner />} />
  </div>
</A2UIProvider>
```

Each surface has its own component tree and data model.

---

## Streaming Updates

A2UI is designed for streaming. Send `surfaceUpdate` messages incrementally — the renderer merges new components into the existing tree:

```tsx
const { processMessage } = useA2UI();

// Initial render
processMessage({ type: 'beginRendering', surfaceId: 'chat', rootComponentId: 'root' });
processMessage({ type: 'surfaceUpdate', surfaceId: 'chat', components: [initialComponents] });

// Later: add more components (existing ones are preserved)
processMessage({ type: 'surfaceUpdate', surfaceId: 'chat', components: [newComponents] });

// Update data reactively
processMessage({ type: 'dataModelUpdate', surfaceId: 'chat', path: 'status', value: 'complete' });
```

---

## Flex Weight

Use `weight` on components for flex-grow behavior inside Row/Column layouts:

```json
[
  { "id": "sidebar", "component": { "Column": {} }, "weight": 1 },
  { "id": "main", "component": { "Column": {} }, "weight": 3 }
]
```

This renders the sidebar at 25% and main content at 75%.

---

## Agent Prompt

The package includes an LLM-friendly system prompt at `packages/a2ui/src/agent/system-prompt.md`. Use it as the system prompt (or append it) for agents that emit A2UI messages. It documents:

- All available component types and their props
- Layout rules (Column for vertical, Row for horizontal)
- Data binding syntax
- Action declaration syntax
- Accessibility requirements

Five few-shot examples are included in `packages/a2ui/src/agent/examples/`:

| Example              | Description                                   |
| -------------------- | --------------------------------------------- |
| `simple-form.json`   | Login form with text inputs and submit button |
| `card-list.json`     | Product cards with images, titles, badges     |
| `dashboard.json`     | Stats cards, progress bar, data-bound values  |
| `settings-page.json` | Switches, selects, divided lists              |
| `data-table.json`    | Table in a card with header actions           |

The MCP Studio A2UI Chat also retrieves a matching `docs/recipes/` entry for the latest user request when one is found. The chat middleware reduces that recipe to A2UI-specific planning guidance: intent, preferred components, hierarchy cues, and customization points. Recipe TSX is never emitted directly; it is treated as source material for valid A2UI JSON messages.

---

## Playground

The Vite playground includes an interactive A2UI demo:

```bash
pnpm playground:dev
# Open http://localhost:5173/a2ui
```

The demo lets you:

- Switch between pre-built examples
- Edit A2UI JSON and load it live
- See validation errors in real-time
- Watch actions dispatched in an action log

---

## Design System Integration

A2UI rendering inherits all Tale UI design system features automatically:

| Feature           | How it works                                                                    |
| ----------------- | ------------------------------------------------------------------------------- |
| **Dark mode**     | All `--color-*` and `--neutral-*` tokens auto-invert — zero agent effort        |
| **Theming**       | Wrap `A2UISurface` in `<Container color="indigo">` for per-surface color themes |
| **Responsive**    | Spacing tokens use `clamp()` — layouts adapt between 480px–1600px automatically |
| **Accessibility** | React Aria provides WAI-ARIA, keyboard nav, and focus management                |
| **Typography**    | `Text` component maps `usageHint` to the full typography token scale            |

---

## Troubleshooting

**Surface doesn't render**

- Ensure `beginRendering` is sent before `surfaceUpdate`
- Check that `surfaceId` matches between messages and `<A2UISurface surfaceId="...">`
- Check that `rootComponentId` in `beginRendering` matches an `id` in the components array

**Unknown component type warning**

- The component type name must exactly match a key in the catalog (case-sensitive)
- Check `Object.keys(taleUICatalog)` for available types

**Actions not firing**

- Ensure your `onAction` callback is provided to `<A2UIProvider>`
- Check that the component has an `action` prop with `{ name: "..." }`

**Data binding not updating**

- Send `dataModelUpdate` messages to set values at paths
- The `path` in the binding must exactly match the `path` in `dataModelUpdate`
