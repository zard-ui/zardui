declare module 'culori' {
  export interface Oklch {
    mode: 'oklch';
    l?: number;
    c?: number;
    h?: number;
    alpha?: number;
  }

  export type Color = Oklch | { mode: string; [key: string]: unknown };

  export function parse(color: string): Color | undefined;
  export function oklch(color: string | Color): Oklch | undefined;
  export function formatHex(color: Color): string | undefined;
}
