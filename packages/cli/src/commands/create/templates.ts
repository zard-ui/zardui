/**
 * The project templates `create` can scaffold, and the exact commands that scaffold them.
 *
 * Everything here is pure: a template and a package manager go in, the commands come out. That is
 * what lets the specs pin the commands for every combination, and what keeps `create` honest about
 * what it will run before it runs anything.
 *
 * The user always chooses the template. Nothing in this module (or its callers) infers one from the
 * directory — a new project has no directory to infer from, and a guess would scaffold the wrong
 * framework.
 */

import { type ProjectKind } from '@cli/commands/init/project-kind.js';

export type TemplateId = 'angular' | 'nx' | 'analog';
export type PackageManagerId = 'npm' | 'pnpm' | 'yarn' | 'bun';

export const PACKAGE_MANAGERS: readonly PackageManagerId[] = ['npm', 'pnpm', 'yarn', 'bun'];

export interface TemplateOption {
  readonly value: TemplateId;
  readonly label: string;
  readonly detail: string;
  /** The ecosystem's colour, as in the init menu. */
  readonly color: string;
  /** The `init` project kind the scaffolded app is configured as. */
  readonly kind: ProjectKind;
}

/** Menu order: the cursor opens on the first item — never on one picked by detection. */
export const TEMPLATES: readonly TemplateOption[] = [
  {
    value: 'angular',
    label: 'Angular',
    detail: 'A standalone Angular app, scaffolded with the Angular CLI.',
    color: '#fafafa',
    kind: 'angular',
  },
  {
    value: 'nx',
    label: 'Nx',
    detail: 'An Nx monorepo with an Angular app.',
    color: '#6aa9ff',
    kind: 'nx',
  },
  {
    value: 'analog',
    label: 'Analog',
    detail: 'An Analog app (Vite, file-based routing, SSR).',
    color: '#fb7185',
    kind: 'analog',
  },
];

export function templateById(id: string): TemplateOption | undefined {
  return TEMPLATES.find(template => template.value === id);
}

/** One process `create` runs. */
export interface ScaffoldCommand {
  readonly command: string;
  readonly args: readonly string[];
  /** What the spinner and the error message call it. */
  readonly label: string;
  /** Runs inside the new project instead of next to it. */
  readonly inProject?: boolean;
  /**
   * Capture the process's output instead of showing it (it is logged with --debug). For generators that
   * print their own "Now run: cd x / npm install" and git noise in the middle of create, which would
   * contradict the steps create runs itself and the summary it prints at the end.
   */
  readonly quiet?: boolean;
  /**
   * pnpm 11 fails an install whose dependencies have build scripts nobody approved
   * (ERR_PNPM_IGNORED_BUILDS). With pnpm, the known ones are approved in the project before this
   * command runs (see `pnpmBuildApprovalsYaml`). Ignored for the other managers.
   */
  readonly approveBuilds?: boolean;
}

/**
 * The dependencies of an Analog project that run a build script on install (native binaries and
 * caches). pnpm 11 refuses to install them unless the project approves them, and a project that
 * failed once keeps failing on every later `pnpm install` / `pnpm add`, so the approval is written
 * into the project (`pnpm-workspace.yaml`) rather than passed to a single install.
 */
export const PNPM_BUILD_APPROVALS: readonly string[] = ['@parcel/watcher', 'esbuild', 'lmdb', 'msgpackr-extract'];

/**
 * `pnpm-workspace.yaml` approving `PNPM_BUILD_APPROVALS`: `allowBuilds` is what pnpm 11 reads,
 * `onlyBuiltDependencies` what pnpm 10 reads (pnpm 11 accepts both).
 */
export function pnpmBuildApprovalsYaml(): string {
  const names = PNPM_BUILD_APPROVALS.map(name => JSON.stringify(name));
  return [
    'allowBuilds:',
    ...names.map(name => `  ${name}: true`),
    'onlyBuiltDependencies:',
    ...names.map(name => `  - ${name}`),
    '',
  ].join('\n');
}

/**
 * How each package manager runs a package without installing it.
 *
 * `--yes` for npx: without it npx stops to ask whether it may install the generator, which a script
 * cannot answer.
 */
