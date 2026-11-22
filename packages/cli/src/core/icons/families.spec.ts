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
  KNOWN_ICON_GAPS,
  extractIcons,
  iconPackagesFor,
  importSpecifier,
  missingTokensFor,
  retargetFiles,
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
    expect(missingTokensFor(family).sort()).toEqual(KNOWN_ICON_GAPS[family]);
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

/**
 * A block is several files: the component imports and provides its icons, but the template (.html) and
 * the data (strings in another .ts) only name them. Deciding per file left those names in lucide, and
 * the `<ng-icon>` rendered nothing — sidebar-07 in HugeIcons logged 19 "No icon named …" warnings.
 */
describe('retargetFiles', () => {
  const COMPONENT = [
    `import { NgIcon, provideIcons } from '@ng-icons/core';`,
    `import { lucideBot, lucideChevronRight } from '@ng-icons/lucide';`,
    `@Component({ templateUrl: './nav.component.html', viewProviders: [provideIcons({ lucideBot, lucideChevronRight })] })`,
  ].join('\n');
  const TEMPLATE = `<ng-icon name="lucideChevronRight" /><ng-icon [name]="item.icon" /><ng-icon name='lucideBot' />`;
  const DATA = `export const NAV = [{ title: 'Playground', icon: 'lucideBot' }, { title: 'Docs', icon: "lucideChevronRight" }];`;

  const files = [
    { name: 'nav.component.ts', content: COMPONENT },
    { name: 'nav.component.html', content: TEMPLATE },
    { name: 'nav.data.ts', content: DATA },
  ];

  it.each([
    ['tabler', 'tablerRobot', 'tablerChevronRight'],
    ['hugeicons', 'hugeBot', 'hugeArrowRight01'],
    ['phosphor', 'phosphorRobot', 'phosphorCaretRight'],
    ['remixicon', 'remixRobot2Line', 'remixArrowRightSLine'],
  ])('follows the icons of the component into the template and the data for %s', (family, bot, chevron) => {
    const [component, template, data] = retargetFiles(files, 'lucide', family);

    expect(template?.content).toBe(
      `<ng-icon name="${chevron}" /><ng-icon [name]="item.icon" /><ng-icon name='${bot}' />`,
    );
    expect(data?.content).toBe(
      `export const NAV = [{ title: 'Playground', icon: '${bot}' }, { title: 'Docs', icon: "${chevron}" }];`,
    );
    expect(component?.content).toContain(`provideIcons({ ${bot}, ${chevron} })`);
    expect(component?.content).not.toContain('lucide');
    for (const file of [component, template, data]) expect(file?.missing).toEqual([]);
  });

  it('retargets a name that appears only in a template or in data, without any import', () => {
    const [template, data] = retargetFiles(
      [
        { name: 'a.html', content: `<ng-icon name="lucideCheck" />` },
        { name: 'a.data.ts', content: `export const ICON = 'lucideCheck';` },
      ],
      'lucide',
      'tabler',
    );

    expect(template?.content).toBe(`<ng-icon name="tablerCheck" />`);
    expect(data?.content).toBe(`export const ICON = 'tablerCheck';`);
  });

  it('does not touch words that only start like an icon prefix of another package', () => {
    const [file] = retargetFiles(
      [{ name: 'a.ts', content: `import { LucideAngularModule } from 'lucide-angular'; const lucide = 1;` }],
      'lucide',
      'tabler',
    );

    expect(file?.content).toContain('LucideAngularModule');
    expect(file?.content).toContain('const lucide = 1');
    expect(file?.missing).toEqual([]);
  });

  describe('an icon the family does not have', () => {
    const gapFiles = [
      {
        name: 'team.component.ts',
        content: `import { lucideCheck, lucideWaves } from '@ng-icons/lucide';\nprovideIcons({ lucideCheck, lucideWaves });`,
      },
      { name: 'team.component.html', content: `<ng-icon name="lucideCheck" /><ng-icon name="lucideWaves" />` },
      { name: 'team.data.ts', content: `export const T = [{ logo: 'lucideWaves' }];` },
    ];

    it('keeps its name in every file, so import, provider, template and data stay consistent', () => {
      const [component, template, data] = retargetFiles(gapFiles, 'lucide', 'hugeicons');

      expect(component?.content).toBe(
        `import { hugeTick02 } from '@ng-icons/huge-icons';\nimport { lucideWaves } from '@ng-icons/lucide';\nprovideIcons({ hugeTick02, lucideWaves });`,
      );
      expect(template?.content).toBe(`<ng-icon name="hugeTick02" /><ng-icon name="lucideWaves" />`);
      expect(data?.content).toBe(`export const T = [{ logo: 'lucideWaves' }];`);
    });

    it('reports the gap against each file that mentions it', () => {
      const result = retargetFiles(gapFiles, 'lucide', 'hugeicons');

      expect(result.map(file => [file.name, file.missing])).toEqual([
        ['team.component.ts', ['lucideWaves']],
        ['team.component.html', ['lucideWaves']],
        ['team.data.ts', ['lucideWaves']],
      ]);
    });

    it('reports a lucide-looking name that no family knows instead of silently leaving it', () => {
      const [file] = retargetFiles(
        [{ name: 'x.html', content: `<ng-icon name="lucideNotAnIcon" />` }],
        'lucide',
        'tabler',
      );

      expect(file?.missing).toEqual(['lucideNotAnIcon']);
      expect(file?.content).toBe(`<ng-icon name="lucideNotAnIcon" />`);
    });
  });

  it('returns the files untouched when the family does not change', () => {
    expect(retargetFiles(files, 'lucide', 'lucide')).toEqual(files.map(file => ({ ...file, missing: [] })));
  });
});

