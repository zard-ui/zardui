const execaMock = jest.fn();
jest.mock('execa', () => ({ execa: (...args: unknown[]) => execaMock(...args) }));

import { failureHint, generatorEnv, runScaffold } from '@cli/commands/create/scaffold.js';
import { templateById } from '@cli/commands/create/templates.js';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

describe('generatorEnv', () => {
  it('drops the switches that put Nx into agent mode and keeps everything else', () => {
    const env = generatorEnv({ PATH: '/bin', CLAUDECODE: '1', OPENCODE: '1', CLAUDE_CODE: '1', HOME: '/home/me' });

    expect(env).toEqual({
      PATH: '/bin',
      HOME: '/home/me',
      NX_DAEMON: 'false',
      NG_FORCE_AUTOCOMPLETE: 'false',
      NG_CLI_ANALYTICS: 'false',
      NX_PLUGIN_NO_TIMEOUTS: 'true',
    });
  });

  it('switches off the ng new prompts that flags cannot answer', () => {
    const env = generatorEnv({ PATH: '/bin' });

    expect(env['NG_FORCE_AUTOCOMPLETE']).toBe('false');
    expect(env['NG_CLI_ANALYTICS']).toBe('false');
  });

  it('does not override a value the user set explicitly', () => {
    const env = generatorEnv({ NG_FORCE_AUTOCOMPLETE: 'true', NG_CLI_ANALYTICS: 'true' });

    expect(env['NG_FORCE_AUTOCOMPLETE']).toBe('true');
    expect(env['NG_CLI_ANALYTICS']).toBe('true');
  });
});

describe('Nx plugin worker timeouts', () => {
  it('lifts the 30 s limit unless the user chose a value', () => {
    expect(generatorEnv({})['NX_PLUGIN_NO_TIMEOUTS']).toBe('true');
    expect(generatorEnv({ NX_PLUGIN_NO_TIMEOUTS: 'false' })['NX_PLUGIN_NO_TIMEOUTS']).toBe('false');
  });

  it('names the likely cause and the variable when the Nx step fails', () => {
    expect(failureHint('nx')).toContain('plugin worker');
    expect(failureHint('nx')).toContain('NX_PLUGIN_NO_TIMEOUTS');
  });

  it('adds nothing for the other templates', () => {
    expect(failureHint('angular')).toBe('');
    expect(failureHint('analog')).toBe('');
  });
});

describe('runScaffold', () => {
  const template = templateById('analog') as NonNullable<ReturnType<typeof templateById>>;

  beforeEach(() => execaMock.mockReset());

  it('checks the package manager first, then runs each command, installing inside the project', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'zard-scaffold-'));
    execaMock.mockResolvedValue({ stdout: '10.0.0' });

    const target = await runScaffold({ cwd, name: 'blog', template, packageManager: 'npm' });

    expect(target).toBe(path.join(cwd, 'blog'));
    const runs = execaMock.mock.calls.map(([command, args, options]) => ({ command, args, cwd: options?.cwd }));
    expect(runs[0]).toMatchObject({ command: 'npm', args: ['--version'] });
    expect(runs[1]).toMatchObject({ command: 'npx', cwd });
    expect(runs[2]).toMatchObject({ command: 'npm', args: ['install'], cwd: path.join(cwd, 'blog') });
  });

  it('names --package-manager and creates nothing when the manager is missing', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'zard-scaffold-'));
    execaMock.mockRejectedValueOnce(new Error('ENOENT'));

    await expect(runScaffold({ cwd, name: 'blog', template, packageManager: 'bun' })).rejects.toThrow(
      '--package-manager',
    );
    expect(execaMock).toHaveBeenCalledTimes(1);
  });

  it('removes the directory the generator left behind when it fails', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'zard-scaffold-'));
    const target = path.join(cwd, 'blog');
    execaMock.mockResolvedValueOnce({ stdout: '10.0.0' }).mockImplementationOnce(async () => {
      await mkdir(target);
      throw new Error('generator exploded');
    });

    await expect(runScaffold({ cwd, name: 'blog', template, packageManager: 'npm' })).rejects.toMatchObject({
      code: 'SCAFFOLD_FAILED',
    });
    expect(existsSync(target)).toBe(false);
  });

  it('uses npx for yarn classic, which has no dlx', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'zard-scaffold-'));
    execaMock.mockResolvedValue({ stdout: '1.22.22' });

    await runScaffold({ cwd, name: 'blog', template, packageManager: 'yarn' });

    expect(execaMock.mock.calls[1]?.[0]).toBe('npx');
  });

  it.each(['npm', 'yarn', 'bun'] as const)('writes no pnpm configuration for %s', async packageManager => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'zard-scaffold-'));
    execaMock.mockResolvedValue({ stdout: '10.0.0' });

    await runScaffold({ cwd, name: 'blog', template, packageManager });

    expect(existsSync(path.join(cwd, 'blog', 'pnpm-workspace.yaml'))).toBe(false);
  });
});

