import { Directionality } from '@angular/cdk/bidi';
import { signal } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { Subject } from 'rxjs';

import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

import { ZardCarouselComponent } from './carousel.component';
import { carouselNextButtonVariants, carouselPreviousButtonVariants } from './carousel.variants';

async function setup(direction: 'ltr' | 'rtl') {
  const view = await render(ZardCarouselComponent, {
    providers: [
      { provide: EVENT_MANAGER_PLUGINS, useClass: ZardEventManagerPlugin, multi: true },
      {
        provide: Directionality,
        useValue: { value: direction, valueSignal: signal(direction), change: new Subject() },
      },
    ],
  });
  const next = jest.spyOn(view.fixture.componentInstance, 'slideNext').mockImplementation();
  const previous = jest.spyOn(view.fixture.componentInstance, 'slidePrevious').mockImplementation();
  return { next, previous, region: view.container.querySelector('[role="region"]') as HTMLElement };
}

describe('ZardCarouselComponent direction', () => {
  it('ArrowLeft goes to the next slide and ArrowRight to the previous one in RTL', async () => {
    const { next, previous, region } = await setup('rtl');
    const user = userEvent.setup();

    region.focus();
    await user.keyboard('{ArrowLeft}');
    expect(next).toHaveBeenCalledTimes(1);
    expect(previous).not.toHaveBeenCalled();

    await user.keyboard('{ArrowRight}');
    expect(previous).toHaveBeenCalledTimes(1);
  });

  it('ArrowRight goes to the next slide and ArrowLeft to the previous one in LTR', async () => {
    const { next, previous, region } = await setup('ltr');
    const user = userEvent.setup();

    region.focus();
    await user.keyboard('{ArrowRight}');
    expect(next).toHaveBeenCalledTimes(1);

    await user.keyboard('{ArrowLeft}');
    expect(previous).toHaveBeenCalledTimes(1);
  });

  it('places the arrows with logical offsets and flips them in RTL', () => {
    const previous = carouselPreviousButtonVariants({ zOrientation: 'horizontal' });
    const next = carouselNextButtonVariants({ zOrientation: 'horizontal' });

    expect(previous).toContain('-start-12');
    expect(next).toContain('-end-12');
    expect(previous).toContain('rtl:rotate-180');
    expect(next).toContain('rtl:rotate-180');
    expect(previous).not.toMatch(/(^|\s)(ltr:|rtl:)?-?(left|right)-12/);
  });
});
