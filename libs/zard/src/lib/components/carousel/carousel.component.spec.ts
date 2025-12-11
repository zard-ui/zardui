import { CommonModule } from '@angular/common';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { screen } from '@testing-library/angular';
import { type EmblaCarouselType } from 'embla-carousel';

import { ZardCarouselComponent } from './carousel.component';
import { ZardEventManagerPlugin } from '../../core/provider/event-manager-plugins/zard-event-manager-plugin';

describe('ZardCarouselComponent', () => {
  let component: ZardCarouselComponent;
  let fixture: ComponentFixture<ZardCarouselComponent>;
  let mockEmblaApi: jest.Mocked<EmblaCarouselType>;

  beforeEach(async () => {
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

    await TestBed.configureTestingModule({
      imports: [ZardCarouselComponent, CommonModule],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardCarouselComponent);
    component = fixture.componentInstance;

    // Initialize carousel with mock
    component.onEmblaChange('init', mockEmblaApi);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle slide navigation', () => {
    // Simulate next slide
    mockEmblaApi.selectedScrollSnap.mockReturnValue(1);
    mockEmblaApi.canScrollPrev.mockReturnValue(true);
    component.onEmblaChange('select', mockEmblaApi);
    fixture.detectChanges();

    expect(component['selectedIndex']()).toBe(1);
    expect(component['canScrollPrev']()).toBeTruthy();
  });

  it('should emit selected event on user interaction', () => {
    const emitSpy = jest.spyOn(component.zSelected, 'emit');

    // Simulate user click and slide change
    const btnNext = screen.getByLabelText('Next slide');
    btnNext.click();
    mockEmblaApi.selectedScrollSnap.mockReturnValue(1);
    component.onEmblaChange('select', mockEmblaApi);
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should handle button interaction', () => {
    const emitSpy = jest.spyOn(component.zSelected, 'emit');

    // Simulate drag end and slide change
    screen.getByLabelText('Next slide').click();
    mockEmblaApi.selectedScrollSnap.mockReturnValue(1);
    mockEmblaApi.scrollProgress.mockReturnValue(1);
    mockEmblaApi.canScrollPrev.mockReturnValue(true);
    component.onEmblaChange('select', mockEmblaApi);
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalled();
    expect(component['selectedIndex']()).toBe(1);
    expect(mockEmblaApi.canScrollPrev()).toBeTruthy();

    screen.getByLabelText('Previous slide').click();
    mockEmblaApi.selectedScrollSnap.mockReturnValue(0);
    mockEmblaApi.scrollProgress.mockReturnValue(0);
    mockEmblaApi.canScrollPrev.mockReturnValue(false);
    component.onEmblaChange('select', mockEmblaApi);
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalled();
    expect(component['selectedIndex']()).toBe(0);
    expect(mockEmblaApi.canScrollPrev()).toBeFalsy();
  });

  it('should handle dot interaction', () => {
    const emitSpy = jest.spyOn(component.zSelected, 'emit');
    fixture.componentRef.setInput('zControls', 'dot');
    fixture.detectChanges();

    // Simulate drag end and slide change
    screen.getAllByRole('button')[0].click();
    mockEmblaApi.selectedScrollSnap.mockReturnValue(1);
    mockEmblaApi.scrollProgress.mockReturnValue(1);
    mockEmblaApi.canScrollPrev.mockReturnValue(true);
    component.onEmblaChange('select', mockEmblaApi);
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalled();
    expect(component['selectedIndex']()).toBe(1);
    expect(mockEmblaApi.canScrollPrev()).toBeTruthy();
  });

  it('should handle drag interaction correctly', () => {
    const emitSpy = jest.spyOn(component.zSelected, 'emit');

    // Simulate drag sequence
    component.onEmblaChange('pointerDown', mockEmblaApi);

    // During drag
    mockEmblaApi.selectedScrollSnap.mockReturnValue(0);
    mockEmblaApi.scrollProgress.mockReturnValue(0.5);
    component.onEmblaChange('scroll', mockEmblaApi);

    // Drag ends on next slide
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

  it('should handle edge cases', () => {
    // Test reaching last slide
    mockEmblaApi.selectedScrollSnap.mockReturnValue(2);
    mockEmblaApi.canScrollNext.mockReturnValue(false);
    mockEmblaApi.canScrollPrev.mockReturnValue(true);
    component.onEmblaChange('select', mockEmblaApi);

    fixture.detectChanges();

    expect(component['canScrollNext']()).toBeFalsy();
    expect(component['canScrollPrev']()).toBeTruthy();
  });

  it('should handle keyboard navigation', () => {
    const emitSpy = jest.spyOn(component.zSelected, 'emit');
    const rootElement = fixture.debugElement.nativeElement;
    const emblaRef = component['emblaRef']();

    if (emblaRef) {
      emblaRef.scrollNext = jest.fn();
      emblaRef.scrollPrev = jest.fn();
    }

    // Test right arrow key
    rootElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    mockEmblaApi.selectedScrollSnap.mockReturnValue(1);
    mockEmblaApi.canScrollPrev.mockReturnValue(true);
    component.onEmblaChange('select', mockEmblaApi);
    fixture.detectChanges();

    expect(component['emblaRef']()?.scrollNext).toHaveBeenCalled();
    expect(component['selectedIndex']()).toBe(1);
    expect(emitSpy).toHaveBeenCalled();

    // Test left arrow key
    rootElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    mockEmblaApi.selectedScrollSnap.mockReturnValue(0);
    mockEmblaApi.canScrollPrev.mockReturnValue(false);
    component.onEmblaChange('select', mockEmblaApi);
    fixture.detectChanges();

    expect(component['emblaRef']()?.scrollPrev).toHaveBeenCalled();
    expect(component['selectedIndex']()).toBe(0);
    expect(emitSpy).toHaveBeenCalled();
  });
});
