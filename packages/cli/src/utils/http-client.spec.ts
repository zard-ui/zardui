jest.mock('@cli/utils/logger.js', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

import { NetworkError } from '@cli/utils/errors.js';
import { fetchJson } from '@cli/utils/http-client.js';

const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

function createMockResponse(options: {
  ok?: boolean;
  status?: number;
  statusText?: string;
  text?: string;
  headers?: Record<string, string>;
}) {
  const { ok = true, status = 200, statusText = 'OK', text = '{}', headers = {} } = options;

  return {
    ok,
    status,
    statusText,
    text: jest.fn().mockResolvedValue(text),
    headers: {
      get: (name: string) => headers[name] ?? null,
    },
  };
}

describe('fetchJson', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockFetch.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should successfully fetch and parse JSON', async () => {
    const data = { name: 'button', version: '1.0.0' };
    mockFetch.mockResolvedValueOnce(createMockResponse({ text: JSON.stringify(data) }));

    const result = await fetchJson('https://example.com/api');

    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith('https://example.com/api', {
      signal: expect.anything(),
      headers: expect.objectContaining({
        'User-Agent': 'ngzard-cli',
        Accept: 'application/json',
      }),
    });
  });

  it('should retry on failure with exponential backoff', async () => {
    let callCount = 0;
    mockFetch.mockImplementation(() => {
      callCount++;
      if (callCount <= 2) {
        return Promise.reject(new TypeError('fetch failed'));
      }
      return Promise.resolve(createMockResponse({ text: JSON.stringify({ ok: true }) }));
    });

    const promise = fetchJson('https://example.com/api', {
      retries: 3,
      backoffBase: 1000,
    });

    // First retry: 1000ms delay
    await jest.advanceTimersByTimeAsync(1000);
    // Second retry: 2000ms delay
    await jest.advanceTimersByTimeAsync(2000);

    const result = await promise;

    expect(result).toEqual({ ok: true });
    expect(callCount).toBe(3);
  });

  it('should throw NetworkError after max retries on TypeError', async () => {
    mockFetch.mockImplementation(() => Promise.reject(new TypeError('fetch failed')));

    const promise = fetchJson('https://example.com/api', {
      retries: 3,
      backoffBase: 100,
    });

    // Attach catch handler immediately to prevent unhandled rejection
    const resultPromise = promise.then(
      () => {
        throw new Error('Expected fetchJson to reject');
      },
      (error: unknown) => error,
    );

    // Advance through all retry delays
    await jest.advanceTimersByTimeAsync(100);
    await jest.advanceTimersByTimeAsync(200);

    const caught = await resultPromise;
    expect(caught).toBeInstanceOf(NetworkError);
    expect((caught as NetworkError).message).toMatch(/Connection failed/);
  });

  it('should handle HTTP 429 rate limit and retry after Retry-After header', async () => {
    let callCount = 0;
    mockFetch.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve(
          createMockResponse({
            ok: false,
            status: 429,
            statusText: 'Too Many Requests',
            headers: { 'Retry-After': '2' },
          }),
        );
      }
      return Promise.resolve(createMockResponse({ text: JSON.stringify({ data: 'ok' }) }));
    });

    const promise = fetchJson('https://example.com/api', {
      retries: 3,
      backoffBase: 100,
    });

    // Advance past the Retry-After sleep (2 seconds)
    await jest.advanceTimersByTimeAsync(2000);

    const result = await promise;

    expect(result).toEqual({ data: 'ok' });
    expect(callCount).toBe(2);
  });

  it('should throw NetworkError on non-ok response after retries', async () => {
    mockFetch.mockImplementation(() =>
      Promise.resolve(
        createMockResponse({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        }),
      ),
    );

    const promise = fetchJson('https://example.com/api', {
      retries: 3,
      backoffBase: 100,
    });

    const resultPromise = promise.then(
      () => {
        throw new Error('Expected fetchJson to reject');
      },
      (error: unknown) => error,
    );

    await jest.advanceTimersByTimeAsync(100);
    await jest.advanceTimersByTimeAsync(200);

    const caught = await resultPromise;
    expect(caught).toBeInstanceOf(NetworkError);
    expect((caught as NetworkError).message).toMatch(/HTTP 500/);
  });

  it('should throw NetworkError when receiving HTML instead of JSON', async () => {
    mockFetch.mockImplementation(() =>
      Promise.resolve(
        createMockResponse({
          text: '<!DOCTYPE html><html><body>Not Found</body></html>',
        }),
      ),
    );

    const promise = fetchJson('https://example.com/api', {
      retries: 3,
      backoffBase: 100,
    });

    const resultPromise = promise.then(
      () => {
        throw new Error('Expected fetchJson to reject');
      },
      (error: unknown) => error,
    );

    await jest.advanceTimersByTimeAsync(100);
    await jest.advanceTimersByTimeAsync(200);

    const caught = await resultPromise;
    expect(caught).toBeInstanceOf(NetworkError);
    expect((caught as NetworkError).message).toMatch(/Received HTML instead of JSON/);
  });

  it('should throw NetworkError on invalid JSON', async () => {
    mockFetch.mockImplementation(() => Promise.resolve(createMockResponse({ text: 'not valid json {{{' })));

    const promise = fetchJson('https://example.com/api', {
      retries: 3,
      backoffBase: 100,
    });

    const resultPromise = promise.then(
      () => {
        throw new Error('Expected fetchJson to reject');
      },
      (error: unknown) => error,
    );

    await jest.advanceTimersByTimeAsync(100);
    await jest.advanceTimersByTimeAsync(200);

    const caught = await resultPromise;
    expect(caught).toBeInstanceOf(NetworkError);
    expect((caught as NetworkError).message).toMatch(/Invalid JSON response/);
  });

  it('should throw NetworkError on timeout (DOMException with TimeoutError)', async () => {
    mockFetch.mockImplementation(() => Promise.reject(new DOMException('The operation was aborted', 'TimeoutError')));

    const promise = fetchJson('https://example.com/api', {
      retries: 3,
      backoffBase: 100,
      timeout: 5000,
    });

    const resultPromise = promise.then(
      () => {
        throw new Error('Expected fetchJson to reject');
      },
      (error: unknown) => error,
    );

    await jest.advanceTimersByTimeAsync(100);
    await jest.advanceTimersByTimeAsync(200);

    const caught = await resultPromise;
    expect(caught).toBeInstanceOf(NetworkError);
    expect((caught as NetworkError).message).toMatch(/Request timed out/);
  });

  it('should throw NetworkError on DNS/connection failure (TypeError)', async () => {
    mockFetch.mockImplementation(() => Promise.reject(new TypeError('getaddrinfo ENOTFOUND example.com')));

    const promise = fetchJson('https://example.com/api', {
      retries: 3,
      backoffBase: 100,
    });

    const resultPromise = promise.then(
      () => {
        throw new Error('Expected fetchJson to reject');
      },
      (error: unknown) => error,
    );

    await jest.advanceTimersByTimeAsync(100);
    await jest.advanceTimersByTimeAsync(200);

    const caught = await resultPromise;
    expect(caught).toBeInstanceOf(NetworkError);
    expect((caught as NetworkError).message).toMatch(/Connection failed/);
  });
});
