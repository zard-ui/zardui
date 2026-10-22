import {
  formatColor,
  hsvaToRgba,
  parseColor,
  rgbaToHsva,
  toCssColor,
  type ZardColorFormat,
  type ZardHsva,
} from './color-picker.utils';

const hex = (value: string, format: ZardColorFormat = 'hex', alpha = false) =>
  formatColor(parseColor(value) as ZardHsva, format, alpha);

describe('color-picker utils', () => {
  describe('rgba <-> hsva', () => {
    it.each([
      [
        { r: 255, g: 0, b: 0, a: 1 },
        { h: 0, s: 1, v: 1, a: 1 },
      ],
      [
        { r: 0, g: 255, b: 0, a: 1 },
        { h: 120, s: 1, v: 1, a: 1 },
      ],
      [
        { r: 0, g: 0, b: 255, a: 1 },
        { h: 240, s: 1, v: 1, a: 1 },
      ],
      [
        { r: 0, g: 0, b: 0, a: 1 },
        { h: 0, s: 0, v: 0, a: 1 },
      ],
      [
        { r: 255, g: 255, b: 255, a: 0.5 },
        { h: 0, s: 0, v: 1, a: 0.5 },
      ],
    ])('converts %o to %o and back', (rgba, hsva) => {
      expect(rgbaToHsva(rgba)).toEqual(hsva);
      expect(hsvaToRgba(hsva)).toEqual(rgba);
    });
  });

  describe('parseColor', () => {
    it.each([
      ['#f00', '#ff0000'],
      ['#F00', '#ff0000'],
      ['#2563eb', '#2563eb'],
      ['  #2563EB  ', '#2563eb'],
      ['rgb(37, 99, 235)', '#2563eb'],
      ['rgb(37 99 235)', '#2563eb'],
      ['rgb(100%, 0%, 0%)', '#ff0000'],
      ['hsl(0, 100%, 50%)', '#ff0000'],
      ['hsl(120deg 100% 25%)', '#008000'],
      ['hsl(240 100 50)', '#0000ff'],
      ['hsl(-120, 100%, 50%)', '#0000ff'],
      ['rgb(300, -5, 0)', '#ff0000'],
    ])('parses %s', (input, expected) => {
      expect(hex(input)).toBe(expected);
    });

    it.each([
      ['#ff000080', 0.5],
      ['#f008', 0.53],
      ['rgba(255, 0, 0, 0.25)', 0.25],
      ['rgb(255 0 0 / 50%)', 0.5],
      ['hsla(0, 100%, 50%, 0.4)', 0.4],
      ['hsl(0 100% 50% / 0.4)', 0.4],
    ])('reads the alpha of %s', (input, alpha) => {
      expect((parseColor(input) as ZardHsva).a).toBeCloseTo(alpha, 2);
    });

    it.each([
      '',
      '   ',
      'not-a-color',
      '#ff',
      '#gggggg',
      'rgb(1, 2)',
      'rgb(a, b, c)',
      'hsl(red, 1%, 2%)',
      null,
      undefined,
    ])('returns null for %p', input => {
      expect(parseColor(input)).toBeNull();
    });

    // Without a browser to ask: the same answer on the server and in the client, so hydration matches.
    it.each([
      ['rebeccapurple', '#663399'],
      ['RebeccaPurple', '#663399'],
      ['red', '#ff0000'],
      ['aliceblue', '#f0f8ff'],
      ['yellowgreen', '#9acd32'],
      ['grey', '#808080'],
    ])('parses the named color %s', (input, expected) => {
      expect(hex(input)).toBe(expected);
    });

    it('parses transparent as fully transparent black', () => {
      expect(parseColor('transparent')).toEqual({ h: 0, s: 0, v: 0, a: 0 });
    });

    it.each(['currentcolor', 'inherit', 'reddish', 'constructor', 'toString'])('rejects the keyword %s', input => {
      expect(parseColor(input)).toBeNull();
    });
  });

  describe('formatColor', () => {
    it.each([
      ['hex', '#2563eb'],
      ['rgb', 'rgb(37, 99, 235)'],
      ['hsl', 'hsl(221, 83%, 53%)'],
    ] as const)('formats as %s', (format, expected) => {
      expect(hex('#2563eb', format)).toBe(expected);
    });

    it.each([
      ['hex', '#2563eb80'],
      ['rgb', 'rgba(37, 99, 235, 0.5)'],
      ['hsl', 'hsla(221, 83%, 53%, 0.5)'],
    ] as const)('writes alpha as %s when alpha is on', (format, expected) => {
      expect(hex('rgba(37, 99, 235, 0.5)', format, true)).toBe(expected);
    });

    it('drops alpha when alpha is off', () => {
      expect(hex('rgba(37, 99, 235, 0.5)', 'rgb')).toBe('rgb(37, 99, 235)');
    });

    it('omits alpha for opaque colors even when alpha is on', () => {
      expect(hex('#2563eb', 'hex', true)).toBe('#2563eb');
    });

    it.each(['#ff000081', '#ff000001', '#ff0000fe'])('keeps the alpha byte of %s', value => {
      expect(hex(value, 'hex', true)).toBe(value);
    });
  });

  describe('oklch', () => {
    it.each([
      ['#ffffff', 'oklch(1 0 0)'],
      ['#000000', 'oklch(0 0 0)'],
      ['#808080', 'oklch(0.5999 0 0)'],
      ['#ff0000', 'oklch(0.628 0.25768 29.23)'],
      ['#00ff00', 'oklch(0.8664 0.29483 142.5)'],
      ['#0000ff', 'oklch(0.452 0.31321 264.05)'],
    ])('formats %s as %s', (input, expected) => {
      expect(hex(input, 'oklch')).toBe(expected);
    });

    it('writes alpha after a slash', () => {
      expect(hex('rgba(255, 0, 0, 0.5)', 'oklch', true)).toBe('oklch(0.628 0.25768 29.23 / 0.5)');
    });

    it.each(['#2563eb', '#0f172a', '#f59e0b', '#16a34a', '#db2777', '#663399', '#010203', '#fefefe'])(
      'round-trips %s',
      value => {
        expect(hex(hex(value, 'oklch'))).toBe(value);
      },
    );

    it.each([
      ['oklch(0.628 0.258 29.23)', '#ff0000'],
      ['oklch(62.8% 0.258 29.23deg)', '#ff0000'],
      ['OKLCH(0.628 64.5% 29.23)', '#ff0000'],
      ['oklch(0.6 none none)', '#808080'],
      ['oklch(1 0 0)', '#ffffff'],
    ])('parses %s', (input, expected) => {
      expect(hex(input)).toBe(expected);
    });

    it.each([
      ['oklch(0.628 0.258 29.23 / 50%)', 0.5],
      ['oklch(0.628 0.258 29.23 / 0.25)', 0.25],
    ])('reads the alpha of %s', (input, alpha) => {
      expect((parseColor(input) as ZardHsva).a).toBeCloseTo(alpha, 2);
    });

    it('brings colors outside sRGB into gamut by lowering chroma, keeping lightness and hue', () => {
      const color = parseColor('oklch(0.7 0.4 150)') as ZardHsva;
      const { r, g, b } = hsvaToRgba(color);

      for (const channel of [r, g, b]) {
        expect(channel).toBeGreaterThanOrEqual(0);
        expect(channel).toBeLessThanOrEqual(255);
      }
      const [, l, c, h] = /oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/.exec(formatColor(color, 'oklch')) as string[];
      // Clipping the last step may shift lightness and hue by up to a just-noticeable difference (0.02 in OKLab).
      expect(Math.abs(Number(l) - 0.7)).toBeLessThan(0.02);
      expect(Number(c)).toBeLessThan(0.4);
      expect(Math.abs(Number(h) - 150)).toBeLessThan(5);
    });

    it.each(['oklch(0.5, 0.1, 120)', 'oklch(0.5 0.1)', 'oklch(a b c)', 'oklch(0.5 0.1 120 0.5 1)'])(
      'returns null for %p',
      input => {
        expect(parseColor(input)).toBeNull();
      },
    );
  });

  it('toCssColor returns an rgba string', () => {
    expect(toCssColor(parseColor('#ff000080') as ZardHsva)).toBe('rgba(255, 0, 0, 0.502)');
  });
});
