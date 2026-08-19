/**
 * O preset em si: o que ele descreve, o que ele não descreve e o seu default.
 *
 * Um preset descreve **o design system**, não o projeto. Framework, template e
 * gerenciador de pacotes são decisão do comando `create` — é justamente isso que
 * permite ao mesmo código curto valer em `angular`, em `nx` e em `analog`.
 */

import type { ThemeColorKey } from './types.js';

export type DarkModeStrategy = 'class' | 'off';

/** Tokens editados à mão. Não cabem num código curto — ver `code.ts` e o preset de arquivo. */
export interface ThemeColorsOverride {
  readonly light?: Partial<Record<ThemeColorKey, string>>;
  readonly dark?: Partial<Record<ThemeColorKey, string>>;
}

export interface Preset {
  readonly version: 1;
  /** Só o preset de arquivo tem nome; o código curto não carrega texto. */
  readonly name?: string;
  /** Tom neutro da base: `neutral`, `stone`, `zinc`, `gray`, `slate`. */
  readonly baseColor: string;
  /** Cor de destaque. `neutral` significa "sem destaque". */
  readonly theme: string;
  /** Paleta de `--chart-1..5`. */
  readonly chart: string;
  /** Id do raio no catálogo — vira o valor de `--radius`. */
  readonly radius: string;
  /** Família de ícones. Quem valida o valor é o catálogo de ícones do registry. */
  readonly icons: string;
  /** `class` instala o script de tema e o provider; `off` deixa só o claro. */
  readonly darkMode: DarkModeStrategy;
  readonly rtl: boolean;
  readonly colors?: ThemeColorsOverride;
}

export const DEFAULT_PRESET: Preset = {
  version: 1,
  baseColor: 'neutral',
  theme: 'neutral',
  chart: 'default',
  radius: 'default',
  icons: 'lucide',
  darkMode: 'class',
  rtl: false,
};

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

function asColorMap(value: unknown): Partial<Record<ThemeColorKey, string>> | undefined {
  if (typeof value !== 'object' || value === null) return undefined;

  const result: Partial<Record<ThemeColorKey, string>> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (typeof entry === 'string' && entry.length > 0) result[key as ThemeColorKey] = entry;
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

/**
 * Completa um preset parcial com os defaults, sem julgar os ids.
 *
 * Aceitar qualquer id aqui é deliberado: o conjunto válido é o do catálogo em
 * mãos no momento da execução, e não o que existia quando este arquivo foi
 * compilado. Quem recusa um id desconhecido é `resolvePreset`, contra o
 * catálogo, e com uma mensagem que diz quais são os aceitos.
 */
export function normalizePreset(input: unknown): Preset {
  const raw = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>;

  const light = asColorMap(raw['colors'] && (raw['colors'] as Record<string, unknown>)['light']);
  const dark = asColorMap(raw['colors'] && (raw['colors'] as Record<string, unknown>)['dark']);

  return {
    version: 1,
    ...(typeof raw['name'] === 'string' && raw['name'] ? { name: raw['name'] } : {}),
    baseColor: asString(raw['baseColor'], DEFAULT_PRESET.baseColor),
    theme: asString(raw['theme'], DEFAULT_PRESET.theme),
    chart: asString(raw['chart'], DEFAULT_PRESET.chart),
    radius: asString(raw['radius'], DEFAULT_PRESET.radius),
    icons: asString(raw['icons'], DEFAULT_PRESET.icons),
    darkMode: raw['darkMode'] === 'off' ? 'off' : 'class',
    rtl: raw['rtl'] === true,
    ...(light || dark ? { colors: { ...(light ? { light } : {}), ...(dark ? { dark } : {}) } } : {}),
  };
}

/** `true` quando o preset carrega cor editada à mão — o que o código curto não representa. */
export function hasColorOverrides(preset: Preset): boolean {
  const { light, dark } = preset.colors ?? {};
  return Boolean((light && Object.keys(light).length > 0) || (dark && Object.keys(dark).length > 0));
}
