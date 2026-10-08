import { isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, type ParamMap, Router } from '@angular/router';

import { EDarkModes, ZardDarkMode } from '@zard/services/dark-mode';

import { THEME_PRESETS } from '../data/theme-presets';
import { THEME_COLOR_KEYS, type ThemeColorKey, type ThemeColors, type ThemeDefinition } from '../models/theme.model';

const DEFAULT_PRESET = THEME_PRESETS[0];

/** The query param each piece of customizer state travels in. */
const PARAM_KEYS = {
  preset: 'preset',
  radius: 'radius',
  colors: 'c',
  mode: 'mode',
} as const;

/**
 * The path a fresh `zard-cli init` (Angular CLI project, default aliases) writes into
 * the `@import` line — see `packages/cli/src/commands/init/tailwind-setup.ts`'s
 * `coreImportPath()` and the `angular-cli` fixture it produces. A project with custom
 * aliases resolves elsewhere, but this is the representative default the docs site
 * itself cannot know in advance.
 */
const CORE_IMPORT_PATH = './app/shared/core';

const RADIUS_PATTERN = /^\d+(\.\d+)?rem$/;

/**
 * A colour value arriving from the URL is untrusted input, and it is later
 * interpolated into an inline `style` attribute — so anything outside the
 * characters an oklch()/hex/rgb string can legitimately contain is dropped
 * rather than trusted.
 */
