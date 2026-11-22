import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';

@Component({
  selector: 'z-preview-02-observability-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, ZardBadgeComponent, ZardButtonComponent, ZardCardImports],
  viewProviders: [provideIcons({ lucidePlus })],
  host: { class: 'block' },
  template: `
    <z-card class="relative w-full max-w-md overflow-hidden pt-0">
      <div class="bg-primary absolute inset-0 z-30 aspect-video opacity-50 mix-blend-color"></div>
      <img
        src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Photo by mymind on Unsplash"
        title="Photo by mymind on Unsplash"
        class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
      />
      <z-card-header>
        <z-card-title zTitle="Observability Plus is replacing Monitoring" />
        <z-card-description
          zDescription="Switch to the improved way to explore your data, with natural language. Monitoring will no longer be available on the Pro plan in November, 2025"
        />
      </z-card-header>
      <z-card-footer>
        <button type="button" z-button>
          Create Query
          <ng-icon name="lucidePlus" data-icon="inline-end" />
        </button>
        <z-badge zType="secondary" class="ml-auto">Warning</z-badge>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview02ObservabilityCardComponent {}