const RUNNERS: Record<PackageManagerId, readonly [string, ...string[]]> = {
  npm: ['npx', '--yes'],
  pnpm: ['pnpm', 'dlx'],
  yarn: ['yarn', 'dlx'],
  bun: ['bunx'],
};

function runner(
  packageManager: PackageManagerId,
  pkg: string,
  args: readonly string[],
): Pick<ScaffoldCommand, 'command' | 'args'> {
  const [command, ...prefix] = RUNNERS[packageManager];
  return { command, args: [...prefix, pkg, ...args] };
}

/** Runs a binary the project already depends on, without downloading it again. */
function localBin(
  packageManager: PackageManagerId,
  bin: string,
  args: readonly string[],
): Pick<ScaffoldCommand, 'command' | 'args'> {
  switch (packageManager) {
    case 'npm':
      return { command: 'npx', args: ['--no-install', bin, ...args] };
    case 'pnpm':
      return { command: 'pnpm', args: ['exec', bin, ...args] };
    case 'yarn':
      return { command: 'yarn', args: [bin, ...args] };
    case 'bun':
      return { command: 'bunx', args: [bin, ...args] };
  }
}

/** Yarn Classic (v1) has no `dlx`: npx runs the generator and Yarn still does the installing. */
export function withNpxRunner(commands: readonly ScaffoldCommand[]): ScaffoldCommand[] {
  return commands.map(item =>
    item.command === 'yarn' && item.args[0] === 'dlx'
      ? { ...item, command: 'npx', args: ['--yes', ...item.args.slice(1)] }
      : item,
  );
}

/** A command as the user would type it, for messages. */
export function printable(item: Pick<ScaffoldCommand, 'command' | 'args'>): string {
  return [item.command, ...item.args].join(' ');
}

/**
 * The commands that produce the project in `<cwd>/<name>`, with its dependencies installed.
 *
 * Every prompt of every generator is answered by a flag, so the process never waits on a person.
 * Stylesheets are plain CSS: `init` owns Tailwind from there, in each framework's own way.
 */
export function scaffoldCommands(
  template: TemplateId,
  name: string,
  packageManager: PackageManagerId,
): ScaffoldCommand[] {
  switch (template) {
    case 'angular':
      return [
        {
          ...runner(packageManager, '@angular/cli@latest', [
            'new',
            name,
            '--interactive=false',
            '--style=css',
            '--routing',
            '--ssr=false',
            '--ai-config=none',
            `--package-manager=${packageManager}`,
          ]),
          label: 'Creating the Angular app',
        },
      ];

    case 'nx':
      return [
        // An empty workspace, then the Angular plugin and an app named after the project. The ready-made
        // `angular-monorepo` template would be quicker, but it ignores the app name (it always creates
        // "shop" next to a Node api) and ships a demo storefront the user has to delete.
        {
          ...runner(packageManager, 'create-nx-workspace@latest', [
            name,
            '--preset=apps',
            '--formatter=prettier',
            '--aiAgents=none',
            '--nxCloud=skip',
            '--interactive=false',
            `--packageManager=${packageManager}`,
          ]),
          label: 'Creating the Nx workspace',
        },
        {
          ...localBin(packageManager, 'nx', ['add', '@nx/angular', '--interactive=false']),
          label: 'Adding the Angular plugin',
          inProject: true,
        },
        {
          ...localBin(packageManager, 'nx', [
            'generate',
            '@nx/angular:application',
            `--directory=apps/${name}`,
            `--name=${name}`,
            '--style=css',
            '--bundler=esbuild',
            '--ssr=false',
            '--routing',
            '--unitTestRunner=none',
            '--e2eTestRunner=none',
            '--linter=eslint',
            '--interactive=false',
          ]),
          label: 'Creating the Angular app',
          inProject: true,
        },
      ];

    case 'analog':
      return [
        {
          ...runner(packageManager, 'create-analog@latest', [name, '--template', 'latest', '--skipTailwind']),
          label: 'Creating the Analog app',
          quiet: true,
        },
        // create-analog only writes files; the install is ours.
        {
          command: packageManager,
          args: ['install'],
          label: 'Installing dependencies',
          inProject: true,
          approveBuilds: true,
        },
      ];
  }
}
