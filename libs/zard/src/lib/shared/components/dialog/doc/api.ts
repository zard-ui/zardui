import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const DIALOG_API: ApiSection[] = [
  {
    selector: 'z-dialog',
    description: 'Declarative dialog root that holds the open state.',
    props: [
      { name: '[zVisible]', description: 'Two-way bindable open state', type: 'boolean', default: 'false' },
      { name: '[zClosable]', description: 'Shows the close (X) button', type: 'boolean', default: 'true' },
      { name: '[zMaskClosable]', description: 'Clicking the mask closes it', type: 'boolean', default: 'true' },
      { name: '[zWidth]', description: 'Custom width', type: 'string', default: '-' },
      { name: '[zDuration]', description: 'Transition duration in ms', type: 'number', default: '100' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' },
      {
        name: '(zAfterOpen)',
        description: 'Emits once the dialog is attached',
        type: 'EventEmitter<void>',
        default: '-',
      },
      {
        name: '(zAfterClose)',
        description: 'Emits after the exit transition',
        type: 'EventEmitter<void>',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-dialog-header',
    description: 'Top slot for the title and description.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-dialog-footer',
    description: 'Bottom slot, usually for actions.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-dialog-title',
    description: 'Dialog title, wired to `aria-labelledby`.',
    props: [
      { name: '[zTitle]', description: 'Title text or template', type: 'string | TemplateRef<void>', default: '-' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' },
    ],
  },
  {
    selector: 'z-dialog-description',
    description: 'Supporting text, wired to `aria-describedby`.',
    props: [
      {
        name: '[zDescription]',
        description: 'Description text or template',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' },
    ],
  },
  {
    selector: '[z-dialog-close]',
    description: 'Closes the enclosing dialog.',
    props: [],
  },
  {
    selector: 'ZardDialogService',
    description: 'Opens dialogs from code via `create()`, which returns a `ZardDialogRef`.',
    props: [
      { name: '[zCancelIcon]', description: 'Cancel button icon', type: 'string', default: '-' },
      {
        name: '[zCancelText]',
        description: 'Cancel button text, `null` hides it',
        type: 'string | null',
        default: "'Cancel'",
      },
      { name: '[zClosable]', description: 'Shows the close (X) button', type: 'boolean', default: 'true' },
      {
        name: '[zContent]',
        description: 'Content component, template or HTML',
        type: 'string | TemplateRef<T> | Type<T>',
        default: '-',
      },
      { name: '[zCustomClasses]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' },
      { name: '[zData]', description: 'Data for the content component', type: 'U', default: '-' },
      { name: '[zDescription]', description: 'Description text', type: 'string', default: '-' },
      { name: '[zDuration]', description: 'Close animation duration in ms', type: 'number', default: '100' },
      { name: '[zHideFooter]', description: 'Hides the footer', type: 'boolean', default: 'false' },
      {
        name: '[zHideHeader]',
        description: 'Visually hides the title and description',
        type: 'boolean',
        default: 'false',
      },
      { name: '[zMaskClosable]', description: 'Clicking the mask closes it', type: 'boolean', default: 'true' },
      { name: '[zOkDestructive]', description: 'Destructive OK button', type: 'boolean', default: 'false' },
      { name: '[zOkDisabled]', description: 'Disables the OK button', type: 'boolean', default: 'false' },
      { name: '[zOkIcon]', description: 'OK button icon', type: 'string', default: '-' },
      { name: '[zOkText]', description: 'OK button text, `null` hides it', type: 'string | null', default: "'OK'" },
      {
        name: '[zOnCancel]',
        description: 'Cancel click handler',
        type: 'EventEmitter<T> | OnClickCallback<T>',
        default: '-',
      },
      { name: '[zOnOk]', description: 'OK click handler', type: 'EventEmitter<T> | OnClickCallback<T>', default: '-' },
      { name: '[zTitle]', description: 'Title text or template', type: 'string | TemplateRef<void>', default: '-' },
      {
        name: '[zViewContainerRef]',
        description: 'View container for the content',
        type: 'ViewContainerRef',
        default: '-',
      },
      { name: '[zWidth]', description: 'Custom width', type: 'string', default: '-' },
    ],
  },
];
