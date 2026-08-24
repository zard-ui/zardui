import type { ConnectedPosition } from '@angular/cdk/overlay';

/** Which edge of the trigger the menu is anchored to. Mirrors Radix's `side`. */
export type ZardDropdownSide = 'top' | 'right' | 'bottom' | 'left';

/** How the menu is aligned along that edge. Mirrors Radix's `align`. */
export type ZardDropdownAlign = 'start' | 'center' | 'end';

/** The side the menu flips to when the preferred one does not fit. */
const OPPOSITE_SIDE: Record<ZardDropdownSide, ZardDropdownSide> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

const isVertical = (side: ZardDropdownSide) => side === 'top' || side === 'bottom';

/**
 * Translates a Radix-style `side`/`align` pair into a CDK connected position.
 *
 * `side` decides the axis the menu is pushed along, `align` decides where it sits on the other axis
 * — the same split Radix uses, so a shadcn snippet can be transcribed one to one.
 */
function toConnectedPosition(side: ZardDropdownSide, align: ZardDropdownAlign, offset: number): ConnectedPosition {
  const alignPair = {
    start: 'start',
    center: 'center',
    end: 'end',
  } as const;

  if (isVertical(side)) {
    return {
      originX: alignPair[align],
      originY: side === 'bottom' ? 'bottom' : 'top',
      overlayX: alignPair[align],
      overlayY: side === 'bottom' ? 'top' : 'bottom',
      offsetY: side === 'bottom' ? offset : -offset,
    };
  }

  const verticalAlign = { start: 'top', center: 'center', end: 'bottom' } as const;

  return {
    originX: side === 'right' ? 'end' : 'start',
    originY: verticalAlign[align],
    overlayX: side === 'right' ? 'start' : 'end',
    overlayY: verticalAlign[align],
    offsetX: side === 'right' ? offset : -offset,
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
): ConnectedPosition[] {
  const fallbackAligns: ZardDropdownAlign[] = (['start', 'center', 'end'] as const).filter(value => value !== align);

  return [
    toConnectedPosition(side, align, offset),
    toConnectedPosition(OPPOSITE_SIDE[side], align, offset),
    ...fallbackAligns.map(fallbackAlign => toConnectedPosition(side, fallbackAlign, offset)),
    ...fallbackAligns.map(fallbackAlign => toConnectedPosition(OPPOSITE_SIDE[side], fallbackAlign, offset)),
  ];
}
