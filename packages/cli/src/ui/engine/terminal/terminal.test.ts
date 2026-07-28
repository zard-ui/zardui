import { createTerminal } from './index.js';

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
    // devolve o shell depois que o wizard termina.
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
