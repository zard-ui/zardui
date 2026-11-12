import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideGlobe } from '@ng-icons/lucide';

import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-dialog',
  imports: [NgIcon, ...ZardDialogImports, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <button type="button" (click)="open.set(true)">
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
          <z-trace-title>Searched the web for cache keys</z-trace-title>
          <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
        </z-trace-line>
      </button>
    </z-trace>

    <z-dialog [(zVisible)]="open">
      <z-dialog-header>
        <z-dialog-title>Searched the web for cache keys</z-dialog-title>
        <z-dialog-description>The agent ran one query and read the top three results.</z-dialog-description>
      </z-dialog-header>
      <ul class="list-disc ps-5 text-sm">
        <li>Cache keys in a monorepo build</li>
        <li>Content-addressed cache invalidation</li>
        <li>Hashing lockfiles for CI caches</li>
      </ul>
    </z-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight, lucideGlobe })],
})
export class ZardDemoTraceDialogComponent {
  protected readonly open = signal(false);
}
