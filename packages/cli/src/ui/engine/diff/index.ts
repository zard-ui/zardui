/**
 * diff — compara dois Frames e emite o conjunto MÍNIMO de mudanças, como
 * runs (segmentos contíguos) por linha alterada. Função pura (ADR-0001).
 * (Fatia vertical / PoC: implementação real.)
 */

import type { Cell, Frame, Size } from '../frame/index.js';

export interface Run {
  readonly x: number;
  readonly cells: readonly Cell[];
}
export interface LinePatch {
  readonly y: number;
  readonly runs: readonly Run[];
}
export interface Patch {
  readonly size: Size;
  readonly lines: readonly LinePatch[];
  readonly isEmpty: boolean;
}
export interface DifferOptions {
  readonly minGap?: number;
}
export interface Differ {
  diff(prev: Frame, next: Frame): Patch;
}

function styleEquals(a: Cell['style'], b: Cell['style']): boolean {
  return a.fg === b.fg && a.bg === b.bg && a.attrs === b.attrs;
}
function cellEquals(a: Cell, b: Cell): boolean {
  return a.char === b.char && a.width === b.width && styleEquals(a.style, b.style);
}

export function createDiffer(options: DifferOptions = {}): Differ {
  const minGap = Math.max(1, options.minGap ?? 3);

  return {
    diff(prev, next) {
      const { cols, rows } = next.size;
      const lines: LinePatch[] = [];
      const sameSize = prev.size.cols === cols && prev.size.rows === rows;

      for (let y = 0; y < rows; y++) {
        // Skip O(1) por hash de linha (o retido tem hash em cache).
        if (sameSize && prev.rowHash(y) === next.rowHash(y)) continue;

        const a = prev.rowSlice(y);
        const b = next.rowSlice(y);
        const runs: Run[] = [];
        let x = 0;

        while (x < cols) {
          // avança sobre células iguais
          while (x < cols && cellEquals(a[x] as Cell, b[x] as Cell)) x++;
          if (x >= cols) break;

          const start = x;
          while (x < cols) {
            if (cellEquals(a[x] as Cell, b[x] as Cell)) {
              // coalescing: só encerra o run se o trecho igual for >= minGap
              let k = x;
              while (k < cols && cellEquals(a[k] as Cell, b[k] as Cell)) k++;
              if (k >= cols || k - x >= minGap) break;
              x = k; // funde o trecho igual curto dentro do run
            } else {
              x++;
            }
          }
          runs.push({ x: start, cells: b.slice(start, x) });
        }

        if (runs.length) lines.push({ y, runs });
      }

      return { size: next.size, lines, isEmpty: lines.length === 0 };
    },
  };
}
