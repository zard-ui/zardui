---
title: Questionnaire
description: A multi-step questionnaire with single-choice, multiple-choice, freeform, and skippable questions.
---

# Questionnaire

A multi-step questionnaire with single-choice, multiple-choice, freeform, and skippable questions.

## Installation

### CLI

```bash
npx zard-cli@latest add questionnaire
```

### Manual

```angular-ts
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  effect,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  model,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';
import { noopFn } from '@/shared/utils/noop';

import { ZARD_QUESTIONNAIRE_ITEM, type ZardQuestionnaireItemRef } from './questionnaire.tokens';
import type {
  ZardQuestionnaireAnswers,
  ZardQuestionnaireItem,
  ZardQuestionnaireShortcutMode,
} from './questionnaire.types';
import { questionnaireVariants } from './questionnaire.variants';

// The questionnaire the user last focused or clicked in. Keyboard shortcuts fired with nothing focused go to it.
let lastInteracted: HTMLElement | null = null;

@Component({
  selector: 'z-questionnaire',
  template: `
    <form
      #form
      data-slot="questionnaire"
      [class]="classes()"
      (input)="handleAnswerChange($event)"
      (submit)="handleSubmit($event)"
      (reset)="handleReset()"
      (focusout)="handleTouched()"
    >
      <ng-content />
    </form>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardQuestionnaireComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'block w-full',
    '[attr.data-shortcuts]': 'zShortcuts() === "none" ? null : zShortcuts()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '(document:keydown)': 'handleShortcut($event)',
    '(focusin)': 'markInteracted()',
    '(pointerdown)': 'markInteracted()',
  },
  exportAs: 'zQuestionnaire',
})
export class ZardQuestionnaireComponent implements ControlValueAccessor {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly itemRefs = contentChildren<ZardQuestionnaireItemRef>(ZARD_QUESTIONNAIRE_ITEM, {
    descendants: true,
  });

  private readonly form = viewChild<ElementRef<HTMLFormElement>>('form');
  private readonly invalidItems = signal<ReadonlySet<string>>(new Set());
  private readonly skippedItems = signal<ReadonlySet<string>>(new Set());
  // Every writeValue call must re-sync the DOM, even when the same answers object is written again.
  private readonly writtenAnswers = signal<ZardQuestionnaireAnswers | null>(null, { equal: () => false });
  private onChangeFn: (answers: ZardQuestionnaireAnswers) => void = noopFn;
  private onTouchedFn: () => void = noopFn;

  readonly class = input<ClassValue>('');
  readonly zItems = input<readonly ZardQuestionnaireItem[]>([]);
  readonly zActive = model<string | undefined>(undefined);
  readonly zShortcuts = input<ZardQuestionnaireShortcutMode>('none');
  readonly zSubmit = output<ZardQuestionnaireAnswers>();
  readonly disabled = signal(false);

  // The projected items in DOM order, with their effective settings (the item's own inputs win over `zItems`).
  // Without any projected item (native controls only), or while one is still unbound, `zItems` defines the flow.
  readonly items = computed(() => {
    const settings = this.itemRefs().map(ref => ref.settings());
    const bound = settings.filter((item): item is ZardQuestionnaireItem => item !== null);
    return bound.length === 0 || bound.length < settings.length ? this.zItems() : bound;
  });

  readonly enabledItems = computed(() => this.items().filter(item => !item.disabled));
  readonly activeIndex = computed(() => {
    const index = this.enabledItems().findIndex(item => item.name === this.zActive());
    return index >= 0 ? index : 0;
  });

  readonly canMoveNext = computed(() => this.activeIndex() < this.enabledItems().length - 1);
  readonly canMoveBack = computed(() => this.activeIndex() > 0);
  readonly canSkip = computed(() => {
    const activeItem = this.enabledItems()[this.activeIndex()];
    return Boolean(activeItem && !activeItem.required && !this.skippedItems().has(activeItem.name));
  });

  readonly canSubmit = computed(
    () => this.enabledItems().length > 0 && this.activeIndex() === this.enabledItems().length - 1,
  );

