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
   * O ponto inteiro do catálogo remoto: uma família publicada hoje vale para uma
   * CLI compilada ontem.
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
   * O caso real, e o que quebrou de verdade quando foi testado contra produção:
   * um registry servido por uma SPA responde 200 com HTML para um arquivo que
   * não existe, e o cliente HTTP levanta NetworkError. Propagar isso derrubaria
   * o `add` em todo registry que ainda não publicou o catálogo — que são todos,
   * até o primeiro deploy.
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
   * sem o campo, sem os valores aceitos, com o arquivo inteiro sob suspeita.
   */
  it('names the field and lists what is accepted', () => {
    expect(() => assertIconFamily('materia', LOCAL_ICON_CATALOG)).toThrow(
      'Unknown icon set "materia" in components.json. Available: lucide.',
    );
  });
});
