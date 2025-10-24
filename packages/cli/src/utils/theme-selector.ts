import * as themes from '../themes/themes.js';

export function getAvailableThemes(): string[] {
  return themes.availableThemes;
}

export function getThemeContent(themeName: string): string {
  const content = (() => {
    switch (themeName) {
      case 'neutral':
        return themes.neutral;
      case 'stone':
        return themes.stone;
      case 'zinc':
        return themes.zinc;
      case 'gray':
        return themes.gray;
      case 'slate':
        return themes.slate;
      default:
        return themes.neutral;
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
  };
  return names[themeName] ?? themeName;
}
