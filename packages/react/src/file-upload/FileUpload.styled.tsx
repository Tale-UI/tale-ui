import * as React from 'react';
import { CheckCircle, Trash2, UploadCloud, XCircle } from 'lucide-react';
import { cx } from '../_cx';
import { useTaleUiId } from '../utils/useTaleUiId';

/* ─── Utility ───────────────────────────────────────────────────────────────── */

/**
 * Returns a human-readable file size string (e.g. "2 MB", "430 KB").
 */
export const getReadableFileSize = (bytes: number): string => {
  if (bytes === 0) {
    return '0 KB';
  }
  const suffixes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.floor(bytes / Math.pow(1024, i))} ${suffixes[i] ?? 'B'}`;
};

/* ─── Root ──────────────────────────────────────────────────────────────────── */

export interface RootProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Outer wrapper for a FileUpload composition.
 *
 * @example
 * ```tsx
 * import { FileUpload } from '@tale-ui/react/file-upload';
 * import { useState } from 'react';
 *
 * function Example() {
 *   const [files, setFiles] = useState<File[]>([]);
 *   return (
 *     <FileUpload.Root>
 *       <FileUpload.DropZone
 *         hint="PNG, JPG or PDF (max 5 MB)"
 *         accept="image/*,.pdf"
 *         maxSize={5 * 1024 * 1024}
 *         onDropFiles={(fl) => setFiles((p) => [...p, ...Array.from(fl)])}
 *       />
 *       <FileUpload.List>
 *         {files.map((f, i) => (
 *           <FileUpload.ListItemProgressBar
 *             key={i}
 *             name={f.name}
 *             size={f.size}
 *             progress={100}
 *             onDelete={() => setFiles((p) => p.filter((_, j) => j !== i))}
 *           />
 *         ))}
 *       </FileUpload.List>
 *     </FileUpload.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cx('tale-file-upload', className)} {...props} />
));
Root.displayName = 'FileUpload.Root';

/* ─── DropZone ──────────────────────────────────────────────────────────────── */

export interface DropZoneProps {
  /** Helper text below the upload prompt (e.g. accepted file types). */
  hint?: string | undefined;
  /** Whether the drop zone is disabled. */
  isDisabled?: boolean | undefined;
  /** Accepted file types — comma-separated MIME types or extensions. e.g. `"image/*,.pdf"` */
  accept?: string | undefined;
  /** Allow multiple files to be selected/dropped. @default true */
  allowsMultiple?: boolean | undefined;
  /** Maximum file size in bytes. */
  maxSize?: number | undefined;
  /** Called with accepted files. */
  onDropFiles?: ((files: FileList) => void) | undefined;
  /** Called with files that don't match the `accept` filter. */
  onDropUnacceptedFiles?: ((files: FileList) => void) | undefined;
  /** Called with files exceeding `maxSize`. */
  onSizeLimitExceed?: ((files: FileList) => void) | undefined;
  /** Additional CSS class name. */
  className?: string | undefined;
}

function isFileTypeAccepted(file: File, accept: string): boolean {
  const accepted = accept.split(',').map((t) => t.trim());
  return accepted.some((t) => {
    if (t.startsWith('.')) {
      return `.${file.name.split('.').pop()?.toLowerCase()}` === t.toLowerCase();
    }
    if (t.endsWith('/*')) {
      return file.type.startsWith(`${t.split('/')[0]}/`);
    }
    return file.type === t;
  });
}

