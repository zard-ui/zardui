import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGitBranch, lucideSearch } from '@ng-icons/lucide';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';
import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-marker-default',
  imports: [NgIcon, ZardSpinnerComponent, ...ZardMarkerImports],
  template: `
    <div class="flex w-full max-w-sm min-w-sm flex-col gap-8">
      <z-marker>
        <z-marker-icon><ng-icon name="lucideGitBranch" /></z-marker-icon>
        <z-marker-content>Switched to a new branch</z-marker-content>
      </z-marker>

      <z-marker role="status">
        <z-marker-icon><z-spinner /></z-marker-icon>
        <z-marker-content class="shimmer">Thinking...</z-marker-content>
      </z-marker>

      <z-marker zVariant="separator">
        <z-marker-content>Conversation compacted</z-marker-content>
      </z-marker>

      <z-marker>
        <z-marker-icon><ng-icon name="lucideSearch" /></z-marker-icon>
        <z-marker-content>Explored 4 files</z-marker-content>
      </z-marker>
    </div>
  `,
  viewProviders: [provideIcons({ lucideGitBranch, lucideSearch })],
})
export class ZardDemoMarkerDefaultComponent {}
