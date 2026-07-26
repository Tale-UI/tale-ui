import * as React from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  ImageIcon,
  Sparkles,
  Type,
} from 'lucide-react';
import { Image as TiptapImage } from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
import type { Editor, EditorContentProps, EditorOptions } from '@tiptap/react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Extension } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import {
  ColorField as AriaColorField,
  DialogTrigger,
  Dialog,
  Label as AriaLabel,
  Popover as AriaPopover,
  parseColor,
} from 'react-aria-components';
import type { Color } from 'react-aria-components';
import { cx } from '../_cx';
import { useTaleUiId } from '../utils/useTaleUiId';

/* ─── CharacterCount Extension (internal) ────────────────────────────────── */

const CharacterCount = Extension.create({
  name: 'characterCount',

  addOptions() {
    return {
      mode: 'textSize' as 'textSize' | 'nodeSize',
      textCounter: undefined as ((text: string) => number) | undefined,
      wordCounter: undefined as ((text: string) => number) | undefined,
    };
  },

  addStorage() {
    return {
      characters: (): number => 0,
      words: (): number => 0,
    };
  },

  onBeforeCreate() {
    const storage = this.storage as {
      characters: () => number;
      words: () => number;
    };

    storage.characters = (): number => {
      const node = this.editor.state.doc as ProseMirrorNode;
      const text = node.textBetween(0, node.content.size, undefined, ' ');
      if (typeof this.options.textCounter === 'function') {
        return this.options.textCounter(text);
      }
      return text.length;
    };

    storage.words = (): number => {
      const node = this.editor.state.doc as ProseMirrorNode;
      const text = node.textBetween(0, node.content.size, ' ', ' ');
      if (typeof this.options.wordCounter === 'function') {
        return this.options.wordCounter(text);
      }
      return text.split(' ').filter((w) => w.length > 0).length;
    };
  },
});

/* ─── EditorContext ─────────────────────────────────────────────────────── */

interface EditorContextValue {
  editor: Editor;
  editorId: string | undefined;
  isDisabled?: boolean;
  limit?: number;
  isInvalid?: boolean;
}

const EditorContext = React.createContext<EditorContextValue | null>(null);

export function useEditorContext(): EditorContextValue {
  const ctx = React.useContext(EditorContext);
  if (!ctx) {
    throw new Error('useEditorContext must be used inside TextEditor.Root');
  }
  return ctx;
}

/* ─── EditorButton (internal helper) ────────────────────────────────────── */

interface EditorButtonProps {
  isActive?: boolean;
  isDisabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  'aria-label'?: string;
}

