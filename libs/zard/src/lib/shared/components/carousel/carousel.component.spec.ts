import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { type EmblaCarouselType } from 'embla-carousel';

import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

import { ZardCarouselComponent } from './carousel.component';

const SHARED_PROVIDERS = [
  {
    provide: EVENT_MANAGER_PLUGINS,
    useClass: ZardEventManagerPlugin,
    multi: true,
  },
];

describe('ZardCarouselComponent', () => {
  let mockEmblaApi: jest.Mocked<EmblaCarouselType>;

  beforeEach(() => {
    // Create comprehensive mock of Embla API
    mockEmblaApi = {
      scrollNext: jest.fn(),
      scrollPrev: jest.fn(),
      selectedScrollSnap: jest.fn().mockReturnValue(0),
      canScrollNext: jest.fn().mockReturnValue(true),
      canScrollPrev: jest.fn().mockReturnValue(false),
      scrollSnapList: jest.fn().mockReturnValue([0, 1, 2]),
      scrollProgress: jest.fn().mockReturnValue(0),
      scrollTo: jest.fn(),
      containerNode: jest.fn().mockReturnValue(document.createElement('div')),
      rootNode: jest.fn().mockReturnValue(document.createElement('div')),
      slidesInView: jest.fn().mockReturnValue([0]),
      slideNodes: jest.fn().mockReturnValue([]),
    } as unknown as jest.Mocked<EmblaCarouselType>;
  });

  it('creates successfully', async () => {
    await render(ZardCarouselComponent, {
      providers: SHARED_PROVIDERS,
    });
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('handles slide navigation', async () => {
    const { fixture } = await render(ZardCarouselComponent, {
      providers: SHARED_PROVIDERS,
    });
    const component = fixture.componentInstance;
    component.onEmblaChange('init', mockEmblaApi);

    mockEmblaApi.selectedScrollSnap.mockReturnValue(1);
    mockEmblaApi.canScrollPrev.mockReturnValue(true);
    component.onEmblaChange('select', mockEmblaApi);
    fixture.detectChanges();

    expect(component['selectedIndex']()).toBe(1);
    expect(component['canScrollPrev']()).toBeTruthy();
  });

  it('emits selected event on user interaction', async () => {
    const { fixture } = await render(ZardCarouselComponent, {
      providers: SHARED_PROVIDERS,
    });
    const component = fixture.componentInstance;
    const emitSpy = jest.spyOn(component.zSelected, 'emit');
    const slideNextSpy = jest.spyOn(component, 'slideNext');
    component.onEmblaChange('init', mockEmblaApi);

    await userEvent.click(screen.getByLabelText('Next slide'));
    mockEmblaApi.selectedScrollSnap.mockReturnValue(1);
    component.onEmblaChange('select', mockEmblaApi);
    fixture.detectChanges();

    expect(slideNextSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('handles button interaction', async () => {
    const { fixture } = await render(ZardCarouselComponent, {
      providers: SHARED_PROVIDERS,
    });
    const component = fixture.componentInstance;
    const emitSpy = jest.spyOn(component.zSelected, 'emit');
    const slideNextSpy = jest.spyOn(component, 'slideNext');
    const slidePrevSpy = jest.spyOn(component, 'slidePrevious');
    component.onEmblaChange('init', mockEmblaApi);

    await userEvent.click(screen.getByLabelText('Next slide'));
    mockEmblaApi.selectedScrollSnap.mockReturnValue(1);
    mockEmblaApi.scrollProgress.mockReturnValue(1);
    mockEmblaApi.canScrollPrev.mockReturnValue(true);
    component.onEmblaChange('select', mockEmblaApi);
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalled();
    expect(component['selectedIndex']()).toBe(1);
    expect(mockEmblaApi.canScrollPrev()).toBeTruthy();
    expect(slideNextSpy).toHaveBeenCalled();

    await userEvent.click(screen.getByLabelText('Previous slide'));
    mockEmblaApi.selectedScrollSnap.mockReturnValue(0);
    mockEmblaApi.scrollProgress.mockReturnValue(0);
    mockEmblaApi.canScrollPrev.mockReturnValue(false);
    component.onEmblaChange('select', mockEmblaApi);
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalled();
    expect(component['selectedIndex']()).toBe(0);
    expect(mockEmblaApi.canScrollPrev()).toBeFalsy();
    expect(slidePrevSpy).toHaveBeenCalled();
  });

  it('handles dot interaction', async () => {
    const { fixture } = await render(ZardCarouselComponent, {
      componentInputs: { zControls: 'dot' },
      providers: SHARED_PROVIDERS,
    });
    const component = fixture.componentInstance;
    const emitSpy = jest.spyOn(component.zSelected, 'emit');

    // Manually set scroll snaps to ensure dots are rendered
    component['scrollSnaps'].set([0, 1, 2]);
    fixture.detectChanges();

    await userEvent.click(screen.getByLabelText('Go to slide 2'));
    mockEmblaApi.selectedScrollSnap.mockReturnValue(1);
    mockEmblaApi.scrollProgress.mockReturnValue(1);
    mockEmblaApi.canScrollPrev.mockReturnValue(true);
    component.onEmblaChange('select', mockEmblaApi);
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalled();
    expect(component['selectedIndex']()).toBe(1);
    expect(mockEmblaApi.canScrollPrev()).toBeTruthy();
  });

  it('handles drag interaction correctly', async () => {
    const { fixture } = await render(ZardCarouselComponent, {
      providers: SHARED_PROVIDERS,
    });
    const component = fixture.componentInstance;
    const emitSpy = jest.spyOn(component.zSelected, 'emit');
    component.onEmblaChange('init', mockEmblaApi);

    component.onEmblaChange('pointerDown', mockEmblaApi);

    mockEmblaApi.selectedScrollSnap.mockReturnValue(0);
    mockEmblaApi.scrollProgress.mockReturnValue(0.5);
    component.onEmblaChange('scroll', mockEmblaApi);

    mockEmblaApi.selectedScrollSnap.mockReturnValue(1);
    mockEmblaApi.scrollProgress.mockReturnValue(1);
    mockEmblaApi.canScrollPrev.mockReturnValue(true);
    component.onEmblaChange('pointerUp', mockEmblaApi);
    component.onEmblaChange('settle', mockEmblaApi);
    component.onEmblaChange('select', mockEmblaApi);

    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalled();
    expect(component['selectedIndex']()).toBe(1);
  });

  it('handles edge cases when reaching last slide', async () => {
    const { fixture } = await render(ZardCarouselComponent, {
      providers: SHARED_PROVIDERS,
    });
    const component = fixture.componentInstance;
    component.onEmblaChange('init', mockEmblaApi);

    mockEmblaApi.selectedScrollSnap.mockReturnValue(2);
    mockEmblaApi.canScrollNext.mockReturnValue(false);
    mockEmblaApi.canScrollPrev.mockReturnValue(true);
    component.onEmblaChange('select', mockEmblaApi);

    fixture.detectChanges();

    expect(component['canScrollNext']()).toBeFalsy();
    expect(component['canScrollPrev']()).toBeTruthy();
  });

  it('handles keyboard navigation with ArrowRight and ArrowLeft keys', async () => {
    const { fixture } = await render(ZardCarouselComponent, {
      providers: SHARED_PROVIDERS,
    });
    const component = fixture.componentInstance;
    const emitSpy = jest.spyOn(component.zSelected, 'emit');

    const slideNextSpy = jest.spyOn(component, 'slideNext');
    const slidePrevSpy = jest.spyOn(component, 'slidePrevious');
    component.onEmblaChange('init', mockEmblaApi);

    // Test ArrowRight key (host listener)
    const hostElement = fixture.debugElement.nativeElement as HTMLElement;

    hostElement.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true,
      }),
    );
    mockEmblaApi.selectedScrollSnap.mockReturnValue(1);
    mockEmblaApi.canScrollPrev.mockReturnValue(true);
    component.onEmblaChange('select', mockEmblaApi);
    fixture.detectChanges();

    expect(slideNextSpy).toHaveBeenCalled();
    expect(component['selectedIndex']()).toBe(1);
    expect(emitSpy).toHaveBeenCalled();

    // Test ArrowLeft key (host listener)
    hostElement.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        bubbles: true,
        cancelable: true,
      }),
    );
    mockEmblaApi.selectedScrollSnap.mockReturnValue(0);
    mockEmblaApi.canScrollPrev.mockReturnValue(false);
    component.onEmblaChange('select', mockEmblaApi);
    fixture.detectChanges();

    expect(slidePrevSpy).toHaveBeenCalled();
    expect(component['selectedIndex']()).toBe(0);
    expect(emitSpy).toHaveBeenCalledTimes(2);
  });
});
