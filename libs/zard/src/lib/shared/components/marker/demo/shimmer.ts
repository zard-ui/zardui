import { Component } from '@angular/core';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';

@Component({
  selector: 'z-demo-marker-shimmer',
  imports: [...ZardMarkerImports],
  template: `
    <div class="flex w-full max-w-sm min-w-sm flex-col gap-8">
      <z-marker role="status">
        <z-marker-content class="shimmer">Thinking...</z-marker-content>
      </z-marker>

      <z-marker zVariant="separator" role="status">
        <z-marker-content class="shimmer">Reading 4 files</z-marker-content>
      </z-marker>
    </div>
  `,
})
export class ZardDemoMarkerShimmerComponent {}
