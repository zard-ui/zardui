import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { EDarkModes, ZardDarkMode } from '@zard/services/dark-mode';

import {
  decodePreset,
  DEFAULT_PRESET,
  encodePreset,
  entryById,
  LOCAL_PRESET_CATALOG,
  renderThemeCss,
  resolvePreset,
  selectable,
  THEME_COLOR_KEYS,
  type CatalogEntry,
  type Preset,
  type PresetCatalog,
  type ThemeColorKey,
} from '@zardui/preset';

/** Os controles do painel, na ordem em que aparecem nele. */
export type ControlId = 'baseColor' | 'theme' | 'chart' | 'icons' | 'radius' | 'darkMode' | 'rtl';

export const CONTROL_IDS: readonly ControlId[] = ['baseColor', 'theme', 'chart', 'icons', 'radius', 'darkMode', 'rtl'];

export interface ControlOption {
  readonly id: string;
  readonly label: string;
}

export interface Control {
  readonly id: ControlId;
  readonly label: string;
  readonly value: string;
  readonly options: readonly ControlOption[];
  /** O tom que o indicador do card desenha, quando o controle tiver cor. */
  readonly swatch?: string;
}

const CONTROL_LABELS: Record<ControlId, string> = {
  baseColor: 'Base Color',
  theme: 'Theme',
  chart: 'Chart Color',
  icons: 'Icon Library',
  radius: 'Radius',
  darkMode: 'Dark Mode',
  rtl: 'RTL',
};

const ON_OFF: readonly ControlOption[] = [
  { id: 'on', label: 'On' },
  { id: 'off', label: 'Off' },
];

const DARK_MODE_OPTIONS: readonly ControlOption[] = [
  { id: 'class', label: 'Class' },
  { id: 'off', label: 'Off' },
];

/** O caminho do core dentro de um projeto recém-inicializado — o que o `init` escreveria. */
const DEFAULT_CORE_PATH = './app/shared/core';

function toggleControl(id: ControlId, value: string, options: readonly ControlOption[]): Control {
  return {
    id,
    label: CONTROL_LABELS[id],
    value: options.find(option => option.id === value)?.label ?? value,
    options,
  };
}

@Injectable()
export class CreateBuilderService {
  private readonly router = inject(Router);
  private readonly darkModeService = inject(ZardDarkMode);

  private readonly _catalog = signal<PresetCatalog>(LOCAL_PRESET_CATALOG);
  private readonly _preset = signal<Preset>(DEFAULT_PRESET);
  private readonly _locked = signal<ReadonlySet<ControlId>>(new Set());
  private readonly _overrides = signal<Partial<Record<ThemeColorKey, string>>>({});

  readonly catalog = this._catalog.asReadonly();
  readonly preset = this._preset.asReadonly();
  readonly locked = this._locked.asReadonly();

  /**
   * O modo em que o preview é desenhado.
   *
   * Segue o tema do site, e não o `darkMode` do preset: aquele diz o que a CLI
   * vai instalar no projeto, este diz o que a pessoa está olhando agora. Confundir
   * os dois faria escolher "Dark Mode: off" apagar o preview de quem está com o
   * site no escuro.
   */
  readonly previewDark = computed(() => this.darkModeService.themeMode() === EDarkModes.DARK);

  readonly resolved = computed(() => resolvePreset(this._preset(), this._catalog()));

  readonly code = computed(() => {
    try {
      return encodePreset(this._preset(), this._catalog());
    } catch {
      return null;
    }
  });

  /**
   * Os tokens como `style` para o container do canvas.
   *
   * Escopado, e nunca no `:root` do site: o painel de controles e o header
   * precisam continuar legíveis enquanto o preview vira o que a pessoa escolheu.
   */
  readonly scopedStyles = computed(() => {
    const resolved = this.resolved();
    const colors = this.previewDark() ? resolved.dark : resolved.light;

    const declarations = THEME_COLOR_KEYS.map((key: ThemeColorKey) => `--${key}: ${colors[key]}`);

    return `--radius: ${resolved.radius}; ${declarations.join('; ')}`;
  });

  /** O CSS que a CLI gravaria para este preset — o conteúdo da aba Theme do dialog. */
  readonly themeCss = computed(() => renderThemeCss(this.resolved(), { corePath: DEFAULT_CORE_PATH }));

