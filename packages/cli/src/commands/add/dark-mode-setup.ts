import { type Config } from '@cli/utils/config.js';
import { logger } from '@cli/utils/logger.js';
import { existsSync } from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';

function getDarkModeImport(servicesAlias?: string): string {
  return `import { ZardDarkMode } from '${servicesAlias ?? '@/shared/services'}/dark-mode';`;
}

const DARK_MODE_INITIALIZER = 'provideAppInitializer(() => inject(ZardDarkMode).init())';

export async function updateProvideZardWithDarkMode(
  cwd: string,
  resolvedConfig: { resolvedPaths: { core: string; services: string }; aliases?: Config['aliases'] },
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

  const importRegex = /^import .* from '.*';\n?/gm;
  let lastImportMatch: RegExpMatchArray | null = null;
  let match: RegExpMatchArray | null;

  while ((match = importRegex.exec(content)) !== null) {
    lastImportMatch = match;
  }

  if (lastImportMatch) {
    const insertionIndex = lastImportMatch.index + lastImportMatch[0].length;
    const darkModeImport = getDarkModeImport(resolvedConfig.aliases?.services);
    content = content.slice(0, insertionIndex) + darkModeImport + '\n' + content.slice(insertionIndex);
  }

  content = content.replace(/return makeEnvironmentProviders\(\[(.*?)\]\);/s, (match, providers) => {
    const trimmedProviders = providers.trim();
    if (trimmedProviders) {
      return `return makeEnvironmentProviders([${DARK_MODE_INITIALIZER}, ${trimmedProviders}]);`;
    }
    return `return makeEnvironmentProviders([${DARK_MODE_INITIALIZER}]);`;
  });

  await fsPromises.writeFile(provideZardPath, content, 'utf8');
}
