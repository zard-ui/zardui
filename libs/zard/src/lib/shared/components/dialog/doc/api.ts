import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const DIALOG_API: ApiSection[] = [
  {
    selector: 'ZardDialogService',
    description: 'Provides methods to open and close dialogs.',
    props: [
      {
        name: 'zAutofocus',
        description: 'Sets the autofocus button.',
        type: "'ok' | 'cancel' | 'auto' | null",
        default: "'auto'",
      },
      { name: 'zCancelIcon', description: 'Sets the cancel icon.', type: 'string', default: '' },
      { name: 'zCancelText', description: 'Sets the cancel text.', type: 'string', default: '' },
      { name: 'zClosable', description: 'Enables closing the dialog.', type: 'boolean', default: 'true' },
      {
        name: 'zContent',
        description: 'Sets the dialog content.',
        type: 'string | TemplateRef<T> | Type<T>',
        default: '',
      },
      { name: 'zData', description: 'Sets the data for the dialog.', type: 'U', default: '' },
      { name: 'zDescription', description: 'Sets the dialog description.', type: 'string', default: '' },
      { name: 'zHideFooter', description: 'Hides the footer.', type: 'boolean', default: 'false' },
      {
        name: 'zMaskClosable',
        description: 'Enables closing the dialog by clicking on the mask.',
        type: 'boolean',
        default: 'true',
      },
      { name: 'zOkDestructive', description: 'Marks the OK button as destructive.', type: 'boolean', default: 'false' },
      { name: 'zOkDisabled', description: 'Disables the OK button.', type: 'boolean', default: 'false' },
      { name: 'zOkIcon', description: 'Sets the OK button icon.', type: 'string', default: '' },
      { name: 'zOkText', description: 'Sets the OK button text.', type: 'string | null', default: '' },
      {
        name: 'zOnCancel',
        description: 'Callback for cancel action.',
        type: 'EventEmitter<T> | OnClickCallback<T>',
        default: 'noopFn',
      },
      {
        name: 'zOnOk',
        description: 'Callback for OK action.',
        type: 'EventEmitter<T> | OnClickCallback<T>',
        default: 'noopFn',
      },
      { name: 'zTitle', description: 'Sets the dialog title.', type: 'string | TemplateRef<T>', default: '' },
      {
        name: 'zViewContainerRef',
        description: 'View container reference for dynamic component loading.',
        type: 'ViewContainerRef',
        default: '',
      },
      { name: 'zWidth', description: 'Sets the dialog width.', type: 'string', default: '' },
    ],
  },
];
