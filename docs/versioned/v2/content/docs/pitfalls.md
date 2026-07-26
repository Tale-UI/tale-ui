<!-- markdownlint-disable MD046 -->

# Cross-Component Pitfalls

Common mistakes that span multiple Tale UI components. Component-specific pitfalls live in
`docs/components/{name}.md ## Pitfalls` and are surfaced via `get_component`.

---

## Trigger Styling

Tale UI overlay triggers do not support `asChild`. Button-based triggers
(`Menu.Trigger`, `Popover.Trigger`, `Dialog.Trigger`, `AlertDialog.Trigger`,
`Drawer.Trigger`, `Tooltip.Trigger`) render their own `<button>` element.
`PreviewCard.Trigger` renders a `<span>`, and `ContextMenu.Trigger` renders a `<div>`.

<!-- pitfall: no-asChild-on-triggers -->
<!-- applies-to: Menu, Popover, Dialog, AlertDialog, Drawer, Tooltip, PreviewCard, ContextMenu -->
<!-- category: trigger-styling -->

- **Never use `asChild` on any Tale UI trigger** — Tale UI trigger components expose their own public structure and do not support `asChild`. Passing it causes TypeScript errors.
  - anti-pattern: `<Menu.Trigger asChild><Button variant="primary">File</Button></Menu.Trigger>`
  - fix: `<Menu.Trigger className="tale-button tale-button--primary tale-button--md">File</Menu.Trigger>`

<!-- pitfall: no-button-inside-trigger -->
<!-- applies-to: Menu, Popover, Dialog, AlertDialog, Drawer, Tooltip -->
<!-- category: trigger-styling -->

- **Never nest `<Button>` or `<IconButton>` inside a trigger** — this creates a `<button>` inside a `<button>` (invalid HTML) and breaks keyboard/pointer interactions. Style the trigger directly with BEM class names.
  - anti-pattern: `<Dialog.Trigger><Button variant="neutral">Open</Button></Dialog.Trigger>`
  - fix: `<Dialog.Trigger className="tale-button tale-button--neutral tale-button--md">Open</Dialog.Trigger>`

The trigger styling table below shows which triggers auto-apply `tale-button` and which need
explicit BEM class names:

<!-- trigger-table-start -->

| Trigger               | Auto-applies tale-button | Notes                                                            |
| --------------------- | ------------------------ | ---------------------------------------------------------------- |
| `Dialog.Trigger`      | Yes                      | Add variant: `tale-button--primary`                              |
| `AlertDialog.Trigger` | Yes                      | Add variant: `tale-button--danger`                               |
| `Drawer.Trigger`      | Yes                      | Add variant class                                                |
| `Popover.Trigger`     | Yes                      | Add variant class                                                |
| `Menu.Trigger`        | No                       | Add full BEM: `tale-button tale-button--neutral tale-button--md` |
| `Tooltip.Trigger`     | No                       | Add full BEM or use `<IconButton>` pattern                       |
| `PreviewCard.Trigger` | No                       | Add full BEM                                                     |
| `ContextMenu.Trigger` | No                       | Wraps any child element; typically plain text or an element      |

<!-- trigger-table-end -->

---

## Overlay State

<!-- pitfall: isopen-on-dialog-and-alert-dialog -->
<!-- applies-to: Dialog, AlertDialog -->
<!-- category: overlay-state -->

- **Use `isOpen`/`onOpenChange` on `Dialog.Root` / `AlertDialog.Root`, not `open`** — React Aria overlay roots use `isOpen`; passing `open` causes TypeScript errors.
  - anti-pattern: `<Dialog.Root open={open} onOpenChange={setOpen}>`
  - fix: `<Dialog.Root isOpen={open} onOpenChange={setOpen}>`

<!-- pitfall: backdrop-wraps-popup-on-dialog-and-alert-dialog -->
<!-- applies-to: Dialog, AlertDialog -->
<!-- category: overlay-state -->

- **`Dialog.Backdrop` / `AlertDialog.Backdrop` must wrap `Popup`, not render as siblings** — sibling overlay trees leave the backdrop mounted after close.
  - anti-pattern: `<Dialog.Backdrop /><Dialog.Popup>...</Dialog.Popup>`
  - fix: `<Dialog.Backdrop><Dialog.Popup>...</Dialog.Popup></Dialog.Backdrop>`

---

## Controlled State Patterns

<!-- pitfall: no-null-state-without-type -->
<!-- applies-to: Calendar, RangeCalendar, DatePicker, DateRangePicker, ColorArea, ColorSlider, ColorWheel, ColorPicker -->
<!-- category: controlled-state -->

- **Never write `useState(null)` without a type annotation for date/color components** — TypeScript infers the literal `null` type, making the setter incompatible with the component's `onChange` prop. Always annotate: `useState<Type | null>(null)`.
  - anti-pattern: `const [value, setValue] = useState(null);`
  - fix: `type T = Parameters<NonNullable<React.ComponentProps<typeof RangeCalendar.Root>['onChange']>>[0]; const [value, setValue] = useState<T | null>(null);`

<!-- pitfall: derive-date-type-from-props -->
<!-- applies-to: Calendar, RangeCalendar, DatePicker, DateRangePicker, DateField, TimeField -->
<!-- category: controlled-state -->

- **Derive date value types from component props, not third-party imports** — `DateValue`, `RangeValue`, and `ZonedDateTime` are not exported from any `@tale-ui/react/*` module. Importing them causes "has no exported member" TypeScript errors. Use the prop-derived pattern instead.
  - anti-pattern: `import type { DateValue } from '@tale-ui/react/calendar';`
  - fix: `type DateVal = Parameters<NonNullable<React.ComponentProps<typeof Calendar.Root>['onChange']>>[0];`