  protected readonly classes = computed(() => mergeClasses(questionnaireVariants(), this.class()));

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (lastInteracted === this.elementRef.nativeElement) {
        lastInteracted = null;
      }
    });

    effect(() => {
      const enabledItems = this.enabledItems();
      const active = this.zActive();

      if (!enabledItems.some(item => item.name === active)) {
        this.zActive.set(enabledItems[0]?.name);
      }
    });

    effect(() => {
      const form = this.form()?.nativeElement;
      const answers = this.writtenAnswers();
      if (form && answers !== null) {
        queueMicrotask(() => this.applyAnswers(form, answers));
      }
    });
  }

  next(): void {
    if (this.disabled() || !this.canMoveNext()) {
      return;
    }

    const activeItem = this.enabledItems()[this.activeIndex()];
    if (!activeItem || !this.validateItem(activeItem)) {
      this.focusFirstAnswer(activeItem?.name);
      return;
    }

    const nextItem = this.enabledItems()[this.activeIndex() + 1];
    this.zActive.set(nextItem.name);
    this.focusFirstAnswer(nextItem.name);
  }

  previous(): void {
    if (this.disabled() || !this.canMoveBack()) {
      return;
    }

    const previousItem = this.enabledItems()[this.activeIndex() - 1];
    this.zActive.set(previousItem.name);
    this.focusFirstAnswer(previousItem.name);
  }

  skip(): void {
    if (this.disabled()) {
      return;
    }

    const activeItem = this.enabledItems()[this.activeIndex()];
    if (!activeItem || activeItem.required) {
      return;
    }

    this.updateSet(this.skippedItems, activeItem.name, true);
    this.updateSet(this.invalidItems, activeItem.name, false);
    this.onChangeFn(this.collectAnswers());

    if (this.canMoveNext()) {
      const nextItem = this.enabledItems()[this.activeIndex() + 1];
      this.zActive.set(nextItem.name);
      this.focusFirstAnswer(nextItem.name);
    }
  }

  isInvalid(name: string): boolean {
    return this.invalidItems().has(name);
  }

  handleAnswerChange(event: Event): void {
    if (this.disabled()) {
      return;
    }

    const control = event.target;
    if (
      !(control instanceof HTMLInputElement) &&
      !(control instanceof HTMLTextAreaElement) &&
      !(control instanceof HTMLSelectElement)
    ) {
      return;
    }

    const { name } = control;
    if (!name || !this.enabledItems().some(item => item.name === name)) {
      return;
    }

    if (this.hasAnswer(name)) {
      this.updateSet(this.skippedItems, name, false);
      this.updateSet(this.invalidItems, name, false);
    }
    this.onChangeFn(this.collectAnswers(control));
  }

  handleSubmit(event: SubmitEvent): void {
    event.preventDefault();
    if (this.disabled()) {
      return;
    }

    const form = this.form()?.nativeElement;
    const formData = form ? new FormData(form) : undefined;
    const invalidItems = this.enabledItems().filter(item => !this.isItemValid(item, formData));
    this.invalidItems.set(new Set(invalidItems.map(item => item.name)));

    if (invalidItems.length > 0) {
      this.zActive.set(invalidItems[0].name);
      this.focusFirstAnswer(invalidItems[0].name);
      return;
    }

    const answers = this.collectAnswers();
    this.onTouchedFn();
    this.zSubmit.emit(answers);
  }

  handleReset(): void {
    this.invalidItems.set(new Set());
    this.skippedItems.set(new Set());
    this.zActive.set(this.enabledItems()[0]?.name);
    queueMicrotask(() => this.onChangeFn(this.collectAnswers()));
  }

  handleTouched(): void {
    this.onTouchedFn();
  }

  registerOnChange(fn: (answers: ZardQuestionnaireAnswers) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  writeValue(answers: ZardQuestionnaireAnswers | null | undefined): void {
    const writtenAnswers = answers ?? {};
    // An item that receives an answer from the model is no longer skipped or invalid.
    for (const [name, answer] of Object.entries(writtenAnswers)) {
      const values = Array.isArray(answer) ? answer : [answer];
      if (values.some(value => String(value).trim().length > 0)) {
        this.updateSet(this.skippedItems, name, false);
        this.updateSet(this.invalidItems, name, false);
      }
    }
    this.writtenAnswers.set(writtenAnswers);
  }

  protected handleShortcut(event: KeyboardEvent): void {
    if (this.disabled() || this.zShortcuts() === 'none' || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    // Only one questionnaire reacts: the one holding focus, or, with nothing focused (the event targets
    // the body), the one the user interacted with last. Never while typing, wherever the caret is.
    const { target } = event;
    if (!(target instanceof Node)) {
      return;
    }

    const isTypingTarget =
      target instanceof HTMLElement &&
      (target.matches('input:not([type="radio"]):not([type="checkbox"]), textarea, select') ||
        target.isContentEditable);
    if (isTypingTarget) {
      return;
    }

    const hasFocus = this.elementRef.nativeElement.contains(target);
    const nothingFocused = target === document.body || target === document.documentElement;
    if (!hasFocus && !(nothingFocused && lastInteracted === this.elementRef.nativeElement)) {
      return;
    }

    const shortcutIndex = this.shortcutIndex(event.key);
    if (shortcutIndex < 0) {
      return;
    }

    const activeName = this.enabledItems()[this.activeIndex()]?.name;
    const activeRef = this.itemRefs().find(ref => ref.settings()?.name === activeName);
    const choice = activeRef?.choiceAt(shortcutIndex);

    if (choice) {
      event.preventDefault();
      choice.select();
    }
  }

  protected markInteracted(): void {
    lastInteracted = this.elementRef.nativeElement;
  }

  private validateItem(item: ZardQuestionnaireItem): boolean {
    const valid = this.isItemValid(item);
    this.updateSet(this.invalidItems, item.name, !valid);
    return valid;
  }

  private isItemValid(item: ZardQuestionnaireItem, formData?: FormData): boolean {
    return this.hasAnswer(item.name, formData) || (!item.required && this.skippedItems().has(item.name));
  }

  private hasAnswer(name: string, formData?: FormData): boolean {
    const form = this.form()?.nativeElement;
    const data = formData ?? (form ? new FormData(form) : undefined);
    return Boolean(data?.getAll(name).some(value => String(value).trim().length > 0));
  }

  private collectAnswers(
    changedControl?: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  ): ZardQuestionnaireAnswers {
    const form = this.form()?.nativeElement;
    const answers: ZardQuestionnaireAnswers = {};
    if (!form) {
      return answers;
    }

    const changedItem = changedControl && this.enabledItems().find(item => item.name === changedControl.name);
    if (changedControl && changedItem && !changedItem.multiple) {
      const namedControl = form.elements.namedItem(changedItem.name);
      const controls = namedControl instanceof RadioNodeList ? Array.from(namedControl) : [namedControl];
      const radioControls = controls.filter(
        (control): control is HTMLInputElement => control instanceof HTMLInputElement && control.type === 'radio',
      );
      const freeformControls = controls.filter(
        (control): control is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement =>
          (control instanceof HTMLInputElement && control.type !== 'radio') ||
          control instanceof HTMLTextAreaElement ||
          control instanceof HTMLSelectElement,
      );

      // A single-answer item treats fixed radio choices and freeform text as mutually exclusive.
      if (changedControl instanceof HTMLInputElement && changedControl.type === 'radio' && changedControl.checked) {
        freeformControls.forEach(control => (control.value = ''));
      } else if (freeformControls.includes(changedControl) && changedControl.value.trim().length > 0) {
        radioControls.forEach(control => (control.checked = false));
      }
    }

    const formData = new FormData(form);
    for (const item of this.enabledItems()) {
      if (this.skippedItems().has(item.name)) {
        continue;
      }

      const values = formData
        .getAll(item.name)
        .map(String)
        .filter(value => value.trim().length > 0);
      if (values.length > 0) {
        answers[item.name] = item.multiple ? values : values[0];
      }
    }
    return answers;
  }

  private applyAnswers(form: HTMLFormElement, answers: ZardQuestionnaireAnswers): void {
    for (const item of this.items()) {
      const answer = answers[item.name];
      const values = answer === undefined ? [] : Array.isArray(answer) ? answer : [answer];
      const namedControl = form.elements.namedItem(item.name);
      const namedControls = namedControl instanceof RadioNodeList ? Array.from(namedControl) : [namedControl];
      const controls = namedControls.filter(
        (control): control is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement =>
          control instanceof HTMLInputElement ||
          control instanceof HTMLTextAreaElement ||
          control instanceof HTMLSelectElement,
      );
      const fixedValues = new Set(
        controls
          .filter(
            (control): control is HTMLInputElement =>
              control instanceof HTMLInputElement && ['checkbox', 'radio'].includes(control.type),
          )
          .map(control => control.value),
      );
      const freeformValue = values.find(value => !fixedValues.has(value)) ?? '';

      for (const control of controls) {
        if (control instanceof HTMLInputElement && ['checkbox', 'radio'].includes(control.type)) {
          control.checked = values.includes(control.value);
        } else {
          control.value = fixedValues.size === 0 ? (values[0] ?? '') : freeformValue;
        }
      }
    }
  }

  private focusFirstAnswer(name?: string): void {
    if (!name) {
      return;
    }

    afterNextRender(
      () => {
        this.elementRef.nativeElement
          .querySelector<HTMLElement>(`[data-questionnaire-name="${CSS.escape(name)}"] input:not(:disabled)`)
          ?.focus();
      },
      { injector: this.injector },
    );
  }

  private shortcutIndex(key: string): number {
    if (this.zShortcuts() === 'letters') {
      const normalizedKey = key.toLowerCase();
      return normalizedKey.length === 1 ? normalizedKey.charCodeAt(0) - 97 : -1;
    }

    return /^[1-9]$/.test(key) ? Number(key) - 1 : -1;
  }

  private updateSet(state: typeof this.invalidItems, name: string, present: boolean): void {
    state.update(current => {
      const next = new Set(current);
      if (present) {
        next.add(name);
      } else {
        next.delete(name);
      }
      return next;
    });
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const questionnaireVariants = cva('flex w-full min-w-0 flex-col gap-4 mx-auto max-w-md');

export const questionnaireProgressVariants = cva(
  'min-h-lh w-fit min-w-[14ch] text-xs font-medium text-muted-foreground tabular-nums',
);

export const questionnaireTitleVariants = cva(
  'text-base/snug font-medium text-pretty [&:has(~[data-slot=questionnaire-description])]:-mb-4',
);

export const questionnaireDescriptionVariants = cva('text-sm text-pretty text-muted-foreground');

export const questionnaireItemVariants = cva(
  'flex w-full min-w-0 flex-col gap-4 border-0 p-0 outline-none [&[hidden]]:hidden',
);

export const questionnaireChoicesVariants = cva('group/questionnaire-choices grid min-w-0 gap-2');

export const questionnaireChoiceVariants = cva(
  'group/questionnaire-choice relative flex min-h-11 cursor-pointer items-start gap-2.5 rounded-lg border border-input bg-transparent px-3 py-2.5 text-start text-sm transition-colors outline-none select-none hover:bg-muted/50 has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/50 data-invalid:border-destructive dark:bg-input/20 has-[input:checked]:border-primary/40 has-[input:checked]:bg-muted dark:has-[input:checked]:bg-muted data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
);

export const questionnaireChoiceControlVariants = cva('absolute inset-0 z-10 size-full cursor-pointer opacity-0');

export const questionnaireChoiceIndicatorVariants = cva(
  'pointer-events-none relative flex size-4 shrink-0 translate-y-[calc(var(--spacing)*0.45)] items-center justify-center rounded-[4px] border border-input group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5 group-has-[input[type=radio]]/questionnaire-choice:rounded-full group-has-[input:checked]/questionnaire-choice:border-primary group-has-[input:checked]/questionnaire-choice:bg-primary group-has-[input:checked]/questionnaire-choice:text-primary-foreground dark:bg-input/30 dark:group-has-[input:checked]/questionnaire-choice:bg-primary',
);

export const questionnaireChoiceIndicatorDotVariants = cva(
  'hidden size-2 rounded-full bg-primary-foreground group-has-[input[type=radio]:checked]/questionnaire-choice:block',
);

export const questionnaireChoiceIndicatorCheckVariants = cva(
  'hidden size-3.5 group-has-[input[type=checkbox]:checked]/questionnaire-choice:block',
);

export const questionnaireInputVariants = cva(
  'h-8 min-h-11 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 sm:min-h-0 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground',
);

export const questionnaireChoiceLabelVariants = cva('flex min-w-0 flex-1 flex-col gap-0.5 leading-snug');

export const questionnaireChoiceDescriptionVariants = cva('block text-muted-foreground');

export const questionnaireChoiceShortcutVariants = cva(
  'pointer-events-none ms-auto inline-flex size-5 shrink-0 translate-y-[calc(var(--spacing)*0.45)] items-center justify-center rounded-md border border-input bg-background font-mono text-[0.625rem] leading-none font-medium text-muted-foreground group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5',
);

export const questionnaireInputWrapperVariants = cva('group/questionnaire-input relative block w-full min-w-0');

export const questionnaireErrorVariants = cva('mt-2 text-sm text-destructive');

export const questionnaireActionsVariants = cva(
  'grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 sm:min-h-8',
);

export const questionnairePreviousVariants = cva(
  'col-start-1 row-start-1 min-h-11 justify-self-start sm:min-h-0 [&[hidden]]:hidden',
);

export const questionnaireSkipVariants = cva(
  'col-start-2 row-start-1 min-h-11 justify-self-end sm:min-h-0 [&[hidden]]:hidden',
);

export const questionnaireNextVariants = cva(
  'col-start-3 row-start-1 min-h-11 justify-self-end sm:min-h-0 [&[hidden]]:hidden',
);

export const questionnaireSubmitVariants = questionnaireNextVariants;

export type ZardQuestionnaireVariants = VariantProps<typeof questionnaireVariants>;
```

```angular-ts
export * from './questionnaire.component';
export * from './questionnaire.imports';
export * from './questionnaire.types';
export * from './questionnaire.variants';
```

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { questionnaireActionsVariants } from './questionnaire.variants';

@Component({
  selector: 'z-questionnaire-actions',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'questionnaire-actions',
    '[class]': 'classes()',
  },
  exportAs: 'zQuestionnaireActions',
})
export class ZardQuestionnaireActionsComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(questionnaireActionsVariants(), this.class()));
}
```

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { questionnaireChoiceDescriptionVariants } from './questionnaire.variants';

@Component({
  selector: 'z-questionnaire-choice-description',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'questionnaire-choice-description',
    '[class]': 'classes()',
  },
  exportAs: 'zQuestionnaireChoiceDescription',
})
export class ZardQuestionnaireChoiceDescriptionComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(questionnaireChoiceDescriptionVariants(), this.class()));
}
```

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardQuestionnaireItemComponent } from './questionnaire-item.component';
import { ZARD_QUESTIONNAIRE_CHOICE, type ZardQuestionnaireChoiceRef } from './questionnaire.tokens';
import {
  questionnaireChoiceControlVariants,
  questionnaireChoiceIndicatorCheckVariants,
  questionnaireChoiceIndicatorDotVariants,
  questionnaireChoiceIndicatorVariants,
  questionnaireChoiceLabelVariants,
  questionnaireChoiceShortcutVariants,
  questionnaireChoiceVariants,
} from './questionnaire.variants';

@Component({
  selector: 'z-questionnaire-choice',
  template: `
    <label class="contents">
      <input
        data-slot="questionnaire-choice-control"
        [type]="item.multiple() ? 'checkbox' : 'radio'"
        [name]="item.zName()"
        [value]="zValue()"
        [attr.checked]="checked() ? '' : null"
        [disabled]="disabledState()"
        [attr.aria-keyshortcuts]="shortcut()"
        [attr.aria-describedby]="item.ariaDescribedBy()"
        [class]="controlClasses"
        #control
      />
      <span aria-hidden="true" data-slot="questionnaire-choice-indicator" [class]="indicatorClasses">
        <span data-slot="questionnaire-choice-indicator-dot" [class]="indicatorDotClasses"></span>
        <span data-slot="questionnaire-choice-indicator-check" [class]="indicatorCheckClasses">
          <ng-icon name="lucideCheck" class="size-full" />
        </span>
      </span>
      <span data-slot="questionnaire-choice-label" [class]="labelClasses">
        <ng-content />
      </span>
      @if (shortcut(); as label) {
        <span data-slot="questionnaire-choice-shortcut" aria-hidden="true" [class]="shortcutClasses">
          {{ label.toUpperCase() }}
        </span>
      }
    </label>
  `,
  imports: [NgIcon],
  viewProviders: [provideIcons({ lucideCheck })],
  providers: [{ provide: ZARD_QUESTIONNAIRE_CHOICE, useExisting: forwardRef(() => ZardQuestionnaireChoiceComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'questionnaire-choice',
    '[attr.data-disabled]': 'disabledState() ? "" : null',
    '[attr.data-invalid]': 'item.isInvalid() ? "" : null',
    '[class]': 'classes()',
  },
  exportAs: 'zQuestionnaireChoice',
})
export class ZardQuestionnaireChoiceComponent implements ZardQuestionnaireChoiceRef {
  readonly item = inject(ZardQuestionnaireItemComponent);
  private readonly control = viewChild.required<ElementRef<HTMLInputElement>>('control');

  readonly zValue = input.required<string>();
  readonly checked = input(false, { transform: booleanAttribute });
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  readonly disabledState = computed(() => this.zDisabled() || this.item.isDisabled());
  protected readonly shortcut = computed(() => this.item.shortcutFor(this));
  protected readonly classes = computed(() => mergeClasses(questionnaireChoiceVariants(), this.class()));
  protected readonly controlClasses = questionnaireChoiceControlVariants();
  protected readonly indicatorClasses = questionnaireChoiceIndicatorVariants();
  protected readonly indicatorDotClasses = questionnaireChoiceIndicatorDotVariants();
  protected readonly indicatorCheckClasses = questionnaireChoiceIndicatorCheckVariants();
  protected readonly labelClasses = questionnaireChoiceLabelVariants();
  protected readonly shortcutClasses = questionnaireChoiceShortcutVariants();

  select(): void {
    this.control().nativeElement.click();
  }
}
```

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { questionnaireChoicesVariants } from './questionnaire.variants';

