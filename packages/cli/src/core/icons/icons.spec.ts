import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import * as path from 'node:path';

import {
  collectIcons,
  extractIcons,
  ICON_CORE_PACKAGE,
  ICON_MAP,
  iconPackagesFor,
  isIconFamily,
  missingTokensFor,
  retargetIcons,
  rewriteIcons,
  symbolFor,
  tokenFor,
  type IconCatalog,
} from './index.js';

describe('extractIcons', () => {
  it('reads the symbols imported from the family package', () => {
    const source = `import { lucideCheck, lucideX } from '@ng-icons/lucide';`;

    expect(extractIcons(source)).toEqual(['lucideCheck', 'lucideX']);
  });

  it('ignores @ng-icons/core, which is not a family', () => {
    const source = `
      import { NgIcon, provideIcons } from '@ng-icons/core';
      import { lucideCheck } from '@ng-icons/lucide';
    `;

    expect(extractIcons(source)).toEqual(['lucideCheck']);
  });

  it('reads imports broken across lines', () => {
    const source = `
      import {
        lucideChevronDown,
        lucideChevronUp,
      } from '@ng-icons/lucide';
    `;

    expect(extractIcons(source)).toEqual(['lucideChevronDown', 'lucideChevronUp']);
  });

  it('keeps the package symbol, not the local alias', () => {
    const source = `import { type IconName, lucideCheck as check } from '@ng-icons/lucide';`;

    expect(extractIcons(source)).toEqual(['IconName', 'lucideCheck']);
  });

  it('finds nothing in a component that draws no icons', () => {
    expect(extractIcons(`import { Component } from '@angular/core';`)).toEqual([]);
  });
});

describe('collectIcons', () => {
  it('merges the files of a component into one sorted, de-duplicated list', () => {
    const icons = collectIcons([
      `import { lucideX } from '@ng-icons/lucide';`,
      `import { lucideCheck, lucideX } from '@ng-icons/lucide';`,
    ]);

    expect(icons).toEqual({
      family: 'lucide',
      symbols: ['lucideCheck', 'lucideX'],
      tokens: ['check', 'x'],
      demos: { symbols: [], tokens: [] },
    });
  });

  it('keeps the demo icons in their own list', () => {
    const icons = collectIcons(
      [`import { lucideCheck } from '@ng-icons/lucide';`],
      [`import { lucidePlus } from '@ng-icons/lucide';`],
    );

    expect(icons.symbols).toEqual(['lucideCheck']);
    expect(icons.demos).toEqual({ symbols: ['lucidePlus'], tokens: ['plus'] });
  });

  /**
   * Half the components that use an icon only use it in the examples — the
   * registry has to say so, instead of publishing "no icons" about them.
   */
  it('maps a component that only draws icons in its demos', () => {
    const icons = collectIcons(
      [`import { Component } from '@angular/core';`],
      [`import { lucideBell } from '@ng-icons/lucide';`],
    );

    expect(icons.symbols).toEqual([]);
    expect(icons.demos.symbols).toEqual(['lucideBell']);
  });

  it('comes back filled in, with empty lists, for a component with no icons at all', () => {
    expect(collectIcons([`export const x = 1;`])).toEqual({
      family: 'lucide',
      symbols: [],
      tokens: [],
      demos: { symbols: [], tokens: [] },
    });
  });

  it('leaves out symbols that are not icons', () => {
    const icons = collectIcons([`import { type IconName, lucideCheck } from '@ng-icons/lucide';`]);

    expect(icons.tokens).toEqual(['check']);
  });
});

describe('the translation table', () => {
  it('resolves a symbol to its token and back', () => {
    expect(tokenFor('lucideChevronDown')).toBe('chevron-down');
    expect(symbolFor('chevron-down', 'lucide')).toBe('lucideChevronDown');
  });

  it('has a lucide symbol for every token', () => {
    expect(missingTokensFor('lucide')).toEqual([]);
  });

  it('separates the trailing digit, so clock and clock-2 are different rows', () => {
    expect(tokenFor('lucideClock')).toBe('clock');
    expect(tokenFor('lucideClock2')).toBe('clock-2');
  });

  it('does not know a symbol that no family declares', () => {
    expect(tokenFor('lucideNotAnIcon')).toBeUndefined();
  });
});

describe('iconPackagesFor', () => {
  it('pairs the core package with the family package', () => {
    expect(iconPackagesFor('lucide')).toEqual([ICON_CORE_PACKAGE, '@ng-icons/lucide']);
  });

  it('recognises the families it declares, and nothing else', () => {
    expect(isIconFamily('lucide')).toBe(true);
    expect(isIconFamily('material')).toBe(false);
  });
});

