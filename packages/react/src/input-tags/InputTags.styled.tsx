import * as React from 'react';
import {
  Group as AriaGroup,
  Input as AriaInput,
  TagGroup as AriaTagGroup,
  TagList as AriaTagList,
  Tag as AriaTag,
} from 'react-aria-components';
import type { Key } from 'react-aria-components';
import { cx } from '../_cx';
import { useTaleUiId } from '../utils/useTaleUiId';

// ── Internal types ─────────────────────────────────────────────────────────

interface TagEntry {
  id: string;
  label: string;
}

// ── Root ───────────────────────────────────────────────────────────────────

export interface RootProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> {
  /**
   * Where to render the tag chips — inside the input area (`'inline'`) or below
   * it in a separate row (`'below'`).
   * @default 'inline'
   */
  tagPlacement?: 'inline' | 'below';
  /**
   * Size variant.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /** Placeholder text for the text input. */
  placeholder?: string;
  /** Whether the field is disabled. */
  isDisabled?: boolean;
  /** Whether the field is in an error state. */
  isInvalid?: boolean;
  /** Whether the field is required. */
  isRequired?: boolean;
  /** Controlled value — array of tag strings. */
  value?: string[];
  /** Initial tags for uncontrolled mode. */
  defaultValue?: string[];
  /** Called whenever the tag list changes. */
  onChange?: (tags: string[]) => void;
  /** Called when a tag is successfully added. */
  onTagAdded?: (tag: string) => void;
  /** Called when a tag is removed. */
  onTagRemoved?: (tag: string) => void;
  /** Allow duplicate tag values. @default false */
  allowDuplicates?: boolean;
  /** Maximum number of tags allowed. */
  maxTags?: number;
  /**
   * Validation function — return `true` to accept a new tag, `false` to reject it.
   */
  validate?: (value: string) => boolean;
  /** Label text displayed above the field. */
  label?: React.ReactNode;
  /** Helper text displayed below the field. */
  description?: React.ReactNode;
  /** Error message shown when `isInvalid` is true. */
  errorMessage?: React.ReactNode;
}

/**
 * A field for entering and managing a list of tag chips.
 * Press Enter to add a tag; click the remove button or press Backspace to remove one.
 *
 * @example
 * ```tsx
 * import { InputTags } from '@tale-ui/react/input-tags';
 *
 * // Inline mode (default) — tags appear inside the field
 * <InputTags.Root
 *   label="Skills"
 *   placeholder="Add a skill…"
 *   onChange={setTags}
 * />
 *
 * // Below mode — standard input with tag list below
 * <InputTags.Root
 *   label="Technologies"
 *   tagPlacement="below"
 *   defaultValue={['React', 'TypeScript']}
 *   onChange={setTags}
 * />
 * ```
 */
