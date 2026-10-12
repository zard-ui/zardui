import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideImage } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardItemImports } from '@zard/components/item';

/** zard has no Label: the caption is a plain label carrying the classes shadcn's `Label` renders. */
@Component({
  selector: 'z-preview-01-cover-art',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardItemImports, ZardButtonComponent, NgIcon],
  viewProviders: [provideIcons({ lucideImage })],
  template: `
    <z-card>
      <z-card-content class="flex flex-col gap-3">
        <label
          for="p01-cover-art"
          class="text-muted-foreground flex items-center justify-center gap-2 text-center text-xs leading-none font-normal tracking-wider uppercase select-none"
        >
          Cover Art
        </label>
        <z-item class="aspect-square" zVariant="outline">
          <label for="p01-cover-art" class="flex size-full cursor-pointer items-center justify-center">
            <ng-icon name="lucideImage" class="text-muted-foreground/50 size-10" />
          </label>
        </z-item>
        <input #file id="p01-cover-art" type="file" accept="image/jpeg,image/png" class="sr-only" />
      </z-card-content>
      <z-card-footer class="flex-col gap-2">
        <button type="button" z-button zType="secondary" class="w-full cursor-pointer" (click)="file.click()">
          Upload Artwork
        </button>
        <z-card-description class="text-center text-xs" [zDescription]="requirements" />
        <ng-template #requirements>
          Minimum 3000 × 3000px
          <br />
          JPEG or PNG only
        </ng-template>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview01CoverArtComponent {}
