import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupComponent } from '@zard/components/button-group/button-group.component';
import { ZardDividerComponent } from '@zard/components/divider/divider.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardInputGroupComponent } from '@zard/components/input-group/input-group.component';
import { ZardRadioComponent } from '@zard/components/radio/radio.component';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';

@Component({
  selector: 'z-hero-column-3',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardButtonComponent,
    ZardButtonGroupComponent,
    ZardInputGroupComponent,
    ZardInputDirective,
    ZardDividerComponent,
    ZardSwitchComponent,
    ZardRadioComponent,
    ZardIconComponent,
    FormsModule,
  ],
  template: `
    <div class="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
      <div class="grid w-full max-w-sm gap-6">
        <z-input-group
          [zAddonBefore]="addonBeforeTpl"
          [zAddonAfter]="addonAfterTpl"
          class="dark:bg-input/30 rounded-full dark:*:bg-transparent!"
        >
          <input z-input id="input-secure-19" placeholder="example.com" />
        </z-input-group>

        <ng-template #addonBeforeTpl>
          <div class="flex items-center gap-1">
            <button z-button zType="secondary" zSize="sm" class="rounded-full data-icon-only:size-6" aria-label="Info">
              <z-icon zType="info" />
            </button>
            <span class="text-muted-foreground text-sm">https://</span>
          </div>
        </ng-template>

        <ng-template #addonAfterTpl>
          <button z-button zType="ghost" zSize="sm" class="rounded-full data-icon-only:size-6" aria-label="Favorite">
            <z-icon zType="star" />
          </button>
        </ng-template>
      </div>

      <div class="flex w-full max-w-md flex-col gap-6">
        <div
          class="border-border focus-visible:border-ring focus-visible:ring-ring/50 flex flex-wrap items-center gap-4 rounded-md border p-4 text-sm transition-colors duration-100 outline-none focus-visible:ring-[3px]"
        >
          <div class="flex flex-1 flex-col gap-1">
            <div class="flex w-fit items-center gap-2 text-sm leading-snug font-medium">Two-factor authentication</div>
            <p
              class="text-muted-foreground line-clamp-2 text-sm leading-normal font-normal text-pretty xl:hidden 2xl:block"
            >
              Verify via email or phone number.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button z-button zSize="sm">Enable</button>
          </div>
        </div>

        <a
          href="#"
          class="border-border hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 flex flex-wrap items-center gap-2.5 rounded-md border px-4 py-3 text-sm transition-colors duration-100 outline-none focus-visible:ring-[3px]"
        >
          <div class="flex shrink-0 items-center justify-center gap-2 bg-transparent">
            <z-icon zType="badge-check" class="size-5" />
          </div>
          <div class="flex flex-1 flex-col gap-1">
            <div class="flex w-fit items-center gap-2 text-sm leading-snug font-medium">
              Your profile has been verified.
            </div>
          </div>
          <div class="flex items-center gap-2">
            <z-icon zType="chevron-right" class="size-4" />
          </div>
        </a>
      </div>

      <div class="relative my-4 h-5 text-sm">
        <z-divider class="absolute inset-0 -top-1.25" />
        <span class="bg-background text-muted-foreground relative mx-auto block w-fit px-2">Appearance Settings</span>
      </div>

      <fieldset class="flex flex-col gap-6">
        <div class="flex w-full flex-col gap-7">
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
    </div>
  `,
})
export class HeroColumn3Component {
  readonly computeEnv = signal('kubernetes');
  readonly gpuCount = signal(8);

  incrementGpu(): void {
    this.gpuCount.update(value => value + 1);
  }

  decrementGpu(): void {
    this.gpuCount.update(value => Math.max(0, value - 1));
  }
}
