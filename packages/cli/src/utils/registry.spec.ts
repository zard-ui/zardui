jest.mock('@cli/utils/http-client.js', () => ({
  fetchJson: jest.fn(),
}));

import { Config } from '@cli/utils/config.js';
import { ConfigError } from '@cli/utils/errors.js';
import { fetchJson } from '@cli/utils/http-client.js';
import {
  fetchComponent,
  fetchComponentFromRegistry,
  fetchRegistryIndex,
  invalidateRegistryCache,
  transformContent,
  validateRegistryUrl,
} from '@cli/utils/registry.js';

const mockFetchJson = fetchJson as jest.MockedFunction<typeof fetchJson>;

const fakeRegistryIndex = {
  $schema: 'https://zardui.com/schema.json',
  name: 'zardui',
  homepage: 'https://zardui.com',
  version: '1.0.0',
  items: [
    {
      name: 'button',
      type: 'registry:component',
      dependencies: ['@angular/cdk'],
      registryDependencies: ['core'],
      files: ['button.component.ts'],
    },
  ],
};

const fakeConfig: Config = {
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
};

describe('validateRegistryUrl', () => {
  it('should accept https URLs', () => {
    expect(() => validateRegistryUrl('https://zardui.com/r')).not.toThrow();
  });

  it('should accept localhost', () => {
    expect(() => validateRegistryUrl('http://localhost:3000/r')).not.toThrow();
  });

  it('should accept 127.0.0.1', () => {
    expect(() => validateRegistryUrl('http://127.0.0.1:4200/r')).not.toThrow();
  });

  it('should reject http non-localhost URLs', () => {
    expect(() => validateRegistryUrl('http://zardui.com/r')).toThrow(ConfigError);
    expect(() => validateRegistryUrl('http://zardui.com/r')).toThrow(/HTTPS/);
  });

  it('should reject invalid URLs', () => {
    expect(() => validateRegistryUrl('not-a-url')).toThrow(ConfigError);
    expect(() => validateRegistryUrl('not-a-url')).toThrow(/Invalid registry URL/);
  });
});

describe('fetchRegistryIndex', () => {
  beforeEach(() => {
    invalidateRegistryCache();
    mockFetchJson.mockReset();
  });

  it('should fetch from the correct URL', async () => {
    mockFetchJson.mockResolvedValueOnce(fakeRegistryIndex);

    const result = await fetchRegistryIndex('https://example.com/r');

    expect(mockFetchJson).toHaveBeenCalledWith('https://example.com/r/registry.json');
    expect(result).toEqual(fakeRegistryIndex);
  });

  it('should cache results on subsequent calls', async () => {
    mockFetchJson.mockResolvedValueOnce(fakeRegistryIndex);

    await fetchRegistryIndex('https://example.com/r');
    const result = await fetchRegistryIndex('https://example.com/r');

    expect(mockFetchJson).toHaveBeenCalledTimes(1);
    expect(result).toEqual(fakeRegistryIndex);
  });

  it('should respect cache TTL', async () => {
    mockFetchJson.mockResolvedValue(fakeRegistryIndex);

    await fetchRegistryIndex('https://example.com/r');

    // Advance past 5 minute TTL
    const originalDateNow = Date.now;
    const startTime = originalDateNow.call(Date);
    Date.now = () => startTime + 6 * 60 * 1000;

    try {
      await fetchRegistryIndex('https://example.com/r');
      expect(mockFetchJson).toHaveBeenCalledTimes(2);
    } finally {
      Date.now = originalDateNow;
    }
  });
});

describe('invalidateRegistryCache', () => {
  beforeEach(() => {
    invalidateRegistryCache();
    mockFetchJson.mockReset();
  });

  it('should clear the cache so next fetch hits network', async () => {
    mockFetchJson.mockResolvedValue(fakeRegistryIndex);

    await fetchRegistryIndex('https://example.com/r');
    expect(mockFetchJson).toHaveBeenCalledTimes(1);

    invalidateRegistryCache();

    await fetchRegistryIndex('https://example.com/r');
    expect(mockFetchJson).toHaveBeenCalledTimes(2);
  });
});

