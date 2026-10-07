const FETCH_TIMEOUT = 10_000;

/** An HTTP answer that was not 2xx, with the status kept so callers can tell 404 from an outage. */
export class HttpError extends Error {
  readonly status: number;

  constructor(response: Pick<Response, 'status' | 'statusText'>) {
    super(`HTTP ${response.status}: ${response.statusText}`);
    this.name = 'HttpError';
    this.status = response.status;
  }
}

/**
 * The site is a single-page app: a path that does not exist answers 200 with
 * the HTML shell. For a JSON or markdown resource, that shell means 404.
 */
export function isHtmlShell(response: Response): boolean {
  return (response.headers.get('content-type') ?? '').includes('text/html');
}

/**
 * `fetch` that gives up after ten seconds, body included: the signal stays armed
 * while the caller reads the response, and aborting a finished request is a
 * no-op. The timer is unref'd so it never holds the process open.
 */
export function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), FETCH_TIMEOUT).unref?.();
  return fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'zard-mcp' } });
}

export function isNotFound(error: unknown): boolean {
  return error instanceof HttpError && error.status === 404;
}
