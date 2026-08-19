/**
 * Os presets prontos, oferecidos como ponto de partida.
 *
 * O `code` de cada um é conferido em teste contra os campos que o rótulo promete
 * (`presets.spec.ts`): um código digitado errado aqui abriria o `/create` em um
 * estado diferente do nome que aparece no botão, e nada no build reclamaria.
 */

import type { NamedPresetEntry } from '../types.js';

export const NAMED_PRESETS: readonly NamedPresetEntry[] = [
  { id: 'default', label: 'Default', code: 'a000301e' },
  { id: 'slate-blue', label: 'Slate Blue', code: 'a4B0301t' },
  { id: 'stone-amber', label: 'Stone Amber', code: 'a130401j' },
  { id: 'zinc-violet', label: 'Zinc Violet', code: 'a2D0201s' },
  { id: 'gray-emerald', label: 'Gray Emerald', code: 'a371301p' },
];
