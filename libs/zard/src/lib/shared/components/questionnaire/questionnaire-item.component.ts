import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardIdDirective } from '@/shared/core/directives/id.directive';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardQuestionnaireComponent } from './questionnaire.component';
import { questionnaireItemVariants } from './questionnaire.variants';

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
  hostDirectives: [ZardIdDirective],
  exportAs: 'zQuestionnaireItem',
})
export class ZardQuestionnaireItemComponent {
  private readonly questionnaire = inject(ZardQuestionnaireComponent);
  private readonly uniqueId = inject(ZardIdDirective);

  readonly zName = input.required<string>();
  readonly zRequired = input(false, { transform: booleanAttribute });
  readonly zMultiple = input(false, { transform: booleanAttribute });
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zInvalid = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  readonly descriptionPresent = signal(false);
  readonly errorPresent = signal(false);
  readonly descriptionId = computed(() => `${this.uniqueId.id()}-description`);
  readonly errorId = computed(() => `${this.uniqueId.id()}-error`);
  readonly isDisabled = computed(() => this.zDisabled() || this.questionnaire.disabled());
  // A disabled questionnaire keeps its active item visible (as a disabled fieldset); only an item that is
  // itself disabled leaves the flow.
  readonly isActive = computed(() => this.questionnaire.zActive() === this.zName() && !this.zDisabled());
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

  protected readonly classes = computed(() => mergeClasses(questionnaireItemVariants(), this.class()));
}
