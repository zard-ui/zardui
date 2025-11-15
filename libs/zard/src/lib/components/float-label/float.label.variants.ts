import { cva } from 'class-variance-authority';

export const floatLabelStyles = cva([
  'relative block',

  // base label
  '[&>label]:absolute',
  '[&>label]:left-4',
  '[&>label]:top-1/2',
  '[&>label]:-translate-y-1/2',
  '[&>label]:pointer-events-none',
  '[&>label]:transition-all',
  '[&>label]:duration-200',
  '[&>label]:ease-in-out',
  '[&>label]:text-muted-foreground',
  '[&>label]:text-sm',
  '[&>label]:leading-none',
  '[&>label]:z-10',

  // FOCUS — when input/textarea/button inside receives focus
  '[&:has(input:focus)>label]:top-2',
  '[&:has(textarea:focus)>label]:top-2',
  '[&:has(button:focus)>label]:top-2',

  '[&:has(input:focus)>label]:text-xs',
  '[&:has(textarea:focus)>label]:text-xs',
  '[&:has(button:focus)>label]:text-xs',

  '[&:has(input:focus)>label]:text-primary',
  '[&:has(textarea:focus)>label]:text-primary',
  '[&:has(button:focus)>label]:text-primary',

  // VALUE — when input has a value
  '[&:has(input.input-has-value)>label]:top-2',
  '[&:has(textarea.input-has-value)>label]:top-2',
  '[&:has(button.input-has-value)>label]:top-2',

  '[&:has(input.input-has-value)>label]:text-xs',
  '[&:has(textarea.input-has-value)>label]:text-xs',
  '[&:has(button.input-has-value)>label]:text-xs',

  // OPACITY 0 for placeholder text inside z-select
  '[&>z-select_span#select-placeholder]:opacity-0',
  '[&>[z-select]_span#select-placeholder]:opacity-0',
  '[&>z-select_[id="select-placeholder"]]:opacity-0',
  '[&>[z-select]_[id="select-placeholder"]]:opacity-0',

  // STATES
  // error
  '[&:has(input[data-status=error]:not(:disabled))>label]:text-destructive',
  '[&:has(textarea[data-status=error]:not(:disabled))>label]:text-destructive',
  '[&:has(button[data-status=error]:not(:disabled))>label]:text-destructive',
  '[&:has(z-select[data-status=error]:not(:disabled))>label]:text-destructive',

  // warning
  '[&:has(input[data-status=warning]:not(:disabled))>label]:text-yellow-500',
  '[&:has(textarea[data-status=warning]:not(:disabled))>label]:text-yellow-500',
  '[&:has(button[data-status=warning]:not(:disabled))>label]:text-yellow-500',
  '[&:has(z-select[data-status=warning]:not(:disabled))>label]:text-yellow-500',

  // success
  '[&:has(input[data-status=success]:not(:disabled))>label]:text-green-500',
  '[&:has(textarea[data-status=success]:not(:disabled))>label]:text-green-500',
  '[&:has(button[data-status=success]:not(:disabled))>label]:text-green-500',
  '[&:has(z-select[data-status=success]:not(:disabled))>label]:text-green-500',
]);
