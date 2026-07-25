# Component Index

Quick-reference table for all 116 `@tale-ui/react` components plus 6 `@tale-ui/charts` components.
For detailed usage, see the per-component docs in [docs/components/](components/index.md).

## Form Controls (27)

| Component         | Description                                                                   | Import                          | Parts                                                                                                                                      |
| ----------------- | ----------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Button            | Action button with variant and size props                                     | `@tale-ui/react/button`         | --                                                                                                                                         |
| Input             | Text input with label, description, and validation                            | `@tale-ui/react/input`          | Root, Input, Label, Description, ErrorMessage                                                                                              |
| InputGroup        | Horizontal group container attaching addons to an input field                 | `@tale-ui/react/input-group`    | Root, Addon                                                                                                                                |
| InputTags         | Tag chip input — type to add tags, press Enter to commit, Backspace to remove | `@tale-ui/react/input-tags`     | Root                                                                                                                                       |
| MultiSelect       | Multi-value dropdown with inline search and optional footer actions           | `@tale-ui/react/multi-select`   | Root, Item, Footer, EmptyState                                                                                                             |
| TagSelect         | Combobox that renders selected items as inline tag chips in the field         | `@tale-ui/react/tag-select`     | Root, Item                                                                                                                                 |
| Checkbox          | Checkbox with visual indicator (deprecated — use CheckboxField)               | `@tale-ui/react/checkbox`       | Root, Indicator                                                                                                                            |
| CheckboxField     | Checkbox with built-in description and error message                          | `@tale-ui/react/checkbox-field` | Root, Button, Indicator, Description, Error                                                                                                |
| CheckboxGroup     | Groups multiple checkboxes with validation                                    | `@tale-ui/react/checkbox-group` | --                                                                                                                                         |
| Radio             | Radio button with group support (deprecated — use RadioField)                 | `@tale-ui/react/radio`          | Group, Root, Indicator, Dot                                                                                                                |
| RadioField        | Radio button with built-in description and error message                      | `@tale-ui/react/radio-field`    | Root, Button, Indicator, Dot, Description, Error                                                                                           |
| RadioGroup        | Group of mutually exclusive radio buttons with label and validation           | `@tale-ui/react/radio-group`    | --                                                                                                                                         |
| Switch            | Toggle switch with sliding thumb (deprecated — use SwitchField)               | `@tale-ui/react/switch`         | Root, Thumb                                                                                                                                |
| SwitchField       | Toggle switch with built-in description and error message                     | `@tale-ui/react/switch-field`   | Root, Button, Thumb, Description, Error                                                                                                    |
| ToggleButton      | Pressable toggle with selected/unselected state                               | `@tale-ui/react/toggle-button`  | --                                                                                                                                         |
| ToggleButtonGroup | Group of toggle buttons                                                       | `@tale-ui/react/toggle-group`   | --                                                                                                                                         |
| Select            | Dropdown select with popover listbox                                          | `@tale-ui/react/select`         | Root, Label, Trigger, Value, Icon, Popover, ListBox, Item, Section, Header, ItemText, ItemIndicator, Separator                             |
| Combobox          | Filterable select with multi-select support                                   | `@tale-ui/react/combobox`       | Root, Label, InputGroup, Input, Trigger, Popover, ListBox, Item, Section, Header, Empty, Chips, Chip, ChipRemove, ItemIndicator, Separator |
| Autocomplete      | Inline search with filterable listbox                                         | `@tale-ui/react/autocomplete`   | Root, SearchField, Input, ListBox, Item, Section, Header, Empty, Separator                                                                 |
| NumberField       | Numeric input with increment/decrement                                        | `@tale-ui/react/number-field`   | Root, Label, Group, Input, Increment, Decrement, Description, ErrorMessage                                                                 |
| Slider            | Range input with single or dual thumbs                                        | `@tale-ui/react/slider`         | Root, Header, Label, Output, Control, Track, Indicator, Thumb                                                                              |
| SearchField       | Search input with clear button                                                | `@tale-ui/react/search-field`   | Root, Input, Label, Description, ErrorMessage, ClearButton                                                                                 |
| TextField         | Single-line text input with validation                                        | `@tale-ui/react/text-field`     | Root, Input, Label, Description, ErrorMessage                                                                                              |
| TextArea          | Multi-line text input with validation                                         | `@tale-ui/react/text-area`      | Root, TextArea, Label, Description, ErrorMessage                                                                                           |
| PaymentInput      | Credit card number input with auto-formatting and card type detection         | `@tale-ui/react/payment-input`  | Root, Label, Group, Input, CardIcon, Description, ErrorMessage                                                                             |
| PinInput          | OTP/verification code input                                                   | `@tale-ui/react/pin-input`      | Root, Group, Slot, Separator                                                                                                               |
| SelectNative      | Styled native `<select>` element                                              | `@tale-ui/react/select-native`  | --                                                                                                                                         |

