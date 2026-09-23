/**
 * renderer — orchestrates the hot path: layout → paint (Frame) → diff → encode
 * (ANSI) → a single write. Keeps ONE retained frame, with a pool of 2 buffers.
 * Holds the painters for every component, focusable ones included.
 */

import { performance } from 'node:perf_hooks';

import { spinnerFrames } from '../animation/index.js';
import { Attr, csi, createSgrBuilder, type ColorLevel } from '../ansi/index.js';
import type { Node } from '../components/index.js';
import { createCursor } from '../cursor/index.js';
import type { Differ, Patch } from '../diff/index.js';
import { createDiffer } from '../diff/index.js';
import type { Cell, CellStyle, ColorRef, Frame, Size } from '../frame/index.js';
import { createFrame, DEFAULT_STYLE } from '../frame/index.js';
import { computeLayout, type LayoutBox } from '../layout/index.js';
import type { Terminal } from '../terminal/index.js';
import type { Theme } from '../theme/index.js';
import { defaultTheme } from '../theme/index.js';
import { charWidth, graphemes, stringWidth, truncate, wrapText as wrap } from '../utils/index.js';

/** Per-frame context the painters read (focus, animation, caret). */
export interface RenderContext {
  readonly focusKey?: string;
  readonly tick?: number;
  readonly elapsedMs?: number;
  readonly caret?: number;
}

export interface RenderStats {
  readonly frame: number;
  readonly changedLines: number;
  readonly changedCells: number;
  readonly bytesWritten: number;
  readonly layoutMicros: number;
  readonly paintMicros: number;
  readonly diffMicros: number;
  readonly encodeMicros: number;
}
export interface RenderOptions {
  readonly terminal: Terminal;
  readonly theme?: Theme;
  readonly differ?: Differ;
  readonly synchronized?: boolean;
}
export interface Renderer {
  readonly size: Size;
  render(root: Node, ctx?: RenderContext): RenderStats;
  invalidateAll(): void;
  resize(size: Size): void;
  setTheme(theme: Theme): void;
  debugFrame(): string;
}

const SYNC_BEGIN = csi('?2026h');
const SYNC_END = csi('?2026l');

const BORDERS: Record<string, { tl: string; tr: string; bl: string; br: string; h: string; v: string }> = {
  single: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
  round: { tl: '╭', tr: '╮', bl: '╰', br: '╯', h: '─', v: '│' },
  double: { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' },
  bold: { tl: '┏', tr: '┓', bl: '┗', br: '┛', h: '━', v: '┃' },
  ascii: { tl: '+', tr: '+', bl: '+', br: '+', h: '-', v: '|' },
};
const STATUS_GLYPH: Record<string, [string, ColorRef]> = {
  ok: ['●', 'success'],
  info: ['●', 'primary'],
  warn: ['●', 'warning'],
  error: ['●', 'danger'],
  pending: ['○', 'muted'],
};

function mkStyle(fg: ColorRef | undefined, bg: ColorRef | undefined, attrs: number): CellStyle {
  const s: { fg?: ColorRef; bg?: ColorRef; attrs: number } = { attrs };
  if (fg !== undefined) s.fg = fg;
  if (bg !== undefined) s.bg = bg;
  return s;
}
function optColor(v: unknown): ColorRef | undefined {
  return typeof v === 'string' ? v : undefined;
}
function str(v: unknown): string {
  return typeof v === 'string' ? v : '';
}
function num(v: unknown, d = 0): number {
  return typeof v === 'number' ? v : d;
}
function fit(s: string, w: number): string {
  const sw = stringWidth(s);
  if (sw === w) return s;
  if (sw < w) return s + ' '.repeat(w - sw);
  return truncate(s, w, '…');
}
function hexToRgb(hex: string): [number, number, number] {
  const s = hex.replace('#', '');
  const f =
    s.length === 3
      ? s
          .split('')
          .map(c => c + c)
          .join('')
      : s;
  return [parseInt(f.slice(0, 2), 16) || 0, parseInt(f.slice(2, 4), 16) || 0, parseInt(f.slice(4, 6), 16) || 0];
}
function rgbToHex(r: number, g: number, b: number): string {
  const h = (n: number): string =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}
function lerpStops(stops: readonly string[], t: number): string {
  if (stops.length === 0) return '#ffffff';
  if (stops.length === 1) return stops[0]!;
  const c = Math.max(0, Math.min(1, t));
  const seg = c * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(seg));
  const local = seg - i;
  const a = hexToRgb(stops[i]!);
  const b = hexToRgb(stops[i + 1]!);
  return rgbToHex(a[0] + (b[0] - a[0]) * local, a[1] + (b[1] - a[1]) * local, a[2] + (b[2] - a[2]) * local);
}
const GRADIENT_DEFAULT = ['#4796E4', '#9B7FD4', '#E26B8F'];

