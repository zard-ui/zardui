import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const NAVIGATION_MENU_API: ApiSection[] = [
  {
    selector: 'z-navigation-menu',
    description: 'Root of the navigation bar. Scopes the shared viewport to the triggers inside it.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zViewport]',
        description: 'Share a single animated popup between every trigger. When false each trigger opens its own',
        type: 'boolean',
        default: 'true',
      },
      {
        name: '[zAlign]',
        description: 'Which edge of the active trigger the shared viewport lines up with',
        type: "'start' | 'center' | 'end'",
        default: "'start'",
      },
      {
        name: '[zHoverDelay]',
        description: 'Delay in ms before closing once the pointer leaves the bar',
        type: 'number',
        default: '100',
      },
    ],
  },
  {
    selector: 'z-navigation-menu-list',
    description: 'The `<ul>` holding the items of the bar.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-navigation-menu-item',
    description: 'The `<li>` wrapping a trigger and its content, or a standalone link.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-navigation-menu-trigger',
    description: 'Opens the content it points to. Inside a root it opens on hover; standalone it opens on click.',
    props: [
      {
        name: '[zNavigationMenuTriggerFor]',
        description: 'Reference to the content template',
        type: 'TemplateRef<void>',
        default: 'required',
      },
      { name: '[zDisabled]', description: 'Whether the trigger is disabled', type: 'boolean', default: 'false' },
      {
        name: '[zTrigger]',
        description: 'How the content is opened',
        type: "'click' | 'hover'",
        default: "'hover' inside a root, 'click' standalone",
      },
      {
        name: '[zHoverDelay]',
        description: 'Delay in ms before closing on hover exit',
        type: 'number',
        default: '100',
      },
      {
        name: '[zPlacement]',
        description: 'Popup position relative to the trigger. Overlay mode only',
        type: 'ZardNavigationMenuPlacement',
        default: "'bottomLeft'",
      },
      {
        name: '[zShowChevron]',
        description: 'Render the built-in chevron',
        type: 'boolean',
        default: 'true inside a root, false standalone',
      },
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-navigation-menu-content',
    description:
      'Container for the links of one trigger. Inside the shared viewport it is plain content; in overlay mode it is the popup itself.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-navigation-menu-link',
    description: 'A single entry. Pair `[zActive]` with `routerLinkActive` to mark the current route.',
    props: [
      { name: '[zActive]', description: 'Marks the link as the current one', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Whether the link is disabled', type: 'boolean', default: 'false' },
      { name: '[zInset]', description: 'Add left padding for alignment', type: 'boolean', default: 'false' },
      {
        name: '[zType]',
        description: 'Visual variant of the link',
        type: "'default' | 'destructive'",
        default: "'default'",
      },
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[menuItemTriggered]',
        description: 'Emits when the link is activated',
        type: 'EventEmitter',
        default: '',
      },
    ],
  },
  {
    selector: 'z-navigation-menu-indicator',
    description: 'The arrow that follows the trigger currently owning the viewport.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-navigation-menu-viewport',
    description:
      'The shared popup. Rendered automatically by the root while `zViewport` is on — declare it manually only to place it yourself.',
    props: [],
  },
  {
    selector: 'z-navigation-menu-label',
    description: 'Label for grouping links inside a content block.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: '[inset]', description: 'Adds left padding for alignment', type: 'boolean', default: 'false' },
    ],
  },
  {
    selector: 'z-navigation-menu-shortcut',
    description: 'Displays a keyboard shortcut aligned to the end of a link.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-context-menu',
    description: 'Opens a content template on right click, anchored to the pointer.',
    props: [
      {
        name: '[zContextMenuTriggerFor]',
        description: 'Reference to the context menu content',
        type: 'TemplateRef<void>',
        default: 'required',
      },
    ],
  },
  {
    selector: 'navigationMenuTriggerVariants()',
    description: 'Helper that returns the trigger classes, for links that must line up with the triggers of the bar.',
    props: [],
  },
];
