import { Component, type TemplateRef, viewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import {
  type ZardStringTemplateOutletContext,
  ZardStringTemplateOutletDirective,
} from './string-template-outlet.directive';

describe('string template outlet', () => {
  let fixture: ComponentFixture<StringTemplateOutletTestComponent>;
  let component: StringTemplateOutletTestComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(StringTemplateOutletTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('null', () => {
    it('should no error when null', () => {
      expect(fixture.nativeElement).toHaveTextContent('TargetText');
    });
  });

  describe('outlet change', () => {
    it('should work when switch between null and string', () => {
      component.stringTemplateOutlet = 'String Testing';
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveTextContent('TargetText String Testing');
      component.stringTemplateOutlet = null;
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveTextContent('TargetText');
    });

    it('should work when switch between null and template', () => {
      component.stringTemplateOutlet = component.stringTpl() as TemplateRef<void>;
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveTextContent('TargetText The data is');
      component.stringTemplateOutlet = null;
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveTextContent('TargetText');
    });

    it('should work when switch between string', () => {
      component.stringTemplateOutlet = 'String Testing';
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveTextContent('TargetText String Testing');
      component.stringTemplateOutlet = 'String String';
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveTextContent('TargetText String String');
    });

    it('should work when switch between string and template', () => {
      component.stringTemplateOutlet = 'String Testing';
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveTextContent('TargetText String Testing');
      component.stringTemplateOutlet = component.stringTpl() as TemplateRef<void>;
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveTextContent('TargetText The data is');
      component.stringTemplateOutlet = 'String Testing';
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveTextContent('TargetText String Testing');
    });

    it('should work when switch between template', () => {
      component.stringTemplateOutlet = component.stringTpl() as TemplateRef<void>;
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveTextContent('TargetText The data is');
      component.stringTemplateOutlet = component.emptyTpl() as TemplateRef<void>;
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveTextContent('TargetText Empty Template');
    });
  });

  describe('context shape change', () => {
    it('should work when context shape change', () => {
      component.stringTemplateOutlet = component.dataTimeTpl() as TemplateRef<void>;
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveTextContent('TargetText The data is , The time is');
      component.context = { $implicit: 'data', time: 'time' };
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveTextContent('TargetText The data is data, The time is time');
    });
  });

  describe('context data change', () => {
    it('should work when context implicit change', () => {
      component.stringTemplateOutlet = component.stringTpl() as TemplateRef<void>;
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveTextContent('TargetText The data is');
      component.context = { $implicit: 'data' };
      fixture.detectChanges();
      expect(fixture.nativeElement).toHaveTextContent('TargetText The data is data');
    });
  });
});

@Component({
  imports: [ZardStringTemplateOutletDirective],
  template: `
    TargetText
    <ng-container *zStringTemplateOutlet="stringTemplateOutlet; context: context; let stringTemplateOutlet">
      {{ stringTemplateOutlet }}
    </ng-container>
    <ng-template #stringTpl let-data>The data is {{ data }}</ng-template>
    <ng-template #emptyTpl>Empty Template</ng-template>
    <ng-template #dataTimeTpl let-data let-time="time">The data is {{ data }}, The time is {{ time }}</ng-template>
  `,
})
export class StringTemplateOutletTestComponent {
  readonly stringTpl = viewChild<TemplateRef<void>>('stringTpl');
  readonly emptyTpl = viewChild<TemplateRef<void>>('emptyTpl');
  readonly dataTimeTpl = viewChild<TemplateRef<void>>('dataTimeTpl');
  readonly zStringTemplateOutletDirective = viewChild(ZardStringTemplateOutletDirective);

  stringTemplateOutlet: TemplateRef<void> | string | null = null;
  context: ZardStringTemplateOutletContext = { $implicit: '' };
}
