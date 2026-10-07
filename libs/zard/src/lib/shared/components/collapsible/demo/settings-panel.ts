import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMaximize, lucideMinimize } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-collapsible-settings-panel',
  imports: [ZardCollapsibleImports, ZardCardImports, ZardFieldImports, ZardButtonComponent, ZardInputComponent, NgIcon],
  template: `
    <z-card zSize="sm" class="mx-auto w-full min-w-xs">
      <z-card-header>
        <z-card-title zTitle="Radius" />
        <z-card-description zDescription="Set the corner radius of the element." />
      </z-card-header>
      <z-card-content>
        <z-collapsible class="flex items-start gap-2" [zOpen]="isOpen()" (zOpenChange)="isOpen.set($event)">
          <div z-field-group class="grid w-full grid-cols-2 gap-2">
            <div z-field>
              <label z-field-label for="radius-top-left" class="sr-only">Radius top left</label>
              <input z-input id="radius-top-left" placeholder="0" value="0" />
            </div>
            <div z-field>
              <label z-field-label for="radius-top-right" class="sr-only">Radius top right</label>
              <input z-input id="radius-top-right" placeholder="0" value="0" />
            </div>
            <z-collapsible-content class="col-span-full">
              <div class="grid grid-cols-2 gap-2">
                <div z-field>
                  <label z-field-label for="radius-bottom-left" class="sr-only">Radius bottom left</label>
                  <input z-input id="radius-bottom-left" placeholder="0" value="0" />
                </div>
                <div z-field>
                  <label z-field-label for="radius-bottom-right" class="sr-only">Radius bottom right</label>
                  <input z-input id="radius-bottom-right" placeholder="0" value="0" />
                </div>
              </div>
            </z-collapsible-content>
          </div>
          <button z-button z-collapsible-trigger zType="outline" zSize="icon" aria-label="Toggle all corners">
            <ng-icon [name]="isOpen() ? 'lucideMinimize' : 'lucideMaximize'" />
          </button>
        </z-collapsible>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideMaximize, lucideMinimize })],
})
export class ZardDemoCollapsibleSettingsPanelComponent {
  protected readonly isOpen = signal(false);
}
