```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ContentComponent } from '../content.component';
import { HeaderComponent } from '../header.component';
import { LayoutComponent } from '../layout.component';
import { SidebarComponent } from '../sidebar.component';

@Component({
  selector: 'z-demo-layout-theme',
  standalone: true,
  imports: [LayoutComponent, HeaderComponent, ContentComponent, SidebarComponent],
  template: `
    <div class="flex gap-4">
      <!-- Light Theme -->
      <z-layout class="flex-1 min-h-[400px] rounded-lg overflow-hidden border">
        <z-sidebar zTheme="light" [zWidth]="180">
          <div class="p-4">
            <h3 class="font-semibold mb-3 text-sm">Light Theme</h3>
            <nav class="space-y-1 text-sm">
              <div class="px-2 py-1.5 rounded hover:bg-slate-100 cursor-pointer">Dashboard</div>
              <div class="px-2 py-1.5 rounded hover:bg-slate-100 cursor-pointer">Projects</div>
              <div class="px-2 py-1.5 rounded hover:bg-slate-100 cursor-pointer">Team</div>
              <div class="px-2 py-1.5 rounded hover:bg-slate-100 cursor-pointer">Settings</div>
            </nav>
          </div>
        </z-sidebar>
        <z-layout>
          <z-header>
            <h2 class="text-lg font-semibold">Light Sidebar</h2>
          </z-header>
          <z-content>
            <div class="space-y-3">
              <p class="text-sm">This sidebar uses the <code class="px-1.5 py-0.5 bg-muted rounded">light</code> theme.</p>
              <p class="text-sm">Perfect for applications with lighter color schemes.</p>
            </div>
          </z-content>
        </z-layout>
      </z-layout>

      <!-- Dark Theme -->
      <z-layout class="flex-1 min-h-[400px] rounded-lg overflow-hidden border">
        <z-sidebar zTheme="dark" [zWidth]="180">
          <div class="p-4">
            <h3 class="font-semibold mb-3 text-sm">Dark Theme</h3>
            <nav class="space-y-1 text-sm">
              <div class="px-2 py-1.5 rounded hover:bg-zinc-800 cursor-pointer">Dashboard</div>
              <div class="px-2 py-1.5 rounded hover:bg-zinc-800 cursor-pointer">Projects</div>
              <div class="px-2 py-1.5 rounded hover:bg-zinc-800 cursor-pointer">Team</div>
              <div class="px-2 py-1.5 rounded hover:bg-zinc-800 cursor-pointer">Settings</div>
            </nav>
          </div>
        </z-sidebar>
        <z-layout>
          <z-header>
            <h2 class="text-lg font-semibold">Dark Sidebar</h2>
          </z-header>
          <z-content>
            <div class="space-y-3">
              <p class="text-sm">This sidebar uses the <code class="px-1.5 py-0.5 bg-muted rounded">dark</code> theme.</p>
              <p class="text-sm">Ideal for dark mode interfaces and modern applications.</p>
            </div>
          </z-content>
        </z-layout>
      </z-layout>
    </div>
  `,
})
export class LayoutDemoThemeComponent {}

```
