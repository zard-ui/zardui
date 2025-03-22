export const DEFAULT_COMPONENT = 'badge';
export const DEFAULT_DOC = 'installation';

export const HEADER_PATHS = [
  {
    name: 'Docs',
    path: '/docs',
    available: true,
    activeClass: '!text-foreground font-semibold',
    class: 'transition-colors hover:text-foreground/80 text-foreground/80 gap-2',
  },
  {
    name: 'Components',
    path: '/components',
    available: true,
    activeClass: '!text-foreground font-semibold',
    class: 'transition-colors hover:text-foreground/80 text-foreground/80 gap-2',
  },
  {
    name: 'Blocks',
    path: '/blocks',
    available: false,
    activeClass: '!text-foreground font-semibold',
    class: 'transition-colors hover:text-foreground/80 text-foreground/80 gap-2',
  },
  {
    name: 'Themes',
    path: '/themes',
    available: false,
    activeClass: '!text-foreground font-semibold',
    class: 'transition-colors hover:text-foreground/80 text-foreground/80 gap-2',
  },
];

export const SIDEBAR_PATHS = [
  {
    name: 'Badge',
    path: '/components/badge',
  },
  {
    name: 'Button',
    path: '/components/button',
  },
  {
    name: 'Card',
    path: '/components/card',
  },
  {
    name: 'Checkbox',
    path: '/components/checkbox',
  },
  {
    name: 'Input',
    path: '/components/input',
  },
  {
    name: 'Select',
    path: '/components/select',
  },
  {
    name: 'Switch',
    path: '/components/switch',
  },
];
