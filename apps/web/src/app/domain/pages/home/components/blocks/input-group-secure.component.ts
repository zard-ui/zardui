import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo, lucideStar } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardPopoverComponent, ZardPopoverDirective } from '@zard/components/popover/popover.component';
import { ZardIdDirective } from '@zard/core';

@Component({
  selector: 'z-block-input-group-secure',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardButtonComponent,
    ZardInputComponent,
    ...ZardInputGroupImports,
    NgIcon,
    ZardPopoverComponent,
    ZardPopoverDirective,
    ZardIdDirective,
  ],
  viewProviders: [provideIcons({ lucideInfo, lucideStar })],
  template: `
    <div class="grid w-full max-w-sm gap-6" zardId="input-secure" #z="zardId">
      <label [attr.for]="z.id()" class="sr-only">Input Secure</label>
      <z-input-group class="[--radius:9999px]">
        <z-input-group-addon>
          <button
            z-button
            type="button"
            zType="secondary"
            zSize="icon-sm"
            zShape="circle"
            class="size-6!"
            aria-label="Info"
            zPopover
            [zContent]="popoverContent"
          >
            <ng-icon name="lucideInfo" size="0.8rem" />
          </button>
          <span z-input-group-text>https://</span>
        </z-input-group-addon>
        <input z-input [id]="z.id()" />
        <z-input-group-addon zAlign="inline-end">
          <button
            z-button
            type="button"
            zType="ghost"
            zSize="icon-sm"
            zShape="circle"
            class="size-6!"
            [attr.aria-label]="isFavorite() ? 'Remove favorite' : 'Add favorite'"
            [attr.aria-pressed]="isFavorite()"
            (click)="toggleFavorite()"
          >
            <ng-icon name="lucideStar" size="1rem" [class]="isFavorite() ? 'text-primary [&_path]:fill-primary' : ''" />
          </button>
        </z-input-group-addon>
      </z-input-group>

      <ng-template #popoverContent>
        <z-popover class="flex flex-col gap-1 rounded-xl text-sm">
          <p class="font-medium">Your connection is not secure.</p>
          <p>You should not enter any sensitive information on this site.</p>
        </z-popover>
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
