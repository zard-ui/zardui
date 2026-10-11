import { cva } from 'class-variance-authority';

export const checkboxVariants = cva('cn-checkbox peer appearance-none outline-none disabled:opacity-50');

export const checkboxLabelVariants = cva('cn-checkbox-label select-none');
