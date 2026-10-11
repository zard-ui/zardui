/**
 * The order of `create`: every check before the first write, then scaffold, init, add.
 *
 * The collaborators are replaced by recorders, so what is asserted is the sequence and the
 * arguments — not the generators, which only a real run can vouch for.
 */

jest.mock('@antfu/ni', () => ({ detect: jest.fn() }));

const calls: string[] = [];

jest.mock('@cli/commands/create/scaffold.js', () => ({
  runScaffold: jest.fn(async (plan: { cwd: string; name: string }) => {
    calls.push('scaffold');
    return `${plan.cwd}/${plan.name}`;
  }),
}));
jest.mock('@cli/commands/init/index.js', () => ({
  initWithPreset: jest.fn(async () => {
    calls.push('init');
  }),
}));
jest.mock('@cli/commands/add/index.js', () => ({
  runAdd: jest.fn(async () => {
    calls.push('add');
  }),
}));
jest.mock('@cli/utils/http-client.js', () => ({
  fetchJson: jest.fn(async () => {
    calls.push('registry');
    return {};
  }),
}));
jest.mock('@cli/utils/icon-catalog.js', () => ({
  loadIconCatalog: jest.fn(async () => undefined),
  assertIconFamily: jest.fn(),
}));
jest.mock('@cli/utils/design-catalog.js', () => ({ loadDesignData: jest.fn(async () => undefined) }));
jest.mock('@cli/ui/index.js', () => ({
  ...jest.requireActual('@cli/ui/index.js'),
  isInteractive: jest.fn(() => false),
  printReport: jest.fn(),
}));

import { runAdd } from '@cli/commands/add/index.js';
import { runCreate } from '@cli/commands/create/index.js';
import { runScaffold } from '@cli/commands/create/scaffold.js';
import { initWithPreset } from '@cli/commands/init/index.js';
import { CliError } from '@cli/utils/errors.js';
import { fetchJson } from '@cli/utils/http-client.js';
import { mkdir, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

const fresh = (): Promise<string> => mkdtemp(path.join(tmpdir(), 'zard-create-flow-'));

beforeEach(() => {
  calls.length = 0;
  jest.clearAllMocks();
});

describe('runCreate', () => {
  it('checks the registry, then scaffolds, then inits with the preset, then adds button', async () => {
    const cwd = await fresh();

    await runCreate({ cwd, name: 'app', template: 'nx', preset: 'Z6KtfCaQt', rtl: true, pointer: true, yes: true });

    expect(calls).toEqual(['registry', 'scaffold', 'init', 'add']);
    expect(runScaffold).toHaveBeenCalledWith(expect.objectContaining({ name: 'app', packageManager: 'npm' }));
    expect(initWithPreset).toHaveBeenCalledWith({
      cwd: path.join(cwd, 'app'),
      preset: 'Z6KtfCaQt',
      type: 'nx',
      rtl: true,
      pointer: true,
    });
    expect(runAdd).toHaveBeenCalledWith(
      ['button'],
      expect.objectContaining({ cwd: path.join(cwd, 'app'), yes: true, headless: true }),
    );
  });

  it('uses the default design with --yes and no --preset', async () => {
    const cwd = await fresh();

    await runCreate({ cwd, name: 'app', template: 'angular', yes: true });

    expect(initWithPreset).toHaveBeenCalledWith(expect.objectContaining({ preset: 'Z0', type: 'angular' }));
  });

  describe('refuses before scaffolding anything', () => {
    it('a preset that is not zard’s', async () => {
      const cwd = await fresh();

      await expect(
        runCreate({ cwd, name: 'app', template: 'angular', preset: 'b2D0wqNxT', yes: true }),
      ).rejects.toThrow('b2D0wqNxT');
      expect(calls).toEqual([]);
    });

    it('a target directory that exists', async () => {
      const cwd = await fresh();
      await mkdir(path.join(cwd, 'app'));

      await expect(runCreate({ cwd, name: 'app', template: 'angular', preset: 'Z0', yes: true })).rejects.toThrow(
        'already exists',
      );
      expect(calls).toEqual([]);
    });

    it.each([
      ['--template', { name: 'app', preset: 'Z0', yes: true }],
      ['project name', { template: 'angular', preset: 'Z0', yes: true }],
      ['--preset', { name: 'app', template: 'angular' }],
    ])('a missing %s when there is no terminal', async (named, options) => {
      const cwd = await fresh();

      await expect(runCreate({ cwd, ...options })).rejects.toThrow(named);
      expect(calls).toEqual([]);
    });

    it('a registry that cannot be reached, without leaving a project behind', async () => {
      const cwd = await fresh();
      (fetchJson as jest.Mock).mockRejectedValueOnce(new Error('Connection failed'));

      const failure = runCreate({ cwd, name: 'app', template: 'angular', preset: 'Z0', yes: true });

      await expect(failure).rejects.toMatchObject({ code: 'REGISTRY_UNREACHABLE' });
      await expect(failure).rejects.toBeInstanceOf(CliError);
      expect(runScaffold).not.toHaveBeenCalled();
    });
  });

  it('keeps the project and says how to resume when configuring it fails', async () => {
    const cwd = await fresh();
    (initWithPreset as jest.Mock).mockRejectedValueOnce(new Error('boom'));

    await expect(runCreate({ cwd, name: 'app', template: 'analog', preset: 'Z0', yes: true })).rejects.toThrow('boom');

    expect(calls).toEqual(['registry', 'scaffold']);
    expect(runAdd).not.toHaveBeenCalled();
  });
});
