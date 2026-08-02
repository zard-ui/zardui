import { screen, text } from './engine/index.js';
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

describe('runWizard', () => {
  it('refuses to mount without a TTY', async () => {
    // O ambiente de teste do Jest não é um TTY.
    expect(isInteractive()).toBe(false);
    await expect(runWizard({ view: () => screen(text('hi')) })).rejects.toBeInstanceOf(NonInteractiveError);
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
