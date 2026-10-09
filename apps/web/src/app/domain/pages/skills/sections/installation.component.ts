import { Component, ChangeDetectionStrategy } from '@angular/core';

import { TABS_0, TABS_1, BLOCK_2 } from '@generated/pages/skills/installation';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';
import type { CodeBlockData, CodeTabData } from '@highlight/types';

@Component({
  selector: 'z-skills-installation-section',
  imports: [CodeBlockComponent, CodeTabsComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      Installation
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The
      <a class="text-foreground underline underline-offset-4" href="https://skills.sh" target="_blank" rel="noopener">
        skills
      </a>
      CLI installs from this repository. Because it hosts two skills, the command names which one with
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--skill</code>
      . It asks whether to install for the project or globally, and which agents to install it for.
    </p>
    <z-code-tabs [data]="zardTabs" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Migrating a project pinned to an older zard/ui — renamed selectors, a recomposed
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">card</code>
      or
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">input-group</code>
      , source that predates the
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">core</code>
      /
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">utilities</code>
      split? Install
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">zard-migration</code>
      instead, or in addition, with its own
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">--skill</code>
      :
    </p>
    <z-code-tabs [data]="migrationTabs" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Both commands can be run in the same project — they write to separate directories and don't conflict. Installed
      for the project, they land in
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">.claude/skills/zard</code>
      and
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">.claude/skills/zard-migration</code>
      — each a main file and a set of references it links to, so that a rule is only read when it is needed:
    </p>
    <z-code-block [data]="tree" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Nothing else to configure. Committing the installed directories is what makes the skills available to everyone
      working on the project, rather than to whoever ran the command.
    </p>
  `,
})
export class SkillsInstallationSectionComponent {
  readonly zardTabs: CodeTabData = TABS_0;
  readonly migrationTabs: CodeTabData = TABS_1;
  readonly tree: CodeBlockData = BLOCK_2;
}
