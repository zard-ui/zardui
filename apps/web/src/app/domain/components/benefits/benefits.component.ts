import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ZardIconComponent } from '@zard/components/icon/icon.component';
import { ZardIcon } from '@zard/components/icon/icons';

export interface BenefitFeature {
  icon: ZardIcon;
  title: string;
  description: string;
  highlight?: string;
}

@Component({
  selector: 'z-benefits',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardBadgeComponent, ZardIconComponent],
  template: `
    <section class="relative py-24 overflow-hidden">
      <!-- Background with gradient -->
      <div class="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background"></div>

      <!-- Animated background pattern -->
      <div class="absolute inset-0 opacity-30">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div
          class="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(120,119,198,0.1)_49%,rgba(120,119,198,0.1)_51%,transparent_52%)] bg-[length:20px_20px] animate-[slide_20s_linear_infinite]"
        ></div>
      </div>

      <div class="relative z-10 container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <!-- Header -->
          <div class="text-center mb-16">
            <z-badge zType="secondary" class="mb-4"> Why Choose ZardUI? </z-badge>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Built for
              <span class="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Modern Angular </span>
              Development
            </h2>
            <p class="text-lg text-muted-foreground max-w-2xl mx-auto">Experience the perfect blend of beautiful design, developer experience, and performance optimization.</p>
          </div>

          <!-- Features Grid -->
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (feature of features(); track feature.title) {
              <div class="group relative">
                <!-- Card with hover effects -->
                <div
                  class="relative p-6 rounded-2xl border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1"
                >
                  <!-- Icon container -->
                  <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                    <z-icon [zType]="feature.icon" class="text-xl" />
                  </div>

                  <!-- Content -->
                  <h3 class="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {{ feature.title }}
                  </h3>
                  <p class="text-muted-foreground leading-relaxed">
                    {{ feature.description }}
                  </p>

                  <!-- Highlight badge for premium features -->
                  @if (feature.highlight) {
                    <div class="absolute -top-2 -right-2">
                      <z-badge [class]="'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs px-2 py-1'">
                        {{ feature.highlight }}
                      </z-badge>
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Stats section -->
          <div class="mt-20 pt-16 border-t border-border/50">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
              @for (stat of stats(); track stat.label) {
                <div class="text-center group">
                  <div class="text-3xl lg:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                    {{ stat.value }}
                  </div>
                  <div class="text-sm text-muted-foreground font-medium">
                    {{ stat.label }}
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </section>

    <style>
      @keyframes slide {
        0% {
          transform: translateX(-100px);
        }
        100% {
          transform: translateX(100px);
        }
      }
    </style>
  `,
})
export class BenefitsComponent {
  readonly features = signal<BenefitFeature[]>([
    {
      icon: 'zap',
      title: 'Lightning Fast',
      description: 'Built with performance in mind. Optimized bundle size and runtime performance for production apps.',
      highlight: 'Fast',
    },
    {
      icon: 'palette',
      title: 'Beautiful Design',
      description: 'Carefully crafted components that follow modern design principles and accessibility standards.',
    },
    {
      icon: 'code',
      title: 'Developer Experience',
      description: 'TypeScript-first, excellent IDE support, and comprehensive documentation for smooth development.',
      highlight: 'DX',
    },
    {
      icon: 'layers',
      title: 'Modular Architecture',
      description: 'Import only what you need. Tree-shakable components that keep your bundle size minimal.',
    },
    {
      icon: 'shield',
      title: 'Type Safe',
      description: 'Full TypeScript support with strict typing, ensuring reliability and better code completion.',
    },
    {
      icon: 'heart',
      title: 'Community Driven',
      description: 'Open source with active community contributions, regular updates and responsive support.',
    },
  ]);

  readonly stats = signal([
    { value: '30+', label: 'Components' },
    { value: '99%', label: 'TypeScript' },
    { value: '100%', label: 'Tree Shakable' },
    { value: '24/7', label: 'Community Support' },
  ]);
}
