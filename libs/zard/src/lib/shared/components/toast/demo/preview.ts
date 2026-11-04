import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';

import { ZardAlertComponent } from '@/shared/components/alert/alert.component';

@Component({
  selector: 'z-demo-toast-preview',
  imports: [ZardAlertComponent, RouterLink],
  template: `
    <z-alert
      class="w-full max-w-xl"
      zIcon="lucideTriangleAlert"
      zTitle="The toast component has been deprecated."
      [zDescription]="description"
    />

    <ng-template #description>
      Use the
      <a routerLink="/docs/components/sonner" class="text-foreground font-medium underline">sonner</a>
      component instead.
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTriangleAlert })],
})
export class ZardDemoToastPreviewComponent {}
