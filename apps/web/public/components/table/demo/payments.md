```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardBadgeComponent } from '../../badge/badge.component';
import { ZardButtonComponent } from '../../button/button.component';
import { ZardTableBodyComponent, ZardTableCellComponent, ZardTableComponent, ZardTableHeadComponent, ZardTableHeaderComponent, ZardTableRowComponent } from '../table.component';
import { ZardIconComponent } from '../../icon/icon.component';

export interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
}

@Component({
  standalone: true,
  imports: [
    ZardTableComponent,
    ZardTableHeaderComponent,
    ZardTableBodyComponent,
    ZardTableRowComponent,
    ZardTableHeadComponent,
    ZardTableCellComponent,
    ZardBadgeComponent,
    ZardButtonComponent,
    ZardIconComponent,
  ],
  template: `
    <div class="w-full">
      <div class="overflow-hidden rounded-md border">
        <table z-table>
          <thead z-table-header>
            <tr z-table-row>
              <th z-table-head>Status</th>
              <th z-table-head>Email</th>
              <th z-table-head class="text-right">Amount</th>
              <th z-table-head class="w-16">Actions</th>
            </tr>
          </thead>
          <tbody z-table-body>
            @for (payment of payments; track payment.id) {
              <tr z-table-row>
                <td z-table-cell>
                  <z-badge [zType]="getStatusVariant(payment.status)">
                    {{ payment.status }}
                  </z-badge>
                </td>
                <td z-table-cell>
                  <div class="lowercase">{{ payment.email }}</div>
                </td>
                <td z-table-cell>
                  <div class="text-right font-medium">{{ formatCurrency(payment.amount) }}</div>
                </td>
                <td z-table-cell>
                  <div class="flex items-center gap-2">
                    <z-button zType="ghost" zSize="icon" (click)="copyPaymentId(payment.id)" title="Copy payment ID">
                      <div z-icon zType="Copy"></div>
                    </z-button>
                    <z-button zType="ghost" zSize="icon" (click)="viewDetails(payment)" title="View details">
                      <div z-icon zType="Eye"></div>
                    </z-button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr z-table-row>
                <td z-table-cell [attr.colspan]="4" class="h-24 text-center">No results.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ZardDemoTablePaymentsComponent {
  payments: Payment[] = [
    {
      id: 'm5gr84i9',
      amount: 316,
      status: 'success',
      email: 'ken99@example.com',
    },
    {
      id: '3u1reuv4',
      amount: 242,
      status: 'success',
      email: 'Abe45@example.com',
    },
    {
      id: 'derv1ws0',
      amount: 837,
      status: 'processing',
      email: 'Monserrat44@example.com',
    },
    {
      id: '5kma53ae',
      amount: 874,
      status: 'success',
      email: 'Silas22@example.com',
    },
    {
      id: 'bhqecj4p',
      amount: 721,
      status: 'failed',
      email: 'carmella@example.com',
    },
    {
      id: 'abc123ef',
      amount: 456,
      status: 'pending',
      email: 'jane.doe@example.com',
    },
  ];

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  getStatusVariant(status: Payment['status']): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
      case 'success':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'pending':
        return 'outline';
      default:
        return 'secondary';
    }
  }

  copyPaymentId(id: string): void {
    navigator.clipboard.writeText(id);
    console.log('Payment ID copied:', id);
  }

  viewDetails(payment: Payment): void {
    console.log('View payment details:', payment);
  }
}

```