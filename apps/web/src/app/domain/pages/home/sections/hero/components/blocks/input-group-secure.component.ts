import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardInputGroupComponent } from '@zard/components/input-group/input-group.component';
import { ZardPopoverComponent, ZardPopoverDirective } from '@zard/components/popover/popover.component';

@Component({
  selector: 'z-block-input-group-secure',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardButtonComponent,
    ZardInputGroupComponent,
    ZardInputDirective,
    ZardIconComponent,
    ZardPopoverComponent,
    ZardPopoverDirective,
  ],
  template: `
    <div class="grid w-full max-w-sm gap-6">
      <label for="input-secure-19" class="sr-only">Input Secure</label>
      <z-input-group [zAddonBefore]="addonBefore" [zAddonAfter]="addonAfter" class="[--radius:9999px]">
        <input z-input id="input-secure-19" class="rounded-none pl-0.5!" />
      </z-input-group>

      <ng-template #addonBefore>
        <button
          z-button
          zType="secondary"
          zSize="sm"
          zShape="circle"
          class="size-6!"
          aria-label="Info"
          zPopover
          [zContent]="popoverContent"
        >
          <z-icon zType="info" />
        </button>
        <span class="text-muted-foreground pl-1!">https://</span>
      </ng-template>

      <ng-template #popoverContent>
        <z-popover class="flex flex-col gap-1 rounded-xl text-sm">
          <p class="font-medium">Your connection is not secure.</p>
          <p>You should not enter any sensitive information on this site.</p>
        </z-popover>
      </ng-template>

      <ng-template #addonAfter>
        <button
          z-button
          zType="ghost"
          zSize="sm"
          zShape="circle"
          class="size-6!"
          aria-label="Favorite"
          (click)="toggleFavorite()"
        >
          <z-icon zType="star" [class]="isFavorite() ? 'fill-primary stroke-primary' : ''" />
        </button>
      </ng-template>
    </div>
  `,
})
export class BlockInputGroupSecureComponent {
  readonly isFavorite = signal(false);

  toggleFavorite(): void {
    this.isFavorite.update(v => !v);
  }
}
