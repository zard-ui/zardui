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
      <div class="bg-code relative my-6 overflow-hidden rounded-lg">
        <div class="border-border/50 flex items-center gap-2 border-b px-3 py-1">
          <div class="bg-foreground flex size-4 items-center justify-center rounded-[1px] opacity-70">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-code size-3"
            >
              <path d="M5 7l5 5l-5 5"></path>
              <path d="M12 19l7 0"></path>
            </svg>
          </div>
          <div class="text-muted-foreground inline-flex w-fit items-center justify-center" role="tablist">
            @for (tab of d.tabs; track tab.label; let i = $index) {
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="activeTab() === i"
                class="text-foreground/60 hover:text-foreground relative inline-flex h-7 cursor-pointer items-center justify-center rounded-md px-2 py-1 pt-0.5 text-sm font-medium whitespace-nowrap"
                [class.border]="activeTab() === i"
                [class.bg-background]="activeTab() === i"
                [class.text-foreground]="activeTab() === i"
                (click)="activeTab.set(i)"
              >
                {{ tab.label }}
              </button>
            }
          </div>
          <z-copy-button
            [code]="activeCode()"
            class="hover:text-accent-foreground ml-auto flex size-7 cursor-pointer items-center justify-center rounded-md opacity-70 transition-all hover:opacity-100"
          />
        </div>
        @for (tab of d.tabs; track tab.label; let i = $index) {
          <div
            role="tabpanel"
            class="no-scrollbar overflow-x-auto"
            [class.hidden]="activeTab() !== i"
            [innerHTML]="safeTabHtml()[i]"
          ></div>
        }
      </div>
    }
  `,
})
export class CodeTabsComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly data = input.required<CodeTabData>();
  readonly activeTab = signal(0);

  readonly activeCode = computed(() => {
    return this.data().tabs[this.activeTab()]?.code ?? '';
  });

  readonly safeTabHtml = computed(() => {
    return this.data().tabs.map(tab => this.sanitizer.bypassSecurityTrustHtml(tab.html));
  });
}
