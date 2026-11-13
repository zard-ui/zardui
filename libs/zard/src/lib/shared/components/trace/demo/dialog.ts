import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideChevronRight, lucideGlobe } from '@ng-icons/lucide';

import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-dialog',
  imports: [NgIcon, ...ZardDialogImports, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <button type="button" (click)="open.set(true)">
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
          <z-trace-title>Searched the web for build cache settings</z-trace-title>
          <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
        </z-trace-line>
      </button>
    </z-trace>

    <z-dialog [(zVisible)]="open">
      <z-dialog-header>
        <z-dialog-title>Searched the web for build cache settings</z-dialog-title>
        <z-dialog-description>Three results were used in the response.</z-dialog-description>
      </z-dialog-header>
      <z-trace>
        @for (result of results; track result.url) {
          <a [href]="result.url" target="_blank" rel="noreferrer">
            <z-trace-line>
              <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
              <z-trace-title>
                {{ result.title }}
                <span class="sr-only">(opens in a new tab)</span>
              </z-trace-title>
              <z-trace-icon><ng-icon name="lucideArrowUpRight" /></z-trace-icon>
            </z-trace-line>
          </a>
        }
      </z-trace>
    </z-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpRight, lucideChevronRight, lucideGlobe })],
  host: { class: 'contents' },
})
export class ZardDemoTraceDialogComponent {
  protected readonly open = signal(false);

  protected readonly results = [
    { title: 'Build cache | angular.dev', url: 'https://angular.dev/cli/cache' },
    { title: 'Image optimization | angular.dev', url: 'https://angular.dev/guide/image-optimization' },
    { title: 'Building Angular apps | angular.dev', url: 'https://angular.dev/tools/cli/build' },
  ];
}
