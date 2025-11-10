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

  table: cva(['table-fixed w-full', '[&_th]:text-left', '[&_td]:border-t', '[&_tr]:hover:bg-neutral-100 [&_tr]:dark:hover:bg-neutral-900'], {
    variants: {
      zSize: {
        compact: ['text-sm', '[&_th]:px-2.5 [&_th]:py-1.5', '[&_td]:px-2.5 [&_td]:py-1.5'],
        default: ['text-base', '[&_th]:px-3 [&_th]:py-2', '[&_td]:px-3 [&_td]:py-2'],
        comfortable: ['text-lg', '[&_th]:px-4 [&_th]:py-2.5', '[&_td]:px-4 [&_td]:py-2.5'],
      },
      zType: {
        default: '',
        striped: ['[&_thead]:bg-neutral-100 [&_thead]:dark:bg-neutral-900', '[&_tr]:even:bg-neutral-100 dark:[&_tr]:even:bg-neutral-900'],
        bordered: [''],
      },
    },
    defaultVariants: {
      zSize: 'default',
      zType: 'default',
    },
  }),

  tHead: cva('border-b', {
    variants: {
      zType: {
        default: '',
        striped: 'bg-neutral-100 dark:bg-neutral-900',
        bordered: '',
      },
    },
  }),

  tBody: cva('[&_tr:last-child]:border-0', {
    variants: {
      zType: {
        default: '',
        striped: '[&>tr]:even:bg-neutral-100 dark:[&>tr]:even:bg-neutral-900',
        bordered: '',
      },
    },
    defaultVariants: {
      zType: 'default',
    },
  }),

  tr: cva('border-b transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900', {
    variants: {
      zType: {
        default: '',
        striped: 'even:bg-neutral-100 dark:even:bg-neutral-900',
        bordered: '',
      },
    },
    defaultVariants: {
      zType: 'default',
    },
  }),

  th: cva('text-left', {
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
        default: '',
        compact: '',
        comfortable: '',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  }),

  tableCaptionVariants: cva('mt-4 text-sm text-muted-foreground', {
    variants: {},
    defaultVariants: {},
  }),

  filtering: cva('mb-4 dark:bg-neutral-900 rounded-md', {
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

  details: cva('relative inline-block text-sm font-medium'),

  summary: cva('transition-colors flex items-center border gap-2 px-4 mb-4 rounded-md cursor-pointer dark:bg-neutral-900  hover:bg-neutral-100 dark:hover:bg-neutral-800', {
    variants: {
      zSize: {
        default: 'py-2',
        compact: 'py-1.5',
        comfortable: 'py-2.5',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  }),

  dropdownUl: cva('border absolute z-10 right-0 w-max rounded-md p-1 flex flex-col gap-2 bg-white dark:bg-neutral-800'),

  dropdownLi: cva('hover:bg-neutral-200 dark:hover:bg-neutral-700 focus-within:bg-neutral-200 dark:focus-within:bg-neutral-700 px-4 py-1 rounded-md'),

  dropdownLiLabel: cva('flex items-center gap-1 cursor-pointer'),

  dropdownCheckbox: cva('peer appearance-none w-5 h-5 focus:visible focus:outline-none'),

  dropdownCheckIconWrapper: cva('absolute peer-checked:opacity-100 opacity-0'),
};
