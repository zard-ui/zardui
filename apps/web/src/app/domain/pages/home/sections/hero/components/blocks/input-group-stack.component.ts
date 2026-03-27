import { Component, ChangeDetectionStrategy } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideCheck, lucideInfo, lucidePlus, lucideSearch } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDividerComponent } from '@zard/components/divider';
import { ZardDropdownImports } from '@zard/components/dropdown';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardInputGroupComponent } from '@zard/components/input-group/input-group.component';
import { ZardTooltipDirective } from '@zard/components/tooltip';

@Component({
  selector: 'z-block-input-group-stack',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardButtonComponent,
    ZardInputGroupComponent,
    ZardInputDirective,
    NgIcon,
    ZardDividerComponent,
    ...ZardDropdownImports,
    ZardTooltipDirective,
  ],
  viewProviders: [provideIcons({ lucideSearch, lucideInfo, lucidePlus, lucideArrowUp, lucideCheck })],
  template: `
    <div class="grid w-full max-w-sm gap-6">
      <!-- Search with results -->
      <z-input-group [zAddonBefore]="searchIcon" zAddonAfter="12 results">
        <input z-input aria-label="Search" placeholder="Search..." />
      </z-input-group>

      <!-- URL with info tooltip -->
      <z-input-group zAddonBefore="https://" [zAddonAfter]="infoButton">
        <input z-input aria-label="Website URL" placeholder="example.com" class="pl-1!" />
      </z-input-group>

      <!-- Textarea with actions -->
      <z-input-group [zAddonAfter]="textareaActions" zAddonAlign="block">
        <textarea
          z-input
          aria-label="Prompt"
          placeholder="Ask, Search or Chat..."
          class="min-h-0 resize-none"
        ></textarea>
      </z-input-group>

      <!-- Username with check -->
      <z-input-group [zAddonAfter]="checkIcon">
        <input z-input aria-label="Username" placeholder="@zard_ui" />
      </z-input-group>
    </div>

    <ng-template #searchIcon>
      <ng-icon name="lucideSearch" />
    </ng-template>

    <ng-template #infoButton>
      <button
        type="button"
        z-button
        zType="ghost"
        zSize="sm"
        zShape="circle"
        zTooltip="This is content in a tooltip."
        class="size-6!"
        aria-label="Info"
      >
        <ng-icon name="lucideInfo" />
      </button>
    </ng-template>

    <ng-template #textareaActions>
      <div class="flex w-full items-center">
        <button type="button" z-button zType="outline" zShape="circle" class="size-6!" aria-label="Add">
          <ng-icon name="lucidePlus" />
        </button>
        <button type="button" z-button zType="ghost" zSize="sm" z-dropdown [zDropdownMenu]="menu">Auto</button>
        <z-dropdown-menu-content #menu="zDropdownMenuContent" class="[--radius:0.95rem]">
          <z-dropdown-menu-item>Auto</z-dropdown-menu-item>
          <z-dropdown-menu-item>Agent</z-dropdown-menu-item>
          <z-dropdown-menu-item>Manual</z-dropdown-menu-item>
        </z-dropdown-menu-content>
        <span class="text-muted-foreground ml-auto text-sm">52% used</span>
        <z-divider zOrientation="vertical" class="mx-2 h-4!" />
        <button type="button" z-button zType="default" zShape="circle" class="size-6!" aria-label="Send">
          <ng-icon name="lucideArrowUp" />
        </button>
      </div>
    </ng-template>

    <ng-template #checkIcon>
      <div class="bg-primary flex size-4 items-center justify-center rounded-full" role="img" aria-label="Verified">
        <ng-icon name="lucideCheck" class="text-primary-foreground size-3" />
      </div>
    </ng-template>
  `,
})
export class BlockInputGroupStackComponent {}