const COLOR_VALUE_PATTERN = /^[a-zA-Z0-9\s.,%/#()-]{1,64}$/;

@Injectable({ providedIn: 'root' })
export class ThemeGeneratorService {
  private readonly darkModeService = inject(ZardDarkMode);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // SSR-safe: the snapshot is available synchronously, so the first render (server or
  // client) already reflects a shared link instead of flashing the default first.
  private readonly queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  private readonly _theme = signal<ThemeDefinition>(structuredClone(DEFAULT_PRESET.theme));
  private readonly _activePreset = signal<string | null>(DEFAULT_PRESET.name);
  private readonly _previewDarkMode = signal<boolean>(false);

  /**
   * The preset a reset, or a URL diff, is measured against.
   *
   * Unlike `_activePreset` — which goes `null` the moment a colour or the radius is
   * edited, so the preset grid stops showing a checkmark that no longer applies —
   * this never goes null. Editing away from a preset does not forget which one the
   * reader started from.
   */
  private readonly _basePresetName = signal<string>(DEFAULT_PRESET.name);

  constructor() {
    // The app-driven default: the preview opens in whichever mode the site itself is
    // in, unless the URL says otherwise (see the effect below).
    effect(() => {
      const appThemeMode = this.darkModeService.themeMode();
      this._previewDarkMode.set(appThemeMode === EDarkModes.DARK);
    });

    /*
     * The URL is the input; the signal is the truth. Reading back what we just wrote
     * finds the same state and does nothing, so this covers the first load, a reload
     * and the browser's back button without looping — `syncThemeUrl`/`syncModeUrl`
     * only ever write params that round-trip through `parseThemeParams` unchanged.
     *
     * `mode` is the one field read conditionally: it is written only once the reader
     * has touched the dark-mode toggle (see `syncModeUrl`), so a URL without it must
     * leave the app-driven effect above alone rather than forcing light on every load.
     */
    effect(() => {
      const params = this.queryParams();
      const parsed = parseThemeParams(params);

      untracked(() => {
        if (!themesEqual(parsed.theme, this._theme())) {
          this._theme.set(parsed.theme);
        }
        if (this._activePreset() !== parsed.activePresetName) {
          this._activePreset.set(parsed.activePresetName);
        }
        if (this._basePresetName() !== parsed.basePresetName) {
          this._basePresetName.set(parsed.basePresetName);
        }
        if (parsed.previewDarkMode !== undefined && parsed.previewDarkMode !== this._previewDarkMode()) {
          this._previewDarkMode.set(parsed.previewDarkMode);
        }
      });
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

  /** Whether the theme has drifted from the preset it started from — nothing to reset if not. */
  readonly isDirty = computed(() => this._activePreset() === null);

  applyPreset(presetName: string): void {
    const preset = THEME_PRESETS.find(p => p.name === presetName);
    if (!preset) return;

    this._theme.set(structuredClone(preset.theme));
    this._activePreset.set(preset.name);
    this._basePresetName.set(preset.name);
    this.syncThemeUrl();
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
    this.syncThemeUrl();
  }

  updateRadius(value: string): void {
    this._theme.update(theme => ({
      ...theme,
      radius: value,
    }));
    this._activePreset.set(null);
    this.syncThemeUrl();
  }

  /** Returns every colour and the radius to the values of the preset this theme started from. */
  reset(): void {
    const base = THEME_PRESETS.find(p => p.name === this._basePresetName()) ?? DEFAULT_PRESET;

    this._theme.set(structuredClone(base.theme));
    this._activePreset.set(base.name);
    this.syncThemeUrl();
  }

  togglePreviewDarkMode(): void {
    this._previewDarkMode.update(v => !v);
    this.syncModeUrl();
  }

  setPreviewDarkMode(isDark: boolean): void {
    this._previewDarkMode.set(isDark);
    this.syncModeUrl();
  }

  /**
   * The whole stylesheet a consumer's `styles.css` becomes.
   *
   * Structure matches `getTailwindConfiguration()` / `neutral()` etc. in
   * `packages/cli/src/core/themes/theme-definitions.ts` byte-for-byte — the `@layer`
   * order, the `@import` lines, `@theme inline` and `@layer base` — verified against
   * what `zard-cli init` actually writes for a fresh Angular project. Only the token
   * values differ, because those come from whatever preset and edits are live. Light
   * and dark are both always included, regardless of which one is being previewed.
   */
  exportCss(): string {
    const theme = this._theme();
    const lightVars = this.formatCssVariables(theme.light, theme.radius);
    const darkVars = this.formatCssVariables(theme.dark);

    return `
@layer ng-icon, theme, base, components, utilities;
@import 'tailwindcss';
@import '${CORE_IMPORT_PATH}/css/zard';
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
  --color-destructive-foreground: var(--destructive-foreground);
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
`.trim();
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

  /** Clipboard copy of {@link exportCss}. Kept under both this name and {@link copyStylesCss}: the
   * customizer's original "Copy CSS Variables" action and the new "Copy styles.css" action produce
   * the same paste-ready file — the export was the thing worth widening, not duplicating. */
  async copyToClipboard(): Promise<boolean> {
    return this.writeToClipboard(this.exportCss());
  }

  async copyStylesCss(): Promise<boolean> {
    return this.writeToClipboard(this.exportCss());
  }

  /** Downloads {@link exportCss} as `styles.css`. No-ops outside the browser. */
  downloadStylesCss(): void {
    if (!this.isBrowser) return;

    const blob = new Blob([this.exportCss()], { type: 'text/css' });
    const url = URL.createObjectURL(blob);

    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = 'styles.css';
      link.click();
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  private async writeToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  /** Writes the preset, the radius and the colour overrides into the URL, leaving defaults out. */
  private syncThemeUrl(): void {
    if (!this.isBrowser) return;

    const theme = this._theme();
    const base = THEME_PRESETS.find(p => p.name === this._basePresetName()) ?? DEFAULT_PRESET;

    const colors = encodeColorOverrides(
      diffColors(theme.light, base.theme.light),
      diffColors(theme.dark, base.theme.dark),
    );

    const queryParams: Record<string, string | null> = {
      [PARAM_KEYS.preset]: base.name === DEFAULT_PRESET.name ? null : base.name,
      [PARAM_KEYS.radius]: theme.radius === base.theme.radius ? null : theme.radius,
      [PARAM_KEYS.colors]: colors,
    };

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  /**
   * Writes the dark-mode preview into the URL, on its own from `syncThemeUrl` — a preset
   * or colour change should never touch a mode the reader never asked to persist.
   */
  private syncModeUrl(): void {
    if (!this.isBrowser) return;

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [PARAM_KEYS.mode]: this._previewDarkMode() ? 'dark' : 'light' },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}

/**
 * A theme built from raw URL params, with everything checked against its source.
 *
 * A query param is untrusted input: an unknown preset name falls back to the default,
 * a malformed radius or colour falls back to the preset's own value rather than
 * reaching a `style` binding.
 */
function parseThemeParams(params: ParamMap): {
  theme: ThemeDefinition;
  activePresetName: string | null;
  basePresetName: string;
  /** `undefined` means "no opinion" — leave whatever the app-driven default set. */
  previewDarkMode?: boolean;
} {
  const presetParam = params.get(PARAM_KEYS.preset);
  const base = THEME_PRESETS.find(p => p.name === presetParam) ?? DEFAULT_PRESET;

  const radiusParam = params.get(PARAM_KEYS.radius);
  const radius = radiusParam && RADIUS_PATTERN.test(radiusParam) ? radiusParam : base.theme.radius;

  const { light: lightOverrides, dark: darkOverrides } = parseColorOverrides(params.get(PARAM_KEYS.colors));

  const light = Object.keys(lightOverrides).length ? { ...base.theme.light, ...lightOverrides } : base.theme.light;
  const dark = Object.keys(darkOverrides).length ? { ...base.theme.dark, ...darkOverrides } : base.theme.dark;

  const isDirty =
    radius !== base.theme.radius || Object.keys(lightOverrides).length > 0 || Object.keys(darkOverrides).length > 0;

  const modeParam = params.get(PARAM_KEYS.mode);
  const previewDarkMode = modeParam === 'dark' ? true : modeParam === 'light' ? false : undefined;

  return {
    theme: { name: base.theme.name, radius, light, dark },
    activePresetName: isDirty ? null : base.name,
    basePresetName: base.name,
    previewDarkMode,
  };
}

function parseColorOverrides(raw: string | null): { light: Partial<ThemeColors>; dark: Partial<ThemeColors> } {
  const empty = { light: {}, dark: {} };
  if (!raw) return empty;

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return empty;
  }

  if (typeof payload !== 'object' || payload === null) return empty;

  const record = payload as Record<string, unknown>;
  return {
    light: sanitizeColorRecord(record['light']),
    dark: sanitizeColorRecord(record['dark']),
  };
}

function sanitizeColorRecord(value: unknown): Partial<ThemeColors> {
  if (typeof value !== 'object' || value === null) return {};

  const source = value as Record<string, unknown>;
  const result: Partial<ThemeColors> = {};

  for (const key of THEME_COLOR_KEYS) {
    const candidate = source[key];
    if (typeof candidate === 'string' && COLOR_VALUE_PATTERN.test(candidate)) {
      result[key] = candidate;
    }
  }

  return result;
}

/** The keys of `current` that differ from `base` — the deltas a preset diff carries, not all 31. */
function diffColors(current: ThemeColors, base: ThemeColors): Partial<ThemeColors> {
  const diff: Partial<ThemeColors> = {};

  for (const key of THEME_COLOR_KEYS) {
    if (current[key] !== base[key]) {
      diff[key] = current[key];
    }
  }

  return diff;
}

function encodeColorOverrides(light: Partial<ThemeColors>, dark: Partial<ThemeColors>): string | null {
  const hasLight = Object.keys(light).length > 0;
  const hasDark = Object.keys(dark).length > 0;
  if (!hasLight && !hasDark) return null;

  const payload: { light?: Partial<ThemeColors>; dark?: Partial<ThemeColors> } = {};
  if (hasLight) payload.light = light;
  if (hasDark) payload.dark = dark;

  return JSON.stringify(payload);
}

function themesEqual(a: ThemeDefinition, b: ThemeDefinition): boolean {
  if (a.radius !== b.radius) return false;

  for (const key of THEME_COLOR_KEYS) {
    if (a.light[key] !== b.light[key]) return false;
    if (a.dark[key] !== b.dark[key]) return false;
  }

  return true;
}
