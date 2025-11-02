```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardMenuModule } from '../menu.module';

@Component({
  selector: 'zard-demo-menu-navigation',
  standalone: true,
  imports: [ZardMenuModule, ZardButtonComponent],
  template: `
    <div class="flex items-center space-x-1">
      <!-- Simple Menu -->
      <button z-button zType="ghost" zMenuTrigger [menuTriggerFor]="simpleMenu" class="px-3 py-2 text-sm font-medium">Getting started</button>

      <ng-template #simpleMenu cdkMenuPanel>
        <div z-menu-content class="w-[200px]">
          <button z-menu-item (click)="navigate('introduction')">Introduction</button>
          <button z-menu-item (click)="navigate('installation')">Installation</button>
          <button z-menu-item (click)="navigate('typography')">Typography</button>
          <button z-menu-item (click)="navigate('theming')">Theming</button>
        </div>
      </ng-template>

      <!-- Components Menu -->
      <button z-button zType="ghost" zMenuTrigger [menuTriggerFor]="componentsMenu" class="px-3 py-2 text-sm font-medium">Components</button>

      <ng-template #componentsMenu cdkMenuPanel>
        <div z-menu-content class="w-[400px]">
          <div class="grid grid-cols-2 gap-1">
            @for (component of components; track component.name) {
              <button z-menu-item (click)="navigate(component.href)" class="flex flex-col items-start justify-start h-auto py-2">
                <div class="text-sm font-medium">{{ component.name }}</div>
                <div class="text-xs text-muted-foreground line-clamp-2">
                  {{ component.description }}
                </div>
              </button>
            }
          </div>
        </div>
      </ng-template>

      <!-- Regular Link Button -->
      <button z-button zType="ghost" (click)="navigate('docs')" class="px-3 py-2 text-sm font-medium">Documentation</button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ZardDemoMenuNavigationComponent {
  components = [
    {
      name: 'Alert Dialog',
      href: '/docs/components/alert-dialog',
      description: 'A modal dialog that interrupts the user with important content.',
    },
    {
      name: 'Button',
      href: '/docs/components/button',
      description: 'Displays a button or a component that looks like a button.',
    },
    {
      name: 'Card',
      href: '/docs/components/card',
      description: 'Displays a card with header, content, and footer.',
    },
    {
      name: 'Dialog',
      href: '/docs/components/dialog',
      description: 'A window overlaid on the primary window.',
    },
    {
      name: 'Dropdown Menu',
      href: '/docs/components/dropdown-menu',
      description: 'Displays a menu to the user.',
    },
    {
      name: 'Input',
      href: '/docs/components/input',
      description: 'Displays a form input field or a component that looks like an input field.',
    },
  ];

  navigate(path: string) {
    console.log('Navigate to:', path);
    // In a real app, you would use Angular Router here
    // this.router.navigate([path]);
  }
}

```
