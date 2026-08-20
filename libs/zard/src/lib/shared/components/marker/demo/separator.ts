import { Component } from '@angular/core';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';

@Component({
  selector: 'z-demo-marker-separator',
  imports: [...ZardMarkerImports],
  template: `
    <div class="flex w-full max-w-sm min-w-sm flex-col gap-8">
      <z-marker zVariant="separator">
        <z-marker-content>Today</z-marker-content>
      </z-marker>

      <z-marker zVariant="separator">
        <z-marker-content>Worked for 42s</z-marker-content>
      </z-marker>

      <z-marker zVariant="separator">
        <z-marker-content>Conversation compacted</z-marker-content>
      </z-marker>
    </div>
  `,
})
export class ZardDemoMarkerSeparatorComponent {}
