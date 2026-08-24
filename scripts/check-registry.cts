/**
 * Proves that what the registry publishes actually compiles once installed.
 *
 * `registry-data.ts` is a hand-maintained file list. Nothing else in the build
 * notices when a component gains a file and the list does not: the item is
 * published with a barrel that re-exports modules it never shipped, and the
 * first person to run `zard-cli add <name>` finds out. This script is that
 * missing check, and it runs in two passes:
 *
 *   source pass  — every listed file exists, every source file is listed, and
 *                  `registryDependencies` names exactly the other items the
 *                  files import from.
 *   closure pass — for the JSON already written to `apps/web/public/r`, every
 *                  relative and aliased import resolves to a file that ships,
 *                  either in the item itself or in one of its dependencies.
 *
 * Run it with `npm run check:registry`. It is also the last step of
 * `npm run build:registry`, so a drifting registry fails the build.
 */

import * as fs from 'fs';
import * as path from 'path';

import { registry } from '../packages/cli/src/core/registry/registry-data';

const LIB_PATH = path.resolve(__dirname, '../libs/zard/src/lib/shared');
const REGISTRY_OUTPUT = path.resolve(__dirname, '../apps/web/public/r');

/**
 * `utils` and `core` are installed by `init`, not by `add`, so no component
 * declares them — see `commands/init/steps.ts`.
 */
const IMPLICIT_ITEMS = new Set(['utils', 'core']);

const NON_COMPONENT_BASE_PATHS = ['core', 'services', 'utils'];

const problems: string[] = [];
const report = (item: string, message: string) => problems.push(`${item}: ${message}`);

function sourceDirOf(name: string, basePath?: string): string {
  const base = basePath ?? name;
  return NON_COMPONENT_BASE_PATHS.includes(base) ? path.join(LIB_PATH, base) : path.join(LIB_PATH, 'components', base);
}

/** The files that make up a registry item: everything but demos, docs and specs. */
function sourceFilesOf(dir: string, relative = ''): string[] {
  const files: string[] = [];

  for (const entry of fs.readdirSync(dir).sort()) {
    if (entry === 'demo' || entry === 'doc') continue;

    const absolute = path.join(dir, entry);
    if (fs.statSync(absolute).isDirectory()) {
      files.push(...sourceFilesOf(absolute, path.posix.join(relative, entry)));
      continue;
    }

    const shippable = entry.endsWith('.ts') || entry.endsWith('.css');
    if (shippable && !entry.endsWith('.spec.ts')) files.push(path.posix.join(relative, entry));
  }

  return files;
}