@Component({
  selector: 'z-questionnaire-choices',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'questionnaire-choices',
    '[class]': 'classes()',
  },
  exportAs: 'zQuestionnaireChoices',
})
export class ZardQuestionnaireChoicesComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(questionnaireChoicesVariants(), this.class()));
}
```

```angular-ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  type OnDestroy,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardQuestionnaireItemComponent } from './questionnaire-item.component';
import { questionnaireDescriptionVariants } from './questionnaire.variants';

@Component({
  selector: 'z-questionnaire-description',
  template: `
    <p>
      <ng-content />
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'questionnaire-description',
    '[id]': 'item.descriptionId()',
    '[class]': 'classes()',
  },
  exportAs: 'zQuestionnaireDescription',
})
export class ZardQuestionnaireDescriptionComponent implements OnDestroy {
  readonly item = inject(ZardQuestionnaireItemComponent);
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(questionnaireDescriptionVariants(), this.class()));

  constructor() {
    this.item.descriptionPresent.set(true);
  }

  ngOnDestroy(): void {
    this.item.descriptionPresent.set(false);
  }
}
```

```angular-ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  type OnDestroy,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardQuestionnaireItemComponent } from './questionnaire-item.component';
import { questionnaireErrorVariants } from './questionnaire.variants';

@Component({
  selector: 'z-questionnaire-error',
  template: `
    @if (item.isInvalid()) {
      <ng-content>Choose an answer to continue.</ng-content>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'questionnaire-error',
    '[id]': 'item.errorId()',
    role: 'alert',
    '[hidden]': '!item.isInvalid()',
    '[class]': 'classes()',
  },
  exportAs: 'zQuestionnaireError',
})
export class ZardQuestionnaireErrorComponent implements OnDestroy {
  readonly item = inject(ZardQuestionnaireItemComponent);
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(questionnaireErrorVariants(), this.class()));

  constructor() {
    this.item.errorPresent.set(true);
  }

  ngOnDestroy(): void {
    this.item.errorPresent.set(false);
  }
}
```

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardQuestionnaireItemComponent } from './questionnaire-item.component';
import { questionnaireInputVariants, questionnaireInputWrapperVariants } from './questionnaire.variants';

@Component({
  selector: 'z-questionnaire-input',
  template: `
    <input
      data-slot="questionnaire-input"
      [type]="type()"
      [name]="item.zName()"
      [attr.value]="value()"
      [placeholder]="placeholder()"
      [disabled]="disabledState()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-invalid]="item.isInvalid() ? 'true' : null"
      [attr.aria-describedby]="item.ariaDescribedBy()"
      [class]="inputClasses()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'questionnaire-input-wrapper',
    '[class]': 'wrapperClasses',
  },
  exportAs: 'zQuestionnaireInput',
})
export class ZardQuestionnaireInputComponent {
  readonly item = inject(ZardQuestionnaireItemComponent);

  readonly type = input('text');
  readonly value = input('');
  readonly placeholder = input('');
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  protected readonly disabledState = computed(() => this.zDisabled() || this.item.isDisabled());
  protected readonly inputClasses = computed(() => mergeClasses(questionnaireInputVariants(), this.class()));
  protected readonly wrapperClasses = questionnaireInputWrapperVariants();
}
```

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardIdDirective } from '@/shared/core/directives/id.directive';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardQuestionnaireComponent } from './questionnaire.component';
import {
  ZARD_QUESTIONNAIRE_CHOICE,
  ZARD_QUESTIONNAIRE_ITEM,
  type ZardQuestionnaireChoiceRef,
  type ZardQuestionnaireItemRef,
} from './questionnaire.tokens';
import type { ZardQuestionnaireItem } from './questionnaire.types';
import { questionnaireItemVariants } from './questionnaire.variants';

const optionalBooleanAttribute = (value: unknown): boolean | undefined =>
  value === undefined || value === null ? undefined : booleanAttribute(value);

@Component({
  selector: 'z-questionnaire-item',
  template: `
    <fieldset
      [disabled]="isDisabled()"
      [attr.aria-invalid]="isInvalid() ? 'true' : null"
      [attr.aria-describedby]="ariaDescribedBy()"
      [attr.data-active]="isActive() ? '' : null"
      [class]="classes()"
    >
      <ng-content />
    </fieldset>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'contents',
    'data-slot': 'questionnaire-item',
    '[attr.data-questionnaire-name]': 'zName()',
    '[attr.aria-invalid]': 'isInvalid() ? "true" : null',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[hidden]': '!isActive()',
  },
  providers: [{ provide: ZARD_QUESTIONNAIRE_ITEM, useExisting: forwardRef(() => ZardQuestionnaireItemComponent) }],
  hostDirectives: [ZardIdDirective],
  exportAs: 'zQuestionnaireItem',
})
export class ZardQuestionnaireItemComponent implements ZardQuestionnaireItemRef {
  private readonly questionnaire = inject(ZardQuestionnaireComponent);
  private readonly uniqueId = inject(ZardIdDirective);

  readonly zName = input.required<string>();
  // `undefined` means "not set": the matching `[zItems]` entry decides, then the default (false).
  readonly zRequired = input<boolean | undefined, unknown>(undefined, { transform: optionalBooleanAttribute });
  readonly zMultiple = input<boolean | undefined, unknown>(undefined, { transform: optionalBooleanAttribute });
  readonly zDisabled = input<boolean | undefined, unknown>(undefined, { transform: optionalBooleanAttribute });
  readonly zInvalid = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  readonly descriptionPresent = signal(false);
  readonly errorPresent = signal(false);
  readonly descriptionId = computed(() => `${this.uniqueId.id()}-description`);
  readonly errorId = computed(() => `${this.uniqueId.id()}-error`);
  private readonly choices = contentChildren<ZardQuestionnaireChoiceRef>(ZARD_QUESTIONNAIRE_CHOICE, {
    descendants: true,
  });

  // View effects of the root can run before the item's own inputs are bound; the item is skipped until then.
  private readonly name = computed(() => {
    try {
      return this.zName();
    } catch {
      return undefined;
    }
  });

  private readonly definition = computed(() => this.questionnaire.zItems().find(item => item.name === this.name()));

  readonly settings = computed<ZardQuestionnaireItem | null>(() => {
    const name = this.name();
    if (name === undefined) {
      return null;
    }

    const definition = this.definition();
    return {
      name,
      required: this.zRequired() ?? definition?.required ?? false,
      multiple: this.zMultiple() ?? definition?.multiple ?? false,
      disabled: this.zDisabled() ?? definition?.disabled ?? false,
    };
  });

  readonly required = computed(() => this.settings()?.required === true);
  readonly multiple = computed(() => this.settings()?.multiple === true);
  readonly disabled = computed(() => this.settings()?.disabled === true);
  // Enabled choices in DOM order; the shortcut badges, aria-keyshortcuts and key handling all index into this.
  private readonly enabledChoices = computed(() => this.choices().filter(choice => !choice.disabledState()));
  readonly isDisabled = computed(() => this.disabled() || this.questionnaire.disabled());
  // A disabled questionnaire keeps its active item visible (as a disabled fieldset); only an item that is
  // itself disabled leaves the flow.
  readonly isActive = computed(() => this.questionnaire.zActive() === this.zName() && !this.disabled());
  readonly isInvalid = computed(() => this.zInvalid() || this.questionnaire.isInvalid(this.zName()));
  readonly ariaDescribedBy = computed(() => {
    const ids: string[] = [];
    if (this.descriptionPresent()) {
      ids.push(this.descriptionId());
    }
    if (this.errorPresent() && this.isInvalid()) {
      ids.push(this.errorId());
    }
    return ids.length > 0 ? ids.join(' ') : null;
  });

  /** The shortcut label of a choice, or null when shortcuts are off or this item is not the active one. */
  readonly shortcutFor = (choice: ZardQuestionnaireChoiceRef): string | null => {
    const mode = this.questionnaire.zShortcuts();
    if (mode === 'none' || !this.isActive()) {
      return null;
    }

    const index = this.enabledChoices().indexOf(choice);
    if (index < 0) {
      return null;
    }
    if (mode === 'letters') {
      return index < 26 ? String.fromCharCode(97 + index) : null;
    }
    return index < 9 ? String(index + 1) : null;
  };

  choiceAt(index: number): ZardQuestionnaireChoiceRef | undefined {
    return this.enabledChoices()[index];
  }

  protected readonly classes = computed(() => mergeClasses(questionnaireItemVariants(), this.class()));
}
```

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  type Signal,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { buttonVariants, type ZardButtonTypeVariants } from '@/shared/components/button/button.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardQuestionnaireComponent } from './questionnaire.component';
import {
  questionnaireNextVariants,
  questionnairePreviousVariants,
  questionnaireSkipVariants,
  questionnaireSubmitVariants,
} from './questionnaire.variants';

const NAVIGATION_BUTTON_TEMPLATE = `
  @if (zLoading()) {
    <ng-icon name="lucideLoaderCircle" class="animate-spin duration-2000" />
  }
  <ng-content />
`;

/**
 * Shared behavior of the four navigation buttons: the questionnaire decides when the action is available,
 * the button only adds its own disabled and loading state on top.
 */
@Component({
  imports: [NgIcon],
  template: NAVIGATION_BUTTON_TEMPLATE,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideLoaderCircle })],
  host: {
    '[hidden]': '!available()',
    '[attr.disabled]': 'disabledState() ? "" : null',
    '[attr.aria-disabled]': 'disabledState() ? "true" : null',
    '[attr.aria-busy]': 'zLoading() ? "true" : null',
    '(click)': 'handleClick()',
  },
})
export abstract class ZardQuestionnaireNavigationButton extends ZardButtonComponent {
  protected readonly questionnaire = inject(ZardQuestionnaireComponent);

  override readonly zDisabled = input(false, { alias: 'disabled', transform: booleanAttribute });
  // These are always native buttons that own their disabled state. Turning this off keeps the inherited
  // ZardButtonComponent host bindings (attr.disabled, aria-disabled, role, tabindex) inert, so they cannot
  // overwrite the `[disabled]` binding above when `disabled` toggles while the action is still unavailable.
  protected override readonly isNotInsideOfButtonOrLink = computed(() => false);

  /** Whether the questionnaire currently offers this action. */
  protected abstract readonly available: Signal<boolean>;
  protected abstract readonly slotVariants: () => string;

  readonly disabledState = computed(
    () => this.zDisabled() || this.zLoading() || this.questionnaire.disabled() || !this.available(),
  );

  protected override readonly classes = computed(() =>
    mergeClasses(
      buttonVariants({
        zType: this.zType(),
        zSize: this.zSize(),
        zShape: this.zShape(),
        zLoading: this.zLoading(),
        zDisabled: this.disabledState(),
      }),
      this.slotVariants(),
      this.class(),
    ),
  );

  /** The questionnaire call this button triggers; the submit button leaves it to the native form submit. */
  protected abstract act(): void;

  protected handleClick(): void {
    if (!this.disabledState()) {
      this.act();
    }
  }
}

@Component({
  selector: 'button[z-questionnaire-previous]',
  imports: [NgIcon],
  template: NAVIGATION_BUTTON_TEMPLATE,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideLoaderCircle })],
  host: {
    type: 'button',
    'data-slot': 'questionnaire-previous',
  },
  exportAs: 'zQuestionnairePrevious',
})
export class ZardQuestionnairePreviousDirective extends ZardQuestionnaireNavigationButton {
  override readonly zType = input<ZardButtonTypeVariants>('outline');
  protected readonly available = this.questionnaire.canMoveBack;
  protected readonly slotVariants = questionnairePreviousVariants;

  protected act(): void {
    this.questionnaire.previous();
  }
}

@Component({
  selector: 'button[z-questionnaire-skip]',
  imports: [NgIcon],
  template: NAVIGATION_BUTTON_TEMPLATE,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideLoaderCircle })],
  host: {
    type: 'button',
    'data-slot': 'questionnaire-skip',
  },
  exportAs: 'zQuestionnaireSkip',
})
export class ZardQuestionnaireSkipDirective extends ZardQuestionnaireNavigationButton {
  override readonly zType = input<ZardButtonTypeVariants>('outline');
  protected readonly available = this.questionnaire.canSkip;
  protected readonly slotVariants = questionnaireSkipVariants;

  protected act(): void {
    this.questionnaire.skip();
  }
}

@Component({
  selector: 'button[z-questionnaire-next]',
  imports: [NgIcon],
  template: NAVIGATION_BUTTON_TEMPLATE,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideLoaderCircle })],
  host: {
    type: 'button',
    'data-slot': 'questionnaire-next',
  },
  exportAs: 'zQuestionnaireNext',
})
export class ZardQuestionnaireNextDirective extends ZardQuestionnaireNavigationButton {
  protected readonly available = this.questionnaire.canMoveNext;
  protected readonly slotVariants = questionnaireNextVariants;

  protected act(): void {
    this.questionnaire.next();
  }
}

@Component({
  selector: 'button[z-questionnaire-submit]',
  imports: [NgIcon],
  template: NAVIGATION_BUTTON_TEMPLATE,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideLoaderCircle })],
  host: {
    type: 'submit',
    'data-slot': 'questionnaire-submit',
  },
  exportAs: 'zQuestionnaireSubmit',
})
export class ZardQuestionnaireSubmitDirective extends ZardQuestionnaireNavigationButton {
  protected readonly available = this.questionnaire.canSubmit;
  protected readonly slotVariants = questionnaireSubmitVariants;

  protected act(): void {
    // The native submit event on the form does the work.
  }
}
```

