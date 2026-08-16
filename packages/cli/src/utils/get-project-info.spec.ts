/**
 * A leitura do workspace — o que a CLI consegue saber antes de perguntar.
 *
 * O Nx não tem `angular.json`: cada projeto se descreve no próprio
 * `project.json`, e nem tudo que está lá é um alvo válido para os componentes.
 */

import { getProjectInfo } from '@cli/utils/get-project-info.js';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

async function workspace(files: Record<string, unknown>): Promise<string> {
  const cwd = await mkdtemp(path.join(tmpdir(), 'zard-workspace-'));

  for (const [relative, content] of Object.entries(files)) {
    const file = path.join(cwd, relative);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, typeof content === 'string' ? content : JSON.stringify(content), 'utf8');
  }

  return cwd;
}

const nxPackageJson = {
  name: 'workspace',
  dependencies: { '@angular/core': '^22.0.0' },
  devDependencies: { nx: '23.1.0', typescript: '~6.0.0' },
};

describe('getProjectInfo em workspaces Nx', () => {
  /**
   * O gerador do Nx cria `<app>-e2e` declarando `projectType: "application"`.
   * Ele aparecia na lista de apps que podem receber os componentes, mas ali não
   * há `app.config.ts`, CSS global nem build para configurar.
   */
  it('should leave e2e projects out of the workspace', async () => {
    const cwd = await workspace({
      'package.json': nxPackageJson,
      'nx.json': {},
      'apps/web/project.json': { name: 'web', projectType: 'application', targets: { serve: {} } },
      'apps/web-e2e/project.json': { name: 'web-e2e', projectType: 'application', targets: {} },
    });

    const info = await getProjectInfo(cwd);

    expect(info.projects.map(project => project.name)).toEqual(['web']);
  });

  // Renomear o projeto não muda o que ele é; a config do runner denuncia.
  it('should recognise an e2e project by its runner config, not only by name', async () => {
    const cwd = await workspace({
      'package.json': nxPackageJson,
      'nx.json': {},
      'apps/web/project.json': { name: 'web', projectType: 'application', targets: { serve: {} } },
      'apps/smoke/project.json': { name: 'smoke', projectType: 'application', targets: {} },
      'apps/smoke/playwright.config.ts': 'export default {};',
    });

    const info = await getProjectInfo(cwd);

    expect(info.projects.map(project => project.name)).toEqual(['web']);
  });

  it('should read apps and libraries with their build settings', async () => {
    const cwd = await workspace({
      'package.json': nxPackageJson,
      'nx.json': {},
      'apps/web/project.json': {
        name: 'web',
        projectType: 'application',
        sourceRoot: 'apps/web/src',
        targets: {
          build: { executor: '@angular/build:application', options: { styles: ['apps/web/src/styles.css'] } },
        },
      },
      'libs/ui/project.json': { name: 'ui', projectType: 'library', sourceRoot: 'libs/ui/src' },
    });

    const info = await getProjectInfo(cwd);

    expect(info.workspace).toBe('nx');
    expect(info.projects).toEqual([
      expect.objectContaining({ name: 'web', projectType: 'application', styles: ['apps/web/src/styles.css'] }),
      expect.objectContaining({ name: 'ui', projectType: 'library', root: 'libs/ui' }),
    ]);
  });

  // O tsconfig.json da raiz de um workspace Nx não é herdado por projeto nenhum.
  it('should point at tsconfig.base.json when the workspace has one', async () => {
    const cwd = await workspace({
      'package.json': nxPackageJson,
      'nx.json': {},
      'tsconfig.base.json': { compilerOptions: {} },
    });

    expect((await getProjectInfo(cwd)).tsconfigFile).toBe('tsconfig.base.json');
  });
});

describe('getProjectInfo em workspaces Angular', () => {
  it('should read the projects declared in angular.json', async () => {
    const cwd = await workspace({
      'package.json': { name: 'app', dependencies: { '@angular/core': '^22.0.0' } },
      'angular.json': {
        projects: {
          'my-app': { projectType: 'application', root: '', sourceRoot: 'src' },
          ui: { projectType: 'library', root: 'projects/ui', sourceRoot: 'projects/ui/src' },
        },
      },
    });

    const info = await getProjectInfo(cwd);

    expect(info.workspace).toBe('angular');
    expect(info.projects.map(project => project.name)).toEqual(['my-app', 'ui']);
    expect(info.tsconfigFile).toBe('tsconfig.json');
  });

  // Analog troca o builder do Angular pelo dele; é assim que se anuncia.
  it('should spot an Analog project by its builder', async () => {
    const cwd = await workspace({
      'package.json': {
        name: 'app',
        dependencies: { '@angular/core': '^22.0.0', '@analogjs/platform': '^2.0.0' },
      },
      'angular.json': {
        projects: {
          'my-app': {
            projectType: 'application',
            root: '.',
            sourceRoot: 'src',
            architect: { build: { builder: '@analogjs/platform:vite' } },
          },
        },
      },
    });

    const info = await getProjectInfo(cwd);

    expect(info.hasAnalog).toBe(true);
    expect(info.projects[0]?.flavor).toBe('analog');
    // `root: "."` vira raiz vazia, como num app único.
    expect(info.projects[0]?.root).toBe('');
  });
});
