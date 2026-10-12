import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLock } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardCardImports } from '@zard/components/card';

@Component({
  selector: 'z-preview-01-front-door',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardBadgeComponent, NgIcon],
  viewProviders: [provideIcons({ lucideLock })],
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Front Door" />
        <z-card-description zDescription="Smart Lock Pro" />
        <z-card-action>
          <div class="text-muted-foreground flex items-center gap-1.5 text-sm">
            Locked
            <ng-icon name="lucideLock" class="size-4" />
          </div>
        </z-card-action>
      </z-card-header>
      <z-card-content>
        <div
          class="bg-muted relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,var(--border)_10px,var(--border)_11px)]"
        >
          <z-badge zType="destructive" class="absolute top-2 right-2">Live</z-badge>
        </div>
      </z-card-content>
    </z-card>
  `,
})
export class Preview01FrontDoorComponent {}
