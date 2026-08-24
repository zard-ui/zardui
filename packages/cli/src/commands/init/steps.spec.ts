/**
 * The step that teaches ng-packagr to publish the theme CSS.
 *
 * ng-packagr only bundles what the entry point reaches, so without this
 * declaration the token file exists in the library's repository and vanishes
 * from the package — and the components do not render in the app that installs it.
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

/** Runs only the ng-package.json step and returns the resulting file. */
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
   * A plain path preserves the source folder inside the package, and the consumer
   * would end up importing `<lib>/src/styles.css` — a `src/` that is a detail of
   * the library's repository, not something whoever installs it should know.
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

  // An Nx library only gets an ng-package.json when it is publishable; without
  // one there is no package to assemble, and the step warns instead of failing
  // the whole install.
  it('should not fail when the library has no ng-package.json', async () => {
    await expect(runAssetStep(null)).resolves.toBeNull();
  });
});
