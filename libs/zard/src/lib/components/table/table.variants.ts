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

  table: cva('table-fixed w-full', {
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

  thead: cva('border-b', {
    variants: {
      zType: {
        default: 'border-t',
        striped: 'border-t',
        bordered: '',
      },
    },
  }),

  tr: cva('border-b transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900', {
    variants: {
      zType: {
        default: '',
        striped: '[tbody>&]:odd:bg-neutral-100 dark:[tbody>&]:odd:bg-neutral-900',
        bordered: 'last:border-0',
      },
    },
    defaultVariants: {
      zType: 'default',
    },
  }),

  th: cva('text-left text-neutral-950 dark:text-neutral-50', {
    variants: {
      zSize: {
        default: 'p-4',
        compact: 'p-3',
        comfortable: 'p-5',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  }),

  thSortable: cva('hover:cursor-pointer', {
    variants: {
      zSize: {
        default: '',
        compact: '',
        comfortable: '',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  }),

  td: cva('text-neutral-800 dark:text-neutral-300', {
    variants: {
      zSize: {
        default: 'p-4',
        compact: 'p-3',
        comfortable: 'p-5',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  }),

  toolbar: cva('flex justify-between items-center w-full'),

  toolbarItem: cva('min-w-[1px]'),

  filtering: cva('mb-4 dark:bg-neutral-900 rounded-md'),

  details: cva('relative inline-block text-sm font-medium'),

  summary: cva('h-10 flex items-center border gap-2 px-4 py-2 mb-4 rounded-md cursor-pointer dark:bg-neutral-900'),

  dropdownUl: cva('border absolute z-10 right-0 w-max rounded-md p-1 flex flex-col gap-2 bg-white dark:bg-neutral-800'),

  dropdownLi: cva('hover:bg-neutral-200 dark:hover:bg-neutral-700 focus-within:bg-neutral-200 dark:focus-within:bg-neutral-700 px-4 py-1 rounded-md'),

  dropdownLiLabel: cva('flex items-center gap-1 cursor-pointer'),

  dropdownCheckbox: cva('peer appearance-none w-5 h-5 focus:visible focus:outline-none'),

  dropdownCheckIconWrapper: cva('absolute peer-checked:opacity-100 opacity-0'),

  pagination: cva('flex justify-end gap-2 items-center mt-4'),
};
