/**
 * Os tipos do preset — a forma dos dados que CLI e site compartilham.
 *
 * Tudo aqui é dado puro: nenhuma função de plataforma, nenhum import de Node ou
 * de Angular. É o que permite ao mesmo módulo rodar dentro do `zard-cli` e
 * dentro do bundle do site, e é o que garante que o preview de `/create` e o CSS
 * que a CLI grava sejam a mesma coisa — e não duas implementações parecidas.
 */

/** Os tokens de cor, na ordem exata em que o CSS os escreve. */
export const THEME_COLOR_KEYS = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
] as const;

export type ThemeColorKey = (typeof THEME_COLOR_KEYS)[number];

/** Os cinco tokens que a paleta de gráficos preenche. */
export const CHART_COLOR_KEYS = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'] as const;

export type ChartColorKey = (typeof CHART_COLOR_KEYS)[number];

/** Tudo o que não vem da paleta de gráficos — o que um tom neutro declara. */
export type NeutralColorKey = Exclude<ThemeColorKey, ChartColorKey>;

export type ThemeColors = Record<ThemeColorKey, string>;
export type NeutralColors = Record<NeutralColorKey, string>;

export type ColorScheme = 'light' | 'dark';

/**
 * O que toda entrada de catálogo carrega.
 *
 * `code` é a identidade no código curto do preset e **nunca muda**: o arquivo
 * publicado pode ser reordenado, filtrado ou crescer sem que um link já
 * compartilhado passe a significar outra coisa. Índice de array seria a escolha
 * óbvia e a errada — ver `code.ts`.
 */
export interface CatalogEntry {
  readonly id: string;
  readonly code: number;
  readonly label: string;
  /** Item aposentado: continua decodificando, mas some das listas de escolha. */
  readonly deprecated?: boolean;
}

/** Um tom neutro da base — o que hoje é `tailwind.baseColor` no components.json. */
export interface BaseColorEntry extends CatalogEntry {
  readonly light: NeutralColors;
  readonly dark: NeutralColors;
}

/**
 * Uma cor de destaque — o que o campo `theme` do preset nomeia.
 *
 * Não guarda tokens: guarda a coordenada em oklch de onde eles são derivados
 * (`derive.ts`), sobre o tom neutro escolhido. É o que faz "Indigo sobre Stone"
 * e "Indigo sobre Zinc" serem a mesma família de cor em duas bases diferentes,
 * sem uma tabela de 5 × 18 combinações escrita à mão.
 *
 * `neutral` é a ausência de destaque e por isso não tem coordenada.
 */
export interface ThemeEntry extends CatalogEntry {
  readonly hue?: number;
  readonly chroma?: number;
}

export interface RadiusEntry extends CatalogEntry {
  /** O valor literal de `--radius`. */
  readonly value: string;
}

export interface ChartEntry extends CatalogEntry {
  readonly light: readonly [string, string, string, string, string];
  readonly dark: readonly [string, string, string, string, string];
}

/** Uma família de ícones, só o suficiente para o código do preset carregá-la. */
export interface IconEntry extends CatalogEntry {
  /** O pacote npm correspondente, para relatórios. O catálogo de ícones manda. */
  readonly package: string;
}

/** Um preset pronto, oferecido como ponto de partida. */
export interface NamedPresetEntry {
  readonly id: string;
  readonly label: string;
  readonly code: string;
}

/** O catálogo inteiro — o que `<registry>/presets.json` publica. */
export interface PresetCatalog {
  readonly baseColors: readonly BaseColorEntry[];
  readonly themes: readonly ThemeEntry[];
  readonly radii: readonly RadiusEntry[];
  readonly charts: readonly ChartEntry[];
  readonly icons: readonly IconEntry[];
  readonly presets: readonly NamedPresetEntry[];
}
