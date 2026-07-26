# Component Usage Guide

Per-component documentation for `@tale-ui/react`. Each page covers imports, parts (for compound components), usage examples, CSS classes, and gotchas.

## Form Controls

| Component                            | Description                                                             |
| ------------------------------------ | ----------------------------------------------------------------------- |
| [Button](button.md)                  | Action button with variant and size props                               |
| [Input](input.md)                    | Text input with label, description, and validation                      |
| [Checkbox](checkbox.md)              | Deprecated checkbox with indicator slot; use CheckboxField for new code |
| [CheckboxField](checkbox-field.md)   | Checkbox with description and error slots                               |
| [CheckboxGroup](checkbox-group.md)   | Groups multiple checkboxes                                              |
| [Radio](radio.md)                    | Deprecated radio button; use RadioField for new code                    |
| [RadioField](radio-field.md)         | Radio option with description and error slots                           |
| [RadioGroup](radio-group.md)         | Group wrapper for RadioField options                                    |
| [Switch](switch.md)                  | Deprecated toggle switch; use SwitchField for new code                  |
| [SwitchField](switch-field.md)       | Toggle switch with description and error slots                          |
| [ToggleButton](toggle-button.md)     | Pressable toggle with group support                                     |
| [ToggleButtonGroup](toggle-group.md) | Convenience re-export of `ToggleButtonGroup`                            |
| [Select](select.md)                  | Dropdown select with sections and groups                                |
| [Combobox](combobox.md)              | Filterable select with multi-select support                             |
| [Autocomplete](autocomplete.md)      | Inline search with listbox                                              |
| [NumberField](number-field.md)       | Numeric input with increment/decrement                                  |
| [Slider](slider.md)                  | Range slider with single or dual thumbs                                 |
| [SearchField](search-field.md)       | Search input with clear button                                          |
| [TextField](text-field.md)           | Single-line text input with validation                                  |
| [TextArea](text-area.md)             | Multi-line text input with validation                                   |
| [PaymentInput](payment-input.md)     | Credit card number input with auto-formatting and card type detection   |
| [PinInput](pin-input.md)             | OTP/verification code input with digit slots                            |
| [SelectNative](select-native.md)     | Styled native `<select>` element                                        |

## Date & Time

| Component                               | Description                      |
| --------------------------------------- | -------------------------------- |
| [Calendar](calendar.md)                 | Interactive date calendar        |
| [RangeCalendar](range-calendar.md)      | Date range selection calendar    |
| [DateField](date-field.md)              | Segmented date input             |
| [DatePicker](date-picker.md)            | Date field with calendar popover |
| [DateRangePicker](date-range-picker.md) | Start/end date picker            |
| [TimeField](time-field.md)              | Segmented time input             |

## Color

| Component                                   | Description                   |
| ------------------------------------------- | ----------------------------- |
| [ColorArea](color-area.md)                  | 2D color picker surface       |
| [ColorSlider](color-slider.md)              | Single-channel color slider   |
| [ColorWheel](color-wheel.md)                | Circular hue selector         |
| [ColorSwatch](color-swatch.md)              | Color preview element         |
| [ColorSwatchPicker](color-swatch-picker.md) | Selectable swatch grid        |
| [ColorField](color-field.md)                | Text input for color values   |
| [ColorPicker](color-picker.md)              | Headless color state provider |

## Overlay

| Component                      | Description                |
| ------------------------------ | -------------------------- |
| [Dialog](dialog.md)            | Modal dialog with backdrop |
| [AlertDialog](alert-dialog.md) | Confirmation dialog        |
| [Popover](popover.md)          | Anchored popup             |
| [PreviewCard](preview-card.md) | Hover preview card         |
| [Drawer](drawer.md)            | Slide-out panel            |
| [Tooltip](tooltip.md)          | Hover tooltip              |

## Navigation

