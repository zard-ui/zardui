import { Component } from '@angular/core';

import { JSON_INIT_COMMAND } from '@generated/documentation/json/init-command';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';
import type { CodeTabData } from '@highlight/types';
import { provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';

import { ZardAlertComponent } from '@zard/components/alert/alert.component';

@Component({
  selector: 'z-json-introduction-section',
  imports: [CodeTabsComponent, ZardAlertComponent],
  template: `
    <div class="flex flex-col gap-6 sm:gap-8">
      <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
        The
        <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">components.json</code>
        file holds configuration for your project.
      </p>
      <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
        We use it to understand how your project is set up and how to generate components customized for your project.
      </p>

      <z-alert
        zIcon="lucideInfo"
        zTitle="The components.json file is optional"
        zDescription="It is only required if you're using the CLI to add components to your project. If you're using the copy and paste method, you don't need this file."
      />

      <div class="flex flex-col gap-4">
        <p class="text-muted-foreground text-sm sm:text-base">
          You can create a
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">components.json</code>
          file in your project by running the following command:
        </p>
        <z-code-tabs [data]="initCommand" />
      </div>

      <p class="text-muted-foreground text-sm sm:text-base">See the CLI section for more information.</p>
    </div>
  `,
  viewProviders: [provideIcons({ lucideInfo })],
})
export class JsonIntroductionSectionComponent {
  readonly initCommand: CodeTabData = JSON_INIT_COMMAND;
}
