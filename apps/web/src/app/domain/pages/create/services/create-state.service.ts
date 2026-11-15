import { isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';

import {
  designConstraints,
  designsEqual,
  encodePreset,
  normalizeDesign,
  parsePresetInput,
  resetDesign,
  shuffleDesign,
} from '@zard/design';
import type { DesignConfig, DesignLocks, MenuAccentId, RadiusId } from '@zard/design';
import { ZardDarkMode } from '@zard/services/dark-mode';

import { loadBlockItems } from '../lib/create-items';
import { parseCreateParams, serializeCreateParams } from '../lib/create-url';
import { BLOCK_ITEM_PREFIX, DEFAULT_ITEM } from '../lib/create.protocol';
import type { CreateAction } from '../lib/create.protocol';
import {
  CUSTOM_DESIGN_DEFAULTS,
  customThemesEqual,
  EMPTY_CUSTOM_THEME,
  resolveCustomTokens,
  withCustomToken,
  withoutCustomChanges,
  type CustomTheme,
  type CustomToken,
  type ThemeMode,
} from '../lib/custom-theme';
import { PresetHistory } from '../lib/preset-history';

/** The options a lock protects. `menu` holds both the color and the appearance of the menu. */
export type LockKey =
  | 'style'
  | 'baseColor'
  | 'theme'
  | 'chartColor'
  | 'font'
  | 'fontHeading'
  | 'iconLibrary'
  | 'radius'
  | 'menu'
  | 'menuAccent';

/**
 * Everything the `/create` page knows: the design (read from, and written to, the URL), the locks, the undo history
 * and the open/closed state of the dialogs.
 *
 * The URL is the single source of truth for the committed design: every change navigates, and the design signal
 * follows the query string. That is what makes the browser's back and forward buttons and a pasted link work with
 * no extra code.
 */
@Injectable()
export class CreateStateService {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly darkMode = inject(ZardDarkMode);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly parsed = toSignal(this.route.queryParamMap, { requireSync: true });
  private readonly url = computed(() => parseCreateParams(this.parsed()));

  readonly design = computed(() => this.url().design);
  readonly item = computed(() => this.url().item);
  readonly preset = computed(() => encodePreset(this.design()));

  /** The hand-edited theme while Custom is on, `null` while it is off. Lives in the URL, like the design. */
  readonly custom = computed(() => this.url().custom);
  readonly isCustom = computed(() => this.custom() !== null);
  /**
   * A custom theme being dragged in a color picker: the preview follows it live, the URL and the history only get
   * the color the user lets go of.
   */
  private readonly draft = signal<CustomTheme | null>(null);
  /** What the preview shows: the draft while a color is being dragged, else the committed custom theme. */
  readonly previewCustom = computed(() => this.draft() ?? this.custom());
  /** Every token the preview resolves to, custom changes included — what the theme editor shows as current. */
  readonly tokens = computed(() => resolveCustomTokens(this.design(), this.previewCustom() ?? EMPTY_CUSTOM_THEME));

  readonly dark = computed(() => this.darkMode.themeMode() === 'dark');
  readonly constraints = computed(() => designConstraints(this.design(), { dark: this.dark() }));

  readonly locks = signal<DesignLocks>({});

  readonly navigateOpen = signal(false);
  readonly openPresetOpen = signal(false);
  readonly resetOpen = signal(false);
  /** The one-time welcome; owned here so the page's shortcuts can see it. */
  readonly welcomeOpen = signal(false);

  /** Emits when something outside the page's own document (the preview iframe) was clicked: pickers close on it. */
  readonly popupsDismissed = new Subject<void>();

  private readonly history = new PresetHistory(historyKey(this.design(), this.custom()));
  private readonly historyVersion = signal(0);
  readonly canUndo = computed(() => (this.historyVersion(), this.history.canUndo));
  readonly canRedo = computed(() => (this.historyVersion(), this.history.canRedo));

  /** The newest design, ahead of the URL while a navigation is still in flight. */
  private latest: DesignConfig = this.design();
  private latestCustom: CustomTheme | null = this.custom();
  private lastSolidAccent: MenuAccentId = 'subtle';
  /** The radius the user picked, kept apart from the one a style forces (lyra and sera square it, rhea caps it). */
  private chosenRadius: RadiusId = this.design().radius;

  constructor() {
    effect(() => {
      const { design, item, custom, needsCanonicalization } = this.url();
      this.latest = design;
      this.latestCustom = custom;
      if (this.design().menuAccent === 'bold') this.lastSolidAccent = 'bold';
      if (!isRadiusForced(design)) this.chosenRadius = design.radius;
      this.history.observe(historyKey(design, custom));
      this.historyVersion.update(version => version + 1);

      // A hand-typed or stale URL is rewritten in place, so what is in the address bar is always the canonical form.
      if (needsCanonicalization && this.isBrowser) this.navigate(design, item, true);
      else if (this.isBrowser && item.startsWith(BLOCK_ITEM_PREFIX)) void this.dropUnknownBlock(item);
    });
  }

  /** Blocks are a lazy list the URL parser cannot check: a block that does not exist falls back to the canvas. */
  private async dropUnknownBlock(item: string): Promise<void> {
    const blocks = await loadBlockItems();
    if (this.item() === item && !blocks.some(block => block.id === item))
      this.navigate(this.latest, DEFAULT_ITEM, true);
  }

  /** Closes every open picker and menu. */
  dismissPopups(): void {
    this.popupsDismissed.next();
  }

  // --- Committing --------------------------------------------------------------------------------

  /** Commits a change as a new browser history entry. */
  commit(partial: Partial<DesignConfig>): void {
    const next = this.withMenuMemory(partial);
    if (designsEqual(next, this.latest)) return;

    this.latest = next;
    this.navigate(next, this.item(), false);
  }

  setItem(item: string): void {
    this.navigate(this.latest, item, false);
  }

  setPreset(input: string): boolean {
    try {
      const { design } = parsePresetInput(input);
      // A preset is a whole design: opening one leaves Custom.
      this.latestCustom = null;
      this.commit(design);
      return true;
    } catch {
      return false;
    }
  }

  /** Whether `input` is a preset the page can open — for validating the Open Preset field as the user types. */
  static canOpen(input: string): boolean {
    if (input.trim() === '') return false;
    try {
      parsePresetInput(input);
      return true;
    } catch {
      return false;
    }
  }

  shuffle(): void {
    // A custom theme is the user's own work: there is nothing to roll.
    if (this.latestCustom) return;
    this.commit(shuffleDesign(this.latest, this.lockedFields()));
  }

  reset(): void {
    if (this.latestCustom) {
      this.resetCustom();
      return;
    }
    this.commit(resetDesign(this.latest.style));
  }

  // --- Custom theme --------------------------------------------------------------------------------

  /**
   * Turns Custom on (starting from the colors on screen, so nothing jumps) or off (back to the preset it started from).
   * On, the style, fonts, icons and menu go back to zard's defaults: a manual install is CSS only.
   */
  setCustom(on: boolean): void {
    if (on === (this.latestCustom !== null)) return;

    this.draft.set(null);
    this.latestCustom = on ? EMPTY_CUSTOM_THEME : null;
    if (on) this.latest = normalizeDesign({ ...this.latest, ...CUSTOM_DESIGN_DEFAULTS });
    this.navigate(this.latest, this.item(), false);
  }

  /** Shows a color in the preview while it is being picked, without touching the URL or the history. */
  previewCustomToken(mode: ThemeMode, token: CustomToken, value: string): void {
    const current = this.draft() ?? this.latestCustom;
    if (!current) return;
    this.draft.set(withCustomToken(current, this.latest, mode, token, value));
  }

  /** Commits a color: a history entry, and the URL. */
  setCustomToken(mode: ThemeMode, token: CustomToken, value: string): void {
    if (!this.latestCustom) return;
    this.draft.set(null);
    this.commitCustom(withCustomToken(this.latestCustom, this.latest, mode, token, value));
  }

  /** Drops the changes of one mode, or of both: back to the colors of the preset Custom started from. */
  resetCustom(mode?: ThemeMode): void {
    if (!this.latestCustom) return;
    this.draft.set(null);
    this.commitCustom(withoutCustomChanges(this.latestCustom, mode));
  }

  private commitCustom(next: CustomTheme): void {
    if (customThemesEqual(next, this.latestCustom)) return;
    this.latestCustom = next;
    this.navigate(this.latest, this.item(), false);
  }

  undo(): void {
    this.travel(this.history.undo());
  }

  redo(): void {
    this.travel(this.history.redo());
  }

  toggleDark(): void {
    this.darkMode.toggleTheme();
  }

  // --- Locks -------------------------------------------------------------------------------------

  isLocked(key: LockKey): boolean {
    return key === 'menu' ? !!this.locks().menuColor : !!this.locks()[key];
  }

  toggleLock(key: LockKey): void {
    const locked = !this.isLocked(key);
    this.locks.update(current => {
      const next = { ...current };
      if (key === 'menu') {
        next.menuColor = locked;
        next.menuAppearance = locked;
      } else {
        next[key] = locked;
      }
      return next;
    });
  }

  // --- Actions (menu and keyboard) ---------------------------------------------------------------

  run(action: CreateAction): void {
    switch (action) {
      case 'navigate':
        this.navigateOpen.set(true);
        break;
      case 'open-preset':
        this.openPresetOpen.set(true);
        break;
      case 'shuffle':
        this.shuffle();
        break;
      case 'toggle-dark':
        this.toggleDark();
        break;
      case 'undo':
        this.undo();
        break;
      case 'redo':
        this.redo();
        break;
      case 'reset':
        // ⇧R asks; ⇧R again, with the question open, answers yes.
        if (this.resetOpen()) {
          this.reset();
          this.resetOpen.set(false);
        } else {
          this.resetOpen.set(true);
        }
        break;
    }
  }

  // --- Internals ---------------------------------------------------------------------------------

  private lockedFields(): DesignLocks {
    return this.locks();
  }

  private travel(code: string | null): void {
    if (code === null) return;
    this.historyVersion.update(version => version + 1);

    const params = new URLSearchParams(code);
    const { design, custom } = parseCreateParams({ keys: Array.from(params.keys()), get: name => params.get(name) });
    this.latest = design;
    this.latestCustom = custom;
    this.draft.set(null);
    this.navigate(design, this.item(), true);
  }

  /** Remembers the last solid-menu accent: a translucent menu forces `subtle`, and going back restores it. */
  private withMenuMemory(partial: Partial<DesignConfig>): DesignConfig {
    const current = this.latest;
    if (current.menuAppearance === 'solid') this.lastSolidAccent = current.menuAccent;

    const next: Partial<DesignConfig> = { ...partial };
    // A style that forced the radius gave it back: restore what the user had picked, as shadcn does.
    if (!partial.radius && partial.style && isRadiusForced(current)) next.radius = this.chosenRadius;
    if (partial.menuAppearance === 'solid' && current.menuAppearance === 'translucent' && !partial.menuAccent) {
      next.menuAccent = this.lastSolidAccent;
    }

    const result = normalizeDesign({ ...current, ...next });
    if (partial.radius && !isRadiusForced(result)) this.chosenRadius = result.radius;
    return result;
  }

  private navigate(design: DesignConfig, item: string, replaceUrl: boolean): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: serializeCreateParams(design, item, this.latestCustom),
      replaceUrl,
    });
  }
}

/** One undo/redo entry: the design and, while Custom is on, its custom theme — as the query string that holds them. */
function historyKey(design: DesignConfig, custom: CustomTheme | null): string {
  return new URLSearchParams(serializeCreateParams(design, DEFAULT_ITEM, custom)).toString();
}

/**
 * Whether the style, rather than the user, decided the radius: lyra and sera square it, and rhea has no large (so
 * `default` there may be a stand-in).
 */
function isRadiusForced(design: DesignConfig): boolean {
  return design.style === 'lyra' || design.style === 'sera' || (design.style === 'rhea' && design.radius === 'default');
}
