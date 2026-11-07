import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const FIELD_API: ApiSection[] = [
  {
    selector: 'z-field',
    description: 'Wraps a label, control and help text; set `data-invalid` for errors.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zOrientation]',
        description: 'Layout; `responsive` follows the `z-field-group` container',
        type: "'vertical' | 'horizontal' | 'responsive'",
        default: "'vertical'",
      },
    ],
  },
  {
    selector: 'z-field-set',
    description: 'A `<fieldset>` that stacks fields.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-field-legend',
    description: 'Legend of a field set.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zVariant]', description: 'Legend size', type: "'legend' | 'label'", default: "'legend'" },
    ],
  },
  {
    selector: 'z-field-group',
    description: 'Stacks fields; container query parent for responsive fields.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-field-content',
    description: 'Wraps the title and description in horizontal layouts.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-field-label',
    description: 'Label for a control; prefer it on a `<label>`.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[for]', description: 'Id of the labelled control', type: 'string', default: '' },
    ],
  },
  {
    selector: 'z-field-title',
    description: 'Non-interactive field title.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-field-description',
    description: 'Helper text for a control.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-field-separator',
    description: 'Separator with optional centered content.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zContent]',
        description: 'Text or template on the line',
        type: 'string | TemplateRef<void>',
        default: "''",
      },
    ],
  },
  {
    selector: 'z-field-error',
    description: 'Validation messages from `[zErrors]` or projected content.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zErrors]',
        description: 'Errors to show; duplicates are removed',
        type: 'ReadonlyArray<{ message?: string } | undefined>',
        default: '[]',
      },
    ],
  },
];
