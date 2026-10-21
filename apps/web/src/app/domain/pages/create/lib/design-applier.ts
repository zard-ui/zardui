import { INHERIT_FONT, renderTokenBlocks, resolveFonts } from '@zard/design';
import type { DesignConfig, IconLibraryId, StyleId } from '@zard/design';

import { IconSwapper } from './icon-families';

const THEME_STYLE_ID = 'zard-create-theme';

/**
 * The seven non-default looks, one bundle each (`create-style-<id>` in `project.json`) only the preview loads, and
 * only the one a design asks for. Nova is part of the site's own CSS.
 */
const STYLE_LINK_PREFIX = 'zard-create-style-';
/** Set on `<html>` while the first design is not on screen yet; the preview hides itself meanwhile. */
export const DESIGN_PENDING_ATTRIBUTE = 'data-design-pending';
const SHEET_TIMEOUT_MS = 10_000;
const DEFAULT_STYLE: StyleId = 'nova';
const ALL_STYLES: readonly StyleId[] = ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'];

const styleLinkId = (style: StyleId): string => `${STYLE_LINK_PREFIX}${style}`;
const styleHref = (style: StyleId): string => `/create-style-${style}.css`;

/**
 * Starts fetching a style's sheet (a no-op for the default look, and for a sheet already linked) and resolves once it
 * has applied, or failed: a missing sheet must never keep a design from showing.
 */
