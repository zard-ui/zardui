import {
  assertHeadlessComplete,
  nameProblem,
  packageManagerFromEnvironment,
  parseFlags,
  targetProblem,
} from '@cli/commands/create/options.js';
import { CliError } from '@cli/utils/errors.js';
import { mkdir, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

const codeOf = (fn: () => unknown): string | undefined => {
  try {
    fn();
  } catch (error) {
    return error instanceof CliError ? error.code : 'OTHER';
  }
  return undefined;
};

describe('nameProblem', () => {
  it.each(['app', 'my-app', 'app2', 'a'])('accepts %s', name => {
    expect(nameProblem(name)).toBeUndefined();
  });

  it.each(['', 'App', '2app', 'my app', 'a_b', '-x'])('rejects %j', name => {
    expect(nameProblem(name)).toBeDefined();
  });

  it.each(['.', '..', 'a/b', 'a\\b', '../x'])('refuses the path %j and points at --cwd', name => {
    expect(nameProblem(name)).toContain('--cwd');
  });
});

describe('targetProblem', () => {
  it('refuses a name that already exists, empty or not', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'zard-create-'));
    await mkdir(path.join(cwd, 'taken'));

    expect(targetProblem(cwd, 'taken')).toContain('already exists');
    expect(targetProblem(cwd, 'free')).toBeUndefined();
  });
});

describe('parseFlags', () => {
  it('names the template that does not exist', () => {
    expect(() => parseFlags({ template: 'vue' })).toThrow('--template "vue"');
    expect(codeOf(() => parseFlags({ template: 'vue' }))).toBe('UNKNOWN_TEMPLATE');
  });

  it('names the package manager that does not exist', () => {
    expect(() => parseFlags({ packageManager: 'pip' })).toThrow('--package-manager "pip"');
  });

  it('rejects a foreign preset, naming it, before anything else is looked at', () => {
    expect(() => parseFlags({ preset: 'b2D0wqNxT', name: 'Bad Name' })).toThrow('b2D0wqNxT');
    expect(codeOf(() => parseFlags({ preset: 'b2D0wqNxT' }))).toBe('INVALID_PRESET');
  });

  it('refuses an existing target directory', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'zard-create-'));
    await mkdir(path.join(cwd, 'taken'));

    expect(codeOf(() => parseFlags({ cwd, name: 'taken' }))).toBe('INVALID_NAME');
  });

  it('resolves the template, the canonical preset code and the manager', () => {
    const parsed = parseFlags({ template: 'nx', preset: '--preset Z0', packageManager: 'pnpm', name: 'zz-new-app' });

    expect(parsed.template?.value).toBe('nx');
    expect(parsed.preset?.code).toBe('Z0');
    expect(parsed.packageManager).toBe('pnpm');
  });

  it('leaves everything it was not given undefined, so the wizard can ask', () => {
    const parsed = parseFlags({});

    expect(parsed.template).toBeUndefined();
    expect(parsed.preset).toBeUndefined();
    expect(parsed.name).toBeUndefined();
  });
});

describe('packageManagerFromEnvironment', () => {
  it.each([
    ['pnpm/9.0.0 npm/? node/v22', 'pnpm'],
    ['yarn/4.1.0 npm/? node/v22', 'yarn'],
    ['bun/1.3.0 npm/? node/v22', 'bun'],
    ['npm/10.0.0 node/v22', 'npm'],
    ['', 'npm'],
    ['something/1', 'npm'],
  ])('reads %j as %s', (agent, expected) => {
    expect(packageManagerFromEnvironment(agent)).toBe(expected);
  });
});

describe('assertHeadlessComplete', () => {
  const full = { template: 'angular', name: 'app', preset: 'Z0' };

  it('passes when everything is on the command line', () => {
    const options = { ...full, cwd: tmpdir(), name: 'zz-no-such-dir' };
    expect(() => assertHeadlessComplete(options, parseFlags(options))).not.toThrow();
  });

  it('always asks for the template by name, even with --yes', () => {
    const options = { name: 'zz-no-such-dir', cwd: tmpdir(), preset: 'Z0', yes: true };
    expect(() => assertHeadlessComplete(options, parseFlags(options))).toThrow('--template');
  });

  it('asks for the project name', () => {
    const options = { template: 'angular', preset: 'Z0', yes: true };
    expect(() => assertHeadlessComplete(options, parseFlags(options))).toThrow('project name');
  });

  it('asks for --preset without --yes, and accepts the default with it', () => {
    const base = { template: 'angular' };
    const parsed = parseFlags({ ...base, cwd: tmpdir(), name: 'zz-no-such-dir' });

    expect(() => assertHeadlessComplete(base, parsed)).toThrow('--preset');
    expect(() => assertHeadlessComplete({ ...base, yes: true }, parsed)).not.toThrow();
  });
});
