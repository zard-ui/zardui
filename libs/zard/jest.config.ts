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
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/lib/$1',
  },
};
