import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideFileText } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardItemImports } from '@/shared/components/item/item.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';

@Component({
  selector: 'z-demo-message-attachment',
  imports: [NgIcon, ZardButtonComponent, ...ZardBubbleImports, ...ZardItemImports, ...ZardMessageImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <z-message zAlign="end">
        <z-message-content>
          <z-item zVariant="outline" class="w-fit rounded-2xl p-1.5">
            <z-item-media zVariant="image" class="size-24 rounded-xl">
              <img src="/images/github_banner.png" alt="Cover page" />
            </z-item-media>
          </z-item>
          <z-bubble>
            <z-bubble-content>Here's the image. Can you add it to the PDF? Use it for the cover page.</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>

      <z-message>
        <z-message-content>
          <z-bubble zVariant="muted">
            <z-bubble-content>Done. Here's the PDF with the image added as the cover page.</z-bubble-content>
          </z-bubble>
          <z-item zVariant="muted" class="w-fit rounded-2xl">
            <z-item-media zVariant="icon" class="bg-background size-9 rounded-xl">
              <ng-icon name="lucideFileText" />
            </z-item-media>
            <z-item-content>
              <z-item-title>sales-dashboard.pdf</z-item-title>
              <z-item-description>PDF · 2.4 MB</z-item-description>
            </z-item-content>
            <z-item-actions>
              <button
                type="button"
                z-button
                zType="secondary"
                zSize="icon-sm"
                zShape="circle"
                aria-label="Download"
                title="Download"
              >
                <ng-icon name="lucideDownload" />
              </button>
            </z-item-actions>
          </z-item>
        </z-message-content>
      </z-message>

      <z-message zAlign="end">
        <z-message-content>
          <z-bubble>
            <z-bubble-content>Thanks. Looks good.</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideDownload, lucideFileText })],
  host: { class: 'contents' },
})
export class ZardDemoMessageAttachmentComponent {}
