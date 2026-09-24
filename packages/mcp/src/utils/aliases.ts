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

/** Components known under this other name: `toast` → `sonner`, `modal` → `dialog`, `alert-dialog`. */
export function componentsAliasedAs(input: string): string[] {
  const wanted = input.toLowerCase().replace(/[-_]+/g, ' ').trim();
  return Object.keys(ALIASES).filter(name => ALIASES[name].includes(wanted));
}
