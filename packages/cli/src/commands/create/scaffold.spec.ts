import {
  describeCommand,
  runScaffold,
  scaffoldCommandFor,
  type ScaffoldOptions,
} from '@cli/commands/create/scaffold.js';
import { CliError } from '@cli/utils/errors.js';

jest.mock('execa', () => ({ execa: jest.fn() }));

const { execa } = jest.requireMock('execa') as { execa: jest.Mock };

const base: ScaffoldOptions = {
  name: 'demo',
  template: 'angular',
  packageManager: 'npm',
  install: true,
  git: true,
};

/**
 * Os testes olham para o comando montado, e não para a execução.
 *
 * Rodar `ng new` de verdade levaria minutos, baixaria meio npm e dependeria da
 * rede — e não é isso que quebra. O que quebra é uma flag renomeada num gerador
 * de terceiros, e é exatamente isso que estas asserções congelam.
 */
describe('scaffoldCommandFor', () => {
  it('builds the Angular generator command', () => {
    expect(describeCommand(scaffoldCommandFor(base))).toBe(
      'npx -y @angular/cli@latest new demo --style=css --ssr=false --package-manager=npm --defaults',
    );
  });

  it('creates no application for an Angular library', () => {
    const command = scaffoldCommandFor({ ...base, template: 'angular-library' });

    expect(command.args).toContain('--create-application=false');
  });

  it('passes the chosen package manager through', () => {
    for (const packageManager of ['npm', 'pnpm', 'yarn', 'bun'] as const) {
      expect(scaffoldCommandFor({ ...base, packageManager }).args).toContain(`--package-manager=${packageManager}`);
    }
  });

  it('skips install and git when asked to', () => {
    const command = scaffoldCommandFor({ ...base, install: false, git: false });

    expect(command.args).toContain('--skip-install');
    expect(command.args).toContain('--skip-git');
  });

  it('leaves install and git alone by default', () => {
    expect(scaffoldCommandFor(base).args).not.toContain('--skip-install');
    expect(scaffoldCommandFor(base).args).not.toContain('--skip-git');
  });

  it('builds the Nx generator command, standalone or monorepo', () => {
    expect(describeCommand(scaffoldCommandFor({ ...base, template: 'nx' }))).toBe(
      'npx -y create-nx-workspace@latest demo --preset=angular-standalone --style=css --e2eTestRunner=none ' +
        '--nxCloud=skip --packageManager=npm --interactive=false',
    );
    expect(scaffoldCommandFor({ ...base, template: 'nx-library' }).args).toContain('--preset=angular-monorepo');
  });

  /**
   * O create-nx-workspace não expõe nada equivalente a --skip-install: ele
   * precisa das dependências para rodar os próprios generators. Marcar isso é o
   * que permite ao relatório dizer a verdade em vez de prometer o que não houve.
   */
  it('says that Nx installs regardless of --no-install', () => {
    const command = scaffoldCommandFor({ ...base, template: 'nx', install: false });

    expect(command.alwaysInstalls).toBe(true);
    expect(command.args).not.toContain('--skip-install');
  });

  it('builds the Analog generator command and flags that it needs a terminal', () => {
    const command = scaffoldCommandFor({ ...base, template: 'analog' });

    expect(describeCommand(command)).toBe('npx -y create-analog@latest demo');
    expect(command.needsTerminal).toBe(true);
  });

  it('never puts the project name inside a shell string', () => {
    // O nome entra como um argumento próprio; montá-lo numa linha de shell
    // faria de um nome com espaço ou aspas uma injeção de comando.
    const command = scaffoldCommandFor({ ...base, name: 'my app' });

    expect(command.args).toContain('my app');
  });
});

describe('runScaffold', () => {
  beforeEach(() => execa.mockReset());

  it('runs the generator in the directory it was given', async () => {
    execa.mockResolvedValue({});

    await runScaffold({ ...base, cwd: '/projects', interactive: true });

    expect(execa).toHaveBeenCalledWith(
      'npx',
      expect.arrayContaining(['@angular/cli@latest', 'new', 'demo']),
      expect.objectContaining({ cwd: '/projects', stdio: 'inherit' }),
    );
  });

  it('refuses to start a generator that needs a terminal it does not have', async () => {
    await expect(runScaffold({ ...base, template: 'analog', cwd: '/projects', interactive: false })).rejects.toThrow(
      CliError,
    );
    expect(execa).not.toHaveBeenCalled();
  });

  /** Falhar sem o comando à mão obriga quem está lendo a reconstruí-lo de memória. */
  it('hands back the command to run by hand when the generator fails', async () => {
    execa.mockRejectedValue(new Error('exit 1'));

    await expect(runScaffold({ ...base, cwd: '/projects', interactive: true })).rejects.toThrow(
      /npx -y @angular\/cli@latest new demo/,
    );
  });
});
