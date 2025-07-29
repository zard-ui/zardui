import { Command } from 'commander';
import { execa } from 'execa';
import { existsSync, promises as fs } from 'fs';
import path from 'path';
import prompts from 'prompts';

import { Config, getConfig, resolveConfigPaths, type } from '../utils/config.js';
import { fetchComponentFromGithub } from '../utils/fetch-component.js';
import { getProjectInfo } from '../utils/get-project-info.js';
import { logger, spinner } from '../utils/logger.js';
import { ComponentRegistry, getAllComponentNames, getRegistryComponent, type } from '../utils/registry.js';

export const add = new Command()
  .name('add')
  .description('add a component to your project')
  .argument('[components...]', 'the components to add')
  .option('-y, --yes', 'skip confirmation prompt.', false)
  .option('-o, --overwrite', 'overwrite existing files.', false)
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .option('-a, --all', 'add all available components', false)
  .option('-p, --path <path>', 'the path to add the component to.')
  .action(async (components, options) => {
    const cwd = path.resolve(options.cwd);

    if (!existsSync(cwd)) {
      logger.error(`The path ${cwd} does not exist. Please try again.`);
      process.exit(1);
    }

    const config = await getConfig(cwd);
    if (!config) {
      logger.error('Configuration not found. Please run `zard init` first.');
      process.exit(1);
    }

    const projectInfo = await getProjectInfo(cwd);
    if (projectInfo.framework !== 'angular') {
      logger.error('This project does not appear to be an Angular project.');
      process.exit(1);
    }

    const resolvedConfig = await resolveConfigPaths(cwd, config);

    let selectedComponents = components;

    if (options.all) {
      selectedComponents = getAllComponentNames();
    } else if (!components?.length) {
      const { components: selected } = await prompts({
        type: 'multiselect',
        name: 'components',
        message: 'Which components would you like to add?',
        hint: 'Space to select. A to toggle all. Enter to submit.',
        choices: getAllComponentNames().map(name => ({
          title: name,
          value: name,
        })),
      });

      selectedComponents = selected;
    }

    if (!selectedComponents?.length) {
      logger.warn('No components selected. Exiting.');
      process.exit(0);
    }

    const registryComponents = selectedComponents.map((name: string) => getRegistryComponent(name)).filter(Boolean) as ComponentRegistry[];

    if (!registryComponents.length) {
      logger.error('Selected components not found in registry.');
      process.exit(1);
    }

    const dependenciesToInstall = new Set<string>();
    const componentsToInstall: ComponentRegistry[] = [];

    for (const component of registryComponents) {
      componentsToInstall.push(component);

      component.dependencies?.forEach(dep => dependenciesToInstall.add(dep));

      if (component.registryDependencies) {
        for (const dep of component.registryDependencies) {
          const depComponent = getRegistryComponent(dep);
          if (depComponent && !componentsToInstall.find(c => c.name === dep)) {
            // Check if the dependency component already exists
            const depTargetDir = options.path ? path.resolve(cwd, options.path, dep) : path.resolve(resolvedConfig.resolvedPaths.components, dep);

            if (!existsSync(depTargetDir)) {
              componentsToInstall.push(depComponent);
              depComponent.dependencies?.forEach(d => dependenciesToInstall.add(d));
            }
          }
        }
      }
    }

    if (!options.yes) {
      const { proceed } = await prompts({
        type: 'confirm',
        name: 'proceed',
        message: `Ready to install ${componentsToInstall.length} component(s) and ${dependenciesToInstall.size} dependencies. Proceed?`,
        initial: true,
      });

      if (!proceed) {
        process.exit(0);
      }
    }

    if (dependenciesToInstall.size > 0) {
      const depsSpinner = spinner('Installing dependencies...').start();
      await execa('npm', ['install', ...Array.from(dependenciesToInstall)], { cwd });
      depsSpinner.succeed();
    }

    for (const component of componentsToInstall) {
      const componentSpinner = spinner(`Installing ${component.name}...`).start();

      try {
        const targetDir = options.path ? path.resolve(cwd, options.path, component.name) : path.resolve(resolvedConfig.resolvedPaths.components, component.name);

        await installComponent(component, targetDir, resolvedConfig, options.overwrite);
        componentSpinner.succeed(`Added ${component.name}`);
      } catch (error) {
        componentSpinner.fail(`Failed to install ${component.name}`);
        logger.error(error);
      }
    }

    logger.break();
    logger.success('Done!');
  });

async function installComponent(component: ComponentRegistry, targetDir: string, config: Config & { resolvedPaths: any }, overwrite: boolean) {
  if (!overwrite && existsSync(targetDir)) {
    throw new Error(`Component ${component.name} already exists. Use --overwrite to overwrite.`);
  }

  await fs.mkdir(targetDir, { recursive: true });

  for (const file of component.files) {
    const content = await fetchComponentFromGithub(component.name, file.name, config);
    const filePath = path.join(targetDir, file.name);
    const fileDir = path.dirname(filePath);

    await fs.mkdir(fileDir, { recursive: true });
    await fs.writeFile(filePath, content, 'utf8');
  }
}
