export default {
  displayName: 'cli',
  preset: '../../jest.preset.cjs',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': '@swc/jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  // The source is ESM and imports with a `.js` extension (Node requires it), but
  // the files on disk are `.ts`. Without these mappings Jest resolves neither the
  // `@cli/*` alias nor the relative imports, and no suite runs at all.
  moduleNameMapper: {
    '^@cli/(.*)\\.js$': '<rootDir>/src/$1',
    '^@cli/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  coverageDirectory: '../../coverage/packages/cli',
};
