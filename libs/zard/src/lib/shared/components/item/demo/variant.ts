import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInbox } from '@ng-icons/lucide';

import { ZardItemImports } from '@/shared/components/item/item.imports';

@Component({
  selector: 'z-demo-item-variant',
  imports: [NgIcon, ...ZardItemImports],
  template: `
    <div class="flex w-full min-w-md flex-col gap-6">
      <z-item>
        <z-item-media zVariant="icon">
          <ng-icon name="lucideInbox" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Default Variant</z-item-title>
          <z-item-description>Transparent background with no border.</z-item-description>
        </z-item-content>
      </z-item>
      <z-item zVariant="outline">
        <z-item-media zVariant="icon">
          <ng-icon name="lucideInbox" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Outline Variant</z-item-title>
          <z-item-description>Outlined style with a visible border.</z-item-description>
        </z-item-content>
      </z-item>
      <z-item zVariant="muted">
        <z-item-media zVariant="icon">
          <ng-icon name="lucideInbox" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Muted Variant</z-item-title>
          <z-item-description>Muted background for secondary content.</z-item-description>
        </z-item-content>
      </z-item>
    </div>
  `,
  viewProviders: [provideIcons({ lucideInbox })],
})
export class ZardDemoItemVariantComponent {}
