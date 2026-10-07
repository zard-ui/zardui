jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
}));

jest.mock('@cli/utils/logger.js', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

import { setupTypeset, setupUtilities } from '@cli/commands/add/stylesheet-setup.js';
import { logger } from '@cli/utils/logger.js';
import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';

const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockReadFile = readFile as jest.MockedFunction<typeof readFile>;
const mockWriteFile = writeFile as jest.MockedFunction<typeof writeFile>;
const mockLoggerWarn = logger.warn as jest.MockedFunction<typeof logger.warn>;

const CSS_PATH = '/project/src/styles.css';

/** What `setupTypeset` wrote, or null when it wrote nothing. */
function written(): string | null {
  return mockWriteFile.mock.calls.length ? (mockWriteFile.mock.calls[0][1] as string) : null;
}

describe('setupTypeset', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockExistsSync.mockReturnValue(true);
    mockWriteFile.mockResolvedValue(undefined);
  });

  it('should insert the import right after the last @import', async () => {
    mockReadFile.mockResolvedValue(
      "@import 'tailwindcss';\n@import './theme.css';\n\n:root {\n  --radius: 0.5rem;\n}\n",
    );

    await setupTypeset(CSS_PATH);

    expect(written()).toBe(
      "@import 'tailwindcss';\n@import './theme.css';\n@import './typeset.css';\n\n:root {\n  --radius: 0.5rem;\n}\n",
    );
  });

  it('should not duplicate the import when it is already there', async () => {
    mockReadFile.mockResolvedValue("@import 'tailwindcss';\n@import './typeset.css';\n");

    await setupTypeset(CSS_PATH);

    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  it('should be idempotent across two runs', async () => {
    const initial = "@import 'tailwindcss';\n\nbody {\n  margin: 0;\n}\n";
    mockReadFile.mockResolvedValue(initial);

    await setupTypeset(CSS_PATH);
    const afterFirst = written() as string;

    mockWriteFile.mockClear();
    mockReadFile.mockResolvedValue(afterFirst);
    await setupTypeset(CSS_PATH);

    expect(mockWriteFile).not.toHaveBeenCalled();
    expect(afterFirst).toContain("@import './typeset.css';");
  });

  it('should leave a stylesheet with no @import untouched', async () => {
    mockReadFile.mockResolvedValue(':root {\n  --radius: 0.5rem;\n}\n');

    await setupTypeset(CSS_PATH);

    expect(mockWriteFile).not.toHaveBeenCalled();
    expect(mockLoggerWarn).toHaveBeenCalled();
  });

  it('should preserve CRLF line endings', async () => {
    mockReadFile.mockResolvedValue("@import 'tailwindcss';\r\n\r\nbody {\r\n  margin: 0;\r\n}\r\n");

    await setupTypeset(CSS_PATH);

    expect(written()).toBe("@import 'tailwindcss';\r\n@import './typeset.css';\r\n\r\nbody {\r\n  margin: 0;\r\n}\r\n");
  });

  it('should anchor on an @import that carries a layer', async () => {
    mockReadFile.mockResolvedValue("@import 'tailwindcss';\n@import './theme.css' layer(base);\n\nbody {\n}\n");

    await setupTypeset(CSS_PATH);

    expect(written()).toBe(
      "@import 'tailwindcss';\n@import './theme.css' layer(base);\n@import './typeset.css';\n\nbody {\n}\n",
    );
  });

  it('should not mistake a mention of typeset.css in a comment for the import', async () => {
    mockReadFile.mockResolvedValue("@import 'tailwindcss';\n/* TODO: add typeset.css here */\n");

    await setupTypeset(CSS_PATH);

    expect(written()).toBe("@import 'tailwindcss';\n@import './typeset.css';\n/* TODO: add typeset.css here */\n");
  });

  it('should not anchor on a commented-out @import that follows a rule', async () => {
    mockReadFile.mockResolvedValue(
      "@import 'tailwindcss';\n\n:root {\n  --radius: 0.5rem;\n}\n\n/*\n@import './old.css';\n*/\n",
    );

    await setupTypeset(CSS_PATH);

    // The import has to land after the real one, never after the rule — CSS
    // ignores an @import that follows a declaration block.
    expect(written()).toBe(
      "@import 'tailwindcss';\n@import './typeset.css';\n\n:root {\n  --radius: 0.5rem;\n}\n\n/*\n@import './old.css';\n*/\n",
    );
  });

  it('should warn and write nothing when the stylesheet does not exist', async () => {
    mockExistsSync.mockReturnValue(false);

    await setupTypeset(CSS_PATH);

    expect(mockReadFile).not.toHaveBeenCalled();
    expect(mockWriteFile).not.toHaveBeenCalled();
    expect(mockLoggerWarn).toHaveBeenCalled();
  });
});

/*
 * `utilities` runs through the same code as typeset, so what is worth pinning
 * here is what differs: which file it names, and that the two do not answer for
 * each other — a project with typeset installed must still get utilities.
 */
describe('setupUtilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockExistsSync.mockReturnValue(true);
    mockWriteFile.mockResolvedValue(undefined);
  });

  it('should import utilities.css after the last import', async () => {
    mockReadFile.mockResolvedValue("@import 'tailwindcss';\n@import './app/shared/core/css/zard';\n\nbody {\n}\n");

    await setupUtilities(CSS_PATH);

    expect(written()).toBe(
      "@import 'tailwindcss';\n@import './app/shared/core/css/zard';\n@import './utilities.css';\n\nbody {\n}\n",
    );
  });

  it('should not duplicate the import when it is already there', async () => {
    mockReadFile.mockResolvedValue("@import 'tailwindcss';\n@import './utilities.css';\n");

    await setupUtilities(CSS_PATH);

    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  it('should add utilities to a stylesheet that already imports typeset', async () => {
    mockReadFile.mockResolvedValue("@import 'tailwindcss';\n@import './typeset.css';\n");

    await setupUtilities(CSS_PATH);

    expect(written()).toBe("@import 'tailwindcss';\n@import './typeset.css';\n@import './utilities.css';\n");
  });
});
