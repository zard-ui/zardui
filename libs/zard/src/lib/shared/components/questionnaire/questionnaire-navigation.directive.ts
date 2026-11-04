import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import {
  buttonVariants,
  type ZardButtonShapeVariants,
  type ZardButtonSizeVariants,
  type ZardButtonTypeVariants,
} from '@/shared/components/button/button.variants';
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
    '[hidden]': '!questionnaire.canMoveBack()',
    '[disabled]': 'disabledState()',
    '[attr.aria-disabled]': 'disabledState() ? "true" : null',
    '[attr.aria-busy]': 'zLoading() ? "true" : null',
    '[attr.data-size]': 'zSize()',
    '[attr.data-variant]': 'zType()',
    '[class]': 'classes()',
    '(click)': 'moveBack()',
  },
  exportAs: 'zQuestionnairePrevious',
})
export class ZardQuestionnairePreviousDirective extends ZardButtonComponent {
  protected readonly questionnaire = inject(ZardQuestionnaireComponent);

  override readonly zDisabled = input(false, { alias: 'disabled', transform: booleanAttribute });
  override readonly zType = input<ZardButtonTypeVariants>('outline');
  override readonly zSize = input<ZardButtonSizeVariants>('default');
  override readonly zShape = input<ZardButtonShapeVariants>('default');
  override readonly zLoading = input(false, { transform: booleanAttribute });
  override readonly class = input<ClassValue>('');
  // These are always native buttons that own their disabled state. Turning this off keeps the inherited
  // ZardButtonComponent host bindings (attr.disabled, aria-disabled, role, tabindex) inert, so they cannot
  // overwrite the `[disabled]` binding below when `disabled` toggles while the action is still unavailable.
  protected override readonly isNotInsideOfButtonOrLink = computed(() => false);
  readonly disabledState = computed(
    () => this.zDisabled() || this.zLoading() || this.questionnaire.disabled() || !this.questionnaire.canMoveBack(),
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
      questionnairePreviousVariants(),
      this.class(),
    ),
  );

  protected moveBack(): void {
    if (!this.disabledState()) {
      this.questionnaire.previous();
    }
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
    '[hidden]': '!questionnaire.canSkip()',
    '[disabled]': 'disabledState()',
    '[attr.aria-disabled]': 'disabledState() ? "true" : null',
    '[attr.aria-busy]': 'zLoading() ? "true" : null',
    '[attr.data-size]': 'zSize()',
    '[attr.data-variant]': 'zType()',
    '[class]': 'classes()',
    '(click)': 'skip()',
  },
  exportAs: 'zQuestionnaireSkip',
})
export class ZardQuestionnaireSkipDirective extends ZardButtonComponent {
  protected readonly questionnaire = inject(ZardQuestionnaireComponent);

  override readonly zDisabled = input(false, { alias: 'disabled', transform: booleanAttribute });
  override readonly zType = input<ZardButtonTypeVariants>('outline');
  override readonly zSize = input<ZardButtonSizeVariants>('default');
  override readonly zShape = input<ZardButtonShapeVariants>('default');
  override readonly zLoading = input(false, { transform: booleanAttribute });
  override readonly class = input<ClassValue>('');
  // These are always native buttons that own their disabled state. Turning this off keeps the inherited
  // ZardButtonComponent host bindings (attr.disabled, aria-disabled, role, tabindex) inert, so they cannot
  // overwrite the `[disabled]` binding below when `disabled` toggles while the action is still unavailable.
  protected override readonly isNotInsideOfButtonOrLink = computed(() => false);
  readonly disabledState = computed(
    () => this.zDisabled() || this.zLoading() || this.questionnaire.disabled() || !this.questionnaire.canSkip(),
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
      questionnaireSkipVariants(),
      this.class(),
    ),
  );

  protected skip(): void {
    if (!this.disabledState()) {
      this.questionnaire.skip();
    }
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
    '[hidden]': '!questionnaire.canMoveNext()',
    '[disabled]': 'disabledState()',
    '[attr.aria-disabled]': 'disabledState() ? "true" : null',
    '[attr.aria-busy]': 'zLoading() ? "true" : null',
    '[attr.data-size]': 'zSize()',
    '[attr.data-variant]': 'zType()',
    '[class]': 'classes()',
    '(click)': 'moveNext()',
  },
  exportAs: 'zQuestionnaireNext',
})
export class ZardQuestionnaireNextDirective extends ZardButtonComponent {
  protected readonly questionnaire = inject(ZardQuestionnaireComponent);

  override readonly zDisabled = input(false, { alias: 'disabled', transform: booleanAttribute });
  override readonly zType = input<ZardButtonTypeVariants>('default');
  override readonly zSize = input<ZardButtonSizeVariants>('default');
  override readonly zShape = input<ZardButtonShapeVariants>('default');
  override readonly zLoading = input(false, { transform: booleanAttribute });
  override readonly class = input<ClassValue>('');
  // These are always native buttons that own their disabled state. Turning this off keeps the inherited
  // ZardButtonComponent host bindings (attr.disabled, aria-disabled, role, tabindex) inert, so they cannot
  // overwrite the `[disabled]` binding below when `disabled` toggles while the action is still unavailable.
  protected override readonly isNotInsideOfButtonOrLink = computed(() => false);
  readonly disabledState = computed(
    () => this.zDisabled() || this.zLoading() || this.questionnaire.disabled() || !this.questionnaire.canMoveNext(),
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
      questionnaireNextVariants(),
      this.class(),
    ),
  );

  protected moveNext(): void {
    if (!this.disabledState()) {
      this.questionnaire.next();
    }
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
    '[hidden]': '!questionnaire.canSubmit()',
    '[disabled]': 'disabledState()',
    '[attr.aria-disabled]': 'disabledState() ? "true" : null',
    '[attr.aria-busy]': 'zLoading() ? "true" : null',
    '[attr.data-size]': 'zSize()',
    '[attr.data-variant]': 'zType()',
    '[class]': 'classes()',
  },
  exportAs: 'zQuestionnaireSubmit',
})
export class ZardQuestionnaireSubmitDirective extends ZardButtonComponent {
  protected readonly questionnaire = inject(ZardQuestionnaireComponent);

  override readonly zDisabled = input(false, { alias: 'disabled', transform: booleanAttribute });
  override readonly zType = input<ZardButtonTypeVariants>('default');
  override readonly zSize = input<ZardButtonSizeVariants>('default');
  override readonly zShape = input<ZardButtonShapeVariants>('default');
  override readonly zLoading = input(false, { transform: booleanAttribute });
  override readonly class = input<ClassValue>('');
  // These are always native buttons that own their disabled state. Turning this off keeps the inherited
  // ZardButtonComponent host bindings (attr.disabled, aria-disabled, role, tabindex) inert, so they cannot
  // overwrite the `[disabled]` binding below when `disabled` toggles while the action is still unavailable.
  protected override readonly isNotInsideOfButtonOrLink = computed(() => false);
  readonly disabledState = computed(
    () => this.zDisabled() || this.zLoading() || this.questionnaire.disabled() || !this.questionnaire.canSubmit(),
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
      questionnaireSubmitVariants(),
      this.class(),
    ),
  );
}
