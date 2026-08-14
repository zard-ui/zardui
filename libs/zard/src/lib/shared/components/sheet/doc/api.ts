import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SHEET_API: ApiSection[] = [
  {
    selector: 'ZardSheetOptions',
    description: 'Configuration options for creating and managing sheet overlays.',
    props: [
      { name: 'zTitle', description: 'Sheet title text or template', type: 'string | TemplateRef<T>', default: '-' },
      { name: 'zDescription', description: 'Sheet description/body text', type: 'string', default: '-' },
      {
        name: 'zContent',
        description: 'Custom content component, template, or HTML',
        type: 'string | TemplateRef<T> | Type<T>',
        default: '-',
      },
      {
        name: 'zSide',
        description: 'Edge of the screen where the sheet appears',
        type: "'top' | 'right' | 'bottom' | 'left'",
        default: "'right'",
      },
      {
        name: 'zSize',
        description: 'Preset size for the sheet, relative to its side',
        type: "'default' | 'sm' | 'lg'",
        default: "'default'",
      },
      { name: 'zWidth', description: "Custom width (e.g., '400px', '50%')", type: 'string', default: '-' },
      { name: 'zHeight', description: "Custom height (e.g., '80vh', '500px')", type: 'string', default: '-' },
      { name: 'zDuration', description: 'Exit animation duration in ms', type: 'number', default: '200' },
      { name: 'zOkText', description: 'OK button text, null to hide button', type: 'string | null', default: "'OK'" },
      {
        name: 'zCancelText',
        description: 'Cancel button text, null to hide button',
        type: 'string | null',
        default: "'Cancel'",
      },
      {
        name: 'zOkIcon',
        description: 'OK button icon — registered icon name or inline SVG string',
        type: 'string',
        default: '-',
      },
      {
        name: 'zCancelIcon',
        description: 'Cancel button icon — registered icon name or inline SVG string',
        type: 'string',
        default: '-',
      },
      {
        name: 'zOkDestructive',
        description: 'Whether OK button should have destructive styling',
        type: 'boolean',
        default: 'false',
      },
      { name: 'zOkDisabled', description: 'Whether OK button should be disabled', type: 'boolean', default: 'false' },
      {
        name: 'zHideFooter',
        description: 'Whether to hide the footer with action buttons',
        type: 'boolean',
        default: 'false',
      },
      {
        name: 'zMaskClosable',
        description: 'Whether clicking outside closes the sheet',
        type: 'boolean',
        default: 'true',
      },
      { name: 'zClosable', description: 'Whether to show the close button', type: 'boolean', default: 'true' },
      { name: 'zCustomClasses', description: 'Additional CSS classes to apply', type: 'ClassValue', default: '-' },
      {
        name: 'zOnOk',
        description: 'OK button click handler',
        type: 'EventEmitter<T> | OnClickCallback<T>',
        default: '-',
      },
      {
        name: 'zOnCancel',
        description: 'Cancel button click handler',
        type: 'EventEmitter<T> | OnClickCallback<T>',
        default: '-',
      },
      { name: 'zData', description: 'Data to pass to custom content components', type: 'object', default: '-' },
      {
        name: 'zViewContainerRef',
        description: 'View container for rendering custom content',
        type: 'ViewContainerRef',
        default: '-',
      },
    ],
  },
  {
    selector: 'ZardSheetRef',
    description: 'Reference returned by `ZardSheetService.create()`, used to observe and close the sheet.',
    props: [
      {
        name: 'close',
        description: 'Closes the sheet, optionally with a result',
        type: '(result?: R) => void',
        default: '-',
      },
      {
        name: 'isClosing',
        description: 'Signal that turns true once the sheet starts closing',
        type: 'Signal<boolean>',
        default: 'false',
      },
      {
        name: 'result',
        description: 'Signal holding the result passed to close()',
        type: 'Signal<R | undefined>',
        default: 'undefined',
      },
      {
        name: 'componentInstance',
        description: 'Signal with the instance of the component rendered as content',
        type: 'Signal<T | null>',
        default: 'null',
      },
    ],
  },
  {
    selector: 'ZardSheetComponent',
    description: 'Sheet overlay component outputs.',
    props: [
      {
        name: 'okTriggered',
        description: 'Emitted when OK button is clicked',
        type: 'EventEmitter<void>',
        default: '-',
      },
      {
        name: 'cancelTriggered',
        description: 'Emitted when Cancel button is clicked',
        type: 'EventEmitter<void>',
        default: '-',
      },
    ],
  },
];
