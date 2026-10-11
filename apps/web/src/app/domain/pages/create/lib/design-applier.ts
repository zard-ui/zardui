import { INHERIT_FONT, renderTokenBlocks, resolveFonts, resolveTokens } from '@zard/design';
import type { DesignConfig, IconLibraryId, StyleId } from '@zard/design';

import { IconSwapper } from './icon-families';

const THEME_STYLE_ID = 'zard-create-theme';

/** The floating surfaces the "Menu" options restyle. They live in the CDK overlay, outside the canvas. */
const MENU_SURFACES = [
  "[data-slot='popover-content']",
  "[data-slot='hover-card-content']",
  "[data-slot='select-content']",
  "[data-slot='dropdown-menu-content']",
  "[data-slot='dropdown-menu-sub-content']",
  "[data-slot='combobox-content']",
  "[data-slot='tooltip-content']",
].join(', ');

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

    body.dataset['style'] = design.style;
  }

  destroy(): void {
    this.icons.destroy();
    this.document.getElementById(THEME_STYLE_ID)?.remove();
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

    const dark = resolveTokens(design).dark;
    const inverted = Object.entries(dark)
      .filter(([key]) => key !== 'radius')
      .map(([key, value]) => `  --${key}: ${value};`)
      .join('\n');

    element.textContent = [
      renderTokenBlocks(design),
      `body.menu-inverted :is(${MENU_SURFACES}) {\n${inverted}\n  color-scheme: dark;\n}`,
      `body.menu-translucent :is(${MENU_SURFACES}) {\n  background-color: color-mix(in oklab, var(--popover) 80%, transparent);\n  backdrop-filter: blur(16px);\n}`,
    ].join('\n\n');
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
