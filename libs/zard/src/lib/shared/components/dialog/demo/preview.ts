import { ChangeDetectionStrategy, Component, inject, signal, type AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
import { Z_MODAL_DATA, ZardDialogService } from '@/shared/components/dialog/dialog.service';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

interface DialogData {
  name: string;
  username: string;
}

/** Content the service renders inside the dialog; reads what was passed through `zData`. */
@Component({
  selector: 'z-demo-dialog-preview-content',
  imports: [ReactiveFormsModule, ZardInputComponent],
  template: `
    <form [formGroup]="form" class="grid gap-4">
      <div class="grid gap-3">
        <label for="dialog-service-name" class="text-sm leading-none font-medium select-none">Name</label>
        <input z-input id="dialog-service-name" formControlName="name" />
      </div>
      <div class="grid gap-3">
        <label for="dialog-service-username" class="text-sm leading-none font-medium select-none">Username</label>
        <input z-input id="dialog-service-username" formControlName="username" />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'zardDemoDialogPreviewContent',
})
export class ZardDemoDialogPreviewContentComponent implements AfterViewInit {
  private readonly data = inject(Z_MODAL_DATA) as DialogData;

  readonly form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    username: new FormControl('@peduarte'),
  });

  ngAfterViewInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }
}

@Component({
  selector: 'z-demo-dialog-preview',
  imports: [ZardButtonComponent, ZardDialogImports, ZardInputComponent, ZardTabsImports, ReactiveFormsModule],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Edit profile</button>

        <z-dialog [(zVisible)]="visible">
          <z-dialog-header>
            <z-dialog-title>Edit profile</z-dialog-title>
            <z-dialog-description>Make changes to your profile here. Click save when you're done.</z-dialog-description>
          </z-dialog-header>
          <form [formGroup]="form" class="grid gap-4">
            <div class="grid gap-3">
              <label for="dialog-name" class="text-sm leading-none font-medium select-none">Name</label>
              <input z-input id="dialog-name" formControlName="name" />
            </div>
            <div class="grid gap-3">
              <label for="dialog-username" class="text-sm leading-none font-medium select-none">Username</label>
              <input z-input id="dialog-username" formControlName="username" />
            </div>
          </form>
          <z-dialog-footer>
            <button type="button" z-button zType="outline" z-dialog-close>Cancel</button>
            <button type="button" z-button (click)="save()">Save changes</button>
          </z-dialog-footer>
        </z-dialog>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="openDialog()">Edit profile</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogPreviewComponent {
  private readonly dialogService = inject(ZardDialogService);

  readonly visible = signal(false);

  readonly form = new FormGroup({
    name: new FormControl('Samuel Rizzon'),
    username: new FormControl('@samuelrizzondev'),
  });

  save() {
    console.log('Form submitted:', this.form.value);
    this.visible.set(false);
  }

  openDialog() {
    this.dialogService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoDialogPreviewContentComponent,
      zData: {
        name: 'Samuel Rizzon',
        username: '@samuelrizzondev',
      } satisfies DialogData,
      zOkText: 'Save changes',
      zOnOk: instance => {
        console.log('Form submitted:', instance.form.value);
      },
    });
  }
}
