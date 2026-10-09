import { installComponent, validateTargetPath } from '@cli/commands/add/component-installer.js';
import { selectComponents } from '@cli/commands/add/component-selector.js';
import { updateProvideZardWithDarkMode } from '@cli/commands/add/dark-mode-setup.js';
import {
  getAllInstallableNames,
  getTargetDir,
  resolveDependencies,
  type ComponentMeta,
} from '@cli/commands/add/dependency-resolver.js';
import { setupTypeset, setupUtilities } from '@cli/commands/add/stylesheet-setup.js';
import { runAddWizard } from '@cli/commands/add/wizard.js';
import { syncLibraryPeerDependencies } from '@cli/commands/init/library-peers.js';
import { indexHtmlFor } from '@cli/commands/init/project-kind.js';
import { injectThemeScript } from '@cli/commands/init/theme-loader.js';
import { isInteractive, printReport, WizardCancelledError, type LogRecord } from '@cli/ui/index.js';
import { pinAllForAngular } from '@cli/utils/angular-compat.js';
import { getConfig, resolveConfigPaths, type Config } from '@cli/utils/config.js';
import { CliError } from '@cli/utils/errors.js';
import { getProjectInfo } from '@cli/utils/get-project-info.js';
import { assertIconFamily, loadIconCatalog } from '@cli/utils/icon-catalog.js';
import { logger, spinner } from '@cli/utils/logger.js';
import { filterInstalledPackages, installPackagesWithRetry } from '@cli/utils/package-manager.js';
import { getRegistryUrl } from '@cli/utils/registry.js';
import { Command } from 'commander';
import { existsSync } from 'node:fs';
import * as path from 'node:path';

type ResolvedConfig = Awaited<ReturnType<typeof resolveConfigPaths>>;

interface AddOptions {
  yes: boolean;
  overwrite: boolean;
  cwd: string;
  all: boolean;
  path?: string;
  indexHtml?: string;
}

export const add = new Command()
  .name('add')
  .description('add a component to your project')
  .argument('[components...]', 'the components to add')
  .option('-y, --yes', 'skip confirmation prompt.', false)
  .option('-o, --overwrite', 'overwrite existing files.', false)
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .option('-a, --all', 'add all available components', false)
  .option('-p, --path <path>', 'the path to add the component to.')
  .option('--index-html <path>', 'the index.html that receives the dark-mode theme script.')
  .action(async (components: string[], options: AddOptions) => {
    const cwd = path.resolve(options.cwd);

    validateWorkingDirectory(cwd);

    if (options.path) {
      validateTargetPath(path.resolve(cwd, options.path), cwd);
    }

    const config = await loadConfiguration(cwd);
    const projectInfo = await validateProject(cwd);
    const resolvedConfig: ResolvedConfig = await resolveConfigPaths(cwd, config);

    // The catalog decides whether `icons` is a valid value and how to translate
    // the symbols on install, so it comes before resolving any component.
    await loadIconCatalog(getRegistryUrl(config));
    assertIconFamily(config.icons);

    const preselected = await selectComponents(components, options.all);

    warnOnPrereleaseAngular(projectInfo.angularVersionRaw);

    const actions = {
      loadNames: () => getAllInstallableNames(),
      resolve: async (names: string[]) => {
        const { componentsToInstall, dependenciesToInstall } = await resolveDependencies(
          names,
          resolvedConfig,
          cwd,
          options,
        );
        return {
          components: componentsToInstall,
          dependencies: pinAllForAngular(dependenciesToInstall, projectInfo.angularVersion),
        };
      },
      installDependencies: async (packages: string[]) => {
        await installDependencies(packages, cwd, config.packageManager);
        await syncLibraryPeerDependencies(cwd, config, packages);
      },
      installComponent: (component: ComponentMeta) =>
        installComponent(component.name, getTargetDir(component, resolvedConfig, cwd, options.path), resolvedConfig, {
          customPath: Boolean(options.path),
          isBlock: component.isBlock,
        }),
      setupDarkMode: async (indexHtml: string) => {
        // A library has no index.html of its own — it belongs to the consuming app —
        // so a missing file is a note, not a reason to abort the whole install.
        if (existsSync(path.resolve(cwd, indexHtml))) {
          await injectThemeScript(cwd, indexHtml);
        } else {
          logger.warn(
            `${indexHtml} not found: add the dark-mode theme script to the app's index.html by hand, ` +
              'or run `zard-cli add dark-mode --overwrite --index-html <path>`.',
          );
        }
        await updateProvideZardWithDarkMode(cwd, resolvedConfig);
      },
      setupTypeset: () => setupTypeset(resolvedConfig.resolvedPaths.tailwindCss),
      setupUtilities: () => setupUtilities(resolvedConfig.resolvedPaths.tailwindCss),
      defaultIndexHtml: options.indexHtml ?? indexHtmlFor(config.projectType, config.baseUrl),
    };

    if (!isInteractive()) {
      // See the note in `init`: without this, falling back to text mode is
      // indistinguishable from the interface not existing.
      logger.debug(
        `No terminal to draw on (stdin TTY: ${Boolean(process.stdin.isTTY)}, ` +
          `stdout TTY: ${Boolean(process.stdout.isTTY)}, controlling terminal: unreachable) — running headless.`,
      );
      await runHeadless(preselected, options, actions);
      return;
    }

    try {
      const { installed, logs } = await runAddWizard({
        preselected,
        skipConfirmation: options.yes,
        ...actions,
      });

      reportSuccess(installed, logs);
    } catch (error) {
      if (error instanceof WizardCancelledError) {
        printReport({ status: 'cancelled', headline: error.message, notes: ['No files were written.'] });
        process.exit(0);
      }
      throw error;
    }
  });

