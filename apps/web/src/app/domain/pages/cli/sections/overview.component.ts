import { Component } from '@angular/core';

import { MarkdownRendererComponent } from '@doc/domain/components/render/markdown-renderer.component';

@Component({
  selector: 'cli-overview-section',
  standalone: true,
  imports: [MarkdownRendererComponent],
  template: `
    <z-markdown-renderer markdownUrl="/documentation/cli/overview.md"></z-markdown-renderer>
  `,
})
export class CliOverviewSection {}
