/**
 * Logger utility for ZardUI MCP Server
 */

export interface Logger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  level: string;
}

class ConsoleLogger implements Logger {
  private _level = 'info';

  get level(): string {
    return this._level;
  }

  set level(newLevel: string) {
    if (['error', 'warn', 'info', 'debug'].includes(newLevel)) {
      this._level = newLevel;
    }
  }

  private shouldLog(level: string): boolean {
    const levels = { error: 0, warn: 1, info: 2, debug: 3 };
    const currentLevel = levels[this._level as keyof typeof levels] ?? 2;
    const messageLevel = levels[level as keyof typeof levels] ?? 2;
    return messageLevel <= currentLevel;
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }
}

export const logger = new ConsoleLogger();
