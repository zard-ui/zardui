import { registryService } from './registry.service';

/**
 * Validation lives in the service, not in each tool, because the service is
 * what builds the URL — a new tool can forget to call it, the service cannot.
 * These cases make sure nothing reaches `fetch` with a name that is a path.
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
