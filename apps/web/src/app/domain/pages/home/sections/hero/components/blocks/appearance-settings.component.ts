import { Component, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMinus, lucidePlus } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupComponent } from '@zard/components/button-group/button-group.component';
import { ZardDividerComponent } from '@zard/components/divider/divider.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardRadioGroupImports } from '@zard/components/radio-group/radio-group.imports';
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
    ...ZardRadioGroupImports,
    NgIcon,
    FormsModule,
  ],
  viewProviders: [provideIcons({ lucideMinus, lucidePlus })],
  template: `
    <div class="flex flex-1 flex-col gap-6">
      <div class="flex w-full flex-1 flex-col gap-7">
        <fieldset class="flex flex-col gap-6">
          <legend class="mb-3 text-base font-medium">Compute Environment</legend>
          <p class="text-muted-foreground -mt-1.5 text-sm leading-normal font-normal">
            Select the compute environment for your cluster.
          </p>

          <z-radio-group class="gap-3" name="compute-env" [(ngModel)]="computeEnv">
            <label
              class="has-data-checked:bg-primary/5 has-data-checked:border-primary dark:has-data-checked:bg-primary/10 flex w-full cursor-pointer items-center gap-3 rounded-md border p-4"
            >
              <div class="flex flex-1 flex-col gap-1.5 leading-snug">
                <div class="text-sm font-medium">Kubernetes</div>
                <p class="text-muted-foreground text-sm leading-normal font-normal">
                  Run GPU workloads on a K8s configured cluster. This is the default.
                </p>
              </div>
              <z-radio value="kubernetes" />
            </label>

            <label
              class="has-data-checked:bg-primary/5 has-data-checked:border-primary dark:has-data-checked:bg-primary/10 flex w-full cursor-pointer items-center gap-3 rounded-md border p-4"
            >
              <div class="flex flex-1 flex-col gap-1.5 leading-snug">
                <div class="text-sm font-medium">Virtual Machine</div>
                <p class="text-muted-foreground text-sm leading-normal font-normal">
                  Access a VM configured cluster to run workloads. (Coming soon)
                </p>
              </div>
              <z-radio value="vm" />
            </label>
          </z-radio-group>
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
              class="dark:bg-input/30 h-7! w-14! text-center font-mono dark:*:bg-transparent!"
              size="3"
              maxlength="3"
              [value]="gpuCount().toString()"
              readonly
            />
            <button
              z-button
              type="button"
              zType="outline"
              zSize="icon-sm"
              aria-label="Decrement"
              [disabled]="isAtMin()"
              (click)="decrementGpu()"
            >
              <ng-icon name="lucideMinus" />
            </button>
            <button
              z-button
              type="button"
              zType="outline"
              zSize="icon-sm"
              aria-label="Increment"
              [disabled]="isAtMax()"
              (click)="incrementGpu()"
            >
              <ng-icon name="lucidePlus" />
            </button>
          </z-button-group>
        </div>

        <z-divider class="-my-2" />

        <div class="flex w-full flex-row items-center gap-3">
          <div class="flex flex-1 flex-col gap-1.5 leading-snug">
            <label class="text-sm font-medium" for="tinting">Wallpaper Tinting</label>
            <p class="text-muted-foreground text-sm leading-normal font-normal">Allow the wallpaper to be tinted.</p>
          </div>
          <z-switch zSize="sm" zId="tinting" />
        </div>
      </div>
    </div>
  `,
})
export class BlockAppearanceSettingsComponent {
  readonly computeEnv = signal('kubernetes');
  readonly gpuCount = signal(8);
  private static readonly MIN_GPU_COUNT = 0;
  private static readonly MAX_GPU_COUNT = 999;
  readonly isAtMin = computed(() => this.gpuCount() <= BlockAppearanceSettingsComponent.MIN_GPU_COUNT);
  readonly isAtMax = computed(() => this.gpuCount() >= BlockAppearanceSettingsComponent.MAX_GPU_COUNT);

  incrementGpu(): void {
    this.gpuCount.update(value => Math.min(BlockAppearanceSettingsComponent.MAX_GPU_COUNT, value + 1));
  }

  decrementGpu(): void {
    this.gpuCount.update(value => Math.max(BlockAppearanceSettingsComponent.MIN_GPU_COUNT, value - 1));
  }
}
