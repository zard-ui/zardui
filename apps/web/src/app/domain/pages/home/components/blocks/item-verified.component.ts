import { Component, ChangeDetectionStrategy } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideChevronRight } from '@ng-icons/lucide';

import { ZardItemImports } from '@zard/components/item/item.imports';

@Component({
  selector: 'z-block-item-verified',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, ...ZardItemImports],
  viewProviders: [provideIcons({ lucideBadgeCheck, lucideChevronRight })],
  template: `
    <a z-item href="#" zVariant="outline" zSize="sm">
      <z-item-media>
        <ng-icon name="lucideBadgeCheck" size="1.25rem" />
      </z-item-media>
      <z-item-content>
        <z-item-title>Your profile has been verified.</z-item-title>
      </z-item-content>
      <z-item-actions>
        <ng-icon name="lucideChevronRight" size="1rem" />
      </z-item-actions>
    </a>
  `,
})
export class BlockItemVerifiedComponent {}
