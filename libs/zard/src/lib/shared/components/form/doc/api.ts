import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const FORM_API: ApiSection[] = [
  {
    selector: 'ZardFormFieldComponent',
    description: 'Container component that provides proper spacing and structure for form elements.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'ZardFormLabelComponent',
    description: 'Accessible label component with optional required indicator.',
    props: [
      { name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: 'zRequired', description: 'Shows required indicator (*)', type: 'boolean', default: 'false' },
    ],
  },
  {
    selector: 'ZardFormControlComponent',
    description: 'Wrapper component for form controls that provides proper positioning and styling context.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'ZardFormMessageComponent',
    description: 'Component for displaying helper text, validation messages, and other form-related information.',
    props: [
      { name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: 'zType',
        description: 'Message type affecting color',
        type: "'default' | 'error' | 'success' | 'warning'",
        default: "'default'",
      },
    ],
  },
];
