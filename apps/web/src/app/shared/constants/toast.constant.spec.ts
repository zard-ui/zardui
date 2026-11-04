import { COMPONENTS_REGISTRY } from './components.constant';
import { COMPONENTS_PATH } from './routes.constant';

/**
 * Toast is the components-list face of Sonner, as in shadcn/ui. It has no files
 * of its own, so everything that makes it findable is wiring: the registry
 * entry, the sidebar item, and the page it points at.
 */
describe('Toast entry', () => {
  const entry = COMPONENTS_REGISTRY.find(item => item.componentName === 'toast');

  it('is registered in the components list under a category', () => {
    expect(entry).toBeDefined();
    expect(entry?.category).toBe('Feedback & Status');
    expect(entry?.description.length).toBeGreaterThan(0);
  });

  it('has a sidebar item that routes to its page', () => {
    const item = COMPONENTS_PATH.data.find(nav => nav.path === '/docs/components/toast');

    expect(item).toMatchObject({ name: 'Toast', available: true });
  });

  it('points at the Sonner page, which exists', () => {
    expect(COMPONENTS_PATH.data.some(nav => nav.path === '/docs/components/sonner')).toBe(true);
    expect(COMPONENTS_REGISTRY.some(item => item.componentName === 'sonner')).toBe(true);
  });

  it('installs sonner, not a toast component', async () => {
    const data = await entry!.loadData();

    expect(data.notice).toBe('The toast component has been deprecated. Use the sonner component instead.');
    expect(data.links?.map(link => link.href)).toEqual(['/docs/components/sonner']);
    expect(data.installData?.cliAdd?.tabs.map(tab => tab.code)).toEqual(
      expect.arrayContaining([expect.stringContaining('add sonner')]),
    );
    expect(data.installData?.cliAdd?.tabs.some(tab => tab.code.includes('add toast'))).toBe(false);
  });
});
