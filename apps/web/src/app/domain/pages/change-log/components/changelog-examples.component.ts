import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StepsComponent } from '@doc/domain/components/steps/steps.component';
import { Step } from '@doc/shared/constants/install.constant';
import { ZardCodeBoxComponent } from '@doc/widget/components/zard-code-box/zard-code-box.component';

import { type ChangelogExample } from '../entries/changelog-entry.interface';

/**
 * Renders the components a month shipped: the install command plus a live demo.
 * Deliberately a separate component — it holds everything heavy on the page, so
 * the changelog defers it per month instead of mounting all of them at once.
 */
@Component({
  selector: 'z-changelog-examples',
  imports: [StepsComponent, ZardCodeBoxComponent],
  template: `
    <section class="mb-8">
      <h3 class="mb-4 text-xl font-semibold">New Components</h3>

      @for (item of items(); track item.example.componentName) {
        <div class="mb-8">
          <h4 class="mb-3 text-lg font-medium capitalize">{{ item.example.componentName }}</h4>

          <!-- CLI Installation -->
          <div class="mb-6">
            <z-steps [steps]="item.steps"></z-steps>
          </div>

          <!-- Component Example -->
          <z-code-box
            [demoDescription]="item.example.description"
            [codeData]="item.example.codeData"
            [dynamicComponent]="item.example.component"
          ></z-code-box>
        </div>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangelogExamplesComponent {
  readonly examples = input.required<ChangelogExample[]>();

  /** Pairs each example with its install steps once, keeping the `z-steps` input stable. */
  readonly items = computed(() => this.examples().map(example => ({ example, steps: buildInstallSteps(example) })));
}

function buildInstallSteps(example: ChangelogExample): Step[] {
  return [
    {
      title: 'Run the CLI',
      subtitle: `Use the CLI to add ${example.componentName} to your project.`,
      codeTabData: example.cliAdd,
    },
  ];
}
