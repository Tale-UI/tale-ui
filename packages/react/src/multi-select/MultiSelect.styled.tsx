import * as React from 'react';
import { ChevronDown, Search } from 'lucide-react';
import {
  Autocomplete as AriaAutocomplete,
  Button as AriaButton,
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Input as AriaInput,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  Popover as AriaPopover,
  SearchField as AriaSearchField,
  useFilter,
} from 'react-aria-components';
import type { ListBoxItemProps as AriaListBoxItemProps, Selection } from 'react-aria-components';
import { Icon } from '../icon';
import { cx } from '../_cx';
import { useTaleUiId } from '../utils/useTaleUiId';

// ── Context ────────────────────────────────────────────────────────────────

interface MultiSelectContextValue {
  size: 'sm' | 'md' | 'lg';
}

const MultiSelectContext = React.createContext<MultiSelectContextValue>({ size: 'md' });

// ── Root ───────────────────────────────────────────────────────────────────

export interface RootProps<T extends object = object> extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'onChange' | 'children'
> {
  /**
   * Size variant.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /** Label text displayed above the trigger. */
  label?: React.ReactNode;
  /** Placeholder text shown when nothing is selected. */
  placeholder?: string;
  /** Helper text displayed below the trigger. */
  description?: React.ReactNode;
  /** Error message shown when `isInvalid` is true. */
  errorMessage?: React.ReactNode;
  /** Whether the field is disabled. */
  isDisabled?: boolean;
  /** Whether the field is required. */
  isRequired?: boolean;
  /** Whether the field is in an error state. */
  isInvalid?: boolean;
  /** Items to render in the listbox. Pass alongside a render-prop `children`. */
  items?: Iterable<T>;
  /**
   * Render each item, or pass `<MultiSelect.Item>` nodes directly.
   */
  children: React.ReactNode | ((item: T) => React.ReactNode);
  /** Controlled selected keys. */
  selectedKeys?: Selection;
  /** Default selected keys for uncontrolled mode. */
  defaultSelectedKeys?: Selection;
  /** Called when the selection changes. */
  onSelectionChange?: (keys: Selection) => void;
  /**
   * Whether to show the search input inside the dropdown.
   * @default true
   */
  showSearch?: boolean;
  /**
   * Whether to show the footer with Reset/Select All actions.
   * @default true
   */
  showFooter?: boolean;
  /** Called when the Reset button in the footer is clicked. */
  onReset?: () => void;
  /** Called when the Select All button in the footer is clicked. */
  onSelectAll?: () => void;
  /** Custom formatter for the selected count displayed in the trigger. */
  selectedCountFormatter?: (count: number) => React.ReactNode;
  /** Supporting text rendered next to the count in the trigger. */
  supportingText?: React.ReactNode;
  /** Title shown in the empty state when no items match the search. */
  emptyStateTitle?: string;
  /** Description shown in the empty state when no items match the search. */
  emptyStateDescription?: string;
}

/**
 * A multi-value select with an inline search field and optional footer actions.
 *
 * @example
 * ```tsx
 * import { MultiSelect } from '@tale-ui/react/multi-select';
 *
 * <MultiSelect.Root
 *   label="Technologies"
 *   placeholder="Select technologies"
 *   items={options}
 *   onSelectionChange={setSelected}
 * >
 *   {(item) => (
 *     <MultiSelect.Item id={item.id} textValue={item.name}>
 *       {item.name}
 *     </MultiSelect.Item>
 *   )}
 * </MultiSelect.Root>
 * ```
 */
