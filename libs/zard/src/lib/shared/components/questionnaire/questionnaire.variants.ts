import { cva, type VariantProps } from 'class-variance-authority';

export const questionnaireVariants = cva('cn-questionnaire flex w-full min-w-0 flex-col mx-auto max-w-md');

export const questionnaireProgressVariants = cva('cn-questionnaire-progress min-h-lh w-fit min-w-[14ch] tabular-nums');

export const questionnaireTitleVariants = cva('cn-questionnaire-title text-pretty');

export const questionnaireDescriptionVariants = cva('cn-questionnaire-description text-pretty');

export const questionnaireItemVariants = cva(
  'cn-questionnaire-item flex w-full min-w-0 flex-col border-0 p-0 outline-none [&[hidden]]:hidden',
);

export const questionnaireChoicesVariants = cva('cn-questionnaire-choices group/questionnaire-choices grid min-w-0');

export const questionnaireChoiceVariants = cva(
  'cn-questionnaire-choice group/questionnaire-choice relative flex min-h-11 cursor-pointer items-start text-start transition-colors outline-none select-none hover:bg-muted/50 data-invalid:border-destructive dark:bg-input/20 has-[input:checked]:border-primary/40 has-[input:checked]:bg-muted dark:has-[input:checked]:bg-muted data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
);

export const questionnaireChoiceControlVariants = cva('absolute inset-0 z-10 size-full cursor-pointer opacity-0');

export const questionnaireChoiceIndicatorVariants = cva(
  'cn-questionnaire-choice-indicator pointer-events-none relative flex shrink-0 translate-y-[calc(var(--spacing)*0.45)] items-center justify-center group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5 group-has-[input[type=radio]]/questionnaire-choice:rounded-full group-has-[input:checked]/questionnaire-choice:border-primary group-has-[input:checked]/questionnaire-choice:bg-primary group-has-[input:checked]/questionnaire-choice:text-primary-foreground dark:group-has-[input:checked]/questionnaire-choice:bg-primary',
);

export const questionnaireChoiceIndicatorDotVariants = cva(
  'hidden size-2 rounded-full bg-primary-foreground group-has-[input[type=radio]:checked]/questionnaire-choice:block',
);

export const questionnaireChoiceIndicatorCheckVariants = cva(
  'hidden size-3.5 group-has-[input[type=checkbox]:checked]/questionnaire-choice:block',
);

export const questionnaireInputVariants = cva(
  'cn-questionnaire-input min-h-11 w-full min-w-0 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 sm:min-h-0 dark:disabled:bg-input/80 selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground',
);

export const questionnaireChoiceLabelVariants = cva('flex min-w-0 flex-1 flex-col gap-0.5 leading-snug');

export const questionnaireChoiceDescriptionVariants = cva('block text-muted-foreground');

export const questionnaireChoiceShortcutVariants = cva(
  'cn-questionnaire-choice-shortcut pointer-events-none ms-auto inline-flex shrink-0 translate-y-[calc(var(--spacing)*0.45)] items-center justify-center border border-input bg-background leading-none text-muted-foreground group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5',
);

export const questionnaireInputWrapperVariants = cva('group/questionnaire-input relative block w-full min-w-0');

export const questionnaireErrorVariants = cva('cn-questionnaire-error mt-2 text-destructive');

export const questionnaireActionsVariants = cva(
  'cn-questionnaire-actions grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center sm:min-h-8',
);

export const questionnairePreviousVariants = cva(
  'col-start-1 row-start-1 min-h-11 justify-self-start sm:min-h-0 [&[hidden]]:hidden',
);

export const questionnaireSkipVariants = cva(
  'col-start-2 row-start-1 min-h-11 justify-self-end sm:min-h-0 [&[hidden]]:hidden',
);

export const questionnaireNextVariants = cva(
  'col-start-3 row-start-1 min-h-11 justify-self-end sm:min-h-0 [&[hidden]]:hidden',
);

export const questionnaireSubmitVariants = questionnaireNextVariants;

export type ZardQuestionnaireVariants = VariantProps<typeof questionnaireVariants>;
