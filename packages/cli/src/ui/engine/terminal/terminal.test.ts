import { createTerminal, detectColorLevel } from './index.js';

function fakeStreams() {
  const stdin = {
    isTTY: true,
    setRawMode: jest.fn(),
    resume: jest.fn(),
    pause: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  } as unknown as NodeJS.ReadStream & { setRawMode: jest.Mock; resume: jest.Mock; pause: jest.Mock };

  const stdout = {
    isTTY: true,
    columns: 80,
    rows: 24,
    write: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  } as unknown as NodeJS.WriteStream;

  return { stdin, stdout };
}

describe('terminal raw mode', () => {
  it('should release stdin on restore so the process can exit', () => {
    const { stdin, stdout } = fakeStreams();
    const terminal = createTerminal({ stdin, stdout });

    terminal.enterRawMode();
    expect(stdin.resume).toHaveBeenCalledTimes(1);

    terminal.restore();

    // Sem o pause, o resume do raw mode segura o event loop e o comando nunca
    // gives the shell back after the wizard ends.
    expect(stdin.setRawMode).toHaveBeenLastCalledWith(false);
    expect(stdin.pause).toHaveBeenCalledTimes(1);
  });

  it('should not touch a stdin it never put in raw mode', () => {
    const { stdin, stdout } = fakeStreams();
    const terminal = createTerminal({ stdin, stdout });

    terminal.restore();

    expect(stdin.pause).not.toHaveBeenCalled();
    expect(stdin.setRawMode).not.toHaveBeenCalled();
  });

  it('should be idempotent across repeated restores', () => {
    const { stdin, stdout } = fakeStreams();
    const terminal = createTerminal({ stdin, stdout });

    terminal.enterRawMode();
    terminal.restore();
    terminal.restore();

    expect(stdin.pause).toHaveBeenCalledTimes(1);
  });
});

/**
 * These cases are about uniformity: the terminals people actually run the CLI in
 * have to arrive at the same colour depth, or the same wizard comes out looking
 * three different ways depending on who opened it.
 */
describe('color level detection', () => {
  const detect = (env: NodeJS.ProcessEnv, platform: NodeJS.Platform = 'linux'): string =>
    detectColorLevel(env, true, undefined, platform);

  it.each([
    ['Windows Terminal', { WT_SESSION: '...' }, 'win32'],
    ['Windows console', {}, 'win32'],
    ['VS Code', { TERM: 'xterm-256color', TERM_PROGRAM: 'vscode' }, 'darwin'],
    ['iTerm2', { TERM: 'xterm-256color', TERM_PROGRAM: 'iTerm.app' }, 'darwin'],
    ['GNOME Terminal', { TERM: 'xterm-256color', COLORTERM: 'truecolor' }, 'linux'],
    ['kitty', { TERM: 'xterm-kitty' }, 'linux'],
    ['ConEmu', { ConEmuANSI: 'ON' }, 'win32'],
  ] as const)('gives %s the full palette', (_name, env, platform) => {
    expect(detect(env, platform)).toBe('truecolor');
  });

  it('does not promise 24 bits to Terminal.app, which does not do them', () => {
    expect(detect({ TERM: 'xterm-256color', TERM_PROGRAM: 'Apple_Terminal' }, 'darwin')).toBe('ansi256');
  });

  it('obeys NO_COLOR over everything the terminal claims', () => {
    expect(detect({ NO_COLOR: '1', COLORTERM: 'truecolor', WT_SESSION: '...' }, 'win32')).toBe('none');
  });

  it('lets FORCE_COLOR override a terminal that was detected wrong', () => {
    expect(detect({ TERM: 'dumb', FORCE_COLOR: '3' })).toBe('truecolor');
    expect(detect({ COLORTERM: 'truecolor', FORCE_COLOR: '0' })).toBe('none');
  });

  it('writes no escape codes when the output is redirected', () => {
    expect(detectColorLevel({ COLORTERM: 'truecolor' }, false, undefined, 'linux')).toBe('none');
  });

  it('falls back to 16 colours on a terminal it does not recognise', () => {
    expect(detect({ TERM: 'xterm' })).toBe('ansi16');
  });

  it('takes TERM=dumb at its word', () => {
    expect(detect({ TERM: 'dumb' }, 'win32')).toBe('none');
  });
});

describe('terminal colors', () => {
  /**
   * The last frame almost always ends mid-colour. Without clearing SGR before
   * leaving the alt-screen, that attribute still applies in the main buffer and
   * the user's shell keeps writing in colour after the CLI has exited.
   */
  it('should reset attributes before leaving the alt screen', () => {
    const { stdin, stdout } = fakeStreams();
    const terminal = createTerminal({ stdin, stdout });
    const write = stdout.write as unknown as jest.Mock;

    terminal.enterAltScreen();
    write.mockClear();

    terminal.restore();

    const written = write.mock.calls.map(call => String(call[0]));
    const reset = written.findIndex(bytes => bytes === '\x1b[0m');
    const leaveAltScreen = written.findIndex(bytes => bytes.includes('?1049l'));

    expect(reset).toBeGreaterThanOrEqual(0);
    expect(leaveAltScreen).toBeGreaterThan(reset);
  });
});
