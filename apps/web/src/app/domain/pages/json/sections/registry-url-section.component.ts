import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { JSON_REGISTRY_URL_EXAMPLE } from '@generated/documentation/json/registry-url-example';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'z-json-registry-url-section',
  imports: [CodeBlockComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section class="flex flex-col gap-6 sm:gap-8" scrollSpyItem="registry-url" id="registry-url">
      <div class="flex flex-col gap-4 sm:gap-6">
        <h2
          class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl lg:mt-20"
        >
          Registry URL
        </h2>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          Optional. Points the CLI at a registry other than the official one (
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">https://zardui.com/r</code>
          ), for teams that publish their own component set. The URL must use HTTPS, or be
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">localhost</code>
          during development. Every command that reads the registry —
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">add</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">apply</code>
          and
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">init</code>
          — uses it. Leave the key out to use the official registry.
        </p>
        <z-code-block [data]="registryUrlExample" />
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          To publish a registry of your own, see the
          <a class="text-foreground underline underline-offset-4" routerLink="/docs/registry">registry docs</a>
          .
        </p>
      </div>
    </section>
  `,
})
export class JsonRegistryUrlSectionComponent {
  readonly registryUrlExample: CodeBlockData = JSON_REGISTRY_URL_EXAMPLE;
}
