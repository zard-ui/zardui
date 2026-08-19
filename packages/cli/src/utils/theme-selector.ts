/**
 * Os tons neutros que o `init` oferece e o CSS que ele grava.
 *
 * A casca ficou; o conteúdo mudou de dono. Os tokens eram cinco funções que
 * devolviam CSS em string aqui na CLI, e uma segunda cópia em dados na página
 * `/themes` — duas verdades sobre a mesma cor, sem nada garantindo que
 * concordassem. Agora as duas leem `@zardui/preset`, e o que o preview mostra é
 * literalmente o que o comando grava.
 */

import { BASE_COLORS, DEFAULT_PRESET, renderThemeCss, resolvePreset, selectable } from '@zardui/preset';

export function getAvailableThemes(): string[] {
  return selectable(BASE_COLORS).map(entry => entry.id);
}

export function getThemeContent(themeName: string, corePath: string): string {
  // Um tom desconhecido cai no default em vez de parar o comando: quem valida a
  // escolha é o wizard, e o `init` sempre gravou um arquivo válido.
  const baseColor = BASE_COLORS.some(entry => entry.id === themeName) ? themeName : DEFAULT_PRESET.baseColor;

  return renderThemeCss(resolvePreset({ ...DEFAULT_PRESET, baseColor }), { corePath });
}

export function getThemeDisplayName(themeName: string): string {
  const entry = BASE_COLORS.find(item => item.id === themeName);
  if (!entry) return themeName;

  return entry.id === DEFAULT_PRESET.baseColor ? `${entry.label} (Default)` : entry.label;
}
