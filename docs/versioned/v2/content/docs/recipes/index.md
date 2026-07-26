# Recipes

Copy-paste multi-component patterns for common real-world scenarios. Each recipe uses Tale UI's compound parts API and is ready to drop into your project.

## Forms

| Recipe                                          | Components Used                                                    | Description                                            |
| ----------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------ |
| [Form with Validation](form-with-validation.md) | TextField, Select, Checkbox, Button, Fieldset, Form                | Complete form with field validation and error handling |
| [Form Error Handling](form-error-handling.md)   | TextField, Select, Button, Form                                    | Field-level validation with isInvalid and ErrorMessage |
| [React Hook Form](react-hook-form.md)           | TextField, Select, Checkbox, Switch, Button, Fieldset              | Integrating RHF Controller with Tale UI compound parts |
| [Settings Page](settings-page.md)               | Fieldset, Switch, RadioGroup, TextField, Select, Button, Separator | Grouped settings form with save/cancel                 |

## Data Display

| Recipe                                                  | Components Used                               | Description                                         |
| ------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------- |
| [Data Table with Sorting](data-table-with-sorting.md)   | Table, Menu, Icon, Pagination                 | Sortable data table with row actions and pagination |
| [Empty Data State](empty-data-state.md)                 | EmptyState, Table, List                       | Fallback UIs when tables or lists have no data      |
| [Dashboard with Charts](dashboard-with-charts.md)       | BarChart, LineChart, PieChart, ChartContainer | Multi-chart dashboard layout                        |
| [Search with Autocomplete](search-with-autocomplete.md) | Combobox, Icon                                | Search input with filtered suggestions              |

## Navigation — Sidebar

| Recipe                                                                 | Components Used                                                  | Description                                            |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------ |
| [Sidebar — Simple](sidebar-simple.md)                                  | Sidebar                                                          | Single-tier sidebar with logo, nav, and account card   |
| [Sidebar — Dual Tier](sidebar-dual-tier.md)                            | Sidebar, Row, Text                                               | Slim icon rail + secondary label panel on hover        |
| [Sidebar — Slim (Icon Only)](sidebar-slim.md)                          | Sidebar, Row                                                     | Permanent icon-only sidebar with accessible labels     |
| [Sidebar — Section Dividers](sidebar-section-dividers.md)              | Sidebar                                                          | Multiple nav groups separated by visual dividers       |
| [Sidebar — Sections with Subheadings](sidebar-sections-subheadings.md) | Sidebar                                                          | Named section labels above each nav group              |
| [Sidebar Navigation](sidebar-navigation.md)                            | NavigationMenu, Drawer, Icon, Row, Separator                     | Responsive sidebar with mobile drawer (NavigationMenu) |
| [Sidebar with Header](sidebar-with-header.md)                          | NavigationMenu, HeaderNav, Drawer, IconButton, Button, Separator | Two-region layout: fixed sidebar + top header          |

## Navigation — Header

| Recipe                                            | Components Used                                  | Description                                                  |
| ------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| [App Header Navigation](app-header-navigation.md) | HeaderNav, Menu, Avatar, SearchField, IconButton | Application header with logo, nav links, search, and account |
| [Marketing Header](marketing-header.md)           | HeaderNav, Menu, Button, Icon                    | Marketing site header with nav dropdowns and CTA buttons     |
| [Header Navigation](header-navigation.md)         | HeaderNav, Button, IconButton, Separator         | Horizontal nav bar with logo and actions                     |

## Navigation — Command Palette

| Recipe                                                                          | Components Used                                  | Description                                                    |
| ------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------- |
| [Command Palette - Basic](command-palette-basic.md)                             | CommandPalette                                   | Global command palette with grouped application actions        |
| [Command Palette - Dashboard](command-palette-dashboard.md)                     | CommandPalette, hooks                            | Controlled dashboard command palette with shortcuts            |
| [Command Palette - Async Results](command-palette-async.md)                     | CommandPalette, hooks                            | Palette that combines local commands and remote results        |
| [Command Palette - Visual Discovery](command-palette-visual-discovery.md)       | CommandPalette, Tabs, Button, Row, Card, Badge   | Visual browsing palette with vertical tabs and dynamic content |
| [Command Palette - Rich Results](command-palette-rich-results.md)               | CommandPalette, Avatar, Badge, Button, Icon, Row | Mixed people, docs, and actions with rich item slots           |
| [Command Palette - Forced Dark](command-palette-forced-dark.md)                 | CommandPalette, Badge, Icon                      | Palette scoped to dark mode on otherwise light surfaces        |
| [Command Palette - Translucent Surface](command-palette-translucent-surface.md) | CommandPalette, Badge, Card, Icon, Text          | Neutral translucent palette with background blur               |