<!-- pitfall: no-native-date -->
<!-- applies-to: Calendar, RangeCalendar, DatePicker, DateRangePicker, DateField, TimeField -->
<!-- category: controlled-state -->

- **Never pass a native `Date` object to date components** — React Aria uses `DateValue`, not `Date`. Passing a `Date` object causes type errors and runtime failures.
  - anti-pattern: `<Calendar.Root value={new Date()} />`
  - fix: `<Calendar.Root defaultValue={parseDate('2024-01-15')} />`

<!-- pitfall: parse-date-import-from-internationalized-date -->
<!-- applies-to: Calendar, RangeCalendar, DatePicker, DateRangePicker, DateField, TimeField -->
<!-- category: controlled-state -->
- **Import parseDate from @internationalized/date, not from @tale-ui/react/calendar — 'Cannot find module @internationalized/date' is NEVER an L1 validation error** — The @internationalized/ namespace is an explicitly allowed import prefix. Raw TypeScript diagnostics include a 'Line N: ' prefix (e.g. 'Line 4: Cannot find module @internationalized/date or its corresponding type declarations.'). A validator that checks rawDiagnostic.startsWith('@internationalized/') on the unstripped string will never match because the string begins with 'Line 4: ', not '@internationalized/'. The validator MUST strip the 'Line N: ' prefix before testing the module path. Use: stripped = rawDiagnostic.replace(/^Line \d+: /, ''); then check if stripped includes 'Cannot find module' and the module path starts with '@internationalized/' — if so, suppress unconditionally. The real fix for end users is to run: npm install @internationalized/date. Never alter, remove, or substitute the import — the import is correct; only the package installation is missing.
  - anti-pattern: `// Reporting 'Line 4: Cannot find module \'@internationalized/date\' or its corresponding type declarations.' as an L1 error`
  - anti-pattern: `// Applying the @internationalized/ suppression check to the raw string 'Line 4: Cannot find module...' without first stripping the 'Line 4: ' prefix`
  - anti-pattern: `// Checking rawDiagnostic.startsWith('@internationalized/') on the raw unstripped string — the 'Line N:' prefix means the check never matches`
  - anti-pattern: `// Treating the 'Line 4:' prefix as a reason to skip suppression of @internationalized/ diagnostics`
  - anti-pattern: `import { Calendar, parseDate } from '@tale-ui/react/calendar'`
  - fix: `// MANDATORY ALGORITHM: stripped = rawDiagnostic.replace(/^Line \d+: /, ''); if (stripped.includes('Cannot find module') && modulePath.startsWith('@internationalized/')) suppress unconditionally`
  - fix: `// DO NOT flag 'Cannot find module @internationalized/date' as an L1 error regardless of any 'Line N:' prefix in the raw diagnostic string`
  - fix: `import { parseDate } from '@internationalized/date'`
  - fix: `// If TypeScript shows "Cannot find module '@internationalized/date'", run: npm install @internationalized/date`
  - fix: `// DO NOT change or remove the import — the import is correct; only the package installation is missing`
  - complete example:
    ```tsx
    import * as React from 'react';
    import { DatePicker } from '@tale-ui/react/date-picker';
    import { Calendar } from '@tale-ui/react/calendar';
    import { parseDate } from '@internationalized/date';

    type DateVal = Parameters<NonNullable<React.ComponentProps<typeof DatePicker.Root>['onChange']>>[0];

    export function DatePickerField() {
      const [value, setValue] = React.useState<DateVal | null>(null);

      return (
        <DatePicker.Root
          value={value}
          onChange={setValue}
          defaultValue={parseDate('2026-05-31')}
        >
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
      );
    }
    ```

<!-- pitfall: no-locale-prop-on-calendar -->
<!-- applies-to: Calendar, RangeCalendar -->
<!-- category: controlled-state -->
<!-- multi-idea-ok -->

- **`Calendar.Root` and `RangeCalendar.Root` have no `locale` prop** — for locale support, wrap the tree in `<I18nProvider locale="en-US">` from `@tale-ui/react/i18n-provider`.
  - anti-pattern: `<Calendar.Root locale="en-US" />`
  - fix: `<I18nProvider locale="en-US"><Calendar.Root /></I18nProvider>`

---

## Color State Imports

<!-- pitfall: color-imports-from-rac -->
<!-- applies-to: ColorArea, ColorSlider, ColorWheel, ColorField, ColorPicker, ColorSwatchPicker -->
<!-- category: color-state -->

- **Import `parseColor` from a `@tale-ui/react` color sub-path, not `@internationalized/color`** — `@internationalized/color` is an internal dependency not available in consumer projects; importing it causes "Cannot find module" TypeScript errors.
  - anti-pattern: `import { parseColor } from '@internationalized/color';`
  - fix: `import { parseColor } from '@tale-ui/react/color-area';`

<!-- pitfall: color-swatch-string-only -->
<!-- applies-to: ColorSwatch -->
<!-- category: color-state -->

- **`ColorSwatch` always accepts a plain CSS string, not a `Color` object** — when `ColorSwatch` is driven by shared color state (a `Color` object from `useState`), serialize it first. Passing a raw `Color` object causes a TypeScript error.
  - anti-pattern: `<ColorSwatch color={colorObject} />`
  - fix: `<ColorSwatch color={colorObject.toString('css')} />`

<!-- pitfall: no-color-extract-channel -->
<!-- applies-to: ColorArea, ColorSlider, ColorWheel -->
<!-- category: color-state -->