describe('fetchComponentFromRegistry', () => {
  beforeEach(() => {
    mockFetchJson.mockReset();
  });

  it('should fetch the correct URL for a component', async () => {
    const fakeComponent = {
      name: 'button',
      type: 'registry:component' as const,
      files: [{ name: 'button.ts', content: 'export class Button {}' }],
    };
    mockFetchJson.mockResolvedValueOnce(fakeComponent);

    const result = await fetchComponentFromRegistry('button', 'https://example.com/r');

    expect(mockFetchJson).toHaveBeenCalledWith('https://example.com/r/button.json');
    expect(result).toEqual(fakeComponent);
  });
});

describe('fetchComponent', () => {
  beforeEach(() => {
    mockFetchJson.mockReset();
  });

  it('should transform file contents', async () => {
    const fakeComponent = {
      name: 'button',
      type: 'registry:component',
      files: [
        {
          name: 'button.ts',
          content: `import { ClassValue } from 'class-variance-authority/dist/types'`,
        },
      ],
    };
    mockFetchJson.mockResolvedValueOnce(fakeComponent);

    const result = await fetchComponent('button', fakeConfig, 'https://example.com/r');

    expect(result.files[0].content).toContain(`import { ClassValue } from 'clsx'`);
  });

  it('should throw ConfigError when files is undefined', async () => {
    const fakeComponent = {
      name: 'button',
      type: 'registry:component',
      files: undefined,
    };
    mockFetchJson.mockResolvedValueOnce(fakeComponent);

    await expect(fetchComponent('button', fakeConfig, 'https://example.com/r')).rejects.toThrow(ConfigError);
  });

  it('should throw ConfigError when files is not an array', async () => {
    const fakeComponent = {
      name: 'button',
      type: 'registry:component',
      files: 'not-an-array',
    };
    mockFetchJson.mockResolvedValueOnce(fakeComponent);

    await expect(fetchComponent('button', fakeConfig, 'https://example.com/r')).rejects.toThrow(ConfigError);
  });
});

describe('transformContent', () => {
  it('should replace utils import path', () => {
    const content = `import { cn } from '../../shared/utils/utils'`;

    const result = transformContent(content, fakeConfig);

    expect(result).toBe(`import { cn } from '@/shared/utils/merge-classes'`);
  });

  it('should replace relative component imports with aliased imports', () => {
    const content = `import { ButtonComponent } from '../button/button.component'`;

    const result = transformContent(content, fakeConfig);

    expect(result).toBe(`import { ButtonComponent } from '@/shared/components/button/button.component'`);
  });

  it('should replace ClassValue import from class-variance-authority/dist/types', () => {
    const content = `import { ClassValue } from 'class-variance-authority/dist/types'`;

    const result = transformContent(content, fakeConfig);

    expect(result).toBe(`import { ClassValue } from 'clsx'`);
  });

  it('should replace ClassValue import from class-variance-authority', () => {
    const content = `import { ClassValue } from 'class-variance-authority'`;

    const result = transformContent(content, fakeConfig);

    expect(result).toBe(`import { ClassValue } from 'clsx'`);
  });

  it('should replace number utils import path', () => {
    const content = `import { toNumber } from '../../shared/utils/number'`;

    const result = transformContent(content, fakeConfig);

    expect(result).toBe(`import { toNumber } from '@/shared/utils/number'`);
  });

  it('should transform @/shared/* paths to match aliases', () => {
    const content = `import { something } from '@/shared/core/base'`;

    const result = transformContent(content, fakeConfig);

    expect(result).toBe(`import { something } from '@/shared/core/base'`);
  });

  it('should handle custom aliases', () => {
    const customConfig: Config = {
      ...fakeConfig,
      aliases: {
        components: '~/components',
        utils: '~/utils',
        core: '~/core',
        services: '~/services',
      },
    };

    const content = `import { cn } from '../../shared/utils/utils'`;
    const result = transformContent(content, customConfig);

    expect(result).toBe(`import { cn } from '~/utils/merge-classes'`);
  });
});
