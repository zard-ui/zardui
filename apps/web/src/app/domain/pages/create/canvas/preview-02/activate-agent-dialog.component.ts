import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck } from '@ng-icons/lucide';

import { ZardAlertComponent } from '@zard/components/alert/alert.component';
import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardItemImports } from '@zard/components/item/item.imports';

@Component({
  selector: 'z-preview-02-activate-agent-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, ZardAlertComponent, ZardBadgeComponent, ZardButtonComponent, ZardCardImports, ZardItemImports],
  viewProviders: [provideIcons({ lucideCircleCheck })],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Ship faster & safer with Vercel Agent" />
        <!-- prettier-ignore -->
        <ng-template #terms>
          Your use is subject to Vercel's <a href="#" (click)="$event.preventDefault()">Public Beta Agreement</a> and
          <a href="#" (click)="$event.preventDefault()">AI Product Terms</a>.
        </ng-template>
        <z-card-description [zDescription]="terms" />
      </z-card-header>
      <z-card-content class="flex flex-col gap-4">
        <div z-item-group class="gap-0">
          @for (feature of features; track feature) {
            <div z-item zSize="xs" class="px-0">
              <div z-item-media zVariant="icon" class="self-start">
                <ng-icon name="lucideCircleCheck" class="text-primary-foreground [&_svg]:fill-primary size-5" />
              </div>
              <div z-item-content>
                <div
                  z-item-title
                  class="text-muted-foreground *:[strong]:text-foreground inline leading-relaxed font-normal *:[strong]:font-medium"
                >
                  @switch (feature) {
                    @case ('code-reviews') {
                      <strong>Code reviews</strong>
                      with full codebase context to catch
                      <strong>hard-to-find</strong>
                      bugs.
                    }
                    @case ('code-suggestions') {
                      <strong>Code suggestions</strong>
                      validated in sandboxes before you merge.
                    }
                    @default {
                      <strong>Root-cause analysis</strong>
                      for production issues with deployment context.
                      <z-badge zType="secondary" class="bg-chart-1 text-chart-5">Requires Observability Plus</z-badge>
                    }
                  }
                </div>
              </div>
            </div>
          }
        </div>
        <z-alert zDescription="Pro teams get $100 in Vercel Agent trial credit for 2 weeks after activation." />
      </z-card-content>
      <z-card-footer class="justify-end gap-2">
        <button type="button" z-button zType="outline" class="style-sera:hidden">Cancel</button>
        <button type="button" z-button class="style-sera:w-full">Enable with $100 credits</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview02ActivateAgentDialogComponent {
  protected readonly features = ['code-reviews', 'code-suggestions', 'root-cause'] as const;
}
