import { Component } from '@angular/core';

import { MarkdownRendererComponent } from '../../../components/render/markdown-renderer.component';

@Component({
  selector: 'z-json-package-manager-section',
  standalone: true,
  imports: [MarkdownRendererComponent],
  template: `
    <section class="flex flex-col gap-6 sm:gap-8" scrollSpyItem="package-manager" id="package-manager">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl lg:mt-20">Package Manager</h2>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          The package manager to use for installing dependencies. This configuration helps the CLI use the correct package runner commands for your project.
        </p>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          <strong>Supported values:</strong> <code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">npm</code>,
          <code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">pnpm</code>,
          <code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">yarn</code>, or
          <code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">bun</code>
        </p>
        <z-markdown-renderer markdownUrl="documentation/json/package-manager-example.md"></z-markdown-renderer>
      </div>
    </section>
  `,
})
export class JsonPackageManagerSectionComponent {}
