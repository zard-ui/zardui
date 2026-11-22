import { DEFAULT_DESIGN } from '@zard/design';
import type { StyleId } from '@zard/design';

import { DESIGN_PENDING_ATTRIBUTE, DesignApplier, loadStyleSheet } from './design-applier';

const linkFor = (style: StyleId): HTMLLinkElement | null =>
  document.getElementById(`zard-create-style-${style}`) as HTMLLinkElement | null;

describe('design applier styles', () => {
  beforeEach(() => {
    // The test DOM cannot parse the style-marker selector the applier uses to find menus; there are none here.
    jest.spyOn(document, 'querySelectorAll').mockReturnValue([] as unknown as NodeListOf<Element>);
    document.head.innerHTML = '';
    document.body.className = '';
    document.documentElement.setAttribute(DESIGN_PENDING_ATTRIBUTE, '');
  });

  it('needs no sheet for the default look', async () => {
    await loadStyleSheet(document, 'nova');

    expect(document.head.querySelector('link')).toBeNull();
  });

  it('links only the sheet of the style asked for, once', () => {
    void loadStyleSheet(document, 'lyra');
    void loadStyleSheet(document, 'lyra');

    expect(document.head.querySelectorAll('link[rel="stylesheet"]')).toHaveLength(1);
    expect(linkFor('lyra')?.getAttribute('href')).toBe('/create-style-lyra.css');
    expect(linkFor('maia')).toBeNull();
  });

  it('resolves when the sheet fails, so a design still shows', async () => {
    const loaded = loadStyleSheet(document, 'mira');
    linkFor('mira')?.dispatchEvent(new Event('error'));

    await expect(loaded).resolves.toBeUndefined();
    await expect(loadStyleSheet(document, 'mira')).resolves.toBeUndefined();
  });

  it('keeps the previous look, and the page hidden, until the new sheet has loaded', async () => {
    const applier = new DesignApplier(document);
    document.body.classList.add('style-nova');

    const applied = applier.apply({ ...DEFAULT_DESIGN, style: 'lyra' }, false);
    expect(document.body.classList.contains('style-lyra')).toBe(false);
    expect(document.body.classList.contains('style-nova')).toBe(true);
    expect(document.documentElement.hasAttribute(DESIGN_PENDING_ATTRIBUTE)).toBe(true);

    linkFor('lyra')?.dispatchEvent(new Event('load'));
    await applied;

    expect(document.body.classList.contains('style-lyra')).toBe(true);
    expect(document.body.classList.contains('style-nova')).toBe(false);
    expect(document.documentElement.hasAttribute(DESIGN_PENDING_ATTRIBUTE)).toBe(false);
    applier.destroy();
  });

  it('lets the newest design win when sheets arrive out of order', async () => {
    const applier = new DesignApplier(document);

    const first = applier.apply({ ...DEFAULT_DESIGN, style: 'lyra' }, false);
    const second = applier.apply({ ...DEFAULT_DESIGN, style: 'maia' }, false);
    linkFor('maia')?.dispatchEvent(new Event('load'));
    linkFor('lyra')?.dispatchEvent(new Event('load'));
    await Promise.all([first, second]);

    expect(document.body.classList.contains('style-maia')).toBe(true);
    expect(document.body.classList.contains('style-lyra')).toBe(false);
    applier.destroy();
  });
  afterEach(() => jest.restoreAllMocks());
});
