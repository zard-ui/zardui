export interface Color {
  name: string;
  id: string;
  scale: number;
  className: string;
  hex: string;
  rgb: string;
  hsl: string;
  oklch: string;
  var: string;
  foreground: string;
}

export interface ColorPalette {
  name: string;
  colors: Color[];
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function calculateLuminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) => {
    const normalized = c / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getForegroundColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const luminance = calculateLuminance(r, g, b);
  return luminance > 0.179 ? '#000' : '#fff';
}

function createColor(name: string, scale: number, hex: string, hsl: string, oklch: string): Color {
  const { r, g, b } = hexToRgb(hex);

  return {
    name,
    id: `${name}-${scale}`,
    scale,
    className: `${name}-${scale}`,
    hex,
    rgb: `${r} ${g} ${b}`,
    hsl,
    oklch,
    var: `--color-${name}-${scale}`,
    foreground: getForegroundColor(hex),
  };
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    name: 'neutral',
    colors: [
      createColor('neutral', 50, '#fafafa', '0 0% 98%', 'oklch(0.99 0.00 0)'),
      createColor('neutral', 100, '#f5f5f5', '0 0% 96.1%', 'oklch(0.97 0.00 0)'),
      createColor('neutral', 200, '#e5e5e5', '0 0% 89.8%', 'oklch(0.92 0.00 0)'),
      createColor('neutral', 300, '#d4d4d4', '0 0% 83.1%', 'oklch(0.87 0.00 0)'),
      createColor('neutral', 400, '#a3a3a3', '0 0% 63.9%', 'oklch(0.72 0.00 0)'),
      createColor('neutral', 500, '#737373', '0 0% 45.1%', 'oklch(0.56 0.00 0)'),
      createColor('neutral', 600, '#525252', '0 0% 32.2%', 'oklch(0.44 0.00 0)'),
      createColor('neutral', 700, '#404040', '0 0% 25.1%', 'oklch(0.37 0.00 0)'),
      createColor('neutral', 800, '#262626', '0 0% 14.9%', 'oklch(0.27 0.00 0)'),
      createColor('neutral', 900, '#171717', '0 0% 9%', 'oklch(0.20 0.00 0)'),
      createColor('neutral', 950, '#0a0a0a', '0 0% 3.9%', 'oklch(0.14 0.00 0)'),
    ],
  },
  {
    name: 'stone',
    colors: [
      createColor('stone', 50, '#fafaf9', '60 9.1% 97.8%', 'oklch(0.98 0.00 106)'),
      createColor('stone', 100, '#f5f5f4', '60 4.8% 95.9%', 'oklch(0.97 0.00 106)'),
      createColor('stone', 200, '#e7e5e4', '20 5.9% 90%', 'oklch(0.92 0.00 49)'),
      createColor('stone', 300, '#d6d3d1', '24 5.7% 82.9%', 'oklch(0.87 0.00 56)'),
      createColor('stone', 400, '#a8a29e', '24 5.4% 63.9%', 'oklch(0.72 0.01 56)'),
      createColor('stone', 500, '#78716c', '25 5.3% 44.7%', 'oklch(0.55 0.01 58)'),
      createColor('stone', 600, '#57534e', '33.3 5.5% 32.4%', 'oklch(0.44 0.01 74)'),
      createColor('stone', 700, '#44403c', '30 6.3% 25.1%', 'oklch(0.37 0.01 68)'),
      createColor('stone', 800, '#292524', '12 6.5% 15.1%', 'oklch(0.27 0.01 34)'),
      createColor('stone', 900, '#1c1917', '24 9.8% 10%', 'oklch(0.22 0.01 56)'),
      createColor('stone', 950, '#0c0a09', '20 14.3% 4.1%', 'oklch(0.15 0.00 49)'),
    ],
  },
  {
    name: 'zinc',
    colors: [
      createColor('zinc', 50, '#fafafa', '0 0% 98%', 'oklch(0.99 0.00 0)'),
      createColor('zinc', 100, '#f4f4f5', '240 4.8% 95.9%', 'oklch(0.97 0.00 286)'),
      createColor('zinc', 200, '#e4e4e7', '240 5.9% 90%', 'oklch(0.92 0.00 286)'),
      createColor('zinc', 300, '#d4d4d8', '240 4.9% 83.9%', 'oklch(0.87 0.01 286)'),
      createColor('zinc', 400, '#a1a1aa', '240 5% 64.9%', 'oklch(0.71 0.01 286)'),
      createColor('zinc', 500, '#71717a', '240 3.8% 46.1%', 'oklch(0.55 0.01 286)'),
      createColor('zinc', 600, '#52525b', '240 5.2% 33.9%', 'oklch(0.44 0.01 286)'),
      createColor('zinc', 700, '#3f3f46', '240 5.3% 26.1%', 'oklch(0.37 0.01 286)'),
      createColor('zinc', 800, '#27272a', '240 3.7% 15.9%', 'oklch(0.27 0.01 286)'),
      createColor('zinc', 900, '#18181b', '240 5.9% 10%', 'oklch(0.21 0.01 286)'),
      createColor('zinc', 950, '#09090b', '240 10% 3.9%', 'oklch(0.14 0.00 286)'),
    ],
  },
  {
    name: 'slate',
    colors: [
      createColor('slate', 50, '#f8fafc', '210 40% 98%', 'oklch(0.98 0.00 248)'),
      createColor('slate', 100, '#f1f5f9', '210 40% 96.1%', 'oklch(0.97 0.01 248)'),
      createColor('slate', 200, '#e2e8f0', '214.3 31.8% 91.4%', 'oklch(0.93 0.01 256)'),
      createColor('slate', 300, '#cbd5e1', '212.7 26.8% 83.9%', 'oklch(0.87 0.02 253)'),
      createColor('slate', 400, '#94a3b8', '215 20.2% 65.1%', 'oklch(0.71 0.04 257)'),
      createColor('slate', 500, '#64748b', '215.4 16.3% 46.9%', 'oklch(0.55 0.04 257)'),
      createColor('slate', 600, '#475569', '215.3 19.3% 34.5%', 'oklch(0.45 0.04 257)'),
      createColor('slate', 700, '#334155', '215.3 25% 26.7%', 'oklch(0.37 0.04 257)'),
      createColor('slate', 800, '#1e293b', '217.2 32.6% 17.5%', 'oklch(0.28 0.04 260)'),
      createColor('slate', 900, '#0f172a', '222.2 47.4% 11.2%', 'oklch(0.21 0.04 266)'),
      createColor('slate', 950, '#020617', '222.2 84% 4.9%', 'oklch(0.13 0.04 265)'),
    ],
  },
  {
    name: 'gray',
    colors: [
      createColor('gray', 50, '#f9fafb', '210 20% 98%', 'oklch(0.98 0.00 248)'),
      createColor('gray', 100, '#f3f4f6', '220 14.3% 95.9%', 'oklch(0.97 0.00 265)'),
      createColor('gray', 200, '#e5e7eb', '220 13% 91%', 'oklch(0.93 0.01 265)'),
      createColor('gray', 300, '#d1d5db', '216 12.2% 83.9%', 'oklch(0.87 0.01 258)'),
      createColor('gray', 400, '#9ca3af', '217.9 10.6% 64.9%', 'oklch(0.71 0.02 261)'),
      createColor('gray', 500, '#6b7280', '220 8.9% 46.1%', 'oklch(0.55 0.02 264)'),
      createColor('gray', 600, '#4b5563', '215 13.8% 34.1%', 'oklch(0.45 0.03 257)'),
      createColor('gray', 700, '#374151', '216.9 19.1% 26.7%', 'oklch(0.37 0.03 260)'),
      createColor('gray', 800, '#1f2937', '215 27.9% 16.9%', 'oklch(0.28 0.03 257)'),
      createColor('gray', 900, '#111827', '220.9 39.3% 11%', 'oklch(0.21 0.03 265)'),
      createColor('gray', 950, '#030712', '224 71.4% 4.1%', 'oklch(0.13 0.03 262)'),
    ],
  },
  {
    name: 'red',
    colors: [
      createColor('red', 50, '#fef2f2', '0 85.7% 97.3%', 'oklch(0.97 0.01 17)'),
      createColor('red', 100, '#fee2e2', '0 93.3% 94.1%', 'oklch(0.94 0.03 18)'),
      createColor('red', 200, '#fecaca', '0 96.3% 89.4%', 'oklch(0.88 0.06 18)'),
      createColor('red', 300, '#fca5a5', '0 93.5% 81.8%', 'oklch(0.81 0.10 20)'),
      createColor('red', 400, '#f87171', '0 90.6% 70.8%', 'oklch(0.71 0.17 22)'),
      createColor('red', 500, '#ef4444', '0 84.2% 60.2%', 'oklch(0.64 0.21 25)'),
      createColor('red', 600, '#dc2626', '0 72.2% 50.6%', 'oklch(0.58 0.22 27)'),
      createColor('red', 700, '#b91c1c', '0 73.7% 41.8%', 'oklch(0.51 0.19 28)'),
      createColor('red', 800, '#991b1b', '0 70% 35.3%', 'oklch(0.44 0.16 27)'),
      createColor('red', 900, '#7f1d1d', '0 62.8% 30.6%', 'oklch(0.40 0.13 26)'),
      createColor('red', 950, '#450a0a', '0 74.7% 15.5%', 'oklch(0.26 0.09 26)'),
    ],
  },
  {
    name: 'orange',
    colors: [
      createColor('orange', 50, '#fff7ed', '33.3 100% 96.5%', 'oklch(0.98 0.02 74)'),
      createColor('orange', 100, '#ffedd5', '34.3 100% 91.8%', 'oklch(0.95 0.04 75)'),
      createColor('orange', 200, '#fed7aa', '32.1 97.7% 83.1%', 'oklch(0.90 0.07 71)'),
      createColor('orange', 300, '#fdba74', '30.7 97.2% 72.4%', 'oklch(0.84 0.12 66)'),
      createColor('orange', 400, '#fb923c', '27 96% 61%', 'oklch(0.76 0.16 56)'),
      createColor('orange', 500, '#f97316', '24.6 95% 53.1%', 'oklch(0.70 0.19 48)'),
      createColor('orange', 600, '#ea580c', '20.5 90.2% 48.2%', 'oklch(0.65 0.19 41)'),
      createColor('orange', 700, '#c2410c', '17.5 88.3% 40.4%', 'oklch(0.55 0.17 38)'),
      createColor('orange', 800, '#9a3412', '15 79.1% 33.7%', 'oklch(0.47 0.14 37)'),
      createColor('orange', 900, '#7c2d12', '15.3 74.6% 27.8%', 'oklch(0.41 0.12 38)'),
      createColor('orange', 950, '#431407', '13 81.1% 14.5%', 'oklch(0.27 0.08 36)'),
    ],
  },
  {
    name: 'amber',
    colors: [
      createColor('amber', 50, '#fffbeb', '48 100% 96.1%', 'oklch(0.99 0.02 95)'),
      createColor('amber', 100, '#fef3c7', '48 96.5% 88.8%', 'oklch(0.96 0.06 96)'),
      createColor('amber', 200, '#fde68a', '48 96.6% 76.7%', 'oklch(0.92 0.12 96)'),
      createColor('amber', 300, '#fcd34d', '45.9 96.7% 64.5%', 'oklch(0.88 0.15 92)'),
      createColor('amber', 400, '#fbbf24', '43.3 96.4% 56.3%', 'oklch(0.84 0.16 84)'),
      createColor('amber', 500, '#f59e0b', '37.7 92.1% 50.2%', 'oklch(0.77 0.16 70)'),
      createColor('amber', 600, '#d97706', '32.1 94.6% 43.7%', 'oklch(0.67 0.16 58)'),
      createColor('amber', 700, '#b45309', '26 90.5% 37.1%', 'oklch(0.56 0.15 49)'),
      createColor('amber', 800, '#92400e', '22.7 82.5% 31.4%', 'oklch(0.47 0.12 46)'),
      createColor('amber', 900, '#78350f', '21.7 77.8% 26.5%', 'oklch(0.41 0.11 46)'),
      createColor('amber', 950, '#451a03', '20.9 91.7% 14.1%', 'oklch(0.28 0.07 46)'),
    ],
  },
  {
    name: 'yellow',
    colors: [
      createColor('yellow', 50, '#fefce8', '54.5 91.7% 95.3%', 'oklch(0.99 0.03 102)'),
      createColor('yellow', 100, '#fef9c3', '54.9 96.7% 88%', 'oklch(0.97 0.07 103)'),
      createColor('yellow', 200, '#fef08a', '52.8 98.3% 76.9%', 'oklch(0.95 0.12 102)'),
      createColor('yellow', 300, '#fde047', '50.4 97.8% 63.5%', 'oklch(0.91 0.17 98)'),
      createColor('yellow', 400, '#facc15', '47.9 95.8% 53.1%', 'oklch(0.86 0.17 92)'),
      createColor('yellow', 500, '#eab308', '45.4 93.4% 47.5%', 'oklch(0.80 0.16 86)'),
      createColor('yellow', 600, '#ca8a04', '40.6 96.1% 40.4%', 'oklch(0.68 0.14 76)'),
      createColor('yellow', 700, '#a16207', '35.5 91.7% 32.9%', 'oklch(0.55 0.12 66)'),
      createColor('yellow', 800, '#854d0e', '31.8 81% 28.8%', 'oklch(0.48 0.10 62)'),
      createColor('yellow', 900, '#713f12', '28.4 72.5% 25.7%', 'oklch(0.42 0.09 58)'),
      createColor('yellow', 950, '#422006', '26 83.3% 14.1%', 'oklch(0.29 0.06 54)'),
    ],
  },
  {
    name: 'lime',
    colors: [
      createColor('lime', 50, '#f7fee7', '78.3 92% 95.1%', 'oklch(0.99 0.03 121)'),
      createColor('lime', 100, '#ecfccb', '79.6 89.1% 89.2%', 'oklch(0.97 0.07 122)'),
      createColor('lime', 200, '#d9f99d', '80.9 88.5% 79.6%', 'oklch(0.94 0.12 124)'),
      createColor('lime', 300, '#bef264', '82 84.5% 67.1%', 'oklch(0.90 0.18 127)'),
      createColor('lime', 400, '#a3e635', '82.7 78% 55.5%', 'oklch(0.85 0.21 129)'),
      createColor('lime', 500, '#84cc16', '83.7 80.5% 44.3%', 'oklch(0.77 0.20 131)'),
      createColor('lime', 600, '#65a30d', '84.8 85.2% 34.5%', 'oklch(0.65 0.18 132)'),
      createColor('lime', 700, '#4d7c0f', '85.9 78.4% 27.3%', 'oklch(0.53 0.14 132)'),
      createColor('lime', 800, '#3f6212', '86.3 69% 22.7%', 'oklch(0.45 0.11 131)'),
      createColor('lime', 900, '#365314', '87.6 61.2% 20.2%', 'oklch(0.41 0.10 131)'),
      createColor('lime', 950, '#1a2e05', '89.3 80.4% 10%', 'oklch(0.27 0.07 132)'),
    ],
  },
  {
    name: 'green',
    colors: [
      createColor('green', 50, '#f0fdf4', '138.5 76.5% 96.7%', 'oklch(0.98 0.02 156)'),
      createColor('green', 100, '#dcfce7', '140.6 84.2% 92.5%', 'oklch(0.96 0.04 157)'),
      createColor('green', 200, '#bbf7d0', '141 78.9% 85.1%', 'oklch(0.93 0.08 156)'),
      createColor('green', 300, '#86efac', '141.7 76.6% 73.1%', 'oklch(0.87 0.14 154)'),
      createColor('green', 400, '#4ade80', '141.9 69.2% 58%', 'oklch(0.80 0.18 152)'),
      createColor('green', 500, '#22c55e', '142.1 70.6% 45.3%', 'oklch(0.72 0.19 150)'),
      createColor('green', 600, '#16a34a', '142.1 76.2% 36.3%', 'oklch(0.63 0.17 149)'),
      createColor('green', 700, '#15803d', '142.4 71.8% 29.2%', 'oklch(0.53 0.14 150)'),
      createColor('green', 800, '#166534', '142.8 64.2% 24.1%', 'oklch(0.45 0.11 151)'),
      createColor('green', 900, '#14532d', '143.8 61.2% 20.2%', 'oklch(0.39 0.09 153)'),
      createColor('green', 950, '#052e16', '144.9 80.4% 10%', 'oklch(0.27 0.06 153)'),
    ],
  },
  {
    name: 'emerald',
    colors: [
      createColor('emerald', 50, '#ecfdf5', '151.8 81% 95.9%', 'oklch(0.98 0.02 166)'),
      createColor('emerald', 100, '#d1fae5', '149.3 80.4% 90%', 'oklch(0.95 0.05 163)'),
      createColor('emerald', 200, '#a7f3d0', '152.4 76% 80.4%', 'oklch(0.90 0.09 164)'),
      createColor('emerald', 300, '#6ee7b7', '156.2 71.6% 66.9%', 'oklch(0.85 0.13 165)'),
      createColor('emerald', 400, '#34d399', '158.1 64.4% 51.6%', 'oklch(0.77 0.15 163)'),
      createColor('emerald', 500, '#10b981', '160.1 84.1% 39.4%', 'oklch(0.70 0.15 162)'),
      createColor('emerald', 600, '#059669', '161.4 93.5% 30.4%', 'oklch(0.60 0.13 163)'),
      createColor('emerald', 700, '#047857', '162.9 93.5% 24.3%', 'oklch(0.51 0.10 166)'),
      createColor('emerald', 800, '#065f46', '163.1 88.1% 19.8%', 'oklch(0.43 0.09 167)'),
      createColor('emerald', 900, '#064e3b', '164.2 85.7% 16.5%', 'oklch(0.38 0.07 169)'),
      createColor('emerald', 950, '#022c22', '165.7 91.3% 9%', 'oklch(0.26 0.05 173)'),
    ],
  },
  {
    name: 'teal',
    colors: [
      createColor('teal', 50, '#f0fdfa', '166.2 76.5% 96.7%', 'oklch(0.98 0.01 181)'),
      createColor('teal', 100, '#ccfbf1', '167.2 85.5% 89.2%', 'oklch(0.95 0.05 181)'),
      createColor('teal', 200, '#99f6e4', '168.4 83.8% 78.2%', 'oklch(0.91 0.09 180)'),
      createColor('teal', 300, '#5eead4', '170.6 76.9% 64.3%', 'oklch(0.85 0.13 181)'),
      createColor('teal', 400, '#2dd4bf', '172.5 66% 50.4%', 'oklch(0.78 0.13 182)'),
      createColor('teal', 500, '#14b8a6', '173.4 80.4% 40%', 'oklch(0.70 0.12 183)'),
      createColor('teal', 600, '#0d9488', '174.7 83.9% 31.6%', 'oklch(0.60 0.10 185)'),
      createColor('teal', 700, '#0f766e', '175.3 77.4% 26.1%', 'oklch(0.51 0.09 186)'),
      createColor('teal', 800, '#115e59', '176.1 69.4% 21.8%', 'oklch(0.44 0.07 188)'),
      createColor('teal', 900, '#134e4a', '175.9 60.8% 19%', 'oklch(0.39 0.06 188)'),
      createColor('teal', 950, '#042f2e', '178.6 84.3% 10%', 'oklch(0.28 0.04 193)'),
    ],
  },
  {
    name: 'cyan',
    colors: [
      createColor('cyan', 50, '#ecfeff', '183.2 100% 96.3%', 'oklch(0.98 0.02 201)'),
      createColor('cyan', 100, '#cffafe', '185.1 95.9% 90.4%', 'oklch(0.96 0.04 203)'),
      createColor('cyan', 200, '#a5f3fc', '186.2 93.5% 81.8%', 'oklch(0.92 0.08 205)'),
      createColor('cyan', 300, '#67e8f9', '187 92.4% 69%', 'oklch(0.87 0.12 207)'),
      createColor('cyan', 400, '#22d3ee', '187.9 85.7% 53.3%', 'oklch(0.80 0.13 212)'),
      createColor('cyan', 500, '#06b6d4', '188.7 94.5% 42.7%', 'oklch(0.71 0.13 215)'),
      createColor('cyan', 600, '#0891b2', '191.6 91.4% 36.5%', 'oklch(0.61 0.11 222)'),
      createColor('cyan', 700, '#0e7490', '192.9 82.3% 31%', 'oklch(0.52 0.09 223)'),
      createColor('cyan', 800, '#155e75', '194.4 69.6% 27.1%', 'oklch(0.45 0.08 224)'),
      createColor('cyan', 900, '#164e63', '196.4 63.6% 23.7%', 'oklch(0.40 0.07 227)'),
      createColor('cyan', 950, '#083344', '197 78.9% 14.9%', 'oklch(0.30 0.05 230)'),
    ],
  },
  {
    name: 'sky',
    colors: [
      createColor('sky', 50, '#f0f9ff', '204 100% 97.1%', 'oklch(0.98 0.01 237)'),
      createColor('sky', 100, '#e0f2fe', '204 93.8% 93.7%', 'oklch(0.95 0.03 237)'),
      createColor('sky', 200, '#bae6fd', '200.6 94.4% 86.1%', 'oklch(0.90 0.06 231)'),
      createColor('sky', 300, '#7dd3fc', '199.4 95.5% 73.9%', 'oklch(0.83 0.10 230)'),
      createColor('sky', 400, '#38bdf8', '198.4 93.2% 59.6%', 'oklch(0.75 0.14 233)'),
      createColor('sky', 500, '#0ea5e9', '198.6 88.7% 48.4%', 'oklch(0.68 0.15 237)'),
      createColor('sky', 600, '#0284c7', '200.4 98% 39.4%', 'oklch(0.59 0.14 242)'),
      createColor('sky', 700, '#0369a1', '201.3 96.3% 32.2%', 'oklch(0.50 0.12 243)'),
      createColor('sky', 800, '#075985', '201 90% 27.5%', 'oklch(0.44 0.10 241)'),
      createColor('sky', 900, '#0c4a6e', '202 80.3% 23.9%', 'oklch(0.39 0.08 241)'),
      createColor('sky', 950, '#082f49', '204 80.2% 15.9%', 'oklch(0.29 0.06 243)'),
    ],
  },
  {
    name: 'blue',
    colors: [
      createColor('blue', 50, '#eff6ff', '213.8 100% 96.9%', 'oklch(0.97 0.01 255)'),
      createColor('blue', 100, '#dbeafe', '214.3 94.6% 92.7%', 'oklch(0.93 0.03 256)'),
      createColor('blue', 200, '#bfdbfe', '213.3 96.9% 87.3%', 'oklch(0.88 0.06 254)'),
      createColor('blue', 300, '#93c5fd', '211.7 96.4% 78.4%', 'oklch(0.81 0.10 252)'),
      createColor('blue', 400, '#60a5fa', '213.1 93.9% 67.8%', 'oklch(0.71 0.14 255)'),
      createColor('blue', 500, '#3b82f6', '217.2 91.2% 59.8%', 'oklch(0.62 0.19 260)'),
      createColor('blue', 600, '#2563eb', '221.2 83.2% 53.3%', 'oklch(0.55 0.22 263)'),
      createColor('blue', 700, '#1d4ed8', '224.3 76.3% 48%', 'oklch(0.49 0.22 264)'),
      createColor('blue', 800, '#1e40af', '225.9 70.7% 40.2%', 'oklch(0.42 0.18 266)'),
      createColor('blue', 900, '#1e3a8a', '224.4 64.3% 32.9%', 'oklch(0.38 0.14 266)'),
      createColor('blue', 950, '#172554', '226.2 57% 21%', 'oklch(0.28 0.09 268)'),
    ],
  },
  {
    name: 'indigo',
    colors: [
      createColor('indigo', 50, '#eef2ff', '225.9 100% 96.7%', 'oklch(0.96 0.02 272)'),
      createColor('indigo', 100, '#e0e7ff', '226.5 100% 93.9%', 'oklch(0.93 0.03 273)'),
      createColor('indigo', 200, '#c7d2fe', '228 96.5% 88.8%', 'oklch(0.87 0.06 274)'),
      createColor('indigo', 300, '#a5b4fc', '229.7 93.5% 81.8%', 'oklch(0.79 0.10 275)'),
      createColor('indigo', 400, '#818cf8', '234.5 89.5% 73.9%', 'oklch(0.68 0.16 277)'),
      createColor('indigo', 500, '#6366f1', '238.7 83.5% 66.7%', 'oklch(0.59 0.20 277)'),
      createColor('indigo', 600, '#4f46e5', '243.4 75.4% 58.6%', 'oklch(0.51 0.23 277)'),
      createColor('indigo', 700, '#4338ca', '244.5 57.9% 50.6%', 'oklch(0.46 0.21 277)'),
      createColor('indigo', 800, '#3730a3', '243.7 54.5% 41.4%', 'oklch(0.40 0.18 277)'),
      createColor('indigo', 900, '#312e81', '242.2 47.4% 34.3%', 'oklch(0.36 0.14 279)'),
      createColor('indigo', 950, '#1e1b4b', '243.8 47.1% 20%', 'oklch(0.26 0.09 281)'),
    ],
  },
  {
    name: 'violet',
    colors: [
      createColor('violet', 50, '#f5f3ff', '250 100% 97.6%', 'oklch(0.97 0.02 294)'),
      createColor('violet', 100, '#ede9fe', '251.4 91.3% 95.5%', 'oklch(0.94 0.03 295)'),
      createColor('violet', 200, '#ddd6fe', '250.5 95.2% 91.8%', 'oklch(0.89 0.05 293)'),
      createColor('violet', 300, '#c4b5fd', '252.5 94.7% 85.1%', 'oklch(0.81 0.10 294)'),
      createColor('violet', 400, '#a78bfa', '255.1 91.7% 76.3%', 'oklch(0.71 0.16 294)'),
      createColor('violet', 500, '#8b5cf6', '258.3 89.5% 66.3%', 'oklch(0.61 0.22 293)'),
      createColor('violet', 600, '#7c3aed', '262.1 83.3% 57.8%', 'oklch(0.54 0.25 293)'),
      createColor('violet', 700, '#6d28d9', '263.4 70% 50.4%', 'oklch(0.49 0.24 293)'),
      createColor('violet', 800, '#5b21b6', '263.4 69.3% 42.2%', 'oklch(0.43 0.21 293)'),
      createColor('violet', 900, '#4c1d95', '263.5 67.4% 34.9%', 'oklch(0.38 0.18 294)'),
      createColor('violet', 950, '#1e1b4b', '261.2 72.6% 22.9%', 'oklch(0.28 0.14 291)'),
    ],
  },
  {
    name: 'purple',
    colors: [
      createColor('purple', 50, '#faf5ff', '270 100% 98%', 'oklch(0.98 0.01 308)'),
      createColor('purple', 100, '#f3e8ff', '268.7 100% 95.5%', 'oklch(0.95 0.03 307)'),
      createColor('purple', 200, '#e9d5ff', '268.6 100% 91.8%', 'oklch(0.90 0.06 307)'),
      createColor('purple', 300, '#d8b4fe', '269.2 97.4% 85.1%', 'oklch(0.83 0.11 306)'),
      createColor('purple', 400, '#c084fc', '270 95.2% 75.3%', 'oklch(0.72 0.18 306)'),
      createColor('purple', 500, '#a855f7', '270.7 91% 65.1%', 'oklch(0.63 0.23 304)'),
      createColor('purple', 600, '#9333ea', '271.5 81.3% 55.9%', 'oklch(0.56 0.25 302)'),
      createColor('purple', 700, '#7e22ce', '272.1 71.7% 47.1%', 'oklch(0.50 0.24 302)'),
      createColor('purple', 800, '#6b21a8', '272.9 67.2% 39.4%', 'oklch(0.44 0.20 304)'),
      createColor('purple', 900, '#581c87', '273.6 65.6% 32%', 'oklch(0.38 0.17 305)'),
      createColor('purple', 950, '#3b0764', '273.5 86.9% 21%', 'oklch(0.29 0.14 303)'),
    ],
  },
  {
    name: 'fuchsia',
    colors: [
      createColor('fuchsia', 50, '#fdf4ff', '289.1 100% 97.8%', 'oklch(0.98 0.02 320)'),
      createColor('fuchsia', 100, '#fae8ff', '287 100% 95.5%', 'oklch(0.95 0.04 319)'),
      createColor('fuchsia', 200, '#f5d0fe', '288.3 95.8% 90.6%', 'oklch(0.90 0.07 320)'),
      createColor('fuchsia', 300, '#f0abfc', '291.1 93.1% 82.9%', 'oklch(0.83 0.13 321)'),
      createColor('fuchsia', 400, '#e879f9', '292 91.4% 72.5%', 'oklch(0.75 0.21 322)'),
      createColor('fuchsia', 500, '#d946ef', '292.2 84.1% 60.6%', 'oklch(0.67 0.26 322)'),
      createColor('fuchsia', 600, '#c026d3', '293.4 69.5% 48.8%', 'oklch(0.59 0.26 323)'),
      createColor('fuchsia', 700, '#a21caf', '294.7 72.4% 39.8%', 'oklch(0.52 0.23 324)'),
      createColor('fuchsia', 800, '#86198f', '295.4 70.2% 32.9%', 'oklch(0.45 0.19 325)'),
      createColor('fuchsia', 900, '#701a75', '296.7 63.6% 28%', 'oklch(0.40 0.16 326)'),
      createColor('fuchsia', 950, '#4a044e', '296.8 90.2% 16.1%', 'oklch(0.29 0.13 326)'),
    ],
  },
  {
    name: 'pink',
    colors: [
      createColor('pink', 50, '#fdf2f8', '327.3 73.3% 97.1%', 'oklch(0.97 0.01 343)'),
      createColor('pink', 100, '#fce7f3', '325.7 77.8% 94.7%', 'oklch(0.95 0.03 342)'),
      createColor('pink', 200, '#fbcfe8', '325.9 84.6% 89.8%', 'oklch(0.90 0.06 343)'),
      createColor('pink', 300, '#f9a8d4', '327.4 87.1% 81.8%', 'oklch(0.82 0.11 346)'),
      createColor('pink', 400, '#f472b6', '328.6 85.5% 70.2%', 'oklch(0.73 0.18 350)'),
      createColor('pink', 500, '#ec4899', '330.4 81.2% 60.4%', 'oklch(0.66 0.21 354)'),
      createColor('pink', 600, '#db2777', '333.3 71.4% 50.6%', 'oklch(0.59 0.22 1)'),
      createColor('pink', 700, '#be185d', '335.1 77.6% 42%', 'oklch(0.52 0.20 4)'),
      createColor('pink', 800, '#9d174d', '335.8 74.4% 35.3%', 'oklch(0.46 0.17 4)'),
      createColor('pink', 900, '#831843', '335.9 69% 30.4%', 'oklch(0.41 0.14 2)'),
      createColor('pink', 950, '#500724', '336.2 83.9% 17.1%', 'oklch(0.28 0.10 4)'),
    ],
  },
  {
    name: 'rose',
    colors: [
      createColor('rose', 50, '#fff1f2', '355.7 100% 97.3%', 'oklch(0.97 0.02 12)'),
      createColor('rose', 100, '#ffe4e6', '355.6 100% 94.7%', 'oklch(0.94 0.03 13)'),
      createColor('rose', 200, '#fecdd3', '352.7 96.1% 90%', 'oklch(0.89 0.06 10)'),
      createColor('rose', 300, '#fda4af', '352.6 95.7% 81.8%', 'oklch(0.81 0.11 12)'),
      createColor('rose', 400, '#fb7185', '351.3 94.5% 71.4%', 'oklch(0.72 0.17 13)'),
      createColor('rose', 500, '#f43f5e', '349.7 89.2% 60.2%', 'oklch(0.65 0.22 16)'),
      createColor('rose', 600, '#e11d48', '346.8 77.2% 49.8%', 'oklch(0.59 0.22 18)'),
      createColor('rose', 700, '#be123c', '345.3 82.7% 40.8%', 'oklch(0.51 0.20 17)'),
      createColor('rose', 800, '#9f1239', '343.4 79.7% 34.7%', 'oklch(0.45 0.17 14)'),
      createColor('rose', 900, '#881337', '341.5 75.5% 30.4%', 'oklch(0.41 0.15 10)'),
      createColor('rose', 950, '#4c0519', '343.1 87.7% 15.9%', 'oklch(0.27 0.10 12)'),
    ],
  },
];

export const COLOR_FORMATS = [
  { value: 'class' as const, label: 'class', example: 'blue-500' },
  { value: 'hex' as const, label: 'HEX', example: '#3b82f6' },
  { value: 'rgb' as const, label: 'RGB', example: '59 130 246' },
  { value: 'hsl' as const, label: 'HSL', example: '217.2 91.2% 59.8%' },
  { value: 'oklch' as const, label: 'OKLCH', example: 'oklch(0.62 0.17 240)' },
  { value: 'var' as const, label: 'var', example: '--color-blue-500' },
];
