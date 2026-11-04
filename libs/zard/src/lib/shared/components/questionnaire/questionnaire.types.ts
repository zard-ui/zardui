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