function EditorButton({
  isActive,
  isDisabled,
  className,
  children,
  onClick,
  'aria-label': ariaLabel,
}: EditorButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={isActive}
      disabled={isDisabled}
      data-disabled={isDisabled ? 'true' : undefined}
      className={cx(
        `tale-text-editor__btn${isActive ? ' tale-text-editor__btn--active' : ''}`,
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* ─── Root ──────────────────────────────────────────────────────────────── */

export interface RootProps extends Partial<EditorOptions> {
  className?: string | undefined;
  isDisabled?: boolean | undefined;
  limit?: number | undefined;
  placeholder?: string | undefined;
  isInvalid?: boolean | undefined;
  children?: React.ReactNode;
}

/**
 * Rich-text editor built on Tiptap v3.
 * Requires @tiptap/react, @tiptap/starter-kit, @tiptap/extension-text-style,
 * @tiptap/extension-image, @tiptap/extension-placeholder, @tiptap/extension-text-align.
 *
 * @status experimental
 *
 * @example
 * ```tsx
 * import { TextEditor } from '@tale-ui/react/text-editor';
 *
 * <TextEditor.Root>
 *   <TextEditor.Label>Body</TextEditor.Label>
 *   <TextEditor.Toolbar type="advanced" />
 *   <TextEditor.Content />
 *   <TextEditor.HintText>Write something...</TextEditor.HintText>
 * </TextEditor.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  (
    {
      className,
      isDisabled,
      limit,
      placeholder,
      isInvalid,
      children,
      content,
      onUpdate,
      ...editorOptions
    },
    ref,
  ) => {
    const editorId = useTaleUiId();

    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit,
        TextStyleKit,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        TiptapImage,
        Placeholder.configure({ placeholder: placeholder ?? '' }),
        CharacterCount.configure({ mode: 'textSize' }),
      ],
      content,
      onUpdate,
      editable: !isDisabled,
      ...editorOptions,
    });

    React.useEffect(() => {
      if (!editor) {
        return undefined;
      }

      const capturedEditor = editor;

      function handleKeyDown(event: KeyboardEvent) {
        const isMeta = event.metaKey || event.ctrlKey;
        if (isMeta && event.key === 'k') {
          event.preventDefault();
          // eslint-disable-next-line no-alert
          const url = window.prompt('Enter URL');
          if (url === null) {
            return;
          }
          if (url === '') {
            capturedEditor.chain().focus().unsetLink().run();
          } else {
            capturedEditor.chain().focus().setLink({ href: url }).run();
          }
        }
      }

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [editor]);

    if (!editor) {
      return null;
    }

    return (
      <EditorContext.Provider value={{ editor, editorId, isDisabled, limit, isInvalid }}>
        <div
          ref={ref}
          className={cx('tale-text-editor', className)}
          data-disabled={isDisabled ? 'true' : undefined}
          data-invalid={isInvalid ? 'true' : undefined}
        >
          {children}
        </div>
      </EditorContext.Provider>
    );
  },
);
Root.displayName = 'TextEditor.Root';

/* ─── Content ───────────────────────────────────────────────────────────── */

export interface ContentProps extends Omit<EditorContentProps, 'editor'> {
  className?: string | undefined;
}

export function Content({ className, ...props }: ContentProps) {
  const { editor } = useEditorContext();
  return (
    <div className={cx('tale-text-editor__content', className)}>
      <EditorContent editor={editor} {...props} />
    </div>
  );
}
Content.displayName = 'TextEditor.Content';

/* ─── Label ─────────────────────────────────────────────────────────────── */

export interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
  className?: string | undefined;
  htmlFor?: string | undefined;
}

export function Label({ children, className, htmlFor, ...props }: LabelProps) {
  const { editorId } = useEditorContext();

  return (
    <label
      id={editorId ? `${editorId}-label` : undefined}
      htmlFor={htmlFor ?? editorId}
      className={cx('tale-text-editor__label', className)}
      {...props}
    >
      {children}
    </label>
  );
}
Label.displayName = 'TextEditor.Label';

/* ─── HintText ──────────────────────────────────────────────────────────── */

export interface HintTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  className?: string | undefined;
}

export function HintText({ children, className, ...props }: HintTextProps) {
  const { editor, limit, isInvalid } = useEditorContext();

  const characterCount =
    (
      editor.storage as { characterCount?: { characters?: () => number } }
    )?.characterCount?.characters?.() ?? 0;

  const hasLimit = typeof limit === 'number';

  return (
    <p
      className={cx(
        `tale-text-editor__hint${isInvalid ? ' tale-text-editor__hint--invalid' : ''}`,
        className,
      )}
      {...props}
    >
      {hasLimit ? `${limit - characterCount} characters left` : children}
    </p>
  );
}
HintText.displayName = 'TextEditor.HintText';

/* ─── Toolbar ───────────────────────────────────────────────────────────── */

export interface ToolbarProps {
  type?: 'simple' | 'advanced';
  floating?: boolean;
  className?: string | undefined;
}

function Separator() {
  return <div className="tale-text-editor__separator" aria-hidden="true" />;
}

export function Toolbar({ type = 'simple', floating, className }: ToolbarProps) {
  return (
    <div
      role="toolbar"
      className={cx(
        `tale-text-editor__toolbar${floating ? ' tale-text-editor__toolbar--floating' : ''}${type === 'advanced' ? ' tale-text-editor__toolbar--advanced' : ''}`,
        className,
      )}
    >
      {type === 'advanced' && (
        <React.Fragment>
          <TextEditorFontFamily />
          <TextEditorFontSize />
          <Separator />
        </React.Fragment>
      )}
      <TextEditorBold />
      <TextEditorItalic />
      <TextEditorUnderline />
      <Separator />
      <TextEditorColor />
      <Separator />
      {type === 'advanced' && (
        <React.Fragment>
          <TextEditorLink />
          <TextEditorImage />
          <Separator />
        </React.Fragment>
      )}
      <TextEditorAlignLeft />
      <TextEditorAlignCenter />
      <TextEditorAlignRight />
      <TextEditorBulletList />
      {type === 'advanced' && (
        <React.Fragment>
          <Separator />
          <TextEditorGenerate />
        </React.Fragment>
      )}
    </div>
  );
}
Toolbar.displayName = 'TextEditor.Toolbar';

/* ─── BubbleMenu ────────────────────────────────────────────────────────── */

export interface BubbleMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string | undefined;
  children?: React.ReactNode;
}

export function BubbleMenu({ className, children, ...props }: BubbleMenuProps) {
  const { editor } = useEditorContext();

  const { hasSelection } = useEditorState({
    editor,
    selector: ({ editor: ed }) => ({
      hasSelection: !ed.state.selection.empty,
    }),
  });

  if (!hasSelection) {
    return null;
  }

  return (
    <div className={cx('tale-text-editor__bubble-menu', className)} {...props}>
      {children}
    </div>
  );
}
BubbleMenu.displayName = 'TextEditor.BubbleMenu';