  readonly controls = computed<Control[]>(() => {
    const catalog = this._catalog();
    const preset = this._preset();
    const resolved = this.resolved();
    const colors = this.previewDark() ? resolved.dark : resolved.light;

    return [
      this.control('baseColor', preset.baseColor, catalog.baseColors, colors['background']),
      this.control('theme', preset.theme, catalog.themes, colors['primary']),
      this.control('chart', preset.chart, catalog.charts, colors['chart-2']),
      this.control('icons', preset.icons, catalog.icons),
      this.control('radius', preset.radius, catalog.radii),
      // O card mostra o rótulo da opção, e não o valor cru: `class` e `off` são
      // como o preset os grava, não como se lê um controle.
      toggleControl('darkMode', preset.darkMode, DARK_MODE_OPTIONS),
      toggleControl('rtl', preset.rtl ? 'on' : 'off', ON_OFF),
    ];
  });

  /** `true` quando há cor editada à mão, e portanto nenhum código curto que a represente. */
  readonly hasOverrides = computed(() => Object.keys(this._overrides()).length > 0);

  loadCatalog(catalog: PresetCatalog): void {
    this._catalog.set(catalog);
  }

  /**
   * Lê o preset de um código, caindo no default quando ele não serve.
   *
   * Um link antigo, truncado no meio de uma mensagem, ou de um catálogo que já
   * mudou não pode deixar a página em branco: ela abre no default e avisa. É a
   * diferença entre "esse link não vale mais" e "o site quebrou".
   */
  applyCode(code: string): { ok: boolean; reason?: string } {
    try {
      this._preset.set(decodePreset(code, this._catalog()));
      this._overrides.set({});
      return { ok: true };
    } catch (error) {
      this._preset.set(DEFAULT_PRESET);
      return { ok: false, reason: error instanceof Error ? error.message : 'That preset code could not be read.' };
    }
  }

  select(id: ControlId, value: string): void {
    this._preset.update(preset => {
      if (id === 'darkMode') return { ...preset, darkMode: value === 'off' ? 'off' : 'class' };
      if (id === 'rtl') return { ...preset, rtl: value === 'on' };

      return { ...preset, [id]: value };
    });

    this.syncUrl();
  }

  toggleLock(id: ControlId): void {
    this._locked.update(locked => {
      const next = new Set(locked);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }

  isLocked(id: ControlId): boolean {
    return this._locked().has(id);
  }

  /**
   * Sorteia tudo o que não está travado.
   *
   * O cadeado é o que torna o sorteio utilizável: sem ele, achar uma combinação
   * que quase serve e querer variar só uma coisa significaria perder o resto a
   * cada clique.
   */
  shuffle(): void {
    const catalog = this._catalog();
    const locked = this._locked();

    const pick = <T extends CatalogEntry>(entries: readonly T[], current: string): string => {
      const options = selectable(entries);
      return options.length === 0 ? current : (options[Math.floor(Math.random() * options.length)] as T).id;
    };

    this._preset.update(preset => ({
      ...preset,
      baseColor: locked.has('baseColor') ? preset.baseColor : pick(catalog.baseColors, preset.baseColor),
      theme: locked.has('theme') ? preset.theme : pick(catalog.themes, preset.theme),
      chart: locked.has('chart') ? preset.chart : pick(catalog.charts, preset.chart),
      radius: locked.has('radius') ? preset.radius : pick(catalog.radii, preset.radius),
      icons: locked.has('icons') ? preset.icons : pick(catalog.icons, preset.icons),
    }));

    this.syncUrl();
  }

  reset(): void {
    this._preset.set(DEFAULT_PRESET);
    this._overrides.set({});
    this.syncUrl();
  }

  /** O arquivo que substitui o código curto quando há cor editada à mão. */
  presetFile(): string {
    const preset = this._preset();
    const overrides = this._overrides();

    return `${JSON.stringify(
      {
        $schema: 'https://zardui.com/preset.schema.json',
        version: 1,
        baseColor: preset.baseColor,
        theme: preset.theme,
        chart: preset.chart,
        radius: preset.radius,
        icons: preset.icons,
        darkMode: preset.darkMode,
        rtl: preset.rtl,
        ...(Object.keys(overrides).length > 0
          ? { colors: { [this.previewDark() ? 'dark' : 'light']: overrides } }
          : {}),
      },
      null,
      2,
    )}\n`;
  }

  /**
   * Mantém `?preset=` em dia sem empilhar histórico.
   *
   * Cada clique num controle é uma mudança de estado, não uma navegação: sem
   * `replaceUrl`, voltar uma página depois de experimentar dez combinações
   * exigiria dez cliques no botão de voltar.
   */
  private syncUrl(): void {
    const code = this.code();

    void this.router.navigate([], {
      queryParams: { preset: code ?? null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private control(id: ControlId, value: string, entries: readonly CatalogEntry[], swatch?: string): Control {
    return {
      id,
      label: CONTROL_LABELS[id],
      value: entryById(entries, value)?.label ?? value,
      options: selectable(entries).map((entry: CatalogEntry) => ({ id: entry.id, label: entry.label })),
      ...(swatch ? { swatch } : {}),
    };
  }
}