## Dropdowns — Button Trigger

| Recipe                                                      | Components Used   | Description                                           |
| ----------------------------------------------------------- | ----------------- | ----------------------------------------------------- |
| [Dropdown — Button (Simple)](dropdown-button-simple.md)     | Menu              | Basic dropdown with a button trigger and action items |
| [Dropdown — Button (With Links)](dropdown-button-link.md)   | Menu              | Dropdown where items navigate to routes               |
| [Dropdown — Button (Advanced)](dropdown-button-advanced.md) | Menu, Badge, Icon | Rich dropdown with groups, icons, and badges          |

## Dropdowns — Icon Trigger

| Recipe                                                         | Components Used | Description                                         |
| -------------------------------------------------------------- | --------------- | --------------------------------------------------- |
| [Dropdown — Icon Button (Simple)](dropdown-icon-simple.md)     | Menu, Icon      | Three-dot ellipsis dropdown for row-level actions   |
| [Dropdown — Icon Button (Advanced)](dropdown-icon-advanced.md) | Menu, Icon      | Ellipsis dropdown with groups, icons, and a submenu |

## Dropdowns — Search

| Recipe                                                           | Components Used                    | Description                                                |
| ---------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------- |
| [Dropdown — With Search (Simple)](dropdown-search-simple.md)     | Menu, SearchField                  | Dropdown with inline search field for filtering items      |
| [Dropdown — With Search (Advanced)](dropdown-search-advanced.md) | Menu, SearchField, Avatar, Spinner | Searchable dropdown with grouped results and async support |

## Pickers

| Recipe                          | Components Used                                  | Description                         |
| ------------------------------- | ------------------------------------------------ | ----------------------------------- |
| [Emoji Picker](emoji-picker.md) | Popover, SearchField, ListBox, Virtualizer, Text | Searchable virtualized emoji picker |

## Dropdowns — Account

| Recipe                                                             | Components Used                 | Description                                                  |
| ------------------------------------------------------------------ | ------------------------------- | ------------------------------------------------------------ |
| [Dropdown — Avatar Trigger](dropdown-avatar.md)                    | Menu, Avatar                    | Account menu triggered by clicking an avatar                 |
| [Dropdown — Account Button](dropdown-account-button.md)            | Menu, Avatar, Icon              | Full-width account button with name, email, and chevron      |
| [Dropdown — Account in Breadcrumb](dropdown-account-breadcrumb.md) | Menu, Breadcrumbs, Avatar, Icon | Workspace/account switcher embedded in a breadcrumb trail    |
| [Dropdown — Account Card (XS)](dropdown-account-card-xs.md)        | Menu, Avatar, Icon              | Compact XS account card for dense sidebars or toolbars       |
| [Dropdown — Account Card (SM)](dropdown-account-card-sm.md)        | Menu, Avatar, Icon              | Small account card showing name and email — most common size |
| [Dropdown — Account Card (MD)](dropdown-account-card-md.md)        | Menu, Avatar, Badge, Icon       | Medium card with larger avatar, role, and plan badge         |

## Dropdowns — Other

| Recipe                                            | Components Used   | Description                                                |
| ------------------------------------------------- | ----------------- | ---------------------------------------------------------- |
| [Dropdown — Integration](dropdown-integration.md) | Menu, Badge, Icon | Selector for connected integrations with status indicators |

## Feedback & Loading

| Recipe                                  | Components Used              | Description                                                   |
| --------------------------------------- | ---------------------------- | ------------------------------------------------------------- |
| [Loading Patterns](loading-patterns.md) | Spinner, ProgressBar, Button | Spinner, determinate/indeterminate progress, Button isPending |

## Utilities

| Recipe                                      | Components Used | Description                                     |
| ------------------------------------------- | --------------- | ----------------------------------------------- |
| [useClipboard](use-clipboard.md)            | Button          | Copy-to-clipboard hook with auto-reset feedback |
| [useResizeObserver](use-resize-observer.md) | —               | Observe element size changes via ResizeObserver |
