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
