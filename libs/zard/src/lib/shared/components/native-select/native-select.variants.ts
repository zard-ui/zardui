import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

// Lucide `chevron-down`, inlined as a background image so the real <select> needs no wrapper or sibling element.
// The stroke matches `--muted-foreground` in light (#737373) and dark (#a1a1a1) themes.
const CHEVRON_LIGHT =
  'bg-[url(data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27%23737373%27%20stroke-width%3D%272%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Cpath%20d%3D%27m6%209%206%206%206-6%27%2F%3E%3C%2Fsvg%3E)]';
const CHEVRON_DARK =
  'dark:bg-[url(data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27%23a1a1a1%27%20stroke-width%3D%272%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Cpath%20d%3D%27m6%209%206%206%206-6%27%2F%3E%3C%2Fsvg%3E)]';

export const nativeSelectVariants = cva(
  mergeClasses(
    'h-8 w-full min-w-0 appearance-none rounded-lg border border-input bg-transparent py-1 ps-2.5 pe-8 text-sm transition-colors outline-none select-none selection:bg-primary selection:text-primary-foreground',
    'bg-no-repeat bg-size-[1rem] bg-position-[right_0.625rem_center] rtl:bg-position-[left_0.625rem_center]',
    CHEVRON_LIGHT,
    CHEVRON_DARK,
    'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
    'dark:bg-input/30 dark:scheme-dark dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
    '[&[multiple]]:h-auto [&[multiple]]:bg-none dark:[&[multiple]]:bg-none',
    '[&_option]:bg-[Canvas] [&_option]:text-[CanvasText] [&_optgroup]:bg-[Canvas] [&_optgroup]:text-[CanvasText]',
  ),
  {
    variants: {
      zSize: {
        sm: 'h-7 rounded-[min(var(--radius-md),10px)] py-0.5',
        default: '',
        lg: 'h-10 ps-3 pe-9 text-base md:text-sm',
      },
    },
    defaultVariants: { zSize: 'default' },
  },
);

type Variants = VariantProps<typeof nativeSelectVariants>;
export type ZardNativeSelectSizeVariants = NonNullable<Variants['zSize']>;
