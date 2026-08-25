import { Component } from '@angular/core';

import { BLOCK_0, BLOCK_1 } from '@generated/pages/registry/custom-registry';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import type { CodeBlockData } from '@highlight/types';

@Component({
  selector: 'z-registry-custom-registry-section',
  imports: [CodeBlockComponent],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      Pointing the CLI at another registry
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The base URL the CLI reads from is embedded at build time. The published package carries
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">https://zardui.com/r</code>
      , and that value is what every command falls back to.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">The environment variable</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">ZARD_REGISTRY_URL</code>
      takes precedence over the embedded default and is what actually redirects the CLI at another registry.
    </p>
    <z-code-block [data]="envVariable" />

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">The components.json field</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The configuration schema also accepts a
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">registryUrl</code>
      field, which is validated whenever the configuration is loaded.
    </p>
    <z-code-block [data]="componentsJson" />
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The helper that reads this field is not wired into the fetch path yet, so today the field is validated but not
      used to resolve the base URL. Use the environment variable when you need to switch registries.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">URL validation</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      A registry URL must use HTTPS. The only exception is
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">localhost</code>
      and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">127.0.0.1</code>
      , which may be plain HTTP so that a local registry works during development. A malformed URL, or a remote one over
      HTTP, is rejected with a configuration error.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Hosting a compatible registry</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Any host that satisfies the following is a valid registry:
    </p>
    <ul class="text-muted-foreground list-disc space-y-2 pl-6 text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <li>
        Serve
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">GET &lt;base&gt;/registry.json</code>
        in the index format described above.
      </li>
      <li>
        Serve
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">GET &lt;base&gt;/&lt;name&gt;.json</code>
        in the item format for every item listed in the index.
      </li>
      <li>
        Respond with
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">Content-Type: application/json</code>
        .
      </li>
      <li>
        Send
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">Access-Control-Allow-Origin</code>
        if browsers are meant to read it.
      </li>
      <li>Use HTTPS, unless it is running on localhost.</li>
    </ul>
  `,
})
export class RegistryCustomRegistrySectionComponent {
  readonly envVariable: CodeBlockData = BLOCK_0;
  readonly componentsJson: CodeBlockData = BLOCK_1;
}
