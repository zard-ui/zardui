/**
 * O que `--preset` aceita: um código, um arquivo ou uma URL.
 *
 * Três formas, um argumento só. Quem decide qual é o próprio valor — não uma
 * flag extra: `a000301e` só pode ser código, `./zard.preset.json` só pode ser
 * caminho, e `https://…` só pode ser URL. Pedir `--preset-file` ao lado de
 * `--preset` seria transferir para quem usa uma decisão que a string já toma.
 *
 * A ordem importa: um arquivo chamado `a000301e` no diretório atual não deve
 * sequestrar um código válido, então o código é testado primeiro — ele tem forma
 * fechada, e um caminho que se pareça com um código é o caso raro que se resolve
 * escrevendo `./a000301e`.
 */

import { CliError } from '@cli/utils/errors.js';
import { fetchJson } from '@cli/utils/http-client.js';
import { decodePreset, looksLikePresetCode, normalizePreset, type Preset, type PresetCatalog } from '@zardui/preset';
import { readFile } from 'node:fs/promises';
import * as path from 'node:path';

export type PresetInputKind = 'code' | 'file' | 'url';

export function classifyPresetInput(value: string): PresetInputKind {
  const trimmed = value.trim();

  if (/^https?:\/\//i.test(trimmed)) return 'url';
  if (looksLikePresetCode(trimmed) && !trimmed.includes('.')) return 'code';

  return 'file';
}

async function readPresetDocument(value: string, kind: PresetInputKind, cwd: string): Promise<unknown> {
  if (kind === 'url') {
    return fetchJson<unknown>(value.trim());
  }

  const file = path.resolve(cwd, value.trim());

  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new CliError(
        `No preset at ${file}. Pass a preset code (like a000301e), a path to a zard.preset.json, or a URL.`,
        'PRESET_NOT_FOUND',
      );
    }

    throw new CliError(`Could not read the preset at ${file}: ${(error as Error).message}`, 'PRESET_UNREADABLE');
  }
}

export interface ResolvePresetInputOptions {
  readonly cwd: string;
  readonly catalog: PresetCatalog;
}

/** O preset que esse argumento descreve, seja ele qual das três formas for. */
export async function resolvePresetInput(value: string, options: ResolvePresetInputOptions): Promise<Preset> {
  const kind = classifyPresetInput(value);

  if (kind === 'code') {
    return decodePreset(value, options.catalog);
  }

  const document = await readPresetDocument(value, kind, options.cwd);
  const version = (document as { version?: unknown })?.version;

  // Versão diferente da que este arquivo descreve não é "campo a mais": é um
  // arquivo cujos campos podem significar outra coisa. Recusar é a única leitura
  // honesta.
  if (version !== undefined && version !== 1) {
    throw new CliError(
      `This preset file is version ${String(version)}, and this CLI reads version 1. Update it with \`npm i -g zard-cli@latest\`.`,
      'PRESET_VERSION',
    );
  }

  return normalizePreset(document);
}
