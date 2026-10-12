import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';

const ENVS = [
  { key: 'DATABASE_URL', masked: true },
  { key: 'NEXT_PUBLIC_API', masked: false },
  { key: 'STRIPE_SECRET', masked: true },
] as const;

@Component({
  selector: 'z-preview-02-environment-variables',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardButtonComponent, ZardCardImports],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Environment Variables" />
        <z-card-description zDescription="Production · 8 variables" />
      </z-card-header>
      <z-card-content class="flex flex-col gap-2">
        @for (env of envs; track env.key) {
          <div class="ring-border flex items-center gap-2 rounded-md px-2.5 py-2 font-mono text-xs ring">
            <span class="font-medium">{{ env.key }}</span>
            <span class="text-muted-foreground ml-auto">{{ env.masked ? '••••••••' : 'https://api.example.com' }}</span>
          </div>
        }
      </z-card-content>
      <z-card-footer>
        <button type="button" z-button zType="outline">Edit</button>
        <button type="button" z-button class="ml-auto">Deploy</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview02EnvironmentVariablesComponent {
  protected readonly envs = ENVS;
}
