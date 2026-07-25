# useClipboard

A copy-to-clipboard hook with auto-reset feedback state. Copy-paste this into your project.

## Code

```tsx
import { useState, useCallback, useRef } from 'react';

interface UseClipboardOptions {
  /** Reset `copied` to `false` after this many milliseconds. @default 2000 */
  timeout?: number;
}

interface UseClipboardReturn {
  /** Whether the last copy succeeded (auto-resets after timeout). */
  copied: boolean;
  /** Copy the given text to the clipboard. */
  copy: (text: string) => Promise<void>;
}

export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { timeout = 2000 } = options;
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (text: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback for non-secure contexts
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        setCopied(true);
        timerRef.current = setTimeout(() => {
          setCopied(false);
          timerRef.current = null;
        }, timeout);
      } catch {
        setCopied(false);
      }
    },
    [timeout],
  );

  return { copied, copy };
}
```

## Usage

```tsx
import { Button } from '@tale-ui/react/button';
import { Icon } from '@tale-ui/react/icon';
import { Copy, Check } from 'lucide-react';

function CopyButton({ text }: { text: string }) {
  const { copied, copy } = useClipboard();

  return (
    <Button variant="neutral" onPress={() => copy(text)}>
      <Icon icon={copied ? Check : Copy} size="sm" />
      {copied ? 'Copied!' : 'Copy'}
    </Button>
  );
}
```

## Notes

- `navigator.clipboard.writeText` requires a secure context (HTTPS or localhost).
- The `execCommand('copy')` fallback works in older browsers but is deprecated.
- The `copied` state auto-resets after `timeout` ms (default 2000).

## Preview

```tsx
export function Example() {
  return <CopyButton text="npm install @tale-ui/react" />;
}
```
