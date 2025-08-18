```angular-ts showLineNumbers
import { Component, inject } from '@angular/core';

import { ZardButtonComponent } from '../../components';
import { ZardAlertDialogService } from '../alert-dialog.service';

@Component({
  selector: 'zard-demo-alert-dialog-destructive',
  standalone: true,
  imports: [ZardButtonComponent],
  template: `
    <button z-button zType="destructive" (click)="showDestructiveAlert()">
      Delete Item
    </button>
  `,
})
export class ZardDemoAlertDialogDestructiveComponent {
  private alertDialogService = inject(ZardAlertDialogService);

  showDestructiveAlert() {
    const alertRef = this.alertDialogService.confirm({
      zTitle: 'Delete Item',
      zDescription: 'Are you sure you want to delete this item? This action cannot be undone.',
      zIcon: 'trash-2',
      zOkText: 'Delete',
      zCancelText: 'Cancel',
      zOkDestructive: true,
    });

    alertRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Item deleted');
      }
    });
  }
}
```
