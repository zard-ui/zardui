import { DEFAULT_PROJECT_NAME, existingProjectCommand, newProjectCommand, PACKAGE_MANAGERS } from './create-commands';

describe('create commands', () => {
  const base = { preset: 'Z3k', template: 'angular', pointer: false, rtl: false } as const;

  it.each([
    ['npm', 'npx zard-cli@latest create my-app --preset Z3k --template angular'],
    ['pnpm', 'pnpm dlx zard-cli@latest create my-app --preset Z3k --template angular'],
    ['yarn', 'npx zard-cli@latest create my-app --preset Z3k --template angular --package-manager yarn'],
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

  it('never prints yarn dlx, which Yarn Classic does not have', () => {
    for (const manager of PACKAGE_MANAGERS) {
      expect(newProjectCommand({ ...base, manager })).not.toContain('yarn dlx');
      expect(existingProjectCommand({ manager, preset: 'Z3k', scope: 'full' })).not.toContain('yarn dlx');
    }
    expect(existingProjectCommand({ manager: 'yarn', preset: 'Z3k', scope: 'full' })).toBe(
      'npx zard-cli@latest apply --preset Z3k',
    );
  });

  it('prints apply for the whole preset, never init, and apply --only for its parts', () => {
    expect(existingProjectCommand({ manager: 'npm', preset: 'Z3k', scope: 'full' })).toBe(
      'npx zard-cli@latest apply --preset Z3k',
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
