import { execFile } from 'node:child_process';

import { registerInstallComponent } from './install-component';

jest.mock('node:child_process', () => ({
  execFile: jest.fn((_file: string, _args: string[], _opts: unknown, cb: (e: Error | null, o: string, s: string) => void) => {
    cb(null, 'ok', '');
  }),
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

describe('install-component tool (CWE-78 regression)', () => {
  beforeEach(() => {
    (execFile as unknown as jest.Mock).mockClear();
  });

  it('runs the CLI for a clean component name and never uses a shell string', async () => {
    const tool = registerAndCapture();
    const res = await tool.handler({ name: 'button', cwd: '/tmp' });

    expect(res.isError).toBeUndefined();
    expect(execFile).toHaveBeenCalledTimes(1);
    // argv-vector form: the name is a discrete argument, no shell string is built
    const [file, args] = (execFile as unknown as jest.Mock).mock.calls[0];
    expect(file).toBe('npx');
    expect(args).toEqual(['zard-cli', 'add', 'button', '--yes']);
  });

  it('rejects a name containing shell metacharacters without executing anything', async () => {
    const tool = registerAndCapture();
    const payload = 'button; touch /tmp/pwned; #';
    const res = await tool.handler({ name: payload, cwd: '/tmp' });

    expect(res.isError).toBe(true);
    expect(res.content[0].text).toContain('Invalid component name');
    // the injection payload must never reach the process launcher
    expect(execFile).not.toHaveBeenCalled();
  });

  it('passes any accepted name as a single literal argv element (no shell parsing)', async () => {
    const tool = registerAndCapture();
    await tool.handler({ name: 'data-table', cwd: '/tmp' });

    const [, args] = (execFile as unknown as jest.Mock).mock.calls[0];
    // the component name occupies exactly one argv slot; execve gets it verbatim
    expect(args).toEqual(['zard-cli', 'add', 'data-table', '--yes']);
    expect(args[2]).toBe('data-table');
  });
});