```angular-ts
import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardQuestionnaireComponent } from './questionnaire.component';
import { questionnaireProgressVariants } from './questionnaire.variants';

@Component({
  selector: 'z-questionnaire-progress',
  template: `
    <ng-content>Question {{ current() }} of {{ total() }}</ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'progressbar',
    '[attr.aria-valuemin]': 'total() === 0 ? 0 : 1',
    '[attr.aria-valuemax]': 'total()',
    '[attr.aria-valuenow]': 'current()',
    '[attr.aria-valuetext]': '"Question " + current() + " of " + total()',
    'data-slot': 'questionnaire-progress',
    '[class]': 'classes()',
  },
  exportAs: 'zQuestionnaireProgress',
})
export class ZardQuestionnaireProgressComponent {
  private readonly questionnaire = inject(ZardQuestionnaireComponent);

  readonly class = input<ClassValue>('');
  readonly current = computed(() =>
    this.questionnaire.enabledItems().length === 0 ? 0 : this.questionnaire.activeIndex() + 1,
  );

  readonly total = computed(() => this.questionnaire.enabledItems().length);

  protected readonly classes = computed(() => mergeClasses(questionnaireProgressVariants(), this.class()));
}
```

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { questionnaireTitleVariants } from './questionnaire.variants';

@Component({
  selector: 'z-questionnaire-title',
  template: `
    <legend>
      <ng-content />
    </legend>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'questionnaire-title',
    '[class]': 'classes()',
  },
  exportAs: 'zQuestionnaireTitle',
})
export class ZardQuestionnaireTitleComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(questionnaireTitleVariants(), this.class()));
}
```

```angular-ts
import { ZardQuestionnaireActionsComponent } from './questionnaire-actions.component';
import { ZardQuestionnaireChoiceDescriptionComponent } from './questionnaire-choice-description.component';
import { ZardQuestionnaireChoiceComponent } from './questionnaire-choice.component';
import { ZardQuestionnaireChoicesComponent } from './questionnaire-choices.component';
import { ZardQuestionnaireDescriptionComponent } from './questionnaire-description.component';
import { ZardQuestionnaireErrorComponent } from './questionnaire-error.component';
import { ZardQuestionnaireInputComponent } from './questionnaire-input.component';
import { ZardQuestionnaireItemComponent } from './questionnaire-item.component';
import {
  ZardQuestionnaireNextDirective,
  ZardQuestionnairePreviousDirective,
  ZardQuestionnaireSkipDirective,
  ZardQuestionnaireSubmitDirective,
} from './questionnaire-navigation.directive';
import { ZardQuestionnaireProgressComponent } from './questionnaire-progress.component';
import { ZardQuestionnaireTitleComponent } from './questionnaire-title.component';
import { ZardQuestionnaireComponent } from './questionnaire.component';

export const ZardQuestionnaireImports = [
  ZardQuestionnaireComponent,
  ZardQuestionnaireChoiceComponent,
  ZardQuestionnaireChoiceDescriptionComponent,
  ZardQuestionnaireChoicesComponent,
  ZardQuestionnaireItemComponent,
  ZardQuestionnaireProgressComponent,
  ZardQuestionnaireActionsComponent,
  ZardQuestionnaireTitleComponent,
  ZardQuestionnaireDescriptionComponent,
  ZardQuestionnaireInputComponent,
  ZardQuestionnaireErrorComponent,
  ZardQuestionnairePreviousDirective,
  ZardQuestionnaireSkipDirective,
  ZardQuestionnaireNextDirective,
  ZardQuestionnaireSubmitDirective,
] as const;

export {
  ZardQuestionnaireComponent,
  ZardQuestionnaireChoiceComponent,
  ZardQuestionnaireChoiceDescriptionComponent,
  ZardQuestionnaireChoicesComponent,
  ZardQuestionnaireItemComponent,
  ZardQuestionnaireProgressComponent,
  ZardQuestionnaireActionsComponent,
  ZardQuestionnaireTitleComponent,
  ZardQuestionnaireDescriptionComponent,
  ZardQuestionnaireInputComponent,
  ZardQuestionnaireErrorComponent,
  ZardQuestionnairePreviousDirective,
  ZardQuestionnaireSkipDirective,
  ZardQuestionnaireNextDirective,
  ZardQuestionnaireSubmitDirective,
};
```

```angular-ts
import { InjectionToken, type Signal } from '@angular/core';

import type { ZardQuestionnaireItem } from './questionnaire.types';

/** What the questionnaire needs from a projected item; the token keeps item and root free of an import cycle. */
export interface ZardQuestionnaireItemRef {
  /** The effective settings (the item's own inputs win over `[zItems]`); null until its name is bound. */
  readonly settings: Signal<ZardQuestionnaireItem | null>;
  /** The enabled choice that the shortcut at `index` selects, if any. */
  choiceAt(index: number): ZardQuestionnaireChoiceRef | undefined;
}

export interface ZardQuestionnaireChoiceRef {
  readonly disabledState: Signal<boolean>;
  select(): void;
}

export const ZARD_QUESTIONNAIRE_ITEM = new InjectionToken<ZardQuestionnaireItemRef>('ZARD_QUESTIONNAIRE_ITEM');
export const ZARD_QUESTIONNAIRE_CHOICE = new InjectionToken<ZardQuestionnaireChoiceRef>('ZARD_QUESTIONNAIRE_CHOICE');
```

```angular-ts
export type ZardQuestionnaireAnswer = string | string[];
export type ZardQuestionnaireAnswers = Record<string, ZardQuestionnaireAnswer>;
export type ZardQuestionnaireShortcutMode = 'none' | 'letters' | 'numbers';

export interface ZardQuestionnaireChoice {
  value: string;
  label?: string;
  disabled?: boolean;
}

export interface ZardQuestionnaireItem {
  name: string;
  choices?: readonly ZardQuestionnaireChoice[];
  required?: boolean;
  multiple?: boolean;
  disabled?: boolean;
}
```

## Usage

```angular-ts
import { ZardQuestionnaireImports } from '@/shared/components/questionnaire/questionnaire.imports';
import type {
  ZardQuestionnaireAnswers,
  ZardQuestionnaireChoice,
  ZardQuestionnaireItem,
} from '@/shared/components/questionnaire/questionnaire.types';
```

```angular-ts
interface QuestionnaireUsageItem extends ZardQuestionnaireItem {
  prompt: string;
  description: string;
  choices: readonly (ZardQuestionnaireChoice & { description?: string })[];
  input?: { label: string; placeholder: string };
}

readonly items: readonly QuestionnaireUsageItem[] = [
  {
    name: 'direction',
    required: true,
    prompt: 'What should we prototype next?',
    description: 'Choose a direction or write your own.',
    choices: [
      {
        value: 'delegation',
        label: 'Delegation',
        description: 'Show how work moves to a specialist.',
      },
      {
        value: 'questions',
        label: 'Question prompts',
        description: 'Show choices while the interface waits.',
      },
      { value: 'both', label: 'Both together' },
    ],
    input: { label: 'Another answer', placeholder: 'Type another answer…' },
  },
  {
    name: 'detail',
    required: false,
    prompt: 'How much detail should it include?',
    description: 'Skip this if you are not sure yet.',
    choices: [
      { value: 'focused', label: 'Focused' },
      { value: 'complete', label: 'Complete flow' },
    ],
  },
];
```

Define the collection once: pass it to z-questionnaire for progress, actions, and shortcuts, then project it into the parts.

```angular-html
<z-questionnaire [zItems]="items" (zSubmit)="handleSubmit($event)">
  <z-questionnaire-progress />

  @for (question of items; track question.name) {
    <z-questionnaire-item [zName]="question.name" [zRequired]="question.required">
      <z-questionnaire-title>{{ question.prompt }}</z-questionnaire-title>
      <z-questionnaire-description>{{ question.description }}</z-questionnaire-description>
      <z-questionnaire-choices>
        @for (choice of question.choices; track choice.value) {
          <z-questionnaire-choice [zValue]="choice.value">
            <span class="font-medium">{{ choice.label }}</span>
            @if (choice.description; as description) {
              <span data-slot="questionnaire-choice-description" class="text-muted-foreground">
                {{ description }}
              </span>
            }
          </z-questionnaire-choice>
        }

        @if (question.input; as input) {
          <z-questionnaire-input [aria-label]="input.label" [placeholder]="input.placeholder" />
        }
      </z-questionnaire-choices>
      <z-questionnaire-error />
    </z-questionnaire-item>
  }

  <z-questionnaire-actions>
    <button type="button" z-questionnaire-previous>Previous</button>
    <button type="button" z-questionnaire-skip>Skip</button>
    <button type="button" z-questionnaire-next>Next</button>
    <button type="submit" z-questionnaire-submit>Submit</button>
  </z-questionnaire-actions>