function paintBanner(frame: Frame, box: LayoutBox): void {
  const p = box.node.props as Record<string, unknown>;
  const lines = Array.isArray(p['lines']) ? (p['lines'] as string[]) : [];
  const colors =
    Array.isArray(p['colors']) && (p['colors'] as string[]).length ? (p['colors'] as string[]) : GRADIENT_DEFAULT;
  const width = Math.max(1, ...lines.map(l => stringWidth(l)));
  const centered = p['align'] === 'center';
  for (let i = 0; i < lines.length && i < box.rect.h; i++) {
    const l = lines[i] ?? '';
    const baseX = box.rect.x + (centered ? Math.max(0, Math.floor((box.rect.w - stringWidth(l)) / 2)) : 0);
    let col = 0;
    for (const g of graphemes(l)) {
      const w = charWidth(g);
      if (g !== ' ' && g !== '') {
        const hex = lerpStops(colors, width > 1 ? col / (width - 1) : 0);
        frame.set(baseX + col, box.rect.y + i, {
          char: g,
          width: w === 2 ? 2 : 1,
          style: mkStyle(hex, undefined, Attr.Bold),
        });
        if (w === 2)
          frame.set(baseX + col + 1, box.rect.y + i, { char: '', width: 0, style: mkStyle(hex, undefined, Attr.Bold) });
      }
      col += w;
    }
  }
}

function paintGradientText(frame: Frame, box: LayoutBox): void {
  const p = box.node.props as Record<string, unknown>;
  const content = str(p['content']);
  const colors =
    Array.isArray(p['colors']) && (p['colors'] as string[]).length ? (p['colors'] as string[]) : GRADIENT_DEFAULT;
  const width = Math.max(1, stringWidth(content));
  const bold = p['bold'] ? Attr.Bold : Attr.None;
  let baseX = box.rect.x;
  if (p['align'] === 'center') baseX += Math.max(0, Math.floor((box.rect.w - width) / 2));
  else if (p['align'] === 'right') baseX += Math.max(0, box.rect.w - width);
  let col = 0;
  for (const g of graphemes(content)) {
    const w = charWidth(g);
    if (g !== ' ' && g !== '') {
      const hex = lerpStops(colors, width > 1 ? col / (width - 1) : 0);
      frame.set(baseX + col, box.rect.y, { char: g, width: w === 2 ? 2 : 1, style: mkStyle(hex, undefined, bold) });
      if (w === 2) frame.set(baseX + col + 1, box.rect.y, { char: '', width: 0, style: mkStyle(hex, undefined, bold) });
    }
    col += w;
  }
}

function textStyle(p: Record<string, unknown>): CellStyle {
  let attrs = Attr.None;
  if (p['bold']) attrs |= Attr.Bold;
  if (p['dim']) attrs |= Attr.Dim;
  if (p['italic']) attrs |= Attr.Italic;
  if (p['underline']) attrs |= Attr.Underline;
  if (p['inverse']) attrs |= Attr.Inverse;
  if (typeof p['attrs'] === 'number') attrs |= p['attrs'];
  return mkStyle(optColor(p['color']), optColor(p['background']), attrs);
}

