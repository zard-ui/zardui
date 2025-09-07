```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardDividerComponent } from '../../divider/divider.component';
import { ZardMenuModule } from '../menu.module';

@Component({
  selector: 'zard-demo-menu-submenu',
  standalone: true,
  imports: [ZardMenuModule, ZardButtonComponent, ZardDividerComponent],
  template: `
    <nav class="flex items-center space-x-1">
      <div class="relative">
        <button z-button zType="ghost" zMenuTrigger [menuTriggerFor]="resourcesMenu" class="h-9 px-4 py-2">
          Resources
          <i class="icon-chevron-down ml-1 h-3 w-3"></i>
        </button>
        
        <ng-template #resourcesMenu cdkMenuPanel>
          <div z-menu-content class="w-52">
            <button z-menu-item (click)="log('Blog')">
              <i class="icon-book-open mr-2 h-4 w-4"></i>
              Blog
            </button>
            
            <button 
              z-menu-item 
              zMenuTrigger 
              [menuTriggerFor]="guidesSubmenu" 
              [side]="'right'" 
              [align]="'start'"
              class="justify-between"
            >
              <div class="flex items-center">
                <i class="icon-file-text mr-2 h-4 w-4"></i>
                Guides
              </div>
              <i class="icon-chevron-right h-4 w-4"></i>
            </button>
            
            <button 
              z-menu-item 
              zMenuTrigger 
              [menuTriggerFor]="communitySubmenu" 
              [side]="'right'" 
              [align]="'start'"
              class="justify-between"
            >
              <div class="flex items-center">
                <i class="icon-users mr-2 h-4 w-4"></i>
                Community
              </div>
              <i class="icon-chevron-right h-4 w-4"></i>
            </button>
            
            <z-divider zSpacing="sm"></z-divider>
            
            <button z-menu-item (click)="log('Help Center')">
              <i class="icon-help-circle mr-2 h-4 w-4"></i>
              Help Center
            </button>
          </div>
        </ng-template>

        <!-- Guides Submenu -->
        <ng-template #guidesSubmenu cdkMenuPanel>
          <div z-menu-content class="w-44">
            <button z-menu-item (click)="log('Getting Started')">Getting Started</button>
            <button z-menu-item (click)="log('Best Practices')">Best Practices</button>
            <button z-menu-item (click)="log('Tutorials')">Tutorials</button>
            <button z-menu-item (click)="log('API Reference')">API Reference</button>
          </div>
        </ng-template>

        <!-- Community Submenu -->
        <ng-template #communitySubmenu cdkMenuPanel>
          <div z-menu-content class="w-40">
            <button z-menu-item (click)="log('Discord')">Discord</button>
            <button z-menu-item (click)="log('GitHub')">GitHub</button>
            <button z-menu-item (click)="log('Twitter')">Twitter</button>
            <button z-menu-item (click)="log('Newsletter')">Newsletter</button>
          </div>
        </ng-template>
      </div>

      <button z-button zType="ghost" (click)="log('About')" class="h-9 px-4 py-2">
        About
      </button>

      <button z-button zType="ghost" (click)="log('Contact')" class="h-9 px-4 py-2">
        Contact
      </button>
    </nav>
  `,
})
export class ZardDemoMenuSubmenuComponent {
  log(item: string) {
    console.log('Navigate to:', item);
  }
}
```