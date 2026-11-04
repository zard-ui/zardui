import { cva, type VariantProps } from 'class-variance-authority';

export const questionnaireVariants = cva('flex w-full min-w-0 flex-col gap-4 mx-auto max-w-md');

export const questionnaireProgressVariants = cva(
  'min-h-lh w-fit min-w-[14ch] text-xs font-medium text-muted-foreground tabular-nums',
);

export const questionnaireTitleVariants = cva(
  'text-base/snug font-medium text-pretty [&:has(~[data-slot=questionnaire-description])]:-mb-4',
);

export const questionnaireDescriptionVariants = cva('text-sm text-pretty text-muted-foreground');

export const questionnaireItemVariants = cva(
  'flex w-full min-w-0 flex-col gap-4 border-0 p-0 outline-none [&[hidden]]:hidden',
);

export const questionnaireChoicesVariants = cva('group/questionnaire-choices grid min-w-0 gap-2');

export const questionnaireChoiceVariants = cva(
  'group/questionnaire-choice relative flex min-h-11 cursor-pointer items-start gap-2.5 rounded-lg border border-input bg-transparent px-3 py-2.5 text-start text-sm transition-colors outline-none select-none hover:bg-muted/50 has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/50 data-invalid:border-destructive dark:bg-input/20 has-[input:checked]:border-primary/40 has-[input:checked]:bg-muted dark:has-[input:checked]:bg-muted data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
);

export const questionnaireChoiceControlVariants = cva('absolute inset-0 z-10 size-full cursor-pointer opacity-0');

export const questionnaireChoiceIndicatorVariants = cva(
  'pointer-events-none relative flex size-4 shrink-0 translate-y-[calc(var(--spacing)*0.45)] items-center justify-center rounded-[4px] border border-input group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5 group-has-[input[type=radio]]/questionnaire-choice:rounded-full group-has-[input:checked]/questionnaire-choice:border-primary group-has-[input:checked]/questionnaire-choice:bg-primary group-has-[input:checked]/questionnaire-choice:text-primary-foreground dark:bg-input/30 dark:group-has-[input:checked]/questionnaire-choice:bg-primary',
);

export const questionnaireChoiceIndicatorDotVariants = cva(
  'hidden size-2 rounded-full bg-primary-foreground group-has-[input[type=radio]:checked]/questionnaire-choice:block',
);

export const questionnaireChoiceIndicatorCheckVariants = cva(
  'hidden size-3.5 group-has-[input[type=checkbox]:checked]/questionnaire-choice:block',
);

export const questionnaireInputVariants = cva(
  'h-8 min-h-11 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 sm:min-h-0 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground',
);

export const questionnaireChoiceLabelVariants = cva('flex min-w-0 flex-1 flex-col gap-0.5 leading-snug');

export const questionnaireChoiceDescriptionVariants = cva('block text-muted-foreground');

export const questionnaireChoiceShortcutVariants = cva(
  'pointer-events-none ms-auto inline-flex size-5 shrink-0 translate-y-[calc(var(--spacing)*0.45)] items-center justify-center rounded-md border border-input bg-background font-mono text-[0.625rem] leading-none font-medium text-muted-foreground group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5',
);

export const questionnaireInputWrapperVariants = cva('group/questionnaire-input relative block w-full min-w-0');

export const questionnaireErrorVariants = cva('mt-2 text-sm text-destructive');

export const questionnaireActionsVariants = cva(
  'grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 sm:min-h-8',
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
