import { capture, isCapturing, type LogLevel } from '@cli/ui/log-sink.js';
import { formatRecord, writeLine } from '@cli/ui/output.js';
import { style } from '@cli/ui/style.js';

let debugEnabled = false;

export function enableDebug(): void {
  debugEnabled = true;
}

export function isDebugEnabled(): boolean {
  return debugEnabled;
}

function toMessage(args: unknown[]): string {
  return args
    .map(arg => {
      if (typeof arg === 'string') return arg;
      if (arg instanceof Error) return arg.message;
      return String(arg);
    })
    .join(' ');
}

/**
 * Writes a message — or holds it, while the interactive screen is mounted.
 *
 * Without that diversion, a `logger.warn` fired mid-install would write over the
 * frame the engine just painted.
 */
function emit(level: LogLevel, args: unknown[]): void {
  const message = toMessage(args);
  if (capture(level, message)) return;
  writeLine(formatRecord({ level, message }));
}

export const logger = {
  error(...args: unknown[]) {
    emit('error', args);
  },
  warn(...args: unknown[]) {
    emit('warn', args);
  },
  info(...args: unknown[]) {
    emit('info', args);
  },
  success(...args: unknown[]) {
    emit('success', args);
  },
  debug(...args: unknown[]) {
    if (!debugEnabled) return;
    emit('debug', args);
  },
  break() {
    if (isCapturing()) return;
    writeLine();
  },
};

export interface Spinner {
  text: string;
  start(): Spinner;
  stop(): Spinner;
  succeed(text?: string): Spinner;
  fail(text?: string): Spinner;
}

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const FRAME_MS = 80;

/**
 * Progress indicator for the paths that run outside the interactive screen
 * (headless, --yes, CI). Inside a wizard the engine does the animating, and here
 * the transitions become nothing but records in the sink.
 */
export function spinner(text: string): Spinner {
  const animated = Boolean(process.stdout.isTTY) && !isCapturing();
  let timer: ReturnType<typeof setInterval> | undefined;
  let frame = 0;

  const clearLine = (): void => {
    if (animated) process.stdout.write('\r\x1b[2K');
  };

  const paint = (): void => {
    // Capture can start after the spinner was already running; in that case the
    // screen owns the terminal and nothing else may write to it directly.
    if (isCapturing()) return;
    clearLine();
    process.stdout.write(`${style.primary(FRAMES[frame] ?? FRAMES[0] ?? '')} ${style.dim(instance.text)}`);
    frame = (frame + 1) % FRAMES.length;
  };

  const finish = (level: LogLevel, message?: string): Spinner => {
    instance.stop();
    emit(level, [message ?? instance.text]);
    return instance;
  };

  const instance: Spinner = {
    text,
    start() {
      if (!animated) {
        emit('info', [instance.text]);
        return instance;
      }
      if (timer) return instance;
      paint();
      timer = setInterval(paint, FRAME_MS);
      // An active spinner must not keep the process alive on its own.
      timer.unref?.();
      return instance;
    },
    stop() {
      if (timer) {
        clearInterval(timer);
        timer = undefined;
        clearLine();
      }
      return instance;
    },
    succeed(message?: string) {
      return finish('success', message);
    },
    fail(message?: string) {
      return finish('error', message);
    },
  };

  return instance;
}
