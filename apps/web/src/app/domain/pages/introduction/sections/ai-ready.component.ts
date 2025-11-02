import { Component } from '@angular/core';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';
import { ZardIcon } from '@zard/components/icon/icons';

interface AIFeatureCard {
  title: string;
  description: string;
  icon: ZardIcon;
}

@Component({
  selector: 'ai-ready-section',
  standalone: true,
  imports: [ZardBadgeComponent, ZardCardComponent, ZardIconComponent],
  template: `
    <section class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <h2 class="text-3xl font-bold tracking-tight">AI Ready</h2>
          <z-badge zType="secondary">Future Ready</z-badge>
        </div>
        <p class="text-muted-foreground text-base leading-7">
          ZardUI components are designed with AI development in mind. Clear patterns, consistent APIs, and comprehensive
          documentation make it easy for AI tools to understand and work with our components.
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        @for (card of cards; track $index) {
          <z-card [zTitle]="title">
            <ng-template #title>
              <div class="flex items-center gap-2">
                <z-icon [zType]="card.icon" class="text-lg font-normal" />
                <h3 class="text-base">{{ card.title }}</h3>
              </div>
            </ng-template>
            <p class="text-muted-foreground text-base leading-7">{{ card.description }}</p>
          </z-card>
        }
      </div>
    </section>
  `,
})
export class AIReadySection {
  readonly cards: AIFeatureCard[] = [
    {
      title: 'Predictable Patterns',
      description:
        'Consistent naming conventions, standardized props, and logical component hierarchies that AI can easily understand and generate code for.',
      icon: 'sun',
    },
    {
      title: 'Rich Documentation',
      description:
        'Comprehensive examples, clear API references, and usage patterns that provide AI tools with the context they need to generate accurate code.',
      icon: 'book-open-text',
    },
  ];
}
