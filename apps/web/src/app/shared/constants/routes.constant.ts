export const DEFAULT_COMPONENT = 'accordion';
export const DEFAULT_DOC = 'installation';

export const HEADER_PATHS = [
  { name: 'Docs', path: '/docs', available: true },
  { name: 'Components', path: '/docs/components', available: true },
  { name: 'Blocks', path: '/blocks', available: false },
  { name: 'Themes', path: '/themes', available: false },
];

const DOCS_PATH = {
  title: 'Getting Started',
  data: [
    { name: 'introduction', path: '/docs/introduction', available: true },
    { name: 'installation', path: '/docs/installation', available: true },
    { name: 'components.json', path: '/docs', available: false },
    { name: 'theming', path: '/docs/theming', available: true },
    { name: 'dark mode', path: '/docs/dark-mode', available: true },
    { name: 'CLI', path: '/docs/cli', available: true },
    { name: 'figma', path: '/docs/figma', available: true },
    { name: 'change log', path: '/docs', available: false },
    { name: 'About and credits', path: '/docs', available: false },
  ],
};

const COMPONENTS_PATH = {
  title: 'Components',
  data: [
    { name: 'Accordion', path: '/docs/components/accordion', available: true },
    { name: 'Alert', path: '/docs/components/alert', available: true },
    { name: 'Avatar', path: '/docs/components/avatar', available: true },
    { name: 'Badge', path: '/docs/components/badge', available: true },
    { name: 'Breadcrumb', path: '/docs/components/breadcrumb', available: true },
    { name: 'Button', path: '/docs/components/button', available: true },
    { name: 'Calendar', path: '/docs/components', available: false },
    { name: 'Card', path: '/docs/components/card', available: true },
    { name: 'Carousel', path: '/docs/components', available: false },
    { name: 'Chart', path: '/docs/components', available: false },
    { name: 'Checkbox', path: '/docs/components/checkbox', available: true },
    { name: 'Command', path: '/docs/components/command', available: true },
    { name: 'Confirm Modal', path: '/docs/components', available: false },
    { name: 'Divider', path: '/docs/components/divider', available: true },
    { name: 'Input', path: '/docs/components/input', available: true },
    { name: 'Modal', path: '/docs/components', available: false },
    { name: 'Dialog', path: '/docs/components/dialog', available: true },
    { name: 'Progress Bar', path: '/docs/components/progress-bar', available: true },
    { name: 'Select', path: '/docs/components/select', available: true },
    { name: 'Slider', path: '/docs/components/slider', available: true },
    { name: 'Switch', path: '/docs/components/switch', available: true },
    { name: 'Table', path: '/docs/components', available: false },
    { name: 'Tabs', path: '/docs/components/tabs', available: true },
    { name: 'Toast', path: '/docs/components', available: false },
    { name: 'Toggle', path: '/docs/components/toggle', available: true },
    { name: 'Tooltip', path: '/docs/components/tooltip', available: true },
    { name: 'Radio', path: '/docs/components/radio', available: true },
    { name: 'Loader', path: '/docs/components/loader', available: true },
    { name: 'Dropdown', path: '/docs/components/dropdown', available: true },
    { name: 'Popover', path: '/docs/components/popover', available: true },
  ].sort((a, b) => a.name.localeCompare(b.name)),
};

export const SIDEBAR_PATHS = [DOCS_PATH, COMPONENTS_PATH];
