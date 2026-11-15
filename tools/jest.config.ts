export default {
  displayName: 'generators',
  preset: '../jest.preset.cjs',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': '@swc/jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: '../coverage/tools',
};