function paintContainer(frame: Frame, box: LayoutBox): void {
  const p = box.node.props as Record<string, unknown>;
  const rect = box.rect;
  const bg = optColor(p['background']);
  if (bg !== undefined) frame.fillRect(rect, { char: ' ', width: 1, style: mkStyle(undefined, bg, Attr.None) });

  const border = str(p['border']) || 'none';
  if (border === 'none' || rect.w < 2 || rect.h < 2) return;
  const b = BORDERS[border] ?? BORDERS['single']!;
  const st = mkStyle(optColor(p['borderColor']) ?? 'border', bg, Attr.None);
  const { x, y, w, h } = rect;
  frame.set(x, y, { char: b.tl, width: 1, style: st });
  frame.set(x + w - 1, y, { char: b.tr, width: 1, style: st });
  frame.set(x, y + h - 1, { char: b.bl, width: 1, style: st });
  frame.set(x + w - 1, y + h - 1, { char: b.br, width: 1, style: st });
  for (let i = x + 1; i < x + w - 1; i++) {
    frame.set(i, y, { char: b.h, width: 1, style: st });
    frame.set(i, y + h - 1, { char: b.h, width: 1, style: st });
  }
  for (let j = y + 1; j < y + h - 1; j++) {
    frame.set(x, j, { char: b.v, width: 1, style: st });
    frame.set(x + w - 1, j, { char: b.v, width: 1, style: st });
  }
  const title = str(p['title']);
  if (title) {
    const ts = mkStyle(optColor(p['borderColor']) ?? 'primary', bg, Attr.Bold);
    frame.putText(x + 2, y, ` ${title} `, ts, { x: x + 1, y, w: w - 2, h: 1 });
  }
  const subtitle = str(p['subtitle']);
  if (subtitle && box.node.type === 'card') {
    const sw = stringWidth(` ${subtitle} `);
    frame.putText(x + w - 2 - sw, y + h - 1, ` ${subtitle} `, mkStyle('muted', bg, Attr.Dim), {
      x: x + 1,
      y: y + h - 1,
      w: w - 2,
      h: 1,
    });
  }
}

function paintText(frame: Frame, box: LayoutBox): void {
  const p = box.node.props as Record<string, unknown>;
  const style = textStyle(p);
  const align = p['align'];
  const lines = wrap(str(p['content']), Math.max(1, box.rect.w));
  for (let i = 0; i < lines.length && i < box.rect.h; i++) {
    const line = lines[i] ?? '';
    let x = box.rect.x;
    const lw = stringWidth(line);
    if (align === 'center') x += Math.floor((box.rect.w - lw) / 2);
    else if (align === 'right') x += box.rect.w - lw;
    frame.putText(x, box.rect.y + i, line, style, box.rect);
  }
}

function line(frame: Frame, box: LayoutBox, text: string, style: CellStyle, dy = 0): void {
  frame.putText(box.rect.x, box.rect.y + dy, text, style, { ...box.rect, y: box.rect.y + dy, h: 1 });
}

function paintInput(frame: Frame, box: LayoutBox, ctx: RenderContext): void {
  const p = box.node.props as Record<string, unknown>;
  const focused = ctx.focusKey !== undefined && box.node.key === ctx.focusKey;
  const isPw = box.node.type === 'password';
  const value = str(p['value']);
  const mask = str(p['mask']) || '•';
  const shown = isPw ? mask.repeat([...value].length) : value;
  const label = str(p['label']);
  const placeholder = str(p['placeholder']);

  let x = box.rect.x;
  x = frame.putText(
    x,
    box.rect.y,
    focused ? '❯ ' : '  ',
    mkStyle('primary', undefined, focused ? Attr.Bold : Attr.None),
    box.rect,
  );
  if (label) x = frame.putText(x, box.rect.y, label + ' ', mkStyle('foreground', undefined, Attr.Bold), box.rect);
  const startX = x;
  const display = shown || placeholder;
  const st = shown ? mkStyle('foreground', undefined, Attr.None) : mkStyle('muted', undefined, Attr.Dim);
  frame.putText(x, box.rect.y, display, st, box.rect);
  if (focused) {
    const caret = Math.min(ctx.caret ?? [...value].length, [...shown].length);
    const cx = startX + caret;
    if (cx < box.rect.x + box.rect.w) {
      const under = frame.cellAt(cx, box.rect.y);
      const ch = under.char && under.char !== '\x00' && under.width !== 0 ? under.char : ' ';
      frame.set(cx, box.rect.y, { char: ch, width: 1, style: mkStyle('background', 'primary', Attr.None) });
    }
  }
}

