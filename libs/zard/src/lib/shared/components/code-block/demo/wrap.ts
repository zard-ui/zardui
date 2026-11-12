import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideWrapText } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-wrap',
  imports: [ZardCodeBlockImports, ZardButtonComponent, NgIcon],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4">
      <z-code-block>
        <z-code-block-content zWrap>{{ output }}</z-code-block-content>
      </z-code-block>

      <z-code-block>
        <z-code-block-header>
          <z-code-block-title>build.log</z-code-block-title>
          <z-code-block-actions>
            <button
              z-button
              type="button"
              zType="ghost"
              zSize="icon-xs"
              aria-label="Wrap lines"
              [attr.aria-pressed]="wrap()"
              (click)="wrap.set(!wrap())"
            >
              <ng-icon name="lucideWrapText" aria-hidden="true" />
            </button>
            <z-code-block-copy-button [zValue]="output" />
          </z-code-block-actions>
        </z-code-block-header>
        <z-code-block-content [zWrap]="wrap()">{{ output }}</z-code-block-content>
      </z-code-block>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideWrapText })],
})
export class ZardDemoCodeBlockWrapComponent {
  protected readonly wrap = signal(false);

  protected readonly output =
    'Error: Cannot find module "@/shared/components/button/button.component" imported from /workspace/apps/web/src/app/domain/pages/dashboard/dashboard.page.ts. Did you run "npx zard-cli@latest add button"?';
}
