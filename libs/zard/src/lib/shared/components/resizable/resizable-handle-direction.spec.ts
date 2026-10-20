import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { Subject } from 'rxjs';

import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

import { ZardResizableHandleComponent } from './resizable-handle.component';
import { ZardResizablePanelComponent } from './resizable-panel.component';
import { ZardResizableComponent } from './resizable.component';

@Component({
  imports: [ZardResizableComponent, ZardResizablePanelComponent, ZardResizableHandleComponent],
  template: `
    <z-resizable [zLayout]="layout()">
      <z-resizable-panel [zDefaultSize]="50">First</z-resizable-panel>
      <z-resizable-handle [zHandleIndex]="0" />
      <z-resizable-panel [zDefaultSize]="50">Second</z-resizable-panel>
    </z-resizable>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class DirectionHostComponent {
  readonly layout = signal<'horizontal' | 'vertical'>('horizontal');
}

describe('ZardResizableHandleComponent direction', () => {
  let fixture: ComponentFixture<DirectionHostComponent>;
  let handle: ZardResizableHandleComponent;
  let resizable: ZardResizableComponent;

  async function setup(direction: 'ltr' | 'rtl') {
    await TestBed.configureTestingModule({
      imports: [DirectionHostComponent],
      providers: [
        { provide: EVENT_MANAGER_PLUGINS, useClass: ZardEventManagerPlugin, multi: true },
        {
          provide: Directionality,
          useValue: { value: direction, valueSignal: signal(direction), change: new Subject() },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DirectionHostComponent);
    fixture.detectChanges();
    handle = fixture.debugElement.query(By.directive(ZardResizableHandleComponent)).componentInstance;
    resizable = fixture.debugElement.query(By.directive(ZardResizableComponent)).componentInstance;
    Object.defineProperty(
      fixture.debugElement.query(By.directive(ZardResizableComponent)).nativeElement,
      'offsetWidth',
      {
        value: 1000,
        configurable: true,
      },
    );
  }

  const press = (key: string) => handle.handleKeyDown(new KeyboardEvent('keydown', { key }));

  describe('in RTL', () => {
    beforeEach(() => setup('rtl'));

    it('ArrowLeft grows the first panel, which sits on the right', () => {
      const [first, second] = resizable.panelSizes();

      press('ArrowLeft');

      expect(resizable.panelSizes()[0]).toBeGreaterThan(first);
      expect(resizable.panelSizes()[1]).toBeLessThan(second);
    });

    it('ArrowRight shrinks the first panel', () => {
      const [first] = resizable.panelSizes();

      press('ArrowRight');

      expect(resizable.panelSizes()[0]).toBeLessThan(first);
    });

    it('keeps the vertical arrow keys of a stacked group unchanged', () => {
      fixture.componentInstance.layout.set('vertical');
      fixture.detectChanges();
      const [first] = resizable.panelSizes();

      press('ArrowDown');

      expect(resizable.panelSizes()[0]).toBeGreaterThan(first);
    });
  });

  describe('in LTR', () => {
    beforeEach(() => setup('ltr'));

    it('ArrowLeft shrinks the first panel and ArrowRight grows it', () => {
      const [first] = resizable.panelSizes();

      press('ArrowLeft');
      expect(resizable.panelSizes()[0]).toBeLessThan(first);

      press('ArrowRight');
      press('ArrowRight');
      expect(resizable.panelSizes()[0]).toBeGreaterThan(first);
    });
  });
});