function paintSelect(frame: Frame, box: LayoutBox, ctx: RenderContext): void {
  const p = box.node.props as Record<string, unknown>;
  const focused = ctx.focusKey !== undefined && box.node.key === ctx.focusKey;
  const options = Array.isArray(p['options'])
    ? (p['options'] as { label: string; value: string; disabled?: boolean }[])
    : [];
  const value = str(p['value']);
  let y = box.rect.y;
  const label = str(p['label']);
  if (label) {
    line(frame, box, label, mkStyle('muted', undefined, Attr.Dim), y - box.rect.y);
    y++;
  }
  for (const opt of options) {
    const selected = opt.value === value;
    const prefix = selected ? '❯ ' : '  ';
    const st = opt.disabled
      ? mkStyle('muted', undefined, Attr.Dim)
      : selected
        ? mkStyle('primary', undefined, focused ? Attr.Bold : Attr.None)
        : mkStyle('foreground', undefined, Attr.None);
    frame.putText(box.rect.x, y, prefix + opt.label, st, { x: box.rect.x, y, w: box.rect.w, h: 1 });
    y++;
  }
}

function paintTable(frame: Frame, box: LayoutBox): void {
  const p = box.node.props as Record<string, unknown>;
  const columns = Array.isArray(p['columns'])
    ? (p['columns'] as { header: string; width?: number; align?: string }[])
    : [];
  const rows = Array.isArray(p['rows']) ? (p['rows'] as string[][]) : [];
  const widths = columns.map((c, i) => {
    if (typeof c.width === 'number') return c.width;
    let w = stringWidth(c.header);
    for (const r of rows) w = Math.max(w, stringWidth(str(r[i])));
    return Math.min(w, 24);
  });
  const gap = 2;
  const renderRow = (cells: string[], y: number, style: CellStyle): void => {
    let x = box.rect.x;
    for (let i = 0; i < columns.length; i++) {
      const w = widths[i] ?? 8;
      frame.putText(x, y, fit(str(cells[i]), w), style, { x, y, w, h: 1 });
      x += w + gap;
    }
  };
  let y = box.rect.y;
  renderRow(
    columns.map(c => c.header),
    y,
    mkStyle('foreground', undefined, Attr.Bold),
  );
  y++;
  const total = widths.reduce((a, b) => a + b + gap, 0);
  frame.putText(box.rect.x, y, '─'.repeat(Math.min(box.rect.w, total)), mkStyle('border', undefined, Attr.None), {
    x: box.rect.x,
    y,
    w: box.rect.w,
    h: 1,
  });
  y++;
  for (const r of rows) {
    renderRow(r as string[], y, mkStyle('foreground', undefined, Attr.None));
    y++;
  }
}

function paintTree(frame: Frame, box: LayoutBox): void {
  const p = box.node.props as Record<string, unknown>;
  const root = p['root'] as { label: string; children?: unknown[]; expanded?: boolean } | undefined;
  const lines: { text: string; accent: boolean }[] = [];
  const walk = (
    n: { label: string; children?: unknown[]; expanded?: boolean },
    prefix: string,
    isLast: boolean,
    depth: number,
  ): void => {
    const branch = depth === 0 ? '' : isLast ? '└─ ' : '├─ ';
    lines.push({ text: prefix + branch + n.label, accent: depth === 0 });
    if (n.expanded !== false && Array.isArray(n.children)) {
      const childPrefix = depth === 0 ? '' : prefix + (isLast ? '   ' : '│  ');
      n.children.forEach((c, i) =>
        walk(c as { label: string; children?: unknown[] }, childPrefix, i === n.children!.length - 1, depth + 1),
      );
    }
  };
  if (root) walk(root, '', true, 0);
  lines.forEach((l, i) => {
    if (i >= box.rect.h) return;
    frame.putText(
      box.rect.x,
      box.rect.y + i,
      l.text,
      mkStyle(l.accent ? 'foreground' : 'muted', undefined, l.accent ? Attr.Bold : Attr.None),
      {
        x: box.rect.x,
        y: box.rect.y + i,
        w: box.rect.w,
        h: 1,
      },
    );
  });
}

