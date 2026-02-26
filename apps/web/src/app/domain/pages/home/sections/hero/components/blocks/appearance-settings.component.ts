import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupComponent } from '@zard/components/button-group/button-group.component';
import { ZardDividerComponent } from '@zard/components/divider/divider.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardRadioComponent } from '@zard/components/radio/radio.component';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';

@Component({
  selector: 'z-block-appearance-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardButtonComponent,
    ZardButtonGroupComponent,
    ZardInputDirective,
    ZardDividerComponent,
    ZardSwitchComponent,
    ZardRadioComponent,
    ZardIconComponent,
    FormsModule,
  ],
  template: `
    <fieldset class="flex flex-1 flex-col gap-6">
      <div class="flex w-full flex-1 flex-col gap-7">
        <fieldset class="flex flex-col gap-6">
          <legend class="mb-3 text-base font-medium">Compute Environment</legend>
          <p class="text-muted-foreground -mt-1.5 text-sm leading-normal font-normal">
            Select the compute environment for your cluster.
          </p>

          <div class="grid gap-3">
            <label
              class="has-checked:bg-primary/5 has-checked:border-primary dark:has-checked:bg-primary/10 flex w-full cursor-pointer items-center gap-3 rounded-md border p-4"
            >
              <div class="flex flex-1 flex-col gap-1.5 leading-snug">
                <div class="text-sm font-medium">Kubernetes</div>
                <p class="text-muted-foreground text-sm leading-normal font-normal">
                  Run GPU workloads on a K8s configured cluster. This is the default.
                </p>
              </div>
              <z-radio name="compute-env" [value]="'kubernetes'" [(ngModel)]="computeEnv" />
            </label>

            <label
              class="has-checked:bg-primary/5 has-checked:border-primary dark:has-checked:bg-primary/10 flex w-full cursor-pointer items-center gap-3 rounded-md border p-4"
            >
              <div class="flex flex-1 flex-col gap-1.5 leading-snug">
                <div class="text-sm font-medium">Virtual Machine</div>
                <p class="text-muted-foreground text-sm leading-normal font-normal">
                  Access a VM configured cluster to run workloads. (Coming soon)
                </p>
              </div>
              <z-radio name="compute-env" [value]="'vm'" [(ngModel)]="computeEnv" />
            </label>
          </div>
        </fieldset>

        <z-divider class="-my-2" />

        <div class="flex w-full flex-row items-center gap-3">
          <div class="flex flex-1 flex-col gap-1.5 leading-snug">
            <label class="text-sm font-medium" for="number-of-gpus">Number of GPUs</label>
            <p class="text-muted-foreground text-sm leading-normal font-normal">You can add more later.</p>
          </div>
          <z-button-group>
            <input
              z-input
              id="number-of-gpus"
              class="dark:bg-input/30 h-8! w-14! font-mono dark:*:bg-transparent!"
              size="3"
              maxlength="3"
              [value]="gpuCount().toString()"
              readonly
            />
            <button
              z-button
              type="button"
              zType="outline"
              zSize="sm"
              class="size-8!"
              aria-label="Decrement"
              (click)="decrementGpu()"
            >
              <z-icon zType="minus" />
            </button>
            <button
              z-button
              type="button"
              zType="outline"
              zSize="sm"
              class="size-8!"
              aria-label="Increment"
              (click)="incrementGpu()"
            >
              <z-icon zType="plus" />
            </button>
          </z-button-group>
        </div>

        <z-divider class="-my-2" />

        <div class="flex w-full flex-row items-center gap-3">
          <div class="flex flex-1 flex-col gap-1.5 leading-snug">
            <label class="text-sm font-medium" for="tinting">Wallpaper Tinting</label>
            <p class="text-muted-foreground text-sm leading-normal font-normal">Allow the wallpaper to be tinted.</p>
          </div>
          <z-switch zId="tinting" />
        </div>
      </div>
    </fieldset>
  `,
})
export class BlockAppearanceSettingsComponent {
  readonly computeEnv = signal('kubernetes');
  readonly gpuCount = signal(8);

  incrementGpu(): void {
    this.gpuCount.update(value => value + 1);
  }

  decrementGpu(): void {
    this.gpuCount.update(value => Math.max(0, value - 1));
  }
}
