import { Component } from '@angular/core';

import { BLOCK_2 } from '@generated/pages/mcp/installation';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'mcp-security-section',
  standalone: true,
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">Security</h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Nine tools only read published files. Only
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">install-component</code>
      writes to your project, so keep your client asking before it runs. It never builds a shell command: names are
      validated and passed as discrete arguments, and the project's own
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">zard-cli</code>
      is preferred over downloading one.
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Component docs and source become part of the model's context; treat a custom registry with the same trust as a
      dependency. Teams can pin the server to a version:
    </p>
    <z-code-block [data]="pinned" />
  `,
  imports: [CodeBlockComponent],
})
export class McpSecuritySection {
  readonly pinned: CodeBlockData = BLOCK_2;
}
