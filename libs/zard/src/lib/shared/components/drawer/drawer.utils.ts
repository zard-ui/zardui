import type { ZardDrawerPlacement } from './drawer.variants';

/** Pointer speed (px/ms) past which a flick dismisses the drawer regardless of distance. */
export const DRAWER_VELOCITY_THRESHOLD = 0.4;

/** Fraction of the panel that has to be dragged away before a slow drag dismisses it. */
export const DRAWER_CLOSE_THRESHOLD = 0.35;

/** Exit/snap animation duration (ms). Mirrors the CSS transition on the panel. */
export const DRAWER_DURATION = 450;

export type ZardDrawerSnapPoint = number | string;

export function isVerticalPlacement(placement: ZardDrawerPlacement): boolean {
  return placement === 'top' || placement === 'bottom';
}

/**
 * Sign of the axis the drawer is dragged along, expressed as the direction that
 * *closes* it: a bottom drawer closes downwards (+1 on Y), a left one leftwards (-1 on X).
 */
export function closingDirection(placement: ZardDrawerPlacement): 1 | -1 {
  return placement === 'bottom' || placement === 'right' ? 1 : -1;
}

/**
 * Resolves a snap point to the number of pixels of the panel that stay visible.
 *
 * `0–1` is read as a fraction of the viewport, anything above as pixels, and a
 * string keeps its CSS unit (`px`, `rem`, `em`, `%`, `vh`, `vw`).
 */
export function resolveSnapPoint(point: ZardDrawerSnapPoint, viewportSize: number, rootFontSize = 16): number {
  if (typeof point === 'number') {
    return point <= 1 ? point * viewportSize : point;
  }

  const value = Number.parseFloat(point);
  if (Number.isNaN(value)) {
    return 0;
  }

  if (point.endsWith('rem') || point.endsWith('em')) {
    return value * rootFontSize;
  }
  if (point.endsWith('%') || point.endsWith('vh') || point.endsWith('vw')) {
    return (value / 100) * viewportSize;
  }

  return value;
}

/**
 * Resolves every snap point, keeping the author's order so an index still maps back
 * to the value handed to `[(zSnapPoint)]`. Points are expected in ascending order.
 */
export function resolveSnapPoints(
  points: readonly ZardDrawerSnapPoint[],
  viewportSize: number,
  rootFontSize = 16,
): number[] {
  return points.map(point => resolveSnapPoint(point, viewportSize, rootFontSize));
}

/** Index of the snap point closest to `size`. Returns -1 for an empty list. */
export function nearestSnapIndex(size: number, resolvedPoints: readonly number[]): number {
  if (!resolvedPoints.length) {
    return -1;
  }

  let best = 0;
  for (let i = 1; i < resolvedPoints.length; i++) {
    if (Math.abs(resolvedPoints[i] - size) < Math.abs(resolvedPoints[best] - size)) {
      best = i;
    }
  }
  return best;
}

/**
 * iOS-style rubber band: past the fully open position the panel keeps moving but
 * with progressively more resistance, so it never detaches from the edge.
 */
export function rubberband(distance: number, dimension: number): number {
  if (dimension <= 0) {
    return 0;
  }
  return (1 - 1 / ((distance * 0.55) / dimension + 1)) * dimension;
}

/**
 * True when the gesture started inside something that scrolls in the drag axis and
 * is not already at the edge — dragging the drawer would steal that scroll.
 */
export function isScrollableAway(
  target: EventTarget | null,
  panel: HTMLElement,
  placement: ZardDrawerPlacement,
  delta: number,
): boolean {
  const vertical = isVerticalPlacement(placement);
  let node = target instanceof HTMLElement ? target : null;

  while (node && node !== panel) {
    const style = getComputedStyle(node);
    const overflow = vertical ? style.overflowY : style.overflowX;

    if (overflow === 'auto' || overflow === 'scroll') {
      const position = vertical ? node.scrollTop : node.scrollLeft;
      const max = vertical ? node.scrollHeight - node.clientHeight : node.scrollWidth - node.clientWidth;

      if (max > 0 && ((delta > 0 && position > 0) || (delta < 0 && position < max))) {
        return true;
      }
    }

    node = node.parentElement;
  }

  return false;
}

/**
 * Controls that own the pointer themselves — dragging one must not swipe the drawer.
 * Buttons are deliberately absent: a press on one still starts a swipe, and a tap that
 * never crosses the threshold still fires its click.
 */
export function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  return !!target.closest(
    'input, textarea, select, a[href], [role="slider"], [contenteditable=""], [contenteditable="true"], [data-no-drag]',
  );
}
