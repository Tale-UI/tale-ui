import * as React from 'react';
import { fireEvent, screen, waitFor } from '@tale-ui/monorepo-tests/test-utils';
import { expect, vi } from 'vitest';
import { CommandPalette } from '@tale-ui/react/command-palette';
import {
  commandPaletteDefaultFilter,
  normalizeCommandPaletteShortcut,
  useCommandPalette,
  useCommandPaletteShortcut,
  type CommandPaletteCommand,
} from '@tale-ui/react/command-palette';
import '../styles.css';
import { createRenderer, isJSDOM } from '#test-utils';

const OriginalIntersectionObserver = globalThis.IntersectionObserver;
let originalRootClassName = '';
let originalRootColorMode: string | null = null;

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];

  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve() {}
}

function hasStyleRule(selector: string) {
  function ruleListIncludes(ruleList: CSSRuleList): boolean {
    return Array.from(ruleList).some((rule) => {
      if (rule instanceof CSSImportRule) {
        return rule.styleSheet ? ruleListIncludes(rule.styleSheet.cssRules) : false;
      }

      return 'selectorText' in rule && String(rule.selectorText).includes(selector);
    });
  }

  return Array.from(document.styleSheets).some((styleSheet) => {
    try {
      return ruleListIncludes(styleSheet.cssRules);
    } catch {
      return false;
    }
  });
}

function getStyleRuleDeclaration(selector: string, property: string) {
  function findDeclaration(ruleList: CSSRuleList): string | null {
    for (const rule of Array.from(ruleList)) {
      if (rule instanceof CSSImportRule) {
        const declaration = rule.styleSheet ? findDeclaration(rule.styleSheet.cssRules) : null;

        if (declaration) {
          return declaration;
        }
      }

      if (rule instanceof CSSStyleRule && rule.selectorText.includes(selector)) {
        const declaration = rule.style.getPropertyValue(property);

        if (declaration) {
          return declaration;
        }
      }
    }

    return null;
  }

  for (const styleSheet of Array.from(document.styleSheets)) {
    try {
      const declaration = findDeclaration(styleSheet.cssRules);

      if (declaration) {
        return declaration;
      }
    } catch {
      continue;
    }
  }

  return null;
}

const commands: CommandPaletteCommand[] = [
  {
    id: 'open-file',
    title: 'Open File',
    subtitle: 'Find a file in the workspace',
    group: 'Workspace',
    keywords: ['quick open'],
  },
  {
    id: 'toggle-theme',
    title: 'Toggle Theme',
    group: 'Preferences',
    keywords: ['appearance'],
  },
  {
    id: 'archive-project',
    title: 'Archive Project',
    group: 'Danger',
    disabled: true,
  },
];

