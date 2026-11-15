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
