/**
 * Ícones — o que os componentes desenham e como isso muda de família.
 *
 * Tudo aqui opera sobre um catálogo: o par (famílias declaradas, tabela de
 * tradução). O catálogo local é a cópia embutida; o que vale em execução vem de
 * `<registry>/icons.json`. É essa indireção que faz "suportar material" ser
 * publicar uma coluna nova no registry, sem release da CLI e sem caçar `lucide`
 * pelo código.
 *
 *   `extractIcons`    lê de um fonte quais ícones ele usa (o registry publica isso)
 *   `retargetIcons`   reescreve um fonte de uma família para outra (a instalação usa)
 *   `iconPackagesFor` diz que pacotes o projeto precisa ter (o init usa)
 */

import {
  ICON_CORE_PACKAGE,
  ICON_FAMILIES,
  SOURCE_ICON_FAMILY,
  type IconFamily,
  type IconFamilyInfo,
} from './families.js';
import { ICON_MAP } from './icon-map.js';

export {
  ICON_CORE_PACKAGE,
  ICON_FAMILIES,
  SOURCE_ICON_FAMILY,
  type IconFamily,
  type IconFamilyInfo,
} from './families.js';
export { ICON_MAP } from './icon-map.js';

/** Um ícone pelo que ele significa: `check`, `chevron-down`. */
export type IconToken = string;

/**
 * As famílias declaradas e a tabela que traduz entre elas.
 *
 * `icons` é indexado por token e depois por família — a mesma forma do
 * `icon-map.ts`, que é a cópia local deste mesmo dado.
 */
export interface IconCatalog {
  readonly families: Readonly<Record<string, IconFamilyInfo>>;
  readonly icons: Readonly<Record<string, Readonly<Record<string, string>>>>;
}

/** O catálogo embutido na CLI — vale quando o registry não responde. */
export const LOCAL_ICON_CATALOG: IconCatalog = { families: ICON_FAMILIES, icons: ICON_MAP };

/** Uma lista de ícones nas duas formas: como o código os escreve e como a tabela os chama. */
export interface IconList {
  /** Os símbolos como aparecem no código (`lucideCheck`). */
  readonly symbols: string[];
  /** Os mesmos ícones pela chave neutra da tabela (`check`). */
  readonly tokens: IconToken[];
}

/**
 * Os ícones de um componente, do jeito que o registry os publica.
 *
 * As duas listas são separadas porque servem a coisas diferentes: `symbols` e
 * `tokens` são o que o `add` grava no projeto — é deles que sai a dependência
 * do ng-icons —, enquanto `demos` são os ícones que só aparecem nos exemplos da
 * documentação. Um componente pode não desenhar ícone nenhum e ainda assim ter
 * demos cheios deles, e trocar de família precisa alcançar os dois.
 */
export interface ComponentIcons extends IconList {
  /** A família em que os arquivos publicados estão escritos. */
  readonly family: IconFamily;
  readonly demos: IconList;
}

/**
 * Índice reverso símbolo → token, montado por catálogo e memorizado.
 *
 * O catálogo remoto é um objeto só, buscado uma vez por execução, então a chave
 * fraca basta e o índice não é remontado a cada arquivo instalado.
 */
const reverseIndexes = new WeakMap<IconCatalog, Map<string, Map<string, IconToken>>>();

function reverseIndex(catalog: IconCatalog, family: IconFamily): Map<string, IconToken> {
  let byFamily = reverseIndexes.get(catalog);

  if (!byFamily) {
    byFamily = new Map();

    for (const [token, symbols] of Object.entries(catalog.icons)) {
      for (const [name, symbol] of Object.entries(symbols)) {
        const index = byFamily.get(name) ?? new Map<string, IconToken>();
        index.set(symbol, token);
        byFamily.set(name, index);
      }
    }

    reverseIndexes.set(catalog, byFamily);
  }

  return byFamily.get(family) ?? new Map();
}

export function iconFamilies(catalog: IconCatalog = LOCAL_ICON_CATALOG): string[] {
  return Object.keys(catalog.families).sort();
}

export function isIconFamily(value: string, catalog: IconCatalog = LOCAL_ICON_CATALOG): boolean {
  return Object.prototype.hasOwnProperty.call(catalog.families, value);
}

export function iconFamily(family: IconFamily, catalog: IconCatalog = LOCAL_ICON_CATALOG): IconFamilyInfo | undefined {
  return catalog.families[family];
}

/** Os pacotes npm que um projeto configurado com essa família precisa ter. */
export function iconPackagesFor(family: IconFamily, catalog: IconCatalog = LOCAL_ICON_CATALOG): string[] {
  const info = iconFamily(family, catalog);
  return info ? [ICON_CORE_PACKAGE, info.package] : [ICON_CORE_PACKAGE];
}

export function tokenFor(
  symbol: string,
  family: IconFamily = SOURCE_ICON_FAMILY,
  catalog: IconCatalog = LOCAL_ICON_CATALOG,
): IconToken | undefined {
  return reverseIndex(catalog, family).get(symbol);
}

export function symbolFor(
  token: IconToken,
  family: IconFamily,
  catalog: IconCatalog = LOCAL_ICON_CATALOG,
): string | undefined {
  return catalog.icons[token]?.[family];
}

/** Os tokens que ainda não têm símbolo declarado nessa família. */
export function missingTokensFor(family: IconFamily, catalog: IconCatalog = LOCAL_ICON_CATALOG): IconToken[] {
  return Object.keys(catalog.icons).filter(token => symbolFor(token, family, catalog) === undefined);
}

/**
 * `import { lucideCheck, lucideX } from '@ng-icons/lucide'` — em uma linha ou em
 * várias, com `type` na frente ou apelidado. O que interessa é o pacote (que dá
 * a família) e os nomes importados dele.
 */