export function Root<T extends object>({
  size = 'md',
  label,
  placeholder = 'Select',
  description,
  errorMessage,
  isDisabled,
  isRequired,
  isInvalid,
  items,
  children,
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  showSearch = true,
  showFooter = true,
  onReset,
  onSelectAll,
  selectedCountFormatter,
  supportingText,
  emptyStateTitle = 'No results found',
  emptyStateDescription = 'Please try a different search term.',
  className,
  ...rest
}: RootProps<T>) {
  const { contains } = useFilter({ sensitivity: 'base' });
  const [searchValue, setSearchValue] = React.useState('');
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [popoverWidth, setPopoverWidth] = React.useState('');

  const handleTriggerClick = React.useCallback(() => {
    if (!triggerRef.current) {
      return;
    }
    setPopoverWidth(`${triggerRef.current.getBoundingClientRect().width}px`);
  }, []);

  const selectedCount =
    selectedKeys instanceof Set
      ? selectedKeys.size
      : selectedKeys === 'all'
        ? Array.isArray(items)
          ? items.length
          : 0
        : 0;
  const hasSelection = selectedCount > 0;

  const handleClearSearch = React.useCallback(() => setSearchValue(''), []);

  const labelId = useTaleUiId();

  return (
    <MultiSelectContext.Provider value={{ size }}>
      <div
        {...rest}
        className={cx('tale-multi-select', className)}
        data-disabled={isDisabled || undefined}
        data-invalid={isInvalid || undefined}
      >
        {label && (
          <span id={labelId} className="tale-multi-select__label">
            {label}
            {isRequired && <span aria-hidden="true"> *</span>}
          </span>
        )}

        <AriaDialogTrigger>
          <AriaButton
            ref={triggerRef}
            isDisabled={isDisabled}
            aria-labelledby={label ? labelId : undefined}
            aria-required={isRequired || undefined}
            aria-invalid={isInvalid || undefined}
            onClick={handleTriggerClick}
            className={`tale-multi-select__trigger${isInvalid ? ' tale-multi-select__trigger--invalid' : ''}`}
          >
            <span
              className={`tale-multi-select__trigger-inner tale-multi-select__trigger-inner--${size}`}
            >
              {hasSelection ? (
                <span className="tale-multi-select__value tale-multi-select__value--selected">
                  {selectedCountFormatter
                    ? selectedCountFormatter(selectedCount)
                    : `${selectedCount} selected`}
                  {supportingText && (
                    <span className="tale-multi-select__supporting-text">{supportingText}</span>
                  )}
                </span>
              ) : (
                <span className="tale-multi-select__value tale-multi-select__value--placeholder">
                  {placeholder}
                </span>
              )}
              <span className="tale-multi-select__icon" aria-hidden="true">
                <Icon icon={ChevronDown} size="sm" />
              </span>
            </span>
          </AriaButton>

          <AriaPopover
            placement="bottom"
            offset={4}
            containerPadding={0}
            style={{ width: popoverWidth || undefined }}
            className={`tale-multi-select__popup${size !== 'md' ? ` tale-multi-select__popup--${size}` : ''}`}
          >
            <AriaDialog className="tale-multi-select__dialog">
              <AriaAutocomplete
                filter={contains}
                inputValue={searchValue}
                onInputChange={setSearchValue}
              >
                {showSearch && (
                  <div className="tale-multi-select__search-wrapper">
                    <AriaSearchField
                      aria-label="Search"
                      value={searchValue}
                      onChange={setSearchValue}
                      autoFocus
                      className="tale-multi-select__search"
                    >
                      <span className="tale-multi-select__search-icon" aria-hidden="true">
                        <Icon icon={Search} size="sm" />
                      </span>
                      <AriaInput placeholder="Search" className="tale-multi-select__search-input" />
                    </AriaSearchField>
                  </div>
                )}

                <AriaListBox
                  aria-label={typeof label === 'string' ? label : 'Options'}
                  items={items}
                  selectionMode="multiple"
                  selectedKeys={selectedKeys}
                  defaultSelectedKeys={defaultSelectedKeys}
                  onSelectionChange={onSelectionChange}
                  renderEmptyState={() => (
                    <EmptyState
                      title={emptyStateTitle}
                      description={emptyStateDescription}
                      onClearSearch={searchValue ? handleClearSearch : undefined}
                    />
                  )}
                  className={`tale-multi-select__listbox${size !== 'md' ? ` tale-multi-select__listbox--${size}` : ''}`}
                >
                  {children as any}
                </AriaListBox>
              </AriaAutocomplete>

              {showFooter && <Footer size={size} onReset={onReset} onSelectAll={onSelectAll} />}
            </AriaDialog>
          </AriaPopover>
        </AriaDialogTrigger>

        {isInvalid && errorMessage ? (
          <span className="tale-multi-select__error">{errorMessage}</span>
        ) : description ? (
          <span className="tale-multi-select__description">{description}</span>
        ) : null}
      </div>
    </MultiSelectContext.Provider>
  );
}
Root.displayName = 'MultiSelect.Root';

