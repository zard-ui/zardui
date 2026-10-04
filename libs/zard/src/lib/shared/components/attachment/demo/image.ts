import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';

import { ZardAttachmentImports } from '../imports';

@Component({
  selector: 'z-demo-attachment-image',
  imports: [NgIcon, ZardButtonComponent, ...ZardAttachmentImports],
  template: `
    <div class="mx-auto flex w-full max-w-sm flex-col gap-4 py-6">
      @if (!removed()) {
        <z-attachment zOrientation="vertical" class="w-64 overflow-hidden">
          <z-attachment-media zVariant="image" class="h-36 w-full">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='120'%3E%3Crect width='240' height='120' fill='%23558078'/%3E%3Cpath d='M0 120L80 20L140 100L190 40L240 120' fill='%23b6d9cc'/%3E%3C/svg%3E"
              alt="Illustration of green mountain peaks"
              class="size-full object-cover"
            />
          </z-attachment-media>
          <z-attachment-content class="w-full px-1">
            <z-attachment-title>Mountains.svg</z-attachment-title>
            <z-attachment-description>Image · 1 KB · Ready</z-attachment-description>
          </z-attachment-content>
          <z-attachment-actions>
            <button type="button" z-attachment-action aria-label="Remove Mountains.svg" (click)="removed.set(true)">
              <ng-icon name="lucideX" class="size-3.5" />
            </button>
          </z-attachment-actions>
        </z-attachment>
      } @else {
        <button type="button" z-button zType="outline" class="w-fit" (click)="removed.set(false)">Restore image</button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideX })],
})
export class ZardDemoAttachmentImageComponent {
  readonly removed = signal(false);
}
