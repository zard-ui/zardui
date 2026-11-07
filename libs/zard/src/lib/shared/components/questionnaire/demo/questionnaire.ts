import { QUESTIONNAIRE_DEMO_ANIMATED_ITEMS } from '@generated/components/questionnaire/demo/animated-items';
import { QUESTIONNAIRE_DEMO_CARD } from '@generated/components/questionnaire/demo/card';
import { QUESTIONNAIRE_DEMO_CONDITIONAL_ITEMS } from '@generated/components/questionnaire/demo/conditional-items';
import { QUESTIONNAIRE_DEMO_CONTROLLED } from '@generated/components/questionnaire/demo/controlled';
import { QUESTIONNAIRE_DEMO_CUSTOM_PROGRESS } from '@generated/components/questionnaire/demo/custom-progress';
import { QUESTIONNAIRE_DEMO_CUSTOM_VALIDATION } from '@generated/components/questionnaire/demo/custom-validation';
import { QUESTIONNAIRE_DEMO_DEFAULT } from '@generated/components/questionnaire/demo/default';
import { QUESTIONNAIRE_DEMO_DIALOG } from '@generated/components/questionnaire/demo/dialog';
import { QUESTIONNAIRE_DEMO_EXPLICIT_SKIP } from '@generated/components/questionnaire/demo/explicit-skip';
import { QUESTIONNAIRE_DEMO_FREEFORM_ANSWER } from '@generated/components/questionnaire/demo/freeform-answer';
import { QUESTIONNAIRE_DEMO_MULTIPLE_SELECTION } from '@generated/components/questionnaire/demo/multiple-selection';
import { QUESTIONNAIRE_DEMO_NAVIGATION_STATE } from '@generated/components/questionnaire/demo/navigation-state';
import { QUESTIONNAIRE_DEMO_RESUME } from '@generated/components/questionnaire/demo/resume';
import { QUESTIONNAIRE_DEMO_SHORTCUTS } from '@generated/components/questionnaire/demo/shortcuts';
import { QUESTIONNAIRE_CLI_ADD } from '@generated/installation/cli/add-questionnaire';
import { QUESTIONNAIRE_MANUAL_CODE } from '@generated/installation/manual/questionnaire';
import {
  QUESTIONNAIRE_USAGE_ADDITIONAL,
  QUESTIONNAIRE_USAGE_CODE,
  QUESTIONNAIRE_USAGE_DESCRIPTION,
  QUESTIONNAIRE_USAGE_IMPORT,
} from '@generated/usage/questionnaire';
import type { CodeBlockData } from '@highlight/types';

import { ZardDemoQuestionnaireAnimatedItemsComponent } from './animated-items';
import { ZardDemoQuestionnaireCardComponent } from './card';
import { ZardDemoQuestionnaireConditionalItemsComponent } from './conditional-items';
import { ZardDemoQuestionnaireControlledComponent } from './controlled';
import { ZardDemoQuestionnaireCustomProgressComponent } from './custom-progress';
import { ZardDemoQuestionnaireCustomValidationComponent } from './custom-validation';
import { ZardDemoQuestionnaireDefaultComponent } from './default';
import { ZardDemoQuestionnaireDialogComponent } from './dialog';
import { ZardDemoQuestionnaireExplicitSkipComponent } from './explicit-skip';
import { ZardDemoQuestionnaireFreeformAnswerComponent } from './freeform-answer';
import { ZardDemoQuestionnaireMultipleSelectionComponent } from './multiple-selection';
import { ZardDemoQuestionnaireNavigationStateComponent } from './navigation-state';
import { ZardDemoQuestionnaireResumeComponent } from './resume';
import { ZardDemoQuestionnaireShortcutsComponent } from './shortcuts';
import { QUESTIONNAIRE_API } from '../doc/api';

const QUESTIONNAIRE_COMPOSITION_CODE = `z-questionnaire
└── z-questionnaire-progress
└── z-questionnaire-item
│   ├── z-questionnaire-title
│   ├── z-questionnaire-description
│   ├── z-questionnaire-choices
│   │   ├── z-questionnaire-choice
│   │   └── z-questionnaire-input
│   └── z-questionnaire-error
└── z-questionnaire-actions
    ├── z-questionnaire-previous
    ├── z-questionnaire-skip
    ├── z-questionnaire-next
    └── z-questionnaire-submit`;

const QUESTIONNAIRE_COMPOSITION: CodeBlockData = {
  html: `<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code>${QUESTIONNAIRE_COMPOSITION_CODE.split(
    '\n',
  )
    .map(line => `<span class="line">${escapeCompositionHtml(line)}</span>`)
    .join('\n')}</code></pre>`,
  code: QUESTIONNAIRE_COMPOSITION_CODE,
  language: 'text',
  showLineNumbers: false,
  copyButton: true,
  expandable: false,
};

