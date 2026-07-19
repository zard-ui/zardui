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
        description: 'Position of the sheet on screen',
        type: "'left' | 'right' | 'top' | 'bottom'",
        default: "'left'",
      },
      { name: 'zWidth', description: "Custom width (e.g., '400px', '50%')", type: 'string', default: '-' },
      { name: 'zHeight', description: "Custom height (e.g., '80vh', '500px')", type: 'string', default: '-' },
      { name: 'zOkText', description: 'OK button text, null to hide button', type: 'string | null', default: "'OK'" },
      {
        name: 'zCancelText',
        description: 'Cancel button text, null to hide button',
        type: 'string | null',
        default: "'Cancel'",
      },
      { name: 'zOkIcon', description: 'OK button icon class name', type: 'string', default: '-' },
      { name: 'zCancelIcon', description: 'Cancel button icon class name', type: 'string', default: '-' },
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
      { name: 'zClosable', description: 'Whether sheet can be closed', type: 'boolean', default: 'true' },
      { name: 'zCustomClasses', description: 'Additional CSS classes to apply', type: 'string', default: '-' },
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
