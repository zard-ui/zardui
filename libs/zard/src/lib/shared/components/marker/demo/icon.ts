import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBookOpenCheck, lucideGitBranch, lucideSearch } from '@ng-icons/lucide';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';

@Component({
  selector: 'z-demo-marker-icon',
  imports: [NgIcon, ...ZardMarkerImports],
  template: `
    <div class="flex w-full max-w-sm min-w-sm flex-col gap-12">
      <z-marker>
        <z-marker-icon><ng-icon name="lucideGitBranch" /></z-marker-icon>
        <z-marker-content>Switched to a new branch</z-marker-content>
      </z-marker>

      <z-marker zVariant="separator">
        <z-marker-icon><ng-icon name="lucideSearch" /></z-marker-icon>
        <z-marker-content>Explored 4 files</z-marker-content>
      </z-marker>

      <z-marker class="flex-col">
        <z-marker-icon><ng-icon name="lucideBookOpenCheck" /></z-marker-icon>
        <z-marker-content>Syncing completed</z-marker-content>
      </z-marker>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBookOpenCheck, lucideGitBranch, lucideSearch })],
})
export class ZardDemoMarkerIconComponent {}
