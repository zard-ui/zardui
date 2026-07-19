import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInbox } from '@ng-icons/lucide';

import { ZardItemImports } from '@/shared/components/item/item.imports';

@Component({
  selector: 'z-demo-item-size',
  imports: [NgIcon, ...ZardItemImports],
  template: `
    <div class="flex w-full min-w-md flex-col gap-6">
      <z-item zVariant="outline">
        <z-item-media zVariant="icon">
          <ng-icon name="lucideInbox" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Default Size</z-item-title>
          <z-item-description>The standard size for most use cases.</z-item-description>
        </z-item-content>
      </z-item>
      <z-item zVariant="outline" zSize="sm">
        <z-item-media zVariant="icon">
          <ng-icon name="lucideInbox" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Small Size</z-item-title>
          <z-item-description>A compact size for dense layouts.</z-item-description>
        </z-item-content>
      </z-item>
      <z-item zVariant="outline" zSize="xs">
        <z-item-media zVariant="icon">
          <ng-icon name="lucideInbox" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Extra Small Size</z-item-title>
          <z-item-description>The most compact size available.</z-item-description>
        </z-item-content>
      </z-item>
    </div>
  `,
  viewProviders: [provideIcons({ lucideInbox })],
})
export class ZardDemoItemSizeComponent {}
