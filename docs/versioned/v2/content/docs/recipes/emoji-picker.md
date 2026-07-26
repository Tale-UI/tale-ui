# Emoji Picker

A searchable virtualized emoji picker built from Tale UI primitives.

The inline emoji array in this recipe is intentionally small sample data so the
example stays readable and deterministic in documentation validation. It is not
intended to match the complete emoji catalogue users expect from product pickers
like Messenger, Slack, or the macOS emoji picker.

For production use, replace the sample array with your application emoji data,
for example from `emojibase-data`, normalized into the `EmojiItem` shape shown
below.

## Components Used

- `Popover` from `@tale-ui/react/popover`
- `SearchField` from `@tale-ui/react/search-field`
- `ListBox` from `@tale-ui/react/list-box`
- `Virtualizer`, `GridLayout`, and `Size` from `@tale-ui/react/virtualizer`
- `Text` from `@tale-ui/react/text`

## Code

```tsx
import * as React from 'react';
import { ListBox } from '@tale-ui/react/list-box';
import { Popover } from '@tale-ui/react/popover';
import { SearchField } from '@tale-ui/react/search-field';
import { Text } from '@tale-ui/react/text';
import { Virtualizer, GridLayout, Size } from '@tale-ui/react/virtualizer';

type EmojiItem = {
  id: string;
  emoji: string;
  label: string;
  group: string;
  keywords?: string[];
};

type EmojiSeed = readonly [id: string, emoji: string, label: string, keywords?: readonly string[]];

// Sample data only. Production apps should replace this with a complete
// dataset normalized into EmojiItem[].
const emojiGroups: Array<{ group: string; items: EmojiSeed[] }> = [
  {
    group: 'Smileys',
    items: [
      ['grinning', '😀', 'Grinning face', ['happy', 'smile']],
      ['beaming', '😁', 'Beaming face', ['happy', 'smile']],
      ['joy', '😂', 'Face with tears of joy', ['laugh', 'funny']],
      ['smile', '😄', 'Smiling face', ['happy', 'laugh']],
      ['sweat-smile', '😅', 'Smiling face with sweat', ['relief']],
      ['wink', '😉', 'Winking face', ['playful']],
      ['blush', '😊', 'Blushing face', ['happy']],
      ['heart-eyes', '😍', 'Heart eyes', ['love', 'heart']],
      ['star-struck', '🤩', 'Star struck', ['excited']],
      ['thinking', '🤔', 'Thinking face', ['question']],
      ['zipper', '🤐', 'Zipper mouth face', ['quiet']],
      ['neutral', '😐', 'Neutral face', ['blank']],
      ['rolling-eyes', '🙄', 'Face with rolling eyes', ['skeptical']],
      ['sleeping', '😴', 'Sleeping face', ['tired']],
      ['crying', '😢', 'Crying face', ['sad']],
      ['angry', '😠', 'Angry face', ['mad']],
      ['party', '🥳', 'Party face', ['celebrate', 'birthday']],
      ['melting', '🫠', 'Melting face', ['hot']],
    ],
  },
  {
    group: 'People',
    items: [
      ['wave', '👋', 'Waving hand', ['hello']],
      ['raised-hand', '✋', 'Raised hand', ['stop']],
      ['ok-hand', '👌', 'OK hand', ['approve']],
      ['pinched-fingers', '🤌', 'Pinched fingers', ['gesture']],
      ['thumbs-up', '👍', 'Thumbs up', ['approve', 'yes']],
      ['thumbs-down', '👎', 'Thumbs down', ['no']],
      ['clap', '👏', 'Clapping hands', ['applause', 'great']],
      ['folded-hands', '🙏', 'Folded hands', ['thanks', 'please']],
      ['muscle', '💪', 'Flexed biceps', ['strong']],
      ['eyes', '👀', 'Eyes', ['look']],
      ['brain', '🧠', 'Brain', ['think']],
      ['busts', '👥', 'Busts in silhouette', ['team']],
    ],
  },
  {
    group: 'Animals',
    items: [
      ['dog', '🐶', 'Dog face', ['pet']],
      ['cat', '🐱', 'Cat face', ['pet']],
      ['mouse', '🐭', 'Mouse face', ['animal']],
      ['fox', '🦊', 'Fox', ['animal']],
      ['bear', '🐻', 'Bear', ['animal']],
      ['panda', '🐼', 'Panda', ['animal']],
      ['lion', '🦁', 'Lion', ['animal']],
      ['frog', '🐸', 'Frog', ['animal']],
      ['bird', '🐦', 'Bird', ['animal']],
      ['butterfly', '🦋', 'Butterfly', ['animal']],
      ['octopus', '🐙', 'Octopus', ['animal']],
      ['whale', '🐳', 'Whale', ['animal']],
    ],
  },
  {
    group: 'Food',
    items: [
      ['apple', '🍎', 'Red apple', ['fruit']],
      ['banana', '🍌', 'Banana', ['fruit']],
      ['grapes', '🍇', 'Grapes', ['fruit']],
      ['watermelon', '🍉', 'Watermelon', ['fruit']],
      ['lemon', '🍋', 'Lemon', ['fruit']],
      ['carrot', '🥕', 'Carrot', ['vegetable']],
      ['croissant', '🥐', 'Croissant', ['bread']],
      ['pizza', '🍕', 'Pizza', ['food']],
      ['taco', '🌮', 'Taco', ['food']],
      ['sushi', '🍣', 'Sushi', ['food']],
      ['cake', '🍰', 'Shortcake', ['dessert']],
      ['coffee', '☕', 'Coffee', ['drink']],
    ],
  },
  {
    group: 'Travel',
    items: [
      ['car', '🚗', 'Car', ['travel']],
      ['taxi', '🚕', 'Taxi', ['travel']],
      ['bus', '🚌', 'Bus', ['travel']],
      ['train', '🚆', 'Train', ['travel']],
      ['airplane', '✈️', 'Airplane', ['travel']],
      ['rocket', '🚀', 'Rocket', ['launch', 'ship']],
      ['bike', '🚲', 'Bicycle', ['travel']],
      ['ship', '🚢', 'Ship', ['travel']],
      ['beach', '🏖️', 'Beach with umbrella', ['vacation']],
      ['mountain', '⛰️', 'Mountain', ['travel']],
      ['city', '🏙️', 'Cityscape', ['travel']],
      ['tent', '⛺', 'Tent', ['camp']],
    ],
  },
  {
    group: 'Objects',
    items: [
      ['watch', '⌚', 'Watch', ['time']],
      ['phone', '📱', 'Mobile phone', ['device']],
      ['laptop', '💻', 'Laptop', ['computer']],
      ['keyboard', '⌨️', 'Keyboard', ['computer']],
      ['camera', '📷', 'Camera', ['photo']],
      ['bulb', '💡', 'Light bulb', ['idea']],
      ['book', '📘', 'Blue book', ['read']],
      ['pencil', '✏️', 'Pencil', ['write']],
      ['package', '📦', 'Package', ['box']],
      ['key', '🔑', 'Key', ['lock']],
      ['gift', '🎁', 'Gift', ['present']],
      ['balloon', '🎈', 'Balloon', ['party']],
    ],
  },
  {
    group: 'Symbols',
    items: [
      ['heart', '❤️', 'Red heart', ['love']],
      ['orange-heart', '🧡', 'Orange heart', ['love']],
      ['yellow-heart', '💛', 'Yellow heart', ['love']],
      ['green-heart', '💚', 'Green heart', ['love']],
      ['blue-heart', '💙', 'Blue heart', ['love']],
      ['purple-heart', '💜', 'Purple heart', ['love']],
      ['sparkles', '✨', 'Sparkles', ['shine', 'magic']],
      ['fire', '🔥', 'Fire', ['hot']],
      ['hundred', '💯', 'Hundred points', ['score']],
      ['check', '✅', 'Check mark button', ['done']],
      ['warning', '⚠️', 'Warning', ['alert']],
      ['star', '⭐', 'Star', ['favorite']],
    ],
  },
];

const emojis: EmojiItem[] = emojiGroups.flatMap(({ group, items }) =>
  items.map(([id, emoji, label, keywords]) => ({
    id,
    emoji,
    label,
    group,
    keywords: keywords ? [...keywords] : undefined,
  })),
);

export function EmojiPickerExample() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [selectedEmoji, setSelectedEmoji] = React.useState<EmojiItem | null>(null);

  const filteredEmojis = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return emojis;
    }

    return emojis.filter((item) => {
      const searchable = [
        item.label,
        item.group,
        ...(item.keywords ?? []),
      ].join(' ').toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [query]);

  function selectEmoji(key: React.Key | null) {
    const emoji = filteredEmojis.find((item) => item.id === key);
    if (!emoji) {
      return;
    }

    setSelectedEmoji(emoji);
    setIsOpen(false);
  }

  return (
    <Popover.Root isOpen={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger className="tale-button tale-button--neutral tale-button--md">
        {selectedEmoji ? `${selectedEmoji.emoji} ${selectedEmoji.label}` : 'Choose emoji'}
      </Popover.Trigger>
      <Popover.Popup
        aria-label="Emoji picker"
        className="tale-popover__popup--frameless"
        placement="bottom start"
        offset={8}
      >
        <div className="tale-popover__search-container">
          <SearchField.Root variant="inline" value={query} onChange={setQuery}>
            <SearchField.Label>Search emoji</SearchField.Label>
            <SearchField.Input placeholder="Search emoji..." />
            <SearchField.ClearButton />
          </SearchField.Root>
        </div>

        {filteredEmojis.length > 0 ? (
          <Virtualizer
            layout={GridLayout}
            layoutOptions={{
              minItemSize: new Size(24, 24),
              maxItemSize: new Size(24, 24),
              minSpace: new Size(4, 4),
              maxColumns: 7,
              preserveAspectRatio: true,
            }}
          >
            <ListBox.Root
              aria-label="Emoji results"
              items={filteredEmojis}
              layout="grid"
              selectionMode="single"
              selectedKeys={selectedEmoji ? [selectedEmoji.id] : []}
              className="tale-list-box--frameless"
              onSelectionChange={(keys) => {
                const key = keys === 'all' ? null : [...keys][0] ?? null;
                selectEmoji(key);
              }}
            >
              {(item) => (
                <ListBox.Item
                  className="tale-list-box__item--emoji"
                  id={item.id}
                  textValue={item.label}
                >
                  {item.emoji}
                </ListBox.Item>
              )}
            </ListBox.Root>
          </Virtualizer>
        ) : (
          <Text as="div" className="tale-popover__empty" color="muted">
            No emoji found.
          </Text>
        )}
      </Popover.Popup>
    </Popover.Root>
  );
}
```

