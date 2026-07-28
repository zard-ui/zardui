/**
 * ansi — geração de sequências de escape (CSI/SGR) e o vocabulário de cor.
 * Nível mais baixo que "conhece" o protocolo do terminal. Sem I/O.
 * (Fatia vertical / PoC: implementação real.)
 */

/** Nível de cor que o terminal suporta (ver TerminalCapabilities). */
export type ColorLevel = 'truecolor' | 'ansi256' | 'ansi16' | 'none';

/** Cor concreta já resolvida para um nível — pronta para virar bytes SGR. */
export type AnsiColor =
  | { readonly kind: 'rgb'; readonly r: number; readonly g: number; readonly b: number }
  | { readonly kind: 'ansi256'; readonly index: number }
  | { readonly kind: 'ansi16'; readonly index: number }
  | { readonly kind: 'default' };

/**
 * Atributos de texto como bitmask (comparável por valor, barato de diffar).
 * Objeto const (não `const enum`) para ser compatível com `isolatedModules`.
 */
export const Attr = {
  None: 0,
  Bold: 1 << 0,
  Dim: 1 << 1,
  Italic: 1 << 2,
  Underline: 1 << 3,
  Inverse: 1 << 4,
  Strike: 1 << 5,
  Blink: 1 << 6,
} as const;
/** Valor de bitmask de atributos (combinável com OR bit-a-bit). */
export type Attr = number;

export const ESC = '\x1b';

/** Monta uma sequência CSI (`ESC [ … `). Ex.: csi("2J"), csi(`${y};${x}H`). */
export function csi(body: string): string {
  return ESC + '[' + body;
}

const DEFAULT_COLOR: AnsiColor = { kind: 'default' };

function sameColor(a: AnsiColor, b: AnsiColor): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === 'rgb' && b.kind === 'rgb') return a.r === b.r && a.g === b.g && a.b === b.b;
  if (a.kind === 'ansi256' && b.kind === 'ansi256') return a.index === b.index;
  if (a.kind === 'ansi16' && b.kind === 'ansi16') return a.index === b.index;
  return a.kind === b.kind; // default
}

function colorCodes(c: AnsiColor, fg: boolean): number[] {
  const base = fg ? 38 : 48;
  switch (c.kind) {
    case 'rgb':
      return [base, 2, c.r, c.g, c.b];
    case 'ansi256':
      return [base, 5, c.index];
    case 'ansi16':
      return c.index < 8 ? [(fg ? 30 : 40) + c.index] : [(fg ? 90 : 100) + (c.index - 8)];
    case 'default':
      return [fg ? 39 : 49];
  }
}

function attrCodes(mask: number): number[] {
  const out: number[] = [];
  if (mask & Attr.Bold) out.push(1);
  if (mask & Attr.Dim) out.push(2);
  if (mask & Attr.Italic) out.push(3);
  if (mask & Attr.Underline) out.push(4);
  if (mask & Attr.Blink) out.push(5);
  if (mask & Attr.Inverse) out.push(7);
  if (mask & Attr.Strike) out.push(9);
  return out;
}

/**
 * Builder incremental de SGR que emite APENAS o delta em relação ao estado
 * corrente — chave para minimizar bytes no encoder (ARCHITECTURE §17).
 */
export interface SgrBuilder {
  transition(fg: AnsiColor, bg: AnsiColor, attrs: Attr): string;
  reset(): string;
  clear(): void;
}

export function createSgrBuilder(): SgrBuilder {
  let curFg: AnsiColor = DEFAULT_COLOR;
  let curBg: AnsiColor = DEFAULT_COLOR;
  let curAttrs = 0;

  return {
    transition(fg, bg, attrs) {
      const removingAttr = (curAttrs & ~attrs) !== 0;
      const fgToDefault = fg.kind === 'default' && curFg.kind !== 'default';
      const bgToDefault = bg.kind === 'default' && curBg.kind !== 'default';

      if (removingAttr || fgToDefault || bgToDefault) {
        // Não dá para "desligar" seletivamente de forma barata → reset e reconstrói.
        const codes = [0, ...attrCodes(attrs)];
        if (fg.kind !== 'default') codes.push(...colorCodes(fg, true));
        if (bg.kind !== 'default') codes.push(...colorCodes(bg, false));
        curFg = fg;
        curBg = bg;
        curAttrs = attrs;
        return csi(codes.join(';') + 'm');
      }

      const codes: number[] = [];
      const addedAttrs = attrs & ~curAttrs;
      if (addedAttrs) codes.push(...attrCodes(addedAttrs));
      if (!sameColor(fg, curFg)) codes.push(...colorCodes(fg, true));
      if (!sameColor(bg, curBg)) codes.push(...colorCodes(bg, false));

      curFg = fg;
      curBg = bg;
      curAttrs = attrs;
      if (codes.length === 0) return '';
      return csi(codes.join(';') + 'm');
    },
    reset() {
      curFg = DEFAULT_COLOR;
      curBg = DEFAULT_COLOR;
      curAttrs = 0;
      return csi('0m');
    },
    clear() {
      curFg = DEFAULT_COLOR;
      curBg = DEFAULT_COLOR;
      curAttrs = 0;
    },
  };
}
