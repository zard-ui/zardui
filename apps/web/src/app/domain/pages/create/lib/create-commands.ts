export const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn', 'bun'] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];
export const DEFAULT_PACKAGE_MANAGER: PackageManager = 'npm';

export const TEMPLATES = [
  { value: 'angular', label: 'Angular', description: 'A new Angular app' },
  { value: 'nx', label: 'Nx', description: 'An Nx workspace with an Angular app' },
  { value: 'analog', label: 'Analog', description: 'An Analog (Vite) meta-framework app' },
] as const;
export type CreateTemplate = (typeof TEMPLATES)[number]['value'];

export type ApplyScope = 'full' | 'theme' | 'font';

/** How each package manager runs a package without installing it. These strings are what the CLI docs print too. */
const RUNNERS: Record<PackageManager, string> = {
  npm: 'npx zard-cli@latest',
  pnpm: 'pnpm dlx zard-cli@latest',
  yarn: 'yarn dlx zard-cli@latest',
  bun: 'bunx zard-cli@latest',
};

/**
 * The directory the new project goes in. The command carries one because `create` cannot ask for it without a
 * terminal, and asking is the only thing that would make it stop; whoever pastes it can edit the word.
 */
export const DEFAULT_PROJECT_NAME = 'my-app';

export function runnerFor(manager: PackageManager): string {
  return RUNNERS[manager];
}

export interface NewProjectOptions {
  readonly manager: PackageManager;
  readonly preset: string;
  readonly template: CreateTemplate;
  readonly pointer: boolean;
  readonly rtl: boolean;
  /** Defaults to {@link DEFAULT_PROJECT_NAME}. */
  readonly name?: string;
}

/** `zard-cli create` — scaffolds a new project already configured with the preset. */
export function newProjectCommand(options: NewProjectOptions): string {
  const parts = [
    runnerFor(options.manager),
    'create',
    options.name ?? DEFAULT_PROJECT_NAME,
    '--preset',
    options.preset,
    '--template',
    options.template,
  ];
  if (options.pointer) parts.push('--pointer');
  if (options.rtl) parts.push('--rtl');
  return parts.join(' ');
}

/**
 * `apply --preset …` for an existing project, whole or in parts (`--only`). Not `init`: init rewrites the global CSS,
 * while apply replaces only the regions zard-cli manages and keeps every rule of the user's own. The project must
 * already be initialized (`zard-cli init`), which apply says when it is not. Apply never prompts.
 */
export function existingProjectCommand(options: {
  readonly manager: PackageManager;
  readonly preset: string;
  readonly scope: ApplyScope;
}): string {
  const runner = runnerFor(options.manager);

  switch (options.scope) {
    case 'full':
      return `${runner} apply --preset ${options.preset}`;
    case 'theme':
      return `${runner} apply --preset ${options.preset} --only theme`;
    case 'font':
      return `${runner} apply --preset ${options.preset} --only font`;
  }
}

export function isPackageManager(value: unknown): value is PackageManager {
  return (PACKAGE_MANAGERS as readonly unknown[]).includes(value);
}
