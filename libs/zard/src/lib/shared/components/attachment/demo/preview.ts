import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileText, lucideX } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';

import { ZardAttachmentImports } from '../attachment.imports';

@Component({
  selector: 'z-demo-attachment-preview',
  imports: [NgIcon, ZardButtonComponent, ...ZardAttachmentImports],
  template: `
    <div class="mx-auto flex w-full max-w-sm flex-col gap-4 py-6">
      @if (!removed()) {
        <z-attachment class="w-full">
          <z-attachment-media aria-hidden="true">
            <ng-icon name="lucideFileText" class="size-4" />
          </z-attachment-media>
          <z-attachment-content>
            <z-attachment-title>Project notes.pdf</z-attachment-title>
            <z-attachment-description>PDF · 240 KB · Ready</z-attachment-description>
          </z-attachment-content>
          <z-attachment-actions>
            <button type="button" z-attachment-action aria-label="Remove Project notes.pdf" (click)="removed.set(true)">
              <ng-icon name="lucideX" class="size-3.5" />
            </button>
          </z-attachment-actions>
        </z-attachment>
      } @else {
        <button type="button" z-button zType="outline" class="w-fit" (click)="removed.set(false)">Restore file</button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideFileText, lucideX })],
})
export class ZardDemoAttachmentPreviewComponent {
  readonly removed = signal(false);
}
