/**
 * O código curto do preset: `a000301e`.
 *
 * Formato: `[versão:1][payload:N][checksum:1]`, tudo em base62. Não há banco de
 * dados por trás — o código **é** o estado, e é isso que faz um link de
 * `/create` continuar abrindo o mesmo design system daqui a um ano, sem que
 * ninguém precise ter guardado nada.
 *
 * Cada posição do payload guarda o `code` da entrada de catálogo escolhida, e
 * não o seu índice. É a diferença entre um contrato e uma coincidência:
 * reordenar `presets.json` — filtrar um item, inserir outro no meio — reescreve
 * todo índice de array, e com ele o significado de todos os códigos já
 * compartilhados. O `code` é imutável e nunca reaproveitado; item removido vira
 * `deprecated` e continua decodificando.
 *
 * Campos novos entram **no fim** do payload. O decodificador tolera payload
 * curto (usa os defaults) e payload longo (ignora o excedente), então uma CLI
 * antiga lê um código novo sem quebrar — perde só o campo que ela não conhece.
 * Mudar a ordem ou o significado de uma posição existente exige subir a versão.
 */

import { entryByCode, entryById } from './catalog/index.js';
import { DEFAULT_PRESET, hasColorOverrides, type Preset } from './preset.js';
import type { CatalogEntry, PresetCatalog } from './types.js';

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const BASE = ALPHABET.length;

/** `a` é a v1. A próxima versão do payload é `b`, e assim por diante. */
const VERSION_CHARS: Record<number, string> = { 1: 'a' };

/**
 * Um código curto tem essa cara. Serve para distinguir código de caminho de arquivo e de URL.
 *
 * O mínimo é três: versão, um campo e checksum. Parece curto demais, e é — mas o
 * decodificador aceita payload curto de propósito (uma versão futura pode
 * encurtar o formato), e recusar aqui por tamanho tiraria dele essa margem. Quem
 * recusa uma string que só parece um código é o checksum.
 */
export const PRESET_CODE_PATTERN = /^[0-9A-Za-z]{3,16}$/;

export type PresetCodeErrorKind = 'MALFORMED' | 'UNKNOWN_VERSION' | 'CHECKSUM' | 'UNKNOWN_ENTRY';

export class PresetCodeError extends Error {
  constructor(
    readonly kind: PresetCodeErrorKind,
    message: string,
  ) {
    super(message);
    this.name = 'PresetCodeError';
  }
}

function valueOf(char: string): number {
  const value = ALPHABET.indexOf(char);
  if (value === -1) {
    throw new PresetCodeError('MALFORMED', `Preset code contains an invalid character: "${char}".`);
  }
  return value;
}

function charOf(value: number): string {
  if (!Number.isInteger(value) || value < 0 || value >= BASE) {
    throw new PresetCodeError('MALFORMED', `Catalog code ${value} does not fit a preset code (0-${BASE - 1}).`);
  }
  return ALPHABET[value] as string;
}

/** Soma dos caracteres anteriores, mod 62. A versão entra na conta para que subi-la mude o checksum. */
function checksumOf(body: string): string {
  let sum = 0;
  for (const char of body) sum += valueOf(char);

  return charOf(sum % BASE);
}

function codeFor(entries: readonly CatalogEntry[], id: string, field: string): number {
  const entry = entryById(entries, id);
  if (!entry) {
    const available = entries
      .filter(item => !item.deprecated)
      .map(item => item.id)
      .sort()
      .join(', ');
    throw new PresetCodeError('UNKNOWN_ENTRY', `Unknown ${field} "${id}". Available: ${available}.`);
  }

  return entry.code;
}

function idFor(entries: readonly CatalogEntry[], code: number, field: string, fallback: string): string {
  const entry = entryByCode(entries, code);
  if (!entry) {
    throw new PresetCodeError(
      'UNKNOWN_ENTRY',
      `This preset code refers to a ${field} this catalog does not know (${code}). ` +
        `Update the CLI or check the code; falling back to "${fallback}" would silently change the design.`,
    );
  }

  return entry.id;
}

const FLAG_DARK_MODE = 1;
const FLAG_RTL = 2;

