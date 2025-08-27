```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardDividerComponent } from '../../divider/divider.component';
import { ZardMenuModule } from '../menu.module';

@Component({
  selector: 'zard-demo-menu-context',
  standalone: true,
  imports: [ZardMenuModule, ZardButtonComponent, ZardDividerComponent],
  template: `
    <div class="space-y-4">
      <div class="rounded-lg border p-4">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h3 class="text-sm font-medium">Project Dashboard</h3>
            <p class="text-sm text-muted-foreground">Last updated 2 hours ago</p>
          </div>
          
          <button z-button zType="ghost" zSize="icon" zMenuTrigger [menuTriggerFor]="itemActions">
            <i class="icon-more-horizontal h-4 w-4"></i>
          </button>
        </div>
      </div>
      
      <div class="text-sm text-muted-foreground">
        Click the three dots to see context actions
      </div>
    </div>

    <ng-template #itemActions cdkMenuPanel>
      <div z-menu-content class="w-48">
        <button z-menu-item (click)="log('Edit')">
          <i class="icon-edit mr-2 h-4 w-4"></i>
          Edit
        </button>
        <button z-menu-item (click)="log('Duplicate')">
          <i class="icon-copy mr-2 h-4 w-4"></i>
          Duplicate
        </button>
        <button z-menu-item (click)="log('Share')">
          <i class="icon-share mr-2 h-4 w-4"></i>
          Share
        </button>
        
        <z-divider zSpacing="sm"></z-divider>
        
        <button z-menu-item (click)="log('Archive')">
          <i class="icon-archive mr-2 h-4 w-4"></i>
          Archive
        </button>
        <button z-menu-item (click)="log('Delete')" class="text-destructive">
          <i class="icon-trash-2 mr-2 h-4 w-4"></i>
          Delete
        </button>
      </div>
    </ng-template>
  `,
})
export class ZardDemoMenuContextComponent {
  log(action: string) {
    console.log('Action:', action);
  }
}
```