import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  type ElementRef,
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
  imports: [NgIcon],
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
  providers: [{ provide: ZARD_QUESTIONNAIRE_CHOICE, useExisting: forwardRef(() => ZardQuestionnaireChoiceComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideCheck })],
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
