import { selectComponents } from '@cli/commands/add/component-selector.js';
import { getAllComponentNames } from '@cli/commands/add/dependency-resolver.js';
import { logger } from '@cli/utils/logger.js';

jest.mock('@cli/commands/add/dependency-resolver.js', () => ({ getAllComponentNames: jest.fn() }));
jest.mock('@cli/utils/logger.js', () => ({ logger: { info: jest.fn() } }));

const mockNames = getAllComponentNames as jest.MockedFunction<typeof getAllComponentNames>;

describe('selectComponents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNames.mockResolvedValue(['button', 'sonner']);
  });

  it('should return every component for --all without resolving aliases', async () => {
    await expect(selectComponents([], true)).resolves.toEqual(['button', 'sonner']);
    expect(logger.info).not.toHaveBeenCalled();
  });

  it('should return an empty list, without asking the registry, when nothing was given', async () => {
    await expect(selectComponents([], false)).resolves.toEqual([]);
    expect(mockNames).not.toHaveBeenCalled();
  });

  it('should install sonner for toast and say so', async () => {
    await expect(selectComponents(['button', 'toast'], false)).resolves.toEqual(['button', 'sonner']);
    expect(logger.info).toHaveBeenCalledWith('toast → sonner');
  });

  it('should pass unknown names through for the resolver to report', async () => {
    await expect(selectComponents(['nope'], false)).resolves.toEqual(['nope']);
  });
});