export const DropZone = React.forwardRef<HTMLDivElement, DropZoneProps>(
  (
    {
      hint,
      isDisabled,
      accept,
      allowsMultiple = true,
      maxSize,
      onDropFiles,
      onDropUnacceptedFiles,
      onSizeLimitExceed,
      className,
    },
    ref,
  ) => {
    const id = useTaleUiId();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isInvalid, setIsInvalid] = React.useState(false);
    const [isDraggingOver, setIsDraggingOver] = React.useState(false);

    const processFiles = (files: File[]) => {
      setIsInvalid(false);
      const toProcess = allowsMultiple ? files : files.slice(0, 1);
      const accepted: File[] = [];
      const unaccepted: File[] = [];
      const oversized: File[] = [];

      toProcess.forEach((file) => {
        if (maxSize && file.size > maxSize) {
          oversized.push(file);
          return;
        }
        if (!accept || isFileTypeAccepted(file, accept)) {
          accepted.push(file);
        } else {
          unaccepted.push(file);
        }
      });

      const toFileList = (arr: File[]) => {
        const dt = new DataTransfer();
        arr.forEach((f) => dt.items.add(f));
        return dt.files;
      };

      if (oversized.length > 0) {
        setIsInvalid(true);
        onSizeLimitExceed?.(toFileList(oversized));
      }
      if (accepted.length > 0) {
        onDropFiles?.(toFileList(accepted));
      }
      if (unaccepted.length > 0) {
        setIsInvalid(true);
        onDropUnacceptedFiles?.(toFileList(unaccepted));
      }

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    };

    const handleDragIn = (event: React.DragEvent<HTMLDivElement>) => {
      if (isDisabled) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      setIsDraggingOver(true);
    };

    const handleDragOut = (event: React.DragEvent<HTMLDivElement>) => {
      if (isDisabled) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      setIsDraggingOver(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      if (isDisabled) {
        return;
      }
      handleDragOut(event);
      processFiles(Array.from(event.dataTransfer.files));
    };

    return (
      <div
        ref={ref}
        data-dropzone
        onDragOver={handleDragIn}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragEnd={handleDragOut}
        onDrop={handleDrop}
        className={cx(
          `tale-file-upload-drop-zone${isDraggingOver ? ' tale-file-upload-drop-zone--drag-over' : ''}${isDisabled ? ' tale-file-upload-drop-zone--disabled' : ''}`,
          className,
        )}
      >
        <div className="tale-file-upload-drop-zone__icon-wrap">
          <UploadCloud
            className={cx(
              `tale-file-upload-drop-zone__icon${isDisabled ? ' tale-file-upload-drop-zone__icon--disabled' : ''}`,
              undefined,
            )}
            aria-hidden="true"
          />
        </div>

        <div className="tale-file-upload-drop-zone__body">
          <div className="tale-file-upload-drop-zone__trigger-row">
            <input
              ref={inputRef}
              id={id}
              type="file"
              aria-label="Upload files"
              className="tale-file-upload-drop-zone__input"
              disabled={isDisabled}
              accept={accept}
              multiple={allowsMultiple}
              onChange={(event) => processFiles(Array.from(event.target.files || []))}
            />
            <button
              type="button"
              disabled={isDisabled}
              className="tale-file-upload-drop-zone__trigger"
              onClick={() => inputRef.current?.click()}
            >
              Click to upload
            </button>
            <span className="tale-file-upload-drop-zone__or">or drag and drop</span>
          </div>
          <p
            className={cx(
              `tale-file-upload-drop-zone__hint${isInvalid ? ' tale-file-upload-drop-zone__hint--invalid' : ''}`,
              undefined,
            )}
          >
            {hint || 'SVG, PNG, JPG or GIF (max. 800×400px)'}
          </p>
        </div>
      </div>
    );
  },
);
DropZone.displayName = 'FileUpload.DropZone';

/* ─── List ──────────────────────────────────────────────────────────────────── */

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {}

export const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ className, children, ...props }, ref) => (
    <ul ref={ref} className={cx('tale-file-upload-list', className)} {...props}>
      {children}
    </ul>
  ),
);
List.displayName = 'FileUpload.List';

/* ─── ListItem ──────────────────────────────────────────────────────────────── */

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {}

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cx('tale-file-upload-list-item', className)} {...props} />
  ),
);
ListItem.displayName = 'FileUpload.ListItem';

/* ─── Shared list item props ────────────────────────────────────────────────── */

export interface FileListItemProps {
  /** File name. */
  name: string;
  /** File size in bytes. */
  size: number;
  /** Upload progress 0–100. */
  progress: number;
  /** Whether the upload failed. */
  failed?: boolean | undefined;
  /** Custom icon element (e.g. from @untitledui/file-icons). */
  icon?: React.ReactNode | undefined;
  /** Called when the delete button is clicked. */
  onDelete?: (() => void) | undefined;
  /** Called when the retry button is clicked. */
  onRetry?: (() => void) | undefined;
  /** Additional CSS class name. */
  className?: string | undefined;
}

/* ─── ListItemProgressBar ───────────────────────────────────────────────────── */

