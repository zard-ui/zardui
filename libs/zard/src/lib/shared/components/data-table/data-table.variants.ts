import { cva } from 'class-variance-authority';

export const dataTableVariants = cva('block w-full overflow-hidden rounded-md border');

export const dataTableBodyVariants = cva('transition-opacity', {
  variants: {
    zLoading: {
      true: 'pointer-events-none opacity-60',
      false: '',
    },
  },
  defaultVariants: {
    zLoading: false,
  },
});

/**
 * Pinned columns stick while the rest scrolls, so they need a solid background. The row's hover and
 * selected tints are mixed into it, because a translucent tint would let the scrolled cells show through.
 */
const pinnedVariants = {
  zPinned: {
    none: '',
    start:
      'sticky z-10 bg-background group-hover/row:bg-[color-mix(in_oklab,var(--color-muted)_50%,var(--color-background))] group-data-[state=selected]/row:bg-muted',
    end: 'sticky z-10 bg-background group-hover/row:bg-[color-mix(in_oklab,var(--color-muted)_50%,var(--color-background))] group-data-[state=selected]/row:bg-muted',
  },
  zEdge: {
    true: '',
    false: '',
  },
};

const pinnedEdgeVariants = [
  { zPinned: 'start' as const, zEdge: true, class: 'border-e' },
  { zPinned: 'end' as const, zEdge: true, class: 'border-s' },
];

export const dataTableHeadVariants = cva('relative', {
  variants: pinnedVariants,
  compoundVariants: pinnedEdgeVariants,
  defaultVariants: { zPinned: 'none', zEdge: false },
});

export const dataTableCellVariants = cva('', {
  variants: pinnedVariants,
  compoundVariants: pinnedEdgeVariants,
  defaultVariants: { zPinned: 'none', zEdge: false },
});

export const dataTableResizeHandleVariants = cva(
  'absolute inset-y-0 end-0 z-1 w-1 cursor-col-resize touch-none bg-border opacity-0 select-none hover:opacity-100 data-resizing:bg-primary data-resizing:opacity-100',
);

export const dataTableEmptyVariants = cva('h-24 text-center');

export const dataTableColumnHeaderVariants = cva('flex items-center gap-2');

/** A size container: the controls that fit follow the width the table has, not the viewport's. */
export const dataTablePaginationVariants = cva('@container block');

export const dataTableViewOptionsVariants = cva('ms-auto hidden h-8 lg:flex');
