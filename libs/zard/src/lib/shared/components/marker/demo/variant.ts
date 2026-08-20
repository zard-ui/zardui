import { Component } from '@angular/core';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';

@Component({
  selector: 'z-demo-marker-variant',
  imports: [...ZardMarkerImports],
  template: `
    <div class="flex w-full max-w-sm min-w-sm flex-col gap-8">
      <z-marker>
        <z-marker-content>A default marker for inline notes.</z-marker-content>
      </z-marker>

      <z-marker zVariant="separator">
        <z-marker-content>A separator marker</z-marker-content>
      </z-marker>

      <z-marker zVariant="border">
        <z-marker-content>A border marker for row boundaries.</z-marker-content>
      </z-marker>
    </div>
  `,
})
export class ZardDemoMarkerVariantComponent {}
