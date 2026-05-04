import { Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCopy, lucideInfo, lucideStar } from '@ng-icons/lucide';

import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardPopoverComponent, ZardPopoverDirective } from '@/shared/components/popover/popover.component';

@Component({
  selector: 'z-demo-input-group-button',
  imports: [ZardInputComponent, ZardPopoverComponent, ZardPopoverDirective, NgIcon, ...ZardInputGroupImports],
  template: `
    <div class="grid w-full min-w-sm gap-6">
      <z-input-group>
        <input z-input placeholder="https://x.com/shadcn" readonly />
        <z-input-group-addon zAlign="inline-end">
          <button
            type="button"
            z-input-group-button
            zSize="icon-xs"
            aria-label="Copy"
            title="Copy"
            (click)="copy('https://x.com/shadcn')"
          >
            <ng-icon [name]="isCopied() ? 'lucideCheck' : 'lucideCopy'" />
          </button>
        </z-input-group-addon>
      </z-input-group>

      <z-input-group class="[--radius:9999px]">
        <z-input-group-addon>
          <button
            type="button"
            z-input-group-button
            zVariant="secondary"
            zSize="icon-xs"
            zPopover
            [zContent]="popoverContent"
          >
            <ng-icon name="lucideInfo" />
          </button>
        </z-input-group-addon>
        <z-input-group-addon class="text-muted-foreground pl-1.5">https://</z-input-group-addon>
        <input z-input id="input-secure-19" />
        <z-input-group-addon zAlign="inline-end">
          <button type="button" z-input-group-button zSize="icon-xs" (click)="toggleFavorite()">
            <ng-icon
              name="lucideStar"
              [attr.data-favorite]="isFavorite()"
              class="[&_path]:transition-colors data-[favorite=true]:[&_path]:fill-blue-600 data-[favorite=true]:[&_path]:stroke-blue-600"
            />
          </button>
        </z-input-group-addon>
      </z-input-group>

      <z-input-group>
        <input z-input placeholder="Type to search..." />
        <z-input-group-addon zAlign="inline-end">
          <button type="button" z-input-group-button zVariant="secondary">Search</button>
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
  viewProviders: [provideIcons({ lucideCopy, lucideCheck, lucideInfo, lucideStar })],
})
export class ZardDemoInputGroupButtonComponent {
  protected readonly isCopied = signal(false);
  protected readonly isFavorite = signal(false);

  protected copy(text: string): void {
    navigator.clipboard?.writeText(text);
    this.isCopied.set(true);
    setTimeout(() => this.isCopied.set(false), 2000);
  }

  protected toggleFavorite(): void {
    this.isFavorite.update(v => !v);
  }
}