describe('retargetIcons', () => {
  it('leaves the source untouched when the family does not change', () => {
    const source = `import { lucideCheck } from '@ng-icons/lucide';`;

    expect(retargetIcons(source, 'lucide', 'lucide')).toEqual({ content: source, missing: [] });
  });

  /**
   * The dress rehearsal for a second family: a catalog with the column filled in
   * is all that separates today's state from supporting material — no other file
   * on the install path has to change, and this is what proves that claim.
   */
  describe('with a second family in the catalogue', () => {
    const catalog: IconCatalog = {
      families: {
        lucide: { value: 'lucide', label: 'Lucide', package: '@ng-icons/lucide', prefix: 'lucide' },
        material: { value: 'material', label: 'Material', package: '@ng-icons/material-icons', prefix: 'mat' },
      },
      icons: {
        check: { lucide: 'lucideCheck', material: 'matCheck' },
        'chevron-down': { lucide: 'lucideChevronDown', material: 'matExpandMore' },
        'circle-small': { lucide: 'lucideCircleSmall' },
      },
    };

    it('rewrites the package and every symbol of a real component', () => {
      const source = [
        `import { NgIcon, provideIcons } from '@ng-icons/core';`,
        `import { lucideCheck, lucideChevronDown } from '@ng-icons/lucide';`,
        `  providers: [provideIcons({ lucideCheck, lucideChevronDown })],`,
        `  template: '<ng-icon name="lucideChevronDown" />',`,
      ].join('\n');

      const result = retargetIcons(source, 'lucide', 'material', catalog);

      expect(result.content).toBe(
        [
          `import { NgIcon, provideIcons } from '@ng-icons/core';`,
          `import { matCheck, matExpandMore } from '@ng-icons/material-icons';`,
          `  providers: [provideIcons({ matCheck, matExpandMore })],`,
          `  template: '<ng-icon name="matExpandMore" />',`,
        ].join('\n'),
      );
      expect(result.missing).toEqual([]);
    });

    it('reports the icons the target family does not have, instead of inventing them', () => {
      const source = `import { lucideCheck, lucideCircleSmall } from '@ng-icons/lucide';`;

      const result = retargetIcons(source, 'lucide', 'material', catalog);

      expect(result.missing).toEqual(['lucideCircleSmall']);
      // O que dava para traduzir foi traduzido; o resto ficou como estava.
      expect(result.content).toContain('matCheck');
      expect(result.content).toContain('lucideCircleSmall');
    });

    it('resolves the packages to install from the chosen family', () => {
      expect(iconPackagesFor('material', catalog)).toEqual([ICON_CORE_PACKAGE, '@ng-icons/material-icons']);
    });

    it('reads a source written in the second family', () => {
      expect(extractIcons(`import { matCheck } from '@ng-icons/material-icons';`, 'material', catalog)).toEqual([
        'matCheck',
      ]);
    });

    it('knows which icons the second family still lacks', () => {
      expect(missingTokensFor('material', catalog)).toEqual(['circle-small']);
    });
  });
});

describe('rewriteIcons', () => {
  const replacements = new Map([
    ['lucideCheck', 'matCheck'],
    ['lucideClock', 'matClock'],
    ['lucideClock2', 'matClock2'],
  ]);

  const rewrite = (source: string): string =>
    rewriteIcons(source, '@ng-icons/lucide', '@ng-icons/material', replacements);

  it('rewrites the package the symbols come from', () => {
    expect(rewrite(`import { lucideCheck } from '@ng-icons/lucide';`)).toBe(
      `import { matCheck } from '@ng-icons/material';`,
    );
  });

  it('rewrites the symbol wherever it appears — import, provider and template', () => {
    const source = [
      `import { lucideCheck } from '@ng-icons/lucide';`,
      `providers: [provideIcons({ lucideCheck })],`,
      `template: '<ng-icon name="lucideCheck" />',`,
    ].join('\n');

    expect(rewrite(source)).toBe(
      [
        `import { matCheck } from '@ng-icons/material';`,
        `providers: [provideIcons({ matCheck })],`,
        `template: '<ng-icon name="matCheck" />',`,
      ].join('\n'),
    );
  });

  it('does not rewrite a symbol that is the prefix of another', () => {
    expect(rewrite(`import { lucideClock2 } from '@ng-icons/lucide';`)).toBe(
      `import { matClock2 } from '@ng-icons/material';`,
    );
  });

  it('leaves @ng-icons/core alone', () => {
    const source = `import { NgIcon } from '@ng-icons/core';`;

    expect(rewrite(source)).toBe(source);
  });

  it('leaves a symbol it was not told to replace as it is', () => {
    expect(rewrite(`import { lucideCheck, lucideX } from '@ng-icons/lucide';`)).toBe(
      `import { matCheck, lucideX } from '@ng-icons/material';`,
    );
  });
});

/**
 * The table exists to translate the icons the library uses. A new icon in
 * `libs/zard` with no matching row would go unnoticed until someone switched
 * family and found that component left behind — this is the test that warns
 * first.
 *
 * It runs from the repository; in the published package, where `libs/zard` does
 * not exist, there is nothing to compare against.
 */
describe('coverage of the icons the library actually uses', () => {
  const LIB = path.resolve(__dirname, '../../../../../libs/zard/src/lib/shared');
  const available = existsSync(LIB);

  function sourceFiles(dir: string): string[] {
    return readdirSync(dir).flatMap(entry => {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) return sourceFiles(full);
      return full.endsWith('.ts') ? [full] : [];
    });
  }

  (available ? it : it.skip)('has a row for every icon a component or demo imports', () => {
    const used = new Set<string>();

    for (const file of sourceFiles(LIB)) {
      for (const symbol of extractIcons(readFileSync(file, 'utf8'))) {
        // The family package also exports types; only the icons matter here.
        if (symbol.startsWith('lucide')) used.add(symbol);
      }
    }

    expect(used.size).toBeGreaterThan(0);
    expect([...used].filter(symbol => tokenFor(symbol) === undefined).sort()).toEqual([]);
  });

  (available ? it : it.skip)('has no rows left over from an icon that is no longer used', () => {
    const used = new Set(sourceFiles(LIB).flatMap(file => extractIcons(readFileSync(file, 'utf8'))));

    const orphans = Object.entries(ICON_MAP)
      .filter(([, byFamily]) => !used.has(byFamily.lucide))
      .map(([token]) => token);

    expect(orphans).toEqual([]);
  });
});
