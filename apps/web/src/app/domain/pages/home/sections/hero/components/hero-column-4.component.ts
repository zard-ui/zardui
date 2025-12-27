import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupComponent } from '@zard/components/button-group/button-group.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardEmptyComponent } from '@zard/components/empty/empty.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardInputGroupComponent } from '@zard/components/input-group/input-group.component';

@Component({
  selector: 'z-hero-column-4',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardButtonComponent,
    ZardButtonGroupComponent,
    ZardInputGroupComponent,
    ZardInputDirective,
    ZardCheckboxComponent,
    ZardEmptyComponent,
    ZardIconComponent,
    ZardCardComponent,
  ],
  template: `
    <div class="order-first flex flex-col gap-6 lg:hidden xl:order-last xl:flex *:[div]:w-full *:[div]:max-w-full">
      <!-- Notion-style Prompt Input -->
      <form class="[--radius:1.2rem]">
        <div class="flex w-full flex-col gap-3">
          <label class="sr-only" for="notion-prompt">Prompt</label>
          <z-input-group [zAddonBefore]="addonBeforeTpl" [zAddonAfter]="addonAfterTpl" zAddonAlign="block">
            <textarea
              z-input
              id="notion-prompt"
              placeholder="Ask, search, or make anything..."
              class="field-sizing-content min-h-16 resize-none"
            ></textarea>
          </z-input-group>

          <ng-template #addonBeforeTpl>
            <button z-button zType="outline" zSize="sm" zShape="circle" class="h-8!">
              <z-icon zType="user-plus" />
              Add context
            </button>
          </ng-template>

          <ng-template #addonAfterTpl>
            <div class="flex w-full items-center gap-1">
              <button z-button zType="ghost" zSize="sm" zShape="circle" aria-label="Attach file">
                <z-icon zType="file" />
              </button>
              <button z-button zType="ghost" zSize="sm" zShape="circle">Auto</button>
              <button z-button zType="ghost" zSize="sm" zShape="circle">
                <z-icon zType="search" />
                All Sources
              </button>
              <button z-button zSize="sm" zShape="circle" class="ml-auto size-8!" aria-label="Send">
                <z-icon zType="arrow-up" />
              </button>
            </div>
          </ng-template>
        </div>
      </form>

      <!-- First Button Group Row -->
      <z-button-group>
        <z-button-group class="hidden sm:flex">
          <button z-button zType="outline" zSize="sm" class="size-8!" aria-label="Go Back">
            <z-icon zType="arrow-left" />
          </button>
        </z-button-group>
        <z-button-group>
          <button z-button zType="outline" zSize="sm">Archive</button>
          <button z-button zType="outline" zSize="sm">Report</button>
        </z-button-group>
        <z-button-group>
          <button z-button zType="outline" zSize="sm">Snooze</button>
          <button z-button zType="outline" zSize="sm" class="size-8!" aria-label="More Options">
            <z-icon zType="ellipsis" />
          </button>
        </z-button-group>
      </z-button-group>

      <!-- Checkbox Terms -->
      <z-checkbox>I agree to the terms and conditions</z-checkbox>

      <!-- Second Button Group Row -->
      <div class="flex justify-between gap-4">
        <z-button-group>
          <z-button-group>
            <button z-button zType="outline" zSize="sm">1</button>
            <button z-button zType="outline" zSize="sm">2</button>
            <button z-button zType="outline" zSize="sm">3</button>
          </z-button-group>
          <z-button-group>
            <button z-button zType="outline" zSize="sm" class="size-8!" aria-label="Previous">
              <z-icon zType="arrow-left" />
            </button>
            <button z-button zType="outline" zSize="sm" class="size-8!" aria-label="Next">
              <z-icon zType="arrow-right" />
            </button>
          </z-button-group>
        </z-button-group>
        <z-button-group>
          <button z-button zType="outline" zSize="sm">
            <z-icon zType="sparkles" />
            Copilot
          </button>
          <button z-button zType="outline" zSize="sm" class="size-8!" aria-label="Open Popover">
            <z-icon zType="chevron-down" />
          </button>
        </z-button-group>
      </div>

      <!-- Card with Checkbox Pills -->
      <z-card zTitle="How did you hear about us?">
        <p class="text-muted-foreground -mt-3 mb-4 line-clamp-1 text-sm leading-normal font-normal">
          Select the option that best describes how you heard about us.
        </p>
        <div class="flex flex-row flex-wrap gap-2 [--radius:9999rem]">
          <label
            class="has-checked:bg-primary/5 has-checked:border-primary dark:has-checked:bg-primary/10 flex w-fit cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all"
          >
            <z-checkbox class="hidden" />
            <span>Social Media</span>
          </label>
          <label
            class="has-checked:bg-primary/5 has-checked:border-primary dark:has-checked:bg-primary/10 flex w-fit cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all"
          >
            <z-checkbox class="hidden" />
            <span>Search Engine</span>
          </label>
          <label
            class="has-checked:bg-primary/5 has-checked:border-primary dark:has-checked:bg-primary/10 flex w-fit cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all"
          >
            <z-checkbox class="hidden" />
            <span>Referral</span>
          </label>
          <label
            class="has-checked:bg-primary/5 has-checked:border-primary dark:has-checked:bg-primary/10 flex w-fit cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all"
          >
            <z-checkbox class="hidden" />
            <span>Other</span>
          </label>
        </div>
      </z-card>

      <!-- Empty State -->
      <z-empty
        zTitle="Processing your request"
        zDescription="Please wait while we process your request. Do not refresh the page."
        class="border border-dashed"
      >
        <ng-template #zImage>
          <div class="bg-muted text-foreground mb-2 flex size-10 shrink-0 items-center justify-center rounded-lg">
            <z-icon zType="loader-circle" class="size-4 animate-spin" />
          </div>
        </ng-template>
        <button z-button zType="outline" zSize="sm" class="mt-4">Cancel</button>
      </z-empty>
    </div>
  `,
})
export class HeroColumn4Component {}
