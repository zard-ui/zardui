import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';
import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardProgressBarComponent } from '@zard/components/progress-bar/progress-bar.component';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';
import { ZardTooltipModule } from '@zard/components/tooltip/tooltip';

import { ZardCarouselComponent, ZardCarouselItemComponent } from './carousel/carousel.component';

@Component({
  selector: 'z-showcase',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-24 pl-4">
      <header class="mb-16 grid items-center justify-center text-center">
        <h2 class="mb-4 text-3xl font-bold tracking-tight sm:text-4xl xl:text-6xl">Beautiful Components</h2>
        <p class="text-muted-foreground max-w-2xl pr-4 text-lg leading-relaxed sm:text-xl md:pr-0">
          Production-ready components that you can copy and paste into your apps. Accessible, customizable, and open source.
        </p>
      </header>

      <main class="mb-24 pr-4 md:pr-0">
        <div class="relative overflow-hidden">
          <z-carousel class="showcase-carousel mx-auto max-w-4xl" [itemsPerView]="3.2" [infinite]="false" [showNavigation]="true" [showDots]="false">
            @for (component of showcaseComponents(); track component.type; let i = $index) {
              <z-carousel-item class="md:pr-6">
                <z-card
                  [zTitle]="component.title"
                  [class]="'flex h-[340px] w-[94%] flex-col pb-6 md:w-72 ' + component.bgClass + (component.isCtaCard ? ' cursor-pointer' : '')"
                  (click)="component.isCtaCard ? navigateToComponents() : null"
                >
                  <div class="flex min-h-[200px] flex-1 items-center justify-center p-8">
                    <div class="flex w-full items-center justify-center">
                      @switch (component.type) {
                        @case ('button') {
                          <z-button>Click me</z-button>
                        }
                        @case ('badge') {
                          <z-badge>New</z-badge>
                        }
                        @case ('input') {
                          <input z-input placeholder="Enter your email..." class="max-w-48" />
                        }
                        @case ('checkbox') {
                          <z-checkbox>Accept terms</z-checkbox>
                        }
                        @case ('switch') {
                          <z-switch></z-switch>
                        }
                        @case ('progress') {
                          <z-progress-bar [progress]="65"></z-progress-bar>
                        }
                        @case ('avatar') {
                          <z-avatar zSrc="https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff" zAlt="John Doe"></z-avatar>
                        }
                        @case ('tooltip') {
                          <button zTooltip="This is a helpful tooltip!" class="bg-primary text-primary-foreground rounded-lg px-4 py-2 transition-all duration-200 hover:scale-105">
                            Hover me
                          </button>
                        }
                        @case ('cta') {
                          <div class="text-center">
                            <div class="flex items-center justify-center rounded-2xl bg-white/10 p-2 backdrop-blur-sm">
                              <z-icon zType="arrow-right" class="text-xl" />
                            </div>

                            <div>
                              <h3 class="mb-2 text-xl font-semibold">View All</h3>
                              <p class="text-primary-foreground/80 text-sm leading-relaxed">30+ components<br />ready to use</p>
                            </div>
                          </div>
                        }
                      }
                    </div>
                  </div>
                  <p [class]="component.textClass + ' text-sm'">{{ component.description }}</p>
                </z-card>
              </z-carousel-item>
            }
          </z-carousel>
        </div>
      </main>
    </section>
  `,
  imports: [
    RouterModule,
    ZardCardComponent,
    ZardCarouselComponent,
    ZardCarouselItemComponent,
    ZardButtonComponent,
    ZardBadgeComponent,
    ZardInputDirective,
    ZardCheckboxComponent,
    ZardSwitchComponent,
    ZardProgressBarComponent,
    ZardAvatarComponent,
    ZardTooltipModule,
    ZardIconComponent,
  ],
})
export class ShowcaseComponent {
  private readonly router = inject(Router);
  readonly itemWidth = 100 / 3.2;

  readonly showcaseComponents = signal([
    {
      title: 'Button',
      type: 'button' as const,
      bgClass: '',
      textClass: 'text-muted-foreground',
      description: 'Versatile button component with multiple variants and sizes.',
    },
    {
      title: 'Badge',
      type: 'badge' as const,
      bgClass: '',
      textClass: 'text-muted-foreground',
      description: 'Small status indicators and labels for UI elements.',
    },
    {
      title: 'Input',
      type: 'input' as const,
      bgClass: '',
      textClass: 'text-muted-foreground',
      description: 'Form input fields with validation and accessibility support.',
    },
    {
      title: 'Checkbox',
      type: 'checkbox' as const,
      bgClass: '',
      textClass: 'text-muted-foreground',
      description: 'Toggle controls for boolean states with smooth animations.',
    },
    {
      title: 'Switch',
      type: 'switch' as const,
      bgClass: '',
      textClass: 'text-muted-foreground',
      description: 'Toggle switches for settings and preferences.',
    },
    {
      title: 'Progress Bar',
      type: 'progress' as const,
      bgClass: '',
      textClass: 'text-muted-foreground',
      description: 'Visual indicators for loading states and progress tracking.',
    },
    {
      title: 'Avatar',
      type: 'avatar' as const,
      bgClass: '',
      textClass: 'text-muted-foreground',
      description: 'User profile images with fallback support.',
    },
    {
      title: 'Tooltip',
      type: 'tooltip' as const,
      bgClass: '',
      textClass: 'text-muted-foreground',
      description: 'Contextual information displayed on hover or focus.',
    },
    {
      title: '',
      type: 'cta' as const,
      bgClass: 'bg-gradient-to-br from-primary/90 to-primary text-primary-foreground border-0 hover:from-primary hover:to-primary/90 transition-all duration-300',
      textClass: 'text-primary-foreground/80',
      description: '',
      isCtaCard: true,
    },
  ]);

  navigateToComponents(): void {
    this.router.navigate(['/docs/components']);
  }
}
