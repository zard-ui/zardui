// In your module or component
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZardContextMenuTriggerDirective } from '@zard/components/menu/context-menu/context-menu.directive';
import { ZardMenuContentDirective } from '@zard/components/menu/menu-content.directive';
import { ZardMenuItemDirective } from '@zard/components/menu/menu-item.directive';

@Component({
  imports: [ZardContextMenuTriggerDirective, RouterModule, ZardMenuContentDirective, ZardMenuItemDirective],
  selector: 'app-root',
  template: `
    <div [zContextMenuTriggerFor]="contextMenu" class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">Right click here</div>

    <ng-template #contextMenu>
      <div z-menu-content class="w-48">
        <button z-menu-item>Analytics</button>
        <button z-menu-item>Dashboard</button>
        <button z-menu-item>Reports</button>
        <button z-menu-item zDisabled>Insights</button>
      </div>
    </ng-template>
  `,
  styleUrls: ['./app.component.css'],
  standalone: true,
})
export class AppComponent {
  title = 'demo-app';
}


