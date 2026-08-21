import { Component } from '@angular/core';

import {
  ZardCardComponent,
  ZardCardContentComponent,
  ZardCardDescriptionComponent,
  ZardCardHeaderComponent,
  ZardCardTitleComponent,
} from '../../card';
import { ZardAspectRatioComponent } from '../aspect-ratio.component';

interface GridCard {
  title: string;
  description: string;
  body: string;
}

@Component({
  selector: 'z-demo-aspect-ratio-card-grid',
  standalone: true,
  imports: [
    ZardAspectRatioComponent,
    ZardCardComponent,
    ZardCardHeaderComponent,
    ZardCardDescriptionComponent,
    ZardCardTitleComponent,
    ZardCardContentComponent,
  ],
  template: `
    <div class="grid w-full grid-cols-[repeat(auto-fit,minmax(150px,1fr))] items-start gap-4">
      @for (item of items; track item.title) {
        <div z-aspect-ratio [zRatio]="16 / 11">
          <z-card zSize="sm" class="flex size-full flex-col overflow-hidden">
            <z-card-header class="px-4">
              <z-card-title [zTitle]="item.title" />
              <z-card-description [zDescription]="item.description" />
            </z-card-header>

            <z-card-content class="flex-1 px-4">
              <p class="text-muted-foreground text-sm">{{ item.body }}</p>
            </z-card-content>
          </z-card>
        </div>
      }
    </div>
  `,
})
export class ZardDemoAspectRatioCardGridComponent {
  protected readonly items: GridCard[] = [
    {
      title: 'Mountains',
      description: 'Alpine peaks.',
      body: 'A quiet ridge line above the clouds, shot just after sunrise.',
    },
    {
      title: 'Forest',
      description: 'Morning canopy.',
      body: 'Dense pine cover with shafts of light breaking through the mist.',
    },
    { title: 'Ocean', description: 'Calm waters.', body: 'A wide, empty shoreline with the tide pulled far back.' },
    {
      title: 'Desert',
      description: 'Endless dunes.',
      body: 'Rippled sand stretching to the horizon under a clear sky.',
    },
    { title: 'Glacier', description: 'Frozen rivers.', body: 'Blue ice carved slowly over thousands of years.' },
    { title: 'Canyon', description: 'Layered rock.', body: 'Deep red walls cut by a river far below.' },
  ];
}
