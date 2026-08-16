/**
 * utils — helpers puros de string/Unicode. Sem I/O, sem dependências.
 * (Fatia vertical / PoC: implementação real, suficiente para ASCII + wide + emoji.)
 */

// Intl.Segmenter (Node 20+) dá clusters de grapheme corretos; fallback p/ code points.
type Seg = { segment(input: string): Iterable<{ segment: string }> };
type SegCtor = { Segmenter: new (locale: string, opts: { granularity: string }) => Seg };
const SEG: Seg | null =
  typeof (Intl as { Segmenter?: unknown }).Segmenter === 'function'
    ? new (Intl as unknown as SegCtor).Segmenter('en', { granularity: 'grapheme' })
    : null;

export function graphemes(text: string): string[] {
  if (SEG) {
    const out: string[] = [];
    for (const s of SEG.segment(text)) out.push(s.segment);
    return out;
  }
  return Array.from(text);
}

/** true se o code point ocupa 2 colunas (East Asian Wide/Fullwidth, emoji). */
function isWide(cp: number): boolean {
  return (
    (cp >= 0x1100 && cp <= 0x115f) || // Hangul Jamo
    cp === 0x2329 ||
    cp === 0x232a ||
    (cp >= 0x2e80 && cp <= 0x303e) || // CJK radicals, Kangxi
    (cp >= 0x3041 && cp <= 0x33ff) || // Hiragana … CJK symbols
    (cp >= 0x3400 && cp <= 0x4dbf) || // CJK Ext A
    (cp >= 0x4e00 && cp <= 0x9fff) || // CJK Unified
    (cp >= 0xa000 && cp <= 0xa4cf) || // Yi
    (cp >= 0xac00 && cp <= 0xd7a3) || // Hangul Syllables
    (cp >= 0xf900 && cp <= 0xfaff) || // CJK Compat
    (cp >= 0xfe10 && cp <= 0xfe19) ||
    (cp >= 0xfe30 && cp <= 0xfe6f) ||
    (cp >= 0xff00 && cp <= 0xff60) || // Fullwidth forms
    (cp >= 0xffe0 && cp <= 0xffe6) ||
    (cp >= 0x1f300 && cp <= 0x1faff) || // emoji & símbolos
    (cp >= 0x20000 && cp <= 0x3fffd) // CJK Ext B+
  );
}

/** true se combinante / largura zero. */
function isZeroWidth(cp: number): boolean {
  return (
    (cp >= 0x0300 && cp <= 0x036f) ||
    (cp >= 0x1ab0 && cp <= 0x1aff) ||
    (cp >= 0x1dc0 && cp <= 0x1dff) ||
    (cp >= 0x200b && cp <= 0x200f) ||
    (cp >= 0x20d0 && cp <= 0x20ff) ||
    (cp >= 0xfe20 && cp <= 0xfe2f) ||
    cp === 0xfeff
  );
}

export function charWidth(grapheme: string): 0 | 1 | 2 {
  const cp = grapheme.codePointAt(0);
  if (cp === undefined) return 0;
  if (cp < 0x20 || (cp >= 0x7f && cp <= 0x9f)) return 0; // controle
  if (isZeroWidth(cp)) return 0;
  if (isWide(cp)) return 2;
  return 1;
}

export function stringWidth(text: string): number {
  let w = 0;
  for (const g of graphemes(stripAnsi(text))) w += charWidth(g);
  return w;
}

export function wrapText(text: string, width: number): string[] {
  if (width <= 0) return [text];
  const out: string[] = [];
  for (const rawLine of text.split('\n')) {
    let line = '';
    let lineW = 0;
    for (const word of splitWords(rawLine)) {
      const ww = stringWidth(word);
      if (lineW + ww > width && lineW > 0) {
        out.push(line);
        line = '';
        lineW = 0;
      }
      if (ww > width) {
        // palavra maior que a largura: quebra dura por grapheme
        if (line) {
          out.push(line);
          line = '';
          lineW = 0;
        }
        for (const g of graphemes(word)) {
          const gw = charWidth(g);
          if (lineW + gw > width) {
            out.push(line);
            line = '';
            lineW = 0;
          }
          line += g;
          lineW += gw;
        }
      } else {
        line += word;
        lineW += ww;
      }
    }
    out.push(line);
  }
  return out.length ? out : [''];
}

function splitWords(line: string): string[] {
  // mantém os espaços agregados à palavra seguinte para preservar recuos simples
  return line.length ? (line.match(/\s*\S+\s*|\s+/g) ?? [line]) : [''];
}

export function truncate(text: string, width: number, ellipsis = '…'): string {
  if (stringWidth(text) <= width) return text;
  const ew = stringWidth(ellipsis);
  const budget = Math.max(0, width - ew);
  let out = '';
  let w = 0;
  for (const g of graphemes(text)) {
    const gw = charWidth(g);
    if (w + gw > budget) break;
    out += g;
    w += gw;
  }
  return out + ellipsis;
}

export function sliceByWidth(text: string, start: number, end: number): string {
  let out = '';
  let col = 0;
  for (const g of graphemes(text)) {
    const gw = charWidth(g);
    if (col >= start && col + gw <= end) out += g;
    col += gw;
    if (col >= end) break;
  }
  return out;
}

const ANSI_RE = /\x1b\[[0-9;?]*[ -/]*[@-~]/g;
export function stripAnsi(text: string): string {
  return text.replace(ANSI_RE, '');
}
