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
 * O registry publica um formato mais novo do que esta CLI sabe ler.
 *
 * Tem classe própria porque é o único erro de leitura do registry que NÃO pode
 * virar fallback: um arquivo ausente ou uma resposta que não é JSON são motivo
 * para seguir com a cópia local, mas um formato que não entendemos é motivo
 * para parar — continuar seria ler o conteúdo errado achando que está certo.
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
