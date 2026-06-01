import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardImports } from '@/shared/components/card/card.imports';

@Component({
  selector: 'z-demo-card-image',
  imports: [ZardCardImports, ZardButtonComponent, ZardBadgeComponent, NgOptimizedImage],
  template: `
    <z-card class="relative mx-auto w-full min-w-sm pt-0">
      <div class="absolute inset-0 z-30 aspect-video bg-black/35"></div>
      <img
        ngSrc="https://avatar.vercel.sh/shadcn1"
        alt="Event cover"
        class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
        width="120"
        height="120"
      />
      <z-card-header>
        <z-card-action>
          <z-badge zType="secondary">Featured</z-badge>
        </z-card-action>
        <z-card-title zTitle="Design systems meetup" />
        <z-card-description
          zDescription="A practical talk on component APIs, accessibility, and shipping
          faster."
        />
      </z-card-header>
      <z-card-footer>
        <z-button class="w-full">View Event</z-button>
      </z-card-footer>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCardImageComponent {}
