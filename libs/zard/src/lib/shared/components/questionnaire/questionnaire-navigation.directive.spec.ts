import { ChangeDetectionStrategy, Component, type Type } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  ZardQuestionnaireNavigationButton,
  ZardQuestionnaireNextDirective,
  ZardQuestionnairePreviousDirective,
  ZardQuestionnaireSkipDirective,
  ZardQuestionnaireSubmitDirective,
} from './questionnaire-navigation.directive';
import { ZardQuestionnaireComponent } from './questionnaire.component';
import type { ZardQuestionnaireItem } from './questionnaire.types';

@Component({
  imports: [
    ZardQuestionnaireComponent,
    ZardQuestionnaireNextDirective,
    ZardQuestionnairePreviousDirective,
    ZardQuestionnaireSkipDirective,
    ZardQuestionnaireSubmitDirective,
  ],
  template: `
    <z-questionnaire [zItems]="items" [(zActive)]="active">
      <input type="radio" name="first" value="answered" checked />
      <button class="justify-self-center" type="button" z-questionnaire-previous [disabled]="previousDisabled">
        Previous
      </button>
      <button type="button" z-questionnaire-skip [disabled]="skipDisabled">Skip</button>
      <button type="button" z-questionnaire-next [disabled]="nextDisabled" [zLoading]="nextLoading">Next</button>
      <button type="submit" z-questionnaire-submit [disabled]="submitDisabled">Submit</button>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class NavigationDirectiveHostComponent {
  readonly items: ZardQuestionnaireItem[] = [
    { name: 'first', required: true },
    { name: 'optional' },
    { name: 'last', required: true },
  ];

  active = 'first';
  previousDisabled = false;
  skipDisabled = false;
  nextDisabled = false;
  nextLoading = false;
  submitDisabled = false;
}

function getButton<T>(
  fixture: ComponentFixture<NavigationDirectiveHostComponent>,
  directive: Type<T>,
): HTMLButtonElement {
  return fixture.debugElement.query(By.directive(directive)).nativeElement as HTMLButtonElement;
}

describe('questionnaire navigation directives', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [NavigationDirectiveHostComponent] }).compileComponents();
  });

  describe('ZardQuestionnairePreviousDirective', () => {
    it('is a button, exposes its slot, and is disabled on the first enabled item', () => {
      const fixture = TestBed.createComponent(NavigationDirectiveHostComponent);
      fixture.detectChanges();
      const button = getButton(fixture, ZardQuestionnairePreviousDirective);

      expect(button.type).toBe('button');
      expect(button.dataset['slot']).toBe('questionnaire-previous');
      expect(button.disabled).toBe(true);
      expect(button.hidden).toBe(true);
      expect(button.getAttribute('aria-disabled')).toBe('true');
      expect(button.classList).toContain('border-border');
      expect(button.classList).toContain('justify-self-center');
      expect(button.classList).not.toContain('justify-self-start');
      expect(button.classList).toContain('col-start-1');
    });

    it('moves to the previous item when applicable', () => {
      const fixture = TestBed.createComponent(NavigationDirectiveHostComponent);
      fixture.componentInstance.active = 'optional';
      fixture.detectChanges();
      const button = getButton(fixture, ZardQuestionnairePreviousDirective);

      expect(button.disabled).toBe(false);
      expect(button.hidden).toBe(false);
      expect(button.getAttribute('aria-disabled')).toBeNull();

      button.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.active).toBe('first');
    });

    it('preserves a consumer disabled state and does not navigate', () => {
      const fixture = TestBed.createComponent(NavigationDirectiveHostComponent);
      fixture.componentInstance.active = 'optional';
      fixture.componentInstance.previousDisabled = true;
      fixture.detectChanges();
      const button = getButton(fixture, ZardQuestionnairePreviousDirective);

      button.click();
      fixture.detectChanges();

      expect(button.disabled).toBe(true);
      expect(button.hidden).toBe(false);
      expect(fixture.componentInstance.active).toBe('optional');
    });
  });

  describe('ZardQuestionnaireSkipDirective', () => {
    it('is a button, exposes its slot, and is disabled for required items', () => {
      const fixture = TestBed.createComponent(NavigationDirectiveHostComponent);
      fixture.detectChanges();
      const button = getButton(fixture, ZardQuestionnaireSkipDirective);

      expect(button.type).toBe('button');
      expect(button.dataset['slot']).toBe('questionnaire-skip');
      expect(button.disabled).toBe(true);
      expect(button.hidden).toBe(true);
      expect(button.getAttribute('aria-disabled')).toBe('true');
      expect(button.classList).toContain('border-border');
      expect(button.classList).toContain('col-start-2');
    });

    it('is enabled for an optional item and skips it', () => {
      const fixture = TestBed.createComponent(NavigationDirectiveHostComponent);
      fixture.componentInstance.active = 'optional';
      fixture.detectChanges();
      const button = getButton(fixture, ZardQuestionnaireSkipDirective);

      expect(button.disabled).toBe(false);
      expect(button.hidden).toBe(false);
      expect(button.getAttribute('aria-disabled')).toBeNull();

      button.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.active).toBe('last');
    });

    it('preserves a consumer disabled state and does not skip', () => {
      const fixture = TestBed.createComponent(NavigationDirectiveHostComponent);
      fixture.componentInstance.active = 'optional';
      fixture.componentInstance.skipDisabled = true;
      fixture.detectChanges();
      const button = getButton(fixture, ZardQuestionnaireSkipDirective);

      button.click();
      fixture.detectChanges();

      expect(button.disabled).toBe(true);
      expect(fixture.componentInstance.active).toBe('optional');
    });
  });

  describe('ZardQuestionnaireNextDirective', () => {
    it('is a button, exposes its slot, moves forward, and disables itself on the last item', () => {
      const fixture = TestBed.createComponent(NavigationDirectiveHostComponent);
      fixture.detectChanges();
      const button = getButton(fixture, ZardQuestionnaireNextDirective);

      expect(button.type).toBe('button');
      expect(button.dataset['slot']).toBe('questionnaire-next');
      expect(button.disabled).toBe(false);
      expect(button.hidden).toBe(false);
      expect(button.getAttribute('aria-disabled')).toBeNull();
      expect(button.classList).toContain('bg-primary');
      expect(button.classList).toContain('col-start-3');

      button.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.active).toBe('optional');

      fixture.componentInstance.active = 'last';
      fixture.detectChanges();

      expect(button.disabled).toBe(true);
      expect(button.hidden).toBe(true);
      expect(button.getAttribute('aria-disabled')).toBe('true');
      expect(button.classList).toContain('bg-primary');
      expect(button.classList).toContain('col-start-3');
    });

    it('preserves a consumer disabled state and does not navigate', () => {
      const fixture = TestBed.createComponent(NavigationDirectiveHostComponent);
      fixture.componentInstance.nextDisabled = true;
      fixture.detectChanges();
      const button = getButton(fixture, ZardQuestionnaireNextDirective);

      button.click();
      fixture.detectChanges();

      expect(button.disabled).toBe(true);
      expect(button.hidden).toBe(false);
      expect(fixture.componentInstance.active).toBe('first');
    });

    it('inherits the shared button loading indicator and disabled behavior', () => {
      const fixture = TestBed.createComponent(NavigationDirectiveHostComponent);
      fixture.componentInstance.nextLoading = true;
      fixture.detectChanges();
      const button = getButton(fixture, ZardQuestionnaireNextDirective);

      expect(button.disabled).toBe(true);
      expect(button.getAttribute('aria-busy')).toBe('true');
      expect(button.querySelector('ng-icon')).not.toBeNull();
      expect(button.classList).toContain('opacity-50');
    });
  });

  describe('ZardQuestionnaireSubmitDirective', () => {
    it('is a submit button, exposes its slot, and is enabled only on the last item', () => {
      const fixture = TestBed.createComponent(NavigationDirectiveHostComponent);
      fixture.detectChanges();
      const button = getButton(fixture, ZardQuestionnaireSubmitDirective);

      expect(button.type).toBe('submit');
      expect(button.dataset['slot']).toBe('questionnaire-submit');
      expect(button.disabled).toBe(true);
      expect(button.hidden).toBe(true);
      expect(button.getAttribute('aria-disabled')).toBe('true');

      fixture.componentInstance.active = 'last';
      fixture.detectChanges();

      expect(button.disabled).toBe(false);
      expect(button.hidden).toBe(false);
      expect(button.getAttribute('aria-disabled')).toBeNull();
      expect(button.classList).toContain('bg-primary');
      expect(button.classList).toContain('col-start-3');
    });

    it('preserves a consumer disabled state', () => {
      const fixture = TestBed.createComponent(NavigationDirectiveHostComponent);
      fixture.componentInstance.active = 'last';
      fixture.componentInstance.submitDisabled = true;
      fixture.detectChanges();
      const button = getButton(fixture, ZardQuestionnaireSubmitDirective);

      expect(button.disabled).toBe(true);
      expect(button.hidden).toBe(false);
      expect(button.getAttribute('aria-disabled')).toBe('true');
    });
  });

  it('shares one base class across the four navigation buttons', async () => {
    const fixture = TestBed.createComponent(NavigationDirectiveHostComponent);
    fixture.detectChanges();

    for (const directive of [
      ZardQuestionnairePreviousDirective,
      ZardQuestionnaireSkipDirective,
      ZardQuestionnaireNextDirective,
      ZardQuestionnaireSubmitDirective,
    ]) {
      expect(fixture.debugElement.query(By.directive(directive)).injector.get(directive)).toBeInstanceOf(
        ZardQuestionnaireNavigationButton,
      );
    }
  });
});
