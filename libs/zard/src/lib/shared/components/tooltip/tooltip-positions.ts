import type { ConnectedPosition } from '@angular/cdk/overlay';

import type { ZardTooltipPositionVariants } from './tooltip.variants';

/** Physical sides plus the logical ones, which follow the direction of the trigger. */
export type ZardTooltipSide = ZardTooltipPositionVariants | 'inline-start' | 'inline-end';

/** `inline-start` is the physical left in LTR and the physical right in RTL; physical sides pass through. */
export function resolveTooltipSide(side: ZardTooltipSide, rtl: boolean): ZardTooltipPositionVariants {
  if (side === 'inline-start') {
    return rtl ? 'right' : 'left';
  }
  if (side === 'inline-end') {
    return rtl ? 'left' : 'right';
  }
  return side;
}

export const TOOLTIP_POSITIONS_MAP: { [key: string]: ConnectedPosition } = {
  top: {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    offsetY: -4,
  },
  bottom: {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetY: 4,
  },
  left: {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -4,
  },
  right: {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: 4,
  },
};

/**
 * Builds the connected position for a tooltip side without touching the shared map.
 *
 * `left` and `right` are physical sides. CDK resolves `start`/`end` through the overlay direction, so in RTL the
 * physical left is `end`; the signed offset is physical, so it keeps pointing away from the trigger either way.
 */
export function getTooltipPosition(
  requested: ZardTooltipSide | string,
  offset: number,
  rtl: boolean,
): ConnectedPosition {
  const side = resolveTooltipSide(requested as ZardTooltipSide, rtl);
  const base = TOOLTIP_POSITIONS_MAP[side] ?? TOOLTIP_POSITIONS_MAP['top'];
  const position: ConnectedPosition = { ...base };

  switch (side) {
    case 'top':
      position.offsetY = -offset;
      break;
    case 'bottom':
      position.offsetY = offset;
      break;
    case 'left':
    case 'right': {
      const onLeft = side === 'left';
      // `start` is the physical left in LTR and the physical right in RTL.
      const cdkStart = onLeft !== rtl;
      position.originX = cdkStart ? 'start' : 'end';
      position.overlayX = cdkStart ? 'end' : 'start';
      position.offsetX = onLeft ? -offset : offset;
      break;
    }
  }

  return position;
}
