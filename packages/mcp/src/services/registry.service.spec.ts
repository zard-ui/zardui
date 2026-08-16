import { registryService } from './registry.service';

/**
 * A validação mora no serviço, e não em cada tool, porque é o serviço que monta
 * a URL — uma tool nova pode esquecer de validar, o serviço não. Estes casos
 * garantem que ninguém consegue chegar ao `fetch` com um nome que vira caminho.
 */
describe('registryService path safety', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  it.each([
    ['component', '../../admin/secret'],
    ['component', '/etc/passwd'],
    ['component', 'button?raw=1'],
    ['component', '//evil.example.com/x'],
  ])('refuses %s "%s" without any request', async (_kind, name) => {
    await expect(registryService.getComponent(name)).rejects.toThrow(/Invalid component name/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('refuses a block id that would escape the blocks directory', async () => {
    await expect(registryService.getBlock('../../../secret')).rejects.toThrow(/Invalid block name/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fetches a clean name from inside the registry directory', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ name: 'button', type: 'registry:component', files: [] }),
    });

    await registryService.getComponent('button');

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toBe('https://zardui.com/r/button.json');
    expect(new URL(url).pathname.startsWith('/r/')).toBe(true);
  });
});
