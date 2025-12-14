import { Component } from '@angular/core';

import { MarkdownRendererComponent } from '@doc/domain/components/render/markdown-renderer.component';

@Component({
  selector: 'cli-installation-section',
  imports: [MarkdownRendererComponent],
  template: `
    <z-markdown-renderer markdownUrl="/documentation/cli/installation.md"></z-markdown-renderer>
  `,
})
export class CliInstallationSection {}
