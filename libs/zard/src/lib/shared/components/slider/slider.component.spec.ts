import { Directionality } from '@angular/cdk/bidi';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { Subject } from 'rxjs';

import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

import {
  ZardSliderComponent,
  ZardSliderRangeComponent,
  ZardSliderThumbComponent,
  ZardSliderTrackComponent,
} from './slider.component';

@Component({
  selector: 'test-slider-host',
  imports: [ZardSliderComponent],
  template: `
    <z-slider
      [zMin]="min"
      [zMax]="max"
      [zStep]="step"
      [zValue]="value"
      [zOrientation]="orientation"
      [zDisabled]="disabled"
      [zDefault]="default"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class TestHostComponent {
  min = 0;
  max = 100;
  step = 10;
  value: number[] = [40];
  orientation = 'horizontal';
  disabled = false;
  default: number[] = [20];
}

describe('ZardSliderComponent (orientation: horizontal)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render slider with thumb, track and range', () => {
    expect(fixture.debugElement.query(By.directive(ZardSliderComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZardSliderThumbComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZardSliderTrackComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZardSliderRangeComponent))).toBeTruthy();
  });

  it('should have orientation attribute on host', () => {
    const host = fixture.debugElement.query(By.directive(ZardSliderComponent)).nativeElement;
    expect(host.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('should apply aria attributes on thumb', () => {
    const thumb = fixture.debugElement
      .query(By.directive(ZardSliderThumbComponent))
      .nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-valuemin')).toBe('0');
    expect(thumb.getAttribute('aria-valuemax')).toBe('100');
    expect(thumb.getAttribute('aria-valuenow')).toBe('40');
  });

  it('should render default CSS classes on slider container', () => {
    const slider = fixture.debugElement.query(By.css('[data-slot="slider"]')).nativeElement;
    expect(slider.classList).toContain('flex');
    expect(slider.classList).toContain('items-center');
    expect(slider.classList).toContain('w-full');
  });

  it('should render projected value into the thumb correctly', () => {
    const thumb = fixture.debugElement
      .query(By.directive(ZardSliderThumbComponent))
      .nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-valuenow')).toBe('40');
  });

  it('should set tabindex="0" on thumb', () => {
    const thumb = fixture.debugElement
      .query(By.directive(ZardSliderThumbComponent))
      .nativeElement.querySelector('span');
    expect(thumb.getAttribute('tabindex')).toBe('0');
  });

  it('should respect zDisabled input and reflect as aria-disabled', () => {
    component.value = [60];
    fixture.detectChanges();

    const thumb = fixture.debugElement
      .query(By.directive(ZardSliderThumbComponent))
      .nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-disabled')).toBeNull();

    fixture.componentInstance.value = [50];
    fixture.detectChanges();
    const compInstance = fixture.debugElement.query(By.directive(ZardSliderComponent)).componentInstance;
    compInstance.setDisabledState(true);
    fixture.detectChanges();

    expect(thumb.getAttribute('aria-disabled')).toBe('true');
  });

  it('should apply correct thumb position style (horizontal)', () => {
    const thumbHost = fixture.debugElement.query(By.directive(ZardSliderThumbComponent)).nativeElement;
    const styleLeft = thumbHost.style.left;
    expect(styleLeft).toContain('%');
  });

  it('should apply zMin, zMax, and zStep correctly', () => {
    const thumb = fixture.debugElement
      .query(By.directive(ZardSliderThumbComponent))
      .nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-valuemin')).toBe(String(component.min));
    expect(thumb.getAttribute('aria-valuemax')).toBe(String(component.max));
    expect(Number(thumb.getAttribute('aria-valuenow')) % component.step).toBe(0);
  });

  it('should reflect zValue correctly on thumb', () => {
    component.value = [70];
    fixture.detectChanges();

    const thumb = fixture.debugElement
      .query(By.directive(ZardSliderThumbComponent))
      .nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-valuenow')).toBe('70');
  });

  it('should apply zDefault as initial value if zValue is empty', () => {
    component.value = [];
    component.default = [20];
    fixture.detectChanges();

    const thumb = fixture.debugElement
      .query(By.directive(ZardSliderThumbComponent))
      .nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-valuenow')).toBe('20');
  });

  it('should round value to nearest step increment', () => {
    component.step = 25;
    component.value = [47];
    fixture.detectChanges();

    const thumb = fixture.debugElement
      .query(By.directive(ZardSliderThumbComponent))
      .nativeElement.querySelector('span');
    const value = Number(thumb.getAttribute('aria-valuenow'));
    expect(value % 25).toBe(0);
  });

  it('should move thumb with arrow keys', () => {
    const thumbDebug = fixture.debugElement.query(By.directive(ZardSliderThumbComponent));
    const thumbHost = thumbDebug.nativeElement as HTMLElement;

    thumbHost.focus();
    thumbHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();

    const ariaNow = thumbHost.querySelector('span')?.getAttribute('aria-valuenow');
    expect(+ariaNow!).toBe(50);

    thumbHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    fixture.detectChanges();

    const updatedNow = thumbHost.querySelector('span')?.getAttribute('aria-valuenow');
    expect(+updatedNow!).toBe(40);
  });

  it('should go to min with Home and to max with End key', () => {
    const thumbHost = fixture.debugElement.query(By.directive(ZardSliderThumbComponent)).nativeElement;

    thumbHost.focus();

    thumbHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    fixture.detectChanges();
    expect(thumbHost.querySelector('span')?.getAttribute('aria-valuenow')).toBe('30');

    thumbHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(thumbHost.querySelector('span')?.getAttribute('aria-valuenow')).toBe('40');

    thumbHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    fixture.detectChanges();
    expect(thumbHost.querySelector('span')?.getAttribute('aria-valuenow')).toBe('0');

    thumbHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    fixture.detectChanges();
    expect(thumbHost.querySelector('span')?.getAttribute('aria-valuenow')).toBe('100');
  });
});

describe('ZardSliderComponent (range: two thumbs)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.value = [20, 80];
    fixture.detectChanges();
  });

  it('renders two thumbs', () => {
    const thumbs = fixture.debugElement.queryAll(By.directive(ZardSliderThumbComponent));
    expect(thumbs.length).toBe(2);
  });

  it('renders one range segment between the two thumbs', () => {
    const ranges = fixture.debugElement.queryAll(By.directive(ZardSliderRangeComponent));
    const rangeHost = ranges[0].nativeElement as HTMLElement;
    const spans = rangeHost.querySelectorAll('[data-slot="slider-range"]');
    expect(spans.length).toBe(1);
  });

  it('sets aria-valuenow on each thumb to its respective value', () => {
    const thumbs = fixture.debugElement.queryAll(By.directive(ZardSliderThumbComponent));

    const first = thumbs[0].nativeElement.querySelector('span');
    const second = thumbs[1].nativeElement.querySelector('span');

    expect(first.getAttribute('aria-valuenow')).toBe('20');
    expect(second.getAttribute('aria-valuenow')).toBe('80');
  });

  it('positions both thumbs with percentage style', () => {
    const thumbs = fixture.debugElement.queryAll(By.directive(ZardSliderThumbComponent));

    expect(thumbs[0].nativeElement.style.left).toContain('%');
    expect(thumbs[1].nativeElement.style.left).toContain('%');
  });

  it('prevents first thumb from moving past the second via arrow key', () => {
    const thumbs = fixture.debugElement.queryAll(By.directive(ZardSliderThumbComponent));
    const firstThumbHost = thumbs[0].nativeElement as HTMLElement;

    firstThumbHost.focus();
    firstThumbHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    fixture.detectChanges();

    const firstValue = +firstThumbHost.querySelector('span')!.getAttribute('aria-valuenow')!;
    const secondValue = +thumbs[1].nativeElement.querySelector('span')!.getAttribute('aria-valuenow')!;

    expect(firstValue).toBeLessThanOrEqual(secondValue);
  });

  it('prevents second thumb from moving past the first via arrow key', () => {
    const thumbs = fixture.debugElement.queryAll(By.directive(ZardSliderThumbComponent));
    const secondThumbHost = thumbs[1].nativeElement as HTMLElement;

    secondThumbHost.focus();
    secondThumbHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    fixture.detectChanges();

    const firstValue = +thumbs[0].nativeElement.querySelector('span')!.getAttribute('aria-valuenow')!;
    const secondValue = +secondThumbHost.querySelector('span')!.getAttribute('aria-valuenow')!;

    expect(secondValue).toBeGreaterThanOrEqual(firstValue);
  });
});

describe('ZardSliderComponent (multiple: three thumbs)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.value = [10, 50, 90];
    fixture.detectChanges();
  });

  it('renders three thumbs', () => {
    const thumbs = fixture.debugElement.queryAll(By.directive(ZardSliderThumbComponent));
    expect(thumbs.length).toBe(3);
  });

  it('renders two range segments between the three thumbs', () => {
    const ranges = fixture.debugElement.queryAll(By.directive(ZardSliderRangeComponent));
    const rangeHost = ranges[0].nativeElement as HTMLElement;
    const spans = rangeHost.querySelectorAll('[data-slot="slider-range"]');
    expect(spans.length).toBe(2);
  });

  it('sets aria-valuenow on each thumb to its respective value', () => {
    const thumbs = fixture.debugElement.queryAll(By.directive(ZardSliderThumbComponent));

    const values = thumbs.map(t => t.nativeElement.querySelector('span').getAttribute('aria-valuenow'));
    expect(values).toEqual(['10', '50', '90']);
  });

  it('keeps middle thumb between the first and third after key input', () => {
    const thumbs = fixture.debugElement.queryAll(By.directive(ZardSliderThumbComponent));
    const middleThumbHost = thumbs[1].nativeElement as HTMLElement;

    middleThumbHost.focus();
    middleThumbHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    fixture.detectChanges();

    const firstValue = +thumbs[0].nativeElement.querySelector('span')!.getAttribute('aria-valuenow')!;
    const middleValue = +middleThumbHost.querySelector('span')!.getAttribute('aria-valuenow')!;
    const lastValue = +thumbs[2].nativeElement.querySelector('span')!.getAttribute('aria-valuenow')!;

    expect(middleValue).toBeGreaterThanOrEqual(firstValue);
    expect(middleValue).toBeLessThanOrEqual(lastValue);
  });
});

describe('ZardSliderComponent (zSlideIndexChange output)', () => {
  let fixture: ComponentFixture<TestSliderOutputHostComponent>;
  let component: TestSliderOutputHostComponent;

  @Component({
    selector: 'test-slider-output-host',
    imports: [ZardSliderComponent],
    template: `
      <z-slider [zMin]="0" [zMax]="100" [zStep]="10" [zValue]="[40]" (zSlideIndexChange)="onSlide($event)" />
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
  })
  class TestSliderOutputHostComponent {
    lastEmitted: number[] | null = null;

    onSlide(values: number[]) {
      this.lastEmitted = values;
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestSliderOutputHostComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestSliderOutputHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('emits number[] from zSlideIndexChange on arrow key press', () => {
    const thumbHost = fixture.debugElement.query(By.directive(ZardSliderThumbComponent)).nativeElement as HTMLElement;

    thumbHost.focus();
    thumbHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();

    expect(component.lastEmitted).toEqual([50]);
    expect(Array.isArray(component.lastEmitted)).toBe(true);
  });
});

