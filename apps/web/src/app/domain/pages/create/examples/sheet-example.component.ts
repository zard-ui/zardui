import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardFieldImports } from '@zard/components/field';
import { ZardInputComponent } from '@zard/components/input';
import { ZardSheetImports, type ZardSheetSide } from '@zard/components/sheet';

import { ExampleImports } from './example.component';

const SHEET_SIDES = ['top', 'right', 'bottom', 'left'] as const satisfies readonly ZardSheetSide[];

const PARAGRAPHS = Array.from(
  { length: 10 },
  () =>
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
);

/** shadcn/ui's `sheet-example`, in zard. */
@Component({
  selector: 'z-sheet-example',
  imports: [ExampleImports, ZardButtonComponent, ZardFieldImports, ZardInputComponent, ZardSheetImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="With Form">
        <button type="button" z-button zType="outline" (click)="formOpen.set(true)">Open</button>
        <z-sheet [(zVisible)]="formOpen">
          <z-sheet-header>
            <z-sheet-title>Edit profile</z-sheet-title>
            <z-sheet-description>Make changes to your profile here. Click save when you're done.</z-sheet-description>
          </z-sheet-header>
          <div
            class="style-vega:px-4 style-nova:px-4 style-lyra:px-4 style-maia:px-6 style-mira:px-6 style-luma:px-6 style-sera:px-8 style-rhea:px-6"
          >
            <div z-field-group>
              <div z-field>
                <label z-field-label for="sheet-demo-name">Name</label>
                <input z-input id="sheet-demo-name" value="Pedro Duarte" />
              </div>
              <div z-field>
                <label z-field-label for="sheet-demo-username">Username</label>
                <input z-input id="sheet-demo-username" value="@peduarte" />
              </div>
            </div>
          </div>
          <z-sheet-footer>
            <button type="submit" z-button>Save changes</button>
            <button type="button" z-button zType="outline" z-sheet-close>Close</button>
          </z-sheet-footer>
        </z-sheet>
      </z-example>

      <z-example zTitle="No Close Button">
        <button type="button" z-button zType="outline" (click)="noCloseOpen.set(true)">No Close Button</button>
        <z-sheet [(zVisible)]="noCloseOpen" [zClosable]="false">
          <z-sheet-header>
            <z-sheet-title>No Close Button</z-sheet-title>
            <z-sheet-description>
              This sheet doesn't have a close button in the top-right corner. You can only close it using the button
              below.
            </z-sheet-description>
          </z-sheet-header>
        </z-sheet>
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
            <z-sheet
              [zVisible]="openSide() === side"
              (zVisibleChange)="$event ? openSide.set(side) : openSide.set(null)"
              [zSide]="side"
              class="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
            >
              <z-sheet-header>
                <z-sheet-title>Edit profile</z-sheet-title>
                <z-sheet-description>
                  Make changes to your profile here. Click save when you're done.
                </z-sheet-description>
              </z-sheet-header>
              <div
                class="no-scrollbar style-vega:px-4 style-nova:px-4 style-lyra:px-4 style-maia:px-6 style-mira:px-6 style-luma:px-6 style-sera:px-8 style-rhea:px-6 overflow-y-auto"
              >
                @for (paragraph of paragraphs; track $index) {
                  <p class="style-lyra:mb-2 style-lyra:leading-relaxed style-sera:leading-relaxed mb-4 leading-normal">
                    {{ paragraph }}
                  </p>
                }
              </div>
              <z-sheet-footer>
                <button type="submit" z-button>Save changes</button>
                <button type="button" z-button zType="outline" z-sheet-close>Cancel</button>
              </z-sheet-footer>
            </z-sheet>
          }
        </div>
      </z-example>
    </z-example-wrapper>
  `,
})
export class SheetExampleComponent {
  protected readonly sides = SHEET_SIDES;
  protected readonly paragraphs = PARAGRAPHS;
  protected readonly formOpen = signal(false);
  protected readonly noCloseOpen = signal(false);
  protected readonly openSide = signal<ZardSheetSide | null>(null);
}
