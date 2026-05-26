import { cva } from 'class-variance-authority';

export const paginationContentVariants = cva('flex items-center gap-0.5');

export const paginationPreviousVariants = cva('pl-1.5!');

export const paginationNextVariants = cva('pr-1.5!');

export const paginationEllipsisVariants = cva(
  'flex size-8 items-center justify-center [&_svg:not([class*="size-"])]:size-4',
);

export const paginationVariants = cva('mx-auto flex w-full justify-center');
