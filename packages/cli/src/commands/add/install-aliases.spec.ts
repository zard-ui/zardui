import { INSTALL_ALIASES, resolveInstallAliases } from '@cli/commands/add/install-aliases.js';

const REGISTRY = new Set(['button', 'sonner', 'dialog']);

describe('resolveInstallAliases', () => {
  it('should install sonner when asked for toast', () => {
    expect(resolveInstallAliases(['toast'], REGISTRY)).toEqual({
      names: ['sonner'],
      replaced: [['toast', 'sonner']],
    });
  });

  it('should install typeset when asked for typography', () => {
    expect(resolveInstallAliases(['typography'], new Set([...REGISTRY, 'typeset']))).toEqual({
      names: ['typeset'],
      replaced: [['typography', 'typeset']],
    });
  });

  it('should leave real registry names and unknown names alone', () => {
    expect(resolveInstallAliases(['button', 'nope'], REGISTRY)).toEqual({ names: ['button', 'nope'], replaced: [] });
  });

  it('should install once when an alias and its target are both given', () => {
    const { names, replaced } = resolveInstallAliases(['sonner', 'toast', 'sonner'], REGISTRY);

    expect(names).toEqual(['sonner']);
    expect(replaced).toEqual([['toast', 'sonner']]);
  });

  it('should never shadow an item the registry really publishes', () => {
    const withToast = new Set([...REGISTRY, 'toast']);

    expect(resolveInstallAliases(['toast'], withToast)).toEqual({ names: ['toast'], replaced: [] });
  });

  it('should keep the order of the names it was given', () => {
    expect(resolveInstallAliases(['dialog', 'toast', 'button'], REGISTRY).names).toEqual([
      'dialog',
      'sonner',
      'button',
    ]);
  });

  it('should only alias to one registry item, never to a list', () => {
    for (const target of Object.values(INSTALL_ALIASES)) {
      expect(typeof target).toBe('string');
    }
  });
});
