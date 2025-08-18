import { cva } from 'class-variance-authority';

export const tableVariants = {
  tWrapper: cva('w-full overflow-auto', {
    variants: {
      zType: {
        default: '',
        striped: '',
        bordered: 'border rounded-md',
      },
    },
    defaultVariants: {
      zType: 'default',
    },
  }),

  table: cva('w-full', {
    variants: {
      zSize: {
        default: 'text-base',
        compact: 'text-sm',
        comfortable: 'text-lg',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  }),

  thead: cva('bg-neutral-200 dark:bg-neutral-900'),

  tr: cva('transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700', {
    variants: {
      zType: {
        default: 'border-b',
        striped: 'odd:bg-neutral-100 dark:odd:bg-neutral-800',
        bordered: 'border-b last:border-0',
      },
    },
    defaultVariants: {
      zType: 'default',
    },
  }),

  th: cva('text-left', {
    variants: {
      zSize: {
        default: 'p-4',
        compact: 'p-3',
        comfortable: 'p-6',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  }),

  td: cva('', {
    variants: {
      zSize: {
        default: 'p-4',
        compact: 'p-3',
        comfortable: 'p-6',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  }),
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
