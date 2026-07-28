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
 * Escreve uma mensagem — ou a retém, quando a tela interativa está montada.
 *
 * Sem esse desvio, um `logger.warn` disparado no meio de uma instalação
 * escreveria por cima do frame que a engine acabou de pintar.
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
 * Indicador de progresso para os caminhos que rodam fora da tela interativa
 * (headless, --yes, CI). Dentro de um wizard quem anima é a engine, e aqui as
 * transições viram apenas registros no sink.
 */
export function spinner(text: string): Spinner {
  const animated = Boolean(process.stdout.isTTY) && !isCapturing();
  let timer: ReturnType<typeof setInterval> | undefined;
  let frame = 0;

  const clearLine = (): void => {
    if (animated) process.stdout.write('\r\x1b[2K');
  };

  const paint = (): void => {
    // A captura pode começar depois que o spinner já estava rodando; nesse caso
    // a tela é dona do terminal e nada mais pode escrever direto nele.
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
      // Um spinner ativo não deve segurar o processo vivo por si só.
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
