import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';

@Component({
  selector: 'z-demo-collapsible-preview',
  imports: [ZardCollapsibleImports, ZardButtonComponent, NgIcon],
  template: `
    <z-collapsible class="flex w-[350px] flex-col gap-2">
      <div class="flex items-center justify-between gap-4 px-4">
        <h4 class="text-sm font-semibold">Order #4189</h4>

        <button z-button z-collapsible-trigger zType="ghost" zSize="icon-sm">
          <ng-icon name="lucideChevronsUpDown" />
          <span class="sr-only">Toggle details</span>
        </button>
      </div>

      <div class="rounded-md border px-4 py-2 text-sm">
        <div class="flex items-center justify-between">
          <span class="text-muted-foreground">Status</span>
          <span class="font-medium">Shipped</span>
        </div>
      </div>

      <z-collapsible-content>
        <div class="flex flex-col gap-2">
          <div class="rounded-md border px-4 py-2 text-sm">
            <div class="text-muted-foreground">Shipping address</div>
            <div class="font-medium">100 Market St, San Francisco</div>
          </div>
          <div class="rounded-md border px-4 py-2 text-sm">
            <div class="text-muted-foreground">Items</div>
            <div class="font-medium">2x Studio Headphones</div>
          </div>
        </div>
      </z-collapsible-content>
    </z-collapsible>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronsUpDown })],
})
export class ZardDemoCollapsiblePreviewComponent {}
