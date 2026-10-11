import { isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import {
  designConstraints,
  designsEqual,
  encodePreset,
  normalizeDesign,
  parsePresetInput,
  resetDesign,
  shuffleDesign,
} from '@zard/design';
import type { DesignConfig, DesignLocks, MenuAccentId } from '@zard/design';
import { ZardDarkMode } from '@zard/services/dark-mode';

import { parseCreateParams, serializeCreateParams } from '../lib/create-url';
import type { CreateAction } from '../lib/create.protocol';
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

  readonly dark = computed(() => this.darkMode.themeMode() === 'dark');
  readonly constraints = computed(() => designConstraints(this.design(), { dark: this.dark() }));

  readonly locks = signal<DesignLocks>({});

  readonly navigateOpen = signal(false);
  readonly openPresetOpen = signal(false);
  readonly resetOpen = signal(false);

  private readonly history = new PresetHistory(this.preset());
  private readonly historyVersion = signal(0);
  readonly canUndo = computed(() => (this.historyVersion(), this.history.canUndo));
  readonly canRedo = computed(() => (this.historyVersion(), this.history.canRedo));

  /** The newest design, ahead of the URL while a navigation is still in flight. */
  private latest: DesignConfig = this.design();
  private lastSolidAccent: MenuAccentId = 'subtle';

  constructor() {
    effect(() => {
      const { design, item, needsCanonicalization } = this.url();
      this.latest = design;
      if (this.design().menuAccent === 'bold') this.lastSolidAccent = 'bold';
      this.history.observe(encodePreset(design));
      this.historyVersion.update(version => version + 1);

      // A hand-typed or stale URL is rewritten in place, so what is in the address bar is always the canonical form.
      if (needsCanonicalization && this.isBrowser) this.navigate(design, item, true);
    });
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
      this.commit(parsePresetInput(input).design);
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
    this.commit(shuffleDesign(this.latest, this.lockedFields()));
  }

  reset(): void {
    this.commit(resetDesign(this.latest.style));
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

    const { design } = parseCreateParams({ keys: ['preset'], get: name => (name === 'preset' ? code : null) });
    this.latest = design;
    this.navigate(design, this.item(), true);
  }

  /** Remembers the last solid-menu accent: a translucent menu forces `subtle`, and going back restores it. */
  private withMenuMemory(partial: Partial<DesignConfig>): DesignConfig {
    const current = this.latest;
    if (current.menuAppearance === 'solid') this.lastSolidAccent = current.menuAccent;

    const next: Partial<DesignConfig> = { ...partial };
    if (partial.menuAppearance === 'solid' && current.menuAppearance === 'translucent' && !partial.menuAccent) {
      next.menuAccent = this.lastSolidAccent;
    }

    return normalizeDesign({ ...current, ...next });
  }

  private navigate(design: DesignConfig, item: string, replaceUrl: boolean): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: serializeCreateParams(design, item),
      replaceUrl,
    });
  }
}
