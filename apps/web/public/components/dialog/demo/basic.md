```angular-ts showLineNumbers copyButton
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardDatePickerComponent } from '../../date-picker/date-picker.component';
import { ZardPopoverComponent, ZardPopoverDirective } from '../../popover/popover.component';
import { ZardDialogModule } from '../dialog.component';
import { Z_MODAL_DATA, ZardDialogService } from '../dialog.service';

interface iDialogData {
  name: string;
  username: string;
}

@Component({
  selector: 'zard-demo-dialog-basic',
  exportAs: 'zardDemoDialogBasic',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ZardDatePickerComponent, ZardPopoverComponent, ZardPopoverDirective],
  template: `
    <button z-button zPopover [zContent]="popoverContent" zType="outline">Open popover</button>

    <ng-template #popoverContent>
      <z-popover>
        <div class="space-y-2">
          <h4 class="font-medium leading-none">Dimensions</h4>
          <p class="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
        </div>
      </z-popover>
    </ng-template>

    ---

    <z-date-picker placeholder="Pick a date" [value]="selectedDate()" (dateChange)="onDateChange($event)" />
  `,
})
export class ZardDemoDialogBasicInputComponent {
  private zData: iDialogData = inject(Z_MODAL_DATA);
  selectedDate = signal<Date | null>(null);

  form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    username: new FormControl('@peduarte'),
  });

  constructor() {
    if (this.zData) this.form.patchValue(this.zData);
  }

  onDateChange(date: Date | null) {
    this.selectedDate.set(date);
    console.log('Selected date:', date);
  }
}

@Component({
  standalone: true,
  imports: [ZardButtonComponent, ZardDialogModule],
  template: ` <button z-button zType="outline" (click)="openDialog()">Edit profile</button> `,
})
export class ZardDemoDialogBasicComponent {
  private dialogService = inject(ZardDialogService);

  openDialog() {
    this.dialogService.create({
      zTitle: 'Edit Profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoDialogBasicInputComponent,
      zData: {
        name: 'Samuel Rizzon',
        username: '@samuelrizzondev',
      } as iDialogData,
      zOkText: 'Save changes',
      zOnOk: instance => {
        console.log('Form submitted:', instance.form.value);
      },
      zWidth: '425px',
    });
  }
}

```