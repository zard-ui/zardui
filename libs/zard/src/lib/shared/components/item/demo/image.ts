import { Component } from '@angular/core';

import { ZardItemImports } from '@/shared/components/item/item.imports';

interface Song {
  title: string;
  artist: string;
  album: string;
  duration: string;
}

@Component({
  selector: 'z-demo-item-image',
  imports: [...ZardItemImports],
  template: `
    <div class="flex w-full min-w-md flex-col gap-6">
      <z-item-group class="gap-4">
        @for (song of music; track song.title) {
          <a z-item href="#" zVariant="outline" role="listitem">
            <z-item-media zVariant="image">
              <img [src]="'https://avatar.vercel.sh/' + song.title" [alt]="song.title" class="object-cover grayscale" />
            </z-item-media>
            <z-item-content>
              <z-item-title class="line-clamp-1">
                {{ song.title }} -
                <span class="text-muted-foreground">{{ song.album }}</span>
              </z-item-title>
              <z-item-description>{{ song.artist }}</z-item-description>
            </z-item-content>
            <z-item-content class="flex-none text-center">
              <z-item-description>{{ song.duration }}</z-item-description>
            </z-item-content>
          </a>
        }
      </z-item-group>
    </div>
  `,
})
export class ZardDemoItemImageComponent {
  protected readonly music: Song[] = [
    { title: 'Midnight City Lights', artist: 'Neon Dreams', album: 'Electric Nights', duration: '3:45' },
    { title: 'Coffee Shop Conversations', artist: 'The Morning Brew', album: 'Urban Stories', duration: '4:05' },
    { title: 'Digital Rain', artist: 'Cyber Symphony', album: 'Binary Beats', duration: '3:30' },
  ];
}
