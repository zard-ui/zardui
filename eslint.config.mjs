import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import eslintPluginImport from 'eslint-plugin-import';
import nx from '@nx/eslint-plugin';
import stylistic from '@stylistic/eslint-plugin';

export default [
  stylistic.configs.recommended,
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  eslintPluginPrettierRecommended,
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      import: eslintPluginImport,
      'unused-imports': eslintPluginUnusedImports,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.base.json',
        },
      },
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        'warn',
        {
          enforceBuildableLibDependency: true,
          allow: [
            String.raw`^.*/eslint(\.base)?\.config\.[cm]?js$`,
            '^@doc/domain/.*$',
            '^@doc/env/.*$',
            '^@doc/shared/.*$',
            '^@doc/widget/.*$',
            '^@cli/.*$',
            '^@zard/.*$',
          ],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      // Remove unused imports
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      // Import ordering and organization
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: '@angular/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@doc/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@zard/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    // Override or add rules here
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/max-len': [
        'error',
        { code: 120, ignoreStrings: true, ignoreUrls: true, ignoreTemplateLiterals: true },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.html'],
    // Override or add rules here
    rules: { '@stylistic/spaced-comment': 'off' },
  },
  {
    files: ['libs/zard/**/demo/**/*.ts'],
    rules: {
      '@nx/enforce-module-boundaries': 'off',
    },
  },
];
