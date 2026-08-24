/**
 * layout — a Flexbox-like layout engine, in integers, in two passes (measure
 * bottom-up, position top-down). A pure function: (Node, Size) → boxes.
 * Supports column/row/center, box/panel and leaves.
 */

import type { Node } from '../components/index.js';
import type { Rect, Size } from '../frame/index.js';
import { stringWidth, wrapText } from '../utils/index.js';

export type Direction = 'row' | 'column';
export type Align = 'start' | 'center' | 'end' | 'stretch';
export type Justify = 'start' | 'center' | 'end' | 'space-between' | 'space-around';
export type Overflow = 'hidden' | 'visible' | 'scroll';
export type Dimension = number | 'auto' | `${number}fr`;

export interface EdgeInsets {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}
export interface LayoutProps {
  readonly direction?: Direction;
  readonly gap?: number;
  readonly padding?: number | Partial<EdgeInsets>;
  readonly margin?: number | Partial<EdgeInsets>;
  readonly align?: Align;
  readonly justify?: Justify;
  readonly flexGrow?: number;
  readonly flexShrink?: number;
  readonly width?: Dimension;
  readonly height?: Dimension;
  readonly minWidth?: number;
  readonly maxWidth?: number;
  readonly minHeight?: number;
  readonly maxHeight?: number;
  readonly overflow?: Overflow;
}
export interface LayoutBox {
  readonly node: Node;
  readonly rect: Rect;
  readonly content: Rect;
}

interface WH {
  w: number;
  h: number;
}

const CONTAINERS = new Set(['screen', 'box', 'panel', 'card', 'stack', 'row', 'column', 'center', 'grid']);
const BORDERED = new Set(['box', 'panel', 'card']);

