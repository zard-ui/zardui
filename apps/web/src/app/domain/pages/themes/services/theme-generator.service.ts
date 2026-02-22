import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { EDarkModes, ZardDarkMode } from '@zard/services/dark-mode';

import { THEME_PRESETS } from '../data/theme-presets';
import type { ThemeColorKey, ThemeColors, ThemeDefinition } from '../models/theme.model';

@Injectable({ providedIn: 'root' })
export class ThemeGeneratorService {
  private readonly darkModeService = inject(ZardDarkMode);

  private readonly _theme = signal<ThemeDefinition>(THEME_PRESETS[0].theme);
  private readonly _activePreset = signal<string | null>('Neutral');
  private readonly _previewDarkMode = signal<boolean>(false);

  constructor() {
    effect(() => {
      const appThemeMode = this.darkModeService.themeMode();
      this._previewDarkMode.set(appThemeMode === EDarkModes.DARK);
    });
  }

  readonly theme = this._theme.asReadonly();
  readonly activePreset = this._activePreset.asReadonly();
  readonly previewDarkMode = this._previewDarkMode.asReadonly();

  readonly currentColors = computed(() => {
    const theme = this._theme();
    return this._previewDarkMode() ? theme.dark : theme.light;
  });

  readonly scopedStyles = computed(() => {
    const colors = this.currentColors();
    const radius = this._theme().radius;

    const colorStyles = Object.entries(colors)
      .map(([key, value]) => `--${key}: ${value}`)
      .join('; ');

    return `--radius: ${radius}; ${colorStyles}`;
  });

  applyPreset(presetName: string): void {
    const preset = THEME_PRESETS.find(p => p.name === presetName);
    if (preset) {
      this._theme.set(structuredClone(preset.theme));
      this._activePreset.set(presetName);
    }
  }

  updateVariable(key: ThemeColorKey, value: string, mode: 'light' | 'dark'): void {
    this._theme.update(theme => ({
      ...theme,
      [mode]: {
        ...theme[mode],
        [key]: value,
      },
    }));
    this._activePreset.set(null);
  }

  updateRadius(value: string): void {
    this._theme.update(theme => ({
      ...theme,
      radius: value,
    }));
    this._activePreset.set(null);
  }

  togglePreviewDarkMode(): void {
    this._previewDarkMode.update(v => !v);
  }

  setPreviewDarkMode(isDark: boolean): void {
    this._previewDarkMode.set(isDark);
  }

  exportCss(): string {
    const theme = this._theme();
    const lightVars = this.formatCssVariables(theme.light, theme.radius);
    const darkVars = this.formatCssVariables(theme.dark);

    return `@import 'tailwindcss';
@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));

:root {
${lightVars}
}

.dark {
${darkVars}
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }

    input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield; /* Added for general compatibility */
  }
}
  
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: var(--muted-foreground);
  border-radius: 5px;
}

::-webkit-scrollbar-track {
  border-radius: 5px;
  background: var(--muted);
}  
`;
  }

  private formatCssVariables(colors: ThemeColors, radius?: string): string {
    const lines: string[] = [];

    if (radius) {
      lines.push(`  --radius: ${radius};`);
    }

    for (const [key, value] of Object.entries(colors)) {
      lines.push(`  --${key}: ${value};`);
    }

    return lines.join('\n');
  }

  async copyToClipboard(): Promise<boolean> {
    try {
      const css = this.exportCss();
      await navigator.clipboard.writeText(css);
      return true;
    } catch {
      return false;
    }
  }
}
