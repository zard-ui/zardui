import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SHEET_API: ApiSection[] = [
  {
    selector: 'z-sheet',
    description:
      'Root of a declarative sheet. Holds the open state and projects its content into the panel, which exposes `data-side` and `data-state` (`open` | `closed`) while the enter and leave transitions run.',
    props: [
      { name: '[zVisible]', description: 'Open state, two-way bound', type: 'boolean', default: 'false' },
      {
        name: '[zSide]',
        description: 'Edge of the screen the sheet slides from',
        type: "'top' | 'right' | 'bottom' | 'left'",
        default: "'right'",
      },
      {
        name: '[zSize]',
        description: 'Preset width (left/right) or height (top/bottom). Ignored once `zWidth` or `zHeight` is set',
        type: "'default' | 'sm' | 'lg'",
        default: "'default'",
      },
      { name: '[zWidth]', description: 'Explicit width, for left/right sheets', type: 'string', default: '-' },
      { name: '[zHeight]', description: 'Explicit height, for top/bottom sheets', type: 'string', default: '-' },
      {
        name: '[zClosable]',
        description: 'Renders the close (X) button in the top-right corner',
        type: 'boolean',
        default: 'true',
      },
      {
        name: '[zMaskClosable]',
        description: 'Whether clicking outside the sheet (on the mask) closes it',
        type: 'boolean',
        default: 'true',
      },
      {
        name: '[zDuration]',
        description: 'How long the enter and leave transitions run, in ms',
        type: 'number',
        default: '200',
      },
      { name: '[class]', description: 'Custom CSS classes applied to the panel', type: 'ClassValue', default: '-' },
      {
        name: '(zAfterOpen)',
        description: 'Emitted once the sheet is attached',
        type: 'EventEmitter<void>',
        default: '-',
      },
      {
        name: '(zAfterClose)',
        description: 'Emitted once the exit transition has finished',
        type: 'EventEmitter<void>',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-sheet-header',
    description: 'Layout slot for the top of a sheet, next to `z-sheet-title` and `z-sheet-description`.',
    props: [{ name: '[class]', description: 'Custom CSS classes to apply', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-sheet-footer',
    description: 'Layout slot for the bottom of a sheet, typically the action buttons.',
    props: [{ name: '[class]', description: 'Custom CSS classes to apply', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-sheet-title',
    description: 'Accessible name of the sheet. Wired to `aria-labelledby` automatically.',
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
    selector: 'z-sheet-description',
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
    selector: '[z-sheet-close]',
    description: 'Closes the sheet it is projected into. Works for declarative and service-opened sheets alike.',
    props: [],
  },
  {
    selector: 'ZardSheetOptions',
    description: 'Configuration accepted by `ZardSheetService.create()`.',
    props: [
      {
        name: '[zCancelIcon]',
        description: 'Cancel button icon — registered icon name or inline SVG string',
        type: 'string',
        default: '-',
      },
      {
        name: '[zCancelText]',
        description: 'Cancel button text, null to hide the button',
        type: 'string | null',
        default: "'Cancel'",
      },
      {
        name: '[zClosable]',
        description:
          'Whether the close (X) button in the header is shown. Escape and clicking outside the mask still dismiss the sheet unless `zMaskClosable` is also set to false',
        type: 'boolean',
        default: 'true',
      },
      {
        name: '[zContent]',
        description: 'Custom content component, template, or HTML',
        type: 'string | TemplateRef<T> | Type<T>',
        default: '-',
      },
      { name: '[zCustomClasses]', description: 'Additional CSS classes to apply', type: 'ClassValue', default: '-' },
      { name: '[zData]', description: 'Data to pass to custom content components', type: 'object', default: '-' },
      { name: '[zDescription]', description: 'Sheet description/body text', type: 'string', default: '-' },
      { name: '[zDuration]', description: 'Exit animation duration in ms', type: 'number', default: '200' },
      { name: '[zHeight]', description: "Custom height (e.g., '80vh', '500px')", type: 'string', default: '-' },
      {
        name: '[zHideFooter]',
        description: 'Whether to hide the footer with action buttons',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zMaskClosable]',
        description: 'Whether clicking outside the sheet (on the mask) closes it',
        type: 'boolean',
        default: 'true',
      },
      {
        name: '[zOkDestructive]',
        description: 'Whether the OK button should have destructive styling',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zOkDisabled]',
        description: 'Whether the OK button should be disabled',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zOkIcon]',
        description: 'OK button icon — registered icon name or inline SVG string',
        type: 'string',
        default: '-',
      },
      {
        name: '[zOkText]',
        description: 'OK button text, null to hide the button',
        type: 'string | null',
        default: "'OK'",
      },
      {
        name: '[zOnCancel]',
        description: 'Cancel button click handler',
        type: 'EventEmitter<T> | OnClickCallback<T>',
        default: '-',
      },
      {
        name: '[zOnOk]',
        description: 'OK button click handler',
        type: 'EventEmitter<T> | OnClickCallback<T>',
        default: '-',
      },
      {
        name: '[zSide]',
        description: 'Edge of the screen where the sheet appears',
        type: "'top' | 'right' | 'bottom' | 'left'",
        default: "'right'",
      },
      {
        name: '[zSize]',
        description:
          'Preset size for the sheet, relative to its side. Ignored in favor of a custom size when `zWidth` or `zHeight` is set',
        type: "'default' | 'sm' | 'lg'",
        default: "'default'",
      },
      {
        name: '[zTitle]',
        description: 'Sheet title text or template',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      {
        name: '[zViewContainerRef]',
        description: 'View container for rendering custom content',
        type: 'ViewContainerRef',
        default: '-',
      },
      { name: '[zWidth]', description: "Custom width (e.g., '400px', '50%')", type: 'string', default: '-' },
    ],
  },
  {
    selector: 'ZardSheetRef',
    description: 'Reference returned by `ZardSheetService.create()`, used to observe and close the sheet.',
    props: [
      {
        name: '[close]',
        description: 'Closes the sheet, optionally with a result',
        type: '(result?: R) => void',
        default: '-',
      },
      {
        name: '[isClosing]',
        description: 'Signal that turns true once the sheet starts closing',
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