/**
 * `trash` and `trash-2` are different lucide icons that Tabler draws with one: after the swap the
 * import and `provideIcons` would name `tablerTrash` twice, which does not compile (sidebar-10).
 */
describe('two icons that collapse into one in the target family', () => {
  const SOURCE = [
    `import { lucideTrash, lucideTrash2, lucideX } from '@ng-icons/lucide';`,
    `import {`,
    `  lucideTrash,`,
    `  lucideTrash2,`,
    `} from '@ng-icons/lucide';`,
    `viewProviders: [provideIcons({ lucideTrash, lucideTrash2, lucideX })],`,
    `viewProviders: [provideIcons({`,
    `  lucideTrash,`,
    `  lucideTrash2,`,
    `})],`,
  ].join('\n');

  it('names the shared symbol once in the import and in provideIcons', () => {
    expect(symbolFor('trash', 'tabler')).toBe(symbolFor('trash-2', 'tabler'));

    const { content, missing } = retargetIcons(SOURCE, 'lucide', 'tabler');

    expect(missing).toEqual([]);
    expect(content).toContain(`import { tablerTrash, tablerX } from '@ng-icons/tabler-icons';`);
    expect(content).toContain(`provideIcons({ tablerTrash, tablerX })`);
    expect(content.match(/tablerTrash/g)).toHaveLength(4);
    expect(content).toContain(`import {\n  tablerTrash,\n} from '@ng-icons/tabler-icons';`);
    expect(content).toContain(`provideIcons({\n  tablerTrash,\n})`);
  });

  it('does the same across the files of a block', () => {
    const [component, template] = retargetFiles(
      [
        { name: 'a.ts', content: `import { lucideTrash, lucideTrash2 } from '@ng-icons/lucide';` },
        { name: 'a.html', content: `<ng-icon name="lucideTrash" /><ng-icon name="lucideTrash2" />` },
      ],
      'lucide',
      'tabler',
    );

    expect(component?.content).toBe(`import { tablerTrash } from '@ng-icons/tabler-icons';`);
    expect(template?.content).toBe(`<ng-icon name="tablerTrash" /><ng-icon name="tablerTrash" />`);
  });
});
