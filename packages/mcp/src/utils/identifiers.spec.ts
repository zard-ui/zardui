import { assertRegistryId, InvalidIdentifierError } from './identifiers';

describe('assertRegistryId', () => {
  it('accepts the names the registry actually publishes', () => {
    for (const name of ['button', 'data-table', 'input-otp', 'h1', 'core', 'login-01']) {
      expect(assertRegistryId(name, 'component')).toBe(name);
    }
  });

  /**
   * The name becomes a URL path. `../../admin/secret` turns
   * `https://zardui.com/r/button.json` into
   * `https://zardui.com/admin/secret.json` — against a private registryUrl,
   * that is the server fetching addresses on the company network on behalf of
   * whoever wrote the prompt.
   */
  it.each([
    ['path traversal', '../../admin/secret'],
    ['encoded traversal', '..%2f..%2fadmin'],
    ['absolute path', '/etc/passwd'],
    ['nested path', 'blocks/login-01'],
    ['query injection', 'button?raw=1'],
    ['fragment', 'button#x'],
    ['protocol-relative', '//evil.example.com/x'],
    ['userinfo', '@evil.example.com/x'],
    ['dotfile', '.env'],
    ['leading dash', '-button'],
    ['space', 'my button'],
    ['empty', ''],
  ])('refuses %s', (_case, value) => {
    expect(() => assertRegistryId(value, 'component')).toThrow(InvalidIdentifierError);
  });

  it('refuses an absurdly long name', () => {
    expect(() => assertRegistryId('a'.repeat(65), 'component')).toThrow(InvalidIdentifierError);
  });

  it('says which kind of name was wrong', () => {
    expect(() => assertRegistryId('../x', 'block')).toThrow(/Invalid block name/);
    expect(() => assertRegistryId('../x', 'component')).toThrow(/Invalid component name/);
  });
});
