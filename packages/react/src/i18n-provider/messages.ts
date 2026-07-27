export const taleEnglishMessages = {
  'common.clear': 'Clear',
  'common.close': 'Close',
  'common.loading': 'Loading',
  'common.noResults': 'No results',
  'common.openMenu': 'Open menu',
  'common.remove': 'Remove {item}',
  'lightbox.close': 'Close lightbox',
  'lightbox.next': 'Next item',
  'lightbox.previous': 'Previous item',
  'pagination.next': 'Next page',
  'pagination.previous': 'Previous page',
  'table.empty': 'No rows',
  'table.loading': 'Loading rows',
  'table.page': 'Page {page} of {pageCount}',
  'toast.closeAll': 'Close all',
  'toast.dismiss': 'Dismiss notification',
  'toast.region': 'Notifications',
} as const;

export type TaleMessageId = keyof typeof taleEnglishMessages;
export type TaleMessageCatalog = Partial<Record<TaleMessageId, string>>;
export type TaleMessageCatalogs = Record<string, TaleMessageCatalog>;
export type TaleMessageValues = Record<string, string | number>;

const pseudoCharacters: Record<string, string> = {
  a: 'á',
  'e': 'ë',
  i: 'ï',
  o: 'ö',
  u: 'ü',
  A: 'Á',
  E: 'Ë',
  I: 'Ï',
  O: 'Ö',
  U: 'Ü',
};

export function pseudoLocalize(message: string) {
  const transformed = message
    .split(/(\{[A-Za-z][A-Za-z0-9]*\})/g)
    .map((part) =>
      part.startsWith('{')
        ? part
        : [...part].map((character) => pseudoCharacters[character] || character).join(''),
    )
    .join('');
  return `[${transformed}${'~'.repeat(Math.ceil(message.length * 0.3))}]`;
}

export function interpolateMessage(message: string, values: TaleMessageValues = {}) {
  return message.replace(/\{([A-Za-z][A-Za-z0-9]*)\}/g, (placeholder, key: string) => {
    const value = values[key];
    return value === undefined ? placeholder : `\u2068${String(value)}\u2069`;
  });
}
