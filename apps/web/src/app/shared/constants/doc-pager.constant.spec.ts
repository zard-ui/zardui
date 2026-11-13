import { buildDocSequence, DOC_SEQUENCE, findDocNeighbours, normalizeDocPath } from './doc-pager.constant';
import { type NavSection, SIDEBAR_PATHS } from './routes.constant';

describe('doc pager', () => {
  const shortcuts: NavSection = {
    title: 'Sections',
    data: [
      { name: 'Introduction', path: '/docs/introduction', available: true },
      { name: 'Installation', path: '/docs/installation', available: true },
    ],
  };
  const components: NavSection = {
    title: 'Components',
    data: [
      { name: 'Tooltip', path: '/docs/components/tooltip', available: true },
      { name: 'Typography', path: '/docs/typeset', available: true },
      { name: 'Soon', path: '/docs/components/soon', available: false },
    ],
  };
  const gettingStarted: NavSection = {
    title: 'Get Started',
    data: [
      { name: 'Installation', path: '/docs/installation', available: true },
      { name: 'Typeset', path: '/docs/typeset', available: true },
      { name: 'Figma', path: '/docs/figma', available: true },
      { name: 'llms.txt', path: '/llms.txt', available: true, external: true },
      { name: 'Roadmap', path: '/docs/roadmap', available: true },
    ],
  };
  const sequence = buildDocSequence([shortcuts, components, gettingStarted]);
  const paths = sequence.map(item => item.path);

  it('follows the sidebar top to bottom, keeping a repeated page at its first place', () => {
    expect(paths).toEqual([
      '/docs/introduction',
      '/docs/installation',
      '/docs/components/tooltip',
      '/docs/typeset',
      '/docs/figma',
      '/docs/roadmap',
    ]);
  });

  it('skips llms.txt, so the page before it links straight to the one after it', () => {
    expect(findDocNeighbours('/docs/figma', sequence).next?.path).toBe('/docs/roadmap');
    expect(findDocNeighbours('/docs/roadmap', sequence).previous?.path).toBe('/docs/figma');
  });

  it('goes from Tooltip to Typography and back', () => {
    expect(findDocNeighbours('/docs/components/tooltip', sequence).next?.name).toBe('Typography');
    expect(findDocNeighbours('/docs/typeset', sequence).previous?.name).toBe('Tooltip');
  });

  it('has no previous on the first page and no next on the last one', () => {
    expect(findDocNeighbours('/docs/introduction', sequence).previous).toBeNull();
    expect(findDocNeighbours('/docs/roadmap', sequence).next).toBeNull();
  });

  it('ignores the query, the fragment and a trailing slash', () => {
    expect(normalizeDocPath('/docs/components/tooltip/?tab=api#usage')).toBe('/docs/components/tooltip');
    expect(findDocNeighbours('/docs/typeset#overview', sequence).next?.path).toBe('/docs/figma');
  });

  it('shows nothing on a page outside the docs sequence', () => {
    expect(findDocNeighbours('/blocks', sequence)).toEqual({ previous: null, next: null });
  });

  describe('the real sidebar', () => {
    const realPaths = DOC_SEQUENCE.map(item => item.path);
    const sidebarPages = SIDEBAR_PATHS.flatMap(section => section.data).filter(
      item => item.available && !item.external,
    );

    it('lists every page once and never llms.txt', () => {
      expect(new Set(realPaths).size).toBe(realPaths.length);
      expect(realPaths).not.toContain('/llms.txt');
    });

    it('is the sidebar order, minus the repeats', () => {
      const firstPlaces = sidebarPages.filter(
        (item, index) => sidebarPages.findIndex(other => other.path === item.path) === index,
      );
      expect(realPaths).toEqual(firstPlaces.map(item => item.path));
    });

    it('starts like the sidebar: Introduction, Components, Installation', () => {
      expect(realPaths.slice(0, 3)).toEqual(['/docs/introduction', '/docs/components', '/docs/installation']);
    });

    it('steps over llms.txt in Get Started', () => {
      expect(findDocNeighbours('/docs/figma').next?.path).toBe('/docs/pre-processors');
      expect(findDocNeighbours('/docs/pre-processors').previous?.path).toBe('/docs/figma');
    });
  });
});