export const QUESTIONNAIRE = {
  componentName: 'questionnaire',
  componentType: 'questionnaire',
  description: 'A multi-step questionnaire with single-choice, multiple-choice, freeform, and skippable questions.',
  accessibility: [
    'Each `z-questionnaire-item` renders a fieldset. Fixed choices use native, labelled radio or checkbox inputs, while progress exposes progressbar values and navigation uses native buttons. Inactive items and unavailable actions are hidden.',
    'After successful navigation, focus moves to the first enabled input in the active item. Failed validation marks the item invalid, reveals its alert, and focuses the first enabled input.',
    'Always give `z-questionnaire-input` an accessible name with `aria-label` or by wrapping it in a visible label. A placeholder is not a label. Description and visible error content are automatically associated with the item fieldset and built-in answer controls; custom projected controls can reference the generated description and error ids when needed.',
  ],
  api: QUESTIONNAIRE_API,
  installData: {
    cliAdd: QUESTIONNAIRE_CLI_ADD,
    manualCode: QUESTIONNAIRE_MANUAL_CODE,
  },
  composition: QUESTIONNAIRE_COMPOSITION,
  preview: {
    name: 'preview',
    component: ZardDemoQuestionnaireDefaultComponent,
    codeData: QUESTIONNAIRE_DEMO_DEFAULT,
  },
  usage: {
    importBlock: QUESTIONNAIRE_USAGE_IMPORT,
    codeBlock: QUESTIONNAIRE_USAGE_CODE,
    description: QUESTIONNAIRE_USAGE_DESCRIPTION,
    additionalBlocks: QUESTIONNAIRE_USAGE_ADDITIONAL,
  },
  examples: [
    {
      name: 'multiple-selection',
      description: 'Use `zMultiple` (and `multiple` in `zItems`) for an item that accepts more than one fixed answer.',
      component: ZardDemoQuestionnaireMultipleSelectionComponent,
      codeData: QUESTIONNAIRE_DEMO_MULTIPLE_SELECTION,
    },
    {
      name: 'freeform-answer',
      description: 'Compose `z-questionnaire-input` with fixed choices when the user can provide another answer.',
      component: ZardDemoQuestionnaireFreeformAnswerComponent,
      codeData: QUESTIONNAIRE_DEMO_FREEFORM_ANSWER,
    },
    {
      name: 'explicit-skip',
      description: 'Add `z-questionnaire-skip` when an optional item may be intentionally left unanswered.',
      component: ZardDemoQuestionnaireExplicitSkipComponent,
      codeData: QUESTIONNAIRE_DEMO_EXPLICIT_SKIP,
    },
    {
      name: 'shortcuts',
      description: 'Assign a letter or number key to each answer with `zShortcuts`.',
      component: ZardDemoQuestionnaireShortcutsComponent,
      codeData: QUESTIONNAIRE_DEMO_SHORTCUTS,
    },
    {
      name: 'custom-validation',
      description:
        'Combine controlled navigation with an external schema such as Zod to return to an invalid item and present its error.',
      component: ZardDemoQuestionnaireCustomValidationComponent,
      codeData: QUESTIONNAIRE_DEMO_CUSTOM_VALIDATION,
    },
    {
      name: 'controlled',
      description: 'Control the active item from host state, such as returning to an invalid step.',
      component: ZardDemoQuestionnaireControlledComponent,
      codeData: QUESTIONNAIRE_DEMO_CONTROLLED,
    },

    {
      name: 'resume',
      description: 'Restore a saved active item and default answers, then reset changes back to that saved state.',
      component: ZardDemoQuestionnaireResumeComponent,
      codeData: QUESTIONNAIRE_DEMO_RESUME,
    },
    {
      name: 'conditional-items',
      description: "Disable items that do not apply to the user's earlier answers.",
      component: ZardDemoQuestionnaireConditionalItemsComponent,
      codeData: QUESTIONNAIRE_DEMO_CONDITIONAL_ITEMS,
    },
    {
      name: 'navigation-state',
      description: 'Use the active item status to disable navigation until the current question has an answer.',
      component: ZardDemoQuestionnaireNavigationStateComponent,
      codeData: QUESTIONNAIRE_DEMO_NAVIGATION_STATE,
    },
    {
      name: 'custom-progress',
      description: 'Replace the default progress label with a custom step indicator.',
      component: ZardDemoQuestionnaireCustomProgressComponent,
      codeData: QUESTIONNAIRE_DEMO_CUSTOM_PROGRESS,
    },
    {
      name: 'animated-items',
      description: 'Animate the active item while keeping progress and navigation stationary.',
      component: ZardDemoQuestionnaireAnimatedItemsComponent,
      codeData: QUESTIONNAIRE_DEMO_ANIMATED_ITEMS,
    },
    {
      name: 'card',
      description: 'Compose `z-questionnaire` items, progress, and navigation inside a card.',
      component: ZardDemoQuestionnaireCardComponent,
      codeData: QUESTIONNAIRE_DEMO_CARD,
    },
    {
      name: 'dialog',
      description: 'Compose `z-questionnaire` inside a `z-dialog` while keeping cancellation and dismissal host-owned.',
      component: ZardDemoQuestionnaireDialogComponent,
      codeData: QUESTIONNAIRE_DEMO_DIALOG,
    },
  ],
};

function escapeCompositionHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
