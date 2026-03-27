import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo, lucideStar } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardInputGroupComponent } from '@zard/components/input-group/input-group.component';
import { ZardPopoverComponent, ZardPopoverDirective } from '@zard/components/popover/popover.component';
import { ZardIdDirective } from '@zard/core';

@Component({
  selector: 'z-block-input-group-secure',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardButtonComponent,
    ZardInputGroupComponent,
    ZardInputDirective,
    NgIcon,
    ZardPopoverComponent,
    ZardPopoverDirective,
    ZardIdDirective,
  ],
  viewProviders: [provideIcons({ lucideInfo, lucideStar })],
  template: `
    <div class="grid w-full max-w-sm gap-6" zardId="input-secure" #z="zardId">
      <label [attr.for]="z.id()" class="sr-only">Input Secure</label>
      <z-input-group [zAddonBefore]="addonBefore" [zAddonAfter]="addonAfter" class="[--radius:9999px]">
        <input z-input [id]="z.id()" class="rounded-none pl-0.5!" />
      </z-input-group>

      <ng-template #addonBefore>
        <button
          z-button
          type="button"
          zType="secondary"
          zSize="icon-sm"
          zShape="circle"
          aria-label="Info"
          zPopover
          [zContent]="popoverContent"
        >
          <ng-icon name="lucideInfo" />
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
          type="button"
          zType="ghost"
          zSize="icon-sm"
          zShape="circle"
          [attr.aria-label]="isFavorite() ? 'Remove favorite' : 'Add favorite'"
          [attr.aria-pressed]="isFavorite()"
          (click)="toggleFavorite()"
        >
          <ng-icon name="lucideStar" [class]="isFavorite() ? 'fill-primary stroke-primary' : ''" />
        </button>
      </ng-template>
    </div>
  `,
})
export class BlockInputGroupSecureComponent {
  protected readonly isFavorite = signal(false);

  protected toggleFavorite(): void {
    this.isFavorite.update(v => !v);
  }
}