function paintNode(frame: Frame, box: LayoutBox, ctx: RenderContext): void {
  const p = box.node.props as Record<string, unknown>;
  const focused = ctx.focusKey !== undefined && box.node.key === ctx.focusKey;
  switch (box.node.type) {
    case 'box':
    case 'panel':
    case 'card':
      paintContainer(frame, box);
      break;
    case 'text':
      paintText(frame, box);
      break;
    case 'banner':
      paintBanner(frame, box);
      break;
    case 'gradientText':
      paintGradientText(frame, box);
      break;
    case 'separator': {
      const ch = str(p['char']) || '─';
      const st = mkStyle(optColor(p['color']) ?? 'border', undefined, Attr.None);
      const label = str(p['label']);
      if (label) {
        const pad = 2;
        const seg = `${ch.repeat(pad)} ${label} `;
        let filled = frame.putText(box.rect.x, box.rect.y, seg, st, box.rect);
        while (filled < box.rect.x + box.rect.w) filled = frame.putText(filled, box.rect.y, ch, st, box.rect);
      } else {
        line(frame, box, ch.repeat(Math.max(0, box.rect.w)), st);
      }
      break;
    }
    case 'header': {
      line(frame, box, str(p['title']), mkStyle('foreground', undefined, Attr.Bold));
      const badge = str(p['badge']);
      if (badge) {
        const bx = box.rect.x + box.rect.w - stringWidth(` ${badge} `);
        frame.putText(bx, box.rect.y, ` ${badge} `, mkStyle('background', 'primary', Attr.Bold), box.rect);
      }
      const subtitle = str(p['subtitle']);
      if (subtitle)
        frame.putText(box.rect.x, box.rect.y + 1, subtitle, mkStyle('muted', undefined, Attr.Dim), {
          ...box.rect,
          y: box.rect.y + 1,
        });
      break;
    }
    case 'footer': {
      const items = Array.isArray(p['items']) ? (p['items'] as string[]) : [];
      line(frame, box, items.join('  ·  '), mkStyle(optColor(p['color']) ?? 'muted', undefined, Attr.Dim));
      break;
    }
    case 'spinner': {
      const variant = str(p['variant']) || 'dots';
      const frames = spinnerFrames[variant] ?? spinnerFrames['dots']!;
      const glyph =
        str(p['glyph']) || frames[Math.floor((ctx.elapsedMs ?? (ctx.tick ?? 0) * 80) / 80) % frames.length] || '⠋';
      const label = str(p['label']);
      const st = mkStyle(optColor(p['color']) ?? 'primary', undefined, Attr.None);
      line(frame, box, label ? `${glyph} ${label}` : glyph, st);
      break;
    }
    case 'status': {
      const kind = str(p['kind']) || 'info';
      const [glyph, color] = STATUS_GLYPH[kind] ?? STATUS_GLYPH['info']!;
      line(frame, box, `${glyph} ${str(p['label'])}`, mkStyle(color, undefined, Attr.None));
      break;
    }
    case 'badge': {
      const kindColor: Record<string, ColorRef> = {
        ok: 'success',
        warn: 'warning',
        error: 'danger',
        info: 'primary',
        pending: 'muted',
      };
      const color = optColor(p['color']) ?? kindColor[str(p['kind'])] ?? 'primary';
      line(frame, box, ` ${str(p['text'])} `, mkStyle('background', color, Attr.Bold));
      break;
    }
    case 'progressBar': {
      const value = Math.max(0, Math.min(1, num(p['value'])));
      const showPercent = p['showPercent'] !== false;
      const label = str(p['label']);
      const suffix = showPercent ? ` ${String(Math.round(value * 100)).padStart(3)}%` : '';
      const labelPart = label ? label + ' ' : '';
      const barW = Math.max(1, box.rect.w - stringWidth(suffix) - stringWidth(labelPart));
      const filled = Math.round(value * barW);
      let x = box.rect.x;
      if (labelPart) x = frame.putText(x, box.rect.y, labelPart, mkStyle('muted', undefined, Attr.None), box.rect);
      const color = optColor(p['color']) ?? 'primary';
      x = frame.putText(x, box.rect.y, '█'.repeat(filled), mkStyle(color, undefined, Attr.None), box.rect);
      x = frame.putText(
        x,
        box.rect.y,
        '░'.repeat(Math.max(0, barW - filled)),
        mkStyle('border', undefined, Attr.None),
        box.rect,
      );
      if (suffix) frame.putText(x, box.rect.y, suffix, mkStyle('muted', undefined, Attr.Dim), box.rect);
      break;
    }
    case 'list': {
      const items = Array.isArray(p['items']) ? (p['items'] as string[]) : [];
      const ordered = Boolean(p['ordered']);
      const bullet = str(p['bullet']) || '•';
      items.forEach((it, i) => {
        if (i >= box.rect.h) return;
        const prefix = ordered ? `${i + 1}. ` : `${bullet} `;
        const x = frame.putText(box.rect.x, box.rect.y + i, prefix, mkStyle('primary', undefined, Attr.None), {
          ...box.rect,
          y: box.rect.y + i,
        });
        frame.putText(x, box.rect.y + i, it, mkStyle('foreground', undefined, Attr.None), {
          ...box.rect,
          y: box.rect.y + i,
        });
      });
      break;
    }
    case 'input':
    case 'password':
      paintInput(frame, box, ctx);
      break;
    case 'select':
      paintSelect(frame, box, ctx);
      break;
    case 'checkbox': {
      const checked = Boolean(p['checked']);
      const glyph = checked ? '◉' : '◯';
      const st = mkStyle(
        focused ? 'primary' : checked ? 'success' : 'foreground',
        undefined,
        focused ? Attr.Bold : Attr.None,
      );
      line(frame, box, `${focused ? '❯ ' : '  '}${glyph} ${str(p['label'])}`, st);
      break;
    }
    case 'confirm': {
      const val = p['value'] === true;
      let x = frame.putText(
        box.rect.x,
        box.rect.y,
        focused ? '❯ ' : '  ',
        mkStyle('primary', undefined, focused ? Attr.Bold : Attr.None),
        box.rect,
      );
      x = frame.putText(x, box.rect.y, str(p['message']) + ' ', mkStyle('foreground', undefined, Attr.Bold), box.rect);
      frame.putText(x, box.rect.y, val ? '(Y/n)' : '(y/N)', mkStyle('muted', undefined, Attr.None), box.rect);
      break;
    }
    case 'textarea': {
      const value = str(p['value']);
      const rows = num(p['rows'], 3);
      const lines = wrap(value || str(p['placeholder']), Math.max(1, box.rect.w - 2));
      const barColor = focused ? 'primary' : 'border';
      for (let i = 0; i <= rows; i++) {
        frame.putText(box.rect.x, box.rect.y + i, '│ ', mkStyle(barColor, undefined, Attr.None), {
          ...box.rect,
          y: box.rect.y + i,
        });
        const ln = lines[i] ?? '';
        frame.putText(
          box.rect.x + 2,
          box.rect.y + i,
          ln,
          mkStyle(value ? 'foreground' : 'muted', undefined, value ? Attr.None : Attr.Dim),
          {
            ...box.rect,
            y: box.rect.y + i,
          },
        );
      }
      break;
    }
    case 'table':
      paintTable(frame, box);
      break;
    case 'tree':
      paintTree(frame, box);
      break;
    case 'emptyState': {
      const icon = str(p['icon']) || '◌';
      const title = str(p['title']);
      const desc = str(p['description']);
      const hint = str(p['hint']);
      const cx = (s: string): number => box.rect.x + Math.max(0, Math.floor((box.rect.w - stringWidth(s)) / 2));
      let y = box.rect.y;
      frame.putText(cx(icon), y++, icon, mkStyle('muted', undefined, Attr.None), { ...box.rect, y });
      frame.putText(cx(title), y++, title, mkStyle('foreground', undefined, Attr.Bold), { ...box.rect, y });
      if (desc) frame.putText(cx(desc), y++, desc, mkStyle('muted', undefined, Attr.Dim), { ...box.rect, y });
      if (hint) frame.putText(cx(hint), y++, hint, mkStyle('primary', undefined, Attr.None), { ...box.rect, y });
      break;
    }
    default:
      break;
  }
}

