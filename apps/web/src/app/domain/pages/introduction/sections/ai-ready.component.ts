import { ZardBadgeComponent, ZardCardComponent } from '@zard/components/components';
import { Component } from '@angular/core';

interface AIFeatureCard {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'ai-ready-section',
  standalone: true,
  imports: [ZardBadgeComponent, ZardCardComponent],
  template: `
    <section class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <h2 class="text-3xl font-bold tracking-tight">AI Ready</h2>
          <z-badge zType="secondary">Future Ready</z-badge>
        </div>
        <p class="text-base leading-7 text-muted-foreground">
          ZardUI components are designed with AI development in mind. Clear patterns, consistent APIs, and comprehensive documentation make it easy for AI tools to understand and
          work with our components.
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        @for (card of cards; track $index) {
          <z-card [zTitle]="title">
            <ng-template #title>
              <div class="flex items-center gap-2">
                <i class="text-lg font-normal" [class]="card.icon"></i>
                <h3 class="text-base">{{ card.title }}</h3>
              </div>
            </ng-template>
            <p class="text-base leading-7 text-muted-foreground">{{ card.description }}</p>
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
      description: 'Consistent naming conventions, standardized props, and logical component hierarchies that AI can easily understand and generate code for.',
      icon: 'icon-sun',
    },
    {
      title: 'Rich Documentation',
      description: 'Comprehensive examples, clear API references, and usage patterns that provide AI tools with the context they need to generate accurate code.',
      icon: 'icon-book-open-text',
    },
  ];
}