</z-questionnaire>
```

```angular-ts
handleSubmit(answers: ZardQuestionnaireAnswers): void {
  // answers['direction'], answers['detail'], and answers from multiple-choice items.
}
```

## Composition

```text
z-questionnaire
└── z-questionnaire-progress
└── z-questionnaire-item
│   ├── z-questionnaire-title
│   ├── z-questionnaire-description
│   ├── z-questionnaire-choices
│   │   ├── z-questionnaire-choice
│   │   └── z-questionnaire-input
│   └── z-questionnaire-error
└── z-questionnaire-actions
    ├── z-questionnaire-previous
    ├── z-questionnaire-skip
    ├── z-questionnaire-next
    └── z-questionnaire-submit
```

## Examples

### Multiple Selection

Use `zMultiple` (and `multiple` in `zItems`) for an item that accepts more than one fixed answer.

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

@Component({
  selector: 'z-demo-questionnaire-multiple-selection',
  imports: [ZardQuestionnaireImports],
  template: `
    <z-questionnaire [zItems]="items" zShortcuts="letters" (zSubmit)="save($event)">
      <z-questionnaire-item zName="stack" zRequired zMultiple>
        <z-questionnaire-title>What context should the agent inspect?</z-questionnaire-title>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="source">Relevant source files</z-questionnaire-choice>
          <z-questionnaire-choice zValue="tests">Existing tests</z-questionnaire-choice>
          <z-questionnaire-choice zValue="docs">Architecture documentation</z-questionnaire-choice>
          <z-questionnaire-choice zValue="history">Recent commit history</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-actions>
        <button type="submit" z-questionnaire-submit>Share context</button>
      </z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireMultipleSelectionComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly items: ZardQuestionnaireItem[] = [{ name: 'stack', required: true, multiple: true }];

  save(answers: ZardQuestionnaireAnswers): void {
    const context = answers['stack'];

    this.sonner.show('Context selected', {
      description: `Context: ${Array.isArray(context) ? context.join(', ') : context}`,
    });
  }
}
```

### Freeform Answer

Compose `z-questionnaire-input` with fixed choices when the user can provide another answer.

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

@Component({
  selector: 'z-demo-questionnaire-freeform-answer',
  imports: [ZardQuestionnaireImports],
  template: `
    <z-questionnaire [zItems]="items" (zSubmit)="save($event)">
      <z-questionnaire-item zName="approach" [zRequired]="true">
        <z-questionnaire-title>How should the agent approach this refactor?</z-questionnaire-title>
        <z-questionnaire-description>
          Choose a strategy or write a more specific instruction.
        </z-questionnaire-description>

        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="incremental">Make smallest safe change</z-questionnaire-choice>
          <z-questionnaire-choice zValue="module">Refactor one module at a time</z-questionnaire-choice>
          <z-questionnaire-choice zValue="rewrite">Replace the implementation completely</z-questionnaire-choice>
          <z-questionnaire-input placeholder="Describe another approach..." aria-label="Describe another approach" />
        </z-questionnaire-choices>

        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-actions>
        <button type="submit" z-questionnaire-submit>Use this approach</button>
      </z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoQuestionnaireFreeformAnswerComponent {
  private readonly sonner = inject(ZardSonnerService);
  readonly items: ZardQuestionnaireItem[] = [{ name: 'approach', required: true }];

  save(answers: ZardQuestionnaireAnswers): void {
    const context = answers['approach'];

    this.sonner.show('Approach selected', {
      description: `Context: ${Array.isArray(context) ? context.join(', ') : context}`,
    });
  }
}
```

### Explicit Skip

Add `z-questionnaire-skip` when an optional item may be intentionally left unanswered.

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswer, ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

const TASK_LABELS: Record<string, string> = {
  feature: 'new feature',
  bug: 'bug fix',
  refactor: 'refactor',
};

const CONSTRAINTS_LABELS: Record<string, string> = {
  'no-dependencies': 'do not add dependencies',
  'no-migrations': 'do not change the database',
  'preserve-api': 'preserve the public API',
};

const REVIEW_LABELS: Record<string, string> = {
  tests: 'run the test suite',
  diff: 'review the final diff',
  both: 'tests and diff review',
};

@Component({
  selector: 'z-demo-questionnaire-explicit-skip',
  imports: [ZardQuestionnaireImports],
  template: `
    <z-questionnaire [zItems]="items" zShortcuts="letters" (zSubmit)="save($event)">
      <z-questionnaire-progress />

      <z-questionnaire-item zName="task" zRequired>
        <z-questionnaire-title>What kind of change is this?</z-questionnaire-title>
        <z-questionnaire-description>Choose the category that best describes the work.</z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="feature">New feature</z-questionnaire-choice>
          <z-questionnaire-choice zValue="bug">Bug fix</z-questionnaire-choice>
          <z-questionnaire-choice zValue="refactor">Refactor</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="constraints">
        <z-questionnaire-title>Are there any implementation constraints?</z-questionnaire-title>
        <z-questionnaire-description>
          Answer if needed, or intentionally skip this question.
        </z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="no-dependencies">Do not add dependencies</z-questionnaire-choice>
          <z-questionnaire-choice zValue="no-migrations">Do not change the database</z-questionnaire-choice>
          <z-questionnaire-choice zValue="preserve-api">Preserve the public API</z-questionnaire-choice>
          <z-questionnaire-input
            placeholder="Describe another constraint..."
            aria-label="Another implementation constraint"
          />
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="review" zRequired>
        <z-questionnaire-title>How should the work be reviewed?</z-questionnaire-title>
        <z-questionnaire-description>
          Choose the checks the agent should complete before handoff.
        </z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="tests">Run the test suite</z-questionnaire-choice>
          <z-questionnaire-choice zValue="diff">Review the final diff</z-questionnaire-choice>
          <z-questionnaire-choice zValue="both">Tests and diff review</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-actions>
        <button type="button" z-questionnaire-previous>Back</button>
        <button type="button" z-questionnaire-skip>Skip</button>
        <button type="button" z-questionnaire-next>Next</button>
        <button type="submit" z-questionnaire-submit>Submit brief</button>
      </z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireExplicitSkipComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly items: ZardQuestionnaireItem[] = [
    { name: 'task', required: true },
    { name: 'constraints', required: false },
    { name: 'review', required: true },
  ];

  save(answers: ZardQuestionnaireAnswers): void {
    this.sonner.show('Agent brief submitted', {
      description: [
        `Task: ${this.formatTask(answers['task'])}`,
        `Constraints: ${this.formatConstraints(answers['constraints'])}`,
        `Review: ${this.formatReview(answers['review'])}`,
      ].join(' · '),
    });
  }

  private formatTask(answer: ZardQuestionnaireAnswer | undefined): string {
    const value = this.singleValue(answer);
    return value ? (TASK_LABELS[value] ?? value) : 'None';
  }

  private formatConstraints(answer: ZardQuestionnaireAnswer | undefined): string {
    const values = Array.isArray(answer) ? answer : answer ? [answer] : [];
    return values.length ? values.map(value => CONSTRAINTS_LABELS[value] ?? value).join(', ') : 'Skipped';
  }

  private formatReview(answer: ZardQuestionnaireAnswer | undefined): string {
    const value = this.singleValue(answer);
    return value ? (REVIEW_LABELS[value] ?? value) : 'None';
  }

  private singleValue(answer: ZardQuestionnaireAnswer | undefined): string | undefined {
    return Array.isArray(answer) ? answer[0] : answer;
  }
}
```

### Shortcuts

Assign a letter or number key to each answer with `zShortcuts`.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ZardComboboxImports } from '@/shared/components/combobox';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type {
  ZardQuestionnaireAnswers,
  ZardQuestionnaireItem,
  ZardQuestionnaireShortcutMode,
} from '../questionnaire.types';

@Component({
  selector: 'z-demo-questionnaire-shortcuts',
  imports: [ZardQuestionnaireImports, ZardComboboxImports],
  template: `
    <div class="flex min-h-[415px] w-full flex-col justify-between">
      <z-combobox class="w-32 self-end" [searchable]="false" [(zValue)]="value">
        <z-combobox-input />
        <z-combobox-content>
          <z-combobox-list>
            <z-combobox-item zValue="letters">Letters</z-combobox-item>
            <z-combobox-item zValue="numbers">Numbers</z-combobox-item>
            <z-combobox-item zValue="none">None</z-combobox-item>
          </z-combobox-list>
        </z-combobox-content>
      </z-combobox>

      <z-questionnaire [zItems]="items" [zShortcuts]="shortcutMode()" (zSubmit)="save($event)">
        <z-questionnaire-item zName="next" zRequired>
          <z-questionnaire-title>What should the agent do next?</z-questionnaire-title>
          <z-questionnaire-description class="-mt-4 -mb-1">
            Use the displayed shortcut or navigate with the keyboard.
          </z-questionnaire-description>

          <z-questionnaire-choices>
            <z-questionnaire-choice zValue="inspect">Inspect the implementation</z-questionnaire-choice>
            <z-questionnaire-choice zValue="test">Run the relevant tests</z-questionnaire-choice>
            <z-questionnaire-choice zValue="patch">Prepare the patch</z-questionnaire-choice>
          </z-questionnaire-choices>

          <z-questionnaire-error />
        </z-questionnaire-item>

        <z-questionnaire-actions>
          <button type="submit" z-questionnaire-submit>Confirm action</button>
        </z-questionnaire-actions>
      </z-questionnaire>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireShortcutsComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly items: readonly ZardQuestionnaireItem[] = [{ name: 'next', required: true }];
  readonly value = signal<string | string[] | null>('letters');
  readonly shortcutMode = computed<ZardQuestionnaireShortcutMode>(() => {
    const value = this.value();
    return value === 'letters' || value === 'numbers' ? value : 'none';
  });

  save(answers: ZardQuestionnaireAnswers): void {
    const action = answers['next'];

    this.sonner.show('Action confirmed', {
      description: `Next: ${Array.isArray(action) ? action.join(', ') : action}`,
    });
  }
}
```

### Custom Validation

Combine controlled navigation with an external schema such as Zod to return to an invalid item and present its error.

```angular-ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { z } from 'zod';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

const questionnaireSchema = z
  .object({
    detail: z.enum(['summary', 'complete']),
    audience: z.enum(['team', 'public']),
  })
  .superRefine((answers, context) => {
    if (answers.audience === 'public' && answers.detail === 'summary') {
      context.addIssue({
        code: 'custom',
        message: 'Public answers need enough context. Choose a complete answer.',
        path: ['detail'],
      });
    }
  });

type QuestionnaireItemName = keyof z.infer<typeof questionnaireSchema>;
type QuestionnaireErrors = Partial<Record<QuestionnaireItemName, string>>;

