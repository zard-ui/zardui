import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardDialogImports } from '@zard/components/dialog';
import { ZardHoverCardComponent, ZardHoverCardDirective } from '@zard/components/hover-card';

import { ExampleImports } from './example.component';

const HOVER_CARD_SIDES = ['top', 'right', 'bottom', 'left'] as const;

/** shadcn/ui's `hover-card-example`, in zard. */
@Component({
  selector: 'z-hover-card-example',
  imports: [ExampleImports, ZardButtonComponent, ZardDialogImports, ZardHoverCardComponent, ZardHoverCardDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Sides">
        <div class="flex flex-wrap items-center justify-center gap-4">
          @for (side of sides; track side) {
            <button
              type="button"
              z-button
              zType="outline"
              class="style-sera:uppercase capitalize"
              [zHoverCard]="content"
              [zPlacement]="side"
              [zOpenDelay]="100"
              [zCloseDelay]="100"
            >
              {{ side }}
            </button>
            <ng-template #content>
              <z-hover-card class="w-64">
                <div
                  class="style-vega:gap-2 style-nova:gap-1.5 style-lyra:gap-1 style-maia:gap-2 style-mira:gap-1 style-luma:gap-2 style-sera:gap-2 flex flex-col"
                >
                  <h4 class="style-sera:font-heading style-sera:font-semibold style-sera:tracking-wide font-medium">
                    Hover Card
                  </h4>
                  <p class="style-sera:leading-relaxed">
                    This hover card appears on the {{ side }} side of the trigger.
                  </p>
                </div>
              </z-hover-card>
            </ng-template>
          }
        </div>
      </z-example>

      <z-example zTitle="In Dialog">
        <button type="button" z-button zType="outline" (click)="dialogOpen.set(true)">Open Dialog</button>
        <z-dialog [(zVisible)]="dialogOpen">
          <z-dialog-header>
            <z-dialog-title>Hover Card Example</z-dialog-title>
            <z-dialog-description>Hover over the button below to see the hover card.</z-dialog-description>
          </z-dialog-header>
          <button
            type="button"
            z-button
            zType="outline"
            class="w-fit"
            [zHoverCard]="dialogContent"
            [zOpenDelay]="100"
            [zCloseDelay]="100"
          >
            Hover me
          </button>
        </z-dialog>
        <ng-template #dialogContent>
          <z-hover-card class="w-64">
            <div
              class="style-vega:gap-2 style-nova:gap-1.5 style-lyra:gap-1 style-maia:gap-2 style-mira:gap-1 style-luma:gap-2 style-sera:gap-2 flex flex-col"
            >
              <h4 class="style-sera:font-heading style-sera:font-semibold style-sera:tracking-wide font-medium">
                Hover Card
              </h4>
              <p class="style-sera:leading-relaxed">
                This hover card appears inside a dialog. Hover over the button to see it.
              </p>
            </div>
          </z-hover-card>
        </ng-template>
      </z-example>
    </z-example-wrapper>
  `,
})
export class HoverCardExampleComponent {
  protected readonly sides = HOVER_CARD_SIDES;
  protected readonly dialogOpen = signal(false);
}
