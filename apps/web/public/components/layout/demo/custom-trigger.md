```angular-ts showLineNumbers copyButton
import { Component, signal } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ContentComponent } from '../content.component';
import { HeaderComponent } from '../header.component';
import { LayoutComponent } from '../layout.component';
import { SidebarComponent } from '../sidebar.component';

@Component({
  selector: 'z-demo-layout-custom-trigger',
  standalone: true,
  imports: [LayoutComponent, HeaderComponent, ContentComponent, SidebarComponent, ZardButtonComponent],
  template: `
    <z-layout class="min-h-[500px] rounded-lg overflow-hidden border">
      <z-sidebar [zCollapsible]="true" [(zCollapsed)]="collapsed" [zTrigger]="customTrigger" class="bg-slate-100 dark:bg-slate-900">
        <div class="p-4">
          <h3 class="font-semibold mb-4">Custom Trigger</h3>
          <nav class="space-y-2">
            <div class="px-3 py-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">Home</div>
            <div class="px-3 py-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">About</div>
            <div class="px-3 py-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">Contact</div>
          </nav>
        </div>
      </z-sidebar>
      <z-layout>
        <z-header>
          <h1 class="text-xl font-bold">Custom Trigger Demo</h1>
        </z-header>
        <z-content>
          <div class="space-y-4">
            <h2 class="text-2xl font-semibold">Custom Trigger Button</h2>
            <p>This demo shows how to use a custom trigger template for the collapsible sidebar. Instead of the default chevron icon, we're using a custom button component.</p>
            <div class="p-4 bg-muted rounded-lg">
              <p class="font-medium">Pass a template reference via <code class="px-1.5 py-0.5 bg-background rounded">zTrigger</code> to customize the collapse trigger.</p>
            </div>
          </div>
        </z-content>
      </z-layout>
    </z-layout>

    <ng-template #customTrigger>
      <div class="p-2 border-t">
        <button z-button [zFull]="true" zType="ghost" zSize="sm" (click)="collapsed.set(!collapsed())">
          <i [class]="collapsed() ? 'icon-chevrons-right' : 'icon-chevrons-left'"></i>
          <span>{{ collapsed() ? 'Expand' : 'Collapse' }}</span>
        </button>
      </div>
    </ng-template>
  `,
})
export class LayoutDemoCustomTriggerComponent {
  collapsed = signal(false);
}

```