function num(v: unknown, d = 0): number {
  return typeof v === 'number' ? v : d;
}
function str(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function insetsOf(n: Node): EdgeInsets {
  const p = n.props as LayoutProps & { border?: string };
  const border = BORDERED.has(n.type) && p.border && p.border !== 'none' ? 1 : 0;
  const pad = p.padding;
  let t = 0,
    r = 0,
    b = 0,
    l = 0;
  if (typeof pad === 'number') t = r = b = l = pad;
  else if (pad && typeof pad === 'object') {
    t = num((pad as EdgeInsets).top);
    r = num((pad as EdgeInsets).right);
    b = num((pad as EdgeInsets).bottom);
    l = num((pad as EdgeInsets).left);
  }
  return { top: t + border, right: r + border, bottom: b + border, left: l + border };
}

function dirOf(n: Node): Direction {
  if (n.type === 'row') return 'row';
  return (n.props as LayoutProps).direction === 'row' ? 'row' : 'column';
}
function gapOf(n: Node): number {
  return num((n.props as LayoutProps).gap);
}
function isContainer(n: Node): boolean {
  return CONTAINERS.has(n.type);
}

/** A leaf's intrinsic width and height, given the available width. */
function measureLeaf(n: Node, availW: number): WH {
  const p = n.props as Record<string, unknown>;
  switch (n.type) {
    case 'text': {
      const lines = wrapText(str(p['content']), Math.max(1, availW));
      const w = Math.max(0, ...lines.map(l => stringWidth(l)));
      return { w: Math.min(availW, w), h: Math.max(1, lines.length) };
    }
    case 'separator':
      return { w: availW, h: 1 };
    case 'spinner': {
      // With no label the renderer paints only the glyph; measuring '⠋ ' would
      // leave a phantom column and misalign the row against its siblings (✔, ○).
      const label = str(p['label']);
      return { w: stringWidth(label ? '⠋ ' + label : '⠋'), h: 1 };
    }
    case 'status':
      return { w: stringWidth('● ' + str(p['label'])), h: 1 };
    case 'badge':
      return { w: stringWidth(' ' + str(p['text']) + ' '), h: 1 };
    case 'progressBar':
      return { w: num(p['width'], Math.min(availW, 30)), h: 1 };
    case 'header':
      return { w: availW, h: str(p['subtitle']) ? 2 : 1 };
    case 'footer':
      return { w: availW, h: 1 };
    case 'spacer':
      return { w: 0, h: 0 };
    case 'input':
    case 'password':
    case 'confirm':
    case 'checkbox':
      return { w: availW, h: 1 };
    case 'textarea':
      return { w: availW, h: num(p['rows'], 3) + 1 };
    case 'select': {
      const opts = Array.isArray(p['options']) ? (p['options'] as unknown[]).length : 0;
      return { w: availW, h: opts + (str(p['label']) ? 1 : 0) };
    }
    case 'list': {
      const items = Array.isArray(p['items']) ? (p['items'] as unknown[]).length : 0;
      return { w: availW, h: Math.max(1, items) };
    }
    case 'table': {
      const rows = Array.isArray(p['rows']) ? (p['rows'] as unknown[]).length : 0;
      const border = p['border'] && p['border'] !== 'none' ? 2 : 0;
      return { w: availW, h: rows + 1 + border };
    }
    case 'tree':
      return { w: availW, h: countTree(p['root']) };
    case 'emptyState':
      return { w: availW, h: 2 + (str(p['description']) ? 1 : 0) + (str(p['hint']) ? 1 : 0) };
    case 'banner': {
      const lines = Array.isArray(p['lines']) ? (p['lines'] as string[]) : [];
      const w = Math.max(0, ...lines.map(l => stringWidth(l)));
      return { w, h: Math.max(1, lines.length) };
    }
    case 'gradientText':
      return { w: stringWidth(str(p['content'])), h: 1 };
    default:
      return { w: 0, h: 1 };
  }
}

function countTree(root: unknown): number {
  if (!root || typeof root !== 'object') return 0;
  const r = root as { children?: unknown[]; expanded?: boolean };
  let n = 1;
  if (r.expanded !== false && Array.isArray(r.children)) {
    for (const c of r.children) n += countTree(c);
  }
  return n;
}

function measure(n: Node, availW: number): WH {
  if (!isContainer(n)) return measureLeaf(n, availW);

  const ins = insetsOf(n);
  const innerAvailW = Math.max(0, availW - ins.left - ins.right);
  const gap = gapOf(n);
  const dir = dirOf(n);
  const kids = n.children;

  let innerW = 0;
  let innerH = 0;
  if (kids.length > 0) {
    if (dir === 'row') {
      let tW = 0;
      let mH = 0;
      kids.forEach((c, i) => {
        const m = measure(c, innerAvailW);
        tW += m.w + (i < kids.length - 1 ? gap : 0);
        mH = Math.max(mH, m.h);
      });
      innerW = tW;
      innerH = mH;
    } else {
      let mW = 0;
      let tH = 0;
      kids.forEach((c, i) => {
        const m = measure(c, innerAvailW);
        mW = Math.max(mW, m.w);
        tH += m.h + (i < kids.length - 1 ? gap : 0);
      });
      innerW = mW;
      innerH = tH;
    }
  }

  const p = n.props as LayoutProps;
  const w = typeof p.width === 'number' ? p.width : n.type === 'row' ? innerW + ins.left + ins.right : availW; // screen/panel/box/card/column/stack/center/grid esticam
  const h = typeof p.height === 'number' ? p.height : innerH + ins.top + ins.bottom;
  return { w, h };
}

function contentRect(n: Node, rect: Rect): Rect {
  const ins = insetsOf(n);
  return {
    x: rect.x + ins.left,
    y: rect.y + ins.top,
    w: Math.max(0, rect.w - ins.left - ins.right),
    h: Math.max(0, rect.h - ins.top - ins.bottom),
  };
}

function flexGrowOf(n: Node): number {
  if (n.type === 'spacer') return num((n.props as LayoutProps).flexGrow, 1);
  return num((n.props as LayoutProps).flexGrow, 0);
}
function alignOf(n: Node): Align {
  const a = (n.props as LayoutProps).align;
  if (a) return a;
  return n.type === 'center' ? 'center' : 'stretch';
}
function justifyOf(n: Node): Justify {
  return (n.props as LayoutProps).justify ?? (n.type === 'center' ? 'center' : 'start');
}

function place(n: Node, rect: Rect, out: LayoutBox[]): void {
  const content = isContainer(n) ? contentRect(n, rect) : rect;
  out.push({ node: n, rect, content });
  if (!isContainer(n) || n.children.length === 0) return;

  const dir = dirOf(n);
  const gap = gapOf(n);
  const kids = n.children;
  const align = alignOf(n);

  const sizes = kids.map(c => measure(c, content.w));
  const mainAxis = dir === 'row' ? content.w : content.h;
  const totalMain = sizes.reduce((a, s) => a + (dir === 'row' ? s.w : s.h), 0) + gap * Math.max(0, kids.length - 1);
  const leftover = Math.max(0, mainAxis - totalMain);

  const grows = kids.map(flexGrowOf);
  const totalGrow = grows.reduce((a, b) => a + b, 0);
  const extra = kids.map((_, i) => (totalGrow > 0 ? Math.floor((leftover * (grows[i] ?? 0)) / totalGrow) : 0));

  // justify: only when no flexGrow is there to absorb the slack
  let startOffset = 0;
  let between = gap;
  if (totalGrow === 0 && leftover > 0 && kids.length > 0) {
    const j = justifyOf(n);
    if (j === 'center') startOffset = Math.floor(leftover / 2);
    else if (j === 'end') startOffset = leftover;
    else if (j === 'space-between' && kids.length > 1) between = gap + leftover / (kids.length - 1);
    else if (j === 'space-around') {
      startOffset = leftover / (kids.length * 2);
      between = gap + leftover / kids.length;
    }
  }

  let pos = (dir === 'row' ? content.x : content.y) + Math.floor(startOffset);
  for (let i = 0; i < kids.length; i++) {
    const c = kids[i]!;
    const s = sizes[i]!;
    const sizeMain = (dir === 'row' ? s.w : s.h) + (extra[i] ?? 0);
    if (dir === 'row') {
      const ch = align === 'stretch' ? content.h : s.h;
      const cy =
        align === 'center'
          ? content.y + Math.floor((content.h - s.h) / 2)
          : align === 'end'
            ? content.y + (content.h - s.h)
            : content.y;
      place(c, { x: pos, y: cy, w: sizeMain, h: ch }, out);
    } else {
      const cw = align === 'stretch' ? content.w : Math.min(s.w || content.w, content.w);
      const cx =
        align === 'center' || n.type === 'center'
          ? content.x + Math.floor((content.w - cw) / 2)
          : align === 'end'
            ? content.x + (content.w - cw)
            : content.x;
      place(c, { x: cx, y: pos, w: align === 'stretch' ? content.w : cw, h: sizeMain }, out);
    }
    pos += sizeMain + Math.round(between);
  }
}

export function computeLayout(root: Node, viewport: Size): LayoutBox[] {
  const out: LayoutBox[] = [];
  place(root, { x: 0, y: 0, w: viewport.cols, h: viewport.rows }, out);
  return out;
}
