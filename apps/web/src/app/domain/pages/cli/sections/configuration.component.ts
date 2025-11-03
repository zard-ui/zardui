import { Component } from '@angular/core';

import { MarkdownRendererComponent } from '@doc/domain/components/render/markdown-renderer.component';

@Component({
  selector: 'cli-configuration-section',
  standalone: true,
  imports: [MarkdownRendererComponent],
  template: ` <z-markdown-renderer markdownUrl="/documentation/cli/configuration.md"></z-markdown-renderer> `,
})
export class CliConfigurationSection {}
