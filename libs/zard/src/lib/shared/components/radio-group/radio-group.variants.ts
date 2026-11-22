import { cva } from 'class-variance-authority';

export const radioGroupVariants = cva('cn-radio-group');

export const radioVariants = cva(
  'cn-radio-group-radio group/radio-group-item peer outline-none disabled:cursor-not-allowed disabled:opacity-50',
);
