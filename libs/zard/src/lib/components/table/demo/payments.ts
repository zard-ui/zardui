import { Component } from '@angular/core';

import { ZardBadgeComponent } from '../../badge/badge.component';
import { ZardButtonComponent } from '../../button/button.component';
import { ZardTableComponent } from '../components/table.component';
import { ZardTableModule } from '../components/table.module';

export interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
}

@Component({
  standalone: true,
  imports: [ZardTableComponent, ZardTableModule, ZardBadgeComponent, ZardButtonComponent],
  template: `
    <z-table zType="bordered" zSize="default">
      <thead z-table-header>
        <tr z-table-row>
          <th z-table-head>Status</th>
          <th z-table-head colspan="2">Email</th>
          <th z-table-head class="">Amount</th>
          <th z-table-head class="text-right">Actions</th>
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
            <td z-table-cell colspan="2">
              <div class="lowercase">{{ payment.email }}</div>
            </td>
            <td z-table-cell>
              <div class="font-medium">{{ formatCurrency(payment.amount) }}</div>
            </td>
            <td z-table-cell>
              <div class="flex items-center gap-2">
                <z-button zType="ghost" zSize="icon" (click)="copyPaymentId(payment.id)" title="Copy payment ID">
                  <div class="icon-copy"></div>
                </z-button>
                <z-button zType="ghost" zSize="icon" (click)="viewDetails(payment)" title="View details">
                  <div class="icon-eye"></div>
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
    </z-table>
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
  zType: any;

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
