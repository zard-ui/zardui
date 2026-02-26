import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDividerComponent } from '@zard/components/divider';
import { ZardDropdownImports } from '@zard/components/dropdown';
import { ZardIconComponent } from '@zard/components/icon/icon.component';
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
    ZardIconComponent,
    ZardDividerComponent,
    ...ZardDropdownImports,
    ZardTooltipDirective,
  ],
  template: `
    <div class="grid w-full max-w-sm gap-6">
      <!-- Search with results -->
      <z-input-group [zAddonBefore]="searchIcon" zAddonAfter="12 results">
        <input z-input placeholder="Search..." />
      </z-input-group>

      <!-- URL with info tooltip -->
      <z-input-group zAddonBefore="https://" [zAddonAfter]="infoButton">
        <input z-input placeholder="example.com" class="pl-1!" />
      </z-input-group>

      <!-- Textarea with actions -->
      <z-input-group [zAddonAfter]="textareaActions" zAddonAlign="block">
        <textarea z-input placeholder="Ask, Search or Chat..." class="min-h-0 resize-none"></textarea>
      </z-input-group>

      <!-- Username with check -->
      <z-input-group [zAddonAfter]="checkIcon">
        <input z-input placeholder="@zard_ui" />
      </z-input-group>
    </div>

    <ng-template #searchIcon>
      <z-icon zType="search" />
    </ng-template>

    <ng-template #infoButton>
      <button
        z-button
        zType="ghost"
        zSize="sm"
        zShape="circle"
        zTooltip="This is content in a tooltip."
        class="size-6!"
        aria-label="Info"
      >
        <z-icon zType="info" />
      </button>
    </ng-template>

    <ng-template #textareaActions>
      <div class="flex w-full items-center">
        <button z-button zType="outline" zShape="circle" class="size-6!" aria-label="Add">
          <z-icon zType="plus" />
        </button>
        <button z-button zType="ghost" zSize="sm" z-dropdown [zDropdownMenu]="menu">Auto</button>
        <z-dropdown-menu-content #menu="zDropdownMenuContent" class="[--radius:0.95rem]">
          <z-dropdown-menu-item>Auto</z-dropdown-menu-item>
          <z-dropdown-menu-item>Agent</z-dropdown-menu-item>
          <z-dropdown-menu-item>Manual</z-dropdown-menu-item>
        </z-dropdown-menu-content>
        <span class="text-muted-foreground ml-auto text-sm">52% used</span>
        <z-divider zOrientation="vertical" class="mx-2 h-4!" />
        <button z-button zType="default" zShape="circle" class="size-6!" aria-label="Send">
          <z-icon zType="arrow-up" />
          <span class="sr-only">Send</span>
        </button>
      </div>
    </ng-template>

    <ng-template #checkIcon>
      <div class="bg-primary flex size-4 items-center justify-center rounded-full">
        <z-icon zType="check" class="text-primary-foreground size-3" />
      </div>
    </ng-template>
  `,
})
export class BlockInputGroupStackComponent {}
