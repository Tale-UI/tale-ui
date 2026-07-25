import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Column } from '@tale-ui/react/column';
import { I18nProvider, useLocale, useTaleI18n } from '@tale-ui/react/i18n-provider';
import { Text } from '@tale-ui/react/text';

function MessagePreview() {
  const { locale, direction } = useLocale();
  const { formatMessage, mode } = useTaleI18n();
  return (
    <Column gap="s">
      <Text variant="label">
        {locale} · {direction} · {mode}
      </Text>
      <Text>{formatMessage('table.page', { page: 2, pageCount: 8 })}</Text>
      <Text>{formatMessage('common.remove', { item: 'Report' })}</Text>
    </Column>
  );
}

const meta: Meta = {
  title: 'Components/I18nProvider',
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const English: Story = {
  render: () => (
    <I18nProvider locale="en-US">
      <MessagePreview />
    </I18nProvider>
  ),
};

export const PseudoLocale: Story = {
  render: () => (
    <I18nProvider mode="pseudo">
      <MessagePreview />
    </I18nProvider>
  ),
};

export const ForcedRtl: Story = {
  render: () => (
    <I18nProvider mode="rtl">
      <MessagePreview />
    </I18nProvider>
  ),
};
