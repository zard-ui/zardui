import {
  formatColor,
  hsvaToRgba,
  isSameColor,
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

    it('falls back to the resolver for input it cannot parse', () => {
      const resolve = jest.fn((value: string) => (value === 'rebeccapurple' ? '#663399' : null));

      expect(parseColor('rebeccapurple')).toBeNull();
      expect(formatColor(parseColor('rebeccapurple', resolve) as ZardHsva, 'hex')).toBe('#663399');
      expect(parseColor('nope', resolve)).toBeNull();
      expect(resolve).toHaveBeenCalledWith('nope');
    });

    it('does not call the resolver for input it already understands', () => {
      const resolve = jest.fn(() => null);
      parseColor('#fff', resolve);
      expect(resolve).not.toHaveBeenCalled();
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
  });

  it('toCssColor returns an rgba string', () => {
    expect(toCssColor(parseColor('#ff000080') as ZardHsva)).toBe('rgba(255, 0, 0, 0.502)');
  });

  it('isSameColor compares the rendered 8-bit color', () => {
    expect(isSameColor(parseColor('#ff0000') as ZardHsva, parseColor('rgb(255, 0, 0)') as ZardHsva)).toBe(true);
    expect(isSameColor(parseColor('#ff0000') as ZardHsva, parseColor('#fe0000') as ZardHsva)).toBe(false);
  });
});
