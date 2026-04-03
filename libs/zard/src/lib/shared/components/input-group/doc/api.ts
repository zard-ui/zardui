import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const INPUT_GROUP_API: ApiSection[] = [
  {
    selector: 'z-input-group',
    description: 'Displays additional information or actions alongside an input or textarea.',
    props: [
      { name: 'class', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: 'zAddonAlign', description: 'Addon alignment', type: "'inline' | 'block'", default: 'inline' },
      { name: 'zAddonAfter', description: 'Addon after input', type: 'string | TemplateRef<void>', default: "''" },
      { name: 'zAddonBefore', description: 'Addon before input', type: 'string | TemplateRef<void>', default: "''" },
      { name: 'zDisabled', description: 'Disable the entire input group', type: 'boolean', default: 'false' },
      { name: 'zLoading', description: 'Loading state with spinner', type: 'boolean', default: 'false' },
      {
        name: 'zSize',
        description: 'Size of the input group and all its elements',
        type: "'sm' | 'default' | 'lg'",
        default: "'default'",
      },
    ],
  },
];