- **Pass the full `Color` object as `value`, not a channel number like `color.hue`** — color components expect a `Color` instance; passing a number causes type errors. Use the `channel` prop to specify which channel to display.
  - anti-pattern: `<ColorSlider.Root value={color.hue} onChange={h => setColor(parseColor('hsl(' + h + ', 100%, 50%)'))} />`
  - fix: `<ColorSlider.Root value={color} onChange={setColor} channel="hue" />`

<!-- pitfall: no-color-pojo-state -->
<!-- applies-to: ColorArea, ColorSlider, ColorWheel, ColorPicker -->
<!-- category: color-state -->

- **Do not initialize color state with a plain JS object** — `{ h: 200, s: 100, v: 100 }` is not a valid `Color` instance. Use `parseColor('hsl(200, 100%, 50%)')` to create a proper initial value.
  - anti-pattern: `useState({ h: 200, s: 100, v: 100, alpha: 1 })`
  - fix: `useState(parseColor('hsl(200, 100%, 50%)'))`

<!-- pitfall: never-import-parsecolor-or-color -->
<!-- applies-to: * -->
<!-- category: color-state -->

- **Never import `parseColor` or `Color` from `react-aria-components`** — `react-aria-components` is an internal peer dependency not available in consumer projects; importing from it causes "Cannot find module" TypeScript errors.
  - anti-pattern: `import { parseColor, type Color } from 'react-aria-components';`
  - fix: `import { parseColor } from '@tale-ui/react/color-area';`

---

## React Aria Conventions

<!-- pitfall: minvalue-maxvalue-not-min-max -->
<!-- applies-to: Meter, ProgressBar, Slider, NumberField -->
<!-- category: react-aria -->

- **Use `minValue`/`maxValue` props, not `min`/`max`** — React Aria uses camelCase prop names. Passing `min={0} max={100}` causes "is not assignable to type RootProps" TypeScript errors.
  - anti-pattern: `<Meter.Root value={75} min={0} max={100}>`
  - fix: `<Meter.Root value={75} minValue={0} maxValue={100}>`

<!-- pitfall: selectedkey-not-value -->
<!-- applies-to: Select, Combobox, Tabs -->
<!-- category: react-aria -->

- **Use `selectedKey`/`onSelectionChange` for controlled selection, not `value`/`onChange`** — passing `value` to `Select.Root`, `Combobox.Root`, or `Tabs.Root` causes "is not assignable to type" TypeScript errors. React Aria uses selection keys.
  - anti-pattern: `<Select.Root value={selected} onChange={setSelected}>`
  - fix: `<Select.Root selectedKey={selected} onSelectionChange={(key) => setSelected(key as string)}>`

<!-- pitfall: defaultexpandedkeys-not-defaultopen -->
<!-- applies-to: Accordion -->
<!-- category: react-aria -->

- **`Accordion.Root` uses `defaultExpandedKeys` (an array), not `defaultOpen` or `defaultValue`** — both `defaultOpen` and `defaultValue` are common React/HTML patterns that do not exist on `AccordionRootProps`; using them causes TypeScript errors.
  - anti-pattern: `<Accordion.Root defaultOpen={true}>`
  - fix: `<Accordion.Root defaultExpandedKeys={['item-id']}>`

<!-- pitfall: defaultselectedkey-not-defaultvalue-tabs -->
<!-- applies-to: Tabs -->
<!-- category: react-aria -->

- **`Tabs.Root` uses `defaultSelectedKey`, not `defaultValue`** — passing `defaultValue` causes "is not assignable to type RootProps" TypeScript errors.
  - anti-pattern: `<Tabs.Root defaultValue="overview">`
  - fix: `<Tabs.Root defaultSelectedKey="overview">`

---

## Value Display Patterns

<!-- pitfall: meter-progress-value-needs-children -->
<!-- applies-to: Meter, ProgressBar -->
<!-- category: value-display -->

- **`Meter.Value` / `ProgressBar.Value` require children text** — self-closing value parts render empty spans.
  - anti-pattern: `<ProgressBar.Value />`
  - fix: `<ProgressBar.Value>60%</ProgressBar.Value>`

<!-- pitfall: meter-progress-indicator-needs-value -->
<!-- applies-to: Meter, ProgressBar -->
<!-- category: value-display -->

- **`Meter.Indicator` / `ProgressBar.Indicator` require their own `value` prop** — they do not inherit `value` from `Root`; pass the same value to both parts.
  - anti-pattern: `<Meter.Root value={60}><Meter.Indicator /></Meter.Root>`
  - fix: `<Meter.Root value={60}><Meter.Indicator value={60} /></Meter.Root>`

<!-- pitfall: meter-progress-no-output-sub-part -->
<!-- applies-to: Meter, ProgressBar -->
<!-- category: value-display -->

- **There is no `Meter.Output` or `ProgressBar.Output` sub-part** — use the matching `Value` part for visible numeric text.
  - anti-pattern: `<Meter.Output>60%</Meter.Output>`
  - fix: `<Meter.Value>60%</Meter.Value>`

---

## Import Path Patterns

<!-- pitfall: no-deep-subpath-imports -->
<!-- applies-to: * -->
<!-- category: imports -->

- **Only import from the package-level path — never from internal subpaths like `.../button/Button.styled`** — deep subpath imports bypass the public API and cause "Cannot find module" TypeScript errors.
  - anti-pattern: `import { Button } from '@tale-ui/react/button/Button.styled';`
  - fix: `import { Button } from '@tale-ui/react/button';`

<!-- pitfall: usefilter-from-rac-not-react-aria -->
<!-- applies-to: Autocomplete -->
<!-- category: imports -->

