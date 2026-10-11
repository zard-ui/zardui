import { cva } from 'class-variance-authority';

export const inputVariants = cva(
  'cn-input outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
);

export const inputGroupInputVariants = cva('cn-input-group-input');
