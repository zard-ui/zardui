/**
 * O passo que ensina o ng-packagr a publicar o CSS de tema.
 *
 * O ng-packagr só empacota o que o ponto de entrada alcança, então sem esta
 * declaração o arquivo de tokens existe no repositório da lib e some do pacote
 * — e os componentes não renderizam na aplicação que a instala.
 */

jest.mock('@antfu/ni', () => ({ detect: jest.fn() }));
jest.mock('@cli/utils/logger.js', () => ({
  logger: { warn: jest.fn(), error: jest.fn(), info: jest.fn(), debug: jest.fn() },
}));

import { buildConfig, type InitAnswers } from '@cli/commands/init/config-prompter.js';
import { buildInitSteps } from '@cli/commands/init/steps.js';
import type { ProjectInfo } from '@cli/utils/get-project-info.js';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

const projectInfo: ProjectInfo = {
  framework: 'angular',
  root: '/proj',
  workspace: 'angular',
  hasTypeScript: true,
  hasTailwind: false,
  hasNx: false,
  hasAnalog: false,
  tsconfigFile: 'tsconfig.json',
  angularVersion: '22.0.0',
  angularVersionRaw: '^22.0.0',
  projects: [],
};

const answers: InitAnswers = {
  kind: 'angular-library',
  projectRoot: 'projects/ui',
  appConfig: '',
  theme: 'neutral',
  globalCss: 'projects/ui/src/styles.css',
  componentsAlias: '@/shared/components',
  utilsAlias: '@/shared/utils',
};

/** Roda só o passo do ng-package.json e devolve o arquivo resultante. */
async function runAssetStep(ngPackage: unknown | null): Promise<{ assets?: unknown[] } | null> {
  const cwd = await mkdtemp(path.join(tmpdir(), 'zard-ng-package-'));
  const libraryRoot = path.join(cwd, 'projects', 'ui');
  const file = path.join(libraryRoot, 'ng-package.json');

  await mkdir(libraryRoot, { recursive: true });
  if (ngPackage !== null) await writeFile(file, JSON.stringify(ngPackage, null, 2), 'utf8');

  const config = buildConfig(answers, 'npm');
  const step = buildInitSteps(cwd, config, projectInfo, false).find(candidate => candidate.label === 'ng-package.json');

  await step?.run();

  if (ngPackage === null) return null;

  return JSON.parse(await readFile(file, 'utf8'));
}

describe('ng-package.json step', () => {
  const base = { lib: { entryFile: 'src/public-api.ts' } };

  /**
   * Um caminho simples preserva a pasta de origem no pacote, e o consumidor
   * acabaria importando `<lib>/src/styles.css` — um `src/` que é detalhe do
   * repositório da lib, não algo que quem a instala deva conhecer.
   */
  it('should publish the theme at the package root', async () => {
    const result = await runAssetStep(base);

    expect(result?.assets).toEqual([{ glob: 'styles.css', input: 'src', output: '/' }]);
  });

  it('should keep assets the library already declared', async () => {
    const result = await runAssetStep({ ...base, assets: ['./src/assets/logo.svg'] });

    expect(result?.assets).toEqual(['./src/assets/logo.svg', { glob: 'styles.css', input: 'src', output: '/' }]);
  });

  // Um init repetido publicaria o mesmo CSS duas vezes, em dois lugares.
  it('should replace an older entry for the same file instead of adding another', async () => {
    const result = await runAssetStep({ ...base, assets: ['./src/styles.css'] });

    expect(result?.assets).toEqual([{ glob: 'styles.css', input: 'src', output: '/' }]);
  });

  it('should be a no-op when the entry is already correct', async () => {
    const assets = [{ glob: 'styles.css', input: 'src', output: '/' }];
    const result = await runAssetStep({ ...base, assets });

    expect(result?.assets).toEqual(assets);
  });

  // Uma lib Nx só ganha ng-package.json quando é publicável; sem ele não há
  // pacote a montar, e o passo avisa em vez de falhar a instalação inteira.
  it('should not fail when the library has no ng-package.json', async () => {
    await expect(runAssetStep(null)).resolves.toBeNull();
  });
});
