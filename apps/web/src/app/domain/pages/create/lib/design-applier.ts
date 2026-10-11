import { INHERIT_FONT, renderTokenBlocks, resolveFonts } from '@zard/design';
import type { DesignConfig, IconLibraryId, StyleId } from '@zard/design';

import { IconSwapper } from './icon-families';

const THEME_STYLE_ID = 'zard-create-theme';

const STYLE_CLASS_PREFIX = 'style-';

/**
 * Applies a design to a document without reloading it. The `/create` preview calls this on every `design` message.
 *
 *  - style: `style-<id>` on `<body>` (the contract the style CSS keys off)
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

  constructor(private readonly document: Document) {
    this.icons = new IconSwapper(document);
  }

  apply(design: DesignConfig, dark: boolean): void {
    const { body, documentElement } = this.document;

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
    this.icons.destroy();
    this.menuObserver?.disconnect();
    this.document.getElementById(THEME_STYLE_ID)?.remove();
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