## Full Emoji Data

The picker does not require Tale UI to ship or own the emoji catalogue. Treat the
`emojis` array as an application input and source it from the dataset that fits
your product, locale, bundle budget, and custom emoji requirements.

One common option is `emojibase-data`. Install it in the consuming app:

`pnpm add emojibase-data`

Then normalize the data before passing it to the picker:

```ts
import emojiData from 'emojibase-data/en/data.json';
import messages from 'emojibase-data/en/messages.json';

type EmojibaseEmoji = {
  emoji: string;
  group?: number;
  hexcode: string;
  label: string;
  tags?: string[];
};

const groupLabels = new Map(
  messages.groups.map((group) => [group.order, group.message]),
);

export const fullEmojiData: EmojiItem[] = (emojiData as EmojibaseEmoji[]).map(
  (item) => ({
    id: item.hexcode,
    emoji: item.emoji,
    label: item.label,
    group: groupLabels.get(item.group ?? -1) ?? 'Emoji',
    keywords: item.tags,
  }),
);
```

Use `fullEmojiData` wherever the recipe uses the sample `emojis` constant. For
localized search, import a different locale from `emojibase-data/{locale}` and
normalize the same way.

## Customization Points

- Replace the inline `emojis` array with a complete application data source.
- Normalize external emoji datasets into `{ id, emoji, label, group, keywords }`.
- Decide whether to include skin tone variants as separate items, hide them
  behind a tone picker, or store a preferred tone in application state.
- Tune `GridLayout` sizing for larger or denser emoji cells.
- Store recent or frequently used emoji in application state and render them as a separate section.
