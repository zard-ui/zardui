import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardInputDirective } from '../../input/input.directive';
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
  imports: [FormsModule, ReactiveFormsModule, ZardInputDirective],
  template: `
    <form [formGroup]="form" class="grid gap-4">
      <div class="grid gap-3">
        <label
          for="name"
          class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
          >Name</label
        >
        <input z-input formControlName="name" />
      </div>

      <div class="grid gap-3">
        <label
          for="username"
          class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
          >Username</label
        >
        <input z-input formControlName="username" />
      </div>
    </form>
  `,
})
export class ZardDemoDialogBasicInputComponent {
  private zData: iDialogData = inject(Z_MODAL_DATA);

  form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    username: new FormControl('@peduarte'),
  });

  constructor() {
    if (this.zData) this.form.patchValue(this.zData);
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
      },
      zOkText: 'Save changes',
      zOnOk: instance => {
        console.log('Form submitted:', instance.form.value);
      },
      zWidth: '425px',
    });
  }
}
