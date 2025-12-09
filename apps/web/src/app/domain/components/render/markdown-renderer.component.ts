// markdown-renderer.component.ts
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { lastValueFrom, merge } from 'rxjs';

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
    merge(toObservable(this.markdownUrl), toObservable(this.theme))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async () => {
        const url = this.markdownUrl();
        if (url) {
          await this.loadAndProcessMarkdown();
        }
      });

    toObservable(this.markdownText)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async () => {
        const text = this.markdownText();
        if (text) {
          await this.processMarkdownText();
        }
      });
  }

  private async loadAndProcessMarkdown(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const markdownText = await this.loadFromUrl(this.markdownUrl());
      const html = await this.markdownService.processMarkdown(markdownText);
      this.processedHtml.set(this.sanitizer.bypassSecurityTrustHtml(html));
    } catch (err: any) {
      this.error.set(`Error loading markdown: ${err.message || err}`);
      console.error('Error processing markdown:', err);
    } finally {
      this.loading.set(false);
    }
  }

  private async loadFromUrl(url: string): Promise<string> {
    try {
      const response = await lastValueFrom(this.http.get(url, { responseType: 'text' }));
      return response || '';
    } catch (error: any) {
      throw new Error(`Could not load file: ${url} - ${error.message || error}`);
    }
  }

  private async processMarkdownText(): Promise<void> {
    const markdownText = this.markdownText();
    if (markdownText) {
      this.loading.set(true);
      this.error.set(null);

      try {
        const html = await this.markdownService.processMarkdown(markdownText);
        this.processedHtml.set(this.sanitizer.bypassSecurityTrustHtml(html));
      } catch (error: any) {
        this.error.set(`Error processing markdown: ${error.message || error}`);
        console.error('Error processing markdown:', error);
      } finally {
        this.loading.set(false);
      }
    }
  }
}
