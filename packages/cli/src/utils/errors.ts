export class CliError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'CliError';
  }
}

export class NetworkError extends CliError {
  constructor(
    message: string,
    public readonly url: string,
  ) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class ConfigError extends CliError {
  constructor(message: string) {
    super(message, 'CONFIG_ERROR');
    this.name = 'ConfigError';
  }
}

export class InstallError extends CliError {
  constructor(
    message: string,
    public readonly component: string,
  ) {
    super(message, 'INSTALL_ERROR');
    this.name = 'InstallError';
  }
}
