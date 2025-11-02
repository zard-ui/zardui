```angular-ts showLineNumbers copyButton
import { Component, signal } from '@angular/core';

import { ContentComponent } from '../content.component';
import { HeaderComponent } from '../header.component';
import { LayoutComponent } from '../layout.component';
import { SidebarComponent } from '../sidebar.component';

@Component({
  selector: 'z-demo-layout-responsive',
  standalone: true,
  imports: [LayoutComponent, HeaderComponent, ContentComponent, SidebarComponent],
  template: `
    <z-layout class="min-h-[500px] rounded-lg overflow-hidden border">
      <z-sidebar
        [zCollapsible]="true"
        [(zCollapsed)]="collapsed"
        zBreakpoint="md"
        class="bg-slate-100 dark:bg-slate-900">
        <div class="p-4">
          <h3 class="font-semibold mb-4">Responsive Nav</h3>
          <nav class="space-y-2">
            <div class="px-3 py-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">Dashboard</div>
            <div class="px-3 py-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">Analytics</div>
            <div class="px-3 py-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">Reports</div>
            <div class="px-3 py-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">Settings</div>
          </nav>
        </div>
      </z-sidebar>
      <z-layout>
        <z-header>
          <h1 class="text-xl font-bold">Responsive Breakpoint Demo</h1>
        </z-header>
        <z-content>
          <div class="space-y-4">
            <h2 class="text-2xl font-semibold">Responsive Sidebar</h2>
            <p>Resize your browser window to see the sidebar automatically collapse at the <strong>md</strong> breakpoint (768px).</p>
            <div class="p-4 bg-muted rounded-lg space-y-2">
              <p class="font-medium">Breakpoint: md (768px)</p>
              <p class="text-sm">Current State: <strong>{{ collapsed() ? 'Collapsed' : 'Expanded' }}</strong></p>
              <p class="text-sm text-muted-foreground">
                The sidebar will automatically collapse when the viewport width is less than 768px and expand when it's
                greater.
              </p>
            </div>
            <div class="border rounded-lg p-4 space-y-2">
              <p class="font-semibold text-sm">Available Breakpoints:</p>
              <ul class="text-sm space-y-1 ml-4 list-disc">
                <li><code class="px-1.5 py-0.5 bg-muted rounded">xs</code> - 480px</li>
                <li><code class="px-1.5 py-0.5 bg-muted rounded">sm</code> - 576px</li>
                <li><code class="px-1.5 py-0.5 bg-muted rounded">md</code> - 768px</li>
                <li><code class="px-1.5 py-0.5 bg-muted rounded">lg</code> - 992px</li>
                <li><code class="px-1.5 py-0.5 bg-muted rounded">xl</code> - 1200px</li>
                <li><code class="px-1.5 py-0.5 bg-muted rounded">xxl</code> - 1600px</li>
              </ul>
            </div>
          </div>
        </z-content>
      </z-layout>
    </z-layout>
  `,
})
export class LayoutDemoResponsiveComponent {
  collapsed = signal(false);
}

```
