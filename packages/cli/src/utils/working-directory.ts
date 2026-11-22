import { CliError } from '@cli/utils/errors.js';
import { statSync } from 'node:fs';

/** Why `cwd` (already resolved) cannot be worked in, or `undefined` when it can. */
export function workingDirectoryProblem(cwd: string): string | undefined {
  try {
    return statSync(cwd).isDirectory() ? undefined : 'is a file, not a directory';
  } catch {
    return 'does not exist';
  }
}

/** Throws a one-line `INVALID_CWD` error naming the path, before anything is read or written. */
export function assertWorkingDirectory(cwd: string, flag = 'The path'): void {
  const problem = workingDirectoryProblem(cwd);
  if (problem) throw new CliError(`${flag} ${cwd} ${problem}. Please try again.`, 'INVALID_CWD');
}
