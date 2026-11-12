import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import type { ZardCodeBlockLineTypeVariants } from '@/shared/components/code-block/code-block.variants';

interface DemoLine {
  text: string;
  type?: ZardCodeBlockLineTypeVariants;
}

@Component({
  selector: 'z-demo-code-block-line-numbers',
  imports: [ZardCodeBlockImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4">
      <z-code-block>
        <z-code-block-content zLineNumbers>{{ commands }}</z-code-block-content>
      </z-code-block>

      <z-code-block>
        <z-code-block-header>
          <z-code-block-title>app.routes.ts</z-code-block-title>
        </z-code-block-header>
        <z-code-block-content zLineNumbers [zStartLine]="12">
          @for (line of routes; track $index) {
            <z-code-block-line [zType]="line.type ?? 'default'">{{ line.text }}</z-code-block-line>
          }
        </z-code-block-content>
      </z-code-block>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCodeBlockLineNumbersComponent {
  protected readonly commands = `npm install zard-cli
npx zard-cli@latest init

npx zard-cli@latest add button`;

  protected readonly routes: DemoLine[] = [
    { text: 'export const routes: Routes = [' },
    { text: "  { path: '', component: HomePage }," },
    { text: "  { path: 'docs', component: DocsPage },", type: 'highlighted' },
    { text: '' },
    { text: "  { path: '**', redirectTo: '' }," },
    { text: '];' },
  ];
}
