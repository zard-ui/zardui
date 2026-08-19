import { NetworkError, SchemaVersionError } from '@cli/utils/errors.js';
import { loadPresetCatalog, presetCatalog, resetPresetCatalog } from '@cli/utils/preset-catalog.js';
import { LOCAL_PRESET_CATALOG, decodePreset } from '@zardui/preset';

jest.mock('@cli/utils/http-client.js', () => ({ fetchJson: jest.fn() }));

const { fetchJson } = jest.requireMock('@cli/utils/http-client.js') as { fetchJson: jest.Mock };

describe('the preset catalogue', () => {
  beforeEach(() => {
    resetPresetCatalog();
    fetchJson.mockReset();
  });

  afterAll(() => resetPresetCatalog());

  it('starts from the copy bundled with the CLI', () => {
    expect(presetCatalog()).toBe(LOCAL_PRESET_CATALOG);
  });

  /**
   * O ponto inteiro do catálogo remoto: uma cor publicada hoje vale para uma CLI
   * compilada ontem — e um código gerado no `/create` com ela decodifica aqui.
   */
  it('takes an accent this build never heard of, and decodes a code that uses it', async () => {
    fetchJson.mockResolvedValue({
      schemaVersion: 1,
      themes: [
        { id: 'neutral', code: 0, label: 'Neutral' },
        { id: 'chartreuse', code: 61, label: 'Chartreuse', hue: 125, chroma: 0.2 },
      ],
    });

    const catalog = await loadPresetCatalog('https://zardui.com/r');

    expect(catalog.themes.map(theme => theme.id)).toEqual(['neutral', 'chartreuse']);
    // Seções ausentes continuam vindo da cópia local — um registry parcial serve.
    expect(catalog.baseColors).toBe(LOCAL_PRESET_CATALOG.baseColors);
    expect(decodePreset('a0z0301d', catalog).theme).toBe('chartreuse');
  });

  it('falls back to the bundled copy when the registry has no catalogue', async () => {
    fetchJson.mockRejectedValue(new Error('HTTP 404'));

    await expect(loadPresetCatalog('https://zardui.com/r')).resolves.toBe(LOCAL_PRESET_CATALOG);
  });

  it('falls back when the registry answers with the HTML of its own site', async () => {
    fetchJson.mockRejectedValue(new NetworkError('Received HTML instead of JSON', 'https://zardui.com/r'));

    await expect(loadPresetCatalog('https://zardui.com/r')).resolves.toBe(LOCAL_PRESET_CATALOG);
  });

  /**
   * A única falha fatal. Formato incompatível não é "sem catálogo": é um
   * catálogo que esta CLI leria errado, e ler errado aqui significa gravar a
   * cor errada no projeto de alguém.
   */
  it('refuses a format newer than it reads instead of guessing', async () => {
    fetchJson.mockResolvedValue({ schemaVersion: 99, themes: [] });

    await expect(loadPresetCatalog('https://zardui.com/r')).rejects.toThrow(SchemaVersionError);
  });
});
