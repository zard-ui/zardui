import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const NAVIGATION_MENU_API: ApiSection[] = [
  {
    selector: 'z-navigation-menu',
    description: 'Root of the navigation bar; wrap it in a labelled `<nav>`.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zViewport]', description: 'Shares one popup between all triggers', type: 'boolean', default: 'true' },
      {
        name: '[zAlign]',
        description: 'Viewport alignment to the active trigger',
        type: "'start' | 'center' | 'end'",
        default: "'start'",
      },
      {
        name: '[zHoverDelay]',
        description: 'Close delay in ms after the pointer leaves',
        type: 'number',
        default: '100',
      },
    ],
  },
  {
    selector: '[z-navigation-menu-list]',
    description: 'The `<ul>` holding the items of the bar.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: '[z-navigation-menu-item]',
    description: 'The `<li>` wrapping a trigger and its content, or a link.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: '[z-navigation-menu-trigger]',
    description: 'Opens its content; on hover inside a root, on click standalone.',
    props: [
      {
        name: '[zNavigationMenuTriggerFor]',
        description: 'Content template',
        type: 'TemplateRef<void>',
        default: 'required',
      },
      { name: '[zDisabled]', description: 'Disables the trigger', type: 'boolean', default: 'false' },
      {
        name: '[zTrigger]',
        description: 'How the content opens',
        type: "'click' | 'hover'",
        default: "'hover' inside a root, 'click' standalone",
      },
      { name: '[zHoverDelay]', description: 'Close delay in ms on hover exit', type: 'number', default: '100' },
      {
        name: '[zPlacement]',
        description: 'Popup position; overlay mode only, mirrors in RTL',
        type: 'ZardNavigationMenuPlacement',
        default: "'bottomLeft'",
      },
      {
        name: '[zShowChevron]',
        description: 'Shows the chevron',
        type: 'boolean',
        default: 'true inside a root, false standalone',
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: '[z-navigation-menu-content]',
    description: 'Holds the links of one trigger.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: '[z-navigation-menu-link]',
    description: 'A link on a `<button>` or `<a>`; pair `[zActive]` with `routerLinkActive`.',
    props: [
      { name: '[zActive]', description: 'Marks the current link', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Disables the link', type: 'boolean', default: 'false' },
      { name: '[zInset]', description: 'Adds start padding for alignment', type: 'boolean', default: 'false' },
      { name: '[zType]', description: 'Visual variant', type: "'default' | 'destructive'", default: "'default'" },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '(menuItemTriggered)',
        description: 'Emitted when the link is activated',
        type: 'EventEmitter<void>',
        default: '',
      },
    ],
  },
  {
    selector: 'z-navigation-menu-indicator',
    description: 'Arrow that follows the active trigger.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-navigation-menu-viewport',
    description: 'The shared popup; rendered automatically unless you place it yourself.',
    props: [],
  },
  {
    selector: 'z-navigation-menu-label',
    description: 'Label for a group of links.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[inset]', description: 'Adds start padding for alignment', type: 'boolean', default: 'false' },
    ],
  },
  {
    selector: 'z-navigation-menu-shortcut',
    description: 'Keyboard shortcut at the end of a link.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'navigationMenuTriggerVariants()',
    description: 'Returns the trigger classes, for links that must match the triggers.',
    props: [],
  },
];
