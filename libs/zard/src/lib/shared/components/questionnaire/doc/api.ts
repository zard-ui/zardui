import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

const CLASS_PROP = {
  name: 'class',
  description: 'Custom CSS classes',
  type: 'ClassValue',
  default: "''",
};

const DISABLED_PROP = {
  name: 'disabled',
  description: 'Disables the button in addition to its questionnaire-controlled disabled state',
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
  description: 'Shows the loading state and disables the button',
  type: 'boolean',
  default: 'false',
};

export const QUESTIONNAIRE_API: ApiSection[] = [
  {
    selector: 'z-questionnaire',
    description:
      'A multi-step questionnaire with single-choice, multiple-choice, freeform, and skippable questions. Implements ControlValueAccessor for Reactive Forms.',
    props: [
      {
        name: '[zItems]',
        description:
          'Optional item settings by name (required, multiple, disabled). They apply only where the matching z-questionnaire-item does not set the same input; the projected items define the order. Without projected items, this list defines the flow',
        type: 'readonly ZardQuestionnaireItem[]',
        default: '[]',
      },
      {
        name: 'zActive',
        description: 'Active item name; supports two-way binding with [(zActive)]',
        type: 'string | undefined',
        default: 'undefined',
      },
      {
        name: 'zShortcuts',
        description:
          'Assigns answer shortcuts to the enabled choices of the active item. Only the focused questionnaire reacts; with nothing focused, the last one interacted with does',
        type: "'none' | 'letters' | 'numbers'",
        default: "'none'",
      },
      CLASS_PROP,
      {
        name: '(zSubmit)',
        description: 'Emits the answers once every enabled item validates',
        type: 'EventEmitter<Record<string, string | string[]>>',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-questionnaire-progress',
    description: 'Displays the current question and total as text and an accessible progress bar.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-questionnaire-item',
    description: 'One questionnaire step rendered as a fieldset.',
    props: [
      {
        name: 'zName',
        description: 'Unique item name used for navigation and the submitted answer key',
        type: 'string',
        default: 'required',
      },
      {
        name: 'zRequired',
        description:
          'Requires an answer before navigation or submission can continue. Wins over the item in [zItems]; when unset, [zItems] decides',
        type: 'boolean',
        default: 'false',
      },
      {
        name: 'zMultiple',
        description:
          'Allows multiple fixed answers and submits a string array. Wins over the item in [zItems]; when unset, [zItems] decides',
        type: 'boolean',
        default: 'false',
      },
      {
        name: 'zDisabled',
        description:
          'Disables the item and excludes it from progress, navigation, validation, and submission. Wins over the item in [zItems]; when unset, [zItems] decides',
        type: 'boolean',
        default: 'false',
      },
      {
        name: 'zInvalid',
        description: 'Marks the item invalid from consumer-owned validation',
        type: 'boolean',
        default: 'false',
      },
      CLASS_PROP,
    ],
  },
  {
    selector: 'z-questionnaire-title',
    description: 'Item prompt rendered as the fieldset legend.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-questionnaire-description',
    description: 'Supporting text automatically wired to the item fieldset and built-in answer controls.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-questionnaire-choices',
    description: 'Layout container for fixed choices and the freeform input.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-questionnaire-choice',
    description: 'One fixed answer rendered as a label with a native radio or checkbox and an optional shortcut.',
    props: [
      {
        name: 'zValue',
        description: 'Value submitted when the choice is selected',
        type: 'string',
        default: 'required',
      },
      {
        name: 'checked',
        description: 'Initial checked state, including the state restored by a native form reset',
        type: 'boolean',
        default: 'false',
      },
      {
        name: 'zDisabled',
        description: 'Disables this choice',
        type: 'boolean',
        default: 'false',
      },
      CLASS_PROP,
    ],
  },
  {
    selector: 'z-questionnaire-choice-description',
    description: 'Secondary text under a choice label, rendered in muted color.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-questionnaire-input',
    description: 'Freeform answer for the active item.',
    props: [
      { name: 'type', description: 'Native input type', type: 'string', default: "'text'" },
      {
        name: 'value',
        description: 'Initial value, including the value restored by a native form reset',
        type: 'string',
        default: "''",
      },
      { name: 'placeholder', description: 'Placeholder text', type: 'string', default: "''" },
      {
        name: 'aria-label',
        description: 'Accessible label for the freeform input',
        type: 'string | null',
        default: 'null',
      },
      { name: 'zDisabled', description: 'Disables the freeform input', type: 'boolean', default: 'false' },
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
    description: 'Layout row for questionnaire navigation buttons.',
    props: [CLASS_PROP],
  },
  {
    selector: 'button[z-questionnaire-previous]',
    description: 'Moves to the previous item and hides itself when no previous item is available.',
    props: [DISABLED_PROP, OUTLINE_TYPE_PROP, SIZE_PROP, SHAPE_PROP, LOADING_PROP, CLASS_PROP],
  },
  {
    selector: 'button[z-questionnaire-skip]',
    description: 'Skips the active optional item and hides itself when the item cannot be skipped.',
    props: [DISABLED_PROP, OUTLINE_TYPE_PROP, SIZE_PROP, SHAPE_PROP, LOADING_PROP, CLASS_PROP],
  },
  {
    selector: 'button[z-questionnaire-next]',
    description: 'Validates the active item, moves forward, and hides itself on the final item.',
    props: [DISABLED_PROP, DEFAULT_TYPE_PROP, SIZE_PROP, SHAPE_PROP, LOADING_PROP, CLASS_PROP],
  },
  {
    selector: 'button[z-questionnaire-submit]',
    description: 'Submits the questionnaire and hides itself until the final item is active.',
    props: [DISABLED_PROP, DEFAULT_TYPE_PROP, SIZE_PROP, SHAPE_PROP, LOADING_PROP, CLASS_PROP],
  },
];
