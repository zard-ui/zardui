import { LOCAL_ICON_CATALOG } from '@cli/core/icons/index.js';
import { NetworkError } from '@cli/utils/errors.js';
import { assertIconFamily, iconCatalog, loadIconCatalog, resetIconCatalog } from '@cli/utils/icon-catalog.js';

jest.mock('@cli/utils/http-client.js', () => ({ fetchJson: jest.fn() }));

const { fetchJson } = jest.requireMock('@cli/utils/http-client.js') as { fetchJson: jest.Mock };

describe('the icon catalogue', () => {
  beforeEach(() => {
    resetIconCatalog();
    fetchJson.mockReset();
  });

  afterAll(() => resetIconCatalog());

  it('starts from the copy bundled with the CLI', () => {
    expect(iconCatalog()).toBe(LOCAL_ICON_CATALOG);
  });

  /**
   * The entire point of the remote catalog: a family published today works with a
   * CLI compiled yesterday.
   */
  it('takes the families the registry publishes, including ones this build never heard of', async () => {
    fetchJson.mockResolvedValue({
      schemaVersion: 1,
      families: {
        material: { value: 'material', label: 'Material', package: '@ng-icons/material-icons', prefix: 'mat' },
      },
      icons: { check: { material: 'matCheck' } },
    });

    const catalog = await loadIconCatalog('https://zardui.com/r');

    expect(Object.keys(catalog.families)).toEqual(['material']);
    expect(iconCatalog()).toBe(catalog);
  });

  it('falls back to the bundled copy when the registry has no catalogue', async () => {
    fetchJson.mockRejectedValue(new Error('HTTP 404'));

    await expect(loadIconCatalog('https://zardui.com/r')).resolves.toBe(LOCAL_ICON_CATALOG);
  });

  /**
   * The real case, and what actually broke when this was tried against
   * production: a registry served by an SPA answers 200 with HTML for a file that
   * does not exist, and the HTTP client raises NetworkError. Propagating that
   * would take `add` down on every registry that has not published the catalog
   * yet — which is all of them, until the first deploy.
   */
  it('falls back when the registry answers with the HTML of its own site', async () => {
    fetchJson.mockRejectedValue(
      new NetworkError('Received HTML instead of JSON from registry', 'https://zardui.com/r'),
    );

    await expect(loadIconCatalog('https://zardui.com/r')).resolves.toBe(LOCAL_ICON_CATALOG);
  });

  it('falls back when the network is down', async () => {
    fetchJson.mockRejectedValue(new NetworkError('Request timed out after 10000ms', 'https://zardui.com/r'));

    await expect(loadIconCatalog('https://zardui.com/r')).resolves.toBe(LOCAL_ICON_CATALOG);
  });

  it('falls back when the document is there but malformed', async () => {
    fetchJson.mockResolvedValue({ schemaVersion: 1 });

    await expect(loadIconCatalog('https://zardui.com/r')).resolves.toBe(LOCAL_ICON_CATALOG);
  });

  it('refuses a catalogue newer than this CLI can read', async () => {
    fetchJson.mockResolvedValue({ schemaVersion: 99, families: {}, icons: {} });

    await expect(loadIconCatalog('https://zardui.com/r')).rejects.toThrow(/reads up to v1/);
  });
});

describe('assertIconFamily', () => {
  it('accepts a family the catalogue declares', () => {
    expect(() => assertIconFamily('lucide', LOCAL_ICON_CATALOG)).not.toThrow();
  });

  /**
   * Antes, um typo aqui produzia "Invalid configuration file: components.json" —
   * no field named, no accepted values, and the whole file under suspicion.
   */
  it('names the field and lists what is accepted', () => {
    expect(() => assertIconFamily('materia', LOCAL_ICON_CATALOG)).toThrow(
      'Unknown icon set "materia" in components.json. Available: lucide.',
    );
  });
});
