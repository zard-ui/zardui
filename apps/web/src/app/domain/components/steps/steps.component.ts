import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { StepComponent } from '@doc/domain/components/step/step.component';
import { Step } from '@doc/shared/constants/install.constant';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepComponent],
})
export class StepsComponent {
  readonly steps = input<Step[]>();
}
