import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardImports } from '@/shared/components/card/card.imports';

@Component({
  selector: 'z-demo-card-size',
  imports: [ZardCardImports, ZardButtonComponent],
  template: `
    <div class="grid w-full gap-6 sm:grid-cols-2">
      <z-card class="mx-auto w-full max-w-sm">
        <z-card-header>
          <z-card-title zTitle="Default size" />
          <z-card-description zDescription="The default zSize uses the standard gap and padding scale." />
        </z-card-header>
        <z-card-content>
          <p class="text-muted-foreground text-sm">This is the card at its normal spacing.</p>
        </z-card-content>
        <z-card-footer>
          <z-button zType="outline" class="w-full">Action</z-button>
        </z-card-footer>
      </z-card>

      <z-card zSize="sm" class="mx-auto w-full max-w-sm">
        <z-card-header>
          <z-card-title zTitle="Small size" />
          <z-card-description zDescription="The sm size tightens the gap and padding for a more compact card." />
        </z-card-header>
        <z-card-content>
          <p class="text-muted-foreground text-sm">Useful when several cards sit in a dense layout.</p>
        </z-card-content>
        <z-card-footer>
          <z-button zType="outline" zSize="sm" class="w-full">Action</z-button>
        </z-card-footer>
      </z-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCardSizeComponent {}