describe('ZardSliderComponent (orientation: vertical)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.orientation = 'vertical';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render slider with thumb, track and range', () => {
    expect(fixture.debugElement.query(By.directive(ZardSliderComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZardSliderThumbComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZardSliderTrackComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZardSliderRangeComponent))).toBeTruthy();
  });

  it('should have orientation attribute on host', () => {
    const host = fixture.debugElement.query(By.directive(ZardSliderComponent)).nativeElement;
    expect(host.getAttribute('data-orientation')).toBe('vertical');
  });

  it('should apply aria attributes on thumb', () => {
    const thumb = fixture.debugElement
      .query(By.directive(ZardSliderThumbComponent))
      .nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-valuemin')).toBe('0');
    expect(thumb.getAttribute('aria-valuemax')).toBe('100');
    expect(thumb.getAttribute('aria-valuenow')).toBe('40');
  });

  it('should render default CSS classes on slider container', () => {
    const slider = fixture.debugElement.query(By.css('[data-slot="slider"]')).nativeElement;
    expect(slider.classList).toContain('flex');
    expect(slider.classList).toContain('data-vertical:flex-col');
    expect(slider.classList).toContain('data-vertical:h-full');
  });

  it('should render projected value into the thumb correctly', () => {
    const thumb = fixture.debugElement
      .query(By.directive(ZardSliderThumbComponent))
      .nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-valuenow')).toBe('40');
  });

  it('should set tabindex="0" on thumb', () => {
    const thumb = fixture.debugElement
      .query(By.directive(ZardSliderThumbComponent))
      .nativeElement.querySelector('span');
    expect(thumb.getAttribute('tabindex')).toBe('0');
  });

  it('should respect zDisabled input and reflect as aria-disabled', () => {
    component.value = [60];
    fixture.detectChanges();

    const thumb = fixture.debugElement
      .query(By.directive(ZardSliderThumbComponent))
      .nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-disabled')).toBeNull();

    fixture.componentInstance.value = [50];
    fixture.detectChanges();
    const compInstance = fixture.debugElement.query(By.directive(ZardSliderComponent)).componentInstance;
    compInstance.setDisabledState(true);
    fixture.detectChanges();

    expect(thumb.getAttribute('aria-disabled')).toBe('true');
  });

  it('should apply correct thumb position style (vertical)', () => {
    const thumbHost = fixture.debugElement.query(By.directive(ZardSliderThumbComponent)).nativeElement;
    const styleLeft = thumbHost.style.bottom;
    expect(styleLeft).toContain('%');
  });

  it('should apply zMin, zMax, and zStep correctly', () => {
    const thumb = fixture.debugElement
      .query(By.directive(ZardSliderThumbComponent))
      .nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-valuemin')).toBe(String(component.min));
    expect(thumb.getAttribute('aria-valuemax')).toBe(String(component.max));
    expect(Number(thumb.getAttribute('aria-valuenow')) % component.step).toBe(0);
  });

  it('should reflect zValue correctly on thumb', () => {
    component.value = [70];
    fixture.detectChanges();

    const thumb = fixture.debugElement
      .query(By.directive(ZardSliderThumbComponent))
      .nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-valuenow')).toBe('70');
  });

  it('should apply zDefault as initial value if zValue is empty', () => {
    component.value = [];
    component.default = [20];
    fixture.detectChanges();

    const thumb = fixture.debugElement
      .query(By.directive(ZardSliderThumbComponent))
      .nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-valuenow')).toBe('20');
  });

  it('should round value to nearest step increment', () => {
    component.step = 25;
    component.value = [47];
    fixture.detectChanges();

    const thumb = fixture.debugElement
      .query(By.directive(ZardSliderThumbComponent))
      .nativeElement.querySelector('span');
    const value = Number(thumb.getAttribute('aria-valuenow'));
    expect(value % 25).toBe(0);
  });

  it('should move thumb with arrow keys', () => {
    const thumbDebug = fixture.debugElement.query(By.directive(ZardSliderThumbComponent));
    const thumbHost = thumbDebug.nativeElement as HTMLElement;

    thumbHost.focus();
    thumbHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();

    const ariaNow = thumbHost.querySelector('span')?.getAttribute('aria-valuenow');
    expect(+ariaNow!).toBe(50);

    thumbHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    fixture.detectChanges();

    const updatedNow = thumbHost.querySelector('span')?.getAttribute('aria-valuenow');
    expect(+updatedNow!).toBe(40);
  });

  it('should go to min with Home and to max with End key', () => {
    const thumbHost = fixture.debugElement.query(By.directive(ZardSliderThumbComponent)).nativeElement;

    thumbHost.focus();

    thumbHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    fixture.detectChanges();
    expect(thumbHost.querySelector('span')?.getAttribute('aria-valuenow')).toBe('30');

    thumbHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(thumbHost.querySelector('span')?.getAttribute('aria-valuenow')).toBe('40');

    thumbHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    fixture.detectChanges();
    expect(thumbHost.querySelector('span')?.getAttribute('aria-valuenow')).toBe('0');

    thumbHost.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    fixture.detectChanges();
    expect(thumbHost.querySelector('span')?.getAttribute('aria-valuenow')).toBe('100');
  });
});

