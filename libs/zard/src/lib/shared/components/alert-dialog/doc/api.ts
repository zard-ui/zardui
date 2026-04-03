import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const ALERT_DIALOG_API: ApiSection[] = [
  {
    selector: 'ZardAlertDialogService',
    description: 'Configuration options for creating alert dialogs.',
    props: [
      { name: 'zTitle', description: 'Dialog title text or template', type: 'string | TemplateRef<T>', default: '-' },
      { name: 'zDescription', description: 'Dialog description/body text', type: 'string', default: '-' },
      {
        name: 'zContent',
        description: 'Custom content component, template, or HTML',
        type: 'string | TemplateRef<T> | Type<T>',
        default: '-',
      },
      { name: 'zData', description: 'Data to pass to custom content components', type: 'object', default: '-' },
      {
        name: 'zOkText',
        description: 'OK button text, null to hide button',
        type: 'string | null',
        default: "'Continue'",
      },
      {
        name: 'zCancelText',
        description: 'Cancel button text, null to hide button',
        type: 'string | null',
        default: "'Cancel'",
      },
      {
        name: 'zOkDestructive',
        description: 'Whether OK button should have destructive styling',
        type: 'boolean',
        default: 'false',
      },
      { name: 'zOkDisabled', description: 'Whether OK button should be disabled', type: 'boolean', default: 'false' },
      {
        name: 'zMaskClosable',
        description: 'Whether clicking outside closes the dialog',
        type: 'boolean',
        default: 'false',
      },
      { name: 'zClosable', description: 'Whether dialog can be closed', type: 'boolean', default: 'true' },
      { name: 'zWidth', description: "Custom width (e.g., '400px', '50%')", type: 'string', default: '-' },
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
      {
        name: 'zViewContainerRef',
        description: 'View container for rendering custom content',
        type: 'ViewContainerRef',
        default: '-',
      },
    ],
  },
];
