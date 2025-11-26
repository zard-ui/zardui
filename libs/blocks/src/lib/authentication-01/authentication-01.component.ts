import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '@ngzard/ui/button';
import { ZardCardComponent } from '@ngzard/ui/card';
import { ZardCheckboxComponent } from '@ngzard/ui/checkbox';
import { ZardFormFieldComponent, ZardFormLabelComponent, ZardFormControlComponent } from '@ngzard/ui/form';
import { ZardInputDirective } from '@ngzard/ui/input';

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
