import { isLibraryKind, projectRootOf } from '@cli/commands/init/project-kind.js';
import { type Config } from '@cli/utils/config.js';
import { logger } from '@cli/utils/logger.js';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import * as path from 'node:path';

/**
 * Declares what the library's components import as its peer dependencies.
 *
 * The packages are installed at the workspace root, where the library builds
 * against them — but ng-packagr leaves them external, and an app installing the
 * published library learns it needs `@angular/cdk` or `echarts` only when its
 * build fails to resolve them. As peers, the package manager says so up front.
 *
 * The range is the one the workspace installed. An entry the library already
 * declares is left alone: whoever wrote it chose that range on purpose.
 * Libraries without a `package.json` of their own — a non-buildable Nx library —
 * publish nothing, so there is nothing to declare.
 */
export async function syncLibraryPeerDependencies(cwd: string, config: Config, packages: string[]): Promise<void> {
  if (!isLibraryKind(config.projectType) || packages.length === 0) return;

  const libraryPackageJson = path.resolve(cwd, projectRootOf(config.baseUrl), 'package.json');
  if (!existsSync(libraryPackageJson)) {
    logger.debug(`No package.json in ${path.relative(cwd, path.dirname(libraryPackageJson))}; no peers to declare.`);
    return;
  }

  const workspace = JSON.parse(await readFile(path.resolve(cwd, 'package.json'), 'utf8'));
  const installed: Record<string, string> = { ...workspace.devDependencies, ...workspace.dependencies };

  const library = JSON.parse(await readFile(libraryPackageJson, 'utf8'));
  const peers: Record<string, string> = { ...library.peerDependencies };

  let changed = false;
  for (const name of packages.map(packageName)) {
    if (peers[name]) continue;
    peers[name] = installed[name] ?? '*';
    changed = true;
  }

  if (!changed) return;

  library.peerDependencies = peers;
  await writeFile(libraryPackageJson, `${JSON.stringify(library, null, 2)}\n`, 'utf8');
}

/**
 * Whether the project is a library ng-packagr bundles — one with an `ng-package.json`.
 *
 * Only that kind needs relative imports: ng-packagr leaves aliased imports
 * external. A non-buildable Nx library is compiled from source by the app that
 * uses it, through the same aliases — and in a Vite build, reaching one file
 * by alias and by relative path loads it twice, so rewriting there would only
 * add risk. `baseUrl` is absolute; the library root sits two levels above it.
 */
export function isPublishableLibrary(config: { projectType?: Config['projectType'] }, baseUrl: string): boolean {
  return (
    Boolean(config.projectType && isLibraryKind(config.projectType)) &&
    existsSync(path.resolve(baseUrl, '..', '..', 'ng-package.json'))
  );
}

/** `@angular/cdk@^22` → `@angular/cdk`; the `@` that opens a scope is not a version. */
function packageName(spec: string): string {
  const separator = spec.lastIndexOf('@');
  return separator > 0 ? spec.slice(0, separator) : spec;
}