- **Import `useFilter` from `@tale-ui/react/autocomplete`, not `react-aria`** — `react-aria` and `react-aria-components` export different things. Using `react-aria` causes "Module has no exported member 'useFilter'" TypeScript errors.
  - anti-pattern: `import { useFilter } from 'react-aria';`
  - fix: `import { useFilter } from '@tale-ui/react/autocomplete';`

<!-- pitfall: no-cross-import-checkbox-group -->
<!-- applies-to: CheckboxField, CheckboxGroup -->
<!-- category: imports -->

- **`CheckboxField` imports separately from `CheckboxGroup`** — `CheckboxGroup` is exported from `@tale-ui/react/checkbox-group`; `CheckboxField` is exported from `@tale-ui/react/checkbox-field`. Cross-importing causes "Module has no exported member" TypeScript errors.
  - anti-pattern: `import { CheckboxGroup } from '@tale-ui/react/checkbox-field';`
  - anti-pattern: `import { CheckboxField } from '@tale-ui/react/checkbox-group';`
  - fix: `import { CheckboxGroup } from '@tale-ui/react/checkbox-group'; import { CheckboxField } from '@tale-ui/react/checkbox-field';`

<!-- pitfall: no-color-component-from-color-picker -->
<!-- applies-to: ColorArea, ColorSlider, ColorSwatch, ColorSwatchPicker -->
<!-- category: imports -->

- **Color sub-components are not exported from `@tale-ui/react/color-picker`** — each has its own import path. Importing from `color-picker` causes "has no exported member" TypeScript errors.
  - anti-pattern: `import { ColorArea, ColorSwatch } from '@tale-ui/react/color-picker';`
  - fix: `import { ColorArea } from '@tale-ui/react/color-area'; import { ColorSwatch } from '@tale-ui/react/color-swatch';`

<!-- pitfall: toggle-button-group-import-path -->
<!-- applies-to: ToggleButtonGroup -->
<!-- category: imports -->

- **ToggleButtonGroup is exported from @tale-ui/react/toggle-group — never import from @tale-ui/react/toggle-button-group** — there is no `toggle-button-group` module; importing from it causes "Cannot find module" TypeScript errors. Also valid: `@tale-ui/react/toggle-button`.
  - anti-pattern: `import { ToggleButtonGroup } from '@tale-ui/react/toggle-button-group';`
  - fix: `import { ToggleButtonGroup } from '@tale-ui/react/toggle-group';`
  - fix: `import { ToggleButton, ToggleButtonGroup } from '@tale-ui/react/toggle-button';`

<!-- pitfall: textarea-hyphenated-path -->
<!-- applies-to: TextArea -->
<!-- category: imports -->

- **`TextArea` import path is hyphenated: `@tale-ui/react/text-area`** — using `@tale-ui/react/textarea` (no hyphen) causes "Cannot find module" TypeScript errors.
  - anti-pattern: `import { TextArea } from '@tale-ui/react/textarea';`
  - fix: `import { TextArea } from '@tale-ui/react/text-area';`

<!-- pitfall: no-label-component -->
<!-- applies-to: SelectNative -->
<!-- category: imports -->

- **There is no @tale-ui/react/label module or Label component** — use a native `<label htmlFor="...">` HTML element instead.
  - anti-pattern: `import { Label } from '@tale-ui/react/label';`
  - fix: `<label htmlFor="country">Country</label>`

---

<!-- pitfall: never-import-key-from-reactariacomponents -->
<!-- applies-to: * -->
<!-- category: imports -->
- **Never import Key or any type from react-aria-components for selection state — derive the type from the component's props** — `react-aria-components` is an internal peer dependency not available in consumer projects. Importing `Key` (or any type) from it causes "Cannot find module 'react-aria-components'" TypeScript errors. Derive the selection key type from the component's own `onSelectionChange` prop using `React.ComponentProps` instead. Initialize `useState` with that derived type so the setter is compatible.
  - anti-pattern: `import type { Key } from 'react-aria-components';`
  - anti-pattern: `const [selected, setSelected] = React.useState<Set<Key>>(new Set(['alice', 'bob']));`
  - fix: `type SelectionValue = Parameters<NonNullable<React.ComponentProps<typeof TagSelect.Root>['onSelectionChange']>>[0];`
  - fix: `const [selected, setSelected] = React.useState<SelectionValue>(new Set(['alice', 'bob']));`
  - complete example:
    ```tsx
    import * as React from 'react';
    import { TagSelect } from '@tale-ui/react/tag-select';

    type SelectionValue = Parameters<
      NonNullable<React.ComponentProps<typeof TagSelect.Root>['onSelectionChange']>
    >[0];

    const members = [
      { id: 'alice', name: 'Alice Chen' },
      { id: 'bob', name: 'Bob Martínez' },
      { id: 'carol', name: 'Carol Lee' },
    ];

    export function TeamMemberPicker() {
      const [selected, setSelected] = React.useState<SelectionValue>(
        new Set(['alice', 'bob']),
      );

      return (
        <TagSelect.Root
          label="Team members"
          placeholder="Search members…"
          description="Select who should be included in this project."
          items={members}
          selectedKeys={selected}
          onSelectionChange={setSelected}
        >
          {(member) => (
            <TagSelect.Item id={member.id} textValue={member.name}>
              {member.name}
            </TagSelect.Item>
          )}
        </TagSelect.Root>
      );
    }
    ```

<!-- pitfall: never-import-key-or-any -->
<!-- applies-to: * -->
<!-- category: imports -->

