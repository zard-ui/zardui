import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGitBranch, lucideRotateCcw } from '@ng-icons/lucide';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

@Component({
  selector: 'z-demo-marker-link',
  imports: [NgIcon, ...ZardMarkerImports],
  template: `
    <div class="flex w-full max-w-sm min-w-sm flex-col gap-8">
      <a z-marker href="#links-and-buttons">
        <z-marker-icon><ng-icon name="lucideGitBranch" /></z-marker-icon>
        <z-marker-content>View the pull request</z-marker-content>
      </a>

      <button z-marker type="button" class="hover:text-foreground transition-colors" (click)="revert()">
        <z-marker-icon><ng-icon name="lucideRotateCcw" /></z-marker-icon>
        <z-marker-content>Revert this change</z-marker-content>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideGitBranch, lucideRotateCcw })],
})
export class ZardDemoMarkerLinkComponent {
  private readonly sonner = inject(ZardSonnerService);

  revert() {
    this.sonner.show('You clicked the revert button');
  }
}
