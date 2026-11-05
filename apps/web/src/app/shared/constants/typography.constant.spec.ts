import { COMPONENTS_REGISTRY } from './components.constant';
import { COMPONENTS_PATH, SECTIONS } from './routes.constant';
import { COMPONENTS_ROUTES } from '../../domain/pages/component/component.routes';

/**
 * As in shadcn/ui, Typography is not a component page: it is the components-list entry for Typeset and opens the
 * Typeset docs.
 */
describe('Typography entry', () => {
  it('is listed among the components and opens the Typeset docs', () => {
    const item = COMPONENTS_PATH.data.find(nav => nav.name === 'Typography');

    expect(item).toEqual({ name: 'Typography', path: '/docs/typeset', available: true });
    expect(SECTIONS.data.some(nav => nav.path === '/docs/typeset')).toBe(true);
  });

  it('has no component page of its own', () => {
    expect(COMPONENTS_REGISTRY.some(entry => entry.componentName === 'typography')).toBe(false);
  });

  it('redirects the old component URL to the Typeset docs', () => {
    const route = COMPONENTS_ROUTES.find(r => r.path === 'typography');

    expect(route).toMatchObject({ pathMatch: 'full', redirectTo: '/docs/typeset' });
    expect(COMPONENTS_ROUTES.indexOf(route!)).toBeLessThan(
      COMPONENTS_ROUTES.findIndex(r => r.path === ':componentName'),
    );
  });
});
