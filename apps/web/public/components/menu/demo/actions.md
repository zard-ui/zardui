```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardDividerComponent } from '../../divider/divider.component';
import { ZardMenuModule } from '../menu.module';

@Component({
  selector: 'zard-demo-menu-actions',
  standalone: true,
  imports: [ZardMenuModule, ZardButtonComponent, ZardDividerComponent],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium">Team Members</h3>
          <p class="text-sm text-muted-foreground">Manage your team members</p>
        </div>

        <button z-button zMenuTrigger [menuTriggerFor]="bulkActions">
          <i class="icon-settings mr-2 h-4 w-4"></i>
          Actions
        </button>
      </div>

      <div class="rounded-lg border">
        <div class="p-4 border-b flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span class="text-sm font-medium text-blue-600">JD</span>
            </div>
            <div>
              <p class="text-sm font-medium">John Doe</p>
              <p class="text-xs text-muted-foreground">john&#64;example.com</p>
            </div>
          </div>

          <button z-button zType="ghost" zSize="icon" zMenuTrigger [menuTriggerFor]="userActions">
            <i class="icon-more-horizontal h-4 w-4"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Bulk Actions Menu -->
    <ng-template #bulkActions cdkMenuPanel>
      <div z-menu-content class="w-52">
        <button z-menu-item (click)="log('Invite members')">
          <i class="icon-user-plus mr-2 h-4 w-4"></i>
          Invite members
        </button>
        <button z-menu-item (click)="log('Export list')">
          <i class="icon-download mr-2 h-4 w-4"></i>
          Export list
        </button>

        <z-divider zSpacing="sm"></z-divider>

        <button z-menu-item (click)="log('Manage permissions')">
          <i class="icon-shield mr-2 h-4 w-4"></i>
          Manage permissions
        </button>
        <button z-menu-item (click)="log('Team settings')">
          <i class="icon-settings mr-2 h-4 w-4"></i>
          Team settings
        </button>
      </div>
    </ng-template>

    <!-- Individual User Actions -->
    <ng-template #userActions cdkMenuPanel>
      <div z-menu-content class="w-44">
        <button z-menu-item (click)="log('View profile')">
          <i class="icon-user mr-2 h-4 w-4"></i>
          View profile
        </button>
        <button z-menu-item (click)="log('Send message')">
          <i class="icon-message-circle mr-2 h-4 w-4"></i>
          Send message
        </button>

        <z-divider zSpacing="sm"></z-divider>

        <button z-menu-item (click)="log('Change role')">
          <i class="icon-user-cog mr-2 h-4 w-4"></i>
          Change role
        </button>
        <button z-menu-item (click)="log('Remove user')" class="text-destructive">
          <i class="icon-user-x mr-2 h-4 w-4"></i>
          Remove user
        </button>
      </div>
    </ng-template>
  `,
})
export class ZardDemoMenuActionsComponent {
  log(action: string) {
    console.log('Action:', action);
  }
}

```