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

  details: cva('relative inline-block text-sm font-medium'),

  summary: cva('flex items-center border gap-2 px-4 py-2 mb-4 rounded-md cursor-pointer'),

  dropdownUl: cva('border absolute z-10 right-0 w-full rounded-md p-1 flex flex-col gap-2 bg-white dark:bg-neutral-800'),

  dropdownLi: cva('hover:bg-neutral-100 dark:hover:bg-neutral-700 :focus-within:bg-neutral-100 dark:focus-within:bg-neutral-700  px-4 py-1 rounded-md'),

  dropdownLiLabel: cva('flex items-center gap-1 cursor-pointer'),

  dropdownCheckbox: cva('peer appearance-none w-5 h-5 :focus:visible focus:outline-none'),

  dropdownCheckIconWrapper: cva('absolute peer-checked:opacity-100 opacity-0'),

  toolbar: cva('flex justify-between items-center w-full'),

  toolbarItem: cva('min-w-[1px]'),
};
