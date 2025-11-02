import { Component } from '@angular/core';

import { ZardCardComponent } from '@zard/components/card/card.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';
import { ZardIcon } from '@zard/components/icon/icons';

interface FeatureCard {
  title: string;
  description: string;
  icon: ZardIcon;
}

@Component({
  selector: 'why-zardui-section',
  standalone: true,
  imports: [ZardCardComponent, ZardIconComponent],
  template: `
    <section class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <h2 class="text-3xl font-bold tracking-tight">Why ZardUI?</h2>
        <p class="text-muted-foreground text-base leading-7">
          Finally, a component library that doesn't force you to choose between beauty and functionality.
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        @for (card of cards; track $index) {
          <z-card [zTitle]="title">
            <ng-template #title>
              <div class="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg text-lg">
                <z-icon [zType]="card.icon" class="text-primary" />
              </div>
            </ng-template>
            <h3 class="mt-4 text-lg font-semibold">{{ card.title }}</h3>
            <p class="text-muted-foreground mt-2 text-sm">{{ card.description }}</p>
          </z-card>
        }
      </div>
    </section>
  `,
})
export class WhyZardUISection {
  readonly cards: FeatureCard[] = [
    {
      title: 'Beautiful & Practical',
      description:
        'Meticulously crafted components that look stunning out of the box while remaining highly functional and accessible.',
      icon: 'sparkles',
    },
    {
      title: 'Community First',
      description: 'Built by Angular developers who understand your needs. Real-world solutions to real problems.',
      icon: 'users',
    },
    {
      title: 'Modern Angular',
      description:
        'Leveraging the latest Angular features including standalone components, signals, and best practices.',
      icon: 'zap',
    },
    {
      title: 'Infinitely Customizable',
      description: 'Built with TailwindCSS for seamless customization. Make every component truly yours.',
      icon: 'layers-2',
    },
  ];
}