/* ─── Toolbar Button Sub-parts ──────────────────────────────────────────── */

export function TextEditorBold() {
  const { editor, isDisabled } = useEditorContext();
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive('bold'),
  });

  function handleClick() {
    editor.chain().focus().toggleBold().run();
  }

  return (
    <EditorButton
      isActive={isActive}
      isDisabled={isDisabled}
      aria-label="Bold"
      onClick={handleClick}
    >
      <Bold size={16} />
    </EditorButton>
  );
}
TextEditorBold.displayName = 'TextEditor.Bold';

export function TextEditorItalic() {
  const { editor, isDisabled } = useEditorContext();
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive('italic'),
  });

  function handleClick() {
    editor.chain().focus().toggleItalic().run();
  }

  return (
    <EditorButton
      isActive={isActive}
      isDisabled={isDisabled}
      aria-label="Italic"
      onClick={handleClick}
    >
      <Italic size={16} />
    </EditorButton>
  );
}
TextEditorItalic.displayName = 'TextEditor.Italic';

export function TextEditorUnderline() {
  const { editor, isDisabled } = useEditorContext();
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive('underline'),
  });

  function handleClick() {
    editor.chain().focus().toggleUnderline().run();
  }

  return (
    <EditorButton
      isActive={isActive}
      isDisabled={isDisabled}
      aria-label="Underline"
      onClick={handleClick}
    >
      <Underline size={16} />
    </EditorButton>
  );
}
TextEditorUnderline.displayName = 'TextEditor.Underline';

export function TextEditorBulletList() {
  const { editor, isDisabled } = useEditorContext();
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive('bulletList'),
  });

  function handleClick() {
    editor.chain().focus().toggleBulletList().run();
  }

  return (
    <EditorButton
      isActive={isActive}
      isDisabled={isDisabled}
      aria-label="Bullet list"
      onClick={handleClick}
    >
      <List size={16} />
    </EditorButton>
  );
}
TextEditorBulletList.displayName = 'TextEditor.BulletList';

export function TextEditorAlignLeft() {
  const { editor, isDisabled } = useEditorContext();
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive({ textAlign: 'left' }),
  });

  function handleClick() {
    editor.chain().focus().setTextAlign('left').run();
  }

  return (
    <EditorButton
      isActive={isActive}
      isDisabled={isDisabled}
      aria-label="Align left"
      onClick={handleClick}
    >
      <AlignLeft size={16} />
    </EditorButton>
  );
}
TextEditorAlignLeft.displayName = 'TextEditor.AlignLeft';

export function TextEditorAlignCenter() {
  const { editor, isDisabled } = useEditorContext();
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive({ textAlign: 'center' }),
  });

  function handleClick() {
    editor.chain().focus().setTextAlign('center').run();
  }

  return (
    <EditorButton
      isActive={isActive}
      isDisabled={isDisabled}
      aria-label="Align center"
      onClick={handleClick}
    >
      <AlignCenter size={16} />
    </EditorButton>
  );
}
TextEditorAlignCenter.displayName = 'TextEditor.AlignCenter';

export function TextEditorAlignRight() {
  const { editor, isDisabled } = useEditorContext();
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive({ textAlign: 'right' }),
  });

  function handleClick() {
    editor.chain().focus().setTextAlign('right').run();
  }

  return (
    <EditorButton
      isActive={isActive}
      isDisabled={isDisabled}
      aria-label="Align right"
      onClick={handleClick}
    >
      <AlignRight size={16} />
    </EditorButton>
  );
}
TextEditorAlignRight.displayName = 'TextEditor.AlignRight';

export function TextEditorAlignJustify() {
  const { editor, isDisabled } = useEditorContext();
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive({ textAlign: 'justify' }),
  });

  function handleClick() {
    editor.chain().focus().setTextAlign('justify').run();
  }

  return (
    <EditorButton
      isActive={isActive}
      isDisabled={isDisabled}
      aria-label="Align justify"
      onClick={handleClick}
    >
      <AlignJustify size={16} />
    </EditorButton>
  );
}
TextEditorAlignJustify.displayName = 'TextEditor.AlignJustify';

export function TextEditorLink() {
  const { editor, isDisabled } = useEditorContext();
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive('link'),
  });

  function handleClick() {
    // eslint-disable-next-line no-alert
    const url = window.prompt('Enter URL');
    if (url === null) {
      return;
    }
    if (url === '') {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }

  return (
    <EditorButton
      isActive={isActive}
      isDisabled={isDisabled}
      aria-label="Insert link"
      onClick={handleClick}
    >
      <LinkIcon size={16} />
    </EditorButton>
  );
}
TextEditorLink.displayName = 'TextEditor.Link';

