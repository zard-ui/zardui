export default {
  displayName: 'cli',
  preset: '../../jest.preset.cjs',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': '@swc/jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  // O código-fonte é ESM e importa com extensão `.js` (exigência do Node), mas
  // os arquivos em disco são `.ts`. Sem estes dois mapeamentos o Jest não acha
  // nem o alias `@cli/*` nem os relativos, e nenhuma suíte chega a rodar.
  moduleNameMapper: {
    '^@cli/(.*)\\.js$': '<rootDir>/src/$1',
    '^@cli/(.*)$': '<rootDir>/src/$1',
    '^@zardui/preset$': '<rootDir>/../preset/src/index.ts',
    '^@zardui/preset/(.*)$': '<rootDir>/../preset/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  coverageDirectory: '../../coverage/packages/cli',
};
