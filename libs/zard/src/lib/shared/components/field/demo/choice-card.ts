import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioComponent } from '@/shared/components/radio/radio.component';

@Component({
  selector: 'z-demo-field-choice-card',
  imports: [...ZardFieldImports, ZardRadioComponent, FormsModule],
  template: `
    <div class="w-full min-w-xs">
      <div z-field-group>
        <fieldset z-field-set>
          <legend z-field-legend zVariant="label">Compute Environment</legend>
          <p z-field-description>Select the compute environment for your cluster.</p>

          <div z-field-group class="gap-3">
            <label z-field-label for="env-kubernetes">
              <div z-field zOrientation="horizontal">
                <div z-field-content>
                  <div z-field-title>Kubernetes</div>
                  <p z-field-description>Run GPU workloads on a K8s cluster.</p>
                </div>
                <span z-radio zId="env-kubernetes" name="env" [(ngModel)]="env" value="kubernetes"></span>
              </div>
            </label>

            <label z-field-label for="env-vm">
              <div z-field zOrientation="horizontal">
                <div z-field-content>
                  <div z-field-title>Virtual Machine</div>
                  <p z-field-description>Access a cluster to run GPU workloads.</p>
                </div>
                <span z-radio zId="env-vm" name="env" [(ngModel)]="env" value="vm"></span>
              </div>
            </label>
          </div>
        </fieldset>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldChoiceCardComponent {
  protected env = 'kubernetes';
}