## Date & Time (6)

| Component       | Description                                                 | Import                             | Parts                                                                                                                        |
| --------------- | ----------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Calendar        | Interactive date calendar with single or multiple selection | `@tale-ui/react/calendar`          | Root, Header, PreviousButton, NextButton, Heading, Grid, GridHeader, GridHeaderCell, GridBody, Cell, MonthPicker, YearPicker |
| RangeCalendar   | Date range selection calendar                               | `@tale-ui/react/range-calendar`    | Root, Header, Grid, GridHeader, GridHeaderCell, GridBody, Cell, Heading, PreviousButton, NextButton                          |
| DateField       | Segmented date input                                        | `@tale-ui/react/date-field`        | Root, DateInput, Segment, Label, Description, ErrorMessage                                                                   |
| DatePicker      | Date field with calendar popover                            | `@tale-ui/react/date-picker`       | Root, Group, DateInput, Segment, Trigger, Popover, Dialog, Label, Description, ErrorMessage                                  |
| DateRangePicker | Start/end date picker                                       | `@tale-ui/react/date-range-picker` | Root, Group, StartDate, EndDate, Segment, Trigger, Popover, Dialog, Label, Description, ErrorMessage                         |
| TimeField       | Segmented time input                                        | `@tale-ui/react/time-field`        | Root, DateInput, Segment, Label, Description, ErrorMessage                                                                   |

## Color (7)

| Component         | Description                                                                                        | Import                               | Parts                                         |
| ----------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------ | --------------------------------------------- |
| ColorArea         | Interactive saturation/brightness canvas for picking a color value                                 | `@tale-ui/react/color-area`          | Root, Thumb                                   |
| ColorSlider       | Single-channel color slider                                                                        | `@tale-ui/react/color-slider`        | Root, Track, Thumb, Label, Output             |
| ColorWheel        | Circular hue selector                                                                              | `@tale-ui/react/color-wheel`         | Root, Track, Thumb                            |
| ColorSwatch       | Small colored circle or square showing a color value                                               | `@tale-ui/react/color-swatch`        | --                                            |
| ColorSwatchPicker | Selectable swatch grid                                                                             | `@tale-ui/react/color-swatch-picker` | Root, Item                                    |
| ColorField        | Text input for color values                                                                        | `@tale-ui/react/color-field`         | Root, Input, Label, Description, ErrorMessage |
| ColorPicker       | Composable color picker that provides shared color state to ColorArea, ColorSlider, and ColorWheel | `@tale-ui/react/color-picker`        | --                                            |

## Overlay (6)

| Component   | Description                                                                                  | Import                        | Parts                                                                        |
| ----------- | -------------------------------------------------------------------------------------------- | ----------------------------- | ---------------------------------------------------------------------------- |
| Dialog      | Modal dialog with backdrop                                                                   | `@tale-ui/react/dialog`       | Root, Trigger, Backdrop, Popup, Title, Description, Close, Actions           |
| AlertDialog | Blocking dialog for destructive or irreversible actions requiring explicit user confirmation | `@tale-ui/react/alert-dialog` | Root, Trigger, Backdrop, Popup, Content, Title, Description, Close, Actions  |
| Popover     | Floating panel anchored to a trigger element, for pickers, tooltips, and contextual content  | `@tale-ui/react/popover`      | Root, Trigger, Popup, Arrow, Title, Description, Close                       |
| PreviewCard | Floating preview panel that appears when hovering a link or trigger element                  | `@tale-ui/react/preview-card` | Root, Trigger, Popup, Content, Arrow                                         |
| Drawer      | Panel that slides in from the screen edge, for navigation drawers and detail views           | `@tale-ui/react/drawer`       | Root, Trigger, Backdrop, Popup, Title, Description, Close, Handle, SwipeArea |
| Tooltip     | Hover tooltip                                                                                | `@tale-ui/react/tooltip`      | Root, Trigger, Popup, Arrow, Title, Description                              |

## Navigation (12)