describe('ZardSliderComponent (RTL)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: Directionality, useValue: { value: 'rtl', valueSignal: signal('rtl'), change: new Subject() } },
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.value = [40];
    fixture.detectChanges();
  });

  const thumbHost = () =>
    fixture.debugElement.query(By.directive(ZardSliderThumbComponent)).nativeElement as HTMLElement;
  const ariaNow = () => +thumbHost().querySelector('span')!.getAttribute('aria-valuenow')!;

  it('ArrowRight decreases and ArrowLeft increases the value', () => {
    thumbHost().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(ariaNow()).toBe(30);

    thumbHost().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    thumbHost().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    fixture.detectChanges();
    expect(ariaNow()).toBe(50);
  });

  it('keeps ArrowUp/ArrowDown and Home/End unchanged', () => {
    thumbHost().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    fixture.detectChanges();
    expect(ariaNow()).toBe(50);

    thumbHost().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    thumbHost().dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    fixture.detectChanges();
    expect(ariaNow()).toBe(0);
  });

  it('positions the thumb from the right edge', () => {
    expect(thumbHost().style.right).toContain('%');
    expect(thumbHost().style.left).toBe('');
  });

  it('fills the range from the right edge', () => {
    const range = fixture.nativeElement.querySelector('[data-slot="slider-range"]') as HTMLElement;
    expect(range.style.left).toBe('60%');
    expect(range.style.right).toBe('0px');
  });

  it('maps the pointer position from the right edge of the track', () => {
    const track = fixture.nativeElement.querySelector('[data-slot="slider-track"]') as HTMLElement;
    track.getBoundingClientRect = () =>
      ({ left: 0, right: 200, width: 200, top: 0, bottom: 4, height: 4, x: 0, y: 0 }) as DOMRect;

    track.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 150 }));
    fixture.detectChanges();

    // 150px from the left of a 200px track is 25% from the right edge
    expect(ariaNow()).toBe(30);
  });
});

