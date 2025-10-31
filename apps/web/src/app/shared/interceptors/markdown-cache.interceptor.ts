import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';

import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface CacheEntry {
  response: HttpResponse<any>;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * HTTP interceptor that caches markdown and text file responses
 * to improve performance by avoiding redundant network requests.
 */
export const markdownCacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Only cache markdown/text files
  if (!req.url.includes('.md') && req.responseType !== 'text') {
    return next(req);
  }

  // Only cache GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  const cached = cache.get(req.url);
  const now = Date.now();

  // Return cached response if valid
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return of(cached.response.clone());
  }

  // Fetch and cache
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cache.set(req.url, {
          response: event.clone(),
          timestamp: now,
        });
      }
    }),
  );
};