| Component      | Description                                                                                       | Import                           | Parts                                                                                                                                                                                                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Menu           | Dropdown menu with items and groups                                                               | `@tale-ui/react/menu`            | Root, Trigger, Popover, MenuList, Item, Group, Header, Separator, Arrow, CheckboxItem, RadioItem, LinkItem, SubmenuTrigger                                                                                                                                                                     |
| ContextMenu    | Right-click context menu                                                                          | `@tale-ui/react/context-menu`    | Root, Trigger, Popup, MenuList, Item, Group, Separator                                                                                                                                                                                                                                         |
| CommandPalette | Searchable command surface for app actions, navigation, and grouped workflows                     | `@tale-ui/react/command-palette` | Root, Trigger, Backdrop, Popup, Title, Description, Close, Content, SearchField, Input, ClearButton, ListBox, Section, SectionHeader, Item, ItemIcon, ItemContent, ItemTitle, ItemDescription, ItemMeta, Shortcut, Separator, LoadMoreItem, Collection, Empty, Footer, Chips, Chip, ChipRemove |
| NavigationMenu | Top-level navigation bar                                                                          | `@tale-ui/react/navigation-menu` | Root, List, Item, Link, Trigger, Popup, Content, Icon                                                                                                                                                                                                                                          |
| Menubar        | Horizontal menu bar                                                                               | `@tale-ui/react/menubar`         | Root, Item                                                                                                                                                                                                                                                                                     |
| Breadcrumbs    | Breadcrumb navigation                                                                             | `@tale-ui/react/breadcrumbs`     | Root, Item, Link                                                                                                                                                                                                                                                                               |
| Link           | Styled anchor link                                                                                | `@tale-ui/react/link`            | --                                                                                                                                                                                                                                                                                             |
| Pagination     | Page navigation controls                                                                          | `@tale-ui/react/pagination`      | Root, PreviousTrigger, NextTrigger, Item, Ellipsis, Dot, Line                                                                                                                                                                                                                                  |
| PaginationDot  | Auto-rendering dot indicators for carousel/slide pagination                                       | `@tale-ui/react/pagination-dot`  | --                                                                                                                                                                                                                                                                                             |
| PaginationLine | Auto-rendering line indicators for carousel/slide pagination                                      | `@tale-ui/react/pagination-line` | --                                                                                                                                                                                                                                                                                             |
| Sidebar        | Sidebar navigation primitives for composing simple, dual-tier, slim, and section-divided sidebars | `@tale-ui/react/sidebar`         | Root, Header, Search, Divider, NavList, NavItem, NavButton, AccountCard, AccountMenu, MobileTrigger, FeatureCard                                                                                                                                                                               |
| HeaderNav      | Horizontal header navigation primitives                                                           | `@tale-ui/react/header-nav`      | Root, Logo, NavButton, Actions, Secondary, MobileTrigger                                                                                                                                                                                                                                       |

## Layout (10)

| Component  | Description                                                                  | Import                       | Parts                                                                    |
| ---------- | ---------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------ |
| Accordion  | Collapsible content sections                                                 | `@tale-ui/react/accordion`   | Root, Item, Header, Trigger, Panel                                       |
| Card       | Presentational and interactive card surfaces                                 | `@tale-ui/react/card`        | Root, Button, Header, Body, Footer                                       |
| Carousel   | Slide carousel with navigation                                               | `@tale-ui/react/carousel`    | Root, Content, Item, PreviousTrigger, NextTrigger, Indicators, Indicator |
| Column     | Vertical flex-column layout with gap, align, and justify props               | `@tale-ui/react/column`      | --                                                                       |
| Disclosure | Single collapsible section                                                   | `@tale-ui/react/disclosure`  | Root, Trigger, Panel                                                     |
| Row        | Horizontal flex-row layout with gap, align, and justify props                | `@tale-ui/react/row`         | --                                                                       |
| ScrollArea | Custom scrollbar container                                                   | `@tale-ui/react/scroll-area` | Root, Viewport, Content, Scrollbar, Thumb, Corner                        |
| Separator  | Horizontal or vertical divider                                               | `@tale-ui/react/separator`   | --                                                                       |
| Tabs       | Tabbed content with indicator                                                | `@tale-ui/react/tabs`        | Root, List, Tab, Panel, Indicator                                        |
| Toolbar    | Horizontal bar of buttons, toggles, or controls for a related set of actions | `@tale-ui/react/toolbar`     | Root, Group, Button, Link, Input, Separator                              |

## Feedback (5)

