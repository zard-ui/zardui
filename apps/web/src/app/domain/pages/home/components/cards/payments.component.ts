import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideChevronRight, lucideEllipsis, lucideRefreshCw, lucideSettings } from '@ng-icons/lucide';

import { ZardBreadcrumbImports } from '@zard/components/breadcrumb/breadcrumb.imports';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardItemImports } from '@zard/components/item/item.imports';

interface Action {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
}

/**
 * Breadcrumb no cabeçalho e uma lista de atalhos embaixo.
 *
 * O card existe pelo breadcrumb: é o componente que só faz sentido dentro de uma
 * página, e mostrá-lo dentro de um card é a única forma de dar a ele um contexto
 * na parede.
 */
@Component({
  selector: 'z-card-payments',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardBreadcrumbImports, ZardItemImports, ZardButtonComponent, NgIcon],
  viewProviders: [
    provideIcons({ lucideCalendar, lucideChevronRight, lucideEllipsis, lucideRefreshCw, lucideSettings }),
  ],
  host: { class: 'block w-full' },
  template: `
    <z-card>
      <z-card-header class="flex flex-col gap-3">
        <z-breadcrumb>
          <z-breadcrumb-item>
            <a z-breadcrumb-link href="#">Home</a>
          </z-breadcrumb-item>
          <z-breadcrumb-separator />
          <z-breadcrumb-item>
            <button type="button" z-button zType="ghost" zSize="icon-sm" aria-label="Account options">
              <ng-icon name="lucideEllipsis" />
            </button>
          </z-breadcrumb-item>
          <z-breadcrumb-separator />
          <z-breadcrumb-item>
            <span z-breadcrumb-page>Payments</span>
          </z-breadcrumb-item>
        </z-breadcrumb>
      </z-card-header>

      <z-card-content>
        <div z-item-group role="list">
          @for (action of actions; track action.title) {
            <div role="listitem" class="w-full">
              <a z-item href="#" zVariant="muted">
                <div z-item-media zVariant="icon">
                  <ng-icon [name]="action.icon" />
                </div>
                <div z-item-content>
                  <div z-item-title>{{ action.title }}</div>
                  <p z-item-description>{{ action.description }}</p>
                </div>
                <ng-icon name="lucideChevronRight" class="text-muted-foreground size-4 shrink-0" />
              </a>
            </div>
          }
        </div>
      </z-card-content>
    </z-card>
  `,
})
export class CardPaymentsComponent {
  readonly actions: readonly Action[] = [
    {
      title: 'Change transfer limit',
      description: 'Adjust how much you can send from your balance.',
      icon: 'lucideSettings',
    },
    { title: 'Scheduled transfers', description: 'Set up a transfer to send at a later date.', icon: 'lucideCalendar' },
    {
      title: 'Recurring card payments',
      description: 'Manage your repeated card transactions.',
      icon: 'lucideRefreshCw',
    },
  ];
}
