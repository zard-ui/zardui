import { ZardProgressBarComponent } from '@zard/components/progress-bar/progress-bar.component';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { ZardTooltipModule } from '@zard/components/tooltip/tooltip';
import { RouterModule, Router } from '@angular/router';

import { ZardCarouselComponent, ZardCarouselItemComponent } from './carousel/carousel.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';

@Component({
  selector: 'z-showcase',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-24 pl-4">
      <header class="grid items-center justify-center mb-16 text-center">
        <h2 class="text-3xl sm:text-4xl xl:text-6xl font-bold tracking-tight mb-4">Beautiful Components</h2>
        <p class="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed pr-4 md:pr-0">
          Production-ready components that you can copy and paste into your apps. Accessible, customizable, and open source.
        </p>
      </header>

      <main class="mb-24 pr-4 md:pr-0">
        <div class="relative overflow-hidden">
          <z-carousel class="max-w-4xl mx-auto showcase-carousel" [itemsPerView]="3.2" [infinite]="false" [showNavigation]="true" [showDots]="false">
            @for (component of showcaseComponents(); track component.type; let i = $index) {
              <z-carousel-item class="md:pr-6">
                <z-card
                  [zTitle]="component.title"
                  [class]="'h-[340px] w-[94%] md:w-72 flex flex-col pb-6 ' + component.bgClass + (component.isCtaCard ? ' cursor-pointer' : '')"
                  (click)="component.isCtaCard ? navigateToComponents() : null"
                >
                  <div class="flex items-center justify-center flex-1 p-8 min-h-[200px]">
                    <div class="w-full flex items-center justify-center">
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
                          <z-avatar [zImage]="{ url: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff', alt: 'John Doe', fallback: 'JD' }"></z-avatar>
                        }
                        @case ('tooltip') {
                          <button zTooltip="This is a helpful tooltip!" class="bg-primary text-primary-foreground px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105">
                            Hover me
                          </button>
                        }
                        @case ('cta') {
                          <div class="text-center">
                            <div class="flex items-center justify-center p-2 rounded-2xl bg-white/10 backdrop-blur-sm">
                              <z-icon zType="ArrowRight" class="text-xl" />
                            </div>

                            <div>
                              <h3 class="text-xl font-semibold mb-2">View All</h3>
                              <p class="text-sm text-primary-foreground/80 leading-relaxed">30+ components<br />ready to use</p>
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
