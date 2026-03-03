import { CliError, ConfigError, InstallError, NetworkError } from '@cli/utils/errors.js';

describe('CliError', () => {
  it('should have the correct name', () => {
    const error = new CliError('something went wrong', 'SOME_CODE');

    expect(error.name).toBe('CliError');
  });

  it('should have the correct message', () => {
    const error = new CliError('something went wrong', 'SOME_CODE');

    expect(error.message).toBe('something went wrong');
  });

  it('should have the correct code', () => {
    const error = new CliError('something went wrong', 'SOME_CODE');

    expect(error.code).toBe('SOME_CODE');
  });

  it('should be an instance of Error', () => {
    const error = new CliError('msg', 'CODE');

    expect(error).toBeInstanceOf(Error);
  });
});

describe('NetworkError', () => {
  it('should extend CliError', () => {
    const error = new NetworkError('network fail', 'https://example.com');

    expect(error).toBeInstanceOf(CliError);
  });

  it('should have the correct name', () => {
    const error = new NetworkError('network fail', 'https://example.com');

    expect(error.name).toBe('NetworkError');
  });

  it('should have the url property', () => {
    const error = new NetworkError('network fail', 'https://example.com/api');

    expect(error.url).toBe('https://example.com/api');
  });

  it('should have code NETWORK_ERROR', () => {
    const error = new NetworkError('network fail', 'https://example.com');

    expect(error.code).toBe('NETWORK_ERROR');
  });

  it('should have the correct message', () => {
    const error = new NetworkError('connection refused', 'https://example.com');

    expect(error.message).toBe('connection refused');
  });
});

describe('ConfigError', () => {
  it('should extend CliError', () => {
    const error = new ConfigError('bad config');

    expect(error).toBeInstanceOf(CliError);
  });

  it('should have the correct name', () => {
    const error = new ConfigError('bad config');

    expect(error.name).toBe('ConfigError');
  });

  it('should have code CONFIG_ERROR', () => {
    const error = new ConfigError('bad config');

    expect(error.code).toBe('CONFIG_ERROR');
  });

  it('should have the correct message', () => {
    const error = new ConfigError('invalid field');

    expect(error.message).toBe('invalid field');
  });
});

describe('InstallError', () => {
  it('should extend CliError', () => {
    const error = new InstallError('install failed', 'button');

    expect(error).toBeInstanceOf(CliError);
  });

  it('should have the correct name', () => {
    const error = new InstallError('install failed', 'button');

    expect(error.name).toBe('InstallError');
  });

  it('should have code INSTALL_ERROR', () => {
    const error = new InstallError('install failed', 'button');

    expect(error.code).toBe('INSTALL_ERROR');
  });

  it('should have the component property', () => {
    const error = new InstallError('install failed', 'button');

    expect(error.component).toBe('button');
  });

  it('should have the correct message', () => {
    const error = new InstallError('write error', 'dialog');

    expect(error.message).toBe('write error');
  });
});
