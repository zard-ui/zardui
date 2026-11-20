import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFile } from '@ng-icons/lucide';

import { ZardItemImports } from '@zard/components/item';
import { ZardProgressComponent } from '@zard/components/progress/progress.component';
import { ZardSliderComponent } from '@zard/components/slider';

import { ExampleImports } from './example.component';

const FILES = [
  { id: '1', name: 'document.pdf', progress: 45, timeRemaining: '2m 30s' },
  { id: '2', name: 'presentation.pptx', progress: 78, timeRemaining: '45s' },
  { id: '3', name: 'spreadsheet.xlsx', progress: 12, timeRemaining: '5m 12s' },
  { id: '4', name: 'image.jpg', progress: 100, timeRemaining: 'Complete' },
] as const;

/** shadcn/ui's `progress-example`, in zard. */
@Component({
  selector: 'z-progress-example',
  imports: [ExampleImports, NgIcon, ZardItemImports, ZardProgressComponent, ZardSliderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideFile })],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Progress Bar">
        <div class="flex w-full flex-col gap-4">
          <z-progress [value]="0" />
          <z-progress [value]="25" class="w-full" />
          <z-progress [value]="50" />
          <z-progress [value]="75" />
          <z-progress [value]="100" />
        </div>
      </z-example>

      <z-example zTitle="With Label">
        <!-- shadcn's Progress root: a wrapping row of label, value and the full-width track. -->
        <div class="flex w-full flex-wrap gap-3">
          <span id="progress-upload-label" class="text-sm font-medium">Upload progress</span>
          <span class="text-muted-foreground ms-auto text-sm tabular-nums">56%</span>
          <z-progress aria-labelledby="progress-upload-label" [value]="56" class="w-full" />
        </div>
      </z-example>

      <z-example zTitle="Controlled">
        <div class="flex w-full flex-col gap-4">
          <z-progress [value]="controlled()[0]" class="w-full" />
          <z-slider
            class="w-full"
            zMin="0"
            zMax="100"
            zStep="1"
            [zValue]="controlled()"
            (zSlideIndexChange)="controlled.set($event)"
          />
        </div>
      </z-example>

      <z-example zTitle="File Upload List">
        <div z-item-group>
          @for (file of files; track file.id) {
            <div z-item zSize="xs" class="px-0">
              <div z-item-media zVariant="icon">
                <ng-icon name="lucideFile" class="size-5" />
              </div>
              <div z-item-content class="inline-block truncate">
                <div z-item-title class="inline">{{ file.name }}</div>
              </div>
              <div z-item-content>
                <z-progress [value]="file.progress" class="w-32" />
              </div>
              <div z-item-actions class="w-16 justify-end">
                <span class="text-muted-foreground text-sm">{{ file.timeRemaining }}</span>
              </div>
            </div>
          }
        </div>
      </z-example>
    </z-example-wrapper>
  `,
})
export class ProgressExampleComponent {
  protected readonly files = FILES;
  protected readonly controlled = signal([50]);
}
