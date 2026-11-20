import {
  INTERRUPTED_EXIT_CODE,
  InterruptedError,
  isInterrupting,
  onInterrupt,
  setInterruptExit,
  throwIfInterrupted,
  track,
} from '@cli/utils/interrupt.js';

describe('onInterrupt', () => {
  const exits: number[] = [];
  let restore: () => void;

  beforeEach(() => {
    exits.length = 0;
    restore = setInterruptExit(code => void exits.push(code));
  });
  afterEach(() => restore());

  const flush = (): Promise<void> => new Promise(resolve => setImmediate(resolve));

  it('installs a signal handler only while something is registered', () => {
    const before = process.listenerCount('SIGINT');
    const stop = onInterrupt(() => undefined);
    expect(process.listenerCount('SIGINT')).toBe(before + 1);
    stop();
    expect(process.listenerCount('SIGINT')).toBe(before);
  });

  it('runs every cleanup to completion on SIGINT, then leaves with 130', async () => {
    const order: string[] = [];
    const stop = onInterrupt(async () => {
      await flush();
      order.push('slow');
    });
    const stopOther = onInterrupt(() => void order.push('fast'));

    process.emit('SIGINT');
    await flush();
    await flush();
    await flush();

    expect(order.sort()).toEqual(['fast', 'slow']);
    expect(exits).toEqual([INTERRUPTED_EXIT_CODE]);
    stop();
    stopOther();
  });

  it('still leaves when a cleanup throws', async () => {
    const stop = onInterrupt(() => {
      throw new Error('disk on fire');
    });

    process.emit('SIGTERM');
    await flush();
    await flush();

    expect(exits).toEqual([INTERRUPTED_EXIT_CODE]);
    stop();
  });

  it('does not run a cleanup that was released', async () => {
    const cleanup = jest.fn();
    onInterrupt(cleanup)();
    const stop = onInterrupt(() => undefined);

    process.emit('SIGINT');
    await flush();
    await flush();

    expect(cleanup).not.toHaveBeenCalled();
    stop();
  });

  it('leaves at once on a second signal while the first is still cleaning up', async () => {
    const stop = onInterrupt(() => new Promise<void>(() => undefined));

    process.emit('SIGINT');
    await flush();
    expect(exits).toEqual([]);

    process.emit('SIGINT');
    await flush();
    expect(exits).toEqual([INTERRUPTED_EXIT_CODE]);
    stop();
  });

  it('refuses to start more work once interrupted, and only then', async () => {
    const stop = onInterrupt(() => undefined);
    expect(() => throwIfInterrupted()).not.toThrow();

    process.emit('SIGINT');
    await flush();

    expect(isInterrupting()).toBe(true);
    expect(() => throwIfInterrupted()).toThrow(InterruptedError);
    stop();
    expect(isInterrupting()).toBe(false);
  });

  it('stops the children it tracks before running the cleanups', async () => {
    const order: string[] = [];
    let settle: () => void = () => undefined;
    const child = Object.assign(new Promise<void>(resolve => (settle = resolve)), {
      kill: jest.fn(() => {
        order.push('kill');
        settle();
      }),
    });
    track(child);
    const stop = onInterrupt(() => void order.push('cleanup'));

    process.emit('SIGINT');
    await flush();
    await flush();
    await flush();

    expect(order).toEqual(['kill', 'cleanup']);
    stop();
  });
});
