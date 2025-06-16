import { cva } from 'class-variance-authority';

export const tableVariants = cva('w-full caption-bottom text-sm overflow-auto');

export const theadVariants = cva('[&_tr]:border-b');

export const tbodyVariants = cva('[&_tr:last-child]:border-0');

export const trVariants = cva('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted');

export const thVariants = cva('h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]');

export const tdVariants = cva('p-4 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]');
