import * as React from 'react';
import { X } from 'lucide-react';
import {
  ComboBox as AriaComboBox,
  Group as AriaGroup,
  Input as AriaInput,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  Popover as AriaPopover,
  useFilter,
  type Key,
  type ListBoxItemProps as AriaListBoxItemProps,
} from 'react-aria-components';
import { cx } from '../_cx';
import { useTaleUiId } from '../utils/useTaleUiId';

// ── Types ──────────────────────────────────────────────────────────────────

/** Items passed to TagSelect.Root must have a stable `id` field. */
export type TagSelectItem = { id: Key; [key: string]: unknown };

// ── Root ───────────────────────────────────────────────────────────────────

export interface RootProps<T extends TagSelectItem = TagSelectItem> extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'children'
> {
  /**
   * Size variant.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /** Label text displayed above the field. */
  label?: React.ReactNode;
  /** Placeholder text shown inside the field when nothing is selected. */
  placeholder?: string;
  /** Helper text displayed below the field. */
  description?: React.ReactNode;
  /** Error message shown when `isInvalid` is true. */
  errorMessage?: React.ReactNode;
  /** Whether the field is disabled. */
  isDisabled?: boolean;
  /** Whether the field is required. */
  isRequired?: boolean;
  /** Whether the field is in an error state. */
  isInvalid?: boolean;
  /** Full list of items to display in the dropdown. */
  items?: T[];
  /**
   * Render each item in the dropdown. Receives an item from `items`.
   * Must return a `<TagSelect.Item>`.
   */
  children: React.ReactNode | ((item: T) => React.ReactNode);
  /** Controlled set of selected item keys. */
  selectedKeys?: Set<Key>;
  /** Initial selected keys for uncontrolled mode. */
  defaultSelectedKeys?: Set<Key>;
  /** Called when the selection changes. */
  onSelectionChange?: (keys: Set<Key>) => void;
  /**
   * Return the display label for an item (used in inline tag chips).
   * Defaults to `item.name` → `item.label` → `String(item.id)`.
   */
  getItemLabel?: (item: T) => string;
}

const defaultGetLabel = (item: TagSelectItem): string => {
  const a = item as Record<string, unknown>;
  return String(a.name ?? a.label ?? item.id);
};

/**
 * A combobox that renders selected items as inline tag chips inside the field.
 * Typing filters the dropdown; selecting an item adds a tag; clicking × removes it.
 *
 * @example
 * ```tsx
 * import * as React from 'react';
 * import type { Key } from 'react-aria-components';
 * import { TagSelect } from '@tale-ui/react/tag-select';
 *
 * const members = [
 *   { id: 'alice', name: 'Alice' },
 *   { id: 'bob', name: 'Bob' },
 *   { id: 'carol', name: 'Carol' },
 * ];
 *
 * function TeamPicker() {
 *   const [selected, setSelected] = React.useState<Set<Key>>(new Set());
 *   return (
 *     <TagSelect.Root
 *       label="Team members"
 *       placeholder="Search members…"
 *       items={members}
 *       selectedKeys={selected}
 *       onSelectionChange={setSelected}
 *     >
 *       {(item) => (
 *         <TagSelect.Item id={item.id} textValue={item.name}>
 *           {item.name}
 *         </TagSelect.Item>
 *       )}
 *     </TagSelect.Root>
 *   );
 * }
 * ```
 */
