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

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardQuestionnaireItemComponent } from './questionnaire-item.component';
import { ZARD_QUESTIONNAIRE_CHOICE, type ZardQuestionnaireChoiceRef } from './questionnaire.tokens';
import {
  questionnaireChoiceControlVariants,
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
  protected readonly labelClasses = questionnaireChoiceLabelVariants();
  protected readonly shortcutClasses = questionnaireChoiceShortcutVariants();

  select(): void {
    this.control().nativeElement.click();
  }
}
