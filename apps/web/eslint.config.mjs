import nx from '@nx/eslint-plugin';
import { globalIgnores } from 'eslint/config';

import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  globalIgnores(['**/generated/']),
  {
    files: ['**/*.ts'],
    rules: {
      // `element` and `attribute` both: like the library, some docs components are
      // meant to be applied to a native element (`button[z-color-card]`).
      '@angular-eslint/component-selector': [
        'error',
        {
          type: ['element', 'attribute'],
          prefix: 'z',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/component-class-suffix': [
        'error',
        {
          suffixes: ['Page', 'Component', 'Layout', 'Dialog'],
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
    },
  },
];
