import { installComponent } from '@cli/commands/add/component-installer.js';
import { installDependencies } from '@cli/commands/init/dependencies.js';
import { bundlerFor, isLibraryKind, projectRootOf, tsconfigFileFor } from '@cli/commands/init/project-kind.js';
import { applyThemeToStyles, createPostCssConfig } from '@cli/commands/init/tailwind-setup.js';
import { updateTsConfig } from '@cli/commands/init/tsconfig-updater.js';
import { updateAngularConfig } from '@cli/commands/init/update-angular-config.js';
import { setupVitePlugin } from '@cli/commands/init/vite-setup.js';
import { resolveConfigPaths, type Config } from '@cli/utils/config.js';
import { type ProjectInfo } from '@cli/utils/get-project-info.js';
import { logger } from '@cli/utils/logger.js';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import * as path from 'node:path';

/**
 * Uma etapa da inicialização: o rótulo que a UI mostra e o trabalho que ela faz.
 *
 * A lista é montada uma vez e consumida tanto pelo wizard quanto pelo caminho
 * headless, para que os dois executem exatamente a mesma sequência — a UI só
 * decide como apresentá-la.
 */
export interface InitStep {
  readonly label: string;
  readonly note: string;
  run(): Promise<void>;
}

export function buildInitSteps(
  cwd: string,
  config: Config,
  projectInfo: ProjectInfo,
  isReInitializing: boolean,
): InitStep[] {
  const kind = config.projectType;
  const isLibrary = isLibraryKind(kind);
  const projectRoot = projectRootOf(config.baseUrl);
  const tsconfigFile = tsconfigFileFor(kind, projectInfo);

  const steps: InitStep[] = [
    {
      label: 'components.json',
      note: 'component & utils aliases',
      run: async () => {
        await writeFile(path.resolve(cwd, 'components.json'), JSON.stringify(config, null, 2), 'utf8');
      },
    },
    {
      label: 'dependencies',
      note: 'CDK, CVA, tailwind-merge, ng-icons',
      run: () => installDependencies(cwd, config, projectInfo),
    },
  ];

  // Providers de aplicação não são da biblioteca: quem os registra é o app que
  // a consome, e numa lib não existe app.config.ts para escrever.
  if (!isLibrary) {
    steps.push({
      label: config.appConfigFile,
      note: 'ZardUI providers',
      run: () => updateAngularConfig(cwd, config),
    });

    steps.push(tailwindPipelineStep(cwd, projectRoot, kind, projectInfo, isReInitializing));
  }

  steps.push({
    label: config.tailwind.css,
    note: `theme tokens (${config.tailwind.baseColor})`,
    run: () => applyThemeToStyles(cwd, config),
  });

  if (isLibrary) {
    steps.push({
      label: 'ng-package.json',
      note: 'ship the theme with the library',
      run: () => registerStylesAsset(cwd, config),
    });
  }

  steps.push(
    {
      label: tsconfigFile,
      note: 'import path aliases',
      run: () => updateTsConfig(cwd, config, tsconfigFile),
    },
    {
      label: 'core & utils',
      note: 'shared helpers used by every component',
      run: () => installCoreDependencies(cwd, config),
    },
  );

  return steps;
}

/**
 * Como o Tailwind entra no build da aplicação.
 *
 * No Analog quem compila é o Vite, e o Tailwind é um plugin dele — um
 * `.postcssrc.json` ali não seria lido por ninguém. Nos demais o build do
 * Angular carrega o PostCSS, e o arquivo vai para a raiz do projeto: num
 * workspace com vários apps, escrevê-lo na raiz do repositório configuraria
 * todos eles de uma vez.
 */
