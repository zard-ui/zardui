/**
 * cursor — generates cursor positioning and visibility sequences.
 * Pure functions returning bytes; `terminal` is what writes them.
 */

import { csi } from '../ansi/index.js';

/** Cursor sequence factory. Coordinates are 0-based in the API, 1-based in CSI. */
export interface Cursor {
  moveTo(x: number, y: number): string;
  moveBy(dx: number, dy: number): string;
  hide(): string;
  show(): string;
  save(): string;
  restore(): string;
  toColumnStart(): string;
}

export function createCursor(): Cursor {
  return {
    moveTo(x, y) {
      return csi(`${y + 1};${x + 1}H`);
    },
    moveBy(dx, dy) {
      let out = '';
      if (dy < 0) out += csi(`${-dy}A`);
      else if (dy > 0) out += csi(`${dy}B`);
      if (dx > 0) out += csi(`${dx}C`);
      else if (dx < 0) out += csi(`${-dx}D`);
      return out;
    },
    hide() {
      return csi('?25l');
    },
    show() {
      return csi('?25h');
    },
    save() {
      return csi('s');
    },
    restore() {
      return csi('u');
    },
    toColumnStart() {
      return '\r';
    },
  };
}