describe('runScaffold with pnpm 11', () => {
  const template = templateById('analog') as NonNullable<ReturnType<typeof templateById>>;

  beforeEach(() => execaMock.mockReset());

  it('approves the known build scripts in the project before the install, so strict-dep-builds passes', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'zard-scaffold-'));
    const target = path.join(cwd, 'blog');
    let atInstall = '';
    execaMock.mockImplementation(async (command: string, args: string[]) => {
      if (command === 'pnpm' && args[0] === 'install')
        atInstall = await readFile(path.join(target, 'pnpm-workspace.yaml'), 'utf8');
      // create-analog makes the directory.
      if (command === 'pnpm' && args[0] === 'dlx') await mkdir(target);
      return { stdout: '11.18.0' };
    });

    await runScaffold({ cwd, name: 'blog', template, packageManager: 'pnpm' });

    for (const name of ['@parcel/watcher', 'esbuild', 'lmdb', 'msgpackr-extract']) {
      expect(atInstall).toContain(`"${name}": true`);
      expect(atInstall).toContain(`- "${name}"`);
    }
    const install = execaMock.mock.calls.find(([, args]) => args[0] === 'install');
    expect(install?.[1]).toEqual(['install']);
  });

  it('keeps a pnpm-workspace.yaml the generator wrote', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'zard-scaffold-'));
    const target = path.join(cwd, 'blog');
    execaMock.mockImplementation(async (command: string, args: string[]) => {
      if (command === 'pnpm' && args[0] === 'dlx') {
        await mkdir(target);
        await writeFile(path.join(target, 'pnpm-workspace.yaml'), 'packages: []\n');
      }
      return { stdout: '11.18.0' };
    });

    await runScaffold({ cwd, name: 'blog', template, packageManager: 'pnpm' });

    expect(await readFile(path.join(target, 'pnpm-workspace.yaml'), 'utf8')).toBe('packages: []\n');
  });
});

describe('runScaffold output', () => {
  const analog = templateById('analog') as NonNullable<ReturnType<typeof templateById>>;
  const angular = templateById('angular') as NonNullable<ReturnType<typeof templateById>>;

  beforeEach(() => execaMock.mockReset());

  it('captures the output of create-analog, which prints its own "Now run" block', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'zard-scaffold-'));
    execaMock.mockResolvedValue({ stdout: 'Done. Now run: npm install' });

    await runScaffold({ cwd, name: 'blog', template: analog, packageManager: 'npm' });

    const [generator, install] = [execaMock.mock.calls[1]?.[2], execaMock.mock.calls[2]?.[2]];
    expect(generator).toMatchObject({ stdout: 'pipe', stderr: 'pipe' });
    expect(install).toMatchObject({ stdout: 'inherit', stderr: 'inherit' });
  });

  it('keeps showing the output of the other generators', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'zard-scaffold-'));
    execaMock.mockResolvedValue({ stdout: '10.0.0' });

    await runScaffold({ cwd, name: 'blog', template: angular, packageManager: 'npm' });

    expect(execaMock.mock.calls[1]?.[2]).toMatchObject({ stdout: 'inherit', stderr: 'inherit' });
  });
});
