import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';

/**
 * O estado vazio — o único card da parede que não tem dado nenhum.
 *
 * Ele está lá porque estado vazio é a parte do design system que costuma faltar,
 * e mostrá-lo entre cards cheios é a forma mais direta de dizer que a biblioteca
 * cobre os dois.
 */
@Component({
  selector: 'z-card-empty-distribute-track',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardButtonComponent, NgIcon],
  viewProviders: [provideIcons({ lucidePlus })],
  host: { class: 'block w-full' },
  template: `
    <z-card>
      <z-card-content>
        <div class="flex flex-col items-center gap-4 p-4 text-center">
          <div class="bg-muted text-foreground flex size-10 items-center justify-center rounded-lg">
            <ng-icon name="lucidePlus" class="size-4" />
          </div>
          <div class="flex flex-col gap-1">
            <h3 class="text-base font-medium">Distribute Track</h3>
            <p class="text-muted-foreground text-sm text-balance">
              Upload your first master to start reaching listeners on Spotify, Apple Music, and more.
            </p>
          </div>
          <button type="button" z-button>Create Release</button>
        </div>
      </z-card-content>
    </z-card>
  `,
})
export class CardEmptyDistributeTrackComponent {}
