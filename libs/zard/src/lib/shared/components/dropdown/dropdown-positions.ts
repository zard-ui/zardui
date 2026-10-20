import type { ConnectedPosition } from '@angular/cdk/overlay';

/**
 * Which edge of the trigger the menu is anchored to. Mirrors Radix's `side`: `left`/`right` are physical,
 * `inline-start`/`inline-end` follow the direction of the trigger (a submenu opens on `inline-end`).
 */
export type ZardDropdownSide = 'top' | 'right' | 'bottom' | 'left' | 'inline-start' | 'inline-end';

/** How the menu is aligned along that edge. Mirrors Radix's `align`; `start`/`end` follow the direction. */
export type ZardDropdownAlign = 'start' | 'center' | 'end';

/** The side the menu flips to when the preferred one does not fit. */
const OPPOSITE_SIDE: Record<ZardDropdownSide, ZardDropdownSide> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
  'inline-start': 'inline-end',
  'inline-end': 'inline-start',
};

const isVertical = (side: ZardDropdownSide) => side === 'top' || side === 'bottom';

/** Whether the menu ends up on the physical left of the trigger. */
export function isDropdownSideLeft(side: ZardDropdownSide, rtl: boolean): boolean {
  if (side === 'left') return true;
  if (side === 'right') return false;
  return (side === 'inline-start') !== rtl;
}

/**
 * Translates a Radix-style `side`/`align` pair into a CDK connected position.
 *
 * `side` decides the axis the menu is pushed along, `align` decides where it sits on the other axis
 * — the same split Radix uses, so a shadcn snippet can be transcribed one to one.
 *
 * CDK `start`/`end` follow the overlay direction, while `offsetX` is always physical: `rtl` swaps the
 * physical sides and mirrors the offset so the menu stays on the requested side with the gap pointing away.
 */
function toConnectedPosition(
  side: ZardDropdownSide,
  align: ZardDropdownAlign,
  offset: number,
  rtl: boolean,
): ConnectedPosition {
  if (isVertical(side)) {
    return {
      originX: align,
      originY: side === 'bottom' ? 'bottom' : 'top',
      overlayX: align,
      overlayY: side === 'bottom' ? 'top' : 'bottom',
      offsetY: side === 'bottom' ? offset : -offset,
    };
  }

  const verticalAlign = { start: 'top', center: 'center', end: 'bottom' } as const;
  const onLeft = isDropdownSideLeft(side, rtl);
  // CDK `start` is the physical left in LTR and the physical right in RTL.
  const cdkStart = onLeft !== rtl;

  return {
    originX: cdkStart ? 'start' : 'end',
    originY: verticalAlign[align],
    overlayX: cdkStart ? 'end' : 'start',
    overlayY: verticalAlign[align],
    offsetX: onLeft ? -offset : offset,
  };
}

/**
 * The preferred position followed by its fallbacks: the opposite side first (a flip keeps the menu
 * attached to the trigger), then the remaining alignments on the preferred side.
 */
export function buildDropdownPositions(
  side: ZardDropdownSide,
  align: ZardDropdownAlign,
  offset: number,
  rtl = false,
): ConnectedPosition[] {
  const fallbackAligns: ZardDropdownAlign[] = (['start', 'center', 'end'] as const).filter(value => value !== align);

  return [
    toConnectedPosition(side, align, offset, rtl),
    toConnectedPosition(OPPOSITE_SIDE[side], align, offset, rtl),
    ...fallbackAligns.map(fallbackAlign => toConnectedPosition(side, fallbackAlign, offset, rtl)),
    ...fallbackAligns.map(fallbackAlign => toConnectedPosition(OPPOSITE_SIDE[side], fallbackAlign, offset, rtl)),
  ];
}
