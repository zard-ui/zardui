import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideChevronRight,
  lucideEllipsis,
  lucideGauge,
  lucideRefreshCw,
  lucideRepeat,
} from '@ng-icons/lucide';

import { ZardBreadcrumbImports } from '@zard/components/breadcrumb';
import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardDropdownImports } from '@zard/components/dropdown';
import { ZardItemImports } from '@zard/components/item';

const ACTIONS = [
  {
    icon: 'lucideGauge',
    title: 'Change transfer limit',
    description: 'Adjust how much you can send from your balance.',
  },
  { icon: 'lucideCalendar', title: 'Scheduled transfers', description: 'Set up a transfer to send at a later date.' },
  { icon: 'lucideRepeat', title: 'Direct Debits', description: 'Set up and manage regular payments.' },
  {
    icon: 'lucideRefreshCw',
    title: 'Recurring card payments',
    description: 'Manage your repeated card transactions.',
  },
] as const;

@Component({
  selector: 'z-preview-01-payments',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardBreadcrumbImports, ZardDropdownImports, ZardItemImports, ZardButtonComponent, NgIcon],
  viewProviders: [
    provideIcons({ lucideCalendar, lucideChevronRight, lucideEllipsis, lucideGauge, lucideRefreshCw, lucideRepeat }),
  ],
  template: `
    <z-card>
      <z-card-header class="flex flex-col gap-3">
        <z-breadcrumb>
          <z-breadcrumb-item>
            <a z-breadcrumb-link href="#">Home</a>
          </z-breadcrumb-item>
          <z-breadcrumb-separator />
          <z-breadcrumb-item>
            <button
              type="button"
              z-button
              zSize="icon-sm"
              zType="ghost"
              z-dropdown
              [zDropdownMenu]="accountMenu"
              aria-label="Account options"
            >
              <ng-icon name="lucideEllipsis" />
              <span class="sr-only">Account options</span>
            </button>
          </z-breadcrumb-item>
          <z-breadcrumb-separator />
          <z-breadcrumb-item>
            <span z-breadcrumb-page>Payments</span>
          </z-breadcrumb-item>
        </z-breadcrumb>
        <z-dropdown-menu-content #accountMenu="zDropdownMenuContent" zAlign="start">
          <z-dropdown-menu-group>
            <z-dropdown-menu-item>Profile</z-dropdown-menu-item>
            <z-dropdown-menu-item>Statements</z-dropdown-menu-item>
            <z-dropdown-menu-item>Documents</z-dropdown-menu-item>
          </z-dropdown-menu-group>
        </z-dropdown-menu-content>
      </z-card-header>
      <z-card-content>
        <z-item-group>
          @for (action of actions; track action.title) {
            <a z-item href="#" zVariant="muted">
              <z-item-media zVariant="icon">
                <ng-icon [name]="action.icon" />
              </z-item-media>
              <z-item-content>
                <z-item-title>{{ action.title }}</z-item-title>
                <p z-item-description>{{ action.description }}</p>
              </z-item-content>
              <ng-icon name="lucideChevronRight" class="text-muted-foreground size-4 shrink-0" />
            </a>
          }
        </z-item-group>
      </z-card-content>
    </z-card>
  `,
})
export class Preview01PaymentsComponent {
  protected readonly actions = ACTIONS;
}