export function loadStyleSheet(document: Document, style: StyleId): Promise<void> {
  if (style === DEFAULT_STYLE) return Promise.resolve();

  let link = document.getElementById(styleLinkId(style)) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = styleLinkId(style);
    link.rel = 'stylesheet';
    link.href = styleHref(style);
    document.head.appendChild(link);
  }

  if (link.sheet || link.dataset['failed']) return Promise.resolve();

  const pending = link;
  return new Promise(resolve => {
    // A sheet that never answers must not keep the preview hidden for good.
    const timer = document.defaultView?.setTimeout(resolve, SHEET_TIMEOUT_MS);
    pending.addEventListener(
      'load',
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
    pending.addEventListener(
      'error',
      () => {
        pending.dataset['failed'] = 'true';
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });
}

const STYLE_CLASS_PREFIX = 'style-';

/**
 * Applies a design to a document without reloading it. The `/create` preview calls this on every `design` message.
 *
 *  - style: `style-<id>` on `<body>` (the contract the style CSS keys off), once that style's sheet has loaded: until
 *    then the previous look stays, so a slow connection never shows components with no style at all
 *  - colors and radius: an injected `<style>` holding the `:root` and `.dark` token blocks
 *  - fonts: `--font-sans` (and the docs' own `--font-geist-sans`) and `--font-heading`
 *  - menu: `menu-inverted` / `menu-translucent` on `<body>`, with the rules to match in the injected `<style>`
 *  - icons: every `<ng-icon>` redrawn in the chosen family
 */
export class DesignApplier {
  private readonly icons: IconSwapper;
  private iconLibrary: IconLibraryId | null = null;
  private inverted = false;
  private menuObserver: MutationObserver | null = null;
  private latest = 0;
  private idleHandle: number | null = null;

  constructor(private readonly document: Document) {
    this.icons = new IconSwapper(document);
  }

  /**
   * Applies a design, resolving once it is on screen. A design whose style sheet is still on its way waits for it
   * (the newest design wins if several queue up), and the other sheets are fetched when the page is idle.
   */
  async apply(design: DesignConfig, dark: boolean): Promise<void> {
    const request = ++this.latest;

    await loadStyleSheet(this.document, design.style);
    if (request !== this.latest) return;

    this.render(design, dark);
    this.prefetchOtherStyles(design.style);
  }

  private render(design: DesignConfig, dark: boolean): void {
    const { body, documentElement } = this.document;

    documentElement.removeAttribute(DESIGN_PENDING_ATTRIBUTE);
    documentElement.classList.toggle('dark', dark);
    this.applyBodyClasses(design, dark);
    this.applyTheme(design);
    this.applyFonts(design);

    if (design.iconLibrary !== this.iconLibrary) {
      this.iconLibrary = design.iconLibrary;
      void this.icons.setFamily(design.iconLibrary);
    }

    this.setInvertedMenus(design.menuColor === 'inverted' && !dark);
    body.dataset['style'] = design.style;
  }

  destroy(): void {
    this.latest = Infinity;
    const view = this.document.defaultView;
    if (view && this.idleHandle !== null) {
      if (typeof view.cancelIdleCallback === 'function') view.cancelIdleCallback(this.idleHandle);
      else view.clearTimeout(this.idleHandle);
    }
    this.icons.destroy();
    this.menuObserver?.disconnect();
    this.document.getElementById(THEME_STYLE_ID)?.remove();
  }

  /**
   * The sheets a later design may ask for are fetched at the lowest priority, once the page is idle, so picking a
   * style is not a download. They are only fetched, never applied: no `<link rel="stylesheet">` until asked for.
   */
  private prefetchOtherStyles(current: StyleId): void {
    const view = this.document.defaultView;
    if (!view || this.idleHandle !== null) return;

    const prefetch = (): void => {
      for (const style of ALL_STYLES) {
        if (style === DEFAULT_STYLE || style === current) continue;

        const id = `prefetch-${styleLinkId(style)}`;
        if (this.document.getElementById(id)) continue;

        const link = this.document.createElement('link');
        link.id = id;
        link.rel = 'prefetch';
        link.as = 'style';
        link.href = styleHref(style);
        this.document.head.appendChild(link);
      }
    };

    this.idleHandle =
      typeof view.requestIdleCallback === 'function'
        ? view.requestIdleCallback(prefetch, { timeout: 8000 })
        : view.setTimeout(prefetch, 3000);
  }

  /**
   * An inverted menu reads the dark tokens, which needs a `dark` class on the surface itself — CSS cannot add it.
   * Overlays appear and disappear, so an observer keeps every `.cn-menu-target` in step while it is on.
   */
  private setInvertedMenus(on: boolean): void {
    this.inverted = on;
    this.sync();

    const view = this.document.defaultView;
    if (!view || this.menuObserver) return;

    this.menuObserver = new view.MutationObserver(() => this.sync());
    this.menuObserver.observe(this.document.body, { childList: true, subtree: true });
  }

  private sync(): void {
    this.document.querySelectorAll('.cn-menu-target').forEach(node => node.classList.toggle('dark', this.inverted));
  }

  private applyBodyClasses(design: DesignConfig, dark: boolean): void {
    const { classList } = this.document.body;

    for (const name of Array.from(classList)) {
      if (name.startsWith(STYLE_CLASS_PREFIX) || name.startsWith('menu-')) classList.remove(name);
    }

    const style: StyleId = design.style;
    classList.add(`${STYLE_CLASS_PREFIX}${style}`);
    // An inverted menu is a dark menu: in dark mode it is already dark, so there is nothing to invert.
    if (design.menuColor === 'inverted' && !dark) classList.add('menu-inverted');
    if (design.menuAppearance === 'translucent') classList.add('menu-translucent');
  }

  private applyTheme(design: DesignConfig): void {
    let element = this.document.getElementById(THEME_STYLE_ID) as HTMLStyleElement | null;
    if (!element) {
      element = this.document.createElement('style');
      element.id = THEME_STYLE_ID;
      this.document.head.appendChild(element);
    }

    element.textContent = renderTokenBlocks(design);
  }

  private applyFonts(design: DesignConfig): void {
    const root = this.document.documentElement;
    const { body, heading } = resolveFonts(design);

    root.style.setProperty('--font-sans', body.family);
    // The docs site draws `font-sans` from its own variable; pointing it at the chosen font swaps the whole page.
    root.style.setProperty('--font-geist-sans', body.family);
    root.style.setProperty('--font-heading', heading ? heading.family : body.family);

    root.dataset['headingFont'] = design.fontHeading === INHERIT_FONT ? 'inherit' : design.fontHeading;
  }
}