- **Never import Key or any type from react-aria-components for selection state** — `react-aria-components` is an internal peer dependency unavailable in consumer projects, so importing its types causes "Cannot find module 'react-aria-components'" TypeScript errors. Derive selection key types from the component's own props via `React.ComponentProps` instead.
  - anti-pattern: `import type { Key } from 'react-aria-components';`
  - anti-pattern: `const [selected, setSelected] = React.useState<Set<Key>>(new Set(['alice', 'carol']));`
  - fix: `type SelectionValue = Parameters<NonNullable<React.ComponentProps<typeof TagSelect.Root>['onSelectionChange']>>[0];`
  - fix: `const [selected, setSelected] = React.useState<SelectionValue>(new Set(['alice', 'carol']));`
  - complete example:

    ```tsx
    import * as React from 'react';
    import { TagSelect } from '@tale-ui/react/tag-select';

    type SelectionValue = Parameters<
      NonNullable<React.ComponentProps<typeof TagSelect.Root>['onSelectionChange']>
    >[0];

    const members = [
      { id: 'alice', name: 'Alice Chen' },
      { id: 'bob', name: 'Bob Martínez' },
    ];

    export function TeamMemberPicker() {
      const [selected, setSelected] = React.useState<SelectionValue>(new Set(['alice', 'bob']));
      return (
        <TagSelect.Root
          label="Team members"
          placeholder="Search members…"
          description="Select everyone who should have access."
          items={members}
          selectedKeys={selected}
          onSelectionChange={setSelected}
        >
          {(member) => (
            <TagSelect.Item id={member.id} textValue={member.name}>
              {member.name}
            </TagSelect.Item>
          )}
        </TagSelect.Root>
      );
    }
    ```

## Layout Patterns

<!-- pitfall: use-row-not-flex-div -->
<!-- applies-to: Row, Column -->
<!-- category: layout -->
<!-- multi-idea-ok -->

- **Use `<Row>` and `<Column>` instead of `<div style={{ display: 'flex' }}>`** — `Row` and `Column` apply correct gap tokens and are the Tale UI layout convention; raw flex divs bypass design-system spacing.
  - anti-pattern: `<div style={{ display: 'flex', gap: '8px' }}>`
  - fix: `<Row gap="s">`

<!-- pitfall: column-needs-explicit-import -->
<!-- applies-to: Column -->
<!-- category: layout -->

- **`Column` must be imported explicitly — it is not re-exported from `@tale-ui/react/row`** — omitting the import causes "Cannot find name 'Column'" TypeScript errors.
  - anti-pattern: `<Column gap="m">`
  - fix: `import { Column } from '@tale-ui/react/column';`

<!-- pitfall: row-column-gap-uses-token-scale -->
<!-- applies-to: Row, Column -->
<!-- category: layout -->
- **Row/Column gap uses spacing token values ('xs', 's', 'm', 'l', 'xl', '2xl'), not component size names — this is the most common layout error** — 'sm', 'md', 'lg' are component size prop values and are not valid Gap type values; passing them causes a TypeScript error Type '"sm"' is not assignable to type 'Gap | undefined' (or "md", "lg" — any component-size name). 'none' is also not a valid Gap value — omit the gap prop entirely to produce no gap. Always map: sm->s, md->m, lg->l. This applies to every Column or Row anywhere in the file without exception, including the outermost page-level wrapper, layout wrappers inside compound-component children such as GridList.Item or Carousel.Item, calendar wrappers, color picker wrappers around ColorArea and ColorSlider, or any other slot. This is the single most common error in generated code — it occurs in nearly every component composition. When a prompt mentions a gap size or you need spacing between elements, ALWAYS use the spacing-token scale, never the component-size scale. CRITICAL: Even when the prompt explicitly says "md" gap or uses component-size terminology, you MUST translate to spacing tokens. The word "md" in a prompt does NOT mean gap="md" — it means gap="m".
  - anti-pattern: `<Row gap="sm">`
  - anti-pattern: `<Column gap="md">`
  - anti-pattern: `<Column gap="lg">`
  - anti-pattern: `<Column gap="none">`
  - anti-pattern: `<Carousel.Item><Column gap="sm">...</Column></Carousel.Item>`
  - anti-pattern: `<Column gap="md"><ColorArea.Root .../><ColorSlider.Root .../></Column>`
  - fix: `<Row gap="s">`
  - fix: `<Column gap="m">`
  - fix: `<Column gap="l">`
  - fix: `<Column>`
  - fix: `<Carousel.Item><Column gap="s">...</Column></Carousel.Item>`
  - fix: `<Column gap="m"><ColorArea.Root .../><ColorSlider.Root .../></Column>`
  - complete example:
    ```tsx
    import { ColorArea, parseColor } from '@tale-ui/react/color-area';
    import { ColorSlider } from '@tale-ui/react/color-slider';
    import { Column } from '@tale-ui/react/column';

    export function ColorPickerExample() {
      return (
        <Column gap="m">
          <ColorArea.Root defaultValue={parseColor('hsl(0, 100%, 50%)')}>
            <ColorArea.Thumb />
          </ColorArea.Root>

          <ColorSlider.Root channel="hue" defaultValue={parseColor('hsl(0, 100%, 50%)')}>
            <ColorSlider.Label>Hue</ColorSlider.Label>
            <ColorSlider.Output />
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider.Root>
        </Column>
      );
    }
    ```

<!-- pitfall: row-justify-shorthand -->
<!-- applies-to: Row -->
<!-- category: layout -->

- **Row justify prop uses shorthand tokens, not CSS property values** — `'space-between'`, `'space-around'`, `'space-evenly'`, `'flex-end'`, and `'flex-start'` are not valid `justify` values. The full set of valid values is: `'start'`, `'end'`, `'center'`, `'between'`, `'around'`, `'evenly'`. Use `justify="end"` to right-align content.
  - anti-pattern: `<Row justify="space-between">`
  - anti-pattern: `<Row justify="flex-end">`
  - fix: `<Row justify="between">`
  - fix: `<Row justify="end">`