// ── Item ───────────────────────────────────────────────────────────────────

export interface ItemProps extends Omit<AriaListBoxItemProps, 'className'> {
  className?: string | undefined;
}

/**
 * A multi-select list item with a checkbox indicator.
 *
 * @example
 * ```tsx
 * <MultiSelect.Item id="react" textValue="React">React</MultiSelect.Item>
 * ```
 */
export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, children, ...props }, ref) => (
    <AriaListBoxItem ref={ref} className={cx('tale-multi-select__item', className)} {...props}>
      {(renderProps) => (
        <React.Fragment>
          <span className="tale-multi-select__item-check" aria-hidden="true">
            {renderProps.isSelected && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M2 6L5 9L10 3"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          <span className="tale-multi-select__item-text">
            {typeof children === 'function' ? children(renderProps) : children}
          </span>
        </React.Fragment>
      )}
    </AriaListBoxItem>
  ),
);
Item.displayName = 'MultiSelect.Item';

// ── Footer ─────────────────────────────────────────────────────────────────

export interface FooterProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * Size context for button sizing.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /** Called when Reset is clicked. */
  onReset?: () => void;
  /** Called when Select All is clicked. */
  onSelectAll?: () => void;
}

/**
 * Optional footer with Reset and Select All actions.
 *
 * @example
 * ```tsx
 * <MultiSelect.Footer onReset={clearAll} onSelectAll={selectAll} />
 * ```
 */
export const Footer = React.forwardRef<HTMLDivElement, FooterProps>(
  ({ size = 'md', onReset, onSelectAll, className, ...rest }, ref) => (
    <div ref={ref} className={cx('tale-multi-select__footer', className)} {...rest}>
      <button type="button" className="tale-multi-select__footer-btn" onClick={onReset}>
        Reset
      </button>
      <button type="button" className="tale-multi-select__footer-btn" onClick={onSelectAll}>
        Select all
      </button>
    </div>
  ),
);
Footer.displayName = 'MultiSelect.Footer';

// ── EmptyState ─────────────────────────────────────────────────────────────

export interface EmptyStateProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * Title text.
   * @default 'No results found'
   */
  title?: string;
  /**
   * Description text.
   * @default 'Please try a different search term.'
   */
  description?: string;
  /** Called when "Clear search" is clicked. When undefined, the button is hidden. */
  onClearSearch?: () => void;
}

/**
 * Empty state displayed inside the dropdown when no items match the search.
 *
 * @example
 * ```tsx
 * <MultiSelect.EmptyState
 *   title="No results"
 *   description="Try a different search."
 *   onClearSearch={clearSearch}
 * />
 * ```
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      title = 'No results found',
      description = 'Please try a different search term.',
      onClearSearch,
      className,
      ...rest
    },
    ref,
  ) => (
    <div ref={ref} className={cx('tale-multi-select__empty', className)} {...rest}>
      <p className="tale-multi-select__empty-title">{title}</p>
      <p className="tale-multi-select__empty-description">{description}</p>
      {onClearSearch && (
        <button type="button" className="tale-multi-select__empty-clear" onClick={onClearSearch}>
          Clear search
        </button>
      )}
    </div>
  ),
);
EmptyState.displayName = 'MultiSelect.EmptyState';
