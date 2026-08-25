import { NetworkError } from '@cli/utils/errors.js';
import { logger } from '@cli/utils/logger.js';

export interface FetchOptions {
  timeout?: number;
  retries?: number;
  backoffBase?: number;
  headers?: Record<string, string>;
}

const DEFAULT_TIMEOUT = 30_000;
const DEFAULT_RETRIES = 3;
const DEFAULT_BACKOFF_BASE = 1_000;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Whether a body is a web page rather than a payload.
 *
 * A server that answers a registry URL with its own site sends an HTML document,
 * and a document always opens with one of these — so the test is on how the body
 * starts, never on what it happens to contain.
 */
function looksLikeHtml(text: string): boolean {
  const start = text.trimStart().slice(0, 100).toLowerCase();
  return start.startsWith('<!doctype') || start.startsWith('<html');
}

export async function fetchJson<T>(url: string, options?: FetchOptions): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, retries = DEFAULT_RETRIES, backoffBase = DEFAULT_BACKOFF_BASE } = options ?? {};

  const headers: Record<string, string> = {
    'User-Agent': 'zard-cli',
    Accept: 'application/json',
    ...options?.headers,
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(timeout),
        headers,
      });

      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') ?? '5', 10);
        logger.debug(`Rate limited by ${url}, retrying in ${retryAfter}s...`);
        await sleep(retryAfter * 1000);
        continue;
      }

      if (!response.ok) {
        throw new NetworkError(`HTTP ${response.status}: ${response.statusText}`, url);
      }

      const text = await response.text();

      if (!text) {
        throw new NetworkError('Empty response from registry', url);
      }

      try {
        return JSON.parse(text) as T;
      } catch {
        // The HTML check runs only once the parse has already failed. Looking for
        // the markers anywhere in the body rejected any valid payload that merely
        // mentioned them — a code comment containing `<html>` was enough to make a
        // component permanently uninstallable.
        throw new NetworkError(
          looksLikeHtml(text) ? 'Received HTML instead of JSON from registry' : 'Invalid JSON response from registry',
          url,
        );
      }
    } catch (error) {
      if (error instanceof NetworkError) {
        if (attempt === retries) throw error;
      } else if (error instanceof DOMException && error.name === 'TimeoutError') {
        if (attempt === retries) {
          throw new NetworkError(`Request timed out after ${timeout}ms`, url);
        }
      } else if (error instanceof TypeError) {
        // fetch throws TypeError for DNS failures, connection refused, etc.
        if (attempt === retries) {
          throw new NetworkError(`Connection failed: ${error.message}`, url);
        }
      } else {
        throw error;
      }

      const delay = backoffBase * Math.pow(2, attempt - 1);
      logger.debug(`Attempt ${attempt}/${retries} failed for ${url}, retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }

  throw new NetworkError(`Failed after ${retries} attempts`, url);
}
