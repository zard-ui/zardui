import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileText, lucideGitBranch, lucideSearch } from '@ng-icons/lucide';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';

@Component({
  selector: 'z-demo-marker-border',
  imports: [NgIcon, ...ZardMarkerImports],
  template: `
    <div class="flex w-full max-w-sm min-w-sm flex-col gap-3">
      <z-marker zVariant="border">
        <z-marker-icon><ng-icon name="lucideGitBranch" /></z-marker-icon>
        <z-marker-content>Switched to release-candidate</z-marker-content>
      </z-marker>

      <z-marker zVariant="border">
        <z-marker-icon><ng-icon name="lucideSearch" /></z-marker-icon>
        <z-marker-content>Reviewed 8 related files</z-marker-content>
      </z-marker>

      <z-marker zVariant="border">
        <z-marker-icon><ng-icon name="lucideFileText" /></z-marker-icon>
        <z-marker-content>Opened implementation notes</z-marker-content>
      </z-marker>
    </div>
  `,
  viewProviders: [provideIcons({ lucideFileText, lucideGitBranch, lucideSearch })],
})
export class ZardDemoMarkerBorderComponent {}
