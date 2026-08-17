import { Component } from '@angular/core';

import { TABS_0, BLOCK_1 } from '@generated/pages/skills/installation';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';
import type { CodeBlockData, CodeTabData } from '@highlight/types';

@Component({
  selector: 'skills-installation-section',
  standalone: true,
  imports: [CodeBlockComponent, CodeTabsComponent],
  template: `
    <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-semibold tracking-tight first:mt-0 lg:mt-20">
      Installation
    </h2>
    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      The
      <a class="text-foreground underline underline-offset-4" href="https://skills.sh" target="_blank" rel="noopener">
        skills
      </a>
      CLI installs it from this repository. It asks whether to install for the project or globally, and which agents to
      install it for.
    </p>
    <z-code-tabs [data]="installTabs" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Installed for the project, it lands in
      <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">.claude/skills/zard</code>
      — one main file and a set of references it links to, so that a rule is only read when it is needed:
    </p>
    <z-code-block [data]="tree" />

    <p class="text-muted-foreground text-base leading-relaxed [&:not(:first-child)]:mt-4">
      Nothing else to configure. Committing the installed directory is what makes the skill available to everyone
      working on the project, rather than to whoever ran the command.
    </p>
  `,
})
export class SkillsInstallationSection {
  readonly installTabs: CodeTabData = TABS_0;
  readonly tree: CodeBlockData = BLOCK_1;
}
