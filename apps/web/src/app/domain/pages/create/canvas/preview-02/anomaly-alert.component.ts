import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardEmptyComponent } from '@zard/components/empty/empty.component';

@Component({
  selector: 'z-preview-02-anomaly-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardButtonComponent, ZardCardImports, ZardEmptyComponent],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-content>
        <z-empty
          class="h-48"
          zTitle="Get alerted for anomalies"
          zDescription="Automatically monitor your projects for anomalies and get notified."
          [zActions]="[upgrade]"
        />
        <ng-template #upgrade>
          <button type="button" z-button>Upgrade to Observability Plus</button>
        </ng-template>
      </z-card-content>
    </z-card>
  `,
})
export class Preview02AnomalyAlertComponent {}
