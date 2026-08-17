import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';

@Component({
  selector: 'z-demo-collapsible-default',
  imports: [ZardCollapsibleImports, ZardButtonComponent, NgIcon],
  viewProviders: [provideIcons({ lucideChevronsUpDown })],
  template: `
    <z-collapsible class="flex w-[350px] flex-col gap-2">
      <div class="flex items-center justify-between gap-4 px-4">
        <h4 class="text-sm font-semibold">&#64;peduarte starred 3 repositories</h4>

        <button z-button z-collapsible-trigger zType="ghost" zSize="icon-sm">
          <ng-icon name="lucideChevronsUpDown" />
          <span class="sr-only">Toggle</span>
        </button>
      </div>

      <z-collapsible-content>
        <div class="flex flex-col gap-2">
          <div class="rounded-md border px-4 py-2 font-mono text-sm">&#64;radix-ui/primitives</div>
          <div class="rounded-md border px-4 py-2 font-mono text-sm">&#64;radix-ui/colors</div>
          <div class="rounded-md border px-4 py-2 font-mono text-sm">&#64;stitches/react</div>
        </div>
      </z-collapsible-content>
    </z-collapsible>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCollapsibleDefaultComponent {}
