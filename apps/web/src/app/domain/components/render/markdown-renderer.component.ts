// markdown-renderer.component.ts
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { MarkdownService } from '@doc/shared/services/markdown.service';

import { ZardLoaderComponent } from '@zard/components/loader/loader.component';

@Component({
  selector: 'z-markdown-renderer',
  template: `
    <div class="markdown-content">
      @if (loading) {
        <div class="flex items-center justify-center p-8">
          <z-loader />
          <span class="ml-2 text-gray-600">Loading...</span>
        </div>
      } @else if (error) {
        <div class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{{ error }}</div>
      } @else {
        <main class="relative">
          <div class="" [innerHTML]="processedHtml"></div>
        </main>
      }
    </div>
  `,
  standalone: true,
  imports: [ZardLoaderComponent],
})
export class MarkdownRendererComponent implements OnChanges, OnInit {
  private readonly markdownService = inject(MarkdownService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly http = inject(HttpClient);

  @Input() markdownUrl!: string;
  @Input() theme: 'light' | 'dark' = 'light';

  processedHtml: SafeHtml = '';
  loading = false;
  error: string | null = null;

  ngOnInit() {
    if (this.markdownUrl) {
      this.loadAndProcessMarkdown();
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['markdownUrl'] || changes['theme']) {
      if (this.markdownUrl) {
        await this.loadAndProcessMarkdown();
      }
    }
  }

  private async loadAndProcessMarkdown() {
    this.loading = true;
    this.error = null;

    try {
      const markdownText = await this.loadFromUrl(this.markdownUrl);
      const html = await this.markdownService.processMarkdown(markdownText);
      this.processedHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    } catch (err: any) {
      this.error = `Error loading markdown: ${err.message || err}`;
      console.error('Error processing markdown:', err);
    } finally {
      this.loading = false;
    }
  }

  private async loadFromUrl(url: string): Promise<string> {
    try {
      const response = await this.http.get(url, { responseType: 'text' }).toPromise();
      return response || '';
    } catch (error: any) {
      throw new Error(`Could not load file: ${url} - ${error.message || error}`);
    }
  }
}
