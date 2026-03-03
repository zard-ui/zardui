import chalk from 'chalk';
import ora from 'ora';

let debugEnabled = false;

export function enableDebug(): void {
  debugEnabled = true;
}

export function isDebugEnabled(): boolean {
  return debugEnabled;
}

export const logger = {
  error(...args: unknown[]) {
    console.log(chalk.red(...args));
  },
  warn(...args: unknown[]) {
    console.log(chalk.yellow(...args));
  },
  info(...args: unknown[]) {
    console.log(chalk.cyan(...args));
  },
  success(...args: unknown[]) {
    console.log(chalk.green(...args));
  },
  debug(...args: unknown[]) {
    if (debugEnabled) {
      console.log(chalk.gray('[debug]', ...args));
    }
  },
  break() {
    console.log('');
  },
};

export function spinner(text: string) {
  return ora({
    text: chalk.dim(text),
    spinner: 'dots',
    color: 'cyan',
  });
}
