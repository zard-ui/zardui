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
