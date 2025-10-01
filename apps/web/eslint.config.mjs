import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
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
      '@nx/enforce-module-boundaries': 'off',
    },
  },
  {
    files: ['**/demo/**/*.ts', '**/sections/**/*.ts', '**/public/**/*.ts'],
    rules: {
      '@angular-eslint/component-selector': 'off',
      '@angular-eslint/component-class-suffix': 'off',
      '@angular-eslint/prefer-inject': 'off',
    },
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
      'prettier/prettier': 'warn',
    },
  },
];
