export default {
  displayName: 'zard',
  preset: '../../jest.preset.cjs',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/apps/zard',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  // The separator class keeps this working on Windows, where paths use backslashes
  // and `node_modules/` alone never matches — leaving ESM deps (shiki) untransformed.
  transformIgnorePatterns: ['node_modules[/\\\\](?!.*\\.mjs$)'],
  moduleNameMapper: {
    // The unified/remark/rehype toolchain ships ESM-only `.js`, which Jest cannot
    // parse without transforming its whole dependency tree. No test renders
    // markdown, so the services just need something constructible. See esm-stub.ts.
    '^(unified|remark-.*|rehype-.*|unist-util-.*|shiki)$': '<rootDir>/src/testing/esm-stub.ts',
  },
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
