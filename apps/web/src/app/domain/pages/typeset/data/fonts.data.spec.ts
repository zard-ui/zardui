import { findFont, MONO_FONTS, TEXT_FONTS, TYPESET_FONTS } from './fonts.data';

describe('the typeset font catalog', () => {
  it('gives every font a unique id', () => {
    const ids = TYPESET_FONTS.map(font => font.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every font a unique css variable', () => {
    const variables = TYPESET_FONTS.map(font => font.cssVariable);

    expect(new Set(variables).size).toBe(variables.length);
  });

  it('names a self-hosted package for every font', () => {
    for (const font of TYPESET_FONTS) {
      expect(font.dependency).toMatch(/^@fontsource(-variable)?\//);
    }
  });

  it('ends every family on the generic that matches its slot', () => {
    const generic = { sans: 'sans-serif', serif: 'serif', mono: 'monospace' } as const;

    for (const font of TYPESET_FONTS) {
      const last = font.family.split(',').pop()?.trim();
      expect(last).toBe(generic[font.type]);
    }
  });

  // Display faces read badly at body size; the builder must not offer them for
  // body text, and a catalog that includes them produces bad presets by accident.
  it.each(['playfair-display', 'eb-garamond', 'instrument-serif'])('leaves out the display face %s', id => {
    expect(TYPESET_FONTS.find(font => font.id === id)).toBeUndefined();
  });

  describe('findFont', () => {
    it('finds a font by id', () => {
      expect(findFont('lora')?.label).toBe('Lora');
    });

    it('returns undefined for an unknown id', () => {
      expect(findFont('comic-sans')).toBeUndefined();
    });

    it('returns undefined for an empty id', () => {
      expect(findFont(null)).toBeUndefined();
      expect(findFont(undefined)).toBeUndefined();
      expect(findFont('')).toBeUndefined();
    });
  });

  describe('the picker lists', () => {
    it('offers only mono faces for code', () => {
      expect(MONO_FONTS.length).toBeGreaterThan(0);

      for (const font of MONO_FONTS) {
        expect(font.type).toBe('mono');
      }
    });

    it('never offers a mono face for body or heading text', () => {
      for (const font of TEXT_FONTS) {
        expect(font.type).not.toBe('mono');
      }
    });

    it('covers the whole catalog between them', () => {
      expect(TEXT_FONTS.length + MONO_FONTS.length).toBe(TYPESET_FONTS.length);
    });
  });
});
