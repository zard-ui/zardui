import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const LAYOUT_API: ApiSection[] = [
  {
    selector: 'z-layout',
    description: 'Root layout container with flex direction support.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zDirection]',
        description: 'Flex direction (auto-detects based on children)',
        type: "'horizontal' | 'vertical' | 'auto'",
        default: "'auto'",
      },
    ],
  },
  {
    selector: 'z-header',
    description: 'Header area of the layout.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zHeight]', description: 'Header height in pixels', type: 'number', default: '64' },
    ],
  },
  {
    selector: 'z-footer',
    description: 'Footer area of the layout.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zHeight]', description: 'Footer height in pixels', type: 'number', default: '64' },
    ],
  },
  {
    selector: 'z-content',
    description: 'Main content area of the layout.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-sidebar',
    description: 'Sidebar area with optional collapse functionality.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zWidth]',
        description: 'Sidebar width when expanded (px or string)',
        type: 'string | number',
        default: '200',
      },
      { name: '[zCollapsedWidth]', description: 'Sidebar width when collapsed (px)', type: 'number', default: '64' },
      { name: '[zCollapsible]', description: 'Enable collapse functionality', type: 'boolean', default: 'false' },
      {
        name: '[zCollapsed]',
        description: 'Collapsed state (supports two-way binding)',
        type: 'boolean',
        default: 'false',
      },
      { name: '[zReverseArrow]', description: 'Reverse trigger arrow direction', type: 'boolean', default: 'false' },
      { name: '[zTrigger]', description: 'Custom trigger template', type: 'TemplateRef<void> | null', default: 'null' },
      {
        name: '(zCollapsedChange)',
        description: 'Emitted when collapsed state changes',
        type: 'EventEmitter<boolean>',
        default: '',
      },
    ],
  },
  {
    selector: 'z-sidebar-group',
    description: 'Groups items within the sidebar.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-sidebar-group-label',
    description: 'Label for a sidebar group.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
];