function tailwindPipelineStep(
  cwd: string,
  projectRoot: string,
  kind: Config['projectType'],
  projectInfo: ProjectInfo,
  isReInitializing: boolean,
): InitStep {
  if (bundlerFor(kind) === 'vite') {
    return {
      label: 'vite.config.ts',
      note: 'Tailwind Vite plugin',
      run: () => setupVitePlugin(cwd),
    };
  }

  const relative = projectRoot === '.' ? '.postcssrc.json' : `${projectRoot}/.postcssrc.json`;

  return {
    label: relative,
    note: 'Tailwind PostCSS plugin',
    // Reinicializar reescreve o arquivo de propósito: é a chance de corrigir um
    // `.postcssrc.json` que ficou de uma configuração anterior.
    run: () =>
      !projectInfo.hasTailwind || isReInitializing || !existsSync(path.resolve(cwd, relative))
        ? createPostCssConfig(cwd, projectRoot)
        : Promise.resolve(),
  };
}

/**
 * Declara o CSS de tema como asset da biblioteca.
 *
 * O ng-packagr só publica o que o ponto de entrada alcança; um `.css` solto em
 * `src/` fica de fora do pacote. Sem esta entrada, o arquivo que a etapa
 * anterior escreveu existiria só no repositório e nunca chegaria a quem
 * instala a lib.
 *
 * O asset é declarado com `output: '/'` para cair na raiz do pacote. Listá-lo
 * como caminho simples preserva a pasta de origem, e o consumidor acabaria
 * importando `<lib>/src/styles.css` — um `src/` que é detalhe do repositório da
 * lib, não algo que quem a instala deva conhecer.
 */
async function registerStylesAsset(cwd: string, config: Config): Promise<void> {
  const libraryRoot = path.resolve(cwd, projectRootOf(config.baseUrl));
  const ngPackagePath = path.join(libraryRoot, 'ng-package.json');

  if (!existsSync(ngPackagePath)) {
    // Uma lib Nx só ganha ng-package.json quando é publicável; nas demais não
    // há pacote a montar, e o CSS é consumido direto do código-fonte.
    logger.warn(`ng-package.json not found in ${path.relative(cwd, libraryRoot)}; skipping the theme asset.`);
    return;
  }

  const relative = path.relative(libraryRoot, path.resolve(cwd, config.tailwind.css)).split(path.sep).join('/');
  const input = path.posix.dirname(relative);
  const glob = path.posix.basename(relative);
  const entry = { glob, input, output: '/' };

  const ngPackage = JSON.parse(await readFile(ngPackagePath, 'utf8'));
  const assets: unknown[] = Array.isArray(ngPackage.assets) ? ngPackage.assets : [];

  // Entradas antigas apontando para o mesmo arquivo são substituídas, e não
  // acumuladas: um init repetido publicaria o CSS duas vezes, em dois lugares.
  const others = assets.filter(asset => !describesSameFile(asset, relative, entry));
  const alreadyCorrect = assets.length === others.length + 1 && hasEntry(assets, entry);

  if (alreadyCorrect) return;

  ngPackage.assets = [...others, entry];
  await writeFile(ngPackagePath, `${JSON.stringify(ngPackage, null, 2)}\n`, 'utf8');
}

/** Se um asset já declarado publica exatamente o mesmo arquivo. */
function describesSameFile(asset: unknown, relative: string, entry: { glob: string; input: string }): boolean {
  if (typeof asset === 'string') return asset.replace(/^\.\//, '') === relative;

  const declared = asset as { glob?: string; input?: string };
  return declared?.glob === entry.glob && declared?.input === entry.input;
}

function hasEntry(assets: unknown[], entry: { glob: string; input: string; output: string }): boolean {
  return assets.some(
    asset =>
      typeof asset === 'object' &&
      asset !== null &&
      (asset as Record<string, unknown>).glob === entry.glob &&
      (asset as Record<string, unknown>).input === entry.input &&
      (asset as Record<string, unknown>).output === entry.output,
  );
}

async function installCoreDependencies(cwd: string, config: Config): Promise<void> {
  const resolvedConfig = await resolveConfigPaths(cwd, config);

  await mkdir(resolvedConfig.resolvedPaths.core, { recursive: true });
  await mkdir(resolvedConfig.resolvedPaths.utils, { recursive: true });

  await installComponent('core', resolvedConfig.resolvedPaths.core, resolvedConfig);
  await installComponent('utils', resolvedConfig.resolvedPaths.utils, resolvedConfig);
}
