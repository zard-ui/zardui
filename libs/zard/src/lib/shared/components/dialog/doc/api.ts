import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const DIALOG_API: ApiSection[] = [
  {
    selector: 'ZardDialogService',
    description: 'Provides methods to open and close dialogs.',
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
        type: 'string | TemplateRef<T>',
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
