import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardNativeSelectDirective } from '@zard/components/native-select/native-select.directive';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';

const TOPICS = [
  { value: '', label: 'Select a topic' },
  { value: 'ai', label: 'AI' },
  { value: 'accounts-and-access-controls', label: 'Accounts and Access Controls' },
  { value: 'billing', label: 'Billing' },
  { value: 'cdn', label: 'CDN (Firewall, Caching)' },
  { value: 'ci-cd', label: 'CI/CD (Builds, Deployments, Environment Variables)' },
  { value: 'dashboard-interface', label: 'Dashboard Interface (Navigation, UI Issues)' },
  { value: 'domains', label: 'Domains' },
  { value: 'frameworks', label: 'Frameworks' },
  { value: 'marketplace-and-integrations', label: 'Marketplace and Integrations' },
  { value: 'observability', label: 'Observability (Observability, Logs, Monitoring)' },
  { value: 'storage', label: 'Storage' },
] as const;

@Component({
  selector: 'z-preview-02-feedback-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardNativeSelectDirective, ZardTextareaComponent],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-content>
        <form id="p2-feedback-form" (submit)="$event.preventDefault()">
          <z-field-group>
            <z-field>
              <label z-field-label for="p2-topic">Topic</label>
              <select z-native-select id="p2-topic">
                @for (topic of topics; track topic.value) {
                  <option [value]="topic.value">{{ topic.label }}</option>
                }
              </select>
            </z-field>
            <z-field>
              <label z-field-label for="p2-feedback">Feedback</label>
              <textarea z-textarea id="p2-feedback" placeholder="Your feedback helps us improve..."></textarea>
            </z-field>
          </z-field-group>
        </form>
      </z-card-content>
      <z-card-footer>
        <button type="submit" form="p2-feedback-form" z-button class="style-sera:w-full">Submit</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview02FeedbackFormComponent {
  protected readonly topics = TOPICS;
}
