import * as React from 'react';
import { Column } from './column';
import { Disclosure } from './disclosure';

export type AccordionItem = Readonly<{ id: string; title: string; content: React.ReactNode }>;
export type AccordionProps = { items: readonly AccordionItem[] };

export function Accordion({ items }: AccordionProps) {
  return (
    <Column>
      {items.map((item) => (
        <Disclosure key={item.id} title={item.title}>
          {item.content}
        </Disclosure>
      ))}
    </Column>
  );
}
