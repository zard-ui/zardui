import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

const CLASS_PROP = {
  name: 'class',
  description: 'Custom CSS classes',
  type: 'ClassValue',
  default: "''",
};

const DISABLED_PROP = {
  name: 'disabled',
  description: 'Disables the button',
  type: 'boolean',
  default: 'false',
};

const DEFAULT_TYPE_PROP = {
  name: 'zType',
  description: 'Button visual style',
  type: 'ZardButtonTypeVariants',
  default: "'default'",
};

const OUTLINE_TYPE_PROP = {
  name: 'zType',
  description: 'Button visual style',
  type: 'ZardButtonTypeVariants',
  default: "'outline'",
};

const SIZE_PROP = {
  name: 'zSize',
  description: 'Button size',
  type: 'ZardButtonSizeVariants',
  default: "'default'",
};

const SHAPE_PROP = {
  name: 'zShape',
  description: 'Button shape',
  type: 'ZardButtonShapeVariants',
  default: "'default'",
};

const LOADING_PROP = {
  name: 'zLoading',
  description: 'Loading state; also disables the button',
  type: 'boolean',
  default: 'false',
};

export const QUESTIONNAIRE_API: ApiSection[] = [
  {
    selector: 'z-questionnaire',
    description: 'Multi-step questionnaire that works with Reactive Forms.',
    props: [
      {
        name: '[zItems]',
        description: 'Item settings by name; projected item inputs win',
        type: 'readonly ZardQuestionnaireItem[]',
        default: '[]',
      },
      {
        name: 'zActive',
        description: 'Two-way bindable active item name',
        type: 'string | undefined',
        default: 'undefined',
      },
      {
        name: 'zShortcuts',
        description: 'Keyboard shortcuts for the active choices',
        type: "'none' | 'letters' | 'numbers'",
        default: "'none'",
      },
      CLASS_PROP,
      {
        name: '(zSubmit)',
        description: 'Emits the answers once all items validate',
        type: 'EventEmitter<Record<string, string | string[]>>',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-questionnaire-progress',
    description: 'Current step as text and a progress bar.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-questionnaire-item',
    description: 'One step, rendered as a fieldset.',
    props: [
      { name: 'zName', description: 'Unique name and answer key', type: 'string', default: 'required' },
      { name: 'zRequired', description: 'Requires an answer. Overrides `zItems`', type: 'boolean', default: 'false' },
      {
        name: 'zMultiple',
        description: 'Allows multiple answers. Overrides `zItems`',
        type: 'boolean',
        default: 'false',
      },
      {
        name: 'zDisabled',
        description: 'Disables and skips the item. Overrides `zItems`',
        type: 'boolean',
        default: 'false',
      },
      { name: 'zInvalid', description: 'Marks the item invalid', type: 'boolean', default: 'false' },
      CLASS_PROP,
    ],
  },
  {
    selector: 'z-questionnaire-title',
    description: 'Item prompt, rendered as the legend.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-questionnaire-description',
    description: 'Supporting text wired to the item controls.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-questionnaire-choices',
    description: 'Container for choices and the freeform input.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-questionnaire-choice',
    description: 'One fixed answer with a native radio or checkbox.',
    props: [
      { name: 'zValue', description: 'Submitted value', type: 'string', default: 'required' },
      { name: 'checked', description: 'Initial checked state', type: 'boolean', default: 'false' },
      { name: 'zDisabled', description: 'Disables this choice', type: 'boolean', default: 'false' },
      CLASS_PROP,
    ],
  },
  {
    selector: 'z-questionnaire-choice-description',
    description: 'Muted text under a choice label.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-questionnaire-input',
    description: 'Freeform answer for the active item.',
    props: [
      { name: 'type', description: 'Native input type', type: 'string', default: "'text'" },
      { name: 'value', description: 'Initial value', type: 'string', default: "''" },
      { name: 'placeholder', description: 'Placeholder text', type: 'string', default: "''" },
      { name: 'aria-label', description: 'Accessible label', type: 'string | null', default: 'null' },
      { name: 'zDisabled', description: 'Disables the input', type: 'boolean', default: 'false' },
      CLASS_PROP,
    ],
  },
  {
    selector: 'z-questionnaire-error',
    description: 'Validation message for the item.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-questionnaire-actions',
    description: 'Row for the navigation buttons.',
    props: [CLASS_PROP],
  },
  {
    selector: 'button[z-questionnaire-previous]',
    description: 'Goes back; hidden when there is no previous item.',
    props: [DISABLED_PROP, OUTLINE_TYPE_PROP, SIZE_PROP, SHAPE_PROP, LOADING_PROP, CLASS_PROP],
  },
  {
    selector: 'button[z-questionnaire-skip]',
    description: 'Skips an optional item; hidden otherwise.',
    props: [DISABLED_PROP, OUTLINE_TYPE_PROP, SIZE_PROP, SHAPE_PROP, LOADING_PROP, CLASS_PROP],
  },
  {
    selector: 'button[z-questionnaire-next]',
    description: 'Validates and moves forward; hidden on the last item.',
    props: [DISABLED_PROP, DEFAULT_TYPE_PROP, SIZE_PROP, SHAPE_PROP, LOADING_PROP, CLASS_PROP],
  },
  {
    selector: 'button[z-questionnaire-submit]',
    description: 'Submits; shown only on the last item.',
    props: [DISABLED_PROP, DEFAULT_TYPE_PROP, SIZE_PROP, SHAPE_PROP, LOADING_PROP, CLASS_PROP],
  },
];
