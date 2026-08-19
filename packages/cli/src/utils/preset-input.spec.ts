import { CliError } from '@cli/utils/errors.js';
import { classifyPresetInput, resolvePresetInput } from '@cli/utils/preset-input.js';
import { LOCAL_PRESET_CATALOG } from '@zardui/preset';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

jest.mock('@cli/utils/http-client.js', () => ({ fetchJson: jest.fn() }));

const { fetchJson } = jest.requireMock('@cli/utils/http-client.js') as { fetchJson: jest.Mock };

const catalog = LOCAL_PRESET_CATALOG;

describe('classifyPresetInput', () => {
  it('reads a short code as a code', () => {
    expect(classifyPresetInput('a000301e')).toBe('code');
  });

  /**
   * O caso que decidiu a ordem das checagens: um arquivo com nome de código no
   * diretório atual não pode sequestrar um código válido. Quem quiser o arquivo
   * escreve `./a000301e`, que tem ponto e barra e cai no ramo certo.
   */
  it('prefers the code reading when a bare word could be either', () => {
    expect(classifyPresetInput('a000301e')).toBe('code');
    expect(classifyPresetInput('./a000301e')).toBe('file');
  });

  it('reads a path as a file', () => {
    for (const value of ['./zard.preset.json', 'presets/acme.json', 'C:/team/zard.preset.json']) {
      expect(classifyPresetInput(value)).toBe('file');
    }
  });

  it('reads an http address as a URL', () => {
    expect(classifyPresetInput('https://acme.dev/zard.preset.json')).toBe('url');
    expect(classifyPresetInput('http://localhost:4223/preset.json')).toBe('url');
  });
});

describe('resolvePresetInput', () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(path.join(tmpdir(), 'zard-preset-'));
    fetchJson.mockReset();
  });

  afterEach(() => rm(directory, { recursive: true, force: true }));

  it('decodes a code', async () => {
    await expect(resolvePresetInput('a000301e', { cwd: directory, catalog })).resolves.toMatchObject({
      baseColor: 'neutral',
      theme: 'neutral',
      radius: 'default',
    });
  });

  it('reads a preset file, overrides and all', async () => {
    const file = path.join(directory, 'zard.preset.json');
    await writeFile(
      file,
      JSON.stringify({
        version: 1,
        name: 'Acme',
        baseColor: 'slate',
        theme: 'blue',
        colors: { light: { primary: 'oklch(0.45 0.19 264)' } },
      }),
      'utf8',
    );

    const preset = await resolvePresetInput(file, { cwd: directory, catalog });

    expect(preset).toMatchObject({ name: 'Acme', baseColor: 'slate', theme: 'blue' });
    expect(preset.colors?.light?.primary).toBe('oklch(0.45 0.19 264)');
    // O que o arquivo não diz vem do default, e não fica indefinido.
    expect(preset.chart).toBe('default');
  });

  it('fetches a preset over http', async () => {
    fetchJson.mockResolvedValue({ version: 1, baseColor: 'zinc', theme: 'violet' });

    await expect(
      resolvePresetInput('https://acme.dev/zard.preset.json', { cwd: directory, catalog }),
    ).resolves.toMatchObject({ baseColor: 'zinc', theme: 'violet' });
  });

  it('says where it looked when the file is not there', async () => {
    await expect(resolvePresetInput('./missing.json', { cwd: directory, catalog })).rejects.toThrow(CliError);
    await expect(resolvePresetInput('./missing.json', { cwd: directory, catalog })).rejects.toThrow(/No preset at/);
  });

  /**
   * Versão diferente não é "campo a mais": é um arquivo cujos campos podem
   * significar outra coisa. Aplicá-lo mesmo assim gravaria cores erradas num
   * projeto de verdade.
   */
  it('refuses a preset file from a format it does not read', async () => {
    const file = path.join(directory, 'future.json');
    await writeFile(file, JSON.stringify({ version: 2, baseColor: 'slate' }), 'utf8');

    await expect(resolvePresetInput(file, { cwd: directory, catalog })).rejects.toThrow(/version 2/);
  });

  it('refuses a code that does not close its checksum', async () => {
    await expect(resolvePresetInput('a000301z', { cwd: directory, catalog })).rejects.toThrow(/checksum/);
  });
});
