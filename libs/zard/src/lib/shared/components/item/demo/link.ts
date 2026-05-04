import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideExternalLink } from '@ng-icons/lucide';

import { ZardItemImports } from '@/shared/components/item/item.imports';

@Component({
  selector: 'z-demo-item-link',
  imports: [NgIcon, ...ZardItemImports],
  viewProviders: [provideIcons({ lucideChevronRight, lucideExternalLink })],
  template: `
    <div class="flex w-full min-w-md flex-col gap-4">
      <a z-item href="#">
        <z-item-content>
          <z-item-title>Visit our documentation</z-item-title>
          <z-item-description>Learn how to get started with our components.</z-item-description>
        </z-item-content>
        <z-item-actions>
          <ng-icon name="lucideChevronRight" size="1rem" />
        </z-item-actions>
      </a>

      <a z-item href="#" zVariant="outline" target="_blank" rel="noopener noreferrer">
        <z-item-content>
          <z-item-title>External resource</z-item-title>
          <z-item-description>Opens in a new tab with security attributes.</z-item-description>
        </z-item-content>
        <z-item-actions>
          <ng-icon name="lucideExternalLink" size="1rem" />
        </z-item-actions>
      </a>
    </div>
  `,
})
export class ZardDemoItemLinkComponent {}
