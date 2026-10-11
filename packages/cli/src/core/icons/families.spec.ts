/**
 * The four families a project can pick besides lucide: tabler, hugeicons, phosphor, remixicon.
 *
 * The translation table is only worth anything if every symbol in it is a real export of the
 * package it names — one typo and `zard-cli add` writes an import that does not compile. So the
 * symbols are checked against the type declarations of the installed `@ng-icons/*` packages.
 */
import { existsSync, readFileSync } from 'node:fs';
import * as path from 'node:path';

import {
  ICON_FAMILIES,
  ICON_MAP,
  extractIcons,
  iconPackagesFor,
  importSpecifier,
  missingTokensFor,
  retargetIcons,
  symbolFor,
  tokenFor,
} from './index.js';

const NODE_MODULES = path.resolve(__dirname, '../../../../../node_modules/@ng-icons');

/** Where each family's symbols are declared, relative to `node_modules/@ng-icons`. */
const DECLARATIONS: Record<string, string> = {
  lucide: 'lucide/types/ng-icons-lucide.d.ts',
  tabler: 'tabler-icons/types/ng-icons-tabler-icons.d.ts',
  hugeicons: 'huge-icons/types/ng-icons-huge-icons.d.ts',
  // The root of the phosphor package exports nothing: every weight is a subpath.
  phosphor: 'phosphor-icons/types/ng-icons-phosphor-icons-regular.d.ts',
  remixicon: 'remixicon/types/ng-icons-remixicon.d.ts',
};

function exportsOf(family: string): Set<string> | null {
  const file = path.join(NODE_MODULES, DECLARATIONS[family] ?? '');
  if (!existsSync(file)) return null;

  return new Set(
    [...readFileSync(file, 'utf8').matchAll(/declare const ([A-Za-z0-9_]+)/g)].map(match => match[1] ?? ''),
  );
}

/** Tokens a family has no equivalent for — reported by `retargetIcons`, never invented. */
const KNOWN_GAPS: Record<string, string[]> = {
  lucide: [],
  tabler: [],
  hugeicons: ['footprints', 'frame', 'shield-alert', 'waves'],
  phosphor: [],
  remixicon: [],
};

describe('the declared families', () => {
  it('declares the five families the design system offers', () => {
    expect(Object.keys(ICON_FAMILIES).sort()).toEqual(['hugeicons', 'lucide', 'phosphor', 'remixicon', 'tabler']);
  });

  it('installs the package of the chosen family next to ng-icons core', () => {
    expect(iconPackagesFor('tabler')).toEqual(['@ng-icons/core', '@ng-icons/tabler-icons']);
    expect(iconPackagesFor('hugeicons')).toEqual(['@ng-icons/core', '@ng-icons/huge-icons']);
    expect(iconPackagesFor('remixicon')).toEqual(['@ng-icons/core', '@ng-icons/remixicon']);
  });

  it('imports phosphor from its regular-weight subpath but installs the package', () => {
    expect(importSpecifier(ICON_FAMILIES['phosphor']!)).toBe('@ng-icons/phosphor-icons/regular');
    expect(iconPackagesFor('phosphor')).toEqual(['@ng-icons/core', '@ng-icons/phosphor-icons']);
  });
});

describe.each(Object.keys(DECLARATIONS))('the %s column', family => {
  const declared = exportsOf(family);
  const prefix = ICON_FAMILIES[family]!.prefix;

  (declared ? it : it.skip)('only names symbols the installed package exports', () => {
    const unknown = Object.entries(ICON_MAP)
      .map(([token, row]) => [token, row[family]] as const)
      .filter(([, symbol]) => symbol !== undefined && !declared!.has(symbol))
      .map(([token, symbol]) => `${token} -> ${symbol}`);

    expect(unknown).toEqual([]);
  });

  it('uses the prefix of the family for every symbol', () => {
    const wrong = Object.values(ICON_MAP)
      .map(row => row[family])
      .filter((symbol): symbol is string => symbol !== undefined && !symbol.startsWith(prefix));

    expect(wrong).toEqual([]);
  });

  it('has an equivalent for every token except the documented gaps', () => {
    expect(missingTokensFor(family).sort()).toEqual(KNOWN_GAPS[family]);
  });
});

describe('retargeting to the new families', () => {
  const SOURCE = [
    `import { NgIcon, provideIcons } from '@ng-icons/core';`,
    `import { lucideCheck, lucideChevronDown } from '@ng-icons/lucide';`,
    `  providers: [provideIcons({ lucideCheck, lucideChevronDown })],`,
    `  template: '<ng-icon name="lucideChevronDown" />',`,
  ].join('\n');

  it.each([
    ['tabler', '@ng-icons/tabler-icons', 'tablerCheck', 'tablerChevronDown'],
    ['hugeicons', '@ng-icons/huge-icons', 'hugeTick02', 'hugeArrowDown01'],
    ['phosphor', '@ng-icons/phosphor-icons/regular', 'phosphorCheck', 'phosphorCaretDown'],
    ['remixicon', '@ng-icons/remixicon', 'remixCheckLine', 'remixArrowDownSLine'],
  ])('rewrites the package and the symbols for %s', (family, specifier, check, chevron) => {
    const result = retargetIcons(SOURCE, 'lucide', family);

    expect(result.missing).toEqual([]);
    expect(result.content).toBe(
      [
        `import { NgIcon, provideIcons } from '@ng-icons/core';`,
        `import { ${check}, ${chevron} } from '${specifier}';`,
        `  providers: [provideIcons({ ${check}, ${chevron} })],`,
        `  template: '<ng-icon name="${chevron}" />',`,
      ].join('\n'),
    );
  });

  it('reads its own output back, subpath included', () => {
    const phosphor = retargetIcons(SOURCE, 'lucide', 'phosphor').content;

    expect(extractIcons(phosphor, 'phosphor')).toEqual(['phosphorCaretDown', 'phosphorCheck']);
    expect(tokenFor('phosphorCaretDown', 'phosphor')).toBe('chevron-down');
    expect(symbolFor('chevron-down', 'phosphor')).toBe('phosphorCaretDown');
  });

  describe('an icon the family does not have', () => {
    const WITH_GAP = `import { lucideCheck, lucideWaves } from '@ng-icons/lucide';`;

    it('reports it and leaves its import on the original package so the file still compiles', () => {
      const result = retargetIcons(WITH_GAP, 'lucide', 'hugeicons');

      expect(result.missing).toEqual(['lucideWaves']);
      expect(result.content).toBe(
        `import { hugeTick02 } from '@ng-icons/huge-icons';\nimport { lucideWaves } from '@ng-icons/lucide';`,
      );
    });

    it('keeps an import made only of missing icons exactly as it was', () => {
      const source = `import { lucideWaves } from '@ng-icons/lucide';`;

      expect(retargetIcons(source, 'lucide', 'hugeicons').content).toBe(source);
    });

    it('keeps the type and the quote style of the original import', () => {
      const source = `import type { lucideCheck, lucideWaves } from "@ng-icons/lucide";`;

      expect(retargetIcons(source, 'lucide', 'hugeicons').content).toBe(
        `import type { hugeTick02 } from "@ng-icons/huge-icons";\nimport type { lucideWaves } from "@ng-icons/lucide";`,
      );
    });
  });
});
