import {
  DEFAULT_STYLE,
  extractMarkers,
  isStyleId,
  isStyleSelection,
  LEGACY_STYLE,
  parseStyleSheet,
  resolveStyle,
  STYLE_IDS,
  transformStyle,
  transformStyleReport,
  type StyleCatalog,
} from './index.js';

const catalog: StyleCatalog = {
  nova: {
    'cn-box': 'h-8 rounded-lg px-2.5',
    'cn-box-size-sm': "h-7 [&_svg:not([class*='size-'])]:size-3.5",
    'cn-note': 'text-sm',
    'cn-quiet': '',
  },
  lyra: {
    'cn-box': 'h-8 rounded-none px-2.5 text-xs',
    'cn-box-size-sm': 'h-6',
  },
};

describe('style ids', () => {
  it('knows the eight styles, nova being the default', () => {
    expect([...STYLE_IDS]).toEqual(['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea']);
    expect(DEFAULT_STYLE).toBe('nova');
  });

  it('treats the legacy css value as the default look', () => {
    expect(resolveStyle(LEGACY_STYLE)).toBe('nova');
    expect(resolveStyle('sera')).toBe('sera');
  });

  it('accepts a style, or css, and nothing else', () => {
    expect(isStyleId('lyra')).toBe(true);
    expect(isStyleId('css')).toBe(false);
    expect(isStyleSelection('css')).toBe(true);
    expect(isStyleSelection('lyra')).toBe(true);
    expect(isStyleSelection('new-york')).toBe(false);
    expect(isStyleSelection(undefined)).toBe(false);
  });
});

describe('parseStyleSheet', () => {
  it('reads one marker per rule, inside the style wrapper or not', () => {
    const css = `
      /* MARK: Box */
      .style-lyra {
        .cn-box { @apply h-8 rounded-none; }

        .cn-box-size-sm {
          @apply h-6
            px-2;
        }
      }
      .cn-note:not(:where(.style-lyra) *) { @apply text-sm; }
    `;

    expect(parseStyleSheet(css)).toEqual({
      'cn-box': 'h-8 rounded-none',
      'cn-box-size-sm': 'h-6 px-2',
      'cn-note': 'text-sm',
    });
  });

  it('keeps a rule with nothing in it as a marker the style has no classes for', () => {
    expect(parseStyleSheet('.style-lyra { .cn-quiet { /* none here */ } .cn-loud { @apply p-2; } }')).toEqual({
      'cn-quiet': '',
      'cn-loud': 'p-2',
    });
  });

  it('ignores rules that are not markers', () => {
    expect(parseStyleSheet('.style-nova { color: red; } .other { @apply p-2; }')).toEqual({});
  });

  it('does not read a marker out of a comment', () => {
    expect(parseStyleSheet('/* .cn-ghost { @apply p-2; } */')).toEqual({});
  });
});

describe('transformStyle', () => {
  it('replaces each marker with the style classes, in place', () => {
    const source = `const v = cva('cn-box inline-flex', { variants: { size: { sm: 'cn-box-size-sm' } } });`;

    expect(transformStyle(source, 'nova', catalog)).toBe(
      "const v = cva('h-8 rounded-lg px-2.5 inline-flex', { variants: { size: { sm: 'h-7 [&_svg:not([class*=\\'size-\\'])]:size-3.5' } } });",
    );
  });

  it('gives each style its own classes', () => {
    const source = "const c = 'cn-box flex';";

    expect(transformStyle(source, 'nova', catalog)).toBe("const c = 'h-8 rounded-lg px-2.5 flex';");
    expect(transformStyle(source, 'lyra', catalog)).toBe("const c = 'h-8 rounded-none px-2.5 text-xs flex';");
  });

  it('treats css as nova', () => {
    const source = "const c = 'cn-box';";

    expect(transformStyle(source, 'css', catalog)).toBe(transformStyle(source, 'nova', catalog));
  });

  it('escapes the quote of the literal the classes land in', () => {
    const single = transformStyle("const c = 'cn-box-size-sm';", 'nova', catalog);
    const double = transformStyle('const c = "cn-box-size-sm";', 'nova', catalog);
    const template = transformStyle('const c = `cn-box-size-sm`;', 'nova', catalog);

    expect(single).toBe("const c = 'h-7 [&_svg:not([class*=\\'size-\\'])]:size-3.5';");
    expect(double).toBe(`const c = "h-7 [&_svg:not([class*='size-'])]:size-3.5";`);
    expect(template).toBe("const c = `h-7 [&_svg:not([class*='size-'])]:size-3.5`;");
  });

  it('leaves comments and code alone', () => {
    const source = ["// don't touch cn-box here", '/* cn-box */', "const cnBox = 'x';", "const c = 'cn-box';"].join(
      '\n',
    );

    expect(transformStyle(source, 'nova', catalog)).toBe(
      ["// don't touch cn-box here", '/* cn-box */', "const cnBox = 'x';", "const c = 'h-8 rounded-lg px-2.5';"].join(
        '\n',
      ),
    );
  });

  it('reaches markers inside a template literal and its expressions', () => {
    const source = "const t = `<div class=\"cn-box ${flag ? 'cn-note' : ''}\">x</div>`;";

    expect(transformStyle(source, 'nova', catalog)).toBe(
      "const t = `<div class=\"h-8 rounded-lg px-2.5 ${flag ? 'text-sm' : ''}\">x</div>`;",
    );
  });

  it('only matches whole markers', () => {
    const source = "const c = 'xcn-box cn-boxes cn-box-size cn-box';";
    const result = transformStyleReport(source, 'nova', catalog);

    expect(result.content).toBe("const c = 'xcn-box cn-boxes cn-box-size h-8 rounded-lg px-2.5';");
    expect(result.unknown).toEqual(['cn-box-size', 'cn-boxes']);
  });

  it('drops a marker the style does not define, with the space around it', () => {
    expect(transformStyle("const c = 'a cn-box-size-sm b';", 'lyra', catalog)).toBe("const c = 'a h-6 b';");
    expect(transformStyle("const c = 'a cn-note b';", 'lyra', catalog)).toBe("const c = 'a b';");
    expect(transformStyle("const c = 'cn-note b';", 'lyra', catalog)).toBe("const c = 'b';");
    expect(transformStyle("const c = 'a cn-quiet';", 'nova', catalog)).toBe("const c = 'a';");
    expect(transformStyle("const c = 'cn-quiet';", 'nova', catalog)).toBe("const c = '';");
  });

  it('is the identity on a source without markers', () => {
    const source = "const c = cva('inline-flex h-8 rounded-lg', {});\n";

    expect(transformStyle(source, 'sera', catalog)).toBe(source);
  });

  it('is idempotent', () => {
    const once = transformStyle("const c = 'cn-box';", 'lyra', catalog);

    expect(transformStyle(once, 'lyra', catalog)).toBe(once);
  });
});

describe('extractMarkers', () => {
  it('lists the markers of the string literals, once each', () => {
    expect(extractMarkers('// cn-ghost\nconst a = \'cn-box cn-note\'; const b = "cn-box";')).toEqual([
      'cn-box',
      'cn-note',
    ]);
  });
});
