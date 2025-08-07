import { Step } from '@zard/shared/constants/install.constant';
import { Component, input } from '@angular/core';

import { StepComponent } from '../step/step.component';

@Component({
  selector: 'z-steps',
  template: `
    @if (steps()) {
      <section>
        @for (step of steps(); track step.title; let index = $index) {
          <z-step [position]="index + 1" [stepProps]="step"></z-step>
        }
      </section>
    }
  `,
  standalone: true,
  imports: [StepComponent],
})
export class StepsComponent {
  readonly steps = input<Step[]>();
}
