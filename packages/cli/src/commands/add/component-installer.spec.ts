jest.mock('@cli/utils/registry.js', () => ({
  fetchComponent: jest.fn(),
}));

jest.mock('@cli/utils/logger.js', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('node:fs', () => {
  const actual = jest.requireActual('node:fs');
  return {
    ...actual,
    promises: {
      mkdir: jest.fn().mockResolvedValue(undefined),
      writeFile: jest.fn().mockResolvedValue(undefined),
      unlink: jest.fn().mockResolvedValue(undefined),
    },
  };
});

import { installComponent, validateTargetPath } from '@cli/commands/add/component-installer.js';
import { Config } from '@cli/utils/config.js';
import { CliError, InstallError } from '@cli/utils/errors.js';
import { fetchComponent } from '@cli/utils/registry.js';
import { promises as fs } from 'node:fs';

const mockFetchComponent = fetchComponent as jest.MockedFunction<typeof fetchComponent>;
const mockMkdir = fs.mkdir as jest.MockedFunction<typeof fs.mkdir>;
const mockWriteFile = fs.writeFile as jest.MockedFunction<typeof fs.writeFile>;
const mockUnlink = fs.unlink as jest.MockedFunction<typeof fs.unlink>;

const fakeConfig: Config & { resolvedPaths: any } = {
  style: 'css',
  appConfigFile: 'src/app/app.config.ts',
  packageManager: 'npm',
  tailwind: { css: 'src/styles.css', baseColor: 'slate' },
  baseUrl: 'src/app',
  aliases: {
    components: '@/shared/components',
    utils: '@/shared/utils',
    core: '@/shared/core',
    services: '@/shared/services',
  },
  resolvedPaths: {
    tailwindCss: '/project/src/styles.css',
    baseUrl: '/project/src/app',
    components: '/project/src/app/shared/components',
    utils: '/project/src/app/shared/utils',
    core: '/project/src/app/shared/core',
    services: '/project/src/app/shared/services',
  },
};

describe('validateTargetPath', () => {
  it('should accept paths within project root', () => {
    expect(() => validateTargetPath('/project/src/app/shared/components/button', '/project')).not.toThrow();
  });

  it('should accept the project root itself', () => {
    expect(() => validateTargetPath('/project', '/project')).not.toThrow();
  });

  it('should throw CliError for path traversal above project root', () => {
    expect(() => validateTargetPath('/project/../outside', '/project')).toThrow(CliError);
  });

  it('should throw CliError for completely different path', () => {
    expect(() => validateTargetPath('/other/path', '/project')).toThrow(CliError);
  });
});

describe('installComponent', () => {
  beforeEach(() => {
    mockFetchComponent.mockReset();
    mockMkdir.mockReset();
    mockWriteFile.mockReset();
    mockUnlink.mockReset();

    mockMkdir.mockResolvedValue(undefined);
    mockWriteFile.mockResolvedValue(undefined);
    mockUnlink.mockResolvedValue(undefined);
  });

  it('should create directories and write files', async () => {
    mockFetchComponent.mockResolvedValueOnce({
      name: 'button',
      type: 'registry:component',
      files: [
        { name: 'button.component.ts', content: 'export class Button {}' },
        { name: 'button.component.css', content: '.button { color: red; }' },
      ],
    });

    await installComponent('button', '/project/src/components/button', fakeConfig);

    expect(mockMkdir).toHaveBeenCalledWith('/project/src/components/button', {
      recursive: true,
    });
    expect(mockWriteFile).toHaveBeenCalledWith(
      '/project/src/components/button/button.component.ts',
      'export class Button {}',
      'utf8',
    );
    expect(mockWriteFile).toHaveBeenCalledWith(
      '/project/src/components/button/button.component.css',
      '.button { color: red; }',
      'utf8',
    );
  });

  it('should rollback written files on error', async () => {
    mockFetchComponent.mockResolvedValueOnce({
      name: 'button',
      type: 'registry:component',
      files: [
        { name: 'file1.ts', content: 'content1' },
        { name: 'file2.ts', content: 'content2' },
        { name: 'file3.ts', content: 'content3' },
      ],
    });

    // First two files succeed, third fails
    mockWriteFile
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('disk full'));

    await expect(installComponent('button', '/project/src/components/button', fakeConfig)).rejects.toThrow(
      InstallError,
    );

    // Should attempt to unlink the two successfully written files
    expect(mockUnlink).toHaveBeenCalledWith('/project/src/components/button/file1.ts');
    expect(mockUnlink).toHaveBeenCalledWith('/project/src/components/button/file2.ts');
    // file3 was never written, so we should only have 2 unlink calls
    expect(mockUnlink).toHaveBeenCalledTimes(2);
  });

  it('should throw InstallError with the component name on failure', async () => {
    mockFetchComponent.mockResolvedValueOnce({
      name: 'dialog',
      type: 'registry:component',
      files: [{ name: 'dialog.ts', content: 'content' }],
    });

    mockWriteFile.mockRejectedValueOnce(new Error('permission denied'));

    try {
      await installComponent('dialog', '/project/src/components/dialog', fakeConfig);
      fail('Expected installComponent to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(InstallError);
      expect((error as InstallError).component).toBe('dialog');
    }
  });
});
