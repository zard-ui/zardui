```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardIdDirective } from '@/shared/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardInputDirective } from '../../input/input.directive';
import { ZardFormImports } from '../form.imports';

@Component({
  selector: 'zard-demo-form-default',
  imports: [FormsModule, ZardButtonComponent, ZardInputDirective, ZardFormImports, ZardIdDirective],
  template: `
    <form class="max-w-sm space-y-6">
      <z-form-field zardId="fullName" #f="zardId">
        <label z-form-label zRequired [for]="f.id()">Full Name</label>
        <z-form-control>
          <input
            z-input
            type="text"
            [id]="f.id()"
            placeholder="Enter your full name"
            [(ngModel)]="fullName"
            name="fullName"
          />
        </z-form-control>
        <z-form-message>This is your display name.</z-form-message>
      </z-form-field>

      <z-form-field zardId="email" #e="zardId">
        <label z-form-label zRequired [for]="e.id()">Email</label>
        <z-form-control>
          <input z-input type="email" [id]="e.id()" placeholder="Enter your email" [(ngModel)]="email" name="email" />
        </z-form-control>
        <z-form-message>We'll never share your email with anyone else.</z-form-message>
      </z-form-field>

      <z-form-field zardId="bio" #b="zardId">
        <label z-form-label [for]="b.id()">Bio</label>
        <z-form-control>
          <textarea
            z-input
            [id]="b.id()"
            placeholder="Tell us about yourself"
            rows="3"
            [(ngModel)]="bio"
            name="bio"
          ></textarea>
        </z-form-control>
        <z-form-message>Optional: Brief description about yourself.</z-form-message>
      </z-form-field>

      <button z-button zType="default" type="submit">Submit</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ZardDemoFormDefaultComponent {
  fullName = '';
  email = '';
  bio = '';
}

```