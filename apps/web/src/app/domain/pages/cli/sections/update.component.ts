import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ZardAlertComponent } from '@zard/components/alert/alert.component';

@Component({
  selector: 'cli-update-section',
  standalone: true,
  imports: [ZardAlertComponent, RouterLink],
  template: `
    <section class="flex flex-col gap-6">
      <div class="flex flex-col gap-3">
        <h2 class="text-2xl font-bold tracking-tight">Update</h2>
        <p class="text-muted-foreground">Update components in your project while preserving your customizations.</p>
      </div>

      <z-alert
        zIcon="circle-alert"
        zTitle="Coming Soon"
        zDescription="The ZardUI team is actively working on an intelligent update system that will automatically update your components without compromising the custom rules and modifications you've implemented. This is an extremely complex solution that requires careful design to ensure your customizations remain intact. We appreciate your patience as we develop this feature to provide the best possible experience."
        zType="default"
      />

      <div class="bg-card rounded-lg border p-6 shadow-sm">
        <h3 class="mb-4 text-lg font-semibold">Planned Features</h3>
        <ul class="space-y-3">
          <li class="flex items-start gap-3">
            <span class="text-primary mt-0.5">🔄</span>
            <div>
              <span class="font-medium">Smart detection of component changes</span>
              <p class="text-muted-foreground text-sm">Automatically identify which components have updates available</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary mt-0.5">🛡️</span>
            <div>
              <span class="font-medium">Preservation of user customizations</span>
              <p class="text-muted-foreground text-sm">Keep your custom modifications safe during updates</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary mt-0.5">📊</span>
            <div>
              <span class="font-medium">Conflict resolution with clear options</span>
              <p class="text-muted-foreground text-sm">Visual diff and merge tools to handle conflicts intelligently</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary mt-0.5">🎯</span>
            <div>
              <span class="font-medium">Selective component updates</span>
              <p class="text-muted-foreground text-sm">Choose which components to update and which to skip</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary mt-0.5">📝</span>
            <div>
              <span class="font-medium">Detailed changelog for each update</span>
              <p class="text-muted-foreground text-sm">See exactly what changed in each component version</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="bg-muted/50 rounded-lg border p-6">
        <h3 class="mb-3 text-lg font-semibold">What to Expect</h3>
        <p class="text-muted-foreground mb-4 text-sm leading-relaxed">
          When the update command becomes available, it will intelligently analyze your components, detect differences from the latest versions, and offer safe update options that
          respect your modifications. The system will provide clear visual diffs and allow you to review changes before applying them.
        </p>
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-sm font-medium">Stay updated:</span>
          <a routerLink="/docs/changelog" class="text-primary text-sm hover:underline">Changelog</a>
          <span class="text-muted-foreground">•</span>
          <a href="https://github.com/zard-ui/zardui" target="_blank" rel="noopener noreferrer" class="text-primary text-sm hover:underline"> GitHub Repository </a>
        </div>
      </div>
    </section>
  `,
})
export class CliUpdateSection {}