| Component      | Description                                                                        | Import                           | Parts                                                |
| -------------- | ---------------------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------- |
| Banner         | Inline notification banner                                                         | `@tale-ui/react/banner`          | Root, BannerIcon, Title, Description, Actions, Close |
| ProgressBar    | Determinate/indeterminate linear progress                                          | `@tale-ui/react/progress-bar`    | Root, Header, Label, Value, Track, Indicator         |
| ProgressCircle | Determinate/indeterminate circular progress                                        | `@tale-ui/react/progress-circle` | Root, Track, Label, Value                            |
| Meter          | Gauge showing a known-range value such as storage used, battery level, or capacity | `@tale-ui/react/meter`           | Root, Header, Label, Value, Track, Indicator         |
| Spinner        | Indeterminate loading indicator                                                    | `@tale-ui/react/spinner`         | --                                                   |

## Display (17)

| Component     | Description                                                                                           | Import                           | Parts                                                                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Avatar        | User avatar with image, fallback, group, count, indicator, and label group                            | `@tale-ui/react/avatar`          | Root, Image, Fallback, Group, Count, Indicator, LabelGroup, LabelGroupTitle, LabelGroupSubtitle, AddButton, CompanyIcon, VerifiedTick, ProfilePhoto |
| Badge         | Small status label with semantic variants                                                             | `@tale-ui/react/badge`           | --                                                                                                                                                  |
| DotIcon       | Small colored circle status indicator                                                                 | `@tale-ui/react/dot-icon`        | --                                                                                                                                                  |
| EmptyState    | Placeholder for empty content areas                                                                   | `@tale-ui/react/empty-state`     | Root, EmptyStateIcon, Title, Description, Actions                                                                                                   |
| FeaturedIcon  | Icon with a colored background shape (circle or square); used for feature highlights and empty states | `@tale-ui/react/featured-icon`   | --                                                                                                                                                  |
| GridList      | Selectable grid of items                                                                              | `@tale-ui/react/grid-list`       | Root, Item                                                                                                                                          |
| Image         | Styled image wrapper with radius and fit props                                                        | `@tale-ui/react/image`           | --                                                                                                                                                  |
| KeyValuePairs | Semantic description-list display for labels and corresponding values                                 | `@tale-ui/react/key-value-pairs` | Root, Item, Term, Details, Info, Group, GroupTitle, GroupList                                                                                       |
| List          | Simple non-interactive list with optional dividers                                                    | `@tale-ui/react/list`            | Root, Item                                                                                                                                          |
| ListBox       | Standalone selectable listbox                                                                         | `@tale-ui/react/list-box`        | Root, Item, Section, Header, Text, SelectionIndicator, LoadMoreItem, Collection                                                                     |
| QRCode        | QR code generator with size variants and decorative scan overlay                                      | `@tale-ui/react/qr-code`         | Root, Scan                                                                                                                                          |
| RatingBadge   | Pill badge with star icon and numeric rating                                                          | `@tale-ui/react/rating-badge`    | --                                                                                                                                                  |
| RatingStars   | Read-only star rating display                                                                         | `@tale-ui/react/rating-stars`    | --                                                                                                                                                  |
| Table         | Data table with sorting, expandable rows, and footer                                                  | `@tale-ui/react/table`           | Root, Header, Column, Body, Footer, Row, Cell                                                                                                       |
| TagGroup      | Tag list with optional removal                                                                        | `@tale-ui/react/tag-group`       | Root, Label, List, Tag, Description, ErrorMessage                                                                                                   |
| Tree          | Hierarchical tree view                                                                                | `@tale-ui/react/tree`            | Root, Item, ItemContent                                                                                                                             |
| VideoPlayer   | Native video player with custom controls, keyboard shortcuts, and trickplay                           | `@tale-ui/react/video-player`    | Root                                                                                                                                                |

## Form Structure (3)

| Component | Description                                  | Import                    | Parts                                          |
| --------- | -------------------------------------------- | ------------------------- | ---------------------------------------------- |
| Field     | Form field wrapper with label and validation | `@tale-ui/react/field`    | Root, Label, Control, Description, Error, Item |
| Fieldset  | Grouped fields with legend                   | `@tale-ui/react/fieldset` | Root, Legend                                   |
| Form      | Form element with validation                 | `@tale-ui/react/form`     | --                                             |

## Interaction (5)