export function ListItemProgressBar({
  name,
  size,
  progress,
  failed,
  icon,
  onDelete,
  onRetry,
  className,
}: FileListItemProps) {
  const isComplete = progress === 100;

  return (
    <li
      className={cx(
        `tale-file-upload-item tale-file-upload-item--bar${failed ? ' tale-file-upload-item--failed' : ''}`,
        className,
      )}
    >
      {icon != null && (
        <div className="tale-file-upload-item__icon" aria-hidden="true">
          {icon}
        </div>
      )}

      <div className="tale-file-upload-item__content">
        <div className="tale-file-upload-item__header">
          <div className="tale-file-upload-item__info">
            <p className="tale-file-upload-item__name">{name}</p>
            <div className="tale-file-upload-item__meta">
              <span className="tale-file-upload-item__size">{getReadableFileSize(size)}</span>
              <span className="tale-file-upload-item__meta-sep" aria-hidden="true" />
              <span className="tale-file-upload-item__status">
                {isComplete && (
                  <React.Fragment>
                    <CheckCircle
                      className="tale-file-upload-item__status-icon tale-file-upload-item__status-icon--success"
                      aria-hidden="true"
                    />
                    <span className="tale-file-upload-item__status-label tale-file-upload-item__status-label--success">
                      Complete
                    </span>
                  </React.Fragment>
                )}
                {!isComplete && !failed && (
                  <React.Fragment>
                    <UploadCloud
                      className="tale-file-upload-item__status-icon tale-file-upload-item__status-icon--uploading"
                      aria-hidden="true"
                    />
                    <span className="tale-file-upload-item__status-label">Uploading…</span>
                  </React.Fragment>
                )}
                {failed && (
                  <React.Fragment>
                    <XCircle
                      className="tale-file-upload-item__status-icon tale-file-upload-item__status-icon--error"
                      aria-hidden="true"
                    />
                    <span className="tale-file-upload-item__status-label tale-file-upload-item__status-label--error">
                      Failed
                    </span>
                  </React.Fragment>
                )}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete file"
            className="tale-file-upload-item__delete-btn"
          >
            <Trash2 className="tale-file-upload-item__delete-icon" aria-hidden="true" />
          </button>
        </div>

        {!failed && (
          <div
            role="progressbar"
            aria-label={`Upload progress for ${name}`}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="tale-file-upload-item__progress-track"
          >
            <div
              className="tale-file-upload-item__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {failed && (
          <button type="button" onClick={onRetry} className="tale-file-upload-item__retry-btn">
            Try again
          </button>
        )}
      </div>
    </li>
  );
}

/* ─── ListItemProgressFill ──────────────────────────────────────────────────── */

export function ListItemProgressFill({
  name,
  size,
  progress,
  failed,
  icon,
  onDelete,
  onRetry,
  className,
}: FileListItemProps) {
  const isComplete = progress === 100;

  return (
    <li
      className={cx(
        `tale-file-upload-item tale-file-upload-item--fill${failed ? ' tale-file-upload-item--failed' : ''}`,
        className,
      )}
    >
      {/* Fill progress background */}
      <div
        className={`tale-file-upload-item__fill-bg${isComplete ? ' tale-file-upload-item__fill-bg--complete' : ''}`}
        role="progressbar"
        aria-label={`Upload progress for ${name}`}
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
      {/* Inner ring */}
      <div
        className={`tale-file-upload-item__fill-ring${failed ? ' tale-file-upload-item__fill-ring--failed' : ''}`}
      />

      {icon != null && (
        <div className="tale-file-upload-item__icon" aria-hidden="true">
          {icon}
        </div>
      )}

      <div className="tale-file-upload-item__content tale-file-upload-item__content--fill">
        <div className="tale-file-upload-item__inner">
          <p className="tale-file-upload-item__name">{name}</p>
          <div className="tale-file-upload-item__meta">
            <span className="tale-file-upload-item__size">
              {failed ? 'Upload failed, please try again' : getReadableFileSize(size)}
            </span>
            {!failed && (
              <React.Fragment>
                <span className="tale-file-upload-item__meta-sep" aria-hidden="true" />
                <span className="tale-file-upload-item__status">
                  {isComplete ? (
                    <CheckCircle
                      className="tale-file-upload-item__status-icon tale-file-upload-item__status-icon--success"
                      aria-hidden="true"
                    />
                  ) : (
                    <UploadCloud
                      className="tale-file-upload-item__status-icon tale-file-upload-item__status-icon--uploading"
                      aria-hidden="true"
                    />
                  )}
                  <span className="tale-file-upload-item__status-label">{progress}%</span>
                </span>
              </React.Fragment>
            )}
          </div>
          {failed && (
            <button type="button" onClick={onRetry} className="tale-file-upload-item__retry-btn">
              Try again
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete file"
          className="tale-file-upload-item__delete-btn"
        >
          <Trash2 className="tale-file-upload-item__delete-icon" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}
