import { Component } from '@angular/core';

import { MarkdownRendererComponent } from '@doc/domain/components/render/markdown-renderer.component';

@Component({
  selector: 'cli-commands-section',
  standalone: true,
  imports: [MarkdownRendererComponent],
  template: ` <z-markdown-renderer markdownUrl="/documentation/cli/commands.md"></z-markdown-renderer> `,
})
export class CliCommandsSection {}