/** The other registry items a set of files imports from, by base path. */
function importedBasePaths(dir: string, files: string[]): Set<string> {
  const imported = new Set<string>();

  for (const file of files) {
    if (!file.endsWith('.ts')) continue;
    const source = fs.readFileSync(path.join(dir, file), 'utf8');

    for (const match of source.matchAll(/from '@\/shared\/components\/([a-z0-9-]+)/g)) imported.add(match[1]);
    for (const match of source.matchAll(/from '\.\.\/([a-z0-9-]+)\//g)) imported.add(match[1]);
    for (const match of source.matchAll(/from '@\/shared\/(utils|core|services)/g)) imported.add(match[1]);
  }

  return imported;
}

function checkSourcePass(): void {
  const itemNameOfBasePath = new Map(registry.map(item => [item.basePath ?? item.name, item.name]));

  for (const item of registry) {
    const dir = sourceDirOf(item.name, item.basePath);

    if (!fs.existsSync(dir)) {
      report(item.name, `source directory does not exist: ${path.relative(process.cwd(), dir)}`);
      continue;
    }

    const actual = sourceFilesOf(dir);
    const listed = item.files.map(file => file.name);

    for (const file of listed) {
      if (!actual.includes(file)) report(item.name, `lists a file that does not exist: ${file}`);
    }
    for (const file of actual) {
      if (!listed.includes(file)) report(item.name, `does not list a source file: ${file}`);
    }

    const needed = importedBasePaths(dir, actual);
    needed.delete(item.basePath ?? item.name);

    const expected = [...needed]
      .map(basePath => itemNameOfBasePath.get(basePath) ?? basePath)
      .filter(name => !IMPLICIT_ITEMS.has(name))
      .sort();
    const declared = [...(item.registryDependencies ?? [])].sort();

    for (const dep of expected) {
      if (!declared.includes(dep)) report(item.name, `imports from "${dep}" but does not declare it`);
    }
    for (const dep of declared) {
      if (!expected.includes(dep)) report(item.name, `declares "${dep}" but never imports from it`);
    }
  }
}

interface PublishedItem {
  name: string;
  basePath?: string;
  registryDependencies?: string[];
  files?: Array<{ name: string; content: string }>;
}

/**
 * Resolves an import the way the installed project will see it.
 *
 * Sibling items land next to each other on disk, so `../button/button.component`
 * from `combobox` means "the file `button.component.ts` inside the `button`
 * item". `@/shared/components/x/y` means the same thing through the alias.
 */
function checkClosurePass(): void {
  if (!fs.existsSync(REGISTRY_OUTPUT)) {
    console.log('· no built registry in apps/web/public/r — skipping the closure pass');
    return;
  }

  const items = new Map<string, PublishedItem>();
  for (const file of fs.readdirSync(REGISTRY_OUTPUT)) {
    if (!file.endsWith('.json') || file === 'registry.json' || file === 'icons.json') continue;
    const item = JSON.parse(fs.readFileSync(path.join(REGISTRY_OUTPUT, file), 'utf8')) as PublishedItem;
    if (item.files) items.set(item.name, item);
  }

  const filesOf = (name: string) => new Set(items.get(name)?.files?.map(file => file.name) ?? []);
  const basePathToName = new Map([...items.values()].map(item => [item.basePath ?? item.name, item.name]));

  for (const item of items.values()) {
    const own = filesOf(item.name);
    const reachable = new Map<string, Set<string>>();
    for (const dep of [...(item.registryDependencies ?? []), ...IMPLICIT_ITEMS]) {
      const target = items.get(dep);
      if (target) reachable.set(target.basePath ?? target.name, filesOf(dep));
    }

    for (const file of item.files ?? []) {
      if (!file.name.endsWith('.ts')) continue;

      for (const match of file.content.matchAll(/from '([^']+)'/g)) {
        const specifier = match[1];
        let owner = own;
        let target: string;

        if (specifier.startsWith('./') || specifier.startsWith('../')) {
          const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file.name), specifier));
          if (resolved.startsWith('../')) {
            // Leaves the item: the first segment names a sibling item.
            const [sibling, ...rest] = resolved.replace(/^\.\.\//, '').split('/');
            owner = reachable.get(sibling) ?? new Set();
            target = rest.join('/');
            if (!reachable.has(sibling)) {
              report(item.name, `${file.name} imports "${specifier}" but "${sibling}" is not a declared dependency`);
              continue;
            }
          } else {
            target = resolved;
          }
        } else if (specifier.startsWith('@/shared/')) {
          const rest = specifier.slice('@/shared/'.length);
          const [head, ...tail] = rest.split('/');
          const group = head === 'components' ? tail.shift() : head;
          if (!group) continue;
          const name = basePathToName.get(group);
          if (group === (item.basePath ?? item.name)) {
            owner = own;
          } else if (name && reachable.has(group)) {
            owner = reachable.get(group) as Set<string>;
          } else {
            report(item.name, `${file.name} imports "${specifier}" but "${group}" is not a declared dependency`);
            continue;
          }
          target = tail.join('/');
        } else {
          continue; // npm package
        }

        const candidates = target ? [target, `${target}.ts`, `${target}.css`, `${target}/index.ts`] : ['index.ts'];
        if (!candidates.some(candidate => owner.has(candidate))) {
          report(item.name, `${file.name} imports "${specifier}", which is not shipped`);
        }
      }
    }
  }
}

checkSourcePass();
checkClosurePass();

if (problems.length > 0) {
  console.error(`\n✖ registry is not self-consistent — ${problems.length} problem(s):\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  console.error('\nEvery component must list all of its source files and declare every item it imports from.');
  console.error('See packages/cli/src/core/registry/registry-data.ts.\n');
  process.exit(1);
}

console.log(`✔ registry is self-consistent — ${registry.length} items checked`);