<!-- pitfall: row-no-css-flex-props -->
<!-- applies-to: Row -->
<!-- category: layout -->
- **Row does not accept raw CSS flex properties like alignItems, flexDirection, or flexWrap** — passing these causes TypeScript errors. Use `style` for one-off overrides.
  - anti-pattern: `<Row alignItems="center">`
  - fix: `<Row style={{ alignItems: 'center' }}>`

<!-- pitfall: container-is-not-layout -->
<!-- applies-to: Container -->
<!-- category: layout -->
<!-- prose-only -->
- **Container is a colour palette wrapper, not a layout component — use the color prop for theming, not theme** — Container applies a colour palette to its subtree via the color prop (e.g. color="indigo"). Passing theme instead causes a TypeScript assignability error because theme does not exist on ContainerProps. Additionally, do not use Container as a div replacement for layout; use Column for vertical stacks and Row for horizontal layouts.
  - anti-pattern: `<Container theme="indigo">`
  - anti-pattern: `<Container style={{ display: 'flex', gap: '8px' }}>`
  - fix: `<Container color="indigo">`
  - fix: `<Column gap="m">`
  - complete example:
    ```tsx
    import { Container } from '@tale-ui/react/container';
    import { Card } from '@tale-ui/react/card';
    import { Column } from '@tale-ui/react/column';
    import { Text } from '@tale-ui/react/text';
    import { Button } from '@tale-ui/react/button';

    export function PremiumPlanSection() {
      return (
        <Container color="indigo">
          <Card.Root>
            <Card.Body>
              <Column gap="m">
                <Text variant="heading" as="h2">Premium Plan</Text>
                <Button variant="primary">Get started</Button>
              </Column>
            </Card.Body>
          </Card.Root>
        </Container>
      );
    }
    ```

<!-- pitfall: no-global-styles-on-semantic-html -->
<!-- applies-to: * -->
<!-- category: layout -->
<!-- prose-only -->

- **Do not apply global styles to semantic HTML elements** — Tale UI components render `<section>`, `<header>`, `<button>`, etc. internally, so global CSS rules targeting those elements will leak into overlays and popovers.

---

<!-- pitfall: when-a-prompt-asks-for -->
<!-- applies-to: * -->
<!-- category: layout -->

- **When a prompt asks for stacked text-only content, use `Column` with `Text`** — when a prompt asks for a page title, section heading, and supporting paragraph, import both `Text` and `Column` and render the copy as `Text` children inside `Column`. Map the prompt directly: page title to `variant="display" as="h1"`, section heading to `variant="heading" as="h2"`, and supporting paragraph copy to `variant="text" as="p"` (use `color="muted"` when the copy is described as supporting or secondary). This makes the required components explicit and prevents blank outputs for simple typography prompts.
  - anti-pattern: `export function PageIntro() {}`
  - fix: `import { Column } from '@tale-ui/react/column'; import { Text } from '@tale-ui/react/text'; export function PageIntro() { return <Column gap="s"><Text variant="display" as="h1">Page title</Text><Text variant="heading" as="h2">Section heading</Text><Text variant="text" as="p" color="muted">Supporting description.</Text></Column>; }`

<!-- pitfall: row-column-no-as-prop -->
<!-- applies-to: * -->
<!-- category: layout -->
- **Row/Column do not accept an `as` prop — they always render as `<div>` elements** — passing `as="section"` or any other element name is not in `ColumnProps`/`RowProps` and causes `Type '{ as: string; ... }' is not assignable to type 'ColumnProps'`. To use a semantic wrapper element, place the native HTML element outside `Column` or `Row`.
  - anti-pattern: `<Column gap="s" as="section">`
  - fix: `<section><Column gap="s">`

<!-- pitfall: column-and-row-align-prop -->
<!-- applies-to: * -->
<!-- category: layout -->
- **Column/Row align uses shorthand tokens, not CSS flex values** — `'flex-start'` and `'flex-end'` are not valid `align` values; use `'start'`, `'end'`, `'center'`, `'stretch'`, or `'baseline'` instead. Omit the prop entirely to use the default alignment.
  - anti-pattern: `<Column align="flex-start">`
  - anti-pattern: `<Row align="flex-end">`
  - fix: `<Column align="start">`
  - fix: `<Row align="end">`

<!-- pitfall: columnrow-gap-uses-spacingtoken-values -->
<!-- applies-to: * -->
<!-- category: layout -->
- **Column/Row gap uses spacing-token values, not component-size names** — `'sm'`, `'md'`, and `'lg'` are not valid `Gap` values and cause `Type '"sm"' is not assignable to type 'Gap | undefined'`; use `'xs'`, `'s'`, `'m'`, `'l'`, `'xl'`, or `'2xl'` instead.
  - anti-pattern: `<Column gap="sm">`
  - anti-pattern: `<Column gap="md">`
  - anti-pattern: `<Column gap="lg">`
  - anti-pattern: `<Row gap="md">`
  - anti-pattern: `<Row gap="sm">`
  - anti-pattern: `<Row gap="lg">`
  - fix: `<Column gap="s">`
  - fix: `<Column gap="m">`
  - fix: `<Column gap="l">`
  - fix: `<Row gap="m">`
  - fix: `<Row gap="s">`
  - fix: `<Row gap="l">`
  - complete example:

    ```tsx
    import { Button } from '@tale-ui/react/button';
    import { Row } from '@tale-ui/react/row';

    export function AccountActions() {
      return (
        <Row gap="s">
          <Button variant="neutral">Cancel</Button>
          <Button variant="danger">Delete account</Button>
        </Row>
      );
    }
    ```
