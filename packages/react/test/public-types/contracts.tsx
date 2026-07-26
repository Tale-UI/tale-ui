import type { HTMLProps } from '@tale-ui/react/types';
import { Button, type ButtonProps } from '@tale-ui/react/button';
import type { DialogRootProps } from '@tale-ui/react/dialog';
import type { TableControllerQuery } from '@tale-ui/react/table';

const buttonProps = {
  children: 'Save',
  size: 'md',
  variant: 'primary',
} satisfies ButtonProps;

export const buttonContract = <Button {...buttonProps} />;

export const dialogContract = {
  defaultOpen: false,
  children: null,
} satisfies DialogRootProps;

export const tableQueryContract = {
  selectedKeys: new Set(),
  page: 1,
  pageSize: 25,
  filter: {
    schemaVersion: '1.0.0',
    value: '',
  },
} satisfies TableControllerQuery;

export type DivContract = HTMLProps<HTMLDivElement>;
