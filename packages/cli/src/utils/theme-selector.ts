import * as themes from '@cli/core/themes/theme-definitions.js';

export function getAvailableThemes(): string[] {
  return themes.availableThemes;
}

export function getThemeContent(themeName: string, corePath: string): string {
  const content = (() => {
    switch (themeName) {
      case 'stone':
        return themes.stone(corePath);
      case 'zinc':
        return themes.zinc(corePath);
      case 'gray':
        return themes.gray(corePath);
      case 'slate':
        return themes.slate(corePath);
      case 'mauve':
        return themes.mauve(corePath);
      case 'olive':
        return themes.olive(corePath);
      case 'mist':
        return themes.mist(corePath);
      case 'taupe':
        return themes.taupe(corePath);
      case 'neutral':
      default:
        return themes.neutral(corePath);
    }
  })();

  return content.trim();
}

export function getThemeDisplayName(themeName: string): string {
  const names: Record<string, string> = {
    neutral: 'Neutral (Default)',
    stone: 'Stone',
    zinc: 'Zinc',
    gray: 'Gray',
    slate: 'Slate',
    mauve: 'Mauve',
    olive: 'Olive',
    mist: 'Mist',
    taupe: 'Taupe',
  };
  return names[themeName] ?? themeName;
}
