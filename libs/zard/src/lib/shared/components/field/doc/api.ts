import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const FIELD_API: ApiSection[] = [
  {
    selector: 'z-field',
    description:
      'A field container that wraps a label, control and optional description / error, exposed as `role="group"`. Set the `data-invalid` attribute (e.g. `[attr.data-invalid]="control.invalid && control.touched"`) to switch the whole field into its destructive styling; pair it with `aria-invalid` on the control itself.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zOrientation]',
        description:
          'Layout direction of the field: vertical stacks, horizontal aligns label and control in a row, responsive stacks until the parent `z-field-group` container query crosses its `@md` breakpoint.',
        type: "'vertical' | 'horizontal' | 'responsive'",
        default: "'vertical'",
      },
    ],
  },
  {
    selector: 'z-field-set',
    description: 'A semantic <fieldset> wrapper that vertically stacks fields with consistent spacing.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-field-legend',
    description: 'Legend element for a field-set. Use the label variant when grouping inline controls.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zVariant]',
        description: 'Visual size of the legend',
        type: "'legend' | 'label'",
        default: "'legend'",
      },
    ],
  },
  {
    selector: 'z-field-group',
    description:
      'Group of fields with consistent vertical spacing. Acts as a container query parent for responsive fields.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-field-content',
    description: 'Wrapper for the textual portion of a field (title + description) when used in horizontal layouts.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-field-label',
    description: 'Label for a form control. Use on <label> for proper semantics, or as <z-field-label>.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[for]',
        description: "Associates the label with a form control by referencing the control's id.",
        type: 'string',
        default: '',
      },
    ],
  },
  {
    selector: 'z-field-title',
    description: 'Non-interactive title for a field (e.g. when wrapping a checkbox/radio along with description).',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-field-description',
    description: 'Helper text rendered below or beside a field control.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-field-separator',
    description: 'Horizontal separator with optional centered content.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zContent]',
        description: 'Optional text or template displayed above the separator line',
        type: 'string | TemplateRef<void>',
        default: "''",
      },
    ],
  },
  {
    selector: 'z-field-error',
    description:
      'Renders validation messages for a field, exposed as `role="alert"`. Pass the errors to show through `[zErrors]` — e.g. from a reactive form control\'s `errors` — or project static content when there is nothing to compute.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zErrors]',
        description:
          'Array of error objects with an optional `message` string. A single entry renders inline, multiple render as a bulleted list, and duplicate messages are removed. Falls back to projected content when the array is empty.',
        type: 'ReadonlyArray<{ message?: string } | undefined>',
        default: '[]',
      },
    ],
  },
];
