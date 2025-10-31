import { HttpClient } from '@angular/common/http';
import { Injectable, TransferState, makeStateKey, inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Service that handles markdown file loading with TransferState support
 * to prevent duplicate HTTP requests during SSR hydration.
 *
 * When running server-side, fetched content is stored in TransferState.
 * When running client-side, content is first checked in TransferState (from SSR)
 * before making HTTP requests.
 */
@Injectable({ providedIn: 'root' })
export class MarkdownCacheService {
  private readonly transferState = inject(TransferState);
  private readonly http = inject(HttpClient);
  private readonly memoryCache = new Map<string, string>();

  /**
   * Loads markdown content from URL with caching and TransferState support
   * @param url The URL of the markdown file to load
   * @returns Observable of the markdown content
   */
  loadMarkdown(url: string): Observable<string> {
    const key = makeStateKey<string>(`markdown-${url}`);

    // 1. Check TransferState (from SSR)
    const transferred = this.transferState.get(key, null);
    if (transferred !== null) {
      this.transferState.remove(key);
      this.memoryCache.set(url, transferred);
      return of(transferred);
    }

    // 2. Check memory cache
    if (this.memoryCache.has(url)) {
      return of(this.memoryCache.get(url)!);
    }

    // 3. Fetch from server
    return this.http.get(url, { responseType: 'text' }).pipe(
      tap(content => {
        this.memoryCache.set(url, content);
        this.transferState.set(key, content);
      }),
    );
  }

  /**
   * Clears the memory cache
   */
  clearCache(): void {
    this.memoryCache.clear();
  }

  /**
   * Removes a specific URL from the cache
   */
  removeFromCache(url: string): void {
    this.memoryCache.delete(url);
  }
}
