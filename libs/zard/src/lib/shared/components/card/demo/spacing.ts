import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardImports } from '@/shared/components/card/card.imports';

@Component({
  selector: 'z-demo-card-spacing',
  imports: [ZardCardImports, ZardButtonComponent],
  template: `
    <div class="grid w-full gap-6 sm:grid-cols-2">
      <z-card class="mx-auto w-full max-w-sm">
        <z-card-header>
          <z-card-title zTitle="Default spacing" />
          <z-card-description zDescription="Header, content and footer share the built-in gap and padding." />
        </z-card-header>
        <z-card-content>
          <p class="text-muted-foreground text-sm">No overrides applied on this card.</p>
        </z-card-content>
        <z-card-footer>
          <z-button zType="outline" class="w-full">Action</z-button>
        </z-card-footer>
      </z-card>

      <z-card class="mx-auto w-full max-w-sm gap-6 py-6">
        <z-card-header class="px-6">
          <z-card-title zTitle="Custom spacing" />
          <z-card-description zDescription="The root and each section pass a wider class override." />
        </z-card-header>
        <z-card-content class="px-6">
          <p class="text-muted-foreground text-sm">Root uses gap-6 py-6; header, content and footer use px-6.</p>
        </z-card-content>
        <z-card-footer class="px-6">
          <z-button zType="outline" class="w-full">Action</z-button>
        </z-card-footer>
      </z-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCardSpacingComponent {}
