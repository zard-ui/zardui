import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardDrawerImports, type ZardDrawerPlacement } from '@zard/components/drawer';

import { ExampleImports } from './example.component';

const DRAWER_SIDES = ['top', 'right', 'bottom', 'left'] as const satisfies readonly ZardDrawerPlacement[];

const PARAGRAPHS = Array.from(
  { length: 10 },
  () =>
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
);

/** shadcn/ui's `drawer-example`, in zard. */
@Component({
  selector: 'z-drawer-example',
  imports: [NgTemplateOutlet, ExampleImports, ZardButtonComponent, ZardDrawerImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Scrollable Content">
        <button type="button" z-button zType="outline" (click)="scrollableOpen.set(true)">Scrollable Content</button>
        <z-drawer [(zVisible)]="scrollableOpen" zPlacement="right">
          <z-drawer-header>
            <z-drawer-title>Move Goal</z-drawer-title>
            <z-drawer-description>Set your daily activity goal.</z-drawer-description>
          </z-drawer-header>
          <ng-container [ngTemplateOutlet]="paragraphsTpl" />
          <z-drawer-footer>
            <button type="button" z-button>Submit</button>
            <button type="button" z-button zType="outline" z-drawer-close>Cancel</button>
          </z-drawer-footer>
        </z-drawer>
      </z-example>

      <z-example zTitle="Sides">
        <div class="flex flex-wrap gap-2">
          @for (side of sides; track side) {
            <button
              type="button"
              z-button
              zType="outline"
              class="style-sera:uppercase capitalize"
              (click)="openSide.set(side)"
            >
              {{ side }}
            </button>
            <z-drawer
              [zVisible]="openSide() === side"
              (zVisibleChange)="$event ? openSide.set(side) : openSide.set(null)"
              [zPlacement]="side"
              class="data-[placement=bottom]:max-h-[50vh] data-[placement=top]:max-h-[50vh]"
            >
              <z-drawer-header>
                <z-drawer-title>Move Goal</z-drawer-title>
                <z-drawer-description>Set your daily activity goal.</z-drawer-description>
              </z-drawer-header>
              <ng-container [ngTemplateOutlet]="paragraphsTpl" />
              <z-drawer-footer>
                <button type="button" z-button>Submit</button>
                <button type="button" z-button zType="outline" z-drawer-close>Cancel</button>
              </z-drawer-footer>
            </z-drawer>
          }
        </div>
      </z-example>
    </z-example-wrapper>

    <ng-template #paragraphsTpl>
      <div class="no-scrollbar overflow-y-auto px-4">
        @for (paragraph of paragraphs; track $index) {
          <p class="style-lyra:mb-2 style-lyra:leading-relaxed style-sera:leading-relaxed mb-4 leading-normal">
            {{ paragraph }}
          </p>
        }
      </div>
    </ng-template>
  `,
})
export class DrawerExampleComponent {
  protected readonly sides = DRAWER_SIDES;
  protected readonly paragraphs = PARAGRAPHS;
  protected readonly scrollableOpen = signal(false);
  protected readonly openSide = signal<ZardDrawerPlacement | null>(null);
}
