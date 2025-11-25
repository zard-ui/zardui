import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs}'],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.lib.json', 'tsconfig.spec.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@angular-eslint/component-selector': 'off',
      '@angular-eslint/directive-selector': 'off',
      '@angular-eslint/prefer-on-push-component-change-detection': ['warn'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-empty-function': ['warn'],
      '@typescript-eslint/explicit-member-accessibility': [
        'warn',
        {
          accessibility: 'no-public',
        },
      ],
      'arrow-body-style': ['warn', 'as-needed'],
      '@angular-eslint/prefer-host-metadata-property': 'warn',
      '@angular-eslint/no-uncalled-signals': ['error'],
      '@angular-eslint/prefer-inject': 'warn',
      '@angular-eslint/prefer-standalone': 'error',
      '@angular-eslint/no-async-lifecycle-method': 'error',
      '@angular-eslint/prefer-signals': 'warn',
      '@angular-eslint/consistent-component-styles': 'error',
      '@angular-eslint/sort-keys-in-type-decorator': 'error',
      '@angular-eslint/prefer-output-emitter-ref': 'warn', // should be error
      // remove following gradually
      '@angular-eslint/no-output-on-prefix': 'error',
      '@angular-eslint/no-input-rename': 'warn',
    },
  },
  {
    files: ['**/test-setup.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.spec.ts', '**/demo/**/*.ts'],
    rules: {
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
  {
    files: ['**/*.html'],
    rules: {
      '@angular-eslint/template/no-negated-async': 'error',
      '@angular-eslint/template/banana-in-box': 'error',
      '@angular-eslint/template/button-has-type': 'warn',
      '@angular-eslint/template/elements-content': 'warn',
      '@angular-eslint/template/table-scope': 'error',
      '@angular-eslint/template/prefer-self-closing-tags': 'warn',
      '@angular-eslint/template/prefer-at-else': 'warn',
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/prefer-static-string-properties': 'error',
      '@angular-eslint/template/prefer-at-empty': 'warn',
      '@angular-eslint/template/no-nested-tags': 'error',
      '@angular-eslint/template/prefer-ngsrc': 'warn',
      // ay11
      '@angular-eslint/template/label-has-associated-control': 'warn', // should be error
      '@angular-eslint/template/click-events-have-key-events': 'error',
      '@angular-eslint/template/elements-content': 'error',
      '@angular-eslint/template/no-autofocus': 'error',
      '@angular-eslint/template/no-distracting-elements': 'error',
      '@angular-eslint/template/table-scope': 'error',
      '@angular-eslint/template/valid-aria': 'error',
    },
  },
];
