import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputComponent } from '@/shared/components/input';
import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { ZardSheetService } from '@/shared/components/sheet/sheet.service';

@Component({
  selector: 'zard-demo-sheet-preview-form',
  imports: [FormsModule, ReactiveFormsModule, ZardInputComponent],
  template: `
    <form [formGroup]="form" class="grid flex-1 auto-rows-min gap-6 px-4">
      <div class="grid gap-3">
        <label for="sheet-demo-name" class="text-sm leading-none font-medium select-none">Name</label>
        <input z-input id="sheet-demo-name" formControlName="name" />
      </div>

      <div class="grid gap-3">
        <label for="sheet-demo-username" class="text-sm leading-none font-medium select-none">Username</label>
        <input z-input id="sheet-demo-username" formControlName="username" />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'zardDemoSheetPreviewForm',
})
export class ZardDemoSheetPreviewFormComponent {
  form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    username: new FormControl('@peduarte'),
  });
}

@Component({
  imports: [ZardButtonComponent, ZardSheetImports],
  template: `
    <button type="button" z-button zType="outline" (click)="openSheet()">Open</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSheetPreviewComponent {
  private readonly sheetService = inject(ZardSheetService);

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