export function Root<T extends TagSelectItem = TagSelectItem>({
  size = 'md',
  label,
  placeholder,
  description,
  errorMessage,
  isDisabled,
  isRequired,
  isInvalid,
  items = [],
  children,
  selectedKeys: controlledKeys,
  defaultSelectedKeys,
  onSelectionChange,
  getItemLabel,
  className,
  ...rest
}: RootProps<T>) {
  const { contains } = useFilter({ sensitivity: 'base' });
  const [inputValue, setInputValue] = React.useState('');
  const [popoverWidth, setPopoverWidth] = React.useState('');
  const groupRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const tagButtonRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const labelId = useTaleUiId();
  const hasReactSsrId = typeof (React as typeof React & { useId?: unknown }).useId === 'function';
  const [canRenderAriaCollection, setCanRenderAriaCollection] = React.useState(hasReactSsrId);

  React.useEffect(() => {
    if (!canRenderAriaCollection) {
      // RAC 1.19's hidden ComboBox collection produces a React 17 hydration
      // mismatch. Hydrate the deterministic closed field first, then enhance
      // it in a later task once React has completed the hydration commit.
      const timeout = setTimeout(() => setCanRenderAriaCollection(true), 0);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [canRenderAriaCollection]);

  // ── Controlled / uncontrolled selectedKeys ────────────────────────────────

  const isControlled = controlledKeys !== undefined;
  const [internalKeys, setInternalKeys] = React.useState<Set<Key>>(
    () => defaultSelectedKeys ?? new Set(),
  );
  const selectedKeys = isControlled ? controlledKeys : internalKeys;

  const setSelectedKeys = React.useCallback(
    (keys: Set<Key>) => {
      if (!isControlled) {
        setInternalKeys(keys);
      }
      onSelectionChange?.(keys);
    },
    [isControlled, onSelectionChange],
  );

  // ── Label resolver ────────────────────────────────────────────────────────

  const resolveLabel = React.useCallback(
    (item: T): string => (getItemLabel ? getItemLabel(item) : defaultGetLabel(item)),
    [getItemLabel],
  );

  // ── Derived state ──────────────────────────────────────────────────────────

  const itemsById = React.useMemo(() => {
    const map = new Map<Key, T>();
    for (const item of items) {
      map.set(item.id, item);
    }
    return map;
  }, [items]);

  const selectedItems = React.useMemo(
    () =>
      Array.from(selectedKeys)
        .map((k) => itemsById.get(k))
        .filter((v): v is T => v !== undefined),
    [selectedKeys, itemsById],
  );

  const filteredItems = React.useMemo(
    () =>
      items.filter(
        (item) =>
          !selectedKeys.has(item.id) &&
          (inputValue === '' || contains(resolveLabel(item), inputValue)),
      ),
    [items, selectedKeys, inputValue, contains, resolveLabel],
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleSelectionChange = React.useCallback(
    (key: Key | null) => {
      if (!key) {
        return;
      }
      const newKeys = new Set(selectedKeys);
      newKeys.add(key);
      setSelectedKeys(newKeys);
      setInputValue('');
      setTimeout(() => inputRef.current?.focus(), 0);
    },
    [selectedKeys, setSelectedKeys],
  );

  const handleRemove = React.useCallback(
    (key: Key) => {
      const newKeys = new Set(selectedKeys);
      newKeys.delete(key);
      setSelectedKeys(newKeys);
    },
    [selectedKeys, setSelectedKeys],
  );

  const handleOpenChange = React.useCallback((isOpen: boolean) => {
    if (isOpen && groupRef.current) {
      setPopoverWidth(`${groupRef.current.getBoundingClientRect().width}px`);
    }
  }, []);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const isCaretAtStart =
      event.currentTarget.selectionStart === 0 && event.currentTarget.selectionEnd === 0;
    if (
      (event.key === 'Backspace' || event.key === 'ArrowLeft') &&
      isCaretAtStart &&
      inputValue === '' &&
      selectedItems.length > 0
    ) {
      event.preventDefault();
      tagButtonRefs.current[selectedItems.length - 1]?.focus();
    }
  };

  const handleTagKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    key: Key,
    index: number,
  ) => {
    if (event.key === 'Tab') {
      return;
    }
    event.preventDefault();
    switch (event.key) {
      case ' ':
      case 'Enter':
      case 'Backspace':
        handleRemove(key);
        if (index === 0) {
          inputRef.current?.focus();
        } else {
          tagButtonRefs.current[index - 1]?.focus();
        }
        break;
      case 'ArrowLeft':
        if (index > 0) {
          tagButtonRefs.current[index - 1]?.focus();
        }
        break;
      case 'ArrowRight':
        if (index < selectedItems.length - 1) {
          tagButtonRefs.current[index + 1]?.focus();
        } else {
          inputRef.current?.focus();
        }
        break;
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const groupClass = `tale-tag-select__group tale-tag-select__group--${size}${isInvalid ? ' tale-tag-select__group--invalid' : ''}`;

  if (!canRenderAriaCollection) {
    return (
      <div
        {...rest}
        className={cx('tale-tag-select', className)}
        data-disabled={isDisabled || undefined}
        data-invalid={isInvalid || undefined}
      >
        {label && (
          <span className="tale-tag-select__label">
            {label}
            {isRequired && <span aria-hidden="true"> *</span>}
          </span>
        )}
        <div className="tale-tag-select__combobox">
          <div className={groupClass}>
            <input
              className="tale-tag-select__input"
              aria-label={typeof label === 'string' ? label : undefined}
              aria-required={isRequired || undefined}
              aria-invalid={isInvalid || undefined}
              disabled={isDisabled}
              placeholder={placeholder}
              value={inputValue}
              readOnly
            />
          </div>
        </div>
        {isInvalid && errorMessage ? (
          <span className="tale-tag-select__error">{errorMessage}</span>
        ) : description ? (
          <span className="tale-tag-select__description">{description}</span>
        ) : null}
      </div>
    );
  }

  return (
    <div
      {...rest}
      className={cx('tale-tag-select', className)}
      data-disabled={isDisabled || undefined}
      data-invalid={isInvalid || undefined}
    >
      {label && (
        <span id={labelId} className="tale-tag-select__label">
          {label}
          {isRequired && <span aria-hidden="true"> *</span>}
        </span>
      )}

      <AriaComboBox
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSelectionChange={handleSelectionChange}
        isDisabled={isDisabled}
        aria-labelledby={label ? labelId : undefined}
        aria-required={isRequired || undefined}
        aria-invalid={isInvalid || undefined}
        allowsEmptyCollection
        menuTrigger="focus"
        onOpenChange={handleOpenChange}
        className="tale-tag-select__combobox"
      >
        <AriaGroup
          ref={groupRef}
          isDisabled={isDisabled}
          isInvalid={isInvalid}
          className={groupClass}
        >
          {selectedItems.map((item, index) => (
            <span
              key={String(item.id)}
              className={`tale-tag-select__tag tale-tag-select__tag--${size}`}
            >
              <span className="tale-tag-select__tag-text">{resolveLabel(item)}</span>
              <button
                ref={(el) => {
                  tagButtonRefs.current[index] = el;
                }}
                type="button"
                aria-label={`Remove ${resolveLabel(item)}`}
                className="tale-tag-select__tag-remove"
                tabIndex={-1}
                disabled={isDisabled}
                onClick={() => handleRemove(item.id)}
                onKeyDown={(entry) => handleTagKeyDown(entry, item.id, index)}
              >
                <X size={15} aria-hidden="true" strokeWidth={2.5} />
              </button>
            </span>
          ))}

          <AriaInput
            ref={inputRef}
            placeholder={selectedItems.length === 0 ? placeholder : ''}
            className="tale-tag-select__input"
            onKeyDown={handleInputKeyDown}
          />
        </AriaGroup>

        <AriaPopover
          placement="bottom start"
          offset={4}
          containerPadding={0}
          style={{ width: popoverWidth || undefined }}
          className="tale-tag-select__popup"
        >
          <AriaListBox items={filteredItems} className="tale-tag-select__listbox">
            {children as any}
          </AriaListBox>
        </AriaPopover>
      </AriaComboBox>

      {isInvalid && errorMessage ? (
        <span className="tale-tag-select__error">{errorMessage}</span>
      ) : description ? (
        <span className="tale-tag-select__description">{description}</span>
      ) : null}
    </div>
  );
}
Root.displayName = 'TagSelect.Root';

// ── Item ───────────────────────────────────────────────────────────────────

export interface ItemProps extends Omit<AriaListBoxItemProps, 'className'> {
  className?: string | undefined;
}

/**
 * A single option in the TagSelect dropdown.
 *
 * @example
 * ```tsx
 * <TagSelect.Item id="alice" textValue="Alice">Alice</TagSelect.Item>
 * ```
 */
export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, children, ...props }, ref) => (
    <AriaListBoxItem ref={ref} className={cx('tale-tag-select__item', className)} {...props}>
      {children}
    </AriaListBoxItem>
  ),
);
Item.displayName = 'TagSelect.Item';
