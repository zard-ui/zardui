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
