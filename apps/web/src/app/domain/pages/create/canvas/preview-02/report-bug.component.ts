import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardSelectImports } from '@zard/components/select/select.imports';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';

@Component({
  selector: 'z-preview-02-report-bug',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardButtonComponent,
    ZardCardImports,
    ZardFieldImports,
    ZardInputComponent,
    ZardSelectImports,
    ZardTextareaComponent,
  ],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Report Bug" />
        <z-card-description zDescription="Help us fix issues faster." />
      </z-card-header>
      <z-card-content>
        <z-field-group>
          <z-field>
            <label z-field-label for="p2-bug-title">Title</label>
            <input z-input id="p2-bug-title" placeholder="Brief description of the issue" />
          </z-field>
          <div class="grid grid-cols-2 gap-3">
            <z-field>
              <z-field-label>Severity</z-field-label>
              <z-select class="w-full" zValue="medium" aria-label="Severity">
                <z-select-group>
                  <z-select-item zValue="critical">Critical</z-select-item>
                  <z-select-item zValue="high">High</z-select-item>
                  <z-select-item zValue="medium">Medium</z-select-item>
                  <z-select-item zValue="low">Low</z-select-item>
                </z-select-group>
              </z-select>
            </z-field>
            <z-field>
              <z-field-label>Component</z-field-label>
              <z-select class="w-full" zValue="dashboard" aria-label="Component">
                <z-select-group>
                  <z-select-item zValue="dashboard">Dashboard</z-select-item>
                  <z-select-item zValue="auth">Auth</z-select-item>
                  <z-select-item zValue="api">API</z-select-item>
                  <z-select-item zValue="billing">Billing</z-select-item>
                </z-select-group>
              </z-select>
            </z-field>
          </div>
          <z-field>
            <label z-field-label for="p2-bug-steps">Steps to reproduce</label>
            <textarea
              z-textarea
              id="p2-bug-steps"
              placeholder="1. Go to&#10;2. Click on&#10;3. Observe..."
              class="min-h-24 resize-none"
            ></textarea>
          </z-field>
        </z-field-group>
      </z-card-content>
      <z-card-footer>
        <z-field zOrientation="horizontal" class="style-sera:justify-center justify-end">
          <button type="button" z-button zType="outline" class="style-sera:flex-1">Attach File</button>
          <button type="button" z-button class="style-sera:flex-1">Submit Bug</button>
        </z-field>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview02ReportBugComponent {}
