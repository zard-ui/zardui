import { Component, ChangeDetectionStrategy } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideArrowRight } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupComponent } from '@zard/components/button-group/button-group.component';

@Component({
  selector: 'z-block-button-group-nested',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardButtonComponent, ZardButtonGroupComponent, NgIcon],
  viewProviders: [provideIcons({ lucideArrowLeft, lucideArrowRight })],
  template: `
    <z-button-group>
      <z-button-group>
        <button z-button zType="outline" zSize="sm">1</button>
        <button z-button zType="outline" zSize="sm">2</button>
        <button z-button zType="outline" zSize="sm">3</button>
      </z-button-group>
      <z-button-group>
        <button z-button zType="outline" zSize="icon-sm" aria-label="Previous">
          <ng-icon name="lucideArrowLeft" />
        </button>
        <button z-button zType="outline" zSize="icon-sm" aria-label="Next">
          <ng-icon name="lucideArrowRight" />
        </button>
      </z-button-group>
    </z-button-group>
  `,
})
export class BlockButtonGroupNestedComponent {}