class RendererImpl implements Renderer {
  private terminal: Terminal;
  private theme: Theme;
  private readonly differ: Differ;
  private readonly sync: boolean;
  private readonly level: ColorLevel;
  private readonly cursor = createCursor();
  private readonly sgr = createSgrBuilder();
  private retained: Frame;
  private scratch: Frame;
  private _size: Size;
  private frameNo = 0;

  constructor(options: RenderOptions) {
    this.terminal = options.terminal;
    this.theme = options.theme ?? defaultTheme;
    this.differ = options.differ ?? createDiffer();
    this.sync = options.synchronized ?? true;
    this.level = this.terminal.caps.colors;
    this._size = this.terminal.size();
    this.retained = createFrame(this._size);
    this.scratch = createFrame(this._size);
  }

  get size(): Size {
    return this._size;
  }

  private encode(patch: Patch): string {
    this.sgr.clear();
    let out = '';
    for (const l of patch.lines) {
      for (const run of l.runs) {
        out += this.cursor.moveTo(run.x, l.y);
        for (const cell of run.cells) {
          if (cell.width === 0) continue;
          const fg = this.theme.resolve(cell.style.fg, this.level);
          const bg = this.theme.resolve(cell.style.bg, this.level);
          out += this.sgr.transition(fg, bg, cell.style.attrs);
          out += cell.char || ' ';
        }
      }
    }
    out += this.sgr.reset();
    return out;
  }

