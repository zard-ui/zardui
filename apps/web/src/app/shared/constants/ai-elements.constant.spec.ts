import { AI_ELEMENTS, componentLabel, isAiElementAvailable } from './ai-elements.constant';
import { AI_ELEMENTS_PATH } from './routes.constant';

describe('AI Elements', () => {
  // The sidebar lists the patterns as literal entries (the prerender script reads them with a regular
  // expression), so it is a second copy of AI_ELEMENTS that has to stay in step with it.
  it('lists every pattern in the sidebar, in the same order and with the same availability', () => {
    const [overview, ...patterns] = AI_ELEMENTS_PATH.data;

    expect(overview.path).toBe('/docs/ai-elements');
    expect(patterns.map(({ name, path, available }) => ({ name, path, available }))).toEqual(
      AI_ELEMENTS.map(entry => ({
        name: entry.name,
        path: `/docs/ai-elements/${entry.slug}`,
        available: isAiElementAvailable(entry),
      })),
    );
  });

  it('only lists as missing a component the pattern is built with', () => {
    for (const entry of AI_ELEMENTS) {
      for (const missing of entry.requires ?? []) {
        expect(entry.builtWith).toContain(missing);
      }
    }
  });

  it('names a component the way the sidebar does', () => {
    expect(componentLabel('input-group')).toBe('Input Group');
    expect(componentLabel('trace')).toBe('Trace');
  });
});
