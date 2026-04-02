import { ChangeDetectionStrategy, Component, computed, inject, input, signal, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import type { CodeTabData } from '../../types';
import { CopyButtonComponent } from '../copy-button/copy-button.component';

@Component({
  selector: 'z-code-tabs',
  standalone: true,
  imports: [CopyButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (data(); as d) {
      <div class="group relative my-6 overflow-hidden rounded-lg border">
        <div class="bg-muted/50 text-muted-foreground flex items-center gap-2 border-b px-4 py-2 text-sm">
          @if (icon()) {
            <img [src]="icon()" alt="" class="h-4 w-4 shrink-0 invert-0 dark:invert" />
          }
          <div class="flex">
            @for (tab of d.tabs; track tab.label; let i = $index) {
              <button
                type="button"
                class="cursor-pointer rounded-md px-2 py-1 text-[13px] font-medium transition-colors"
                [class.bg-code-tab]="activeTab() === i"
                [class.text-foreground]="activeTab() === i"
                [class.border]="activeTab() === i"
                [class.text-muted-foreground]="activeTab() !== i"
                (click)="activeTab.set(i)"
              >
                {{ tab.label }}
              </button>
            }
          </div>
          <z-copy-button
            [code]="activeCode()"
            [inHeader]="true"
            class="text-muted-foreground hover:bg-muted focus-visible:ring-ring ml-auto flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-transparent transition-all duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          />
        </div>

        @for (tab of d.tabs; track tab.label; let i = $index) {
          <div [class.hidden]="activeTab() !== i" [innerHTML]="safeTabHtml()[i]"></div>
        }
      </div>
    }
  `,
})
export class CodeTabsComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly data = input.required<CodeTabData>();
  readonly activeTab = signal(0);

  readonly icon = computed(() => {
    const lang = this.data().tabs[0]?.language;
    if (!lang) return null;
    const icons: Record<string, string> = {
      bash: '/icons/terminal.svg',
      shell: '/icons/terminal.svg',
      typescript: '/icons/typescript.svg',
      javascript: '/icons/typescript.svg',
    };
    return icons[lang] ?? null;
  });

  readonly activeCode = computed(() => {
    return this.data().tabs[this.activeTab()]?.code ?? '';
  });

  readonly safeTabHtml = computed(() => {
    return this.data().tabs.map(tab => this.sanitizer.bypassSecurityTrustHtml(tab.html));
  });
}
