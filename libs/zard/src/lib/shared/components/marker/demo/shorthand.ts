import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideGitBranch, lucideSearch } from '@ng-icons/lucide';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';
import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-marker-shorthand',
  imports: [ZardSpinnerComponent, ...ZardMarkerImports],
  template: `
    <div class="flex w-full max-w-sm min-w-sm flex-col gap-8">
      <z-marker>Short rows do not need the content wrapper.</z-marker>

      <z-marker zIcon="lucideSearch">Explored 4 files</z-marker>

      <z-marker zVariant="border" zIcon="lucideGitBranch">Switched to release-candidate</z-marker>

      <z-marker zVariant="separator">Today</z-marker>

      <z-marker role="status">
        <z-marker-icon><z-spinner /></z-marker-icon>
        <z-marker-content class="shimmer">Project the slots when you need to style them.</z-marker-content>
      </z-marker>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideGitBranch, lucideSearch })],
})
export class ZardDemoMarkerShorthandComponent {}
