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
    // `cn-native-select-icon` is the chevron, which is a background image of the <select> itself: it carries the
    // size and position a style gives it.
    'cn-native-select cn-native-select-icon w-full min-w-0 appearance-none outline-none select-none selection:bg-primary selection:text-primary-foreground',
    'bg-no-repeat',
    CHEVRON_LIGHT,
    CHEVRON_DARK,
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    'dark:scheme-dark',
    '[&[multiple]]:h-auto [&[multiple]]:bg-none dark:[&[multiple]]:bg-none',
    '[&_option]:bg-[Canvas] [&_option]:text-[CanvasText] [&_optgroup]:bg-[Canvas] [&_optgroup]:text-[CanvasText]',
  ),
  {
    variants: {
      zSize: {
        sm: 'cn-native-select-size-sm',
        default: '',
        lg: 'cn-native-select-size-lg',
      },
    },
    defaultVariants: { zSize: 'default' },
  },
);

type Variants = VariantProps<typeof nativeSelectVariants>;
export type ZardNativeSelectSizeVariants = NonNullable<Variants['zSize']>;
