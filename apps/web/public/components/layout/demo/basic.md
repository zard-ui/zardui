```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LayoutImports } from '@/shared/components/layout/layout.imports';

@Component({
  selector: 'z-demo-layout-basic',
  imports: [LayoutImports],
  template: `
    <div class="flex flex-col gap-6 text-center">
      <z-layout class="overflow-hidden rounded-lg">
        <z-header class="h-16 justify-center border-0 bg-[#4096ff] px-12 text-white">Header</z-header>
        <z-content class="min-h-50 bg-[#0958d9] text-white">Content</z-content>
        <z-footer class="h-16 justify-center border-0 bg-[#4096ff] px-12 text-white">Footer</z-footer>
      </z-layout>

      <z-layout class="overflow-hidden rounded-lg">
        <z-header class="h-16 justify-center border-0 bg-[#4096ff] px-12 text-white">Header</z-header>
        <z-layout>
          <z-sidebar class="border-0 bg-[#1677ff] text-white" [zWidth]="120">Sidebar</z-sidebar>
          <z-content class="min-h-50 bg-[#0958d9] text-white">Content</z-content>
        </z-layout>
        <z-footer class="h-16 justify-center border-0 bg-[#4096ff] px-12 text-white">Footer</z-footer>
      </z-layout>

      <z-layout class="overflow-hidden rounded-lg">
        <z-header class="h-16 justify-center border-0 bg-[#4096ff] px-12 text-white">Header</z-header>
        <z-layout>
          <z-content class="min-h-50 bg-[#0958d9] text-white">Content</z-content>
          <z-sidebar class="border-0 bg-[#1677ff] text-white" [zWidth]="120">Sidebar</z-sidebar>
        </z-layout>
        <z-footer class="h-16 justify-center border-0 bg-[#4096ff] px-12 text-white">Footer</z-footer>
      </z-layout>

      <z-layout class="overflow-hidden rounded-lg">
        <z-sidebar class="border-0 bg-[#1677ff] text-white" [zWidth]="120">Sidebar</z-sidebar>
        <z-layout>
          <z-header class="h-16 justify-center border-0 bg-[#4096ff] px-12 text-white">Header</z-header>
          <z-content class="min-h-50 bg-[#0958d9] text-white">Content</z-content>
          <z-footer class="h-16 justify-center border-0 bg-[#4096ff] px-12 text-white">Footer</z-footer>
        </z-layout>
      </z-layout>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutDemoBasicComponent {}

```