import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

import { FeaturesComponent } from '../../domain/components/components/features/features.component';
import { YoutubeComponent } from '../../domain/components/components/youtube/youtube.component';
import { HeroComponent } from '../../domain/components/components/hero/hero.component';

@Component({
  selector: 'z-home',
  standalone: true,
  imports: [RouterModule, HeroComponent, FeaturesComponent, YoutubeComponent],
  template: `
    <z-hero></z-hero>
    <z-features></z-features>
    <z-youtube></z-youtube>
  `,
})
export class HomeComponent {}
