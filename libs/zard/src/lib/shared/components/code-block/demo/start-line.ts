import { ChangeDetectionStrategy, Component } from '@angular/core';

import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const CODE = `  if (!session) {
    return this.router.parseUrl('/login');
  }

  const projects = await this.projects.findAll({
    ownerId: session.user.id,
    orderBy: 'updatedAt',
  });

  this.projectList.set(projects);
}`;

@Component({
  selector: 'z-demo-code-block-start-line',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>src/app/dashboard/dashboard.component.ts</z-code-block-title>
      </z-code-block-header>
      <z-code-block-content zLineNumbers [zStartLine]="995">
        @for (line of lines(); track $index) {
          <z-code-block-line [zTokens]="line" />
        }
      </z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockStartLineComponent {
  protected readonly lines = injectHighlightedCode(CODE, 'typescript');
}
