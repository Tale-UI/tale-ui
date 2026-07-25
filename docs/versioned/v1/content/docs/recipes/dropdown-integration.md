# Dropdown — Integration / Connected Service

A dropdown for selecting or managing a connected integration — such as a third-party service, workspace, or data source. Trigger is a button showing the currently active integration.

## Components Used

- `Menu` from `@tale-ui/react/menu`
- `Icon` from `@tale-ui/react/icon`
- `Badge` from `@tale-ui/react/badge`
- `CheckCircle2`, `Plus`, `Settings` from `lucide-react`

## Code

```tsx
import { Menu } from '@tale-ui/react/menu';
import { Icon } from '@tale-ui/react/icon';
import { Badge } from '@tale-ui/react/badge';
import { CheckCircle2, Plus, Settings } from 'lucide-react';
import { useState } from 'react';

type Integration = {
  id: string;
  name: string;
  logoSrc: string;
  connected: boolean;
};

const integrations: Integration[] = [
  { id: 'github', name: 'GitHub', logoSrc: '/logos/github.svg', connected: true },
  { id: 'linear', name: 'Linear', logoSrc: '/logos/linear.svg', connected: true },
  { id: 'slack', name: 'Slack', logoSrc: '/logos/slack.svg', connected: false },
  { id: 'figma', name: 'Figma', logoSrc: '/logos/figma.svg', connected: false },
];

export function IntegrationDropdown() {
  const [active, setActive] = useState<string>('github');
  const activeIntegration = integrations.find((i) => i.id === active);

  return (
    <Menu.Root>
      <Menu.Trigger className="tale-button tale-button--neutral tale-button--md">
        {activeIntegration ? (
          <>
            <img src={activeIntegration.logoSrc} alt="" width={16} height={16} aria-hidden="true" />
            {activeIntegration.name}
          </>
        ) : (
          'Select integration'
        )}
        {' ▾'}
      </Menu.Trigger>
      <Menu.Popover placement="bottom start" offset={4} style={{ minWidth: 240 }}>
        <Menu.MenuList
          onAction={(key) => {
            if (key === 'manage' || key === 'add') {
              return;
            }
            setActive(String(key));
          }}
        >
          <Menu.Group>
            <Menu.Header>Connected</Menu.Header>
            {integrations
              .filter((i) => i.connected)
              .map((i) => (
                <Menu.Item key={i.id} id={i.id}>
                  <img src={i.logoSrc} alt="" width={16} height={16} aria-hidden="true" />
                  {i.name}
                  {active === i.id ? (
                    <Icon icon={CheckCircle2} size="sm" style={{ marginInlineStart: 'auto' }} />
                  ) : null}
                </Menu.Item>
              ))}
          </Menu.Group>

          <Menu.Separator />

          <Menu.Group>
            <Menu.Header>Available</Menu.Header>
            {integrations
              .filter((i) => !i.connected)
              .map((i) => (
                <Menu.Item key={i.id} id={i.id}>
                  <img src={i.logoSrc} alt="" width={16} height={16} aria-hidden="true" />
                  {i.name}
                  <Badge variant="neutral" size="sm" style={{ marginInlineStart: 'auto' }}>
                    Connect
                  </Badge>
                </Menu.Item>
              ))}
          </Menu.Group>

          <Menu.Separator />

          <Menu.Item id="add">
            <Icon icon={Plus} size="sm" />
            Add integration
          </Menu.Item>
          <Menu.Item id="manage">
            <Icon icon={Settings} size="sm" />
            Manage integrations
          </Menu.Item>
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}
```

## Notes

- The `Menu.MenuList onAction` guard ignores `'manage'` and `'add'` — these trigger navigation, which you would handle separately (e.g., `router.push('/integrations')`).
- `CheckCircle2` icon with `marginInlineStart: 'auto'` provides a right-aligned selection indicator inside the menu item.
- Keep integration logos at 16 × 16 px with `aria-hidden="true"` — the integration name is the accessible label; the logo is decorative.
- For a larger picker (more than 8–10 integrations), replace the `Menu` with a `Dialog` that contains a full `GridList` with search.
