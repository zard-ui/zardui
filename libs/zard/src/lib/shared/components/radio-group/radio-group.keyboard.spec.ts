import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Subject } from 'rxjs';

import { ZardRadioComponent, ZardRadioGroupComponent } from './radio-group.component';

@Component({
  imports: [ZardRadioGroupComponent, ZardRadioComponent],
  template: `
    <z-radio-group [(value)]="selected">
      <button z-radio value="a">A</button>
      <button z-radio value="b">B</button>
      <button z-radio value="c" [zDisabled]="true">C</button>
      <button z-radio value="d">D</button>
    </z-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class HostComponent {
  readonly selected = signal<unknown>('a');
}

function setup(direction: 'ltr' | 'rtl') {
  TestBed.configureTestingModule({
    imports: [HostComponent],
    providers: [
      {
        provide: Directionality,
        useValue: { value: direction, valueSignal: signal(direction), change: new Subject() },
      },
    ],
  });
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  const radios: HTMLButtonElement[] = fixture.debugElement
    .queryAll(By.css('button[role="radio"]'))
    .map(item => item.nativeElement);
  const press = (index: number, key: string) => {
    radios[index].dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    fixture.detectChanges();
  };
  return { fixture, radios, press };
}

describe('ZardRadioGroupComponent keyboard navigation', () => {
  it('ArrowRight goes to the next radio and ArrowLeft to the previous one in LTR', () => {
    const { fixture, press } = setup('ltr');

    press(0, 'ArrowRight');
    expect(fixture.componentInstance.selected()).toBe('b');
    press(1, 'ArrowLeft');
    expect(fixture.componentInstance.selected()).toBe('a');
  });

  it('mirrors ArrowLeft/ArrowRight in RTL', () => {
    const { fixture, press } = setup('rtl');

    press(0, 'ArrowLeft');
    expect(fixture.componentInstance.selected()).toBe('b');
    press(1, 'ArrowRight');
    expect(fixture.componentInstance.selected()).toBe('a');
  });

  it('keeps ArrowDown/ArrowUp direction independent, skips disabled radios and wraps', () => {
    const { fixture, press } = setup('rtl');

    press(0, 'ArrowDown');
    expect(fixture.componentInstance.selected()).toBe('b');
    press(1, 'ArrowDown');
    expect(fixture.componentInstance.selected()).toBe('d');
    press(3, 'ArrowDown');
    expect(fixture.componentInstance.selected()).toBe('a');
    press(0, 'ArrowUp');
    expect(fixture.componentInstance.selected()).toBe('d');
  });
});