| Component    | Description                                                               | Import                         | Parts                                                                                                                                                                                          |
| ------------ | ------------------------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DropZone     | Drag-and-drop target                                                      | `@tale-ui/react/drop-zone`     | --                                                                                                                                                                                             |
| FileTrigger  | Native file picker trigger                                                | `@tale-ui/react/file-trigger`  | --                                                                                                                                                                                             |
| FileUpload   | Drop zone + animated upload list with progress bars                       | `@tale-ui/react/file-upload`   | Root, DropZone, List, ListItem, ListItemProgressBar, ListItemProgressFill                                                                                                                      |
| ImageCropper | Interactive image crop region with aspect ratio and circular crop support | `@tale-ui/react/image-cropper` | Root, Img                                                                                                                                                                                      |
| TextEditor   | Rich-text editor built on Tiptap v3 with simple and advanced toolbars     | `@tale-ui/react/text-editor`   | Root, Label, HintText, Content, Toolbar, BubbleMenu, Bold, Italic, Underline, BulletList, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link, Image, Color, FontFamily, FontSize, Generate |

## Typography (1)

| Component | Description                                                         | Import                | Parts |
| --------- | ------------------------------------------------------------------- | --------------------- | ----- |
| Text      | Polymorphic typography wrapper with variant, size, and colour props | `@tale-ui/react/text` | --    |

## Utility (8)

| Component       | Description                                                                                               | Import                             | Parts |
| --------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------- | ----- |
| ColorModeToggle | Light/dark mode toggle with persistence                                                                   | `@tale-ui/react/color-mode-toggle` | --    |
| Container       | Wraps children in a different color theme (e.g. dark section inside a light page, or brand-colored panel) | `@tale-ui/react/container`         | --    |
| CSPProvider     | Content Security Policy nonce provider                                                                    | `@tale-ui/react/csp-provider`      | --    |
| I18nProvider    | Locale and text direction provider                                                                        | `@tale-ui/react/i18n-provider`     | --    |
| Icon            | Lucide-react icon wrapper with BEM sizing                                                                 | `@tale-ui/react/icon`              | --    |
| IconButton      | Square button for icon-only use                                                                           | `@tale-ui/react/icon-button`       | --    |
| mergeProps      | Smart React props merging utility                                                                         | `@tale-ui/react/merge-props`       | --    |
| Virtualizer     | Virtualized collection utilities                                                                          | `@tale-ui/react/virtualizer`       | --    |

## Marketing (9)

| Component         | Description                                                          | Import                              | Parts |
| ----------------- | -------------------------------------------------------------------- | ----------------------------------- | ----- |
| AppStoreButton    | App store download button (Apple/Google)                             | `@tale-ui/react/app-store-button`   | --    |
| SocialButton      | Social login button with provider icon                               | `@tale-ui/react/social-button`      | --    |
| SocialButtonGroup | Equal-width vertical group for social login buttons                  | `@tale-ui/react/social-button`      | --    |
| BadgeGroup        | Badge with pinned leading or trailing addon text                     | `@tale-ui/react/badge-group`        | Root  |
| SectionDivider    | Decorative full-width horizontal rule with section spacing           | `@tale-ui/react/section-divider`    | --    |
| BackgroundPattern | Decorative SVG pattern background (circle, square, grid, grid-check) | `@tale-ui/react/background-pattern` | --    |
| Illustration      | Decorative marketing illustration SVG with optional children overlay | `@tale-ui/react/illustration`       | --    |
| IPhoneMockup      | Decorative iPhone SVG frame with embedded screenshot                 | `@tale-ui/react/iphone-mockup`      | --    |
| CreditCard        | Visual credit-card display with 13 style variants                    | `@tale-ui/react/credit-card`        | Root  |

## Charts (6)

| Component      | Description                   | Import                             | Parts                                                                    |
| -------------- | ----------------------------- | ---------------------------------- | ------------------------------------------------------------------------ |
| AreaChart      | Token-themed area chart       | `@tale-ui/charts/area-chart`       | Root, Area, XAxis, YAxis, Grid, Tooltip, Legend                          |
| BarChart       | Token-themed bar chart        | `@tale-ui/charts/bar-chart`        | Root, Bar, XAxis, YAxis, Grid, Tooltip, Legend                           |
| LineChart      | Token-themed line chart       | `@tale-ui/charts/line-chart`       | Root, Line, XAxis, YAxis, Grid, Tooltip, Legend                          |
| PieChart       | Token-themed pie chart        | `@tale-ui/charts/pie-chart`        | Root, Pie, Cell, Tooltip, Legend                                         |
| RadarChart     | Token-themed radar chart      | `@tale-ui/charts/radar-chart`      | Root, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend |
| RadialBarChart | Token-themed radial bar chart | `@tale-ui/charts/radial-bar-chart` | Root, RadialBar, Tooltip, Legend                                         |
