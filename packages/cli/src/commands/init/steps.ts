import { installComponent } from '@cli/commands/add/component-installer.js';
import { installDependencies } from '@cli/commands/init/dependencies.js';
import { applyThemeToStyles, createPostCssConfig } from '@cli/commands/init/tailwind-setup.js';
import { updateTsConfig } from '@cli/commands/init/tsconfig-updater.js';
import { updateAngularConfig } from '@cli/commands/init/update-angular-config.js';
import { resolveConfigPaths, type Config } from '@cli/utils/config.js';
import { type ProjectInfo } from '@cli/utils/get-project-info.js';
import { mkdir, writeFile } from 'node:fs/promises';
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
    {
      label: config.appConfigFile,
      note: 'ZardUI providers',
      run: () => updateAngularConfig(cwd, config),
    },
  ];

  if (!projectInfo.hasTailwind || isReInitializing) {
    steps.push({
      label: '.postcssrc.json',
      note: 'Tailwind PostCSS plugin',
      run: () => createPostCssConfig(cwd),
    });
  }

  steps.push(
    {
      label: config.tailwind.css,
      note: `theme tokens (${config.tailwind.baseColor})`,
      run: () => applyThemeToStyles(cwd, config),
    },
    {
      label: 'tsconfig.json',
      note: 'import path aliases',
      run: () => updateTsConfig(cwd, config),
    },
    {
      label: 'core & utils',
      note: 'shared helpers used by every component',
      run: () => installCoreDependencies(cwd, config),
    },
  );

  return steps;
}

async function installCoreDependencies(cwd: string, config: Config): Promise<void> {
  const resolvedConfig = await resolveConfigPaths(cwd, config);

  await mkdir(resolvedConfig.resolvedPaths.core, { recursive: true });
  await mkdir(resolvedConfig.resolvedPaths.utils, { recursive: true });

  await installComponent('core', resolvedConfig.resolvedPaths.core, resolvedConfig);
  await installComponent('utils', resolvedConfig.resolvedPaths.utils, resolvedConfig);
}
