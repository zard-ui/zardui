```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component, inject, type AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardInputDirective } from '../../input/input.directive';
import { ZardSelectItemComponent } from '../../select/select-item.component';
import { ZardSelectComponent } from '../../select/select.component';
import { ZardDialogModule } from '../dialog.component';
import { Z_MODAL_DATA, ZardDialogService } from '../dialog.service';

interface iDialogData {
  name: string;
  username: string;
}

@Component({
  selector: 'zard-demo-dialog-basic',
  imports: [FormsModule, ReactiveFormsModule, ZardInputDirective, ZardSelectComponent, ZardSelectItemComponent],
  template: `
    <form [formGroup]="form" class="grid gap-4">
      <div class="grid gap-3">
        <label
          for="name"
          class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        >
          Name
        </label>
        <input z-input formControlName="name" />
      </div>

      <div class="grid gap-3">
        <label
          for="username"
          class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        >
          Username
        </label>
        <input z-input formControlName="username" />
      </div>

      <div class="grid gap-3">
        <label
          for="region"
          class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        >
          Region
        </label>
        <z-select formControlName="region">
          <z-select-item zValue="africa">Africa</z-select-item>
          <z-select-item zValue="america">America</z-select-item>
          <z-select-item zValue="asia">Asia</z-select-item>
          <z-select-item zValue="australia">Australia</z-select-item>
          <z-select-item zValue="europe">Europe</z-select-item>
        </z-select>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'zardDemoDialogBasic',
})
export class ZardDemoDialogBasicInputComponent implements AfterViewInit {
  private zData: iDialogData = inject(Z_MODAL_DATA);

  form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    username: new FormControl('@peduarte'),
    region: new FormControl(''),
  });

  ngAfterViewInit(): void {
    if (this.zData) {
      this.form.patchValue(this.zData);
    }
  }
}

@Component({
  imports: [ZardButtonComponent, ZardDialogModule],
  template: `
    <button type="button" z-button zType="outline" (click)="openDialog()">Edit profile</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
        region: 'america',
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