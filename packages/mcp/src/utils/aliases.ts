/**
 * Words people use for a component under a different name. The docs describe
 * what a component does, not what other libraries call it, so "modal" or
 * "toast" would otherwise find nothing.
 */
export const ALIASES: Record<string, string[]> = {
  dialog: ['modal', 'popup', 'lightbox'],
  'alert-dialog': ['confirm', 'confirmation', 'modal'],
  sheet: ['side panel', 'offcanvas', 'slide over'],
  drawer: ['bottom sheet', 'offcanvas'],
  sonner: ['toast', 'toaster', 'notification', 'snackbar'],
  dropdown: ['dropdown menu', 'menu', 'actions'],
  'context-menu': ['right click', 'right-click'],
  select: ['picker', 'dropdown select'],
  combobox: ['autocomplete', 'typeahead', 'searchable select'],
  command: ['command palette', 'cmdk', 'spotlight'],
  switch: ['toggle switch'],
  tooltip: ['hint', 'title'],
  popover: ['popup', 'floating'],
  spinner: ['loader', 'loading'],
  skeleton: ['placeholder', 'shimmer', 'loading'],
  'date-picker': ['datepicker', 'date input'],
  table: ['grid', 'data table', 'datagrid'],
  tabs: ['tab bar', 'segmented'],
  'input-otp': ['otp', 'pin', 'verification code', '2fa'],
  badge: ['tag', 'chip', 'pill', 'label'],
  avatar: ['profile picture', 'user image'],
  separator: ['divider', 'hr'],
  'radio-group': ['radio', 'option'],
  resizable: ['split pane', 'splitter'],
  empty: ['empty state', 'zero state'],
  kbd: ['keyboard', 'shortcut', 'hotkey'],
  sidebar: ['navigation', 'nav'],
  'navigation-menu': ['navbar', 'mega menu', 'header'],
  collapsible: ['expand', 'disclosure'],
  accordion: ['expand', 'disclosure', 'faq'],
  bubble: ['chat', 'message'],
  message: ['chat'],
  chart: ['graph', 'plot', 'visualization'],
  progress: ['progress bar', 'meter'],
  field: ['form', 'label', 'validation'],
};

/**
 * Words people use for a guide under a different name. Guides come from the
 * site's llms.txt, so an alias only applies when its guide is published there.
 */
export const GUIDE_ALIASES: Record<string, string[]> = {
  cli: ['preset', 'presets', 'preset code', 'design preset', 'init preset', 'command line', 'zard-cli'],
  rtl: ['right-to-left', 'right to left', 'arabic', 'hebrew', 'persian', 'farsi', 'direction', 'bidi', 'dir'],
};

/**
 * Words that point at one section of a guide rather than the whole of it. The
 * CLI guide is long and `create` and `apply` are `###` headings under
 * Commands, so someone asking to "start a project" should be handed the
 * command, not the 400 lines around it.
 */
export const GUIDE_SECTION_ALIASES: Record<string, Record<string, string[]>> = {
  cli: {
    create: [
      'create project',
      'create app',
      'create a project',
      'new project',
      'new app',
      'start project',
      'start a project',
      'zard project',
      'project with preset',
      'project with a preset',
      'scaffold',
      'starter',
      'bootstrap',
      'zard-cli create',
      'create preset',
      'create with preset',
    ],
    apply: [
      'apply preset',
      'apply a preset',
      'theme preset',
      'restyle',
      'change preset',
      'change theme',
      'zard-cli apply',
    ],
    init: ['initialize', 'setup', 'zard-cli init'],
    add: ['zard-cli add'],
  },
};

const normalizeAlias = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[-_\s]+/g, ' ')
    .trim();

/** The section of a guide that this word points at: `new project` → `create` in the CLI guide. */
export function sectionAliasedAs(slug: string, input: string): string | undefined {
  const wanted = normalizeAlias(input);
  const sections = GUIDE_SECTION_ALIASES[slug] ?? {};
  return Object.keys(sections).find(
    section => normalizeAlias(section) === wanted || sections[section].some(alias => normalizeAlias(alias) === wanted),
  );
}

/** Guides known under this other name: `right-to-left` → `rtl`. */
export function guidesAliasedAs(input: string): string[] {
  const wanted = normalizeAlias(input);
  const slugs = new Set([...Object.keys(GUIDE_ALIASES), ...Object.keys(GUIDE_SECTION_ALIASES)]);
  return [...slugs].filter(
    slug =>
      slug === wanted ||
      (GUIDE_ALIASES[slug] ?? []).some(alias => normalizeAlias(alias) === wanted) ||
      sectionAliasedAs(slug, wanted) !== undefined,
  );
}

/**
 * Guides, and the section of each, that a free-text query is about. Unlike
 * `guidesAliasedAs` the query may be a sentence ("start a zard project with a
 * preset"): an alias counts when it appears in it as whole words.
 */
export function guideTargetsFor(query: string): { topic: string; section?: string }[] {
  const wanted = ` ${normalizeAlias(query)} `;
  const mentions = (alias: string): boolean => wanted.includes(` ${normalizeAlias(alias)} `);
  const found: { topic: string; section?: string }[] = [];
  for (const [topic, sections] of Object.entries(GUIDE_SECTION_ALIASES)) {
    for (const [section, aliases] of Object.entries(sections)) {
      // The bare command name only counts as the whole query: "create a button" is not about the CLI.
      if (normalizeAlias(query) === section || aliases.some(mentions)) found.push({ topic, section });
    }
  }
  for (const [topic, aliases] of Object.entries(GUIDE_ALIASES)) {
    if (![topic, ...aliases].some(mentions)) continue;
    // A section already points into this guide; the whole guide would only repeat it.
    if (!found.some(target => target.topic === topic)) found.push({ topic });
  }
  return found;
}

/** Components known under this other name: `toast` → `sonner`, `modal` → `dialog`, `alert-dialog`. */
export function componentsAliasedAs(input: string): string[] {
  const wanted = input.toLowerCase().replace(/[-_]+/g, ' ').trim();
  return Object.keys(ALIASES).filter(name => ALIASES[name].includes(wanted));
}
