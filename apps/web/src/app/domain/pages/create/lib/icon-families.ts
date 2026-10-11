import type { IconLibraryId } from '@zard/design';

type IconTable = Readonly<Record<string, string>>;

/** One chunk per family: a table of static imports the bundler can tree-shake, fetched when first chosen. */
const LOADERS: Record<IconLibraryId, () => Promise<IconTable>> = {
  lucide: () => import('../data/icons/lucide').then(m => m.ICONS),
  tabler: () => import('../data/icons/tabler').then(m => m.ICONS),
  hugeicons: () => import('../data/icons/hugeicons').then(m => m.ICONS),
  phosphor: () => import('../data/icons/phosphor').then(m => m.ICONS),
  remixicon: () => import('../data/icons/remixicon').then(m => m.ICONS),
};

const SWAPPED_ATTRIBUTE = 'data-zard-family';

const cache = new Map<IconLibraryId, Promise<IconTable>>();

export function loadIconTable(family: IconLibraryId): Promise<IconTable> {
  let table = cache.get(family);
  if (!table) {
    table = LOADERS[family]();
    cache.set(family, table);
  }
  return table;
}

function normalize(document: Document, svg: string): SVGElement | null {
  const template = document.createElement('template');
  template.innerHTML = svg;
  return template.content.firstElementChild as SVGElement | null;
}

/**
 * Redraws every `<ng-icon>` of a document in another icon family.
 *
 * The library draws lucide icons, and the symbols are bundled into each component. Rather than touch the
 * components, the swapper recognizes an icon by its markup (the lucide table is the reverse index), looks up the
 * family's equivalent by token and rewrites the `<svg>` in place — in place, so the `NgIcon` that owns the element
 * can still remove it later. A MutationObserver keeps icons that appear afterwards (overlays, lazy cards) in step.
 */
export class IconSwapper {
  private family: IconLibraryId = 'lucide';
  private table: IconTable | null = null;
  private lucideByMarkup: Map<string, string> | null = null;
  private lucide: IconTable | null = null;
  private observer: MutationObserver | null = null;
  private generation = 0;

  constructor(private readonly document: Document) {}

  async setFamily(family: IconLibraryId): Promise<void> {
    const generation = ++this.generation;
    this.family = family;

    const [lucide, table] = await Promise.all([loadIconTable('lucide'), loadIconTable(family)]);
    if (generation !== this.generation) return;

    this.lucide = lucide;
    this.table = table;
    this.lucideByMarkup ??= this.indexLucide(lucide);

    this.startObserving();
    this.sweep(this.document.body);
  }

  destroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  private indexLucide(lucide: IconTable): Map<string, string> {
    const index = new Map<string, string>();
    for (const [token, svg] of Object.entries(lucide)) {
      const key = normalize(this.document, svg)?.outerHTML;
      if (key && !index.has(key)) index.set(key, token);
    }
    return index;
  }

  private startObserving(): void {
    if (this.observer || !this.document.defaultView) return;

    const View = this.document.defaultView;
    this.observer = new View.MutationObserver(records => {
      for (const record of records) {
        const target = record.target as Element;
        if (target.tagName === 'NG-ICON') this.swap(target);
        record.addedNodes.forEach(node => {
          if (node.nodeType === 1) this.sweep(node as Element);
        });
      }
    });
    this.observer.observe(this.document.body, { childList: true, subtree: true });
  }

  private sweep(root: Element): void {
    if (root.tagName === 'NG-ICON') this.swap(root);
    root.querySelectorAll('ng-icon').forEach(icon => this.swap(icon));
  }

  private swap(icon: Element): void {
    const svg = icon.querySelector(':scope > svg');
    if (!svg || !this.table || !this.lucide || !this.lucideByMarkup) return;

    const swapped = svg.getAttribute(SWAPPED_ATTRIBUTE);
    if (swapped === this.family) return;

    // The token comes from the lucide markup the component drew, or from the mark a previous swap left.
    const token = swapped ? icon.getAttribute('data-zard-token') : this.lucideByMarkup.get(svg.outerHTML);
    if (!token) return;

    const markup = this.table[token] ?? this.lucide[token];
    const next = markup ? normalize(this.document, markup) : null;
    if (!next) return;

    this.rewrite(svg as SVGElement, next);
    svg.setAttribute(SWAPPED_ATTRIBUTE, this.family);
    icon.setAttribute('data-zard-token', token);
  }

  private rewrite(target: SVGElement, source: SVGElement): void {
    for (const name of target.getAttributeNames()) {
      if (name !== SWAPPED_ATTRIBUTE && !source.hasAttribute(name)) target.removeAttribute(name);
    }
    for (const name of source.getAttributeNames()) {
      target.setAttribute(name, source.getAttribute(name) ?? '');
    }
    target.innerHTML = source.innerHTML;
  }
}
