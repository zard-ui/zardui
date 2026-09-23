import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const ALERT_DIALOG_API: ApiSection[] = [
  {
    selector: 'z-alert-dialog',
    description:
      'Root of a declarative alert dialog. Holds the open state and projects its content into the panel (`role="alertdialog"`), which exposes `data-size` and `data-state` (`open` | `closed`) while the enter and leave transitions run.',
    props: [
      { name: '[zVisible]', description: 'Open state, two-way bound', type: 'boolean', default: 'false' },
      {
        name: '[zSize]',
        description:
          'Visual size. `default` widens on `sm+` and lays the media next to the title; `sm` keeps a compact, centered layout',
        type: "'default' | 'sm'",
        default: "'default'",
      },
      { name: '[zWidth]', description: "Custom width (e.g., '400px', '50%')", type: 'string', default: '-' },
      {
        name: '[zMaskClosable]',
        description: 'Whether clicking outside closes the alert dialog. Off by default: the user has to decide',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zDuration]',
        description: 'How long the enter and leave transitions run, in ms',
        type: 'number',
        default: '100',
      },
      { name: '[class]', description: 'Custom CSS classes applied to the panel', type: 'ClassValue', default: '-' },
      {
        name: '(zAfterOpen)',
        description: 'Emitted once the alert dialog is attached',
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
    selector: 'z-alert-dialog-header',
    description:
      'Layout slot for the top of an alert dialog: `z-alert-dialog-media`, `z-alert-dialog-title` and `z-alert-dialog-description`.',
    props: [{ name: '[class]', description: 'Custom CSS classes to apply', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-alert-dialog-media',
    description: 'Media slot above the title, usually an icon. The header lays it next to the title on `default` size.',
    props: [
      {
        name: '[class]',
        description: 'Custom CSS classes to apply (e.g. tinted backgrounds for destructive)',
        type: 'ClassValue',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-alert-dialog-title',
    description: 'Accessible name of the alert dialog. Wired to `aria-labelledby` automatically.',
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
    selector: 'z-alert-dialog-description',
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
    selector: 'z-alert-dialog-footer',
    description: 'Layout slot for the action buttons.',
    props: [{ name: '[class]', description: 'Custom CSS classes to apply', type: 'ClassValue', default: '-' }],
  },
  {
    selector: '[z-alert-dialog-close]',
    description:
      'Closes the alert dialog it is projected into. Works for declarative and service-opened alert dialogs alike.',
    props: [],
  },
  {
    selector: 'ZardAlertDialogService',
    description:
      'Opens the same alert dialog from code. `create()`, `confirm()`, `warning()` and `info()` take the options below and return a `ZardAlertDialogRef`.',
    props: [
      {
        name: '[zTitle]',
        description: 'Dialog title text or template',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      { name: '[zDescription]', description: 'Dialog description/body text', type: 'string', default: '-' },
      {
        name: '[zMedia]',
        description: 'Template rendered as a media slot above the title (e.g. an icon)',
        type: 'TemplateRef<void>',
        default: '-',
      },
      {
        name: '[zMediaClass]',
        description: 'Extra classes applied to the media slot wrapper (e.g. tinted backgrounds for destructive)',
        type: 'ClassValue',
        default: '-',
      },
      { name: '[zData]', description: 'Data to pass to custom content components', type: 'object', default: '-' },
      {
        name: '[zOkText]',
        description: 'OK button text, null to hide button',
        type: 'string | null',
        default: "'Continue'",
      },
      {
        name: '[zCancelText]',
        description: 'Cancel button text, null to hide button',
        type: 'string | null',
        default: "'Cancel'",
      },
      {
        name: '[zOkDestructive]',
        description: 'Whether OK button should have destructive styling',
        type: 'boolean',
        default: 'false',
      },
      { name: '[zOkDisabled]', description: 'Whether OK button should be disabled', type: 'boolean', default: 'false' },
      {
        name: '[zMaskClosable]',
        description: 'Whether clicking outside closes the dialog',
        type: 'boolean',
        default: 'false',
      },
      { name: '[zClosable]', description: 'Whether dialog can be closed', type: 'boolean', default: 'true' },
      {
        name: '[zSize]',
        description: 'Visual size of the dialog. `default` is wider on `sm+` breakpoints; `sm` keeps a compact width',
        type: "'default' | 'sm'",
        default: "'default'",
      },
      { name: '[zWidth]', description: "Custom width (e.g., '400px', '50%')", type: 'string', default: '-' },
      { name: '[zCustomClasses]', description: 'Additional CSS classes to apply', type: 'ClassValue', default: '-' },
      {
        name: '[zDuration]',
        description: 'Animation duration (ms) used when closing. Matches the CSS transition',
        type: 'number',
        default: '100',
      },
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
      {
        name: '[zViewContainerRef]',
        description: 'View container for rendering custom content',
        type: 'ViewContainerRef',
        default: '-',
      },
    ],
  },
];
