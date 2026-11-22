export default {
  displayName: 'zard',
  testEnvironment: '@happy-dom/jest-environment',
  preset: '../../jest.preset.cjs',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/libs/zard',
  transform: {
    // Resolves the style markers (`cn-button`) into nova's classes before the Angular transformer runs.
    '^.+\\.(ts|mjs|js|html)$': [
      '<rootDir>/jest-style-transformer.cjs',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  // @tanstack ships ESM-only `.js` files, so they go through the transform like the `.mjs` bundles.
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$|@tanstack/))'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/lib/$1',
  },
};
