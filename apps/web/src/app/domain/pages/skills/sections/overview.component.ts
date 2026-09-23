import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'z-skills-overview-section',
  imports: [RouterLink],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      What it changes
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      An assistant asked for a zard/ui component writes from whatever it absorbed about the library — which is how you
      get an
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&#64;Input()</code>
      on a signal component, a
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">&lt;z-button&gt;</code>
      element where the selector is an attribute, and a dialog toggled by a boolean that this library opens through a
      service. The skill replaces the recollection with the conventions: how components are installed, what the inputs
      are called, and which composition is the right one.
    </p>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Prompts it makes work as asked, rather than after two rounds of corrections:
    </p>
    <ul class="text-muted-foreground my-6 ml-6 list-disc text-base leading-relaxed [&>li]:mt-2">
      <li><em>"Add a profile form with Signal Forms, validated, with the errors under each field."</em></li>
      <li><em>"Build a settings page with a sidebar layout and a card per section."</em></li>
      <li><em>"Switch the theme to zinc."</em></li>
      <li><em>"Install the components from our private registry instead of the public one."</em></li>
      <li><em>"Set this up in the admin app of our Nx workspace."</em></li>
    </ul>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      It is complementary to the
      <a class="text-foreground underline underline-offset-4" routerLink="/docs/mcp">MCP server</a>
      , not a replacement: the server fetches the real source and documentation on demand, the skill carries the
      conventions that apply before any component is fetched. Together they cover both halves of the problem.
    </p>
  `,
})
export class SkillsOverviewSectionComponent {}
