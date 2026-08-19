import { assertDirectoryAvailable, assertProjectName, projectNameProblem } from '@cli/commands/create/project-name.js';
import { CliError } from '@cli/utils/errors.js';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

describe('projectNameProblem', () => {
  it('accepts the names npm accepts', () => {
    for (const name of ['demo', 'my-app', 'app_2', 'zard.demo', 'a']) {
      expect(projectNameProblem(name)).toBeNull();
    }
  });

  it('rejects an empty name', () => {
    expect(projectNameProblem('  ')).toMatch(/Enter a name/);
  });

  it('suggests the lowercase form instead of only refusing', () => {
    expect(projectNameProblem('MyApp')).toBe('Package names are lowercase — try myapp.');
  });

  it('rejects the characters a package name cannot hold', () => {
    for (const name of ['my app', 'app/name', 'app@1', 'app!']) {
      expect(projectNameProblem(name)).toMatch(/lowercase letters, digits/);
    }
  });

  it('rejects a leading dot, which would hide the directory', () => {
    expect(projectNameProblem('.demo')).toMatch(/cannot start with a dot/);
  });

  it('rejects a name longer than npm allows', () => {
    expect(projectNameProblem('a'.repeat(215))).toMatch(/214 characters/);
  });

  it('throws with the name in the message', () => {
    expect(() => assertProjectName('My App')).toThrow(/"My App" cannot be a project name/);
    expect(() => assertProjectName('My App')).toThrow(CliError);
  });
});

describe('assertDirectoryAvailable', () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(path.join(tmpdir(), 'zard-create-'));
  });

  afterEach(() => rm(directory, { recursive: true, force: true }));

  it('accepts a name with no directory behind it', () => {
    expect(assertDirectoryAvailable(directory, 'demo')).toBe(path.resolve(directory, 'demo'));
  });

  it('accepts an empty directory', async () => {
    await mkdir(path.join(directory, 'demo'));

    expect(() => assertDirectoryAvailable(directory, 'demo')).not.toThrow();
  });

  /**
   * Um `.git` recém-inicializado não é conteúdo. Parar por causa dele obrigaria
   * a apagar um diretório que, para quem olha, está vazio.
   */
  it('ignores the leftovers a generator would ignore too', async () => {
    await mkdir(path.join(directory, 'demo', '.git'), { recursive: true });
    await writeFile(path.join(directory, 'demo', '.DS_Store'), '', 'utf8');

    expect(() => assertDirectoryAvailable(directory, 'demo')).not.toThrow();
  });

  it('refuses a directory with files in it, and says nothing was written', async () => {
    await mkdir(path.join(directory, 'demo'));
    await writeFile(path.join(directory, 'demo', 'index.ts'), '', 'utf8');

    expect(() => assertDirectoryAvailable(directory, 'demo')).toThrow(/already has files in it/);
    expect(() => assertDirectoryAvailable(directory, 'demo')).toThrow(/nothing was written/);
  });
});
