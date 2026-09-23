import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const DIALOG_API: ApiSection[] = [
  {
    selector: 'z-dialog',
    description:
      'Root of a declarative dialog. Holds the open state and projects its content into the panel, which exposes `data-state` (`open` | `closed`) while the enter and leave transitions run.',
    props: [
      { name: '[zVisible]', description: 'Open state, two-way bound', type: 'boolean', default: 'false' },
      {
        name: '[zClosable]',
        description: 'Renders the close (X) button in the top-right corner',
        type: 'boolean',
        default: 'true',
      },
      {
        name: '[zMaskClosable]',
        description: 'Whether clicking outside the dialog (on the mask) closes it',
        type: 'boolean',
        default: 'true',
      },
      { name: '[zWidth]', description: "Custom width (e.g., '400px', '50%')", type: 'string', default: '-' },
      {
        name: '[zDuration]',
        description: 'How long the enter and leave transitions run, in ms',
        type: 'number',
        default: '100',
      },
      { name: '[class]', description: 'Custom CSS classes applied to the panel', type: 'ClassValue', default: '-' },
      {
        name: '(zAfterOpen)',
        description: 'Emitted once the dialog is attached',
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
    selector: 'z-dialog-header',
    description: 'Layout slot for the top of a dialog, next to `z-dialog-title` and `z-dialog-description`.',
    props: [{ name: '[class]', description: 'Custom CSS classes to apply', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-dialog-footer',
    description: 'Layout slot for the bottom of a dialog, typically the action buttons.',
    props: [{ name: '[class]', description: 'Custom CSS classes to apply', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-dialog-title',
    description: 'Accessible name of the dialog. Wired to `aria-labelledby` automatically.',
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
    selector: 'z-dialog-description',
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
    selector: '[z-dialog-close]',
    description: 'Closes the dialog it is projected into. Works for declarative and service-opened dialogs alike.',
    props: [],
  },
  {
    selector: 'ZardDialogService',
    description: 'Opens the same dialog from code. `create()` takes the options below and returns a `ZardDialogRef`.',
    props: [
      { name: '[zCancelIcon]', description: 'Sets the cancel icon.', type: 'string', default: '-' },
      {
        name: '[zCancelText]',
        description: "Cancel button text, null to hide the button. Defaults to 'Cancel'.",
        type: 'string | null',
        default: "'Cancel'",
      },
      {
        name: '[zClosable]',
        description:
          'Whether the close (X) button in the header is shown. Escape and clicking outside the mask still dismiss the dialog unless `zMaskClosable` is also set to false.',
        type: 'boolean',
        default: 'true',
      },
      {
        name: '[zContent]',
        description: 'Custom content component, template, or HTML.',
        type: 'string | TemplateRef<T> | Type<T>',
        default: '-',
      },
      {
        name: '[zCustomClasses]',
        description: 'Additional CSS classes to apply to the dialog panel.',
        type: 'ClassValue',
        default: '-',
      },
      { name: '[zData]', description: 'Data to pass to custom content components.', type: 'U', default: '-' },
      { name: '[zDescription]', description: 'Sets the dialog description.', type: 'string', default: '-' },
      {
        name: '[zDuration]',
        description: 'Animation duration (ms) used when closing. Matches the CSS transition.',
        type: 'number',
        default: '100',
      },
      { name: '[zHideFooter]', description: 'Hides the footer.', type: 'boolean', default: 'false' },
      {
        name: '[zHideHeader]',
        description: 'Keeps the title and description available to screen readers only (`sr-only`).',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zMaskClosable]',
        description: 'Whether clicking outside the dialog (on the mask) closes it.',
        type: 'boolean',
        default: 'true',
      },
      {
        name: '[zOkDestructive]',
        description: 'Whether the OK button should have destructive styling.',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zOkDisabled]',
        description: 'Whether the OK button should be disabled.',
        type: 'boolean',
        default: 'false',
      },
      { name: '[zOkIcon]', description: 'Sets the OK button icon.', type: 'string', default: '-' },
      {
        name: '[zOkText]',
        description: "OK button text, null to hide the button. Defaults to 'OK'.",
        type: 'string | null',
        default: "'OK'",
      },
      {
        name: '[zOnCancel]',
        description: 'Cancel button click handler.',
        type: 'EventEmitter<T> | OnClickCallback<T>',
        default: '-',
      },
      {
        name: '[zOnOk]',
        description: 'OK button click handler.',
        type: 'EventEmitter<T> | OnClickCallback<T>',
        default: '-',
      },
      {
        name: '[zTitle]',
        description: 'Dialog title text or template.',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      {
        name: '[zViewContainerRef]',
        description: 'View container reference for dynamic component loading.',
        type: 'ViewContainerRef',
        default: '-',
      },
      { name: '[zWidth]', description: "Custom width (e.g., '400px', '50%').", type: 'string', default: '-' },
    ],
  },
];
