import { cva } from 'class-variance-authority';

export const kbdVariants = cva(
  `min-w-5 w-fit h-5 inline-flex items-center justify-center gap-1 text-xs font-medium font-mono bg-muted text-muted-foreground pointer-events-none rounded-sm px-1 select-none [&_svg:not([class*='size-'])]:size-3 in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10`,
);

export const kbdGroupVariants = cva(`inline-flex items-center gap-1`);
