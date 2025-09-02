```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardDividerComponent } from '../../divider/divider.component';
import { ZardMenuModule } from '../menu.module';

@Component({
  selector: 'zard-demo-menu-mega',
  standalone: true,
  imports: [ZardMenuModule, ZardButtonComponent, ZardDividerComponent],
  template: `
    <nav class="flex items-center space-x-1">
      <div class="relative">
        <button z-button zType="ghost" zMenuTrigger [menuTriggerFor]="componentsMenu" class="h-9 px-4 py-2">
          Components
          <i class="icon-chevron-down ml-1 h-3 w-3"></i>
        </button>
        
        <ng-template #componentsMenu cdkMenuPanel>
          <div z-menu-content class="w-[600px] p-4">
            <div class="grid grid-cols-3 gap-4">
              <div>
                <h3 class="mb-2 font-medium text-sm text-muted-foreground">Form</h3>
                <div class="space-y-1">
                  <button z-menu-item (click)="log('Button')" class="justify-start">Button</button>
                  <button z-menu-item (click)="log('Input')" class="justify-start">Input</button>
                  <button z-menu-item (click)="log('Select')" class="justify-start">Select</button>
                  <button z-menu-item (click)="log('Checkbox')" class="justify-start">Checkbox</button>
                </div>
              </div>
              
              <div>
                <h3 class="mb-2 font-medium text-sm text-muted-foreground">Layout</h3>
                <div class="space-y-1">
                  <button z-menu-item (click)="log('Card')" class="justify-start">Card</button>
                  <button z-menu-item (click)="log('Dialog')" class="justify-start">Dialog</button>
                  <button z-menu-item (click)="log('Tabs')" class="justify-start">Tabs</button>
                  <button z-menu-item (click)="log('Accordion')" class="justify-start">Accordion</button>
                </div>
              </div>
              
              <div>
                <h3 class="mb-2 font-medium text-sm text-muted-foreground">Data</h3>
                <div class="space-y-1">
                  <button z-menu-item (click)="log('Table')" class="justify-start">Table</button>
                  <button z-menu-item (click)="log('Badge')" class="justify-start">Badge</button>
                  <button z-menu-item (click)="log('Avatar')" class="justify-start">Avatar</button>
                  <button z-menu-item (click)="log('Progress')" class="justify-start">Progress</button>
                </div>
              </div>
            </div>
            
            <z-divider class="my-4"></z-divider>
            
            <div class="flex items-center justify-between">
              <div class="text-sm text-muted-foreground">
                50+ components available
              </div>
              <button z-button zType="outline" zSize="sm" (click)="log('View all')">
                View all components
              </button>
            </div>
          </div>
        </ng-template>
      </div>

      <button z-button zType="ghost" (click)="log('Templates')" class="h-9 px-4 py-2">
        Templates
      </button>

      <button z-button zType="ghost" (click)="log('Examples')" class="h-9 px-4 py-2">
        Examples
      </button>
    </nav>
  `,
})
export class ZardDemoMenuMegaComponent {
  log(item: string) {
    console.log('Navigate to:', item);
  }
}
```