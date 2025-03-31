import { render } from '@testing-library/angular';

import { ZardDividerComponent } from './divider.component';

describe('ZardDividerComponent', () => {
  it('should render horizontal by default', async () => {
    const { container } = await render(ZardDividerComponent);
    const divider = container.querySelector('div');
    expect(divider?.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('should render vertical when set', async () => {
    const { container } = await render(ZardDividerComponent, {
      componentProperties: { zOrientation: 'vertical' },
    });
    const divider = container.querySelector('div');
    expect(divider?.getAttribute('aria-orientation')).toBe('vertical');
  });
});
