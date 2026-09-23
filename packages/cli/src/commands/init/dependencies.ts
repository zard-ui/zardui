import { bundlerFor, isLibraryKind } from '@cli/commands/init/project-kind.js';
import { iconPackagesFor } from '@cli/core/icons/index.js';
import { pinAllForAngular } from '@cli/utils/angular-compat.js';
import { type Config } from '@cli/utils/config.js';
import { getProjectInfo, type ProjectInfo } from '@cli/utils/get-project-info.js';
import { iconCatalog } from '@cli/utils/icon-catalog.js';
import { logger } from '@cli/utils/logger.js';
import { filterInstalledPackages, installPackagesWithRetry } from '@cli/utils/package-manager.js';

export async function installDependencies(cwd: string, config: Config, projectInfo?: ProjectInfo): Promise<void> {
  const info = projectInfo || (await getProjectInfo(cwd));

  // The icon package comes from the family chosen in `components.json`, not from
  // a fixed list: that is what makes `"icons"` mean something the day there is
  // more than one family.
  //
  // Pinned against the project's Angular: the CDK and ng-icons both ship one
  // release per Angular major and peer on `>=` it, so `latest` is the wrong
  // answer for anyone not already on the newest Angular.
  const deps = pinAllForAngular(
    [
      '@angular/cdk',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      ...iconPackagesFor(config.icons, iconCatalog()),
    ],
    info.angularVersion,
  );
  const devDeps = tailwindPackages(config.projectType);

  if (info.hasTailwind) {
    logger.info('Tailwind CSS is already installed. Only the missing pieces will be added.');
  }

  // Every batch that comes back empty is a whole manager invocation saved — and
  // that is exactly the common case for a repeated `init`: nothing to install.
  const [missingDeps, missingDevDeps] = await Promise.all([
    filterInstalledPackages(deps, cwd),
    filterInstalledPackages(devDeps, cwd),
  ]);

  if (!missingDeps.length && !missingDevDeps.length) {
    logger.info('All dependencies are already installed.');
    return;
  }

  await installPackagesWithRetry(missingDeps, cwd, config.packageManager, false);
  await installPackagesWithRetry(missingDevDeps, cwd, config.packageManager, true);
}

/**
 * What Tailwind needs to run in that kind of project.
 *
 * The list is always the complete one and the installed-filter decides what is
 * left: checking only for `tailwindcss` missed the case of someone who had it
 * installed but not the bundler adapter, and then the build emitted no
 * utilities at all.
 *
 * A library has no bundler to configure — the consuming application compiles
 * the CSS — but the packages stay because the theme init writes there declares
 * them.
 */
function tailwindPackages(kind: Config['projectType']): string[] {
  const shared = ['tailwindcss', 'tailwindcss-animate'];

  if (isLibraryKind(kind)) return shared;

  return bundlerFor(kind) === 'vite'
    ? [...shared, '@tailwindcss/vite']
    : [...shared, '@tailwindcss/postcss', 'postcss'];
}
