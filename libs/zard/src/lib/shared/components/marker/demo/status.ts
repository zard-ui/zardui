import { Component } from '@angular/core';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';
import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-marker-status',
  imports: [ZardSpinnerComponent, ...ZardMarkerImports],
  template: `
    <div class="flex w-full max-w-sm min-w-sm flex-col gap-8">
      <z-marker role="status">
        <z-marker-icon><z-spinner /></z-marker-icon>
        <z-marker-content>Compacting conversation</z-marker-content>
      </z-marker>

      <z-marker zVariant="separator" role="status">
        <z-marker-icon><z-spinner /></z-marker-icon>
        <z-marker-content>Running tests</z-marker-content>
      </z-marker>
    </div>
  `,
})
export class ZardDemoMarkerStatusComponent {}
