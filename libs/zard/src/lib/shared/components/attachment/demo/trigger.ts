import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideFileText, lucideX } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';

import { ZardAttachmentImports } from '../imports';

@Component({
  selector: 'z-demo-attachment-trigger',
  imports: [NgIcon, ZardButtonComponent, ...ZardAttachmentImports],
  template: `
    <div class="mx-auto flex w-full max-w-sm flex-col gap-4 py-6">
      @if (!removed()) {
        <z-attachment class="w-full">
          <z-attachment-media aria-hidden="true">
            <ng-icon name="lucideFileText" class="size-4" />
          </z-attachment-media>
          <z-attachment-content>
            <z-attachment-title>Preview.pdf</z-attachment-title>
            <z-attachment-description>Ready · Click card to preview</z-attachment-description>
          </z-attachment-content>
          <button
            type="button"
            z-attachment-trigger
            aria-label="Preview Preview.pdf"
            (click)="opened.update(increment)"
          ></button>
          <z-attachment-actions>
            <button type="button" z-attachment-action aria-label="Remove Preview.pdf" (click)="removed.set(true)">
              <ng-icon name="lucideX" class="size-3.5" />
            </button>
            <a z-attachment-action href="#attachment-download" download="Preview.pdf" aria-label="Download Preview.pdf">
              <ng-icon name="lucideDownload" class="size-3.5" />
            </a>
          </z-attachment-actions>
        </z-attachment>
      }

      <p role="status" class="text-muted-foreground text-xs">Preview opened {{ opened() }} times</p>

      @if (removed()) {
        <button type="button" z-button zType="outline" class="w-fit" (click)="removed.set(false)">
          Restore Preview.pdf
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideDownload, lucideFileText, lucideX })],
})
export class ZardDemoAttachmentTriggerComponent {
  readonly removed = signal(false);
  readonly opened = signal(0);
  readonly increment = (value: number) => value + 1;
}
