import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGitBranch } from '@ng-icons/lucide';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-with-icon',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <button z-button zType="outline" zSize="sm">
      <ng-icon name="lucideGitBranch" />
      New Branch
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideGitBranch })],
})
export class ZardDemoButtonWithIconComponent {}
