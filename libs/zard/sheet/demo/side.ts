import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardInputDirective } from '../../input/input.directive';
import { ZardRadioComponent } from '../../radio/radio.component';
import { ZardSheetModule } from '../sheet.module';
import { Z_MODAL_DATA, ZardSheetService } from '../sheet.service';

interface iSheetData {
  name: string;
  username: string;
}

@Component({
  selector: 'zard-demo-sheet-side',
  imports: [FormsModule, ReactiveFormsModule, ZardInputDirective],
  standalone: true,
  template: `
    <form [formGroup]="form" class="grid flex-1 auto-rows-min gap-6 px-4">
      <div class="grid gap-3">
        <label
          for="name"
          class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        >
          Name
        </label>
        <input
          z-input
          formControlName="name"
          class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />
      </div>

      <div class="grid gap-3">
        <label
          for="username"
          class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        >
          Username
        </label>
        <input
          z-input
          formControlName="username"
          class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />
      </div>
    </form>
  `,
  exportAs: 'zardDemoSheetSide',
})
export class ZardDemoSheetSideInputComponent {
  private zData: iSheetData = inject(Z_MODAL_DATA);

  form = new FormGroup({
    name: new FormControl('Matheus Ribeiro'),
    username: new FormControl('@ribeiromatheus.dev'),
  });

  constructor() {
    if (this.zData) this.form.patchValue(this.zData);
  }
}

@Component({
  imports: [ZardRadioComponent, FormsModule, ZardButtonComponent, ZardSheetModule],
  standalone: true,
  template: `
    <div class="flex flex-col justify-center space-y-6">
      <div class="flex space-x-4">
        <span z-radio name="top" [(ngModel)]="placement" value="top">top</span>
        <span z-radio name="bottom" [(ngModel)]="placement" value="bottom">bottom</span>
        <span z-radio name="left" [(ngModel)]="placement" value="left">left</span>
        <span z-radio name="right" [(ngModel)]="placement" value="right">right</span>
      </div>
      <button z-button zType="outline" (click)="openSheet()">Edit profile</button>
    </div>
  `,
})
export class ZardDemoSheetSideComponent {
  protected readonly placement = signal<'right' | 'left' | 'top' | 'bottom' | null | undefined>('right');

  private sheetService = inject(ZardSheetService);

  openSheet() {
    this.sheetService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoSheetSideInputComponent,
      zData: {
        name: 'Matheus Ribeiro',
        username: '@ribeiromatheus.dev',
      } as iSheetData,
      zOkText: 'Save changes',
      zOnOk: instance => {
        console.log('Form submitted:', instance.form.value);
      },
      zSide: this.placement(),
    });
  }
}
