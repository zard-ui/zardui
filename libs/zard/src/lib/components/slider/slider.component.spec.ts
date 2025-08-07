import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

import { ZardSliderComponent, ZSliderRangeComponent, ZSliderThumbComponent, ZSliderTrackComponent } from './slider.component';

@Component({
  selector: 'test-slider-host',
  standalone: true,
  imports: [CommonModule, ZardSliderComponent],
  template: ` <z-slider [zMin]="min" [zMax]="max" [zStep]="step" [zValue]="value" [zOrientation]="orientation" [zDisabled]="disabled" [zDefault]="default"></z-slider> `,
})
class TestHostComponent {
  min = 0;
  max = 100;
  step = 10;
  value = 40;
  orientation = 'horizontal';
  disabled = false;
  default = 20;
}

describe('ZardSliderComponent (orientation: horizontal)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
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
    expect(fixture.debugElement.query(By.directive(ZSliderThumbComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZSliderTrackComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZSliderRangeComponent))).toBeTruthy();
  });

  it('should have orientation attribute on host', () => {
    const host = fixture.debugElement.query(By.directive(ZardSliderComponent)).nativeElement;
    expect(host.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('should apply aria attributes on thumb', () => {
    const thumb = fixture.debugElement.query(By.directive(ZSliderThumbComponent)).nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-valuemin')).toBe('0');
    expect(thumb.getAttribute('aria-valuemax')).toBe('100');
    expect(thumb.getAttribute('aria-valuenow')).toBe('40');
  });

  it('should render default CSS classes on slider container', () => {
    const slider = fixture.debugElement.query(By.css('[data-slot="slider"]')).nativeElement;
    expect(slider.classList).toContain('flex');
    expect(slider.classList).toContain('data-[orientation=horizontal]:items-center');
    expect(slider.classList).toContain('data-[orientation=horizontal]:w-full');
  });

  it('should render projected value into the thumb correctly', () => {
    const thumb = fixture.debugElement.query(By.directive(ZSliderThumbComponent)).nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-valuenow')).toBe('40');
  });

  it('should set tabindex="0" on thumb', () => {
    const thumb = fixture.debugElement.query(By.directive(ZSliderThumbComponent)).nativeElement.querySelector('span');
    expect(thumb.getAttribute('tabindex')).toBe('0');
  });

  it('should respect zDisabled input and reflect as aria-disabled', () => {
    component.value = 60;
    fixture.detectChanges();

    const thumb = fixture.debugElement.query(By.directive(ZSliderThumbComponent)).nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-disabled')).toBeNull();

    fixture.componentInstance.value = 50;
    fixture.detectChanges();
    const compInstance = fixture.debugElement.query(By.directive(ZardSliderComponent)).componentInstance;
    compInstance.setDisabledState(true);
    fixture.detectChanges();

    expect(thumb.getAttribute('aria-disabled')).toBe('true');
  });

  it('should apply correct thumb position style (horizontal)', () => {
    const thumbHost = fixture.debugElement.query(By.directive(ZSliderThumbComponent)).nativeElement;
    const styleLeft = thumbHost.style.left;
    expect(styleLeft).toContain('%');
  });

  it('should apply zMin, zMax, and zStep correctly', () => {
    const thumb = fixture.debugElement.query(By.directive(ZSliderThumbComponent)).nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-valuemin')).toBe(String(component.min));
    expect(thumb.getAttribute('aria-valuemax')).toBe(String(component.max));
    expect(Number(thumb.getAttribute('aria-valuenow')) % component.step).toBe(0);
  });

  it('should reflect zValue correctly on thumb', () => {
    component.value = 70;
    fixture.detectChanges();

    const thumb = fixture.debugElement.query(By.directive(ZSliderThumbComponent)).nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-valuenow')).toBe('70');
  });

  it('should apply zDefault as initial value if zValue is undefined', () => {
    component.value = undefined as any;
    component.default = 20;
    fixture.detectChanges();

    const thumb = fixture.debugElement.query(By.directive(ZSliderThumbComponent)).nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-valuenow')).toBe('20');
  });

  it('should round value to nearest step increment', () => {
    component.step = 25;
    component.value = 47;
    fixture.detectChanges();

    const thumb = fixture.debugElement.query(By.directive(ZSliderThumbComponent)).nativeElement.querySelector('span');
    const value = Number(thumb.getAttribute('aria-valuenow'));
    expect(value % 25).toBe(0);
  });

  it('should move thumb with arrow keys', () => {
    const thumbDebug = fixture.debugElement.query(By.directive(ZSliderThumbComponent));
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
    const thumbHost = fixture.debugElement.query(By.directive(ZSliderThumbComponent)).nativeElement;

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

describe('ZardSliderComponent (orientation: vertical)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
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
    expect(fixture.debugElement.query(By.directive(ZSliderThumbComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZSliderTrackComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ZSliderRangeComponent))).toBeTruthy();
  });

  it('should have orientation attribute on host', () => {
    const host = fixture.debugElement.query(By.directive(ZardSliderComponent)).nativeElement;
    expect(host.getAttribute('data-orientation')).toBe('vertical');
  });

  it('should apply aria attributes on thumb', () => {
    const thumb = fixture.debugElement.query(By.directive(ZSliderThumbComponent)).nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-valuemin')).toBe('0');
    expect(thumb.getAttribute('aria-valuemax')).toBe('100');
    expect(thumb.getAttribute('aria-valuenow')).toBe('40');
  });

  it('should render default CSS classes on slider container', () => {
    const slider = fixture.debugElement.query(By.css('[data-slot="slider"]')).nativeElement;
    expect(slider.classList).toContain('flex');
    expect(slider.classList).toContain('data-[orientation=vertical]:justify-center');
    expect(slider.classList).toContain('data-[orientation=vertical]:h-full');
  });

  it('should render projected value into the thumb correctly', () => {
    const thumb = fixture.debugElement.query(By.directive(ZSliderThumbComponent)).nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-valuenow')).toBe('40');
  });

  it('should set tabindex="0" on thumb', () => {
    const thumb = fixture.debugElement.query(By.directive(ZSliderThumbComponent)).nativeElement.querySelector('span');
    expect(thumb.getAttribute('tabindex')).toBe('0');
  });

  it('should respect zDisabled input and reflect as aria-disabled', () => {
    component.value = 60;
    fixture.detectChanges();

    const thumb = fixture.debugElement.query(By.directive(ZSliderThumbComponent)).nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-disabled')).toBeNull();

    fixture.componentInstance.value = 50;
    fixture.detectChanges();
    const compInstance = fixture.debugElement.query(By.directive(ZardSliderComponent)).componentInstance;
    compInstance.setDisabledState(true);
    fixture.detectChanges();

    expect(thumb.getAttribute('aria-disabled')).toBe('true');
  });

  it('should apply correct thumb position style (vertical)', () => {
    const thumbHost = fixture.debugElement.query(By.directive(ZSliderThumbComponent)).nativeElement;
    const styleLeft = thumbHost.style.bottom;
    expect(styleLeft).toContain('%');
  });

  it('should apply zMin, zMax, and zStep correctly', () => {
    const thumb = fixture.debugElement.query(By.directive(ZSliderThumbComponent)).nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-valuemin')).toBe(String(component.min));
    expect(thumb.getAttribute('aria-valuemax')).toBe(String(component.max));
    expect(Number(thumb.getAttribute('aria-valuenow')) % component.step).toBe(0);
  });

  it('should reflect zValue correctly on thumb', () => {
    component.value = 70;
    fixture.detectChanges();

    const thumb = fixture.debugElement.query(By.directive(ZSliderThumbComponent)).nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-valuenow')).toBe('70');
  });

  it('should apply zDefault as initial value if zValue is undefined', () => {
    component.value = undefined as any;
    component.default = 20;
    fixture.detectChanges();

    const thumb = fixture.debugElement.query(By.directive(ZSliderThumbComponent)).nativeElement.querySelector('span');
    expect(thumb.getAttribute('aria-valuenow')).toBe('20');
  });

  it('should round value to nearest step increment', () => {
    component.step = 25;
    component.value = 47;
    fixture.detectChanges();

    const thumb = fixture.debugElement.query(By.directive(ZSliderThumbComponent)).nativeElement.querySelector('span');
    const value = Number(thumb.getAttribute('aria-valuenow'));
    expect(value % 25).toBe(0);
  });

  it('should move thumb with arrow keys', () => {
    const thumbDebug = fixture.debugElement.query(By.directive(ZSliderThumbComponent));
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
    const thumbHost = fixture.debugElement.query(By.directive(ZSliderThumbComponent)).nativeElement;

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