function HookDemo({ onAction }: { onAction: (command: CommandPaletteCommand) => void }) {
  const palette = useCommandPalette({
    commands,
    onAction,
    defaultQuery: 'theme',
  });

  return (
    <div>
      <input
        aria-label="Filter commands"
        value={palette.query}
        onChange={(event) => palette.setQuery(event.currentTarget.value)}
      />
      <ul>
        {palette.groupedCommands.map((group) => (
          <li key={group.id}>
            <h3>{group.title}</h3>
            <ul>
              {group.commands.map((command) => (
                <li key={command.id}>
                  <button
                    id={String(palette.getItemProps(command).id)}
                    disabled={palette.getItemProps(command).isDisabled}
                    onClick={() => void palette.runCommand(command)}
                  >
                    {command.title}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShortcutDemo({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const [open, setOpen] = React.useState(false);

  const setOpenAndNotify = React.useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  useCommandPaletteShortcut({
    open,
    setOpen: setOpenAndNotify,
    shortcut: 'ctrl+k',
  });

  return <output aria-label="shortcut state">{open ? 'open' : 'closed'}</output>;
}

function StaticPalette({
  onAction,
  defaultOpen = true,
}: {
  onAction?: () => void;
  defaultOpen?: boolean;
}) {
  return (
    <CommandPalette.Root defaultOpen={defaultOpen} size="lg">
      <CommandPalette.Trigger>Open palette</CommandPalette.Trigger>
      <CommandPalette.Backdrop>
        <CommandPalette.Popup>
          <CommandPalette.Title>Command Palette</CommandPalette.Title>
          <CommandPalette.Description>
            Run commands and jump between views.
          </CommandPalette.Description>
          <CommandPalette.Close aria-label="Close palette" />
          <CommandPalette.Content>
            <CommandPalette.SearchField>
              <CommandPalette.Input autoFocus={false} placeholder="Search commands" />
              <CommandPalette.ClearButton aria-label="Clear search" />
            </CommandPalette.SearchField>
            <CommandPalette.Chips aria-label="Active filters">
              <CommandPalette.Chip>
                Views
                <CommandPalette.ChipRemove aria-label="Remove Views filter" />
              </CommandPalette.Chip>
            </CommandPalette.Chips>
            <CommandPalette.ListBox>
              <CommandPalette.Section>
                <CommandPalette.SectionHeader>Workspace</CommandPalette.SectionHeader>
                <CommandPalette.Item id="open-file" textValue="Open File" onAction={onAction}>
                  <CommandPalette.ItemIcon aria-hidden>O</CommandPalette.ItemIcon>
                  <CommandPalette.ItemContent>
                    <CommandPalette.ItemTitle>Open File</CommandPalette.ItemTitle>
                    <CommandPalette.ItemDescription>
                      Find a file in the workspace.
                    </CommandPalette.ItemDescription>
                  </CommandPalette.ItemContent>
                  <CommandPalette.ItemMeta>
                    <CommandPalette.Shortcut keys={['Mod', 'P']} />
                  </CommandPalette.ItemMeta>
                </CommandPalette.Item>
              </CommandPalette.Section>
            </CommandPalette.ListBox>
            <CommandPalette.LoadMoreItem>Load more commands</CommandPalette.LoadMoreItem>
            <CommandPalette.Footer>Use arrow keys to navigate.</CommandPalette.Footer>
          </CommandPalette.Content>
        </CommandPalette.Popup>
      </CommandPalette.Backdrop>
    </CommandPalette.Root>
  );
}

describe('<CommandPalette />', () => {
  const { render } = createRenderer();

  beforeAll(() => {
    originalRootClassName = document.documentElement.className;
    originalRootColorMode = document.documentElement.getAttribute('data-color-mode');
    document.documentElement.classList.add('tale-ui');
    document.documentElement.setAttribute('data-color-mode', 'light');
    globalThis.IntersectionObserver = MockIntersectionObserver;
  });

  afterAll(() => {
    document.documentElement.className = originalRootClassName;
    if (originalRootColorMode === null) {
      document.documentElement.removeAttribute('data-color-mode');
    } else {
      document.documentElement.setAttribute('data-color-mode', originalRootColorMode);
    }
    globalThis.IntersectionObserver = OriginalIntersectionObserver;
  });

  it('filters, groups, and runs commands from useCommandPalette', async () => {
    const onAction = vi.fn();
    const { user } = await render(<HookDemo onAction={onAction} />);

    expect(screen.getByRole('heading', { name: 'Preferences' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Toggle Theme' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Open File' })).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Toggle Theme' }));
    expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ id: 'toggle-theme' }));

    await user.clear(screen.getByRole('textbox', { name: 'Filter commands' }));
    await user.type(screen.getByRole('textbox', { name: 'Filter commands' }), 'open');

    expect(screen.getByRole('button', { name: 'Open File' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Archive Project' })).toBeNull();
  });

  it('matches default filter fields and normalized shortcut definitions', () => {
    expect(commandPaletteDefaultFilter(commands[0]!, 'quick')).toBe(true);
    expect(commandPaletteDefaultFilter(commands[0]!, 'workspace')).toBe(true);
    expect(commandPaletteDefaultFilter(commands[0]!, 'missing')).toBe(false);

    const [shortcut] = normalizeCommandPaletteShortcut(['mod+k', 'ctrl+shift+p']);
    expect(shortcut).toMatchObject({
      altKey: false,
      ctrlKey: false,
      shiftKey: false,
      key: 'k',
    });
  });

  it('toggles open state from a registered keyboard shortcut', async () => {
    const onOpenChange = vi.fn();
    await render(<ShortcutDemo onOpenChange={onOpenChange} />);

    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

    expect(screen.getByLabelText('shortcut state').textContent).toBe('open');
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('renders the composable palette parts with stable BEM classes', async () => {
    await render(<StaticPalette />);

    expect(screen.getByRole('dialog').classList.contains('tale-command-palette__dialog')).toBe(
      true,
    );
    expect(
      screen
        .getByRole('heading', { name: 'Command Palette' })
        .classList.contains('tale-command-palette__title'),
    ).toBe(true);
    expect(screen.getByRole('searchbox').classList.contains('tale-command-palette__input')).toBe(
      true,
    );
    expect(screen.getByText('Clear').classList.contains('tale-command-palette__clear')).toBe(true);
    expect(screen.getByText('Clear').classList.contains('tale-button--ghost')).toBe(true);
    expect(screen.getByText('Clear').classList.contains('tale-button--sm')).toBe(true);
    expect(
      screen
        .getByRole('searchbox')
        .closest('.tale-command-palette__search-field')
        ?.classList.contains('tale-command-palette__search-field--inline'),
    ).toBe(true);
    expect(
      screen
        .getByRole('option', { name: /Open File/ })
        .classList.contains('tale-command-palette__item'),
    ).toBe(true);
    expect(
      screen.getByText('Workspace').classList.contains('tale-command-palette__section-header'),
    ).toBe(true);
    expect(
      screen
        .getByText('Load more commands')
        .classList.contains('tale-command-palette__load-more-item'),
    ).toBe(true);
  });

  it('merges modalProps className onto the popup surface', async () => {
    await render(
      <CommandPalette.Root defaultOpen>
        <CommandPalette.Trigger>Open palette</CommandPalette.Trigger>
        <CommandPalette.Backdrop>
          <CommandPalette.Popup
            aria-label="Translucent command palette"
            modalProps={{ className: 'tale-command-palette__popup--translucent' }}
          >
            <CommandPalette.Content>
              <CommandPalette.SearchField>
                <CommandPalette.Input autoFocus={false} placeholder="Search commands" />
              </CommandPalette.SearchField>
              <CommandPalette.ListBox aria-label="Commands">
                <CommandPalette.Section>
                  <CommandPalette.Item id="open-launch" textValue="Open launch">
                    <CommandPalette.ItemContent>
                      <CommandPalette.ItemTitle>Open launch</CommandPalette.ItemTitle>
                    </CommandPalette.ItemContent>
                  </CommandPalette.Item>
                </CommandPalette.Section>
              </CommandPalette.ListBox>
            </CommandPalette.Content>
          </CommandPalette.Popup>
        </CommandPalette.Backdrop>
      </CommandPalette.Root>,
    );

    const popup = screen.getByRole('dialog').closest('.tale-command-palette__popup');

    expect(popup?.classList.contains('tale-command-palette__popup')).toBe(true);
    expect(popup?.classList.contains('tale-command-palette__popup--translucent')).toBe(true);
  });

  it.skipIf(isJSDOM)('opens from the trigger and closes from the close control', async () => {
    const { user } = await render(<StaticPalette defaultOpen={false} />);

    expect(screen.queryByRole('dialog')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Open palette' }));
    expect(screen.getByRole('dialog')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Close palette' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it.skipIf(isJSDOM)('closes when pressing outside the popup', async () => {
    const onOpenChange = vi.fn();
    const { user } = await render(
      <CommandPalette.Root defaultOpen onOpenChange={onOpenChange}>
        <CommandPalette.Trigger>Open palette</CommandPalette.Trigger>
        <CommandPalette.Backdrop>
          <CommandPalette.Popup aria-label="Command palette">
            <CommandPalette.Content>
              <CommandPalette.SearchField>
                <CommandPalette.Input autoFocus={false} placeholder="Search commands" />
              </CommandPalette.SearchField>
              <CommandPalette.ListBox aria-label="Commands">
                <CommandPalette.Section>
                  <CommandPalette.Item id="open-launch" textValue="Open launch">
                    <CommandPalette.ItemContent>
                      <CommandPalette.ItemTitle>Open launch</CommandPalette.ItemTitle>
                    </CommandPalette.ItemContent>
                  </CommandPalette.Item>
                </CommandPalette.Section>
              </CommandPalette.ListBox>
            </CommandPalette.Content>
          </CommandPalette.Popup>
        </CommandPalette.Backdrop>
      </CommandPalette.Root>,
    );

    expect(screen.getByRole('dialog')).toBeTruthy();

    const backdrop = document.querySelector('.tale-command-palette__backdrop');
    expect(backdrop).toBeInstanceOf(HTMLElement);

    await user.click(backdrop as HTMLElement);

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it.skipIf(isJSDOM)(
    'applies popup sizing and search field layout styles in browsers',
    async () => {
      await render(<StaticPalette />);

      const popup = screen.getByRole('dialog').closest('.tale-command-palette__popup');
      const input = screen.getByRole('searchbox');

      expect(popup).not.toBeNull();
      expect(getComputedStyle(popup as Element).width).not.toBe('auto');
      expect(getComputedStyle(input).minHeight).not.toBe('0px');
    },
  );

  it.skipIf(isJSDOM)('applies translucent popup surface styles in browsers', async () => {
    await render(
      <CommandPalette.Root defaultOpen>
        <CommandPalette.Trigger>Open palette</CommandPalette.Trigger>
        <CommandPalette.Backdrop className="tale-command-palette__backdrop--transparent">
          <CommandPalette.Popup
            aria-label="Translucent command palette"
            modalProps={{ className: 'tale-command-palette__popup--translucent' }}
          >
            <CommandPalette.Content>
              <CommandPalette.SearchField>
                <CommandPalette.Input autoFocus={false} placeholder="Search commands" />
              </CommandPalette.SearchField>
              <CommandPalette.ListBox aria-label="Commands">
                <CommandPalette.Section>
                  <CommandPalette.Item id="open-launch" textValue="Open launch">
                    <CommandPalette.ItemContent>
                      <CommandPalette.ItemTitle>Open launch</CommandPalette.ItemTitle>
                    </CommandPalette.ItemContent>
                  </CommandPalette.Item>
                </CommandPalette.Section>
              </CommandPalette.ListBox>
            </CommandPalette.Content>
          </CommandPalette.Popup>
        </CommandPalette.Backdrop>
      </CommandPalette.Root>,
    );

    const popup = screen.getByRole('dialog').closest('.tale-command-palette__popup');
    const backdrop = document.querySelector('.tale-command-palette__backdrop');

    expect(popup).not.toBeNull();
    expect(backdrop).not.toBeNull();
    expect(hasStyleRule('.tale-command-palette__popup--translucent')).toBe(true);
    expect(hasStyleRule('.tale-command-palette__backdrop--transparent')).toBe(true);
    expect(getComputedStyle(popup as Element).backdropFilter).not.toBe('none');
    expect(getComputedStyle(backdrop as Element).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(
      getStyleRuleDeclaration(
        '.tale-command-palette__popup--translucent .tale-command-palette__item[data-hovered]',
        'background-color',
      ),
    ).toBe('color-mix(in srgb, var(--neutral-18) 44%, transparent)');
    expect(
      getStyleRuleDeclaration(
        '.tale-command-palette__popup--translucent .tale-command-palette__item[data-focused]',
        'background-color',
      ),
    ).toBe('color-mix(in srgb, var(--neutral-20) 50%, transparent)');
    expect(
      getStyleRuleDeclaration(
        '.tale-command-palette__popup--translucent .tale-command-palette__item[data-pressed]',
        'background-color',
      ),
    ).toBe('color-mix(in srgb, var(--neutral-22) 56%, transparent)');
    expect(
      getStyleRuleDeclaration(
        '.tale-command-palette__popup--translucent .tale-command-palette__item[data-hovered][data-selected]',
        'background-color',
      ),
    ).toBe('color-mix(in srgb, var(--color-20) 56%, transparent)');
    expect(
      getStyleRuleDeclaration(
        '.tale-command-palette__popup--translucent .tale-command-palette__item[data-focused][data-selected]',
        'background-color',
      ),
    ).toBe('color-mix(in srgb, var(--color-30) 60%, transparent)');
    expect(
      getStyleRuleDeclaration(
        '.tale-command-palette__popup--translucent .tale-command-palette__item[data-pressed][data-selected]',
        'background-color',
      ),
    ).toBe('color-mix(in srgb, var(--color-30) 64%, transparent)');

    const item = screen.getByRole('option', { name: 'Open launch' });

    item.setAttribute('data-hovered', 'true');
    expect(item.hasAttribute('data-hovered')).toBe(true);

    item.removeAttribute('data-hovered');
    item.setAttribute('data-focused', 'true');
    expect(item.hasAttribute('data-focused')).toBe(true);

    item.removeAttribute('data-focused');
    item.setAttribute('data-pressed', 'true');
    expect(item.hasAttribute('data-pressed')).toBe(true);
  });

  it.skipIf(isJSDOM)('applies interactive item state styles in browsers', async () => {
    const { user } = await render(<StaticPalette />);
    const item = screen.getByRole('option', { name: /Open File/ });
    const shortcutKey = item.querySelector('.tale-command-palette__shortcut-key');

    expect(shortcutKey).not.toBeNull();
    expect(hasStyleRule('.tale-command-palette__item[data-hovered]')).toBe(true);
    expect(hasStyleRule('.tale-command-palette__item[data-pressed]')).toBe(true);
    expect(hasStyleRule('.tale-command-palette__item[data-selected]')).toBe(true);
    expect(
      hasStyleRule('.tale-command-palette__item[data-hovered] .tale-command-palette__shortcut-key'),
    ).toBe(true);

    await user.hover(item);

    expect(item.hasAttribute('data-hovered')).toBe(true);

    item.setAttribute('data-selected', 'true');
    expect(item.hasAttribute('data-selected')).toBe(true);
  });
});