| Component                            | Description                                               |
| ------------------------------------ | --------------------------------------------------------- |
| [Menu](menu.md)                      | Dropdown menu with items and groups                       |
| [ContextMenu](context-menu.md)       | Right-click context menu                                  |
| [CommandPalette](command-palette.md) | Searchable command surface for app actions and navigation |
| [NavigationMenu](navigation-menu.md) | Top-level navigation bar                                  |
| [Menubar](menubar.md)                | Horizontal menu bar                                       |
| [Breadcrumbs](breadcrumbs.md)        | Breadcrumb navigation                                     |
| [Link](link.md)                      | Styled anchor link                                        |
| [Pagination](pagination.md)          | Page navigation controls                                  |

## Layout

| Component                    | Description                                  |
| ---------------------------- | -------------------------------------------- |
| [Accordion](accordion.md)    | Collapsible content sections                 |
| [Disclosure](disclosure.md)  | Single collapsible section                   |
| [Tabs](tabs.md)              | Tabbed content with indicator                |
| [ScrollArea](scroll-area.md) | Custom scrollbar container                   |
| [Separator](separator.md)    | Horizontal or vertical divider               |
| [Toolbar](toolbar.md)        | Grouped action bar                           |
| [Carousel](carousel.md)      | Embla-powered slide carousel with navigation |

## Feedback

| Component                      | Description                                       |
| ------------------------------ | ------------------------------------------------- |
| [Banner](banner.md)            | Inline notification banner with semantic variants |
| [ProgressBar](progress-bar.md) | Determinate/indeterminate progress                |
| [Meter](meter.md)              | Scalar measurement display                        |
| [Spinner](spinner.md)          | Indeterminate loading indicator                   |

## Display

| Component                        | Description                                  |
| -------------------------------- | -------------------------------------------- |
| [Avatar](avatar.md)              | User avatar with image and fallback          |
| [Badge](badge.md)                | Small status label with semantic variants    |
| [DotIcon](dot-icon.md)           | Small colored circle status indicator        |
| [EmptyState](empty-state.md)     | Placeholder for empty content areas          |
| [FeaturedIcon](featured-icon.md) | Themed background wrapper for icons          |
| [GridList](grid-list.md)         | Selectable grid of items                     |
| [ListBox](list-box.md)           | Standalone selectable listbox                |
| [RatingBadge](rating-badge.md)   | Pill badge with star icon and numeric rating |
| [RatingStars](rating-stars.md)   | Read-only star rating display                |
| [Table](table.md)                | Data table with sorting                      |
| [TagGroup](tag-group.md)         | Tag list with optional removal               |
| [Tree](tree.md)                  | Hierarchical tree view                       |

## Form Structure

| Component               | Description                                  |
| ----------------------- | -------------------------------------------- |
| [Field](field.md)       | Form field wrapper with label and validation |
| [Fieldset](fieldset.md) | Grouped fields with legend                   |
| [Form](form.md)         | Form element with validation                 |

## Interaction

| Component                      | Description                |
| ------------------------------ | -------------------------- |
| [DropZone](drop-zone.md)       | Drag-and-drop target       |
| [FileTrigger](file-trigger.md) | Native file picker trigger |

## Marketing

| Component                                   | Description                                         |
| ------------------------------------------- | --------------------------------------------------- |
| [AppStoreButton](app-store-button.md)       | App store download button (Apple/Google)            |
| [SocialButton](social-button.md)            | Social login button with provider icon              |
| [SocialButtonGroup](social-button-group.md) | Equal-width vertical group for social login buttons |

## Utility

| Component                               | Description                               |
| --------------------------------------- | ----------------------------------------- |
| [ColorModeToggle](color-mode-toggle.md) | Light/dark mode toggle with persistence   |
| [Container](container.md)               | Colour palette override wrapper           |
| [CSPProvider](csp-provider.md)          | Content Security Policy nonce provider    |
| [I18nProvider](i18n-provider.md)        | Locale and text direction provider        |
| [Icon](icon.md)                         | Lucide-react icon wrapper with BEM sizing |
| [IconButton](icon-button.md)            | Square button for icon-only use           |
| [mergeProps](merge-props.md)            | Smart React props merging utility         |
| [Virtualizer](virtualizer.md)           | Virtualized collection utilities          |
