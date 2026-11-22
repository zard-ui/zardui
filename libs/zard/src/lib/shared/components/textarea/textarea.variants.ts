import { cva } from 'class-variance-authority';

export const textareaVariants = cva('cn-textarea outline-none disabled:cursor-not-allowed disabled:opacity-50');

export const inputGroupTextAreaVariants = cva('cn-textarea-input-group-text-area');