<!-- pitfall: column-row-no-visual-inline-styles -->
<!-- applies-to: * -->
<!-- category: layout -->
- **Never apply non-layout inline styles (border, borderRadius, background) to Column or Row — use a wrapper element for visual styles** — Column and Row are pure layout primitives. Their style prop must only contain layout-related CSS properties (width, height, maxWidth, flex, alignItems, justifyContent, etc.). Visual or decorative properties such as border, borderRadius, background, and boxShadow must be placed on a wrapping native HTML element such as a div.
  - anti-pattern: `<Column align="center" style={{ padding: 'var(--space-2xl)', border: '2px dashed var(--neutral-20)', borderRadius: 'var(--radius-m)' }}>`
  - anti-pattern: `<Row style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-m)' }}>`
  - fix: `<div style={{ padding: 'var(--space-2xl)', border: '2px dashed var(--neutral-20)', borderRadius: 'var(--radius-m)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Text color="muted">...</Text></div>`
  - fix: `<div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-m)' }}><Row>...</Row></div>`
  - complete example:
    ```tsx
    import { Text } from '@tale-ui/react/text';

    export function DropZonePlaceholder() {
      return (
        <div
          style={{
            padding: 'var(--space-2xl)',
            border: '2px dashed var(--neutral-20)',
            borderRadius: 'var(--radius-m)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text color="muted">No photo selected. Choose one below.</Text>
        </div>
      );
    }
    ```

## Visual Exports

<!-- pitfall: no-visual-exports-for-interactive-ui -->
<!-- applies-to: Checkbox, Radio, Switch, ToggleButton -->
<!-- category: visual-exports -->
<!-- prose-only -->

- **Never use `.Visual` exports for interactive UI** — `Checkbox.Visual`, `Radio.Visual`, `Switch.Visual`, and `ToggleButtonVisual` are `aria-hidden` building blocks for custom composition only; they have no keyboard/pointer interaction and no accessible labelling.

---

## Dark Mode

<!-- pitfall: dark-mode-attribute-required -->
<!-- applies-to: * -->
<!-- category: dark-mode -->

- **Use `<ColorModeToggle>` for dark/light toggling — it has no `value` or `onChange` props** — `ColorModeToggle` manages `data-color-mode` on `<html>` internally; passing `value` or `onChange` causes TypeScript errors.
  - anti-pattern: `<ColorModeToggle value={mode} onChange={setMode} />`
  - fix: `import { ColorModeToggle } from '@tale-ui/react/color-mode-toggle'; ... <ColorModeToggle />`
  - complete example:
    ```tsx
    import { useEffect } from 'react';
    import { ColorModeToggle } from '@tale-ui/react/color-mode-toggle';
    export function App() {
      useEffect(() => {
        const saved = localStorage.getItem('color-mode');
        if (saved) document.documentElement.setAttribute('data-color-mode', saved);
      }, []);
      return <ColorModeToggle />;
    }
    ```

<!-- pitfall: dark-mode-never-remove-attribute -->
<!-- applies-to: * -->
<!-- category: dark-mode -->

- **Never remove `data-color-mode` — switch its value instead** — removing the attribute causes all `--color-*` and `--neutral-*` tokens to revert to light defaults.
  - anti-pattern: `document.documentElement.removeAttribute('data-color-mode');`
  - fix: `document.documentElement.setAttribute('data-color-mode', 'light');`

---

## General Conventions

<!-- pitfall: no-jsx-element-return-type -->
<!-- applies-to: * -->
<!-- category: typescript -->

- **Never annotate component return types as `JSX.Element` or use `React.FC`** — the new JSX transform is in use; write plain functions with no return type annotation.
  - anti-pattern: `export const MyComponent: React.FC = () => { ... }`
  - fix: `export function MyComponent() { ... }`

<!-- pitfall: use-default-visual-props-when-styling-is-unspecified -->
<!-- applies-to: * -->
<!-- category: visual-defaults -->

- **Use default visual props when the prompt does not request styling** — inventing non-default `variant`, `theme`, `size`, `shape`, `color`, or decorative modifiers makes underspecified prompts non-deterministic and drifts from the canonical component design.
  - anti-pattern: `<FeaturedIcon variant="brand" theme="gradient" size="lg"><Icon icon={Bell} /></FeaturedIcon>`
  - fix: `<FeaturedIcon variant="brand"><Icon icon={Bell} /></FeaturedIcon>`

