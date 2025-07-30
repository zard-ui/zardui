export const DEFAULT_COMPONENT = 'accordion';
export const DEFAULT_DOC = 'installation';

export const HEADER_PATHS = [
  { name: 'Docs', path: '/docs', available: true },
  { name: 'Components', path: '/components', available: true },
  { name: 'Blocks', path: '/blocks', available: false },
  { name: 'Themes', path: '/themes', available: false },
];

const DOCS_PATH = {
  title: 'Getting Started',
  data: [
    { name: 'introduction', path: '/docs', available: false },
    { name: 'installation', path: '/docs/installation', available: true },
    { name: 'theming', path: '/docs/theming', available: true },
    { name: 'cli', path: '/docs', available: false },
    { name: 'figma', path: '/docs', available: false },
  ],
};

const COMPONENTS_PATH = {
  title: 'Components',
  data: [
    { name: 'Accordion', path: '/components/accordion', available: true },
    { name: 'Alert', path: '/components/alert', available: true },
    { name: 'Avatar', path: '/components/avatar', available: true },
    { name: 'Badge', path: '/components/badge', available: true },
    { name: 'Breadcrumb', path: '/components/breadcrumb', available: true },
    { name: 'Button', path: '/components/button', available: true },
    { name: 'Calendar', path: '/components', available: false },
    { name: 'Card', path: '/components/card', available: true },
    { name: 'Carousel', path: '/components', available: false },
    { name: 'Chart', path: '/components', available: false },
    { name: 'Checkbox', path: '/components/checkbox', available: true },
    { name: 'Command', path: '/components/command', available: true },
    { name: 'Confirm Modal', path: '/components', available: false },
    { name: 'Divider', path: '/components/divider', available: true },
    { name: 'Input', path: '/components/input', available: true },
    { name: 'Modal', path: '/components', available: false },
    { name: 'Dialog', path: '/components/dialog', available: true },
    { name: 'Progress Bar', path: '/components/progress-bar', available: true },
    { name: 'Select', path: '/components/select', available: true },
    { name: 'Slider', path: '/components/slider', available: true },
    { name: 'Switch', path: '/components/switch', available: true },
    { name: 'Table', path: '/components', available: false },
    { name: 'Tabs', path: '/components/tabs', available: true },
    { name: 'Toast', path: '/components', available: false },
    { name: 'Toggle', path: '/components/toggle', available: true },
    { name: 'Tooltip', path: '/components/tooltip', available: true },
    { name: 'Radio', path: '/components/radio', available: true },
    { name: 'Loader', path: '/components/loader', available: true },
    { name: 'Dropdown', path: '/components/dropdown', available: true },
    { name: 'Popover', path: '/components/popover', available: true },
  ].sort((a, b) => a.name.localeCompare(b.name)),
};

export const SIDEBAR_PATHS = [DOCS_PATH, COMPONENTS_PATH];
