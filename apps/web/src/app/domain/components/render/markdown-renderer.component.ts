import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { EMPTY, from, of } from 'rxjs';
import { catchError, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

import { MarkdownService } from '@doc/shared/services/markdown.service';

import { ZardLoaderComponent } from '@zard/components/loader/loader.component';

@Component({
  selector: 'z-markdown-renderer',
  template: `
    <div class="markdown-content">
      @if (loading()) {
        <div class="flex items-center justify-center p-8">
          <z-loader />
          <span class="ml-2 text-gray-600">Loading...</span>
        </div>
      } @else if (error()) {
        <div class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{{ error() }}</div>
      } @else {
        <main class="relative">
          <div [innerHTML]="processedHtml() ?? ''"></div>
        </main>
      }
    </div>
  `,
  imports: [ZardLoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownRendererComponent {
  private static readonly cache = new Map<string, string>();

  static clearCache(): void {
    MarkdownRendererComponent.cache.clear();
  }

  private readonly destroyRef = inject(DestroyRef);
  private readonly http = inject(HttpClient);
  private readonly markdownService = inject(MarkdownService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly markdownUrl = input('');
  readonly theme = input<'light' | 'dark'>('light');
  readonly markdownText = input<string | undefined>();

  readonly processedHtml = signal<SafeHtml | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    toObservable(this.markdownUrl)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(url => !!url),
        distinctUntilChanged(),
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap(url => {
          const cached = MarkdownRendererComponent.cache.get(url);
          if (cached) return of(cached);
          return this.http
            .get(url, { responseType: 'text' })
            .pipe(tap(text => MarkdownRendererComponent.cache.set(url, text)));
        }),
        switchMap(text => from(this.markdownService.processMarkdown(text))),
        catchError(err => {
          this.error.set(`Error loading markdown: ${err.message || err}`);
          this.loading.set(false);
          return EMPTY;
        }),
      )
      .subscribe(html => {
        this.processedHtml.set(this.sanitizer.bypassSecurityTrustHtml(html));
        this.loading.set(false);
      });

    toObservable(this.markdownText)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((text): text is string => !!text),
        distinctUntilChanged(),
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap(text => from(this.markdownService.processMarkdown(text))),
        catchError(err => {
          this.error.set(`Error processing markdown: ${err.message || err}`);
          this.loading.set(false);
          return EMPTY;
        }),
      )
      .subscribe(html => {
        this.processedHtml.set(this.sanitizer.bypassSecurityTrustHtml(html));
        this.loading.set(false);
      });
  }
}
