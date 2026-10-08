import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const DRAWER_API: ApiSection[] = [
  {
    selector: 'z-drawer',
    description:
      'Root of a declarative drawer. Holds the open state and hosts the projected content. The panel exposes `data-placement`, `data-axis`, `data-state`, `data-swiping`, `data-snap-points`, `data-expanded` and `data-nested-open` (present while a drawer stacked on top of this one is open). Two CSS variables tune the panel: `--z-drawer-inset` (gap kept between the panel and the viewport edge, default `0.5rem`) and `--z-drawer-bleed` (fills that gap while the panel is dragged past its edge — set it for an edge-to-edge look). A drawer with `zSnapPoints` also publishes `--z-drawer-visible-size`, the pixels of the panel currently on screen, so content can size itself against whatever is reachable at the active snap point.',
    props: [
      { name: '[zVisible]', description: 'Open state, two-way bound', type: 'boolean', default: 'false' },
      {
        name: '[zPlacement]',
        description:
          'Edge of the screen the drawer slides from. Also sets the swipe axis: top/bottom drag vertically, left/right drag horizontally',
        type: "'top' | 'right' | 'bottom' | 'left'",
        default: "'bottom'",
      },
      {
        name: '[zSnapPoints]',
        description:
          'Sizes the drawer rests at. 0–1 is a fraction of the viewport, above that pixels, strings keep their CSS unit',
        type: '(number | string)[]',
        default: '-',
      },
      {
        name: '[zSnapPoint]',
        description: 'Active snap point, two-way bound through [(zSnapPoint)]. Defaults to the first one',
        type: 'number | string',
        default: '-',
      },
      {
        name: '[zDismissible]',
        description: 'Whether swiping, the mask and Escape can close the drawer',
        type: 'boolean',
        default: 'true',
      },
      { name: '[zHandle]', description: 'Renders the swipe handle', type: 'boolean', default: 'false' },
      {
        name: '[zModal]',
        description: 'Renders the mask and blocks the page behind. Set false for a non-modal drawer',
        type: 'boolean',
        default: 'true',
      },
      { name: '[class]', description: 'Custom CSS classes applied to the panel', type: 'ClassValue', default: '-' },
      {
        name: '(zAfterOpen)',
        description: 'Emitted once the drawer is attached',
        type: 'EventEmitter<void>',
        default: '-',
      },
      {
        name: '(zAfterClose)',
        description: 'Emitted once the exit animation has finished',
        type: 'EventEmitter<void>',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-drawer-header',
    description: 'Layout slot for the top of a drawer, next to `z-drawer-title` and `z-drawer-description`.',
    props: [{ name: '[class]', description: 'Custom CSS classes to apply', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-drawer-footer',
    description: 'Layout slot for the bottom of a drawer, typically the action buttons.',
    props: [{ name: '[class]', description: 'Custom CSS classes to apply', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-drawer-title',
    description: 'Accessible name of the drawer. Wired to `aria-labelledby` automatically.',
    props: [
      {
        name: '[zTitle]',
        description: 'Title text or template, when not projecting content',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      { name: '[class]', description: 'Custom CSS classes to apply', type: 'ClassValue', default: '-' },
    ],
  },
  {
    selector: 'z-drawer-description',
    description: 'Supporting text. Wired to `aria-describedby` automatically.',
    props: [
      {
        name: '[zDescription]',
        description: 'Description text or template, when not projecting content',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      { name: '[class]', description: 'Custom CSS classes to apply', type: 'ClassValue', default: '-' },
    ],
  },
  {
    selector: '[z-drawer-close]',
    description: 'Closes the drawer it is projected into. Works for declarative and service-opened drawers alike.',
    props: [],
  },
  {
    selector: 'ZardDrawerOptions',
    description: 'Configuration accepted by `ZardDrawerService.create()`.',
    props: [
      {
        name: '[zTitle]',
        description: 'Drawer title text or template',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      {
        name: '[zDescription]',
        description: 'Drawer description text or template',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      {
        name: '[zContent]',
        description: 'Custom content component, template, or HTML',
        type: 'string | TemplateRef<T> | Type<T>',
        default: '-',
      },
      {
        name: '[zPlacement]',
        description: 'Edge of the screen the drawer slides from',
        type: "'top' | 'right' | 'bottom' | 'left'",
        default: "'bottom'",
      },
      { name: '[zSnapPoints]', description: 'Sizes the drawer rests at', type: '(number | string)[]', default: '-' },
      { name: '[zSnapPoint]', description: 'Snap point the drawer opens at', type: 'number | string', default: '-' },
      {
        name: '[zDismissible]',
        description: 'Whether swiping, the mask and Escape can close the drawer',
        type: 'boolean',
        default: 'true',
      },
      { name: '[zHandle]', description: 'Renders the swipe handle', type: 'boolean', default: 'false' },
      {
        name: '[zMask]',
        description: 'Renders the backdrop and blocks the page behind. Set false for a non-modal drawer',
        type: 'boolean',
        default: 'true',
      },
      {
        name: '[zMaskClosable]',
        description: 'Whether clicking outside closes the drawer. Also requires zDismissible',
        type: 'boolean',
        default: 'true',
      },
      { name: '[zClosable]', description: 'Whether to show the close button', type: 'boolean', default: 'true' },
      { name: '[zDuration]', description: 'Exit animation duration in ms', type: 'number', default: '450' },
      { name: '[zOkText]', description: 'OK button text, null to hide button', type: 'string | null', default: "'OK'" },
      {
        name: '[zCancelText]',
        description: 'Cancel button text, null to hide button',
        type: 'string | null',
        default: "'Cancel'",
      },
      {
        name: '[zOkIcon]',
        description: 'OK button icon — registered icon name or inline SVG string',
        type: 'string',
        default: '-',
      },
      {
        name: '[zCancelIcon]',
        description: 'Cancel button icon — registered icon name or inline SVG string',
        type: 'string',
        default: '-',
      },
      {
        name: '[zOkDestructive]',
        description: 'Whether OK button should have destructive styling',
        type: 'boolean',
        default: 'false',
      },
      { name: '[zOkDisabled]', description: 'Whether OK button should be disabled', type: 'boolean', default: 'false' },
      {
        name: '[zHideFooter]',
        description: 'Whether to hide the footer with action buttons',
        type: 'boolean',
        default: 'false',
      },
      { name: '[zCustomClasses]', description: 'Additional CSS classes to apply', type: 'ClassValue', default: '-' },
      {
        name: '[zOnOk]',
        description: 'OK button click handler',
        type: 'EventEmitter<T> | OnClickCallback<T>',
        default: '-',
      },
      {
        name: '[zOnCancel]',
        description: 'Cancel button click handler',
        type: 'EventEmitter<T> | OnClickCallback<T>',
        default: '-',
      },
      { name: '[zData]', description: 'Data to pass to custom content components', type: 'object', default: '-' },
      {
        name: '[zViewContainerRef]',
        description: 'View container for rendering custom content',
        type: 'ViewContainerRef',
        default: '-',
      },
    ],
  },
  {
    selector: 'ZardDrawerRef',
    description: 'Reference returned by `ZardDrawerService.create()`, used to observe and close the drawer.',
    props: [
      {
        name: '[close]',
        description: 'Closes the drawer, optionally with a result',
        type: '(result?: R) => void',
        default: '-',
      },
      {
        name: '[isClosing]',
        description: 'Signal that turns true once the drawer starts closing',
        type: 'Signal<boolean>',
        default: 'false',
      },
      {
        name: '[result]',
        description: 'Signal holding the result passed to close()',
        type: 'Signal<R | undefined>',
        default: 'undefined',
      },
      {
        name: '[componentInstance]',
        description: 'Signal with the instance of the component rendered as content',
        type: 'Signal<T | null>',
        default: 'null',
      },
    ],
  },
];
