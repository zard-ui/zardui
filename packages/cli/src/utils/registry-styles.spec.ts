jest.mock('@cli/utils/http-client.js', () => ({
  fetchJson: jest.fn(),
}));

import { LOCAL_STYLE_CATALOG } from '@cli/core/styles/index.js';
import { Config } from '@cli/utils/config.js';
import { fetchJson } from '@cli/utils/http-client.js';
import { fetchComponent } from '@cli/utils/registry.js';
import { loadStyleCatalog, resetStyleCatalog } from '@cli/utils/style-catalog.js';

const mockFetchJson = fetchJson as jest.MockedFunction<typeof fetchJson>;

const fakeConfig: Config = {
  style: 'css',
  icons: 'lucide',
  rtl: false,
  projectType: 'angular',
  appConfigFile: 'src/app/app.config.ts',
  packageManager: 'npm',
  tailwind: { css: 'src/styles.css', baseColor: 'slate' },
  baseUrl: 'src/app',
  aliases: {
    components: '@/shared/components',
    utils: '@/shared/utils',
    core: '@/shared/core',
    services: '@/shared/services',
    blocks: '@/shared/blocks',
  },
};

const styledFile = {
  name: 'box.variants.ts',
  content: "export const box = 'h-8 rounded-lg px-2.5 inline-flex';",
  styled: "export const box = 'cn-box inline-flex';",
};
const component = { name: 'box', type: 'registry:component', files: [styledFile] };

describe('fetchComponent — styles', () => {
  beforeEach(() => {
    mockFetchJson.mockReset();
    resetStyleCatalog();
  });

  afterAll(() => resetStyleCatalog());

  it('installs content as is for the default look, whatever the CLI knows about styles', async () => {
    for (const style of ['css', 'nova'] as const) {
      mockFetchJson.mockResolvedValueOnce(component);
      const result = await fetchComponent('box', { ...fakeConfig, style }, 'https://example.com/r');

      expect(result.files[0].content).toBe(styledFile.content);
    }
  });

  it('resolves the markers into the style components.json names', async () => {
    mockFetchJson.mockResolvedValueOnce({
      schemaVersion: 1,
      id: 'lyra',
      markers: { 'cn-box': 'h-8 rounded-none px-2.5 text-xs' },
    });
    await loadStyleCatalog('https://example.com/r', 'lyra');

    mockFetchJson.mockResolvedValueOnce(component);
    const result = await fetchComponent('box', { ...fakeConfig, style: 'lyra' }, 'https://example.com/r');

    expect(result.files[0].content).toBe("export const box = 'h-8 rounded-none px-2.5 text-xs inline-flex';");
  });

  it('leaves a file without markers alone, in any style', async () => {
    mockFetchJson.mockResolvedValueOnce({
      ...component,
      files: [{ name: 'util.ts', content: "export const k = 'cn-box';" }],
    });

    const result = await fetchComponent('box', { ...fakeConfig, style: 'sera' }, 'https://example.com/r');

    expect(result.files[0].content).toBe("export const k = 'cn-box';");
  });

  it('falls back to the bundled tables when the registry does not publish the style', async () => {
    mockFetchJson.mockRejectedValueOnce(new Error('404'));

    const catalog = await loadStyleCatalog('https://example.com/r', 'maia');

    expect(catalog).toBe(LOCAL_STYLE_CATALOG);
  });

  it('refuses a style published in a format newer than this CLI reads', async () => {
    mockFetchJson.mockResolvedValueOnce({ schemaVersion: 99, markers: {} });

    await expect(loadStyleCatalog('https://example.com/r', 'maia')).rejects.toThrow(/update|npm i/i);
  });
});
