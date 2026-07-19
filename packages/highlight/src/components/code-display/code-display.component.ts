import { ChangeDetectionStrategy, Component, computed, inject, input, signal, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import type { CodeBlockData } from '../../types';
import { CopyButtonComponent } from '../copy-button/copy-button.component';

const FILE_ICONS: Record<string, string> = {
  'component.ts': '/icons/angular-file.svg',
  'service.ts': '/icons/angular-file.svg',
  'directive.ts': '/icons/angular-file.svg',
  'guard.ts': '/icons/angular-file.svg',
  'pipe.ts': '/icons/angular-file.svg',
  'module.ts': '/icons/angular-file.svg',
};

const EXTENSION_ICONS: Record<string, string> = {
  ts: '/icons/typescript.svg',
  js: '/icons/typescript.svg',
  html: '/icons/html.svg',
  css: '/icons/code.svg',
  json: '/icons/braces.svg',
  bash: '/icons/terminal.svg',
  shell: '/icons/terminal.svg',
  sh: '/icons/terminal.svg',
};

const LANGUAGE_ICONS: Record<string, string> = {
  typescript: '/icons/typescript.svg',
  javascript: '/icons/typescript.svg',
  'angular-ts': '/icons/angular-file.svg',
  'angular-html': '/icons/html.svg',
  html: '/icons/html.svg',
  css: '/icons/code.svg',
  json: '/icons/braces.svg',
  bash: '/icons/terminal.svg',
  shell: '/icons/terminal.svg',
  tsx: '/icons/typescript.svg',
};

@Component({
  selector: 'z-code-display',
  standalone: true,
  imports: [CopyButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (data(); as d) {
      <div class="bg-code group/collapsible relative my-6 overflow-hidden rounded-xl">
        <!-- Header: title left, expand/collapse + copy right -->
        <div class="bg-code text-code-foreground border-border/50 flex items-center gap-2 border-b px-4 py-2 text-sm">
          @if (icon()) {
            <img [src]="icon()" alt="" class="h-4 w-4 shrink-0 opacity-70 invert-0 dark:invert" />
          }
          @if (d.title) {
            <span class="font-medium">{{ d.title }}</span>
          }

          <div class="ml-auto flex items-center">
            @if (d.expandable) {
              <button
                type="button"
                class="text-muted-foreground hover:text-foreground inline-flex h-7 cursor-pointer items-center justify-center rounded-md px-2 text-sm font-medium transition-all"
                (click)="expanded.update(v => !v)"
              >
                {{ expanded() ? 'Collapse' : 'Expand' }}
              </button>
              <div class="bg-border mx-1.5 h-4 w-px shrink-0"></div>
            }
            <z-copy-button
              [code]="d.code"
              class="text-muted-foreground hover:text-foreground flex size-7 cursor-pointer items-center justify-center rounded-md transition-all hover:opacity-100"
            />
          </div>
        </div>

        <!-- Code content -->
        <div class="relative overflow-hidden" [class.max-h-64]="d.expandable && !expanded()">
          <div [innerHTML]="safeHtml()" [class.line-numbers]="d.showLineNumbers"></div>

          @if (d.expandable && !expanded()) {
            <button
              type="button"
              class="text-muted-foreground from-code/70 to-code absolute inset-x-0 bottom-0 flex h-20 cursor-pointer items-center justify-center bg-gradient-to-b text-sm"
              (click)="expanded.set(true)"
            >
              Expand
            </button>
          }
        </div>
      </div>
    }
  `,
})
export class CodeDisplayComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly data = input.required<CodeBlockData>();
  readonly expanded = signal(false);

  readonly icon = computed(() => {
    const d = this.data();
    if (d.title) {
      return getIconForFile(d.title) ?? getIconForLanguage(d.language);
    }
    return getIconForLanguage(d.language);
  });

  readonly safeHtml = computed(() => {
    return this.sanitizer.bypassSecurityTrustHtml(this.data().html);
  });
}

function getIconForFile(filename: string): string | null {
  for (const [pattern, icon] of Object.entries(FILE_ICONS)) {
    if (filename.endsWith(pattern)) return icon;
  }
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext ? (EXTENSION_ICONS[ext] ?? null) : null;
}

function getIconForLanguage(language: string): string | null {
  return LANGUAGE_ICONS[language.toLowerCase()] ?? null;
}
