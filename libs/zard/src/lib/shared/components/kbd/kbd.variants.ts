import { cva } from 'class-variance-authority';

export const kbdVariants = cva(
  `min-w-5 w-fit h-5 inline-flex items-center justify-center gap-1 text-xs font-medium font-mono bg-muted text-muted-foreground pointer-events-none rounded-sm px-1 select-none [&_svg:not([class*='size-'])]:size-3 [[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10`,
);

export const kbdGroupVariants = cva(`inline-flex items-center gap-1`);