@Component({
  selector: 'z-demo-questionnaire-custom-validation',
  imports: [ZardCardImports, ZardQuestionnaireImports],
  template: `
    <z-questionnaire class="mx-auto max-w-md" [zItems]="items" [(zActive)]="activeItem" (zSubmit)="validate($event)">
      <z-card class="w-full">
        <z-questionnaire-item zName="detail" zRequired [zInvalid]="hasError('detail')">
          <z-card-header>
            <z-questionnaire-title>How much detail should the answer include?</z-questionnaire-title>
            <z-questionnaire-description>Choose the response depth.</z-questionnaire-description>
            <z-card-action>
              <z-questionnaire-progress class="min-w-0" />
            </z-card-action>
          </z-card-header>
          <z-card-content>
            <z-questionnaire-choices>
              <z-questionnaire-choice zValue="summary" (change)="clearError('detail')">
                Concise summary
              </z-questionnaire-choice>
              <z-questionnaire-choice zValue="complete" (change)="clearError('detail')">
                Complete answer
              </z-questionnaire-choice>
            </z-questionnaire-choices>
            <z-questionnaire-error>{{ errorFor('detail') }}</z-questionnaire-error>
          </z-card-content>
        </z-questionnaire-item>

        <z-questionnaire-item zName="audience" zRequired [zInvalid]="hasError('audience')">
          <z-card-header>
            <z-questionnaire-title>Who will read the answer?</z-questionnaire-title>
            <z-questionnaire-description>Public answers require complete context.</z-questionnaire-description>
            <z-card-action>
              <z-questionnaire-progress class="min-w-0" />
            </z-card-action>
          </z-card-header>
          <z-card-content>
            <z-questionnaire-choices>
              <z-questionnaire-choice zValue="team" (change)="clearError('audience')">My team</z-questionnaire-choice>
              <z-questionnaire-choice zValue="public" (change)="clearError('audience')">
                Public audience
              </z-questionnaire-choice>
            </z-questionnaire-choices>
            <z-questionnaire-error>{{ errorFor('audience') }}</z-questionnaire-error>
          </z-card-content>
        </z-questionnaire-item>

        <z-card-footer>
          <z-questionnaire-actions>
            <button type="button" z-questionnaire-previous>Previous</button>
            <button type="button" z-questionnaire-next>Next</button>
            <button type="submit" z-questionnaire-submit>Validate answers</button>
          </z-questionnaire-actions>
        </z-card-footer>
      </z-card>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireCustomValidationComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly items: ZardQuestionnaireItem[] = [
    { name: 'detail', required: true },
    { name: 'audience', required: true },
  ];

  readonly activeItem = signal<QuestionnaireItemName>('detail');
  readonly errors = signal<QuestionnaireErrors>({});

  hasError(name: QuestionnaireItemName): boolean {
    return Boolean(this.errors()[name]);
  }

  errorFor(name: QuestionnaireItemName): string {
    return this.errors()[name] ?? 'Choose an answer to continue.';
  }

  clearError(name: QuestionnaireItemName): void {
    this.errors.update(currentErrors => {
      if (!currentErrors[name]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  }

  validate(answers: ZardQuestionnaireAnswers): void {
    const result = questionnaireSchema.safeParse(answers);

    if (result.success) {
      this.errors.set({});
      this.sonner.show('Agent response configured', {
        description: `Detail: ${result.data.detail} · Audience: ${result.data.audience}`,
      });
      return;
    }

    const nextErrors: QuestionnaireErrors = {};

    for (const issue of result.error.issues) {
      const name = issue.path[0];
      if ((name === 'detail' || name === 'audience') && !nextErrors[name]) {
        nextErrors[name] = issue.message;
      }
    }

    this.errors.set(nextErrors);

    const firstInvalidItem = result.error.issues[0]?.path[0];
    if (firstInvalidItem === 'detail' || firstInvalidItem === 'audience') {
      this.activeItem.set(firstInvalidItem);
    }
  }
}
```

### Controlled

Control the active item from host state, such as returning to an invalid step.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

type QuestionnaireItemName = 'scope' | 'checks' | 'output';

const ITEM_LABELS: Record<QuestionnaireItemName, string> = {
  scope: 'Change scope',
  checks: 'Verification level',
  output: 'Output format',
};

@Component({
  selector: 'z-demo-questionnaire-controlled',
  imports: [ZardQuestionnaireImports],
  template: `
    <div class="relative mx-auto flex size-full max-w-md flex-col">
      <p class="text-muted-foreground absolute inset-e-0 top-0 text-sm" role="status">
        Current checkpoint: {{ activeItemLabel() }}
      </p>

      <z-questionnaire class="mt-auto" [zItems]="items" [(zActive)]="activeItem" (zSubmit)="saveWorkflow($event)">
        <z-questionnaire-progress />

        <z-questionnaire-item zName="scope" zRequired>
          <z-questionnaire-title>What may the agent change?</z-questionnaire-title>
          <z-questionnaire-description>
            The host stores the active checkpoint while Questionnaire navigates.
          </z-questionnaire-description>
          <z-questionnaire-choices>
            <z-questionnaire-choice zValue="component">Only the target component</z-questionnaire-choice>
            <z-questionnaire-choice zValue="tests">Component and related tests</z-questionnaire-choice>
            <z-questionnaire-choice zValue="feature">The complete feature area</z-questionnaire-choice>
          </z-questionnaire-choices>
          <z-questionnaire-error />
        </z-questionnaire-item>

        <z-questionnaire-item zName="checks" zRequired>
          <z-questionnaire-title>Which verification level should it use?</z-questionnaire-title>
          <z-questionnaire-choices>
            <z-questionnaire-choice zValue="targeted">Targeted tests</z-questionnaire-choice>
            <z-questionnaire-choice zValue="package">Package tests and typecheck</z-questionnaire-choice>
            <z-questionnaire-choice zValue="full">Full workspace verification</z-questionnaire-choice>
          </z-questionnaire-choices>
          <z-questionnaire-error />
        </z-questionnaire-item>

        <z-questionnaire-item zName="output" zRequired>
          <z-questionnaire-title>What should the agent return when finished?</z-questionnaire-title>
          <z-questionnaire-choices>
            <z-questionnaire-choice zValue="summary">Concise summary</z-questionnaire-choice>
            <z-questionnaire-choice zValue="diff">Summary with changed files</z-questionnaire-choice>
            <z-questionnaire-choice zValue="handoff">Detailed implementation handoff</z-questionnaire-choice>
          </z-questionnaire-choices>
          <z-questionnaire-error />
        </z-questionnaire-item>

        <z-questionnaire-actions>
          <button type="button" z-questionnaire-previous>Previous</button>
          <button type="button" z-questionnaire-next>Next</button>
          <button type="submit" z-questionnaire-submit>Save workflow</button>
        </z-questionnaire-actions>
      </z-questionnaire>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full w-full' },
})
export class ZardDemoQuestionnaireControlledComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly items: ZardQuestionnaireItem[] = [
    { name: 'scope', required: true },
    { name: 'checks', required: true },
    { name: 'output', required: true },
  ];

  readonly activeItem = signal<QuestionnaireItemName>('scope');
  readonly activeItemLabel = computed(() => ITEM_LABELS[this.activeItem()]);

  saveWorkflow(answers: ZardQuestionnaireAnswers): void {
    this.sonner.show('Workflow saved', {
      description: `Scope: ${answers['scope']} · Verification: ${answers['checks']} · Output: ${answers['output']}`,
    });
  }
}
```

### Resume

Restore a saved active item and default answers, then reset changes back to that saved state.

```angular-ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswer, ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

@Component({
  selector: 'z-demo-questionnaire-resume',
  imports: [ZardQuestionnaireImports, ZardButtonComponent],
  template: `
    <z-questionnaire [zItems]="items" [(zActive)]="activeItem" (reset)="restoreDraft()" (zSubmit)="updateDraft($event)">
      <z-questionnaire-progress />

      <z-questionnaire-item zName="change" zRequired>
        <z-questionnaire-title>What kind of migration is this?</z-questionnaire-title>
        <z-questionnaire-description>This answer was saved during the previous session.</z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="incremental" checked>Incremental migration</z-questionnaire-choice>
          <z-questionnaire-choice zValue="cutover">Single cutover</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="verification" zMultiple zRequired>
        <z-questionnaire-title>How should the migration be verified?</z-questionnaire-title>
        <z-questionnaire-description>
          These checks were selected during the previous session.
        </z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="tests" checked>Run migration tests</z-questionnaire-choice>
          <z-questionnaire-choice zValue="typecheck" checked>Run the typecheck</z-questionnaire-choice>
          <z-questionnaire-choice zValue="manual">Perform a manual smoke test</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="notes">
        <z-questionnaire-title>Anything else the agent should remember?</z-questionnaire-title>
        <z-questionnaire-description>This note was saved with the draft.</z-questionnaire-description>
        <z-questionnaire-input aria-label="Saved migration note" value="Keep the existing public API stable." />
      </z-questionnaire-item>

      <z-questionnaire-actions class="grid-cols-[auto_minmax(0,1fr)_auto]">
        <button type="button" z-questionnaire-previous>Previous</button>
        <button type="reset" z-button zType="outline" class="justify-self-start">Reset changes</button>
        <button type="button" z-questionnaire-next>Next</button>
        <button type="submit" z-questionnaire-submit>Update draft</button>
      </z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireResumeComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly items: ZardQuestionnaireItem[] = [
    { name: 'change', required: true },
    { name: 'verification', multiple: true, required: true },
    { name: 'notes' },
  ];

  readonly activeItem = signal('verification');

  restoreDraft(): void {
    this.activeItem.set('verification');
    this.sonner.show('Saved answers restored');
  }

  updateDraft(answers: ZardQuestionnaireAnswers): void {
    this.sonner.show('Draft updated', {
      description: [
        `Migration: ${this.singleValue(answers['change']) ?? 'None'}`,
        `Verification: ${this.values(answers['verification']).join(', ') || 'None'}`,
        `Notes: ${this.singleValue(answers['notes']) || 'None'}`,
      ].join(' · '),
    });
  }

  private values(answer: ZardQuestionnaireAnswer | undefined): string[] {
    return Array.isArray(answer) ? answer : answer ? [answer] : [];
  }

  private singleValue(answer: ZardQuestionnaireAnswer | undefined): string | undefined {
    return this.values(answer)[0];
  }
}
```

### Conditional Items

Disable items that do not apply to the user's earlier answers.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswer, ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

type Runtime = 'local' | 'cloud';

@Component({
  selector: 'z-demo-questionnaire-conditional-items',
  imports: [ZardQuestionnaireImports],
  template: `
    <z-questionnaire [zItems]="items()" (zSubmit)="saveExecutionPlan($event)">
      <z-questionnaire-progress />

      <z-questionnaire-item zName="runtime" zRequired>
        <z-questionnaire-title>Where should the agent run?</z-questionnaire-title>
        <z-questionnaire-description>Cloud runs add an environment question to this flow.</z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="local" [checked]="runtime() === 'local'" (change)="runtime.set('local')">
            Local workspace
          </z-questionnaire-choice>
          <z-questionnaire-choice zValue="cloud" [checked]="runtime() === 'cloud'" (change)="runtime.set('cloud')">
            Cloud workspace
          </z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="environment" [zDisabled]="runtime() !== 'cloud'" zRequired>
        <z-questionnaire-title>Which cloud environment should it use?</z-questionnaire-title>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="preview">Preview</z-questionnaire-choice>
          <z-questionnaire-choice zValue="staging">Staging</z-questionnaire-choice>
          <z-questionnaire-choice zValue="isolated">Isolated sandbox</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="approval" zRequired>
        <z-questionnaire-title>When should the agent request approval?</z-questionnaire-title>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="writes">Before writing files</z-questionnaire-choice>
          <z-questionnaire-choice zValue="commands">Before running commands</z-questionnaire-choice>
          <z-questionnaire-choice zValue="sensitive">Only for sensitive actions</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-actions>
        <button type="button" z-questionnaire-previous>Previous</button>
        <button type="button" z-questionnaire-next>Next</button>
        <button type="submit" z-questionnaire-submit>Save execution plan</button>
      </z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireConditionalItemsComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly runtime = signal<Runtime>('local');
  readonly items = computed<readonly ZardQuestionnaireItem[]>(() => [
    { name: 'runtime', required: true },
    { name: 'environment', required: true, disabled: this.runtime() !== 'cloud' },
    { name: 'approval', required: true },
  ]);

  saveExecutionPlan(answers: ZardQuestionnaireAnswers): void {
    this.sonner.show('Execution plan saved', {
      description: [
        `Runtime: ${this.singleValue(answers['runtime']) ?? 'None'}`,
        `Environment: ${this.singleValue(answers['environment']) ?? 'Not applicable'}`,
        `Approval: ${this.singleValue(answers['approval']) ?? 'None'}`,
      ].join(' · '),
    });
  }

  private singleValue(answer: ZardQuestionnaireAnswer | undefined): string | undefined {
    return Array.isArray(answer) ? answer[0] : answer;
  }
}
```

### Navigation State

Use the active item status to disable navigation until the current question has an answer.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

type QuestionnaireItemName = 'permission' | 'verification';
type QuestionnaireItemStatus = 'answered' | 'unanswered';

@Component({
  selector: 'z-demo-questionnaire-navigation-state',
  imports: [ZardQuestionnaireImports],
  template: `
    <z-questionnaire
      class="mx-auto max-w-md"
      [zItems]="items"
      [(zActive)]="activeItem"
      (zSubmit)="savePermissions($event)"
    >
      <z-questionnaire-progress />

      <z-questionnaire-item zName="permission" zRequired>
        <z-questionnaire-title>What may the agent modify?</z-questionnaire-title>
        <z-questionnaire-description>
          Next is intentionally disabled until an answer is selected.
        </z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="files" (change)="setStatus('permission', 'answered')">
            Project files
          </z-questionnaire-choice>
          <z-questionnaire-choice zValue="tests" (change)="setStatus('permission', 'answered')">
            Project files and tests
          </z-questionnaire-choice>
          <z-questionnaire-choice zValue="config" (change)="setStatus('permission', 'answered')">
            Files, tests, and configuration
          </z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="verification" zRequired>
        <z-questionnaire-title>What must pass before completion?</z-questionnaire-title>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="tests" (change)="setStatus('verification', 'answered')">
            Tests
          </z-questionnaire-choice>
          <z-questionnaire-choice zValue="types" (change)="setStatus('verification', 'answered')">
            Tests and types
          </z-questionnaire-choice>
          <z-questionnaire-choice zValue="all" (change)="setStatus('verification', 'answered')">
            Tests, types, and visual QA
          </z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-actions>
        <button type="button" z-questionnaire-previous>Previous</button>
        <button
          type="button"
          z-questionnaire-next
          zType="secondary"
          class="data-[status=unanswered]:opacity-50"
          [attr.data-status]="activeStatus()"
          [disabled]="unanswered()"
        >
          Next
        </button>
        <button type="submit" z-questionnaire-submit [disabled]="unanswered()">Save permissions</button>
      </z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireNavigationStateComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly items: ZardQuestionnaireItem[] = [
    { name: 'permission', required: true },
    { name: 'verification', required: true },
  ];

  readonly activeItem = signal<QuestionnaireItemName>('permission');
  readonly statuses = signal<Record<QuestionnaireItemName, QuestionnaireItemStatus>>({
    permission: 'unanswered',
    verification: 'unanswered',
  });

  readonly activeStatus = computed(() => this.statuses()[this.activeItem()]);
  readonly unanswered = computed(() => this.activeStatus() === 'unanswered');

  setStatus(name: QuestionnaireItemName, status: QuestionnaireItemStatus): void {
    this.statuses.update(current => ({ ...current, [name]: status }));
  }

  savePermissions(answers: ZardQuestionnaireAnswers): void {
    this.sonner.show('Permissions saved', {
      description: `Permission: ${answers['permission'] ?? 'None'} · Verification: ${answers['verification'] ?? 'None'}`,
    });
  }
}
```

### Custom Progress

Replace the default progress label with a custom step indicator.

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

@Component({
  selector: 'z-demo-questionnaire-custom-progress',
  imports: [ZardQuestionnaireImports],
  template: `
    <z-questionnaire class="mx-auto max-w-md" [zItems]="items" zActive="scope" (zSubmit)="savePlan($event)">
      <z-questionnaire-progress #progress="zQuestionnaireProgress" class="w-full">
        <div class="mb-2 flex gap-1.5" aria-hidden="true">
          @for (item of items; track item.name; let index = $index) {
            <span
              class="h-1.5 flex-1 rounded-full"
              [class.bg-primary]="index < progress.current()"
              [class.bg-muted]="index >= progress.current()"
            ></span>
          }
        </div>
        <span>Checkpoint {{ progress.current() }} of {{ progress.total() }}</span>
      </z-questionnaire-progress>

      <z-questionnaire-item zName="scope" zRequired>
        <z-questionnaire-title>How large is the change?</z-questionnaire-title>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="small">Small patch</z-questionnaire-choice>
          <z-questionnaire-choice zValue="medium">Feature-sized change</z-questionnaire-choice>
          <z-questionnaire-choice zValue="large">Cross-package change</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="strategy" zRequired>
        <z-questionnaire-title>How should commits be organized?</z-questionnaire-title>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="single">Single commit</z-questionnaire-choice>
          <z-questionnaire-choice zValue="logical">Logical commits</z-questionnaire-choice>
          <z-questionnaire-choice zValue="squash">Squash before review</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="tests" zRequired>
        <z-questionnaire-title>Which tests should run?</z-questionnaire-title>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="targeted">Targeted tests</z-questionnaire-choice>
          <z-questionnaire-choice zValue="package">Package suite</z-questionnaire-choice>
          <z-questionnaire-choice zValue="workspace">Full workspace</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="delivery" zRequired>
        <z-questionnaire-title>How should the work be delivered?</z-questionnaire-title>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="patch">Patch only</z-questionnaire-choice>
          <z-questionnaire-choice zValue="commit">Committed locally</z-questionnaire-choice>
          <z-questionnaire-choice zValue="branch">Push a review branch</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-actions>
        <button type="button" z-questionnaire-previous>Previous</button>
        <button type="button" z-questionnaire-next>Next</button>
        <button type="submit" z-questionnaire-submit>Finish plan</button>
      </z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireCustomProgressComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly items: ZardQuestionnaireItem[] = [
    { name: 'scope', required: true },
    { name: 'strategy', required: true },
    { name: 'tests', required: true },
    { name: 'delivery', required: true },
  ];

  savePlan(answers: ZardQuestionnaireAnswers): void {
    this.sonner.show('Pull request plan ready', {
      description: `Scope: ${answers['scope'] ?? 'None'} · Commits: ${answers['strategy'] ?? 'None'} · Tests: ${answers['tests'] ?? 'None'} · Delivery: ${answers['delivery'] ?? 'None'}`,
    });
  }
}
```

### Animated Items

Animate the active item while keeping progress and navigation stationary.

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

const ITEM_CLASS_NAME =
  'data-active:animate-in data-active:fade-in-0 data-active:slide-in-from-bottom-2 data-active:duration-300 motion-reduce:animate-none';

@Component({
  selector: 'z-demo-questionnaire-animated-items',
  imports: [ZardQuestionnaireImports],
  template: `
    <z-questionnaire class="mx-auto max-w-md" [zItems]="items" zActive="task" (zSubmit)="saveWorkflow($event)">
      <z-questionnaire-progress />

      <z-questionnaire-item [class]="itemClassName" zName="task" zRequired>
        <z-questionnaire-title>What should the agent do?</z-questionnaire-title>
        <z-questionnaire-description>Choose the task for this run.</z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="implement">Implement the requested change</z-questionnaire-choice>
          <z-questionnaire-choice zValue="debug">Debug the current behavior</z-questionnaire-choice>
          <z-questionnaire-choice zValue="review">Review the implementation</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item [class]="itemClassName" zName="review" zRequired>
        <z-questionnaire-title>How should the work be reviewed?</z-questionnaire-title>
        <z-questionnaire-description>Select the verification depth.</z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="targeted">Targeted checks</z-questionnaire-choice>
          <z-questionnaire-choice zValue="complete">Complete test suite</z-questionnaire-choice>
          <z-questionnaire-choice zValue="manual">Tests and manual QA</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item [class]="itemClassName" zName="delivery" zRequired>
        <z-questionnaire-title>How should the result be delivered?</z-questionnaire-title>
        <z-questionnaire-description>Choose the final handoff format.</z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="summary">Concise summary</z-questionnaire-choice>
          <z-questionnaire-choice zValue="diff">Summary and changed files</z-questionnaire-choice>
          <z-questionnaire-choice zValue="handoff">Detailed review handoff</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-actions>
        <button type="button" z-questionnaire-previous>Previous</button>
        <button type="button" z-questionnaire-next>Next</button>
        <button type="submit" z-questionnaire-submit>Save workflow</button>
      </z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireAnimatedItemsComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly itemClassName = ITEM_CLASS_NAME;
  readonly items: ZardQuestionnaireItem[] = [
    { name: 'task', required: true },
    { name: 'review', required: true },
    { name: 'delivery', required: true },
  ];

  saveWorkflow(answers: ZardQuestionnaireAnswers): void {
    this.sonner.show('Agent workflow saved', {
      description: `Task: ${answers['task'] ?? 'None'} · Review: ${answers['review'] ?? 'None'} · Delivery: ${answers['delivery'] ?? 'None'}`,
    });
  }
}
```

### Card

Compose `z-questionnaire` items, progress, and navigation inside a card.

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

@Component({
  selector: 'z-demo-questionnaire-card',
  imports: [ZardCardImports, ZardQuestionnaireImports],
  template: `
    <z-questionnaire class="mx-auto max-w-md" [zItems]="items" zShortcuts="numbers" (zSubmit)="createTask($event)">
      <z-card>
        <z-questionnaire-item zName="task" zRequired>
          <z-card-header>
            <z-questionnaire-title id="task-title">
              <z-card-title zTitle="What should the agent work on?" />
            </z-questionnaire-title>
            <z-questionnaire-description>
              <z-card-description zDescription="Choose the task that should be handled next." />
            </z-questionnaire-description>
            <z-card-action>
              <z-questionnaire-progress />
            </z-card-action>
          </z-card-header>
          <z-card-content>
            <z-questionnaire-choices>
              <z-questionnaire-choice zValue="fix">Fix the failing tests</z-questionnaire-choice>
              <z-questionnaire-choice zValue="refactor">Refactor the data layer</z-questionnaire-choice>
              <z-questionnaire-choice zValue="docs">Update the integration guide</z-questionnaire-choice>
            </z-questionnaire-choices>
            <z-questionnaire-error />
          </z-card-content>
        </z-questionnaire-item>

        <z-questionnaire-item zName="output" zRequired>
          <z-card-header>
            <z-questionnaire-title id="output-title">
              <z-card-title zTitle="What should the final handoff include?" />
            </z-questionnaire-title>
            <z-questionnaire-description>
              <z-card-description zDescription="Pick the level of detail needed for review." />
            </z-questionnaire-description>
            <z-card-action>
              <z-questionnaire-progress />
            </z-card-action>
          </z-card-header>
          <z-card-content>
            <z-questionnaire-choices>
              <z-questionnaire-choice zValue="summary">Summary only</z-questionnaire-choice>
              <z-questionnaire-choice zValue="files">Summary and changed files</z-questionnaire-choice>
              <z-questionnaire-choice zValue="review">Full review handoff</z-questionnaire-choice>
            </z-questionnaire-choices>
            <z-questionnaire-error />
          </z-card-content>
        </z-questionnaire-item>

        <z-card-footer>
          <z-questionnaire-actions class="w-full">
            <button type="button" z-questionnaire-previous>Previous</button>
            <button type="button" z-questionnaire-next>Next</button>
            <button type="submit" z-questionnaire-submit>Create task</button>
          </z-questionnaire-actions>
        </z-card-footer>
      </z-card>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireCardComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly items = [
    {
      choices: [{ value: 'fix' }, { value: 'refactor' }, { value: 'docs' }],
      name: 'task',
      required: true,
    },
    {
      choices: [{ value: 'summary' }, { value: 'files' }, { value: 'review' }],
      name: 'output',
      required: true,
    },
  ] as const satisfies readonly ZardQuestionnaireItem[];

  createTask(answers: ZardQuestionnaireAnswers): void {
    this.sonner.show('Agent task created', {
      description: `Task: ${answers['task'] ?? 'None'} · Handoff: ${answers['output'] ?? 'None'}`,
    });
  }
}
```

### Dialog

Compose `z-questionnaire` inside a `z-dialog` while keeping cancellation and dismissal host-owned.

```angular-ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

