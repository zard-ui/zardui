import { ZardFormFieldComponent, ZardFormLabelComponent, ZardFormControlComponent } from '@zard/components/form/form.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'z-authentication-01',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ZardButtonComponent,
    ZardCardComponent,
    ZardCheckboxComponent,
    ZardInputDirective,
    ZardFormFieldComponent,
    ZardFormLabelComponent,
    ZardFormControlComponent,
  ],
  templateUrl: './authentication-01.component.html',
})
export class Authentication01Component {
  protected readonly isLoading = signal(false);

  protected readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rememberMe: new FormControl(false),
  });
}
