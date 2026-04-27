import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SONNER_API: ApiSection[] = [
  {
    selector: 'z-sonner',
    description: 'Container that renders toast notifications. Place once at the root of your app.',
    props: [
      {
        name: '[theme]',
        description: 'Theme used for the toasts.',
        type: "'light' | 'dark' | 'system'",
        default: "'system'",
      },
      {
        name: '[position]',
        description: 'Position of the toast container on the viewport.',
        type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
        default: "'top-center'",
      },
      {
        name: '[richColors]',
        description: 'Enables tinted backgrounds for success / error / warning / info toasts.',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[expand]',
        description: 'Expands toasts by default instead of stacking them.',
        type: 'boolean',
        default: 'false',
      },
      { name: '[duration]', description: 'Default auto-dismiss duration (ms).', type: 'number', default: '4000' },
      {
        name: '[visibleToasts]',
        description: 'Maximum number of toasts visible at the same time.',
        type: 'number',
        default: '3',
      },
      { name: '[closeButton]', description: 'Shows a close button on each toast.', type: 'boolean', default: 'false' },
      {
        name: '[toastOptions]',
        description: 'Default options applied to every toast (classes, duration, descriptions, etc).',
        type: "ToasterProps['toastOptions']",
        default: '{}',
      },
      {
        name: '[dir]',
        description: 'Text direction for toasts.',
        type: "'ltr' | 'rtl' | 'auto'",
        default: "'auto'",
      },
      {
        name: '[class]',
        description: 'Additional Tailwind / utility classes merged into the host.',
        type: 'ClassValue',
        default: "''",
      },
    ],
  },
  {
    selector: 'ZardSonnerService',
    description: 'Inject this service to dispatch toasts from any component or service.',
    props: [
      {
        name: 'show(message, options?)',
        description: 'Dispatches a default toast and returns its id.',
        type: '(message: string | number, options?: ExternalToast) => string | number',
        default: '',
      },
      {
        name: 'success(message, options?)',
        description: 'Dispatches a success-styled toast (green).',
        type: '(message: string | number, options?: ExternalToast) => string | number',
        default: '',
      },
      {
        name: 'error(message, options?)',
        description: 'Dispatches an error-styled toast (red).',
        type: '(message: string | number, options?: ExternalToast) => string | number',
        default: '',
      },
      {
        name: 'warning(message, options?)',
        description: 'Dispatches a warning-styled toast (yellow).',
        type: '(message: string | number, options?: ExternalToast) => string | number',
        default: '',
      },
      {
        name: 'info(message, options?)',
        description: 'Dispatches an info-styled toast (blue).',
        type: '(message: string | number, options?: ExternalToast) => string | number',
        default: '',
      },
      {
        name: 'loading(message, options?)',
        description: 'Dispatches a loading-styled toast with a spinner.',
        type: '(message: string | number, options?: ExternalToast) => string | number',
        default: '',
      },
      {
        name: 'message(message, options?)',
        description: 'Dispatches a neutral message-styled toast.',
        type: '(message: string | number, options?: ExternalToast) => string | number',
        default: '',
      },
      {
        name: 'promise(promise, options)',
        description: 'Binds a toast to the lifecycle of a promise (loading → success/error).',
        type: '<T>(promise: PromiseT<T>, options: PromiseData<T>) => string | number',
        default: '',
      },
      {
        name: 'dismiss(id?)',
        description: 'Dismisses a toast by id, or all toasts when no id is provided.',
        type: '(id?: string | number) => void',
        default: '',
      },
    ],
  },
];
