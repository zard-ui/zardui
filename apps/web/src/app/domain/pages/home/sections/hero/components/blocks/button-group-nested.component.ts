import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupComponent } from '@zard/components/button-group/button-group.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';

@Component({
  selector: 'z-block-button-group-nested',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardButtonComponent, ZardButtonGroupComponent, ZardIconComponent],
  template: `
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
  `,
})
export class BlockButtonGroupNestedComponent {}
