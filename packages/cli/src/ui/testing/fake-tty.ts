/**
 * Um TTY simulado para exercitar wizards sem um terminal real.
 *
 * `runWizard` se recusa a montar fora de um TTY — é o que protege o usuário de
 * uma UI de tela cheia num pipe. Para testar o wizard em si, então, stdout vira
 * um buffer e stdin um emissor onde injetamos bytes de teclado.
 */

import { EventEmitter } from 'node:events';

export interface FakeTty {
  /** Tudo o que foi escrito, concatenado. */
  output(): string;
  isRawMode(): boolean;
  /** Injeta bytes de teclado — `\r` para enter, `\x1b[B` para seta abaixo. */
  press(bytes: string): void;
  restore(): void;
}

export const KEY = {
  enter: '\r',
  up: '\x1b[A',
  down: '\x1b[B',
  left: '\x1b[D',
  right: '\x1b[C',
  backspace: '\x7f',
  escape: '\x1b',
} as const;

export function fakeTty(): FakeTty {
  const written: string[] = [];
  const originalWrite = process.stdout.write.bind(process.stdout);
  const originalStdin = process.stdin;
  const descriptors = {
    isTTY: Object.getOwnPropertyDescriptor(process.stdout, 'isTTY'),
    columns: Object.getOwnPropertyDescriptor(process.stdout, 'columns'),
    rows: Object.getOwnPropertyDescriptor(process.stdout, 'rows'),
  };

  process.stdout.write = ((chunk: string) => {
    written.push(String(chunk));
    return true;
  }) as typeof process.stdout.write;

  Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true });
  Object.defineProperty(process.stdout, 'columns', { value: 80, configurable: true });
  Object.defineProperty(process.stdout, 'rows', { value: 24, configurable: true });

  const stdin = new EventEmitter() as EventEmitter & {
    isTTY: boolean;
    setRawMode(value: boolean): void;
    resume(): void;
    pause(): void;
  };
  let rawMode = false;
  stdin.isTTY = true;
  stdin.setRawMode = value => {
    rawMode = value;
  };
  stdin.resume = () => undefined;
  stdin.pause = () => undefined;
  Object.defineProperty(process, 'stdin', { value: stdin, configurable: true });

  return {
    output: () => written.join(''),
    isRawMode: () => rawMode,
    press: bytes => {
      stdin.emit('data', Buffer.from(bytes, 'utf8'));
    },
    restore: () => {
      process.stdout.write = originalWrite;
      Object.defineProperty(process, 'stdin', { value: originalStdin, configurable: true });
      for (const [key, descriptor] of Object.entries(descriptors)) {
        if (descriptor) Object.defineProperty(process.stdout, key, descriptor);
        else delete (process.stdout as unknown as Record<string, unknown>)[key];
      }
    },
  };
}
