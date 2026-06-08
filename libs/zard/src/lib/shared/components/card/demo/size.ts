import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardImports } from '@/shared/components/card/card.imports';

@Component({
  selector: 'z-demo-card-small',
  imports: [ZardCardImports, ZardButtonComponent],
  template: `
    <z-card zSize="sm" class="mx-auto w-full max-w-sm">
      <z-card-header>
        <z-card-title zTitle="Small Card" />
        <z-card-description zDescription="This card uses the small size variant." />
      </z-card-header>
      <z-card-content>
        <p>
          The card component supports a zSize input that can be set to &quot;sm&quot; for a more compact appearance.
        </p>
      </z-card-content>
      <z-card-footer>
        <z-button zType="outline" zSize="sm" class="w-full">Action</z-button>
      </z-card-footer>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCardSmallComponent {}
