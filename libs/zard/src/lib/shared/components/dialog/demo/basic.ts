import { ChangeDetectionStrategy, Component, inject, type AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';

import { ZardInputDirective } from '../../input/input.directive';
import { Z_MODAL_DATA, ZardDialogService } from '../dialog.service';

interface iDialogData {
  name: string;
  username: string;
}

@Component({
  selector: 'zard-demo-dialog-basic',
  imports: [FormsModule, ReactiveFormsModule, ZardInputDirective],
  template: `
    <form [formGroup]="form" class="grid gap-4">
      <div class="grid gap-3">
        <label for="name" class="text-sm leading-none font-medium select-none">Name</label>
        <input z-input zSize="sm" id="name" formControlName="name" />
      </div>

      <div class="grid gap-3">
        <label for="username" class="text-sm leading-none font-medium select-none">Username</label>
        <input z-input zSize="sm" id="username" formControlName="username" />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'zardDemoDialogBasic',
})
export class ZardDemoDialogBasicInputComponent implements AfterViewInit {
  private zData = inject(Z_MODAL_DATA) as iDialogData;

  form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    username: new FormControl('@peduarte'),
  });

  ngAfterViewInit(): void {
    if (this.zData) {
      this.form.patchValue(this.zData);
    }
  }
}

@Component({
  imports: [ZardDialogImports],
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
      } as iDialogData,
      zOkText: 'Save changes',
      zOnOk: instance => {
        console.log('Form submitted:', instance.form.value);
      },
    });
  }
}
