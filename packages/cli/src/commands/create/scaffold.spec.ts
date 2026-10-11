const execaMock = jest.fn();
jest.mock('execa', () => ({ execa: (...args: unknown[]) => execaMock(...args) }));

import { generatorEnv, runScaffold } from '@cli/commands/create/scaffold.js';
import { templateById } from '@cli/commands/create/templates.js';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

describe('generatorEnv', () => {
  it('drops the switches that put Nx into agent mode and keeps everything else', () => {
    const env = generatorEnv({ PATH: '/bin', CLAUDECODE: '1', OPENCODE: '1', CLAUDE_CODE: '1', HOME: '/home/me' });

    expect(env).toEqual({ PATH: '/bin', HOME: '/home/me', NX_DAEMON: 'false' });
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
});
