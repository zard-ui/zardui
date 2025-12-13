import { formatHex, oklch, parse } from 'culori';

export function oklchToHex(oklchStr: string): string {
  try {
    const cleanStr = oklchStr.trim();
    const color = parse(cleanStr);
    if (!color) {
      return '#000000';
    }
    return formatHex(color) ?? '#000000';
  } catch {
    return '#000000';
  }
}

export function hexToOklch(hex: string): string {
  try {
    const color = oklch(hex);
    if (!color) {
      return 'oklch(0 0 0)';
    }
    const l = color.l?.toFixed(3) ?? '0';
    const c = color.c?.toFixed(3) ?? '0';
    const h = color.h?.toFixed(3) ?? '0';
    return `oklch(${l} ${c} ${h})`;
  } catch {
    return 'oklch(0 0 0)';
  }
}

export function parseOklchValues(oklchStr: string): { l: number; c: number; h: number } | null {
  try {
    const match = oklchStr.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
    if (match) {
      return {
        l: parseFloat(match[1]),
        c: parseFloat(match[2]),
        h: parseFloat(match[3]),
      };
    }

    const color = parse(oklchStr);
    if (color) {
      const oklchColor = oklch(color);
      if (oklchColor) {
        return {
          l: oklchColor.l ?? 0,
          c: oklchColor.c ?? 0,
          h: oklchColor.h ?? 0,
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function formatOklch(l: number, c: number, h: number): string {
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(3)})`;
}

export function isValidOklch(value: string): boolean {
  if (!value) return false;
  const parsed = parseOklchValues(value);
  return parsed !== null;
}

export function isValidHex(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}
