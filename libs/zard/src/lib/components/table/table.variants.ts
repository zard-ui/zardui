import { cva } from 'class-variance-authority';

export const tableVariants = {
  tWrapper: cva('w-full border rounded-md overflow-auto'),

  table: cva('w-full text-sm'),

  thead: cva(''),

  tbody: cva(''),

  tr: cva('border-b transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900'),

  th: cva('p-4 text-left '),

  td: cva('p-4 '),

  toolbar: cva('flex justify-between items-center w-full'),

  toolbarItem: cva('min-w-[1px]'),

  filtering: cva('mb-4'),

  details: cva('relative inline-block text-sm font-medium'),

  summary: cva('h-10 flex items-center border gap-2 px-4 py-2 mb-4 rounded-md cursor-pointer'),

  dropdownUl: cva('border absolute z-10 right-0 w-max rounded-md p-1 flex flex-col gap-2 bg-white dark:bg-neutral-800'),

  dropdownLi: cva('hover:bg-neutral-100 dark:hover:bg-neutral-700 :focus-within:bg-neutral-100 dark:focus-within:bg-neutral-700  px-4 py-1 rounded-md'),

  dropdownLiLabel: cva('flex items-center gap-1 cursor-pointer'),

  dropdownCheckbox: cva('peer appearance-none w-5 h-5 :focus:visible focus:outline-none'),

  dropdownCheckIconWrapper: cva('absolute peer-checked:opacity-100 opacity-0'),

  pagination: cva('flex justify-end gap-2 items-center mt-4'),
};