<!-- pitfall: always-generate-code-directly-never -->
<!-- applies-to: * -->
<!-- category: typescript -->
- **Always generate complete, working code directly — never ask for clarification, return an empty function body, or output a blank code block** — when given a UI prompt, immediately output a full import block and component with a non-empty return; never reply with questions, option lists, an empty function, or a completely blank file with no code at all. This applies equally to simple single-component prompts and to complex multi-component compositions such as an FAQ section combining Accordion, Banner, Link, Column, and Text — complexity is never a reason to return empty code.
  - anti-pattern: `// empty file`
  - anti-pattern: `export function MyComponent() {}`
  - anti-pattern: `export function FaqSection() { return null; }`
  - anti-pattern: `export function FaqSection() {}`
  - fix: `import { Text } from '@tale-ui/react/text'; export function MyComponent() { return <Text>Hello</Text>; }`
  - fix: `import { Badge } from '@tale-ui/react/badge'; export function ActiveBadge() { return <Badge variant="success">Active</Badge>; }`
  - fix: `import { Accordion } from '@tale-ui/react/accordion'; import { Banner } from '@tale-ui/react/banner'; import { Link } from '@tale-ui/react/link'; import { Column } from '@tale-ui/react/column'; import { Text } from '@tale-ui/react/text'; export function FaqSection() { return <Column gap="l">...</Column>; }`
  - fix (for 'Create a primary button that says Save'): `import { Button } from '@tale-ui/react/button'; export function SaveButton() { return <Button variant="primary">Save</Button>; }`
  - fix (for 'Create a success badge that displays Active'): `import { Badge } from '@tale-ui/react/badge'; export function ActiveBadge() { return <Badge variant="success">Active</Badge>; }`
  - complete example:
    ```tsx
    import { Accordion } from '@tale-ui/react/accordion';
    import { Banner } from '@tale-ui/react/banner';
    import { Link } from '@tale-ui/react/link';
    import { Column } from '@tale-ui/react/column';
    import { Text } from '@tale-ui/react/text';

    export function FaqSection() {
      return (
        <Column gap="l">
          <Text variant="heading" as="h2">Frequently Asked Questions</Text>
          <Accordion.Root>
            <Accordion.Item id="what-is">
              <Accordion.Header>
                <Accordion.Trigger>What is Tale UI?</Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel>
                <Text>Tale UI is a design system providing accessible, themeable components.</Text>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item id="install">
              <Accordion.Header>
                <Accordion.Trigger>How do I install it?</Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel>
                <Text>Run <Text variant="mono">pnpm install @tale-ui/react</Text> to add Tale UI to your project.</Text>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item id="accessible">
              <Accordion.Header>
                <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel>
                <Text>Yes. Tale UI is built on a React Aria foundation, ensuring full keyboard and screen reader support.</Text>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item id="theme">
              <Accordion.Header>
                <Accordion.Trigger>Can I customize the theme?</Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel>
                <Text>Yes. Theming is done via CSS custom properties, making it easy to adapt to any brand.</Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion.Root>
          <Banner.Root variant="info">
            <Banner.Description>
              Still have questions? <Link href="/contact">Contact us</Link>
            </Banner.Description>
          </Banner.Root>
        </Column>
      );
    }
    ```

<!-- pitfall: token-size-suffixes -->
<!-- applies-to: * -->
<!-- category: typescript -->

- **Size token suffixes (-s, -m, -l) are CSS names — component size props use 'sm'/'md'/'lg' without a dash, EXCEPT `Text` which uses 'xs'/'s'/'m'/'l'** — the dash in `--space-s` is CSS token notation; prop value strings never start with a dash. `Text` is the only component whose `size` prop uses single-letter spacing-token values instead of the doubled component-size names; passing `size="sm"` to `Text` causes `Type '"sm"' is not assignable to type 'Size | undefined'`.
  - anti-pattern: `<Button size="-md">`
  - fix: `<Button size="md">`
  - anti-pattern: `<Text size="sm">Online</Text>`
  - fix: `<Text size="s">Online</Text>`

<!-- pitfall: gap-max-is-2xl -->
<!-- applies-to: Row, Column -->
<!-- category: layout -->

- **Max `gap` value for `Row`/`Column` is `'2xl'` — there is no `'3xl'` or `'4xl'` gap token** — using out-of-range gap values produces no visible spacing because the token is undefined.
  - anti-pattern: `<Row gap="3xl">`
  - fix: `<Row gap="2xl">`

<!-- pitfall: no-variant-on-html-elements -->
<!-- applies-to: * -->
<!-- category: typescript -->
<!-- prose-only -->

- **Do not add `variant`, `size`, or `color` props to native HTML elements** — these props only exist on Tale UI components and are silently ignored on `<div>`, `<p>`, `<span>`, etc.

<!-- pitfall: use-image-not-img -->
<!-- applies-to: Image -->
<!-- category: typescript -->

- **Use `<Image>` from `@tale-ui/react/image` instead of a bare `<img>`** — `Image` applies radius, lazy loading, and correct CSS; use its `radius` prop (not `borderRadius`) and `width`/`height` (not `size`).
  - anti-pattern: `<img src="..." style={{ borderRadius: '50%' }} />`
  - fix: `<Image src="..." radius="full" width={40} height={40} />`

<!-- pitfall: no-heading-component -->
<!-- applies-to: * -->
<!-- category: typescript -->

- **There is no `Heading` component — use `<Text variant="heading" as="h2">` instead of bare `<h2>`** — importing `{ Heading }` from any `@tale-ui/react/*` path causes "has no exported member" TypeScript errors; bare heading tags bypass Tale UI typography tokens.
  - anti-pattern: `import { Heading } from '@tale-ui/react';`
  - anti-pattern: `<h2>Frequently Asked Questions</h2>`
  - fix: `import { Text } from '@tale-ui/react/text'; ... <Text variant="heading" as="h2">Title</Text>`

<!-- pitfall: no-bare-p-or-span -->
<!-- applies-to: * -->
<!-- category: typescript -->

- **Never use bare `<p>` or `<span>` for text content — always use `<Text>` from `@tale-ui/react/text`** — bare paragraph and span tags bypass Tale UI typography tokens and cannot accept `color` or `variant` props.
  - anti-pattern: `<p style={{ color: 'gray' }}>This action cannot be undone.</p>`
  - fix: `<Text color="muted">This action cannot be undone.</Text>`

<!-- pitfall: component-names-must-be-valid -->
<!-- applies-to: * -->
<!-- category: typescript -->
- **Component names must be valid PascalCase identifiers with no spaces** — exported React component names must be a single valid JavaScript/TypeScript identifier; spaces, hyphens, or other invalid characters in the function name cause parser errors before JSX is checked.
  - anti-pattern: `export function Notification bell() {}`
  - fix: `export function NotificationBell() {}`