export function TextEditorImage() {
  const { editor, isDisabled } = useEditorContext();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function handleButtonClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    editor.chain().focus().setImage({ src: blobUrl }).run();
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <React.Fragment>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        aria-hidden="true"
        tabIndex={-1}
      />
      <EditorButton isDisabled={isDisabled} aria-label="Insert image" onClick={handleButtonClick}>
        <ImageIcon size={16} />
      </EditorButton>
    </React.Fragment>
  );
}
TextEditorImage.displayName = 'TextEditor.Image';

const COLOR_SWATCHES = [
  '#000000',
  '#374151',
  '#6b7280',
  '#d1d5db',
  '#ffffff',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#0ea5e9',
  '#84cc16',
];

export function TextEditorColor() {
  const { editor, isDisabled } = useEditorContext();
  const [color, setColor] = React.useState<Color>(parseColor('#000000'));

  function handleSwatchPress(hex: string) {
    setColor(parseColor(hex));
    editor.chain().focus().setColor(hex).run();
  }

  function handleColorChange(value: Color | null) {
    if (!value) {
      return;
    }
    setColor(value);
    const hex = `#${value.toFormat('hex')}`;
    editor.chain().focus().setColor(hex).run();
  }

  return (
    <DialogTrigger>
      <EditorButton isDisabled={isDisabled} aria-label="Text color">
        <Type size={16} />
      </EditorButton>
      <AriaPopover className="tale-text-editor__color-popup">
        <Dialog className="tale-text-editor__color-dialog" aria-label="Text color picker">
          <div className="tale-text-editor__color-swatches">
            {COLOR_SWATCHES.map((hex) => (
              <button
                key={hex}
                type="button"
                aria-label={hex}
                className="tale-text-editor__color-swatch"
                style={{ backgroundColor: hex }}
                onClick={() => handleSwatchPress(hex)}
              />
            ))}
          </div>
          <div className="tale-text-editor__color-field-row">
            <AriaLabel className="tale-text-editor__color-field-label">Custom</AriaLabel>
            <AriaColorField
              value={color}
              onChange={handleColorChange}
              className="tale-text-editor__color-field"
              aria-label="Custom color"
            />
          </div>
        </Dialog>
      </AriaPopover>
    </DialogTrigger>
  );
}
TextEditorColor.displayName = 'TextEditor.Color';

export function TextEditorFontFamily() {
  const { editor, isDisabled } = useEditorContext();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    editor.chain().focus().setFontFamily(event.target.value).run();
  }

  return (
    <select
      className="tale-text-editor__select"
      disabled={isDisabled}
      onChange={handleChange}
      aria-label="Font family"
      defaultValue="Inter"
    >
      <option value="Inter">Inter</option>
      <option value="Comic Sans MS, Comic Sans">Comic Sans</option>
      <option value="serif">Serif</option>
      <option value="monospace">Monospace</option>
      <option value="cursive">Cursive</option>
    </select>
  );
}
TextEditorFontFamily.displayName = 'TextEditor.FontFamily';

export function TextEditorFontSize() {
  const { editor, isDisabled } = useEditorContext();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    editor.chain().focus().setFontSize(event.target.value).run();
  }

  return (
    <select
      className="tale-text-editor__select"
      disabled={isDisabled}
      onChange={handleChange}
      aria-label="Font size"
      defaultValue="16px"
    >
      <option value="12px">12</option>
      <option value="14px">14</option>
      <option value="16px">16</option>
      <option value="18px">18</option>
      <option value="20px">20</option>
      <option value="24px">24</option>
      <option value="28px">28</option>
      <option value="32px">32</option>
    </select>
  );
}
TextEditorFontSize.displayName = 'TextEditor.FontSize';

export function TextEditorGenerate() {
  const { isDisabled } = useEditorContext();

  function handleClick() {
    // Placeholder for AI generation
    console.warn('TextEditor.Generate: AI generation not yet implemented.');
  }

  return (
    <EditorButton isDisabled={isDisabled} aria-label="Generate with AI" onClick={handleClick}>
      <Sparkles size={16} />
    </EditorButton>
  );
}
TextEditorGenerate.displayName = 'TextEditor.Generate';

/* ─── Namespace export ──────────────────────────────────────────────────── */

export const TextEditor = {
  Root,
  Content,
  Label,
  HintText,
  Toolbar,
  BubbleMenu,
  Bold: TextEditorBold,
  Italic: TextEditorItalic,
  Underline: TextEditorUnderline,
  BulletList: TextEditorBulletList,
  AlignLeft: TextEditorAlignLeft,
  AlignCenter: TextEditorAlignCenter,
  AlignRight: TextEditorAlignRight,
  AlignJustify: TextEditorAlignJustify,
  Link: TextEditorLink,
  Image: TextEditorImage,
  Color: TextEditorColor,
  FontFamily: TextEditorFontFamily,
  FontSize: TextEditorFontSize,
  Generate: TextEditorGenerate,
};
