import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';

@Component({
  selector: 'lib-signup-04',
  standalone: true,
  imports: [ReactiveFormsModule, ZardButtonComponent, ZardInputComponent, ...ZardCardImports, ...ZardFieldImports],
  templateUrl: './signup-04.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Signup04Component {
  protected readonly isLoading = signal(false);

  protected readonly signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  protected onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
  }
}
