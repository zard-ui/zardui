import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const FIELD_API: ApiSection[] = [
  {
    selector: 'z-field',
    description: 'A field container that wraps a label, control and optional description / error.',
    props: [
      {
        name: '[zOrientation]',
        description: 'Layout direction of the field',
        type: "'vertical' | 'horizontal' | 'responsive'",
        default: "'vertical'",
      },
    ],
  },
  {
    selector: 'z-field-set',
    description: 'A semantic <fieldset> wrapper that vertically stacks fields with consistent spacing.',
    props: [],
  },
  {
    selector: 'z-field-legend',
    description: 'Legend element for a field-set. Use the label variant when grouping inline controls.',
    props: [
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
    props: [],
  },
  {
    selector: 'z-field-content',
    description: 'Wrapper for the textual portion of a field (title + description) when used in horizontal layouts.',
    props: [],
  },
  {
    selector: 'z-field-label',
    description: 'Label for a form control. Use on <label> for proper semantics, or as <z-field-label>.',
    props: [],
  },
  {
    selector: 'z-field-title',
    description: 'Non-interactive title for a field (e.g. when wrapping a checkbox/radio along with description).',
    props: [],
  },
  {
    selector: 'z-field-description',
    description: 'Helper text rendered below or beside a field control.',
    props: [],
  },
  {
    selector: 'z-field-separator',
    description: 'Horizontal separator with optional centered content.',
    props: [
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
      'Renders a single error message or a list of errors. Falls back to projected content when no errors are provided.',
    props: [
      {
        name: '[zErrors]',
        description: 'Array of error objects with an optional `message` string. Duplicate messages are removed.',
        type: 'Array<{ message?: string }>',
        default: '[]',
      },
    ],
  },
];