describe('ZardSliderComponent (custom zMin/zMax)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  const setup = (min: number, max: number, value: number[], step = 1) => {
    component.min = min;
    component.max = max;
    component.step = step;
    component.value = value;
    fixture.detectChanges();
  };

  const thumbHost = () =>
    fixture.debugElement.query(By.directive(ZardSliderThumbComponent)).nativeElement as HTMLElement;
  const thumb = () => thumbHost().querySelector('span') as HTMLElement;
  const ariaNow = () => Number(thumb().getAttribute('aria-valuenow'));
  const range = () => fixture.nativeElement.querySelector('[data-slot="slider-range"]') as HTMLElement;
  const mockTrackRect = () => {
    const track = fixture.nativeElement.querySelector('[data-slot="slider-track"]') as HTMLElement;
    track.getBoundingClientRect = () =>
      ({ left: 0, right: 200, width: 200, top: 0, bottom: 4, height: 4, x: 0, y: 0 }) as DOMRect;
    return track;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        {
          provide: EVENT_MANAGER_PLUGINS,
          useClass: ZardEventManagerPlugin,
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  it('positions the thumb relative to a zMax below 100', () => {
    setup(0, 50, [25]);

    expect(ariaNow()).toBe(25);
    expect(thumbHost().style.left).toBe('calc(50% + 0px)');
    expect(range().style.right).toBe('50%');
  });

  it('accepts and positions values above 100', () => {
    setup(0, 1000, [750], 10);

    expect(thumb().getAttribute('aria-valuemax')).toBe('1000');
    expect(ariaNow()).toBe(750);
    expect(thumbHost().style.left).toBe('calc(75% + 0px)');
  });

  it('supports a negative zMin', () => {
    setup(-10, 10, [0]);

    expect(ariaNow()).toBe(0);
    expect(thumbHost().style.left).toBe('calc(50% + 0px)');

    thumbHost().dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    fixture.detectChanges();
    expect(ariaNow()).toBe(-10);
    expect(thumbHost().style.left).toBe('calc(0% + 0px)');
  });

  it('moves to zMin with Home and to zMax with End', () => {
    setup(0, 1000, [500], 10);

    thumbHost().dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    fixture.detectChanges();
    expect(ariaNow()).toBe(1000);
    expect(thumbHost().style.left).toBe('calc(100% + 0px)');

    thumbHost().dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    fixture.detectChanges();
    expect(ariaNow()).toBe(0);
  });

  it('maps a track click onto the [zMin, zMax] range', () => {
    setup(0, 50, [10]);
    const track = mockTrackRect();

    track.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 100 }));
    fixture.detectChanges();
    expect(ariaNow()).toBe(25);

    track.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 200 }));
    fixture.detectChanges();
    expect(ariaNow()).toBe(50);
  });

  it('keeps zMax reachable by pointer when the range is not a multiple of zStep', () => {
    setup(0, 1000, [0], 300);
    const track = mockTrackRect();

    track.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 200 }));
    fixture.detectChanges();
    expect(ariaNow()).toBe(1000);

    track.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 184 }));
    fixture.detectChanges();
    expect(ariaNow()).toBe(900);

    track.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 196 }));
    fixture.detectChanges();
    expect(ariaNow()).toBe(1000);
  });

  it('maps a track click onto a negative range', () => {
    setup(-10, 10, [0]);
    const track = mockTrackRect();

    track.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 50 }));
    fixture.detectChanges();
    expect(ariaNow()).toBe(-5);
  });

  it('clamps values written through the form API to [zMin, zMax]', () => {
    setup(-10, 10, [0]);
    const slider = fixture.debugElement.query(By.directive(ZardSliderComponent))
      .componentInstance as ZardSliderComponent;

    slider.writeValue(50);
    fixture.detectChanges();
    expect(ariaNow()).toBe(10);

    slider.writeValue(-50);
    fixture.detectChanges();
    expect(ariaNow()).toBe(-10);
  });

  it('keeps zMax reachable through the form API when the range is not a multiple of zStep', () => {
    setup(0, 1000, [0], 300);
    const slider = fixture.debugElement.query(By.directive(ZardSliderComponent))
      .componentInstance as ZardSliderComponent;

    slider.writeValue(1000);
    fixture.detectChanges();
    expect(ariaNow()).toBe(1000);

    slider.writeValue(850);
    fixture.detectChanges();
    expect(ariaNow()).toBe(900);
  });

  it('keeps an initial zValue of zMax when the range is not a multiple of zStep', () => {
    setup(0, 1000, [1000], 300);

    expect(ariaNow()).toBe(1000);
    expect(thumbHost().style.left).toBe('calc(100% + 0px)');
  });

  it('keeps a zDefault of zMax when the range is not a multiple of zStep', () => {
    component.default = [1000];
    setup(0, 1000, [], 300);

    expect(ariaNow()).toBe(1000);
  });

  it('keeps the fractional 0-1 scale working', () => {
    setup(0, 1, [0.5], 0.1);

    expect(thumbHost().style.left).toBe('calc(50% + 0px)');

    const track = mockTrackRect();
    track.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 160 }));
    fixture.detectChanges();
    expect(ariaNow()).toBeCloseTo(0.8);
  });

  it('keeps keyboard steps at the precision of a decimal zStep', () => {
    setup(0, 1, [0.2], 0.1);

    thumbHost().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(thumb().getAttribute('aria-valuenow')).toBe('0.3');

    thumbHost().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    thumbHost().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    fixture.detectChanges();
    expect(thumb().getAttribute('aria-valuenow')).toBe('0.1');
  });

  it('keeps pointer values at the precision of a decimal zStep', () => {
    setup(0, 1, [0], 0.1);
    const track = mockTrackRect();

    track.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 140 }));
    fixture.detectChanges();
    expect(thumb().getAttribute('aria-valuenow')).toBe('0.7');
  });
});
