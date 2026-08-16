import { execFile } from 'node:child_process';

import { registerInstallComponent } from './install-component';

jest.mock('node:child_process', () => ({
  execFile: jest.fn(
    (_file: string, _args: string[], _opts: unknown, cb: (e: Error | null, o: string, s: string) => void) => {
      cb(null, 'ok', '');
    },
  ),
}));

jest.mock('node:fs', () => ({
  statSync: jest.fn(() => ({ isDirectory: () => true })),
  existsSync: jest.fn(() => false),
}));

interface CapturedTool {
  handler: (input: { name: string; cwd?: string }) => Promise<{ content: { text: string }[]; isError?: boolean }>;
}

function registerAndCapture(): CapturedTool {
  let captured: CapturedTool | undefined;
  const server = {
    tool(_name: string, _desc: string, _schema: unknown, handler: CapturedTool['handler']) {
      captured = { handler };
    },
  } as never;
  registerInstallComponent(server);
  if (!captured) throw new Error('tool not registered');
  return captured;
}

const execFileMock = execFile as unknown as jest.Mock;

describe('install-component tool (CWE-78 regression)', () => {
  beforeEach(() => execFileMock.mockClear());

  it('runs the CLI for a clean component name and never uses a shell string', async () => {
    const tool = registerAndCapture();
    const res = await tool.handler({ name: 'button', cwd: '/tmp' });

    expect(res.isError).toBeUndefined();
    expect(execFileMock).toHaveBeenCalledTimes(1);

    const [file, args, options] = execFileMock.mock.calls[0];
    // An argument vector, never a built string — and no shell, which is what
    // makes a `;` in the name just a character.
    expect(args).toContain('button');
    expect(args[args.length - 2]).toBe('button');
    expect(options.shell).toBe(false);
    expect(typeof file).toBe('string');
  });

  /**
   * The exact payload from the report: `button; printf … > marker; #`. With
   * `exec` and a command string, the `;` started a second command in the shell.
   */
  it('rejects the reported payload without executing anything', async () => {
    const tool = registerAndCapture();
    const res = await tool.handler({ name: 'button; printf zard-mcp-poc > /tmp/COMMAND_EXECUTED; #', cwd: '/tmp' });

    expect(res.isError).toBe(true);
    expect(res.content[0].text).toContain('Invalid component name');
    expect(execFileMock).not.toHaveBeenCalled();
  });

  it.each([
    ['command chaining', 'button && whoami'],
    ['pipe', 'button | tee /tmp/x'],
    ['substitution', 'button$(whoami)'],
    ['backticks', 'button`whoami`'],
    ['newline', 'button\nwhoami'],
    ['redirection', 'button > /tmp/x'],
    ['path traversal', '../../etc/passwd'],
    ['absolute path', '/etc/passwd'],
    ['flag injection', '--registry=http://evil.example.com'],
    ['empty', ''],
  ])('refuses %s and launches no process', async (_case, payload) => {
    const tool = registerAndCapture();
    const res = await tool.handler({ name: payload, cwd: '/tmp' });

    expect(res.isError).toBe(true);
    expect(execFileMock).not.toHaveBeenCalled();
  });

  it('accepts the names the registry actually uses', async () => {
    const tool = registerAndCapture();

    for (const name of ['button', 'data-table', 'input-otp', 'h1']) {
      execFileMock.mockClear();
      const res = await tool.handler({ name, cwd: '/tmp' });

      expect(res.isError).toBeUndefined();
      expect(execFileMock.mock.calls[0][1]).toContain(name);
    }
  });

  it('refuses a working directory that does not exist, before launching anything', async () => {
    const { statSync } = jest.requireMock('node:fs') as { statSync: jest.Mock };
    statSync.mockImplementationOnce(() => {
      throw new Error('ENOENT');
    });

    const tool = registerAndCapture();
    const res = await tool.handler({ name: 'button', cwd: '/does/not/exist' });

    expect(res.isError).toBe(true);
    expect(res.content[0].text).toContain('Working directory does not exist');
    expect(execFileMock).not.toHaveBeenCalled();
  });

  it('refuses a working directory that is a file', async () => {
    const { statSync } = jest.requireMock('node:fs') as { statSync: jest.Mock };
    statSync.mockImplementationOnce(() => ({ isDirectory: () => false }));

    const tool = registerAndCapture();
    const res = await tool.handler({ name: 'button', cwd: '/etc/hosts' });

    expect(res.isError).toBe(true);
    expect(res.content[0].text).toContain('not a directory');
    expect(execFileMock).not.toHaveBeenCalled();
  });
});