export const Root: React.FC<RootProps> = ({
  tagPlacement = 'inline',
  size = 'md',
  placeholder,
  isDisabled,
  isInvalid,
  isRequired,
  value,
  defaultValue,
  onChange,
  onTagAdded,
  onTagRemoved,
  allowDuplicates = false,
  maxTags,
  validate,
  label,
  description,
  errorMessage,
  className,
  ...rest
}) => {
  const isControlled = value !== undefined;
  const idCounterRef = React.useRef(0);
  const nextId = React.useCallback(() => `tag-${(idCounterRef.current += 1)}`, []);

  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const tagListWrapperRef = React.useRef<HTMLDivElement>(null);

  const [internalEntries, setInternalEntries] = React.useState<TagEntry[]>(() =>
    (defaultValue ?? []).map((lbl) => ({ id: nextId(), label: lbl })),
  );

  const prevControlledRef = React.useRef<string[] | undefined>(undefined);
  const controlledEntriesRef = React.useRef<TagEntry[]>([]);

  // Reconcile controlled value to stable TagEntry objects (preserves React keys)
  const entries: TagEntry[] = (() => {
    if (!isControlled) {
      return internalEntries;
    }
    if (prevControlledRef.current === value) {
      return controlledEntriesRef.current;
    }

    const oldEntries = controlledEntriesRef.current;
    const newEntries: TagEntry[] = [];
    const usedOldIndices = new Set<number>();

    for (const lbl of value!) {
      const oldIndex = oldEntries.findIndex(
        (entry, i) => entry.label === lbl && !usedOldIndices.has(i),
      );
      if (oldIndex !== -1) {
        usedOldIndices.add(oldIndex);
        newEntries.push(oldEntries[oldIndex]);
      } else {
        newEntries.push({ id: nextId(), label: lbl });
      }
    }

    prevControlledRef.current = value;
    controlledEntriesRef.current = newEntries;
    return newEntries;
  })();

  const tags = entries.map((entry) => entry.label);

  const addTag = React.useCallback(
    (text: string): boolean => {
      const trimmed = text.trim();
      if (!trimmed) {
        return false;
      }
      if (!allowDuplicates && tags.includes(trimmed)) {
        return false;
      }
      if (maxTags !== undefined && tags.length >= maxTags) {
        return false;
      }
      if (validate && !validate(trimmed)) {
        return false;
      }

      const newEntry: TagEntry = { id: nextId(), label: trimmed };
      const newEntries = [...entries, newEntry];
      if (!isControlled) {
        setInternalEntries(newEntries);
      }
      onChange?.(newEntries.map((entry) => entry.label));
      onTagAdded?.(trimmed);
      return true;
    },
    [tags, entries, isControlled, allowDuplicates, maxTags, validate, onChange, onTagAdded, nextId],
  );

  const removeTagById = React.useCallback(
    (id: string) => {
      const entry = entries.find((entry) => entry.id === id);
      if (!entry) {
        return;
      }
      const newEntries = entries.filter((entry) => entry.id !== id);
      if (!isControlled) {
        setInternalEntries(newEntries);
      }
      onChange?.(newEntries.map((entry) => entry.label));
      onTagRemoved?.(entry.label);
    },
    [entries, isControlled, onChange, onTagRemoved],
  );

  const handleTagRemove = React.useCallback(
    (keys: Set<Key>) => {
      for (const key of keys) {
        removeTagById(key.toString());
      }
      if (entries.length - keys.size <= 0) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    },
    [removeTagById, entries.length],
  );

  const focusLastTag = React.useCallback(() => {
    const tagEls = tagListWrapperRef.current?.querySelectorAll<HTMLElement>('[role="row"]');
    if (tagEls && tagEls.length > 0) {
      tagEls[tagEls.length - 1].focus();
    }
  }, []);

  const handleInputKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      const isCaretAtStart = input.selectionStart === 0 && input.selectionEnd === 0;

      if (event.key === 'Enter') {
        event.preventDefault();
        if (addTag(inputValue)) {
          setInputValue('');
        }
      } else if (
        (event.key === 'Backspace' || event.key === 'ArrowLeft') &&
        isCaretAtStart &&
        inputValue === '' &&
        entries.length > 0
      ) {
        focusLastTag();
      }
    },
    [addTag, inputValue, focusLastTag, entries.length],
  );

  const handleTagListKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      const tagEls = tagListWrapperRef.current?.querySelectorAll<HTMLElement>('[role="row"]');
      if (tagEls && tagEls.length > 0) {
        const lastTag = tagEls[tagEls.length - 1];
        if (document.activeElement === lastTag || lastTag.contains(document.activeElement)) {
          inputRef.current?.focus();
        }
      }
    }
  }, []);

  const isBelow = tagPlacement === 'below';

  const containerClass = cx(
    `tale-input-tags${size !== 'md' ? ` tale-input-tags--${size}` : ''}${isBelow ? ' tale-input-tags--below' : ''}`,
    className,
  );

  const tagNodes = entries.length > 0 && (
    <div
      ref={tagListWrapperRef}
      onKeyDown={handleTagListKeyDown}
      className="tale-input-tags__tag-wrapper"
    >
      <AriaTagGroup
        aria-label={typeof label === 'string' ? label : 'Tags'}
        onRemove={handleTagRemove}
        className="tale-input-tags__tag-group"
      >
        <AriaTagList items={entries} className="tale-input-tags__tag-list">
          {(item) => (
            <AriaTag id={item.id} isDisabled={isDisabled} className="tale-input-tags__tag">
              {item.label}
            </AriaTag>
          )}
        </AriaTagList>
      </AriaTagGroup>
    </div>
  );

  const labelId = useTaleUiId();

  return (
    <div
      {...rest}
      className={containerClass}
      data-disabled={isDisabled || undefined}
      data-invalid={isInvalid || undefined}
    >
      {label && (
        <span id={labelId} className="tale-input-tags__label">
          {label}
          {isRequired && <span aria-hidden="true"> *</span>}
        </span>
      )}

      <AriaGroup
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        aria-labelledby={label ? labelId : undefined}
        aria-required={isRequired || undefined}
        className="tale-input-tags__group"
      >
        {!isBelow && tagNodes}
        <AriaInput
          ref={inputRef}
          value={inputValue}
          placeholder={entries.length === 0 || isBelow ? placeholder : undefined}
          onChange={(entry) => setInputValue(entry.target.value)}
          onKeyDown={handleInputKeyDown}
          className="tale-input-tags__input"
          disabled={isDisabled}
        />
      </AriaGroup>

      {isBelow && tagNodes && <div className="tale-input-tags__tags">{tagNodes}</div>}

      {isInvalid && errorMessage ? (
        <span className="tale-input-tags__error">{errorMessage}</span>
      ) : description ? (
        <span className="tale-input-tags__description">{description}</span>
      ) : null}
    </div>
  );
};
Root.displayName = 'InputTags.Root';
