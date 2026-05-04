import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideShieldAlert } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardItemImports } from '@/shared/components/item/item.imports';

@Component({
  selector: 'z-demo-item-icon',
  imports: [ZardButtonComponent, NgIcon, ...ZardItemImports],
  template: `
    <div class="flex w-full min-w-lg flex-col gap-6">
      <z-item zVariant="outline">
        <z-item-media zVariant="icon">
          <ng-icon name="lucideShieldAlert" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Security Alert</z-item-title>
          <z-item-description>New login detected from unknown device.</z-item-description>
        </z-item-content>
        <z-item-actions>
          <button type="button" z-button zType="outline" zSize="sm">Review</button>
        </z-item-actions>
      </z-item>
    </div>
  `,
  viewProviders: [provideIcons({ lucideShieldAlert })],
})
export class ZardDemoItemIconComponent {}
