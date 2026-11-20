import { cva, type VariantProps } from 'class-variance-authority';

// Structure lives here, the look in the `cn-*` markers (style sheets). shadcn/ui reads the choice state from
// `data-checked` / `data-type`; zard reads it from the native control (`has-[input:checked]`, `input[type=radio]`).

export const questionnaireVariants = cva('cn-questionnaire flex w-full min-w-0 flex-col mx-auto max-w-md');

export const questionnaireProgressVariants = cva(
  'cn-questionnaire-progress block min-h-lh w-fit min-w-[14ch] font-medium text-muted-foreground tabular-nums',
);

export const questionnaireTitleVariants = cva('cn-questionnaire-title cn-font-heading text-pretty');

export const questionnaireDescriptionVariants = cva('cn-questionnaire-description text-pretty text-muted-foreground');

export const questionnaireItemVariants = cva(
  'cn-questionnaire-item flex w-full min-w-0 flex-col border-0 p-0 outline-none [&[hidden]]:hidden',
);

export const questionnaireChoicesVariants = cva('cn-questionnaire-choices group/questionnaire-choices grid min-w-0');

export const questionnaireChoiceVariants = cva(
  'cn-questionnaire-choice group/questionnaire-choice relative flex min-h-11 cursor-pointer items-start text-start transition-colors outline-none select-none data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
);

export const questionnaireChoiceControlVariants = cva('absolute inset-0 z-10 size-full cursor-pointer opacity-0');

export const questionnaireChoiceIndicatorVariants = cva(
  'cn-questionnaire-choice-indicator pointer-events-none relative flex shrink-0 items-center justify-center border group-has-[input[type=radio]]/questionnaire-choice:rounded-full',
);

export const questionnaireChoiceIndicatorDotVariants = cva(
  'cn-questionnaire-choice-indicator-dot hidden rounded-full group-has-[input[type=checkbox]]/questionnaire-choice:hidden group-has-[input:checked]/questionnaire-choice:block',
);

export const questionnaireChoiceIndicatorCheckVariants = cva(
  'cn-questionnaire-choice-indicator-check hidden group-has-[input[type=radio]]/questionnaire-choice:hidden group-has-[input:checked]/questionnaire-choice:block',
);

export const questionnaireInputVariants = cva(
  'cn-questionnaire-input min-h-11 w-full min-w-0 transition-[color,box-shadow,background-color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0 selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground',
);

export const questionnaireChoiceLabelVariants = cva(
  'cn-questionnaire-choice-content flex min-w-0 flex-1 flex-col leading-snug',
);

export const questionnaireChoiceDescriptionVariants = cva('cn-questionnaire-choice-description block');

export const questionnaireChoiceShortcutVariants = cva(
  'cn-questionnaire-choice-shortcut pointer-events-none ms-auto inline-flex shrink-0',
);

export const questionnaireInputWrapperVariants = cva(
  'cn-questionnaire-input-wrapper group/questionnaire-input relative block min-w-0',
);

export const questionnaireErrorVariants = cva('cn-questionnaire-error text-destructive');

export const questionnaireActionsVariants = cva(
  'cn-questionnaire-actions grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center',
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
