import { cva } from 'class-variance-authority';

export const tableVariants = {
  tWrapper: cva('rounded-md border'),
  table: cva('w-full caption-bottom text-sm overflow-auto'),
  thead: cva('[&_tr]:border-b'),
  tbody: cva('[&_tr:last-child]:border-0'),
  tr: cva('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'),
  th: cva('h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]'),
  td: cva('p-4 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]'),

  pagination: cva('flex justify-end gap-2 items-center mt-4'),

  filtering: cva('mb-4'),
};
