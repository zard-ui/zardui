import { isPublishableLibrary } from '@cli/commands/init/library-peers.js';
import { type Config } from '@cli/utils/config.js';
import { logger } from '@cli/utils/logger.js';
import { withImport } from '@cli/utils/source-file.js';
import { existsSync } from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';

function getDarkModeImport(servicesAlias?: string): string {
  return `import { ZardDarkMode } from '${servicesAlias ?? '@/shared/services'}/dark-mode';`;
}

/**
 * How providezard.ts reaches the services folder.
 *
 * An application keeps the alias. A library imports it relatively: ng-packagr
 * leaves aliased imports external, and the published package would point at a
 * path only the library's workspace maps — see `relativizeImports`.
 */
function servicesSpecifier(
  provideZardPath: string,
  resolvedConfig: {
    resolvedPaths: { services: string; baseUrl: string };
    aliases?: Config['aliases'];
    projectType?: Config['projectType'];
  },
): string | undefined {
  if (!isPublishableLibrary(resolvedConfig, resolvedConfig.resolvedPaths.baseUrl)) {
    return resolvedConfig.aliases?.services;
  }

  return path.relative(path.dirname(provideZardPath), resolvedConfig.resolvedPaths.services).split(path.sep).join('/');
}

const DARK_MODE_INITIALIZER = 'provideAppInitializer(() => inject(ZardDarkMode).init())';

export async function updateProvideZardWithDarkMode(
  cwd: string,
  resolvedConfig: {
    resolvedPaths: { core: string; services: string; baseUrl: string };
    aliases?: Config['aliases'];
    projectType?: Config['projectType'];
  },
): Promise<void> {
  const provideZardPath = path.join(resolvedConfig.resolvedPaths.core, 'provider/providezard.ts');

  if (!existsSync(provideZardPath)) {
    logger.warn('providezard.ts not found. Skipping dark mode provider setup.');
    return;
  }

  let content = await fsPromises.readFile(provideZardPath, 'utf8');

  if (content.includes('ZardDarkMode')) {
    logger.info('Dark mode already configured in providezard.ts');
    return;
  }

  if (!content.includes('inject,')) {
    content = content.replace(
      /import \{ (.*) \} from '@angular\/core';/,
      "import { $1, inject } from '@angular/core';",
    );
  }

  if (!content.includes('provideAppInitializer')) {
    content = content.replace(
      /import \{ (.*) \} from '@angular\/core';/,
      "import { $1, provideAppInitializer } from '@angular/core';",
    );
  }

  content = withImport(content, getDarkModeImport(servicesSpecifier(provideZardPath, resolvedConfig)));

  content = content.replace(/return makeEnvironmentProviders\(\[(.*?)\]\);/s, (match, providers) => {
    const trimmedProviders = providers.trim();
    if (trimmedProviders) {
      return `return makeEnvironmentProviders([${DARK_MODE_INITIALIZER}, ${trimmedProviders}]);`;
    }
    return `return makeEnvironmentProviders([${DARK_MODE_INITIALIZER}]);`;
  });

  await fsPromises.writeFile(provideZardPath, content, 'utf8');
}