/**
 * O preset como código curto.
 *
 * Cor editada à mão não cabe aqui — são 31 tokens em dois modos, contra os seis
 * caracteres do payload. Nesse caso não existe código, e quem chamou precisa
 * cair no preset de arquivo; devolver um código que ignora os overrides em
 * silêncio seria pior do que não devolver nenhum.
 */
export function encodePreset(preset: Preset, catalog: PresetCatalog): string | null {
  if (hasColorOverrides(preset)) return null;

  const versionChar = VERSION_CHARS[preset.version];
  if (!versionChar) {
    throw new PresetCodeError('UNKNOWN_VERSION', `Cannot encode preset version ${preset.version}.`);
  }

  const flags = (preset.darkMode === 'class' ? FLAG_DARK_MODE : 0) | (preset.rtl ? FLAG_RTL : 0);

  const body =
    versionChar +
    charOf(codeFor(catalog.baseColors, preset.baseColor, 'base color')) +
    charOf(codeFor(catalog.themes, preset.theme, 'theme')) +
    charOf(codeFor(catalog.charts, preset.chart, 'chart palette')) +
    charOf(codeFor(catalog.radii, preset.radius, 'radius')) +
    charOf(codeFor(catalog.icons, preset.icons, 'icon library')) +
    charOf(flags);

  return body + checksumOf(body);
}

export function decodePreset(code: string, catalog: PresetCatalog): Preset {
  const trimmed = code.trim();

  if (!PRESET_CODE_PATTERN.test(trimmed)) {
    throw new PresetCodeError(
      'MALFORMED',
      `"${code}" is not a preset code. Codes are 3-16 letters and digits, and they are case-sensitive.`,
    );
  }

  const body = trimmed.slice(0, -1);
  const checksum = trimmed.slice(-1);

  if (checksumOf(body) !== checksum) {
    throw new PresetCodeError(
      'CHECKSUM',
      `Preset code "${trimmed}" failed its checksum. Preset codes are case-sensitive — check for a lost letter case or a missing character.`,
    );
  }

  const version = Object.entries(VERSION_CHARS).find(([, char]) => char === body[0])?.[0];
  if (!version) {
    throw new PresetCodeError(
      'UNKNOWN_VERSION',
      `Preset code "${trimmed}" uses format "${body[0]}", which this version does not read. Update the CLI.`,
    );
  }

  // Payload curto usa os defaults; payload longo tem o excedente ignorado. É o
  // que faz uma CLI antiga ler um código gerado depois dela sem quebrar.
  const payload = body.slice(1);
  const at = (index: number): number | undefined =>
    index < payload.length ? valueOf(payload[index] as string) : undefined;

  const baseColor = at(0);
  const theme = at(1);
  const chart = at(2);
  const radius = at(3);
  const icons = at(4);
  const flags = at(5) ?? (DEFAULT_PRESET.darkMode === 'class' ? FLAG_DARK_MODE : 0);

  return {
    version: 1,
    baseColor:
      baseColor === undefined
        ? DEFAULT_PRESET.baseColor
        : idFor(catalog.baseColors, baseColor, 'base color', DEFAULT_PRESET.baseColor),
    theme: theme === undefined ? DEFAULT_PRESET.theme : idFor(catalog.themes, theme, 'theme', DEFAULT_PRESET.theme),
    chart:
      chart === undefined ? DEFAULT_PRESET.chart : idFor(catalog.charts, chart, 'chart palette', DEFAULT_PRESET.chart),
    radius:
      radius === undefined ? DEFAULT_PRESET.radius : idFor(catalog.radii, radius, 'radius', DEFAULT_PRESET.radius),
    icons:
      icons === undefined ? DEFAULT_PRESET.icons : idFor(catalog.icons, icons, 'icon library', DEFAULT_PRESET.icons),
    darkMode: (flags & FLAG_DARK_MODE) !== 0 ? 'class' : 'off',
    rtl: (flags & FLAG_RTL) !== 0,
  };
}

/** `true` quando a string tem forma de código — não diz que ele decodifica. */
export function looksLikePresetCode(value: string): boolean {
  return PRESET_CODE_PATTERN.test(value.trim());
}
