import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import type { CodeBlockData } from '../../types';
import { CopyButtonComponent } from '../copy-button/copy-button.component';
import { ExpandableCodeComponent } from '../expandable-code/expandable-code.component';

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
};

@Component({
  selector: 'z-code-block',
  standalone: true,
  imports: [CopyButtonComponent, ExpandableCodeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (data(); as d) {
      <div
        class="group relative overflow-hidden"
        [class.my-6]="!embedded()"
        [class.rounded-lg]="!embedded()"
        [class.border]="!embedded()"
      >
        @if (d.title) {
          <div class="bg-muted/50 text-muted-foreground flex items-center gap-2 border-b px-4 py-2 text-sm">
            @if (icon()) {
              <img [src]="icon()" alt="" class="h-4 w-4 shrink-0 invert-0 dark:invert" />
            }
            <span class="text-[13px] leading-none font-medium text-neutral-500">
              {{ d.title }}
            </span>
            @if (d.copyButton) {
              <z-copy-button
                [code]="d.code"
                [inHeader]="true"
                class="text-muted-foreground focus-visible:ring-ring ml-auto flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-transparent transition-all duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              />
            }
          </div>
        }

        @if (d.expandable) {
          <z-expandable-code [title]="d.expandableTitle ?? 'View Code'">
            <div [innerHTML]="safeHtml()" [class.line-numbers]="d.showLineNumbers"></div>
          </z-expandable-code>
        } @else {
          <div [innerHTML]="safeHtml()" [class.line-numbers]="d.showLineNumbers"></div>
        }

        @if (d.copyButton && !d.title) {
          <z-copy-button
            [code]="d.code"
            class="bg-code text-muted-foreground focus-visible:ring-ring absolute top-3 right-3 z-20 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          />
        }
      </div>
    }
  `,
})
export class CodeBlockComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly data = input.required<CodeBlockData>();
  readonly embedded = input(false);

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
