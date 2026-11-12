import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileCode } from '@ng-icons/lucide';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-header',
  imports: [ZardCodeBlockImports, NgIcon],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>
          <ng-icon name="lucideFileCode" aria-hidden="true" />
          src/app/app.config.ts
        </z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="code" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content>{{ code }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideFileCode })],
})
export class ZardDemoCodeBlockHeaderComponent {
  protected readonly code = `export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration()],
};`;
}
