export default {
  displayName: 'preset',
  preset: '../../jest.preset.cjs',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': '@swc/jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  // Os imports carregam a extensão `.js` — o Node ESM exige, e o bundler do site
  // resolve `.js` para `.ts` quando quem importa é TypeScript. O que está em
  // disco é `.ts`; sem este mapeamento nenhuma suíte chega a rodar.
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  coverageDirectory: '../../coverage/packages/preset',
};
