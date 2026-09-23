import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerService } from '@/shared/components/drawer/drawer.service';
import { ZardInputComponent } from '@/shared/components/input';

@Component({
  selector: 'z-demo-drawer-service-form',
  imports: [ReactiveFormsModule, ZardInputComponent],
  template: `
    <form [formGroup]="form" class="grid gap-4 px-4">
      <div class="grid gap-3">
        <label for="drawer-service-name" class="text-sm leading-none font-medium select-none">Name</label>
        <input z-input id="drawer-service-name" formControlName="name" />
      </div>

      <div class="grid gap-3">
        <label for="drawer-service-goal" class="text-sm leading-none font-medium select-none">Daily goal</label>
        <input z-input id="drawer-service-goal" type="number" formControlName="goal" />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerServiceFormComponent {
  readonly form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    goal: new FormControl(350),
  });
}

@Component({
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="openDrawer()">Open from a service</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerServiceComponent {
  private readonly drawerService = inject(ZardDrawerService);

  openDrawer() {
    this.drawerService.create({
      zTitle: 'Move goal',
      zDescription: 'Set your daily activity goal.',
      zContent: ZardDemoDrawerServiceFormComponent,
      zOkText: 'Submit',
      zCancelText: 'Cancel',
      zOnOk: instance => {
        console.log('Goal submitted:', instance.form.value);
      },
    });
  }
}
