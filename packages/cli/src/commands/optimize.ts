import { Command } from 'commander';
import { existsSync, promises as fs } from 'fs';
import path from 'path';
import { logger, spinner } from '../utils/logger.js';

export const optimize = new Command()
  .name('optimize')
  .description('optimize registry by removing redundant dependencies')
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .option('--dry-run', 'show what would be optimized without making changes', false)
  .action(async options => {
    const cwd = path.resolve(options.cwd);

    if (!existsSync(cwd)) {
      logger.error(`The path ${cwd} does not exist. Please try again.`);
      process.exit(1);
    }

    const registryPath = path.join(cwd, 'packages/cli/src/utils/registry.ts');
    const libPackagePath = path.join(cwd, 'libs/zard/package.json');

    if (!existsSync(registryPath)) {
      logger.error('Registry file not found. Expected at packages/cli/src/utils/registry.ts');
      process.exit(1);
    }

    if (!existsSync(libPackagePath)) {
      logger.error('Library package.json not found. Expected at libs/zard/package.json');
      process.exit(1);
    }

    const optimizeSpinner = spinner('Analyzing dependencies...').start();

    try {
      // Read library peerDependencies
      const libPackageContent = await fs.readFile(libPackagePath, 'utf8');
      const libPackage = JSON.parse(libPackageContent);
      const peerDependencies = Object.keys(libPackage.peerDependencies || {});

      // Read registry
      const registryContent = await fs.readFile(registryPath, 'utf8');

      optimizeSpinner.text = 'Identifying redundant dependencies...';

      // Find all dependencies in registry
      const dependencyMatches = registryContent.match(/dependencies: \[[^\]]+\]/g) || [];
      const redundantDeps = new Set<string>();

      // Dependencies that should stay in registry even if they're peerDependencies
      const keepInRegistry = ['ngx-sonner'];

      dependencyMatches.forEach(match => {
        const deps = match.match(/'([^']+)'/g) || [];
        deps.forEach(dep => {
          const cleanDep = dep.replace(/'/g, '');
          if (peerDependencies.includes(cleanDep) && !keepInRegistry.includes(cleanDep)) {
            redundantDeps.add(cleanDep);
          }
        });
      });

      optimizeSpinner.succeed(`Found ${redundantDeps.size} redundant dependencies`);

      if (redundantDeps.size === 0) {
        logger.info('Registry is already optimized. No redundant dependencies found.');
        return;
      }

      logger.break();
      logger.info('🔍 Redundant dependencies (already in peerDependencies):');
      Array.from(redundantDeps)
        .sort()
        .forEach(dep => {
          logger.info(`  - ${dep}`);
        });

      if (options.dryRun) {
        logger.break();
        logger.info('Dry run - registry would be optimized to remove these dependencies.');
        return;
      }

      logger.break();
      logger.warn('⚠️  Important: These dependencies will be removed from the registry because they are already peerDependencies.');
      logger.info('This means they will automatically be available when users install the library.');

      const optimizedSpinner = spinner('Optimizing registry...').start();

      // Remove redundant dependencies
      let optimizedContent = registryContent;

      // Remove all dependency arrays that only contain redundant dependencies
      optimizedContent = optimizedContent.replace(/\s*dependencies: \[[^\]]*\],?\n?/g, match => {
        // Extract dependencies from this match
        const deps = match.match(/'([^']+)'/g) || [];
        const cleanDeps = deps.map(dep => dep.replace(/'/g, ''));

        // Filter out redundant dependencies
        const necessaryDeps = cleanDeps.filter(dep => !redundantDeps.has(dep));

        if (necessaryDeps.length === 0) {
          // Remove the entire dependencies line
          return '';
        } else {
          // Keep only necessary dependencies
          const depsStr = necessaryDeps.map(dep => `'${dep}'`).join(', ');
          return `\n    dependencies: [${depsStr}],\n`;
        }
      });

      // Clean up any double commas or extra spaces
      optimizedContent = optimizedContent.replace(/,(\s*,)+/g, ',');
      optimizedContent = optimizedContent.replace(/,(\s*\})/g, '$1');

      await fs.writeFile(registryPath, optimizedContent, 'utf8');

      optimizedSpinner.succeed('Registry optimized successfully!');

      logger.break();
      logger.success(`✅ Removed ${redundantDeps.size} redundant dependencies from registry.`);
      logger.info('Components will now use dependencies from peerDependencies automatically.');
    } catch (error) {
      optimizeSpinner.fail('Optimization failed');
      logger.error(error);
      process.exit(1);
    }
  });
