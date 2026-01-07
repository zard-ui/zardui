```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component, inject, type AfterViewInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ZardInputDirective } from '../input.directive';

@Component({
  selector: 'z-demo-input-default',
  imports: [ZardInputDirective, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" class="flex flex-col gap-3">
      <input z-input placeholder="Name" formControlName="name" />
      <input z-input placeholder="Disabled" formControlName="novalue" />
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputDefaultComponent implements AfterViewInit {
  private fb = inject(FormBuilder);

  readonly form = this.fb.group({
    name: [''],
    novalue: [''],
  });

  ngAfterViewInit(): void {
    this.form.get('novalue')?.disable();
    this.form.patchValue({ name: 'John Doe' });
  }
}

```