@Component({
  selector: 'z-demo-questionnaire-dialog',
  imports: [ZardButtonComponent, ZardDialogImports, ZardQuestionnaireImports],
  template: `
    <button type="button" z-button zType="outline" (click)="open.set(true)">Open clarification</button>

    <z-dialog [(zVisible)]="open">
      <z-dialog-title class="sr-only">Clarification questionnaire</z-dialog-title>
      <z-dialog-description class="sr-only">
        Answer two questions about the requested scope and verification.
      </z-dialog-description>

      <z-questionnaire [zItems]="items" zActive="scope" (zSubmit)="sendClarification($event)">
        <z-questionnaire-item zName="scope" zRequired>
          <z-dialog-header>
            <z-questionnaire-progress />
            <z-questionnaire-title>Which files are in scope?</z-questionnaire-title>
            <z-questionnaire-description>
              Choose how broadly the agent can update the workspace.
            </z-questionnaire-description>
          </z-dialog-header>
          <z-questionnaire-choices>
            <z-questionnaire-choice zValue="component">Component only</z-questionnaire-choice>
            <z-questionnaire-choice zValue="feature">Complete feature directory</z-questionnaire-choice>
            <z-questionnaire-choice zValue="workspace">Any related workspace file</z-questionnaire-choice>
          </z-questionnaire-choices>
          <z-questionnaire-error />
        </z-questionnaire-item>

        <z-questionnaire-item zName="tests" zRequired>
          <z-dialog-header>
            <z-questionnaire-progress />
            <z-questionnaire-title>How much verification is needed?</z-questionnaire-title>
            <z-questionnaire-description>
              Choose the checks the agent should run before handoff.
            </z-questionnaire-description>
          </z-dialog-header>
          <z-questionnaire-choices>
            <z-questionnaire-choice zValue="targeted">Targeted tests</z-questionnaire-choice>
            <z-questionnaire-choice zValue="package">Package tests</z-questionnaire-choice>
            <z-questionnaire-choice zValue="full">Full workspace verification</z-questionnaire-choice>
          </z-questionnaire-choices>
          <z-questionnaire-error />
        </z-questionnaire-item>

        <z-dialog-footer>
          <button type="button" z-button zType="outline" z-dialog-close>Cancel</button>
          <z-questionnaire-actions>
            <button type="button" z-questionnaire-previous>Previous</button>
            <button type="button" z-questionnaire-next>Next</button>
            <button type="submit" z-questionnaire-submit>Send answer</button>
          </z-questionnaire-actions>
        </z-dialog-footer>
      </z-questionnaire>
    </z-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoQuestionnaireDialogComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly open = signal(false);
  readonly items = [
    {
      choices: [{ value: 'component' }, { value: 'feature' }, { value: 'workspace' }],
      name: 'scope',
      required: true,
    },
    {
      choices: [{ value: 'targeted' }, { value: 'package' }, { value: 'full' }],
      name: 'tests',
      required: true,
    },
  ] as const satisfies readonly ZardQuestionnaireItem[];

  sendClarification(answers: ZardQuestionnaireAnswers): void {
    this.open.set(false);
    this.sonner.show('Clarification sent', {
      description: `Scope: ${answers['scope'] ?? 'None'} · Verification: ${answers['tests'] ?? 'None'}`,
    });
  }
}
```

## Accessibility

Each `z-questionnaire-item` renders a fieldset. Fixed choices use native, labelled radio or checkbox inputs, while progress exposes progressbar values and navigation uses native buttons. Inactive items and unavailable actions are hidden.

After successful navigation, focus moves to the first enabled input in the active item. Failed validation marks the item invalid, reveals its alert, and focuses the first enabled input.

Always give `z-questionnaire-input` an accessible name with `aria-label` or by wrapping it in a visible label. A placeholder is not a label. Description and visible error content are automatically associated with the item fieldset and built-in answer controls; custom projected controls can reference the generated description and error ids when needed.

## API Reference

### z-questionnaire

A multi-step questionnaire with single-choice, multiple-choice, freeform, and skippable questions. Implements ControlValueAccessor for Reactive Forms.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zItems]` | Optional item settings by name (required, multiple, disabled). They apply only where the matching z-questionnaire-item does not set the same input; the projected items define the order. Without projected items, this list defines the flow | `readonly ZardQuestionnaireItem[]` | `[]` |
| `zActive` | Active item name; supports two-way binding with [(zActive)] | `string \| undefined` | `undefined` |
| `zShortcuts` | Assigns answer shortcuts to the enabled choices of the active item. Only the focused questionnaire reacts; with nothing focused, the last one interacted with does | `'none' \| 'letters' \| 'numbers'` | `'none'` |
| `class` | Custom CSS classes | `ClassValue` | `''` |
| `(zSubmit)` | Emits the answers once every enabled item validates | `EventEmitter<Record<string, string \| string[]>>` | `-` |

### z-questionnaire-progress

Displays the current question and total as text and an accessible progress bar.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `class` | Custom CSS classes | `ClassValue` | `''` |

### z-questionnaire-item

One questionnaire step rendered as a fieldset.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `zName` | Unique item name used for navigation and the submitted answer key | `string` | `required` |
| `zRequired` | Requires an answer before navigation or submission can continue. Wins over the item in [zItems]; when unset, [zItems] decides | `boolean` | `false` |
| `zMultiple` | Allows multiple fixed answers and submits a string array. Wins over the item in [zItems]; when unset, [zItems] decides | `boolean` | `false` |
| `zDisabled` | Disables the item and excludes it from progress, navigation, validation, and submission. Wins over the item in [zItems]; when unset, [zItems] decides | `boolean` | `false` |
| `zInvalid` | Marks the item invalid from consumer-owned validation | `boolean` | `false` |
| `class` | Custom CSS classes | `ClassValue` | `''` |

### z-questionnaire-title

Item prompt rendered as the fieldset legend.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `class` | Custom CSS classes | `ClassValue` | `''` |

### z-questionnaire-description

Supporting text automatically wired to the item fieldset and built-in answer controls.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `class` | Custom CSS classes | `ClassValue` | `''` |

### z-questionnaire-choices

Layout container for fixed choices and the freeform input.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `class` | Custom CSS classes | `ClassValue` | `''` |

### z-questionnaire-choice

One fixed answer rendered as a label with a native radio or checkbox and an optional shortcut.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `zValue` | Value submitted when the choice is selected | `string` | `required` |
| `checked` | Initial checked state, including the state restored by a native form reset | `boolean` | `false` |
| `zDisabled` | Disables this choice | `boolean` | `false` |
| `class` | Custom CSS classes | `ClassValue` | `''` |

### z-questionnaire-choice-description

Secondary text under a choice label, rendered in muted color.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `class` | Custom CSS classes | `ClassValue` | `''` |

### z-questionnaire-input

Freeform answer for the active item.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `type` | Native input type | `string` | `'text'` |
| `value` | Initial value, including the value restored by a native form reset | `string` | `''` |
| `placeholder` | Placeholder text | `string` | `''` |
| `aria-label` | Accessible label for the freeform input | `string \| null` | `null` |
| `zDisabled` | Disables the freeform input | `boolean` | `false` |
| `class` | Custom CSS classes | `ClassValue` | `''` |

### z-questionnaire-error

Validation message for the item.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `class` | Custom CSS classes | `ClassValue` | `''` |

### z-questionnaire-actions

Layout row for questionnaire navigation buttons.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `class` | Custom CSS classes | `ClassValue` | `''` |

### button[z-questionnaire-previous]

Moves to the previous item and hides itself when no previous item is available.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `disabled` | Disables the button in addition to its questionnaire-controlled disabled state | `boolean` | `false` |
| `zType` | Button visual style | `ZardButtonTypeVariants` | `'outline'` |
| `zSize` | Button size | `ZardButtonSizeVariants` | `'default'` |
| `zShape` | Button shape | `ZardButtonShapeVariants` | `'default'` |
| `zLoading` | Shows the loading state and disables the button | `boolean` | `false` |
| `class` | Custom CSS classes | `ClassValue` | `''` |

### button[z-questionnaire-skip]

Skips the active optional item and hides itself when the item cannot be skipped.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `disabled` | Disables the button in addition to its questionnaire-controlled disabled state | `boolean` | `false` |
| `zType` | Button visual style | `ZardButtonTypeVariants` | `'outline'` |
| `zSize` | Button size | `ZardButtonSizeVariants` | `'default'` |
| `zShape` | Button shape | `ZardButtonShapeVariants` | `'default'` |
| `zLoading` | Shows the loading state and disables the button | `boolean` | `false` |
| `class` | Custom CSS classes | `ClassValue` | `''` |

### button[z-questionnaire-next]

Validates the active item, moves forward, and hides itself on the final item.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `disabled` | Disables the button in addition to its questionnaire-controlled disabled state | `boolean` | `false` |
| `zType` | Button visual style | `ZardButtonTypeVariants` | `'default'` |
| `zSize` | Button size | `ZardButtonSizeVariants` | `'default'` |
| `zShape` | Button shape | `ZardButtonShapeVariants` | `'default'` |
| `zLoading` | Shows the loading state and disables the button | `boolean` | `false` |
| `class` | Custom CSS classes | `ClassValue` | `''` |

### button[z-questionnaire-submit]

Submits the questionnaire and hides itself until the final item is active.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `disabled` | Disables the button in addition to its questionnaire-controlled disabled state | `boolean` | `false` |
| `zType` | Button visual style | `ZardButtonTypeVariants` | `'default'` |
| `zSize` | Button size | `ZardButtonSizeVariants` | `'default'` |
| `zShape` | Button shape | `ZardButtonShapeVariants` | `'default'` |
| `zLoading` | Shows the loading state and disables the button | `boolean` | `false` |
| `class` | Custom CSS classes | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/questionnaire)
