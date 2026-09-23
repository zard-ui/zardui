import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'z-skills-included-section',
  imports: [RouterLink],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      What's included
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Six areas, each its own file. The main guide carries the rules that always apply; the rest is loaded when the work
      calls for it.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Project context</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The first instruction is to read the project's
      <a class="text-foreground underline underline-offset-4" routerLink="/docs/components-json">components.json</a>
      : the import aliases, the source root, the icon family, the package manager, the project type, and the registry
      the project installs from. Those are the values that decide what generated code should look like, and assuming
      them is what produces imports that do not resolve.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">CLI commands</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">init</code>
      and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">add</code>
      with every flag, the five project types and what follows from each, and how the headless path behaves. It also
      states what does not exist — there is no
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">search</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">diff</code>
      or
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">info</code>
      command, and inventing one is the failure that looks most like success.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Registry</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The three published files — the index, the items, the icon catalog — with their JSON Schemas, what
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">schemaVersion</code>
      means, and how to point a project at a
      <a class="text-foreground underline underline-offset-4" routerLink="/docs/registry">registry of your own</a>
      .
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">MCP server</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The nine tools with their inputs, how to connect the server in each client, and the two environment variables that
      point it at another registry. Mostly a pointer to
      <a class="text-foreground underline underline-offset-4" routerLink="/docs/mcp">the same thing documented here</a>
      , so the assistant knows the tools exist and reaches for them before guessing at an API.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Theming and customization</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The
      <a class="text-foreground underline underline-offset-4" routerLink="/docs/theming">theme tokens</a>
      and how to add one, CVA variants in
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&lt;name&gt;.variants.ts</code>
      ,
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">mergeClasses</code>
      and the order its arguments go in, and which layer to change for which kind of customization — with the note that
      an edit to a component's body is the one that a later
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--overwrite</code>
      discards.
    </p>

    <h3 class="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Rules</h3>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Five files of incorrect/correct pairs, in real zard/ui code:
    </p>
    <ul class="text-muted-foreground my-6 ml-6 list-disc text-base leading-relaxed [&>li]:mt-2">
      <li>
        <strong class="text-foreground font-medium">Angular</strong>
        — standalone,
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">input()</code>
        , OnPush,
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">ViewEncapsulation.None</code>
        , and the element-versus-attribute selectors
      </li>
      <li>
        <strong class="text-foreground font-medium">Styling</strong>
        — semantic tokens, variants before raw classes,
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">class</code>
        for layout only
      </li>
      <li>
        <strong class="text-foreground font-medium">Composition</strong>
        — the full card, items inside their group, dialogs opened by a service
      </li>
      <li>
        <strong class="text-foreground font-medium">Forms</strong>
        — the three
        <a class="text-foreground underline underline-offset-4" routerLink="/docs/forms">form approaches</a>
        ,
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">z-field</code>
        layout, and validation state
      </li>
      <li>
        <strong class="text-foreground font-medium">Icons</strong>
        — ng-icons,
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">provideIcons</code>
        , and the configurable family
      </li>
    </ul>
  `,
})
export class SkillsIncludedSectionComponent {}