const ICON_IMPORT = /import\s*(?:type\s+)?\{([^}]*)\}\s*from\s*['"]@ng-icons\/([a-z0-9-]+)['"]/g;

function familyByPackageSuffix(suffix: string, catalog: IconCatalog): IconFamily | undefined {
  return Object.keys(catalog.families).find(name => catalog.families[name]?.package === `@ng-icons/${suffix}`);
}

/**
 * Os símbolos de ícone que um fonte importa.
 *
 * Só o import conta. Um `name="lucideCheck"` solto no template não desenha nada
 * sem o `provideIcons` correspondente, então o import é ao mesmo tempo a lista
 * completa e a lista sem falsos positivos — `@ng-icons/core` (NgIcon,
 * provideIcons, IconName) fica de fora porque não é família nenhuma.
 */
export function extractIcons(
  source: string,
  family: IconFamily = SOURCE_ICON_FAMILY,
  catalog: IconCatalog = LOCAL_ICON_CATALOG,
): string[] {
  const found = new Set<string>();

  for (const match of source.matchAll(ICON_IMPORT)) {
    if (familyByPackageSuffix(match[2] ?? '', catalog) !== family) continue;

    for (const specifier of (match[1] ?? '').split(',')) {
      // `type Foo`, `Foo as Bar` — o símbolo do pacote é sempre o primeiro nome.
      const name = specifier
        .trim()
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)[0]
        ?.trim();
      if (name) found.add(name);
    }
  }

  return [...found].sort();
}

/** Os ícones de um conjunto de arquivos, nas duas formas. */
export function listIcons(
  sources: readonly string[],
  family: IconFamily = SOURCE_ICON_FAMILY,
  catalog: IconCatalog = LOCAL_ICON_CATALOG,
): IconList {
  const symbols = new Set<string>();

  for (const source of sources) {
    for (const symbol of extractIcons(source, family, catalog)) symbols.add(symbol);
  }

  const sorted = [...symbols].sort();

  return {
    symbols: sorted,
    tokens: sorted
      .map(symbol => tokenFor(symbol, family, catalog))
      .filter((token): token is IconToken => token !== undefined),
  };
}

/**
 * O mapeamento de ícones de um componente, pronto para ir ao registry.
 *
 * Sai preenchido mesmo quando não há ícone nenhum: o campo estar sempre presente
 * é o que distingue "este componente não desenha ícones" de "este registry foi
 * publicado antes do mapeamento existir", e quem lê não precisa adivinhar qual
 * dos dois é.
 */
export function collectIcons(
  files: readonly string[],
  demos: readonly string[] = [],
  family: IconFamily = SOURCE_ICON_FAMILY,
  catalog: IconCatalog = LOCAL_ICON_CATALOG,
): ComponentIcons {
  return {
    family,
    ...listIcons(files, family, catalog),
    demos: listIcons(demos, family, catalog),
  };
}

export interface RetargetResult {
  readonly content: string;
  /** Símbolos que a família de destino não declara — ficaram como estavam. */
  readonly missing: string[];
}

/**
 * Reescreve um fonte de uma família de ícones para outra.
 *
 * São duas trocas: o pacote de onde os símbolos vêm e cada símbolo em si. O
 * símbolo é substituído em qualquer lugar em que apareça — o import, o
 * `provideIcons({ lucideCheck })` e o `name="lucideCheck"` do template são a
 * mesma palavra, e o shorthand do objeto continua válido depois da troca.
 *
 * Um símbolo sem equivalente na família de destino não é inventado: fica como
 * está e sai em `missing`, para quem chamou avisar em vez de gravar um import
 * que não resolve.
 */
export function retargetIcons(
  source: string,
  from: IconFamily,
  to: IconFamily,
  catalog: IconCatalog = LOCAL_ICON_CATALOG,
): RetargetResult {
  const origin = iconFamily(from, catalog);
  const target = iconFamily(to, catalog);

  if (from === to || !origin || !target) return { content: source, missing: [] };

  const missing: string[] = [];
  const replacements = new Map<string, string>();

  for (const symbol of extractIcons(source, from, catalog)) {
    const token = tokenFor(symbol, from, catalog);
    const replacement = token !== undefined ? symbolFor(token, to, catalog) : undefined;

    if (replacement === undefined) missing.push(symbol);
    else replacements.set(symbol, replacement);
  }

  if (replacements.size === 0) return { content: source, missing };

  return { content: rewriteIcons(source, origin.package, target.package, replacements), missing };
}

/**
 * A parte mecânica da troca, separada de quem decide o quê trocar.
 *
 * Fica exposta porque é onde os erros de reescrita moram — a substituição por
 * palavra inteira e a ordem da alternância — e porque testá-la não depende de
 * existir mais de uma família declarada.
 */
export function rewriteIcons(
  source: string,
  fromPackage: string,
  toPackage: string,
  replacements: ReadonlyMap<string, string>,
): string {
  if (replacements.size === 0) return source;

  // A alternância é testada na ordem escrita, então os nomes longos vêm antes:
  // com `lucideClock` na frente, `lucideClock2` seria examinado a partir do
  // prefixo, e é o `\b` do fim que decide — mais barato não depender disso.
  const pattern = new RegExp(`\\b(${[...replacements.keys()].sort((a, b) => b.length - a.length).join('|')})\\b`, 'g');

  return source
    .replace(
      new RegExp(`(['"])${escapeRegExp(fromPackage)}\\1`, 'g'),
      (_match, quote: string) => `${quote}${toPackage}${quote}`,
    )
    .replace(pattern, symbol => replacements.get(symbol) ?? symbol);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
