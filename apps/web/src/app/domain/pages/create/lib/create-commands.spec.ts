import { DEFAULT_PROJECT_NAME, existingProjectCommand, newProjectCommand, PACKAGE_MANAGERS } from './create-commands';

describe('create commands', () => {
  const base = { preset: 'Z3k', template: 'angular', pointer: false, rtl: false } as const;

  it.each([
    ['npm', 'npx zard-cli@latest create my-app --preset Z3k --template angular'],
    ['pnpm', 'pnpm dlx zard-cli@latest create my-app --preset Z3k --template angular'],
    ['yarn', 'yarn dlx zard-cli@latest create my-app --preset Z3k --template angular'],
    ['bun', 'bunx zard-cli@latest create my-app --preset Z3k --template angular'],
  ] as const)('prints the new-project command for %s', (manager, command) => {
    expect(newProjectCommand({ ...base, manager })).toBe(command);
  });

  it('appends the switches in a fixed order', () => {
    expect(newProjectCommand({ ...base, manager: 'npm', template: 'nx', pointer: true, rtl: true })).toBe(
      'npx zard-cli@latest create my-app --preset Z3k --template nx --pointer --rtl',
    );
    expect(newProjectCommand({ ...base, manager: 'npm', template: 'analog', rtl: true })).toBe(
      'npx zard-cli@latest create my-app --preset Z3k --template analog --rtl',
    );
  });

  it('prints init for the full preset and apply --only for its parts', () => {
    expect(existingProjectCommand({ manager: 'npm', preset: 'Z3k', scope: 'full' })).toBe(
      'npx zard-cli@latest init --preset Z3k --yes',
    );
    expect(existingProjectCommand({ manager: 'pnpm', preset: 'Z3k', scope: 'theme' })).toBe(
      'pnpm dlx zard-cli@latest apply --preset Z3k --only theme',
    );
    expect(existingProjectCommand({ manager: 'bun', preset: 'Z3k', scope: 'font' })).toBe(
      'bunx zard-cli@latest apply --preset Z3k --only font',
    );
  });

  it('always names the project, so the command never has to ask', () => {
    expect(DEFAULT_PROJECT_NAME).toBe('my-app');
    expect(newProjectCommand({ ...base, manager: 'npm', name: 'shop' })).toBe(
      'npx zard-cli@latest create shop --preset Z3k --template angular',
    );
  });

  it('lists the four package managers', () => {
    expect(PACKAGE_MANAGERS).toEqual(['npm', 'pnpm', 'yarn', 'bun']);
  });
});
