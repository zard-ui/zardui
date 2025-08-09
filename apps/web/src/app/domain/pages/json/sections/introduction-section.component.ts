import { Component } from '@angular/core';
import { MarkdownRendererComponent } from '@zard/domain/components/render/markdown-renderer.component';
import { CalloutComponent } from '@zard/domain/components/callout/callout.component';

@Component({
  selector: 'z-json-introduction-section',
  standalone: true,
  imports: [MarkdownRendererComponent, CalloutComponent],
  template: `
    <div class="flex flex-col gap-6 sm:gap-8">
      <p class="text-base sm:text-lg text-muted-foreground leading-relaxed">
        The <code class="bg-muted px-1.5 py-0.5 rounded text-xs sm:text-sm">components.json</code> file holds configuration for your project.
      </p>
      <p class="text-sm sm:text-base text-muted-foreground leading-relaxed">
        We use it to understand how your project is set up and how to generate components customized for your project.
      </p>

      <z-callout title="Note: The components.json file is optional" icon="ℹ" variant="info">
        It is <strong>only required if you're using the CLI</strong> to add components to your project. If you're using the copy and paste method, you don't need this file.
      </z-callout>

      <div class="flex flex-col gap-4">
        <p class="text-sm sm:text-base text-muted-foreground">
          You can create a <code class="bg-muted px-1.5 py-0.5 rounded text-xs sm:text-sm">components.json</code> file in your project by running the following command:
        </p>
        <z-markdown-renderer markdownUrl="documentation/json/init-command.md"></z-markdown-renderer>
      </div>

      <p class="text-sm sm:text-base text-muted-foreground">See the CLI section for more information.</p>
    </div>
  `,
})
export class JsonIntroductionSectionComponent {}
