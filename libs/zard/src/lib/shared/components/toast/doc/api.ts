import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const TOAST_API: ApiSection[] = [
  {
    selector: '[z-toaster]',
    description: 'A component that displays toast notifications. Uses ngx-sonner under the hood.',
    props: [
      {
        name: '[variant]',
        description: 'Toast variant styling',
        type: "'default' | 'destructive'",
        default: "'default'",
      },
      {
        name: '[theme]',
        description: 'Theme for the toasts',
        type: "'light' | 'dark' | 'system'",
        default: "'system'",
      },
      {
        name: '[position]',
        description: 'Position of the toast container',
        type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
        default: "'bottom-right'",
      },
      { name: '[richColors]', description: 'Enable rich colors', type: 'boolean', default: 'false' },
      { name: '[expand]', description: 'Expand toasts by default', type: 'boolean', default: 'false' },
      { name: '[duration]', description: 'Auto-dismiss duration (ms)', type: 'number', default: '4000' },
      { name: '[visibleToasts]', description: 'Maximum visible toasts', type: 'number', default: '3' },
      { name: '[closeButton]', description: 'Show close button', type: 'boolean', default: 'false' },
    ],
  },
];
