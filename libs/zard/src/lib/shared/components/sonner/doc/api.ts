import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SONNER_API: ApiSection[] = [
  {
    selector: 'z-sonner',
    description: 'Container that renders toast notifications. Place once at the root of your app.',
    props: [
      {
        name: '[style]',
        description: 'Inline styles applied to every toast',
        type: 'Record<string, string>',
        default: 'undefined',
      },
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
        name: '[topLayer]',
        description:
          'Renders the toaster in the native top layer so toasts stay above dialogs, drawers and sheets. Disable it only if the app opts out of the CDK top layer.',
        type: 'boolean',
        default: 'true',
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
    description:
      'Inject this service to dispatch toasts from any component or service. Every method returns the id of the dispatched toast (`dismiss()` can target it later). `message` accepts a plain string or an Angular `Type<unknown>` for custom content.',
    props: [
      {
        name: 'show(message, options?)',
        description: 'Dispatches a default toast.',
        type: '(message: string | Type<unknown>, options?: ExternalToast) => string | number',
        default: '',
      },
      {
        name: 'success(message, options?)',
        description: 'Dispatches a success-styled toast (green).',
        type: '(message: string | Type<unknown>, options?: ExternalToast) => string | number',
        default: '',
      },
      {
        name: 'error(message, options?)',
        description: 'Dispatches an error-styled toast (red).',
        type: '(message: string | Type<unknown>, options?: ExternalToast) => string | number',
        default: '',
      },
      {
        name: 'warning(message, options?)',
        description: 'Dispatches a warning-styled toast (yellow).',
        type: '(message: string | Type<unknown>, options?: ExternalToast) => string | number',
        default: '',
      },
      {
        name: 'info(message, options?)',
        description: 'Dispatches an info-styled toast (blue).',
        type: '(message: string | Type<unknown>, options?: ExternalToast) => string | number',
        default: '',
      },
      {
        name: 'loading(message, options?)',
        description: 'Dispatches a loading-styled toast with a spinner.',
        type: '(message: string | Type<unknown>, options?: ExternalToast) => string | number',
        default: '',
      },
      {
        name: 'message(message, options?)',
        description: 'Dispatches a neutral, unstyled toast.',
        type: '(message: string | Type<unknown>, options?: ExternalToast) => string | number',
        default: '',
      },
      {
        name: 'promise(promise, options?)',
        description:
          'Binds a toast to the lifecycle of a promise: shows `options.loading`, then swaps to `options.success` or `options.error` once the promise settles.',
        type: '<T>(promise: Promise<T> | (() => Promise<T>), options?: PromiseData<T>) => string | number | undefined',
        default: '',
      },
      {
        name: 'custom(component, options?)',
        description: 'Dispatches a toast that renders the given Angular component in place of the message.',
        type: '<T>(component: Type<T>, options?: ExternalToast) => string | number',
        default: '',
      },
      {
        name: 'dismiss(id?)',
        description: 'Dismisses a toast by id, or all toasts when no id is provided.',
        type: '(id?: string | number) => void',
        default: '',
      },
      {
        name: 'options.id',
        description: 'Custom id for the toast, so it can be targeted later (e.g. by `dismiss(id)`).',
        type: 'string | number',
        default: 'auto-generated',
      },
      {
        name: 'options.description',
        description: 'Supporting text rendered underneath the message.',
        type: 'string | Type<unknown>',
        default: '-',
      },
      {
        name: 'options.duration',
        description: 'Time in milliseconds before the toast auto-dismisses.',
        type: 'number',
        default: '4000',
      },
      {
        name: 'options.position',
        description: "Overrides the toaster's `[position]` for this one toast.",
        type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
        default: "toaster's [position]",
      },
      {
        name: 'options.action',
        description: 'Renders a primary button inside the toast; clicking it calls `onClick` and closes the toast.',
        type: '{ label: string; onClick: (event: MouseEvent) => void }',
        default: '-',
      },
      {
        name: 'options.cancel',
        description: 'Renders a secondary button inside the toast; clicking it calls `onClick` and closes the toast.',
        type: '{ label: string; onClick?: () => void }',
        default: '-',
      },
      {
        name: 'options.closeButton',
        description: "Shows a close button on this toast, overriding the toaster's `[closeButton]`.",
        type: 'boolean',
        default: 'false',
      },
      {
        name: 'options.dismissible',
        description: 'Whether the toast can be dismissed by swiping.',
        type: 'boolean',
        default: 'true',
      },
      {
        name: 'options.important',
        description: 'Announces via `aria-live="assertive"` instead of `"polite"` when true.',
        type: 'boolean',
        default: 'false',
      },
      {
        name: 'options.icon',
        description: 'Icon rendered in front of the message, replacing the type icon.',
        type: 'Type<unknown>',
        default: '-',
      },
      {
        name: 'options.invert',
        description: 'Renders a dark toast in light mode and vice versa.',
        type: 'boolean',
        default: 'false',
      },
      {
        name: 'options.class / options.classes',
        description: 'Custom class for the toast, or a per-slot class map (title, description, actionButton, ...).',
        type: 'string / ToastClassnames',
        default: '-',
      },
      {
        name: 'options.style',
        description: 'Inline styles applied to this toast only.',
        type: 'Record<string, unknown>',
        default: '-',
      },
      {
        name: 'options.onDismiss',
        description: 'Called when the toast is dismissed by the user (close button or swipe).',
        type: '(toast: ToastT) => void',
        default: '-',
      },
      {
        name: 'options.onAutoClose',
        description: 'Called when the toast disappears automatically after `options.duration`.',
        type: '(toast: ToastT) => void',
        default: '-',
      },
    ],
  },
];
