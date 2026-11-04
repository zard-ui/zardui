import { ChangeDetectionStrategy, Component, type Type } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardDemoQuestionnaireDefaultComponent } from './demo/default';
import { ZardDemoQuestionnaireResumeComponent } from './demo/resume';
import {
  ZardQuestionnaireImports,
  ZardQuestionnaireChoicesComponent,
  ZardQuestionnaireComponent,
  ZardQuestionnaireDescriptionComponent,
  ZardQuestionnaireActionsComponent,
  ZardQuestionnaireErrorComponent,
  ZardQuestionnaireInputComponent,
  ZardQuestionnaireItemComponent,
  ZardQuestionnaireChoiceComponent,
  ZardQuestionnaireChoiceDescriptionComponent,
  ZardQuestionnaireNextDirective,
  ZardQuestionnairePreviousDirective,
  ZardQuestionnaireProgressComponent,
  ZardQuestionnaireSkipDirective,
  ZardQuestionnaireSubmitDirective,
  ZardQuestionnaireTitleComponent,
} from './questionnaire.imports';
import type {
  ZardQuestionnaireAnswers,
  ZardQuestionnaireItem,
  ZardQuestionnaireShortcutMode,
} from './questionnaire.types';

@Component({
  imports: [ZardQuestionnaireComponent, ZardQuestionnaireItemComponent],
  template: `
    <z-questionnaire [zItems]="items" [(zActive)]="active">
      @for (item of items; track item.name) {
        <z-questionnaire-item [zName]="item.name" [zDisabled]="item.disabled">
          {{ item.name }}
        </z-questionnaire-item>
      }
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class InitialActiveItemHostComponent {
  readonly items: ZardQuestionnaireItem[] = [
    { name: 'disabled-first', disabled: true },
    { name: 'first-enabled' },
    { name: 'second-enabled' },
  ];

  active: string | undefined;
}

@Component({
  imports: [
    ZardQuestionnaireChoiceComponent,
    ZardQuestionnaireComponent,
    ZardQuestionnaireErrorComponent,
    ZardQuestionnaireItemComponent,
    ZardQuestionnaireNextDirective,
  ],
  template: `
    <z-questionnaire [zItems]="items">
      @for (item of items; track item.name) {
        <z-questionnaire-item [attr.data-testid]="'uncontrolled-' + item.name" [zName]="item.name">
          <z-questionnaire-choice [zValue]="item.name + '-answer'">{{ item.name }}</z-questionnaire-choice>
        </z-questionnaire-item>
      }

      <button type="button" z-questionnaire-next>Next</button>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class UncontrolledQuestionnaireHostComponent {
  readonly items: ZardQuestionnaireItem[] = [{ name: 'first' }, { name: 'second' }];
}

@Component({
  imports: [ZardQuestionnaireComponent, ZardQuestionnaireItemComponent, ZardQuestionnaireSubmitDirective],
  template: `
    <z-questionnaire [zItems]="items" [(zActive)]="active" (zSubmit)="submitted = $event">
      <z-questionnaire-item zName="first">
        <input type="radio" name="first" value="saved-first" checked />
      </z-questionnaire-item>
      <z-questionnaire-item zName="second">
        <input type="radio" name="second" value="saved-second" checked />
      </z-questionnaire-item>

      <button type="submit" z-questionnaire-submit>Submit</button>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class ResumedQuestionnaireHostComponent {
  readonly items: ZardQuestionnaireItem[] = [{ name: 'first' }, { name: 'second' }];
  active = 'second';
  submitted: ZardQuestionnaireAnswers | undefined;
}

@Component({
  imports: [
    ZardQuestionnaireChoiceComponent,
    ZardQuestionnaireChoicesComponent,
    ZardQuestionnaireComponent,
    ZardQuestionnaireInputComponent,
    ZardQuestionnaireItemComponent,
    ZardQuestionnaireSubmitDirective,
  ],
  template: `
    <z-questionnaire [zItems]="items" (zSubmit)="submitted = $event">
      <z-questionnaire-item zName="choice">
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="saved" checked>Saved</z-questionnaire-choice>
          <z-questionnaire-choice zValue="changed">Changed</z-questionnaire-choice>
        </z-questionnaire-choices>
      </z-questionnaire-item>
      <z-questionnaire-item zName="note">
        <z-questionnaire-input value="Saved note" />
      </z-questionnaire-item>

      <button type="submit" z-questionnaire-submit>Submit</button>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class ResumedQuestionnaireControlsHostComponent {
  readonly items: ZardQuestionnaireItem[] = [{ name: 'choice' }, { name: 'note' }];
  submitted: ZardQuestionnaireAnswers | undefined;
}

@Component({
  imports: [
    ZardQuestionnaireChoiceComponent,
    ZardQuestionnaireComponent,
    ZardQuestionnaireItemComponent,
    ZardQuestionnaireNextDirective,
    ZardQuestionnaireProgressComponent,
    ZardQuestionnaireSubmitDirective,
  ],
  template: `
    <z-questionnaire [zItems]="items" [(zActive)]="active" zShortcuts="letters" (zSubmit)="submitted = $event">
      <z-questionnaire-progress />

      @for (item of items; track item.name) {
        <z-questionnaire-item
          [attr.data-testid]="item.name"
          [zName]="item.name"
          [zRequired]="item.required"
          [zDisabled]="item.disabled"
        >
          <z-questionnaire-choice [zValue]="item.name + '-answer'">{{ item.name }} answer</z-questionnaire-choice>
        </z-questionnaire-item>
      }

      <button type="button" z-questionnaire-next>Next</button>
      <button type="submit" z-questionnaire-submit>Submit</button>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class DisabledItemHostComponent {
  readonly items: ZardQuestionnaireItem[] = [
    { name: 'first', required: true },
    { name: 'disabled', required: true, disabled: true },
    { name: 'last', required: true },
  ];

  active: string | undefined;
  submitted: ZardQuestionnaireAnswers | undefined;
}

@Component({
  imports: [
    ZardQuestionnaireChoiceComponent,
    ZardQuestionnaireComponent,
    ZardQuestionnaireErrorComponent,
    ZardQuestionnaireItemComponent,
    ZardQuestionnaireNextDirective,
    ZardQuestionnairePreviousDirective,
    ZardQuestionnaireProgressComponent,
    ZardQuestionnaireSkipDirective,
    ZardQuestionnaireSubmitDirective,
  ],
  template: `
    <z-questionnaire [zItems]="items" [(zActive)]="active" [zShortcuts]="shortcuts" (zSubmit)="submitted = $event">
      <z-questionnaire-progress />

      @for (item of items; track item.name) {
        <z-questionnaire-item
          [attr.data-testid]="'item-' + item.name"
          [zName]="item.name"
          [zRequired]="item.required"
          [zMultiple]="item.multiple"
          [zDisabled]="item.disabled"
        >
          <z-questionnaire-choice
            [attr.data-testid]="item.name + '-a'"
            [zValue]="item.name + '-a'"
            [zDisabled]="firstChoiceDisabled && item.name === 'first'"
          >
            {{ item.name }} A
          </z-questionnaire-choice>
          <z-questionnaire-choice [attr.data-testid]="item.name + '-b'" [zValue]="item.name + '-b'">
            {{ item.name }} B
          </z-questionnaire-choice>
          <input [attr.data-testid]="item.name + '-typing-input'" />
          <textarea [attr.data-testid]="item.name + '-typing-textarea'"></textarea>
          <select [attr.data-testid]="item.name + '-typing-select'">
            <option>Option</option>
          </select>
          <div contenteditable="true" [attr.data-testid]="item.name + '-typing-contenteditable'"></div>
          <z-questionnaire-error />
        </z-questionnaire-item>
      }

      <button type="button" z-questionnaire-previous>Previous</button>
      <button type="button" z-questionnaire-skip>Skip</button>
      <button type="button" z-questionnaire-next>Next</button>
      <button type="submit" z-questionnaire-submit>Submit</button>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class QuestionnaireBehaviorHostComponent {
  items: ZardQuestionnaireItem[] = [];
  active: string | undefined;
  submitted: ZardQuestionnaireAnswers | undefined;
  shortcuts: ZardQuestionnaireShortcutMode = 'letters';
  firstChoiceDisabled = false;
}

@Component({
  imports: [
    ZardQuestionnaireChoiceComponent,
    ZardQuestionnaireComponent,
    ZardQuestionnaireInputComponent,
    ZardQuestionnaireItemComponent,
    ZardQuestionnaireSubmitDirective,
  ],
  template: `
    <z-questionnaire [zItems]="items" (zSubmit)="submitted = $event">
      <z-questionnaire-item zName="answer" [zMultiple]="multiple">
        <z-questionnaire-choice zValue="fixed">Fixed answer</z-questionnaire-choice>
        <z-questionnaire-input placeholder="Other answer" />
      </z-questionnaire-item>

      <button type="submit" z-questionnaire-submit>Submit</button>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class QuestionnaireMixedAnswerHostComponent {
  multiple = false;
  items: ZardQuestionnaireItem[] = [{ name: 'answer' }];
  submitted: ZardQuestionnaireAnswers | undefined;
}

@Component({
  imports: [
    ZardQuestionnaireChoiceComponent,
    ZardQuestionnaireChoicesComponent,
    ZardQuestionnaireComponent,
    ZardQuestionnaireDescriptionComponent,
    ZardQuestionnaireActionsComponent,
    ZardQuestionnaireErrorComponent,
    ZardQuestionnaireInputComponent,
    ZardQuestionnaireItemComponent,
    ZardQuestionnaireProgressComponent,
    ZardQuestionnaireTitleComponent,
  ],
  template: `
    <z-questionnaire [zItems]="items" zShortcuts="letters">
      <z-questionnaire-progress />
      <z-questionnaire-item zName="first">
        <z-questionnaire-title>Question title</z-questionnaire-title>
        <z-questionnaire-description>Question description</z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="answer" zDisabled>Answer</z-questionnaire-choice>
          <z-questionnaire-choice zValue="shortcut">Shortcut answer</z-questionnaire-choice>
          <z-questionnaire-input placeholder="Other answer" />
        </z-questionnaire-choices>
        <z-questionnaire-error>Choose an answer.</z-questionnaire-error>
      </z-questionnaire-item>
      <z-questionnaire-actions>Actions</z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class QuestionnaireStylesHostComponent {
  readonly items: ZardQuestionnaireItem[] = [{ name: 'first', required: true }];
}

@Component({
  imports: [
    ZardQuestionnaireChoiceComponent,
    ZardQuestionnaireComponent,
    ZardQuestionnaireErrorComponent,
    ZardQuestionnaireItemComponent,
  ],
  template: `
    <z-questionnaire [zItems]="items">
      <z-questionnaire-item zName="first" zRequired [zInvalid]="invalid">
        <z-questionnaire-choice zValue="valid-answer">Valid answer</z-questionnaire-choice>
        <z-questionnaire-error>That answer is not valid.</z-questionnaire-error>
      </z-questionnaire-item>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class QuestionnaireExternalValidationHostComponent {
  readonly items: ZardQuestionnaireItem[] = [{ name: 'first', required: true }];
  invalid = false;
}

@Component({
  imports: [
    ZardQuestionnaireChoiceComponent,
    ZardQuestionnaireChoicesComponent,
    ZardQuestionnaireComponent,
    ZardQuestionnaireDescriptionComponent,
    ZardQuestionnaireActionsComponent,
    ZardQuestionnaireErrorComponent,
    ZardQuestionnaireInputComponent,
    ZardQuestionnaireItemComponent,
    ZardQuestionnaireProgressComponent,
    ZardQuestionnaireTitleComponent,
    ZardQuestionnaireChoiceDescriptionComponent,
  ],
  template: `
    <z-questionnaire class="max-w-xl" [zItems]="items">
      <z-questionnaire-progress class="text-sm" />
      <z-questionnaire-item class="gap-6" zName="first">
        <z-questionnaire-title class="text-lg">Question title</z-questionnaire-title>
        <z-questionnaire-description class="text-base">Question description</z-questionnaire-description>
        <z-questionnaire-choices class="gap-3">
          <z-questionnaire-choice class="rounded-md" zValue="answer">
            Answer
            <z-questionnaire-choice-description class="text-foreground">Answer hint</z-questionnaire-choice-description>
          </z-questionnaire-choice>
          <z-questionnaire-input class="h-10" placeholder="Other answer" />
        </z-questionnaire-choices>
        <z-questionnaire-error class="mt-4">Choose an answer.</z-questionnaire-error>
      </z-questionnaire-item>
      <z-questionnaire-actions class="gap-4">Actions</z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class QuestionnaireStyleOverridesHostComponent {
  readonly items: ZardQuestionnaireItem[] = [{ name: 'first' }];
}

@Component({
  imports: [ReactiveFormsModule, ...ZardQuestionnaireImports],
  template: `
    <z-questionnaire [formControl]="answers" [zItems]="items">
      <z-questionnaire-item zName="choice">
        <z-questionnaire-choice zValue="alpha">Alpha</z-questionnaire-choice>
        <z-questionnaire-choice zValue="beta">Beta</z-questionnaire-choice>
      </z-questionnaire-item>
      <z-questionnaire-item zName="tags" zMultiple>
        <z-questionnaire-choice zValue="tests">Tests</z-questionnaire-choice>
        <z-questionnaire-choice zValue="docs">Docs</z-questionnaire-choice>
      </z-questionnaire-item>
      <z-questionnaire-item zName="note">
        <z-questionnaire-input aria-label="Note" />
      </z-questionnaire-item>
      <z-questionnaire-actions>
        <button type="button" z-questionnaire-next>Next</button>
        <button type="submit" z-questionnaire-submit>Submit</button>
      </z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class QuestionnaireReactiveFormsHostComponent {
  readonly items: ZardQuestionnaireItem[] = [{ name: 'choice' }, { name: 'tags', multiple: true }, { name: 'note' }];

  readonly answers = new FormControl<ZardQuestionnaireAnswers>(
    { choice: 'beta', tags: ['tests', 'docs'], note: 'Saved note' },
    { nonNullable: true },
  );
}

@Component({
  imports: [...ZardQuestionnaireImports],
  template: `
    <z-questionnaire [zItems]="items" [(zActive)]="active" zShortcuts="letters" (zSubmit)="submitted = $event">
      <z-questionnaire-progress />
      <z-questionnaire-item zName="required-item" zRequired>
        <z-questionnaire-choice zValue="one">One</z-questionnaire-choice>
      </z-questionnaire-item>
      <z-questionnaire-item zName="off-item" zDisabled>
        <z-questionnaire-choice zValue="off">Off</z-questionnaire-choice>
      </z-questionnaire-item>
      <z-questionnaire-item zName="tags" zMultiple>
        <z-questionnaire-choice zValue="x">X</z-questionnaire-choice>
        <z-questionnaire-choice zValue="y">Y</z-questionnaire-choice>
      </z-questionnaire-item>
      <z-questionnaire-item zName="relaxed" [zRequired]="false">
        <z-questionnaire-choice zValue="r">R</z-questionnaire-choice>
      </z-questionnaire-item>
      <button type="button" z-questionnaire-next>Next</button>
      <button type="button" z-questionnaire-skip>Skip</button>
      <button type="submit" z-questionnaire-submit>Submit</button>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class QuestionnaireItemPrecedenceHostComponent {
  items: ZardQuestionnaireItem[] = [];
  active: string | undefined;
  submitted: ZardQuestionnaireAnswers | undefined;
}

@Component({
  imports: [...ZardQuestionnaireImports],
  template: `
    <input data-testid="outside-input" />
    <z-questionnaire data-testid="q1" zShortcuts="letters">
      <z-questionnaire-item zName="one">
        <z-questionnaire-choice zValue="a">A</z-questionnaire-choice>
        <z-questionnaire-choice zValue="b">B</z-questionnaire-choice>
      </z-questionnaire-item>
    </z-questionnaire>
    <z-questionnaire data-testid="q2" zShortcuts="letters">
      <z-questionnaire-item zName="two">
        <z-questionnaire-choice zValue="a">A</z-questionnaire-choice>
        <z-questionnaire-choice zValue="b">B</z-questionnaire-choice>
      </z-questionnaire-item>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class TwoQuestionnairesHostComponent {}

async function createBehaviorFixture(
  items: ZardQuestionnaireItem[],
  active?: string,
): Promise<ComponentFixture<QuestionnaireBehaviorHostComponent>> {
  await TestBed.configureTestingModule({ imports: [QuestionnaireBehaviorHostComponent] }).compileComponents();
  const fixture = TestBed.createComponent(QuestionnaireBehaviorHostComponent);
  fixture.componentInstance.items = items;
  fixture.componentInstance.active = active;
  fixture.detectChanges();
  return fixture;
}

function getItem(fixture: ComponentFixture<QuestionnaireBehaviorHostComponent>, name: string): HTMLElement {
  return fixture.debugElement.query(By.css(`[data-testid="item-${name}"]`)).nativeElement as HTMLElement;
}

function getChoiceInput(
  fixture: ComponentFixture<QuestionnaireBehaviorHostComponent>,
  itemName: string,
  choice: 'a' | 'b',
): HTMLInputElement {
  const choiceElement = fixture.debugElement.query(By.css(`[data-testid="${itemName}-${choice}"]`))
    .nativeElement as HTMLElement;
  return choiceElement.querySelector('input') as HTMLInputElement;
}

function clickAction<T>(fixture: ComponentFixture<T>, directive: Type<unknown>): void {
  (fixture.debugElement.query(By.directive(directive)).nativeElement as HTMLButtonElement).click();
  fixture.detectChanges();
}

function getAction<T>(fixture: ComponentFixture<T>, directive: Type<unknown>): HTMLButtonElement {
  return fixture.debugElement.query(By.directive(directive)).nativeElement as HTMLButtonElement;
}

function dispatchShortcut<T>(fixture: ComponentFixture<T>, key: string, options: KeyboardEventInit = {}): void {
  const questionnaire = fixture.nativeElement.querySelector('z-questionnaire') as HTMLElement;
  questionnaire.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...options }));
  fixture.detectChanges();
}

describe('ZardQuestionnaireComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('should activate the first enabled item initially', async () => {
    await TestBed.configureTestingModule({ imports: [InitialActiveItemHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(InitialActiveItemHostComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.active).toBe('first-enabled');

    const items = fixture.debugElement.queryAll(By.directive(ZardQuestionnaireItemComponent));
    expect(items.map(item => (item.nativeElement as HTMLFieldSetElement).hidden)).toEqual([true, false, true]);
  });

  it('should mark only the active item fieldset for state-based styling', async () => {
    const fixture = await createBehaviorFixture([
      { name: 'first', required: true },
      { name: 'second', required: true },
    ]);
    const firstFieldset = getItem(fixture, 'first').querySelector('fieldset') as HTMLFieldSetElement;
    const secondFieldset = getItem(fixture, 'second').querySelector('fieldset') as HTMLFieldSetElement;

    expect(firstFieldset).toHaveAttribute('data-active', '');
    expect(secondFieldset).not.toHaveAttribute('data-active');

    getChoiceInput(fixture, 'first', 'a').click();
    fixture.detectChanges();
    clickAction(fixture, ZardQuestionnaireNextDirective);

    expect(firstFieldset).not.toHaveAttribute('data-active');
    expect(secondFieldset).toHaveAttribute('data-active', '');
  });

  it('should exclude disabled items from progress, navigation, validation, shortcuts, and submission', async () => {
    await TestBed.configureTestingModule({ imports: [DisabledItemHostComponent] }).compileComponents();
    const fixture: ComponentFixture<DisabledItemHostComponent> = TestBed.createComponent(DisabledItemHostComponent);
    fixture.detectChanges();

    const progress = fixture.debugElement.query(By.directive(ZardQuestionnaireProgressComponent))
      .nativeElement as HTMLElement;
    const disabledItem = fixture.debugElement.query(By.css('[data-testid="disabled"]')).nativeElement as HTMLElement;

    expect(progress.getAttribute('aria-valuemax')).toBe('2');
    expect(progress.textContent).toContain('Question 1 of 2');
    expect(disabledItem.hidden).toBe(true);
    expect(disabledItem.querySelector('[aria-keyshortcuts]')).toBeNull();

    dispatchShortcut(fixture, 'a');
    fixture.debugElement.query(By.directive(ZardQuestionnaireNextDirective)).nativeElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.active).toBe('last');

    dispatchShortcut(fixture, 'a');
    fixture.debugElement.query(By.directive(ZardQuestionnaireSubmitDirective)).nativeElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.submitted).toEqual({
      first: 'first-answer',
      last: 'last-answer',
    });
    expect(fixture.componentInstance.submitted).not.toHaveProperty('disabled');
  });

  it('should require required items to contain an answer', async () => {
    const fixture = await createBehaviorFixture([
      { name: 'required', required: true },
      { name: 'next', required: true },
    ]);

    clickAction(fixture, ZardQuestionnaireNextDirective);

    expect(fixture.componentInstance.active).toBe('required');
    expect(getItem(fixture, 'required').getAttribute('aria-invalid')).toBe('true');

    getChoiceInput(fixture, 'required', 'a').click();
    fixture.detectChanges();
    clickAction(fixture, ZardQuestionnaireNextDirective);

    expect(fixture.componentInstance.active).toBe('next');
  });

  it('should show the default error message only while the active item is invalid', async () => {
    const fixture = await createBehaviorFixture([
      { name: 'required', required: true },
      { name: 'next', required: true },
    ]);
    const error = getItem(fixture, 'required').querySelector('[data-slot="questionnaire-error"]') as HTMLElement;

    expect(error.hidden).toBe(true);

    clickAction(fixture, ZardQuestionnaireNextDirective);

    expect(error.hidden).toBe(false);
    expect(error.textContent?.trim()).toBe('Choose an answer to continue.');

    getChoiceInput(fixture, 'required', 'a').click();
    fixture.detectChanges();

    expect(error.hidden).toBe(true);
  });

  it('should preserve a custom projected error message', async () => {
    await TestBed.configureTestingModule({ imports: [QuestionnaireStylesHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(QuestionnaireStylesHostComponent);
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    const error = fixture.nativeElement.querySelector('[data-slot="questionnaire-error"]') as HTMLElement;
    form.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(error.hidden).toBe(false);
    expect(error.textContent?.trim()).toBe('Choose an answer.');
  });

  it('should expose externally controlled item validation state', async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionnaireExternalValidationHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(QuestionnaireExternalValidationHostComponent);
    fixture.detectChanges();

    const item = fixture.nativeElement.querySelector('z-questionnaire-item') as HTMLElement;
    const fieldset = item.querySelector('fieldset') as HTMLFieldSetElement;
    const error = item.querySelector('[data-slot="questionnaire-error"]') as HTMLElement;

    expect(item.getAttribute('aria-invalid')).toBeNull();
    expect(fieldset.getAttribute('aria-invalid')).toBeNull();
    expect(error.hidden).toBe(true);

    fixture.componentInstance.invalid = true;
    fixture.detectChanges();

    expect(item.getAttribute('aria-invalid')).toBe('true');
    expect(fieldset.getAttribute('aria-invalid')).toBe('true');
    expect(error.hidden).toBe(false);
    expect(error.textContent?.trim()).toBe('That answer is not valid.');

    fixture.componentInstance.invalid = false;
    fixture.detectChanges();

    expect(item.getAttribute('aria-invalid')).toBeNull();
    expect(fieldset.getAttribute('aria-invalid')).toBeNull();
    expect(error.hidden).toBe(true);
  });

  it('should leave custom validation state under consumer control when the answer changes', async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionnaireExternalValidationHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(QuestionnaireExternalValidationHostComponent);
    fixture.componentInstance.invalid = true;
    fixture.detectChanges();

    const item = fixture.nativeElement.querySelector('z-questionnaire-item') as HTMLElement;
    const choice = item.querySelector('input') as HTMLInputElement;
    const error = item.querySelector('[data-slot="questionnaire-error"]') as HTMLElement;

    choice.click();
    fixture.detectChanges();

    expect(choice.checked).toBe(true);
    expect(item.getAttribute('aria-invalid')).toBe('true');
    expect(error.hidden).toBe(false);

    fixture.componentInstance.invalid = false;
    fixture.detectChanges();

    expect(item.getAttribute('aria-invalid')).toBeNull();
    expect(error.hidden).toBe(true);
  });

  it('should preserve built-in validation errors when custom validation is cleared', async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionnaireExternalValidationHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(QuestionnaireExternalValidationHostComponent);
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    const item = fixture.nativeElement.querySelector('z-questionnaire-item') as HTMLElement;
    const fieldset = item.querySelector('fieldset') as HTMLFieldSetElement;
    const error = item.querySelector('[data-slot="questionnaire-error"]') as HTMLElement;

    form.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    fixture.componentInstance.invalid = true;
    fixture.detectChanges();
    fixture.componentInstance.invalid = false;
    fixture.detectChanges();

    expect(item.getAttribute('aria-invalid')).toBe('true');
    expect(fieldset.getAttribute('aria-invalid')).toBe('true');
    expect(error.hidden).toBe(false);
  });

  it('should only pass an unanswered optional item when it is skipped', async () => {
    const fixture = await createBehaviorFixture([{ name: 'optional' }, { name: 'next', required: true }]);

    clickAction(fixture, ZardQuestionnaireNextDirective);

    expect(fixture.componentInstance.active).toBe('optional');
    expect(getItem(fixture, 'optional').getAttribute('aria-invalid')).toBe('true');

    clickAction(fixture, ZardQuestionnaireSkipDirective);

    expect(fixture.componentInstance.active).toBe('next');
  });

  it('should preserve answers when navigating to the previous item', async () => {
    const fixture = await createBehaviorFixture([
      { name: 'first', required: true },
      { name: 'second', required: true },
    ]);

    getChoiceInput(fixture, 'first', 'b').click();
    fixture.detectChanges();
    clickAction(fixture, ZardQuestionnaireNextDirective);
    clickAction(fixture, ZardQuestionnairePreviousDirective);

    expect(fixture.componentInstance.active).toBe('first');
    expect(getChoiceInput(fixture, 'first', 'b').checked).toBe(true);
  });

  it('should validate only the current item when moving next', async () => {
    const fixture = await createBehaviorFixture([
      { name: 'first', required: true },
      { name: 'second', required: true },
      { name: 'third', required: true },
    ]);

    clickAction(fixture, ZardQuestionnaireNextDirective);

    expect(getItem(fixture, 'first').getAttribute('aria-invalid')).toBe('true');
    expect(getItem(fixture, 'second').getAttribute('aria-invalid')).toBeNull();
    expect(getItem(fixture, 'third').getAttribute('aria-invalid')).toBeNull();
  });

  it('should validate all enabled items on submit and open the first invalid item', async () => {
    const fixture = await createBehaviorFixture(
      [
        { name: 'first', required: true },
        { name: 'disabled', required: true, disabled: true },
        { name: 'second', required: true },
        { name: 'third', required: true },
      ],
      'third',
    );

    clickAction(fixture, ZardQuestionnaireSubmitDirective);

    expect(fixture.componentInstance.active).toBe('first');
    expect(getItem(fixture, 'first').getAttribute('aria-invalid')).toBe('true');
    expect(getItem(fixture, 'second').getAttribute('aria-invalid')).toBe('true');
    expect(getItem(fixture, 'third').getAttribute('aria-invalid')).toBe('true');
    expect(getItem(fixture, 'disabled').getAttribute('aria-invalid')).toBeNull();
    expect(fixture.componentInstance.submitted).toBeUndefined();
  });

  it('should serialize a single answer as a string', async () => {
    const fixture = await createBehaviorFixture([{ name: 'single', required: true }]);

    getChoiceInput(fixture, 'single', 'a').click();
    fixture.detectChanges();
    clickAction(fixture, ZardQuestionnaireSubmitDirective);

    expect(fixture.componentInstance.submitted).toEqual({ single: 'single-a' });
    expect(typeof fixture.componentInstance.submitted?.['single']).toBe('string');
  });

  it('should clear a fixed single answer when freeform text is entered', async () => {
    await TestBed.configureTestingModule({ imports: [QuestionnaireMixedAnswerHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(QuestionnaireMixedAnswerHostComponent);
    fixture.detectChanges();
    const choice = fixture.nativeElement.querySelector('input[type="radio"]') as HTMLInputElement;
    const freeform = fixture.nativeElement.querySelector('[data-slot="questionnaire-input"]') as HTMLInputElement;

    choice.click();
    freeform.value = 'Custom answer';
    freeform.dispatchEvent(new InputEvent('input', { bubbles: true }));
    fixture.detectChanges();

    expect(choice.checked).toBe(false);
    clickAction(fixture, ZardQuestionnaireSubmitDirective);
    expect(fixture.componentInstance.submitted).toEqual({ answer: 'Custom answer' });
  });

  it('should clear freeform text when a fixed single answer is checked', async () => {
    await TestBed.configureTestingModule({ imports: [QuestionnaireMixedAnswerHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(QuestionnaireMixedAnswerHostComponent);
    fixture.detectChanges();
    const choice = fixture.nativeElement.querySelector('input[type="radio"]') as HTMLInputElement;
    const freeform = fixture.nativeElement.querySelector('[data-slot="questionnaire-input"]') as HTMLInputElement;

    freeform.value = 'Custom answer';
    freeform.dispatchEvent(new InputEvent('input', { bubbles: true }));
    choice.click();
    fixture.detectChanges();

    expect(freeform.value).toBe('');
    clickAction(fixture, ZardQuestionnaireSubmitDirective);
    expect(fixture.componentInstance.submitted).toEqual({ answer: 'fixed' });
  });

  it('should preserve fixed and freeform answers for a multiple-answer item', async () => {
    await TestBed.configureTestingModule({ imports: [QuestionnaireMixedAnswerHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(QuestionnaireMixedAnswerHostComponent);
    fixture.componentInstance.multiple = true;
    fixture.componentInstance.items = [{ name: 'answer', multiple: true }];
    fixture.detectChanges();
    const choice = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    const freeform = fixture.nativeElement.querySelector('[data-slot="questionnaire-input"]') as HTMLInputElement;

    choice.click();
    freeform.value = 'Custom answer';
    freeform.dispatchEvent(new InputEvent('input', { bubbles: true }));
    fixture.detectChanges();

    expect(choice.checked).toBe(true);
    expect(freeform.value).toBe('Custom answer');
    clickAction(fixture, ZardQuestionnaireSubmitDirective);
    expect(fixture.componentInstance.submitted).toEqual({ answer: ['fixed', 'Custom answer'] });
  });

  it('should serialize multiple answers as an array', async () => {
    const fixture = await createBehaviorFixture([{ name: 'multiple', required: true, multiple: true }]);

    getChoiceInput(fixture, 'multiple', 'a').click();
    getChoiceInput(fixture, 'multiple', 'b').click();
    fixture.detectChanges();
    clickAction(fixture, ZardQuestionnaireSubmitDirective);

    expect(fixture.componentInstance.submitted).toEqual({ multiple: ['multiple-a', 'multiple-b'] });
    expect(Array.isArray(fixture.componentInstance.submitted?.['multiple'])).toBe(true);
  });

  it('should omit skipped answers from the submitted record', async () => {
    const fixture = await createBehaviorFixture([{ name: 'optional' }, { name: 'required', required: true }]);

    clickAction(fixture, ZardQuestionnaireSkipDirective);
    getChoiceInput(fixture, 'required', 'a').click();
    fixture.detectChanges();
    clickAction(fixture, ZardQuestionnaireSubmitDirective);

    expect(fixture.componentInstance.submitted).toEqual({ required: 'required-a' });
    expect(fixture.componentInstance.submitted).not.toHaveProperty('optional');
  });

  it('should select an answer with a shortcut without advancing', async () => {
    const fixture = await createBehaviorFixture([
      { name: 'first', required: true },
      { name: 'second', required: true },
    ]);

    dispatchShortcut(fixture, 'a');

    expect(getChoiceInput(fixture, 'first', 'a').checked).toBe(true);
    expect(fixture.componentInstance.active).toBe('first');
  });

  it('should not activate answer shortcuts while typing in an input', async () => {
    const fixture = await createBehaviorFixture([{ name: 'first', required: true }]);
    const typingInput = fixture.debugElement.query(By.css('[data-testid="first-typing-input"]'))
      .nativeElement as HTMLInputElement;

    typingInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    fixture.detectChanges();

    expect(getChoiceInput(fixture, 'first', 'a').checked).toBe(false);
    expect(getChoiceInput(fixture, 'first', 'b').checked).toBe(false);
    expect(fixture.componentInstance.active).toBe('first');
  });

  it('should allow an answered optional item to advance without being skipped', async () => {
    const fixture = await createBehaviorFixture([{ name: 'optional' }, { name: 'next', required: true }]);

    getChoiceInput(fixture, 'optional', 'a').click();
    fixture.detectChanges();
    clickAction(fixture, ZardQuestionnaireNextDirective);

    expect(fixture.componentInstance.active).toBe('next');
  });

  it('should not allow a required item to be skipped', async () => {
    const fixture = await createBehaviorFixture([
      { name: 'required', required: true },
      { name: 'next', required: true },
    ]);
    const skip = getAction(fixture, ZardQuestionnaireSkipDirective);

    expect(skip.disabled).toBe(true);

    skip.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.active).toBe('required');
  });

  it('should submit an answer added after an item was previously skipped', async () => {
    const fixture = await createBehaviorFixture([{ name: 'optional' }, { name: 'required', required: true }]);

    clickAction(fixture, ZardQuestionnaireSkipDirective);
    clickAction(fixture, ZardQuestionnairePreviousDirective);
    getChoiceInput(fixture, 'optional', 'a').click();
    fixture.detectChanges();
    clickAction(fixture, ZardQuestionnaireNextDirective);
    getChoiceInput(fixture, 'required', 'a').click();
    fixture.detectChanges();
    clickAction(fixture, ZardQuestionnaireSubmitDirective);

    expect(fixture.componentInstance.submitted).toEqual({
      optional: 'optional-a',
      required: 'required-a',
    });
  });

  it('should select an answer with a number shortcut without advancing', async () => {
    const fixture = await createBehaviorFixture([
      { name: 'first', required: true },
      { name: 'second', required: true },
    ]);
    fixture.componentInstance.shortcuts = 'numbers';
    fixture.detectChanges();

    dispatchShortcut(fixture, '2');

    expect(getChoiceInput(fixture, 'first', 'b').checked).toBe(true);
    expect(fixture.componentInstance.active).toBe('first');
  });

  it('should select an answer with a shortcut while a choice has focus', async () => {
    const fixture = await createBehaviorFixture([{ name: 'first', required: true }]);
    const firstChoice = getChoiceInput(fixture, 'first', 'a');

    firstChoice.focus();
    firstChoice.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', bubbles: true }));
    fixture.detectChanges();

    expect(getChoiceInput(fixture, 'first', 'b').checked).toBe(true);
  });

  it('should ignore shortcuts with modifier keys', async () => {
    const fixture = await createBehaviorFixture([{ name: 'first', required: true }]);

    dispatchShortcut(fixture, 'a', { ctrlKey: true });

    expect(getChoiceInput(fixture, 'first', 'a').checked).toBe(false);
  });

  it('should not select a disabled choice with a shortcut', async () => {
    const fixture = await createBehaviorFixture([{ name: 'first', required: true }]);
    fixture.componentInstance.firstChoiceDisabled = true;
    fixture.detectChanges();

    dispatchShortcut(fixture, 'a');

    expect(getChoiceInput(fixture, 'first', 'a').checked).toBe(false);
  });

  it.each(['textarea', 'select', 'contenteditable'] as const)(
    'should not activate answer shortcuts while typing in a %s',
    async control => {
      const fixture = await createBehaviorFixture([{ name: 'first', required: true }]);
      const typingControl = fixture.debugElement.query(By.css(`[data-testid="first-typing-${control}"]`))
        .nativeElement as HTMLElement;

      typingControl.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
      fixture.detectChanges();

      expect(getChoiceInput(fixture, 'first', 'a').checked).toBe(false);
      expect(getChoiceInput(fixture, 'first', 'b').checked).toBe(false);
    },
  );

  it('should announce the assigned shortcuts on active choices', async () => {
    const fixture = await createBehaviorFixture([{ name: 'first', required: true }]);

    expect(getChoiceInput(fixture, 'first', 'a').getAttribute('aria-keyshortcuts')).toBe('a');
    expect(getChoiceInput(fixture, 'first', 'b').getAttribute('aria-keyshortcuts')).toBe('b');
  });

  it('should display the assigned letter shortcuts on active choices', async () => {
    const fixture = await createBehaviorFixture([{ name: 'first', required: true }]);
    const shortcuts = fixture.nativeElement.querySelectorAll('[data-slot="questionnaire-choice-shortcut"]');

    expect(Array.from(shortcuts, (shortcut: Element) => shortcut.textContent?.trim())).toEqual(['A', 'B']);
    expect(Array.from(shortcuts, (shortcut: Element) => shortcut.getAttribute('aria-hidden'))).toEqual([
      'true',
      'true',
    ]);
  });

  it('should display number shortcuts and hide shortcut badges when shortcuts are disabled', async () => {
    const fixture = await createBehaviorFixture([{ name: 'first', required: true }]);
    fixture.componentInstance.shortcuts = 'numbers';
    fixture.detectChanges();

    expect(
      Array.from(
        fixture.nativeElement.querySelectorAll('[data-slot="questionnaire-choice-shortcut"]'),
        (shortcut: Element) => shortcut.textContent?.trim(),
      ),
    ).toEqual(['1', '2']);

    fixture.componentInstance.shortcuts = 'none';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-slot="questionnaire-choice-shortcut"]')).toBeNull();
  });

  it('should clear an item error after the answer is corrected and Next is retried', async () => {
    const fixture = await createBehaviorFixture([
      { name: 'first', required: true },
      { name: 'second', required: true },
    ]);

    clickAction(fixture, ZardQuestionnaireNextDirective);
    expect(getItem(fixture, 'first').getAttribute('aria-invalid')).toBe('true');

    getChoiceInput(fixture, 'first', 'a').click();
    fixture.detectChanges();
    clickAction(fixture, ZardQuestionnaireNextDirective);

    expect(getItem(fixture, 'first').getAttribute('aria-invalid')).toBeNull();
  });

  it('should clear an item error immediately when the answer is corrected', async () => {
    const fixture = await createBehaviorFixture([
      { name: 'first', required: true },
      { name: 'second', required: true },
    ]);

    clickAction(fixture, ZardQuestionnaireNextDirective);
    expect(getItem(fixture, 'first').getAttribute('aria-invalid')).toBe('true');

    getChoiceInput(fixture, 'first', 'a').click();
    fixture.detectChanges();

    expect(getItem(fixture, 'first').getAttribute('aria-invalid')).toBeNull();
  });

  it('should focus the first answer in the new item after moving next', async () => {
    const fixture = await createBehaviorFixture([
      { name: 'first', required: true },
      { name: 'second', required: true },
    ]);
    getChoiceInput(fixture, 'first', 'a').click();
    fixture.detectChanges();

    clickAction(fixture, ZardQuestionnaireNextDirective);
    await fixture.whenStable();

    expect(document.activeElement === getChoiceInput(fixture, 'second', 'a')).toBe(true);
  });

  it('should focus the first answer in the new item after moving previous', async () => {
    const fixture = await createBehaviorFixture(
      [
        { name: 'first', required: true },
        { name: 'second', required: true },
      ],
      'second',
    );

    clickAction(fixture, ZardQuestionnairePreviousDirective);
    await fixture.whenStable();

    expect(document.activeElement === getChoiceInput(fixture, 'first', 'a')).toBe(true);
  });

  it('should focus the first answer in the new item after skipping', async () => {
    const fixture = await createBehaviorFixture([{ name: 'optional' }, { name: 'required', required: true }]);

    clickAction(fixture, ZardQuestionnaireSkipDirective);
    await fixture.whenStable();

    expect(document.activeElement === getChoiceInput(fixture, 'required', 'a')).toBe(true);
  });

  it('should focus the first answer in the first invalid item on submit', async () => {
    const fixture = await createBehaviorFixture(
      [
        { name: 'first', required: true },
        { name: 'second', required: true },
      ],
      'second',
    );

    clickAction(fixture, ZardQuestionnaireSubmitDirective);
    await fixture.whenStable();

    expect(fixture.componentInstance.active).toBe('first');
    expect(document.activeElement === getChoiceInput(fixture, 'first', 'a')).toBe(true);
  });

  it.each([
    ['empty', []],
    ['all-disabled', [{ name: 'disabled', disabled: true }]],
  ] as const)('should disable every navigation action for an %s item list', async (_case, items) => {
    const fixture = await createBehaviorFixture([...items]);
    const progress = fixture.debugElement.query(By.directive(ZardQuestionnaireProgressComponent))
      .nativeElement as HTMLElement;

    expect(fixture.componentInstance.active).toBeUndefined();
    expect(progress.textContent).toContain('Question 0 of 0');
    expect(progress.getAttribute('aria-valuemax')).toBe('0');
    expect(progress.getAttribute('aria-valuenow')).toBe('0');
    expect(getAction(fixture, ZardQuestionnairePreviousDirective).disabled).toBe(true);
    expect(getAction(fixture, ZardQuestionnaireSkipDirective).disabled).toBe(true);
    expect(getAction(fixture, ZardQuestionnaireNextDirective).disabled).toBe(true);
    expect(getAction(fixture, ZardQuestionnaireSubmitDirective).disabled).toBe(true);
  });

  it('should clear validation state and restore the first enabled item on form reset', async () => {
    const fixture = await createBehaviorFixture([
      { name: 'first', required: true },
      { name: 'second', required: true },
    ]);

    clickAction(fixture, ZardQuestionnaireNextDirective);
    expect(getItem(fixture, 'first').getAttribute('aria-invalid')).toBe('true');

    const form = fixture.debugElement.query(By.css('form')).nativeElement as HTMLFormElement;
    form.reset();
    fixture.detectChanges();

    expect(fixture.componentInstance.active).toBe('first');
    expect(getItem(fixture, 'first').getAttribute('aria-invalid')).toBeNull();
  });

  it('should clear skipped state on form reset', async () => {
    const fixture = await createBehaviorFixture([{ name: 'optional' }, { name: 'required', required: true }]);

    clickAction(fixture, ZardQuestionnaireSkipDirective);
    const form = fixture.debugElement.query(By.css('form')).nativeElement as HTMLFormElement;
    form.reset();
    fixture.detectChanges();

    expect(fixture.componentInstance.active).toBe('optional');
    expect(getAction(fixture, ZardQuestionnaireSkipDirective).disabled).toBe(false);
  });

  it('should retain a valid controlled active item', async () => {
    const fixture = await createBehaviorFixture(
      [
        { name: 'first', required: true },
        { name: 'second', required: true },
      ],
      'second',
    );

    expect(fixture.componentInstance.active).toBe('second');
    expect(getItem(fixture, 'first').hidden).toBe(true);
    expect(getItem(fixture, 'second').hidden).toBe(false);
  });

  it('should manage the active item without a zActive binding', async () => {
    await TestBed.configureTestingModule({ imports: [UncontrolledQuestionnaireHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(UncontrolledQuestionnaireHostComponent);
    fixture.detectChanges();
    const questionnaire = fixture.debugElement.query(By.directive(ZardQuestionnaireComponent))
      .componentInstance as ZardQuestionnaireComponent;
    const firstItem = fixture.debugElement.query(By.css('[data-testid="uncontrolled-first"]'))
      .nativeElement as HTMLElement;
    const secondItem = fixture.debugElement.query(By.css('[data-testid="uncontrolled-second"]'))
      .nativeElement as HTMLElement;

    expect(questionnaire.zActive()).toBe('first');
    expect(firstItem.hidden).toBe(false);
    expect(secondItem.hidden).toBe(true);

    (firstItem.querySelector('input') as HTMLInputElement).click();
    fixture.detectChanges();
    clickAction(fixture, ZardQuestionnaireNextDirective);

    expect(questionnaire.zActive()).toBe('second');
    expect(firstItem.hidden).toBe(true);
    expect(secondItem.hidden).toBe(false);
  });

  it('should keep the basic demo item definitions aligned with its projected item names', async () => {
    await TestBed.configureTestingModule({
      imports: [ZardDemoQuestionnaireDefaultComponent],
      providers: [{ provide: ZardSonnerService, useValue: { show: jest.fn() } }],
    }).compileComponents();
    const fixture = TestBed.createComponent(ZardDemoQuestionnaireDefaultComponent);
    fixture.detectChanges();
    const firstChoice = fixture.debugElement.query(By.css('input[value="tool-calls"]'))
      .nativeElement as HTMLInputElement;
    const next = fixture.debugElement.query(By.directive(ZardQuestionnaireNextDirective))
      .nativeElement as HTMLButtonElement;

    firstChoice.click();
    next.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const activeItem = fixture.nativeElement.querySelector('z-questionnaire-item:not([hidden])') as HTMLElement | null;
    const progress = fixture.debugElement.query(By.directive(ZardQuestionnaireProgressComponent))
      .nativeElement as HTMLElement;
    expect(activeItem?.getAttribute('data-questionnaire-name')).toBe('updates');
    expect(progress.getAttribute('aria-valuetext')).toBe('Question 2 of 3');
    expect(document.activeElement?.getAttribute('name')).toBe('updates');
  });

  it('should read, update, touch, and disable answers through Reactive Forms', async () => {
    await TestBed.configureTestingModule({ imports: [QuestionnaireReactiveFormsHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(QuestionnaireReactiveFormsHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const input = (value: string): HTMLInputElement =>
      fixture.nativeElement.querySelector(`input[value="${value}"]`) as HTMLInputElement;
    const note = fixture.nativeElement.querySelector('[data-slot="questionnaire-input"]') as HTMLInputElement;
    expect(input('beta').checked).toBe(true);
    expect(input('tests').checked).toBe(true);
    expect(input('docs').checked).toBe(true);
    expect(note.value).toBe('Saved note');

    input('alpha').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.answers.value).toEqual({
      choice: 'alpha',
      tags: ['tests', 'docs'],
      note: 'Saved note',
    });

    input('tests').click();
    input('docs').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.answers.value).toEqual({ choice: 'alpha', note: 'Saved note' });

    note.value = '';
    note.dispatchEvent(new InputEvent('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.answers.value).toEqual({ choice: 'alpha' });

    input('alpha').dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.answers.touched).toBe(true);

    fixture.componentInstance.answers.disable();
    fixture.detectChanges();
    expect(
      Array.from(fixture.nativeElement.querySelectorAll('fieldset')).every(
        fieldset => (fieldset as HTMLFieldSetElement).disabled,
      ),
    ).toBe(true);
    expect(getAction(fixture, ZardQuestionnaireNextDirective).disabled).toBe(true);
    expect(fixture.nativeElement.querySelector('z-questionnaire-item:not([hidden])')).not.toBeNull();
  });

  it('should re-apply answers when the same value object is written again', async () => {
    await TestBed.configureTestingModule({ imports: [QuestionnaireReactiveFormsHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(QuestionnaireReactiveFormsHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const saved = { choice: 'beta' };
    const beta = fixture.nativeElement.querySelector('input[value="beta"]') as HTMLInputElement;
    const alpha = fixture.nativeElement.querySelector('input[value="alpha"]') as HTMLInputElement;
    fixture.componentInstance.answers.setValue(saved);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(beta.checked).toBe(true);

    alpha.click();
    fixture.detectChanges();
    expect(alpha.checked).toBe(true);

    fixture.componentInstance.answers.setValue(saved);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(beta.checked).toBe(true);
  });

  it('should resume from native controls initialized with saved answers', async () => {
    await TestBed.configureTestingModule({ imports: [ResumedQuestionnaireHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ResumedQuestionnaireHostComponent);
    fixture.detectChanges();
    const checkedInputs = fixture.debugElement.queryAll(By.css('input:checked'));

    expect(checkedInputs.map(input => (input.nativeElement as HTMLInputElement).value)).toEqual([
      'saved-first',
      'saved-second',
    ]);

    clickAction(fixture, ZardQuestionnaireSubmitDirective);

    expect(fixture.componentInstance.submitted).toEqual({
      first: 'saved-first',
      second: 'saved-second',
    });
  });

  it('should restore saved answers supplied through questionnaire controls on form reset', async () => {
    await TestBed.configureTestingModule({ imports: [ResumedQuestionnaireControlsHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ResumedQuestionnaireControlsHostComponent);
    fixture.detectChanges();
    const form = fixture.debugElement.query(By.css('form')).nativeElement as HTMLFormElement;
    const saved = fixture.debugElement.query(By.css('input[value="saved"]')).nativeElement as HTMLInputElement;
    const changed = fixture.debugElement.query(By.css('input[value="changed"]')).nativeElement as HTMLInputElement;
    const note = fixture.debugElement.query(By.css('[data-slot="questionnaire-input"]'))
      .nativeElement as HTMLInputElement;

    expect(saved.checked).toBe(true);
    expect(note.value).toBe('Saved note');

    changed.click();
    note.value = 'Changed note';
    form.reset();
    fixture.detectChanges();

    expect(saved.checked).toBe(true);
    expect(changed.checked).toBe(false);
    expect(note.value).toBe('Saved note');
  });

  it('should resume the saved demo on its persisted step and restore its answers in button order', async () => {
    const show = jest.fn();
    await TestBed.configureTestingModule({
      imports: [ZardDemoQuestionnaireResumeComponent],
      providers: [{ provide: ZardSonnerService, useValue: { show } }],
    }).compileComponents();
    const fixture = TestBed.createComponent(ZardDemoQuestionnaireResumeComponent);
    fixture.detectChanges();
    const form = fixture.debugElement.query(By.css('form')).nativeElement as HTMLFormElement;
    const incremental = fixture.debugElement.query(By.css('input[value="incremental"]'))
      .nativeElement as HTMLInputElement;
    const cutover = fixture.debugElement.query(By.css('input[value="cutover"]')).nativeElement as HTMLInputElement;
    const note = fixture.debugElement.query(By.css('[data-slot="questionnaire-input"]'))
      .nativeElement as HTMLInputElement;

    expect(fixture.componentInstance.activeItem()).toBe('verification');
    expect(incremental.checked).toBe(true);
    expect(note.value).toBe('Keep the existing public API stable.');
    expect(
      fixture.debugElement
        .queryAll(By.css('z-questionnaire-actions button'))
        .map(button => (button.nativeElement as HTMLButtonElement).textContent?.trim()),
    ).toEqual(['Previous', 'Reset changes', 'Next', 'Update draft']);

    cutover.click();
    note.value = 'Replace the API.';
    form.reset();
    fixture.detectChanges();

    expect(fixture.componentInstance.activeItem()).toBe('verification');
    expect(incremental.checked).toBe(true);
    expect(cutover.checked).toBe(false);
    expect(note.value).toBe('Keep the existing public API stable.');
    expect(show).toHaveBeenCalledWith('Saved answers restored');
  });

  it('should summarize the resumed draft when the demo is submitted', async () => {
    const show = jest.fn();
    await TestBed.configureTestingModule({
      imports: [ZardDemoQuestionnaireResumeComponent],
      providers: [{ provide: ZardSonnerService, useValue: { show } }],
    }).compileComponents();
    const fixture = TestBed.createComponent(ZardDemoQuestionnaireResumeComponent);
    fixture.detectChanges();
    const form = fixture.debugElement.query(By.css('form')).nativeElement as HTMLFormElement;

    fixture.componentInstance.activeItem.set('notes');
    fixture.detectChanges();
    form.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));

    expect(show).toHaveBeenCalledWith('Draft updated', {
      description:
        'Migration: incremental · Verification: tests, typecheck · Notes: Keep the existing public API stable.',
    });
  });

  it('should recover when a dynamic item update disables the active item', async () => {
    const fixture = await createBehaviorFixture([
      { name: 'first', required: true },
      { name: 'second', required: true },
    ]);
    fixture.componentInstance.items = [
      { name: 'first', required: true, disabled: true },
      { name: 'second', required: true },
    ];

    fixture.detectChanges();

    expect(fixture.componentInstance.active).toBe('second');
  });

  it('should render each questionnaire item with fieldset semantics', async () => {
    const fixture = await createBehaviorFixture([{ name: 'first', required: true }]);

    expect(getItem(fixture, 'first').querySelector('fieldset')).not.toBeNull();
  });

  it('should associate item descriptions and visible errors with its fieldset and answer controls', async () => {
    await TestBed.configureTestingModule({ imports: [QuestionnaireStylesHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(QuestionnaireStylesHostComponent);
    fixture.detectChanges();
    const fieldset = fixture.nativeElement.querySelector('fieldset') as HTMLFieldSetElement;
    const description = fixture.nativeElement.querySelector('[data-slot="questionnaire-description"]') as HTMLElement;
    const error = fixture.nativeElement.querySelector('[data-slot="questionnaire-error"]') as HTMLElement;
    const controls = Array.from(
      fixture.nativeElement.querySelectorAll(
        '[data-slot="questionnaire-choice"] input, [data-slot="questionnaire-input"]',
      ),
    ) as HTMLElement[];

    expect(description.id).not.toBe('');
    expect(error.id).not.toBe('');
    expect(fieldset.getAttribute('aria-describedby')).toBe(description.id);
    expect(controls.every(control => control.getAttribute('aria-describedby') === description.id)).toBe(true);

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    const describedBy = `${description.id} ${error.id}`;
    expect(fieldset.getAttribute('aria-describedby')).toBe(describedBy);
    expect(controls.every(control => control.getAttribute('aria-describedby') === describedBy)).toBe(true);
  });

  it('should apply the default questionnaire variants to the rendered parts', async () => {
    await TestBed.configureTestingModule({ imports: [QuestionnaireStylesHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(QuestionnaireStylesHostComponent);
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('[data-slot="questionnaire"]') as HTMLFormElement;
    const questionnaireHost = fixture.nativeElement.querySelector('z-questionnaire') as HTMLElement;
    const progress = fixture.nativeElement.querySelector('[data-slot="questionnaire-progress"]') as HTMLElement;
    const itemHost = fixture.nativeElement.querySelector('z-questionnaire-item') as HTMLElement;
    const item = fixture.nativeElement.querySelector('fieldset') as HTMLFieldSetElement;
    const title = fixture.nativeElement.querySelector('[data-slot="questionnaire-title"]') as HTMLElement;
    const description = fixture.nativeElement.querySelector('[data-slot="questionnaire-description"]') as HTMLElement;
    const choices = fixture.nativeElement.querySelector('[data-slot="questionnaire-choices"]') as HTMLElement;
    const choice = fixture.nativeElement.querySelector('[data-slot="questionnaire-choice"]') as HTMLElement;
    const choiceControl = fixture.nativeElement.querySelector(
      '[data-slot="questionnaire-choice-control"]',
    ) as HTMLInputElement;
    const choiceIndicator = fixture.nativeElement.querySelector(
      '[data-slot="questionnaire-choice-indicator"]',
    ) as HTMLElement;
    const choiceLabel = fixture.nativeElement.querySelector('[data-slot="questionnaire-choice-label"]') as HTMLElement;
    const choiceShortcut = fixture.nativeElement.querySelector(
      '[data-slot="questionnaire-choice-shortcut"]',
    ) as HTMLElement;
    const inputWrapper = fixture.nativeElement.querySelector(
      '[data-slot="questionnaire-input-wrapper"]',
    ) as HTMLElement;
    const input = fixture.nativeElement.querySelector('[data-slot="questionnaire-input"]') as HTMLInputElement;
    const error = fixture.nativeElement.querySelector('[data-slot="questionnaire-error"]') as HTMLElement;
    const actions = fixture.nativeElement.querySelector('[data-slot="questionnaire-actions"]') as HTMLElement;

    expect(form.classList).toContain('flex');
    expect(form.classList).toContain('max-w-md');
    expect(questionnaireHost.classList).toContain('block');
    expect(questionnaireHost.classList).toContain('w-full');
    expect(progress.classList).toContain('tabular-nums');
    expect(progress.classList).toContain('text-xs');
    expect(item.classList).toContain('flex-col');
    expect(item.classList).toContain('w-full');
    expect(item.classList).toContain('gap-4');
    expect(itemHost.classList).toContain('contents');
    expect(title.classList).toContain('font-medium');
    expect(title.classList).toContain('text-base/snug');
    expect(description.classList).toContain('text-muted-foreground');
    expect(description.classList).toContain('text-sm');
    expect(choices.classList).toContain('grid');
    expect(choices.classList).toContain('gap-2');
    expect(choice.classList).toContain('border-input');
    expect(choice.classList).toContain('rounded-lg');
    expect(choice.classList).toContain('items-start');
    expect(choice.classList).not.toContain('items-center');
    expect(choice.getAttribute('data-disabled')).toBe('');
    expect(choiceControl.classList).toContain('absolute');
    expect(choiceControl.classList).toContain('opacity-0');
    expect(choiceIndicator.classList).toContain('shrink-0');
    expect(choiceIndicator.getAttribute('aria-hidden')).toBe('true');
    expect(choiceLabel.classList).toContain('flex-1');
    expect(choiceShortcut.classList).toContain('size-5');
    expect(inputWrapper.classList).toContain('relative');
    expect(inputWrapper.classList).toContain('block');
    expect(input.classList).toContain('border-input');
    expect(input.classList).toContain('h-8');
    expect(input.name).toBe('first');
    expect(input.placeholder).toBe('Other answer');
    expect(error.classList).toContain('text-destructive');
    expect(error.classList).toContain('mt-2');
    expect(actions.classList).toContain('grid');
    expect(actions.classList).toContain('gap-2');
  });

  it('should merge consumer utility classes and remove conflicting defaults', async () => {
    await TestBed.configureTestingModule({ imports: [QuestionnaireStyleOverridesHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(QuestionnaireStyleOverridesHostComponent);
    fixture.detectChanges();

    const classListFor = (slot: string): DOMTokenList =>
      (fixture.nativeElement.querySelector(`[data-slot="${slot}"]`) as HTMLElement).classList;
    const itemClasses = (fixture.nativeElement.querySelector('fieldset') as HTMLFieldSetElement).classList;

    expect(classListFor('questionnaire')).toContain('max-w-xl');
    expect(classListFor('questionnaire')).not.toContain('max-w-md');
    expect(classListFor('questionnaire-progress')).toContain('text-sm');
    expect(classListFor('questionnaire-progress')).not.toContain('text-xs');
    expect(itemClasses).toContain('gap-6');
    expect(itemClasses).not.toContain('gap-4');
    expect(classListFor('questionnaire-title')).toContain('text-lg');
    expect(classListFor('questionnaire-title')).not.toContain('text-base/snug');
    expect(classListFor('questionnaire-description')).toContain('text-base');
    expect(classListFor('questionnaire-description')).not.toContain('text-sm');
    expect(classListFor('questionnaire-choices')).toContain('gap-3');
    expect(classListFor('questionnaire-choices')).not.toContain('gap-2');
    expect(classListFor('questionnaire-choice')).toContain('rounded-md');
    expect(classListFor('questionnaire-choice')).not.toContain('rounded-lg');
    expect(classListFor('questionnaire-choice-description')).toContain('text-foreground');
    expect(classListFor('questionnaire-choice-description')).not.toContain('text-muted-foreground');
    expect(classListFor('questionnaire-input')).toContain('h-10');
    expect(classListFor('questionnaire-input')).not.toContain('h-8');
    expect(classListFor('questionnaire-error')).toContain('mt-4');
    expect(classListFor('questionnaire-error')).not.toContain('mt-2');
    expect(classListFor('questionnaire-actions')).toContain('gap-4');
    expect(classListFor('questionnaire-actions')).not.toContain('gap-2');
  });
});

describe('ZardQuestionnaireComponent item settings', () => {
  afterEach(() => TestBed.resetTestingModule());

  async function createPrecedenceFixture(items: ZardQuestionnaireItem[] = []) {
    await TestBed.configureTestingModule({ imports: [QuestionnaireItemPrecedenceHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(QuestionnaireItemPrecedenceHostComponent);
    fixture.componentInstance.items = items;
    fixture.detectChanges();
    return fixture;
  }

  function answer(fixture: ComponentFixture<QuestionnaireItemPrecedenceHostComponent>, value: string): void {
    (fixture.nativeElement.querySelector(`input[value="${value}"]`) as HTMLInputElement).click();
    fixture.detectChanges();
  }

  it('should read required from the item itself when zItems does not list it', async () => {
    const fixture = await createPrecedenceFixture();

    clickAction(fixture, ZardQuestionnaireNextDirective);

    expect(fixture.componentInstance.active).toBe('required-item');
    expect(getAction(fixture, ZardQuestionnaireSkipDirective).hidden).toBe(true);
  });

  it('should skip an item that is disabled on the item but enabled in zItems', async () => {
    const fixture = await createPrecedenceFixture([
      { name: 'required-item' },
      { name: 'off-item', disabled: false },
      { name: 'tags' },
      { name: 'relaxed' },
    ]);
    answer(fixture, 'one');

    clickAction(fixture, ZardQuestionnaireNextDirective);

    expect(fixture.componentInstance.active).toBe('tags');
    expect(fixture.nativeElement.querySelector('z-questionnaire-progress').textContent).toContain('2');
  });

  it('should render checkboxes and submit an array for an item that is multiple only on the item', async () => {
    const fixture = await createPrecedenceFixture([{ name: 'tags' }]);
    answer(fixture, 'one');
    clickAction(fixture, ZardQuestionnaireNextDirective);

    const inputs = fixture.nativeElement.querySelectorAll('input[name="tags"]') as NodeListOf<HTMLInputElement>;
    expect(Array.from(inputs, input => input.type)).toEqual(['checkbox', 'checkbox']);

    answer(fixture, 'x');
    answer(fixture, 'y');
    clickAction(fixture, ZardQuestionnaireNextDirective);
    answer(fixture, 'r');
    (fixture.nativeElement.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('submit', { cancelable: true }),
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.submitted).toEqual({ 'required-item': 'one', tags: ['x', 'y'], relaxed: 'r' });
  });

  it('should let the item win over zItems and use zItems only where the item sets nothing', async () => {
    const fixture = await createPrecedenceFixture([
      { name: 'tags', required: true },
      { name: 'relaxed', required: true },
    ]);
    answer(fixture, 'one');
    clickAction(fixture, ZardQuestionnaireNextDirective);

    // `tags` sets nothing on the item, so zItems makes it required.
    expect(fixture.componentInstance.active).toBe('tags');
    expect(getAction(fixture, ZardQuestionnaireSkipDirective).hidden).toBe(true);

    // `relaxed` sets zRequired to false, which wins over the required entry in zItems.
    answer(fixture, 'x');
    clickAction(fixture, ZardQuestionnaireNextDirective);
    expect(fixture.componentInstance.active).toBe('relaxed');
    expect(getAction(fixture, ZardQuestionnaireSkipDirective).hidden).toBe(false);
  });
});

describe('ZardQuestionnaireComponent shortcut scope and stability', () => {
  afterEach(() => TestBed.resetTestingModule());

  async function createTwoQuestionnaires() {
    await TestBed.configureTestingModule({ imports: [TwoQuestionnairesHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TwoQuestionnairesHostComponent);
    fixture.detectChanges();
    const q1 = fixture.nativeElement.querySelector('[data-testid="q1"]') as HTMLElement;
    const q2 = fixture.nativeElement.querySelector('[data-testid="q2"]') as HTMLElement;
    const checked = (root: HTMLElement) =>
      Array.from(root.querySelectorAll<HTMLInputElement>('input:checked'), input => input.value);
    return { fixture, q1, q2, checked };
  }

  it('should act in the focused questionnaire only', async () => {
    const { q1, q2, checked } = await createTwoQuestionnaires();

    q2.querySelector('input')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', bubbles: true }));

    expect(checked(q1)).toEqual([]);
    expect(checked(q2)).toEqual(['b']);
  });

  it('should send body shortcuts to the questionnaire interacted with last, and to none before that', async () => {
    const { q1, q2, checked } = await createTwoQuestionnaires();

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    expect(checked(q1)).toEqual([]);
    expect(checked(q2)).toEqual([]);

    q2.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));

    expect(checked(q1)).toEqual([]);
    expect(checked(q2)).toEqual(['a']);
  });

  it('should not act on shortcuts typed in an input outside the questionnaire', async () => {
    const { fixture, q2, checked } = await createTwoQuestionnaires();
    q2.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    (fixture.nativeElement.querySelector('[data-testid="outside-input"]') as HTMLElement).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'a', bubbles: true }),
    );

    expect(checked(q2)).toEqual([]);
  });

  it('should keep badges, aria-keyshortcuts and key handling in sync when a sibling choice becomes disabled', async () => {
    const fixture = await createBehaviorFixture([{ name: 'first', required: true }]);
    const badges = () =>
      Array.from(
        fixture.nativeElement.querySelectorAll('[data-slot="questionnaire-choice-shortcut"]'),
        (badge: Element) => badge.textContent?.trim(),
      );
    expect(badges()).toEqual(['A', 'B']);

    fixture.componentInstance.firstChoiceDisabled = true;
    fixture.detectChanges();

    expect(badges()).toEqual(['A']);
    expect(getChoiceInput(fixture, 'first', 'a').getAttribute('aria-keyshortcuts')).toBeNull();
    expect(getChoiceInput(fixture, 'first', 'b').getAttribute('aria-keyshortcuts')).toBe('a');

    dispatchShortcut(fixture, 'a');

    expect(getChoiceInput(fixture, 'first', 'b').checked).toBe(true);
  });
});

@Component({
  imports: [ZardQuestionnaireComponent, ZardQuestionnaireItemComponent, ZardQuestionnaireProgressComponent],
  template: `
    <z-questionnaire [zItems]="items">
      <z-questionnaire-progress data-testid="default-progress" />
      <z-questionnaire-progress data-testid="named-progress" aria-label="Onboarding progress" />
      <z-questionnaire-item zName="first">First</z-questionnaire-item>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class QuestionnaireProgressNameHostComponent {
  readonly items: ZardQuestionnaireItem[] = [{ name: 'first' }];
}

describe('ZardQuestionnaireProgressComponent accessible name', () => {
  it('should name the progressbar by default and keep a consumer aria-label', async () => {
    await TestBed.configureTestingModule({ imports: [QuestionnaireProgressNameHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(QuestionnaireProgressNameHostComponent);
    fixture.detectChanges();

    const progress = (testId: string): HTMLElement =>
      fixture.nativeElement.querySelector(`[data-testid="${testId}"]`) as HTMLElement;

    expect(progress('default-progress').getAttribute('aria-label')).toBe('Questionnaire progress');
    expect(progress('named-progress').getAttribute('aria-label')).toBe('Onboarding progress');
  });
});
