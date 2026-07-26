# useResizeObserver

A hook to observe element size changes via `ResizeObserver`. Copy-paste this into your project.

## Code

```tsx
import { useEffect, useRef, type RefObject } from 'react';

interface UseResizeObserverOptions {
  /** Ref to the element to observe. */
  ref: RefObject<Element | null>;
  /** Which CSS box model to observe. */
  box?: ResizeObserverBoxOptions;
  /** Called when the observed element resizes. */
  onResize: (entry: ResizeObserverEntry) => void;
}

export function useResizeObserver({ ref, box, onResize }: UseResizeObserverOptions) {
  const callbackRef = useRef(onResize);
  callbackRef.current = onResize;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) callbackRef.current(entry);
    });

    observer.observe(element, box ? { box } : undefined);
    return () => observer.disconnect();
  }, [ref, box]);
}
```

## Usage

```tsx
import { useRef, useState } from 'react';
import { Text } from '@tale-ui/react/text';

function ResponsiveComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useResizeObserver({
    ref,
    onResize(entry) {
      setWidth(entry.contentRect.width);
    },
  });

  return <div ref={ref}>Current width: {Math.round(width)}px</div>;
}
```

## Notes

- `ResizeObserver` is supported in all modern browsers (Chrome 64+, Firefox 69+, Safari 13.1+).
- The callback ref pattern ensures the latest `onResize` is always called without re-subscribing the observer.
- The observer is automatically disconnected on unmount.

## Preview

```tsx
import { useRef, useState } from 'react';

export function Example() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useResizeObserver({
    ref,
    onResize(entry) {
      setSize({
        width: Math.round(entry.contentRect.width),
        height: Math.round(entry.contentRect.height),
      });
    },
  });

  return (
    <div
      ref={ref}
      style={{
        padding: 'var(--space-l)',
        resize: 'both',
        overflow: 'auto',
        minWidth: 160,
        minHeight: 80,
      }}
    >
      <Text color="muted">Resize me ↘</Text>
      <Text variant="label">
        {size.width} × {size.height}px
      </Text>
    </div>
  );
}
```
