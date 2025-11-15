export const DEFAULT_COMPONENT = 'accordion';
export const DEFAULT_DOC = 'installation';

export const HEADER_PATHS = [
  { name: 'Docs', path: '/docs', available: true },
  { name: 'Components', path: '/docs/components', available: true },
  { name: 'Blocks', path: '/blocks', available: true },
  { name: 'Charts', path: '/charts', available: false },
  { name: 'Themes', path: '/themes', available: false },
];

export const DOCS_PATH = {
  title: 'Getting Started',
  data: [
    { name: 'Introduction', path: '/docs/introduction', available: true },
    { name: 'Installation', path: '/docs/installation', available: true },
    { name: 'components.json', path: '/docs/components-json', available: true },
    { name: 'Theming', path: '/docs/theming', available: true },
    { name: 'Dark Mode', path: '/docs/dark-mode', available: true },
    { name: 'CLI', path: '/docs/cli', available: true },
    { name: 'Blocks', path: '/docs', available: false },
    { name: 'Figma', path: '/docs/figma', available: true },
    { name: 'Changelog', path: '/docs/changelog', available: true },
    { name: 'About & Credits', path: '/docs/about', available: true },
  ],
};

export const COMPONENTS_PATH = {
  title: 'Components',
  data: [
    { name: 'Accordion', path: '/docs/components/accordion', available: true },
    { name: 'Alert', path: '/docs/components/alert', available: true },
    { name: 'Alert Dialog', path: '/docs/components/alert-dialog', available: true },
    { name: 'Avatar', path: '/docs/components/avatar', available: true },
    { name: 'Badge', path: '/docs/components/badge', available: true },
    { name: 'Breadcrumb', path: '/docs/components/breadcrumb', available: true },
    { name: 'Button', path: '/docs/components/button', available: true },
    { name: 'Calendar', path: '/docs/components/calendar', available: true },
    { name: 'Card', path: '/docs/components/card', available: true },
    { name: 'Carousel', path: '/docs/components', available: false },
    { name: 'Chart', path: '/docs/components', available: false },
    { name: 'Checkbox', path: '/docs/components/checkbox', available: true },
    { name: 'Combobox', path: '/docs/components/combobox', available: true },
    { name: 'Command', path: '/docs/components/command', available: true },
    { name: 'Date Picker', path: '/docs/components/date-picker', available: true },
    { name: 'Divider', path: '/docs/components/divider', available: true },
    { name: 'Empty', path: '/docs/components/empty', available: true },
    { name: 'Form', path: '/docs/components/form', available: true },
    { name: 'Float Label', path: '/docs/components/float-label', available: true },
    { name: 'Icon', path: '/docs/components/icon', available: true },
    { name: 'Input', path: '/docs/components/input', available: true },
    { name: 'Input Group', path: '/docs/components/input-group', available: true },
    { name: 'Layout', path: '/docs/components/layout', available: true },
    { name: 'Dialog', path: '/docs/components/dialog', available: true },
    { name: 'Pagination', path: '/docs/components/pagination', available: true },
    { name: 'Progress Bar', path: '/docs/components/progress-bar', available: true },
    { name: 'Select', path: '/docs/components/select', available: true },
    { name: 'Slider', path: '/docs/components/slider', available: true },
    { name: 'Skeleton', path: '/docs/components/skeleton', available: true },
    { name: 'Switch', path: '/docs/components/switch', available: true },
    { name: 'Table', path: '/docs/components/table', available: true },
    { name: 'Tabs', path: '/docs/components/tabs', available: true },
    { name: 'Toast', path: '/docs/components/toast', available: true },
    { name: 'Toggle', path: '/docs/components/toggle', available: true },
    { name: 'Toggle Group', path: '/docs/components/toggle-group', available: true },
    { name: 'Tooltip', path: '/docs/components/tooltip', available: true },
    { name: 'Menu', path: '/docs/components/menu', available: true },
    { name: 'Resizable', path: '/docs/components/resizable', available: true },
    { name: 'Sheet', path: '/docs/components/sheet', available: true },
    { name: 'Sidebar', path: '/docs/components/layout', available: true },
    { name: 'Radio', path: '/docs/components/radio', available: true },
    { name: 'Segmented', path: '/docs/components/segmented', available: true },
    { name: 'Loader', path: '/docs/components/loader', available: true },
    { name: 'Dropdown', path: '/docs/components/dropdown', available: true },
    { name: 'Popover', path: '/docs/components/popover', available: true },
  ].sort((a, b) => a.name.localeCompare(b.name)),
};

export const SIDEBAR_PATHS = [DOCS_PATH, COMPONENTS_PATH];
