import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputComponent } from '@/shared/components/input';
import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { ZardSheetService } from '@/shared/components/sheet/sheet.service';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

/** Content the service renders inside the sheet. */
@Component({
  selector: 'z-demo-sheet-preview-form',
  imports: [ReactiveFormsModule, ZardInputComponent],
  template: `
    <form [formGroup]="form" class="grid flex-1 auto-rows-min gap-6 px-4">
      <div class="grid gap-3">
        <label for="sheet-service-name" class="text-sm leading-none font-medium select-none">Name</label>
        <input z-input id="sheet-service-name" formControlName="name" />
      </div>
      <div class="grid gap-3">
        <label for="sheet-service-username" class="text-sm leading-none font-medium select-none">Username</label>
        <input z-input id="sheet-service-username" formControlName="username" />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'zardDemoSheetPreviewForm',
})
export class ZardDemoSheetPreviewFormComponent {
  readonly form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    username: new FormControl('@peduarte'),
  });
}

@Component({
  selector: 'z-demo-sheet-preview',
  imports: [ZardButtonComponent, ZardInputComponent, ZardSheetImports, ZardTabsImports, ReactiveFormsModule],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Open</button>

        <z-sheet [(zVisible)]="visible">
          <z-sheet-header>
            <z-sheet-title>Edit profile</z-sheet-title>
            <z-sheet-description>Make changes to your profile here. Click save when you're done.</z-sheet-description>
          </z-sheet-header>
          <form [formGroup]="form" class="grid flex-1 auto-rows-min gap-6 px-4">
            <div class="grid gap-3">
              <label for="sheet-name" class="text-sm leading-none font-medium select-none">Name</label>
              <input z-input id="sheet-name" formControlName="name" />
            </div>
            <div class="grid gap-3">
              <label for="sheet-username" class="text-sm leading-none font-medium select-none">Username</label>
              <input z-input id="sheet-username" formControlName="username" />
            </div>
          </form>
          <z-sheet-footer>
            <button type="button" z-button (click)="save()">Save changes</button>
            <button type="button" z-button zType="outline" z-sheet-close>Close</button>
          </z-sheet-footer>
        </z-sheet>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="openSheet()">Open</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSheetPreviewComponent {
  private readonly sheetService = inject(ZardSheetService);

  readonly visible = signal(false);

  readonly form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    username: new FormControl('@peduarte'),
  });

  save() {
    console.log('Form submitted:', this.form.value);
    this.visible.set(false);
  }

  openSheet() {
    this.sheetService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoSheetPreviewFormComponent,
      zOkText: 'Save changes',
      zCancelText: 'Close',
      zOnOk: instance => {
        console.log('Form submitted:', instance.form.value);
      },
    });
  }
}
