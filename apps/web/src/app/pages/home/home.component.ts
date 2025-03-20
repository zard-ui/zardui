import { ShowcaseComponent } from '@zard/domain/components/components/showcase/showcase.component';
import { YoutubeComponent } from '@zard/domain/components/components/youtube/youtube.component';
import { HeroComponent } from '@zard/domain/components/components/hero/hero.component';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'z-home',
  standalone: true,
  imports: [RouterModule, HeroComponent, ShowcaseComponent, YoutubeComponent],
  template: `
    <z-hero></z-hero>
    <z-showcase></z-showcase>
    <z-youtube></z-youtube>
  `,
})
export class HomeComponent {}
