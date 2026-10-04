import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideExternalLink, lucideFileText } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';

import type { ZardAttachmentSizeVariants } from '../attachment.variants';
import { ZardAttachmentImports } from '../imports';

@Component({
  selector: 'z-demo-attachment-sizes',
  imports: [NgIcon, ZardButtonComponent, ...ZardAttachmentImports],
  template: `
    <div class="mx-auto flex w-full max-w-sm flex-col gap-4 py-6">
      <div class="flex flex-wrap gap-2">
        <button type="button" z-button zType="outline" zSize="sm" (click)="vertical.set(!vertical())">
          Toggle orientation
        </button>
        <button type="button" z-button zType="outline" zSize="sm" (click)="image.set(!image())">Toggle media</button>
      </div>

      <div class="flex flex-col gap-3">
        @for (size of sizes; track size) {
          <z-attachment [zSize]="size" [zOrientation]="vertical() ? 'vertical' : 'horizontal'" class="w-full">
            <z-attachment-media [zVariant]="image() ? 'image' : 'icon'">
              @if (image()) {
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23558078'/%3E%3C/svg%3E"
                  alt="Green colour sample"
                  class="size-full object-cover"
                />
              } @else {
                <ng-icon name="lucideFileText" class="size-4" />
              }
            </z-attachment-media>
            <z-attachment-content>
              <z-attachment-title>{{ size }} attachment</z-attachment-title>
              <z-attachment-description>Ready · 24 KB</z-attachment-description>
            </z-attachment-content>
            <z-attachment-actions>
              <button
                type="button"
                z-attachment-action
                [attr.aria-label]="'Inspect ' + size + ' attachment'"
                (click)="selected.set(size)"
              >
                <ng-icon name="lucideExternalLink" class="size-3.5" />
              </button>
            </z-attachment-actions>
          </z-attachment>
        }
      </div>

      <p role="status" class="text-muted-foreground text-xs">Selected: {{ selected() }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideExternalLink, lucideFileText })],
})
export class ZardDemoAttachmentSizesComponent {
  readonly sizes: ZardAttachmentSizeVariants[] = ['default', 'sm', 'xs'];
  readonly vertical = signal(false);
  readonly image = signal(false);
  readonly selected = signal('none');
}
