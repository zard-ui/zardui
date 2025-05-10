import { render } from '@testing-library/angular';
import { ZardDividerComponent } from './divider.component';

describe('ZardDividerComponent', () => {
  it('should render vertical when zOrientation is set to vertical', async () => {
    const { container } = await render(ZardDividerComponent, {
      componentProperties: { zOrientation: 'vertical' },
    });

    const divider = container.querySelector('div');
    expect(divider).toBeTruthy();
    expect(divider?.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('should render horizontal by default', async () => {
    const { container } = await render(ZardDividerComponent);

    const divider = container.querySelector('div');
    expect(divider).toBeTruthy();
    expect(divider?.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('should apply custom classes', async () => {
    const { container } = await render(ZardDividerComponent, {
      componentProperties: { class: 'custom-class' },
    });

    const divider = container.querySelector('div');
    expect(divider).toBeTruthy();
    expect(divider?.classList.contains('custom-class')).toBe(true);
  });
});