  render(root: Node, ctx: RenderContext = {}): RenderStats {
    const t0 = performance.now();
    const boxes = computeLayout(root, this._size);
    const t1 = performance.now();

    this.scratch.clearTo(DEFAULT_STYLE);
    for (const box of boxes) paintNode(this.scratch, box, ctx);
    const t2 = performance.now();

    const patch = this.differ.diff(this.retained, this.scratch);
    const t3 = performance.now();

    let bytes = '';
    if (!patch.isEmpty) {
      const body = this.encode(patch);
      bytes = this.sync && this.terminal.caps.synchronizedOutput ? SYNC_BEGIN + body + SYNC_END : body;
      this.terminal.write(bytes);
    }
    const t4 = performance.now();

    const tmp = this.retained;
    this.retained = this.scratch;
    this.scratch = tmp;
    this.frameNo++;

    let changedCells = 0;
    for (const l of patch.lines) for (const r of l.runs) changedCells += r.cells.length;

    return {
      frame: this.frameNo,
      changedLines: patch.lines.length,
      changedCells,
      bytesWritten: bytes.length,
      layoutMicros: Math.round((t1 - t0) * 1000),
      paintMicros: Math.round((t2 - t1) * 1000),
      diffMicros: Math.round((t3 - t2) * 1000),
      encodeMicros: Math.round((t4 - t3) * 1000),
    };
  }

  invalidateAll(): void {
    this.retained.invalidate();
  }

  resize(size: Size): void {
    this._size = size;
    this.retained = createFrame(size);
    this.scratch = createFrame(size);
    this.retained.invalidate();
  }

  setTheme(theme: Theme): void {
    this.theme = theme;
    this.invalidateAll();
  }

  debugFrame(): string {
    const rows: string[] = [];
    for (let y = 0; y < this._size.rows; y++) {
      let s = '';
      for (let x = 0; x < this._size.cols; x++) {
        const cell: Cell = this.retained.cellAt(x, y);
        if (cell.width === 0) continue;
        s += cell.char === '\x00' ? ' ' : cell.char || ' ';
      }
      rows.push(s.replace(/\s+$/u, ''));
    }
    return rows.join('\n');
  }
}

export function createRenderer(options: RenderOptions): Renderer {
  return new RendererImpl(options);
}
