import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardItemImports } from '@zard/components/item/item.imports';

@Component({
  selector: 'z-block-item-two-factor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardButtonComponent, ...ZardItemImports],
  template: `
    <z-item zVariant="outline">
      <z-item-content>
        <z-item-title>Two-factor authentication</z-item-title>
        <z-item-description>Verify via email or phone number.</z-item-description>
      </z-item-content>
      <z-item-actions>
        <button type="button" z-button zSize="sm">Enable</button>
      </z-item-actions>
    </z-item>
  `,
})
export class BlockItemTwoFactorComponent {}
