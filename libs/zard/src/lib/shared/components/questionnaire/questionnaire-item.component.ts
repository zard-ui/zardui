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
  providers: [{ provide: ZARD_QUESTIONNAIRE_ITEM, useExisting: forwardRef(() => ZardQuestionnaireItemComponent) }],
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