type AddActions = {
  loadNames(): Promise<string[]>;
  resolve(names: string[]): Promise<{ components: ComponentMeta[]; dependencies: string[] }>;
  installDependencies(packages: string[]): Promise<void>;
  installComponent(component: ComponentMeta): Promise<void>;
  setupDarkMode(indexHtml: string): Promise<void>;
  setupTypeset(): Promise<void>;
  setupUtilities(): Promise<void>;
  defaultIndexHtml: string;
};

/**
 * The path without a UI — CI, pipes and non-interactive terminals.
 *
 * With nobody to pick from the list, the components have to arrive as arguments
 * or through `--all`; the confirmation is skipped because there is no way to
 * answer it.
 */
async function runHeadless(preselected: string[], options: AddOptions, actions: AddActions): Promise<void> {
  if (!preselected.length) {
    throw new CliError(
      'No components specified. Pass the component names or --all when running without an interactive terminal.',
      'NO_COMPONENTS',
    );
  }

  const resolveSpinner = spinner('Resolving components...').start();
  const { components, dependencies } = await actions.resolve(preselected);
  resolveSpinner.stop();

  if (components.length === 0) {
    logger.info('All components already installed.');
    return;
  }

  if (dependencies.length) {
    const depsSpinner = spinner('Installing dependencies...').start();
    await actions.installDependencies(dependencies);
    depsSpinner.succeed('Dependencies installed');
  }

  const installed: string[] = [];
  const failed: string[] = [];

  for (const component of components) {
    const componentSpinner = spinner(`Installing ${component.name}...`).start();
    try {
      await actions.installComponent(component);
      installed.push(component.name);
      componentSpinner.succeed(component.name);
    } catch (error) {
      failed.push(component.name);
      componentSpinner.fail(component.name);
      logger.debug(`Failed to install ${component.name}: ${error instanceof Error ? error.message : error}`);
    }
  }

  if (installed.includes('typeset')) {
    await actions.setupTypeset();
  }

  if (installed.includes('utilities')) {
    await actions.setupUtilities();
  }

  // `--index-html` answers what the wizard asks; without it, the project's own index.html.
  if (installed.includes('dark-mode')) {
    await actions.setupDarkMode(actions.defaultIndexHtml);
  }

  if (failed.length) {
    throw new CliError(`Failed to install: ${failed.join(', ')}`, 'INSTALL_FAILED');
  }

  reportSuccess(installed, []);
}

function reportSuccess(installed: readonly string[], logs: readonly LogRecord[]): void {
  if (!installed.length) {
    printReport({ status: 'success', headline: 'All components are already installed.', logs });
    return;
  }

  printReport({
    status: 'success',
    headline: `Installed ${installed.length} component${installed.length > 1 ? 's' : ''}.`,
    items: [...installed],
    logs,
  });
}

function validateWorkingDirectory(cwd: string): void {
  if (!existsSync(cwd)) {
    throw new CliError(`The path ${cwd} does not exist. Please try again.`, 'INVALID_CWD');
  }
}

async function loadConfiguration(cwd: string): Promise<Config> {
  const config = await getConfig(cwd);

  if (!config) {
    throw new CliError('Configuration not found. Please run `zard-cli init` first.', 'CONFIG_NOT_FOUND');
  }

  return config;
}

async function validateProject(cwd: string) {
  const projectInfo = await getProjectInfo(cwd);

  if (projectInfo.framework !== 'angular') {
    throw new CliError('This project does not appear to be an Angular project.', 'NOT_ANGULAR');
  }

  return projectInfo;
}

function warnOnPrereleaseAngular(angularVersionRaw: string | null): void {
  if (angularVersionRaw && /-(rc|next|canary)/.test(angularVersionRaw)) {
    logger.warn(
      `You are using a pre-release version of Angular (${angularVersionRaw}). Some dependencies may have compatibility issues.`,
    );
  }
}

async function installDependencies(
  packages: string[],
  cwd: string,
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun',
): Promise<void> {
  if (packages.length === 0) return;

  // An already-initialized project usually has all of them: without the filter,
  // every `add` would pay for a full tree revalidation to install nothing.
  const missing = await filterInstalledPackages(packages, cwd);
  if (missing.length === 0) {
    logger.debug(`Dependencies already installed: ${packages.join(', ')}`);
    return;
  }

  await installPackagesWithRetry(missing, cwd, packageManager, false);
}
