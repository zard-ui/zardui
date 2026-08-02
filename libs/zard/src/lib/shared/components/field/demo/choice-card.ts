import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-field-choice-card',
  imports: [...ZardFieldImports, ...ZardRadioGroupImports, FormsModule],
  template: `
    <div class="w-full min-w-xs">
      <div z-field-group>
        <fieldset z-field-set>
          <legend z-field-legend zVariant="label">Compute Environment</legend>
          <p z-field-description>Select the compute environment for your cluster.</p>

          <z-radio-group class="gap-3" [(ngModel)]="env">
            <label z-field-label for="env-kubernetes">
              <div z-field zOrientation="horizontal">
                <div z-field-content>
                  <div z-field-title>Kubernetes</div>
                  <p z-field-description>Run GPU workloads on a K8s cluster.</p>
                </div>
                <z-radio zId="env-kubernetes" value="kubernetes" />
              </div>
            </label>

            <label z-field-label for="env-vm">
              <div z-field zOrientation="horizontal">
                <div z-field-content>
                  <div z-field-title>Virtual Machine</div>
                  <p z-field-description>Access a cluster to run GPU workloads.</p>
                </div>
                <z-radio zId="env-vm" value="vm" />
              </div>
            </label>
          </z-radio-group>
        </fieldset>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldChoiceCardComponent {
  protected env = 'kubernetes';
}
