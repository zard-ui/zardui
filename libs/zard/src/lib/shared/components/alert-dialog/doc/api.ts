import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const ALERT_DIALOG_API: ApiSection[] = [
  {
    selector: 'z-alert-dialog',
    description: 'Declarative alert dialog root that holds the open state.',
    props: [
      { name: '[zVisible]', description: 'Two-way bindable open state', type: 'boolean', default: 'false' },
      {
        name: '[zSize]',
        description: '`sm` keeps a compact, centered layout',
        type: "'default' | 'sm'",
        default: "'default'",
      },
      { name: '[zWidth]', description: 'Custom width', type: 'string', default: '-' },
      { name: '[zMaskClosable]', description: 'Clicking outside closes it', type: 'boolean', default: 'false' },
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
    selector: 'z-alert-dialog-header',
    description: 'Top slot for the media, title and description.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-alert-dialog-media',
    description: 'Media slot above the title, usually an icon.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-alert-dialog-title',
    description: 'Dialog title, wired to `aria-labelledby`.',
    props: [
      { name: '[zTitle]', description: 'Title text or template', type: 'string | TemplateRef<void>', default: '-' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' },
    ],
  },
  {
    selector: 'z-alert-dialog-description',
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
    selector: 'z-alert-dialog-footer',
    description: 'Slot for the action buttons.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' }],
  },
  {
    selector: '[z-alert-dialog-close]',
    description: 'Closes the enclosing alert dialog.',
    props: [],
  },
  {
    selector: 'ZardAlertDialogService',
    description: 'Opens alert dialogs from code and returns a `ZardAlertDialogRef`.',
    props: [
      { name: '[zTitle]', description: 'Title text or template', type: 'string | TemplateRef<void>', default: '-' },
      { name: '[zDescription]', description: 'Description text', type: 'string', default: '-' },
      { name: '[zMedia]', description: 'Media template above the title', type: 'TemplateRef<void>', default: '-' },
      { name: '[zMediaClass]', description: 'Custom CSS classes for the media slot', type: 'ClassValue', default: '-' },
      { name: '[zData]', description: 'Data passed to `zOnOk` and `zOnCancel`', type: 'T', default: '-' },
      {
        name: '[zOkText]',
        description: 'OK button text, `null` hides it',
        type: 'string | null',
        default: "'Continue'",
      },
      {
        name: '[zCancelText]',
        description: 'Cancel button text, `null` hides it',
        type: 'string | null',
        default: "'Cancel'",
      },
      { name: '[zOkDestructive]', description: 'Destructive OK button', type: 'boolean', default: 'false' },
      { name: '[zOkDisabled]', description: 'Disables the OK button', type: 'boolean', default: 'false' },
      { name: '[zMaskClosable]', description: 'Clicking outside closes it', type: 'boolean', default: 'false' },
      { name: '[zClosable]', description: 'Dialog can be closed', type: 'boolean', default: 'true' },
      { name: '[zSize]', description: '`sm` keeps a compact width', type: "'default' | 'sm'", default: "'default'" },
      { name: '[zWidth]', description: 'Custom width', type: 'string', default: '-' },
      { name: '[zCustomClasses]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' },
      { name: '[zDuration]', description: 'Close animation duration in ms', type: 'number', default: '100' },
      {
        name: '[zOnOk]',
        description: 'OK click handler; return `false` to stay open',
        type: 'EventEmitter<T> | OnClickCallback<T>',
        default: '-',
      },
      {
        name: '[zOnCancel]',
        description: 'Cancel click handler; return `false` to stay open',
        type: 'EventEmitter<T> | OnClickCallback<T>',
        default: '-',
      },
      {
        name: '[zViewContainerRef]',
        description: 'View container for the content',
        type: 'ViewContainerRef',
        default: '-',
      },
    ],
  },
];
