import { Component, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMinus, lucidePlus } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupComponent } from '@zard/components/button-group/button-group.component';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardRadioGroupImports } from '@zard/components/radio-group/radio-group.imports';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';

@Component({
  selector: 'z-block-appearance-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardButtonComponent,
    ZardButtonGroupComponent,
    ZardInputComponent,
    ZardSeparatorComponent,
    ZardSwitchComponent,
    ...ZardFieldImports,
    ...ZardRadioGroupImports,
    NgIcon,
    FormsModule,
  ],
  viewProviders: [provideIcons({ lucideMinus, lucidePlus })],
  template: `
    <div class="flex flex-1 flex-col gap-6">
      <div class="flex w-full flex-1 flex-col gap-7">
        <fieldset z-field-set>
          <legend z-field-legend>Compute Environment</legend>
          <p z-field-description>Select the compute environment for your cluster.</p>

          <z-radio-group name="compute-env" [(ngModel)]="computeEnv">
            <label z-field-label for="compute-env-kubernetes">
              <div z-field zOrientation="horizontal">
                <div z-field-content>
                  <div z-field-title>Kubernetes</div>
                  <p z-field-description>Run GPU workloads on a K8s configured cluster. This is the default.</p>
                </div>
                <z-radio zId="compute-env-kubernetes" value="kubernetes" />
              </div>
            </label>
            <label z-field-label for="compute-env-vm">
              <div z-field zOrientation="horizontal">
                <div z-field-content>
                  <div z-field-title>Virtual Machine</div>
                  <p z-field-description>Access a VM configured cluster to run workloads. (Coming soon)</p>
                </div>
                <z-radio zId="compute-env-vm" value="vm" />
              </div>
            </label>
          </z-radio-group>
        </fieldset>

        <z-separator class="-my-2" />

        <div z-field zOrientation="horizontal">
          <div z-field-content>
            <label z-field-label for="number-of-gpus">Number of GPUs</label>
            <p z-field-description>You can add more later.</p>
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

        <z-separator class="-my-2" />

        <div z-field zOrientation="horizontal">
          <div z-field-content>
            <label z-field-label for="tinting">Wallpaper Tinting</label>
            <p z-field-description>Allow the wallpaper to be tinted.</p>
          </div>
          <z-switch zId="tinting" />
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
