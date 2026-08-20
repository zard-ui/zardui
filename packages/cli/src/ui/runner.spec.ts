import { resolveTerminalStreams, screen, text, type TerminalStreams } from './engine/index.js';
import { createGate } from './gate.js';
import { beginCapture, capture, endCapture, isCapturing } from './log-sink.js';
import { isInteractive, NonInteractiveError, runWizard, WizardCancelledError } from './runner.js';
import { fakeTty } from './testing/fake-tty.js';

const flush = (ms = 40) => new Promise(resolve => setTimeout(resolve, ms));

describe('createGate', () => {
  it('resolves the waiter with the settled value', async () => {
    const gate = createGate<string>();
    const waiting = gate.wait();

    expect(gate.pending).toBe(true);
    gate.settle('button');

    await expect(waiting).resolves.toBe('button');
    expect(gate.pending).toBe(false);
  });

  it('ignores a second settle', async () => {
    const gate = createGate<number>();
    const waiting = gate.wait();

    gate.settle(1);
    gate.settle(2);

    await expect(waiting).resolves.toBe(1);
  });

  it('propagates failures to the waiter', async () => {
    const gate = createGate<void>();
    const waiting = gate.wait();

    gate.fail(new Error('boom'));

    await expect(waiting).rejects.toThrow('boom');
  });
});

describe('log sink', () => {
  afterEach(() => {
    if (isCapturing()) endCapture();
  });

  it('retains messages only while capturing', () => {
    expect(capture('info', 'before')).toBe(false);

    beginCapture();
    expect(capture('warn', 'during')).toBe(true);

    const records = endCapture();
    expect(records).toEqual([{ level: 'warn', message: 'during' }]);
    expect(capture('info', 'after')).toBe(false);
  });
});

/**
 * Finding the terminal is what decides between the full screen and text output —
 * and this is exactly where `npx zard-cli init` degraded on macOS and Linux: npm
 * runs the binary through a shell, stdin arrives as a pipe, and requiring it to
 * be a TTY threw away a terminal that was right there.
 */
describe('resolveTerminalStreams', () => {
  const fakeStream = (isTTY: boolean): NodeJS.ReadStream & NodeJS.WriteStream =>
    ({ isTTY }) as unknown as NodeJS.ReadStream & NodeJS.WriteStream;

  const controlling = {
    input: fakeStream(true),
    output: fakeStream(true),
    fromControllingTerminal: true,
    close: jest.fn(),
  } as unknown as TerminalStreams;

  it('uses the inherited descriptors when both are already a terminal', () => {
    const streams = resolveTerminalStreams(fakeStream(true), fakeStream(true), () => controlling);

    expect(streams?.fromControllingTerminal).toBe(false);
  });

  it('falls back to the controlling terminal when stdin arrives as a pipe', () => {
    const streams = resolveTerminalStreams(fakeStream(false), fakeStream(true), () => controlling);

    expect(streams?.fromControllingTerminal).toBe(true);
  });

  it('falls back when stdout is redirected too', () => {
    const streams = resolveTerminalStreams(fakeStream(true), fakeStream(false), () => controlling);

    expect(streams?.fromControllingTerminal).toBe(true);
  });

  it('gives up when there is no terminal at all — CI stays headless', () => {
    expect(resolveTerminalStreams(fakeStream(false), fakeStream(false), () => null)).toBeNull();
  });
});

describe('runWizard', () => {
  it('refuses to mount when there is no terminal to mount on', async () => {
    expect(isInteractive(() => null)).toBe(false);
    await expect(runWizard({ view: () => screen(text('hi')), resolveStreams: () => null })).rejects.toBeInstanceOf(
      NonInteractiveError,
    );
  });

  it('is interactive when a terminal is reachable', () => {
    const tty = fakeTty();

    try {
      expect(isInteractive()).toBe(true);
    } finally {
      tty.restore();
    }
  });

  it('resolves with the value passed to done and restores the terminal', async () => {
    const tty = fakeTty();

    try {
      const wizard = runWizard<string>({
        view: () => screen(text('waiting')),
        onKey: (event, ctx) => {
          if (event.key === 'enter') ctx.done('confirmed');
        },
      });

      await flush();
      expect(tty.isRawMode()).toBe(true);

      tty.press('\r');
      const result = await wizard;

      expect(result.value).toBe('confirmed');
      expect(tty.isRawMode()).toBe(false);
      // Sai do alt-screen e devolve o cursor.
      expect(tty.output()).toContain('\x1b[?1049l');
      expect(tty.output()).toContain('\x1b[?25h');
    } finally {
      tty.restore();
    }
  });

  it('cancels on ctrl+c', async () => {
    const tty = fakeTty();

    try {
      const wizard = runWizard({ view: () => screen(text('waiting')) });
      wizard.catch(() => undefined);

      await flush();
      tty.press('\x03');

      await expect(wizard).rejects.toBeInstanceOf(WizardCancelledError);
      expect(tty.isRawMode()).toBe(false);
    } finally {
      tty.restore();
    }
  });

  it('returns the messages the logger produced while mounted', async () => {
    const tty = fakeTty();

    try {
      const wizard = runWizard<void>({
        view: () => screen(text('working')),
        run: ctx => {
          capture('warn', 'held back');
          ctx.done(undefined);
        },
      });

      const result = await wizard;
      expect(result.logs).toEqual([{ level: 'warn', message: 'held back' }]);
    } finally {
      tty.restore();
    }
  });
});
