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

/**
 * The registry publishes a newer format than this CLI knows how to read.
 *
 * It has its own class because it is the one registry read error that must NOT
 * become a fallback: a missing file or a response that is not JSON are reasons
 * to carry on with the local copy, but a format we do not understand is a reason
 * to stop — carrying on would mean reading the wrong content and believing it.
 */
export class SchemaVersionError extends CliError {
  constructor(message: string) {
    super(message, 'UNSUPPORTED_SCHEMA_VERSION');
    this.name = 'SchemaVersionError';
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
