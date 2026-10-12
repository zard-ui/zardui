import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCopy,
  lucideDownload,
  lucideFileArchive,
  lucideFileText,
  lucidePresentation,
  lucideRefreshCcw,
  lucideThumbsDown,
  lucideThumbsUp,
} from '@ng-icons/lucide';

import { ZardAttachmentImports } from '@zard/components/attachment';
import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';
import { ZardBubbleImports } from '@zard/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardMarkerImports } from '@zard/components/marker/marker.imports';
import { ZardMessageImports } from '@zard/components/message/message.imports';
import { ZardSpinnerComponent } from '@zard/components/spinner';

import { ExampleImports } from './example.component';

const LOGS_TEXT = `I found the following error in the logs:

- Error: No users found
- Stack trace:
  - at src/users/services/user-service.ts:123
  - at src/users/services/get-user.ts:230

Can you check if the users are being created?`;

const WORKSPACE_IMAGE = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80';

const BRAND_PHOTOS = [
  { src: WORKSPACE_IMAGE, alt: 'Workspace' },
  {
    src: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80',
    alt: 'Desk',
  },
  {
    src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80',
    alt: 'Office',
  },
] as const;

const BRAND_FILES = [
  { icon: 'lucideFileText', title: 'brand-deck.pdf', description: 'PDF · 3.1 MB' },
  { icon: 'lucidePresentation', title: 'brand-deck.key', description: 'Keynote · 9 MB' },
  { icon: 'lucideFileArchive', title: 'brand-assets.zip', description: 'ZIP · 4.2 MB' },
] as const;

/** shadcn/ui's `message-example`, in zard. */
@Component({
  selector: 'z-message-example',
  imports: [
    ExampleImports,
    NgIcon,
    ZardAttachmentImports,
    ZardAvatarComponent,
    ZardBubbleImports,
    ZardButtonComponent,
    ZardMarkerImports,
    ZardMessageImports,
    ZardSpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideCopy,
      lucideDownload,
      lucideFileArchive,
      lucideFileText,
      lucidePresentation,
      lucideRefreshCcw,
      lucideThumbsDown,
      lucideThumbsUp,
    }),
  ],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Message">
        <div class="flex w-full max-w-md min-w-0 flex-col gap-10">
          <z-message zAlign="end">
            <z-message-content>
              <z-bubble>
                <z-bubble-content>Deploying to prod real quick.</z-bubble-content>
              </z-bubble>
            </z-message-content>
          </z-message>
          <z-message>
            <z-message-content>
              <z-bubble zVariant="muted">
                <z-bubble-content>It's 4:55 PM. On a Friday.</z-bubble-content>
              </z-bubble>
            </z-message-content>
          </z-message>
          <z-message zAlign="end">
            <z-message-content>
              <z-bubble>
                <z-bubble-content>It's a one-line change.</z-bubble-content>
              </z-bubble>
            </z-message-content>
          </z-message>
          <z-message>
            <z-message-content>
              <z-bubble-group>
                <z-bubble zVariant="muted">
                  <z-bubble-content>
                    It's always a one-line change 😭. Make sure to run the tests this time.
                  </z-bubble-content>
                </z-bubble>
                <z-bubble zVariant="muted">
                  <z-bubble-content>Alright, go for it.</z-bubble-content>
                </z-bubble>
              </z-bubble-group>
            </z-message-content>
          </z-message>
        </div>
      </z-example>

      <z-example zTitle="Avatar">
        <div class="flex w-full max-w-md flex-col gap-10">
          <z-message>
            <z-message-avatar>
              <z-avatar zSrc="https://github.com/shadcn.png" zAlt="@shadcn" zFallback="CN" class="grayscale" />
            </z-message-avatar>
            <z-message-content>
              <z-bubble zVariant="muted">
                <z-bubble-content>Something went wrong. Any idea?</z-bubble-content>
              </z-bubble>
            </z-message-content>
          </z-message>
          <z-message>
            <z-message-avatar>
              <z-avatar zSrc="https://github.com/evilrabbit.png" zAlt="@evilrabbit" zFallback="ER" />
            </z-message-avatar>
            <z-message-content>
              <z-bubble zVariant="muted">
                <z-bubble-content>
                  I checked the latest deployment and found the build failed during dependency installation.
                </z-bubble-content>
              </z-bubble>
            </z-message-content>
          </z-message>
          <z-message zAlign="end">
            <z-message-avatar>
              <z-avatar zSrc="https://github.com/evilrabbit.png" zAlt="@evilrabbit" zFallback="ER" />
            </z-message-avatar>
            <z-message-content>
              <z-bubble zVariant="muted">
                <z-bubble-content>Something went wrong. Any idea?</z-bubble-content>
              </z-bubble>
            </z-message-content>
          </z-message>
          <z-message>
            <z-message-avatar>
              <z-avatar zSrc="https://avatar.vercel.sh/shadcn" zAlt="@shadcn" zFallback="CN" />
            </z-message-avatar>
            <z-message-content>
              <z-bubble zVariant="muted">
                <z-bubble-content class="space-y-2">
                  <div>I checked the latest deployment and found the build failed during dependency installation.</div>
                  <div>Can you share the exact error message from the logs?</div>
                </z-bubble-content>
              </z-bubble>
            </z-message-content>
          </z-message>
          <z-message>
            <z-message-avatar>
              <z-avatar zFallback="CN" />
            </z-message-avatar>
            <z-message-content>
              <z-bubble zVariant="destructive">
                <z-bubble-content>Something went wrong. Any idea?</z-bubble-content>
              </z-bubble>
            </z-message-content>
          </z-message>
        </div>
      </z-example>

      <z-example zTitle="Group">
        <div class="flex w-full max-w-md flex-col gap-10">
          <z-message-group>
            <z-message>
              <z-message-content>
                <z-bubble zVariant="muted">
                  <z-bubble-content>I checked the registry addresses.</z-bubble-content>
                </z-bubble>
              </z-message-content>
            </z-message>
            <z-message>
              <z-message-content>
                <z-bubble zVariant="muted">
                  <z-bubble-content>The component and example JSON now live under the UI registry.</z-bubble-content>
                </z-bubble>
              </z-message-content>
            </z-message>
          </z-message-group>
          <z-message-group>
            <z-message zAlign="end">
              <z-message-content>
                <z-bubble zVariant="muted">
                  <z-bubble-content>I checked the registry addresses.</z-bubble-content>
                </z-bubble>
              </z-message-content>
            </z-message>
            <z-message zAlign="end">
              <z-message-content>
                <z-bubble zVariant="muted">
                  <z-bubble-content>The component and example JSON now live under the UI registry.</z-bubble-content>
                </z-bubble>
              </z-message-content>
            </z-message>
          </z-message-group>
          <z-message-group>
            <z-message zAlign="end">
              <z-message-avatar />
              <z-message-content>
                <z-bubble zVariant="muted">
                  <z-bubble-content>I checked the registry addresses.</z-bubble-content>
                </z-bubble>
              </z-message-content>
            </z-message>
            <z-message zAlign="end">
              <z-message-avatar>
                <z-avatar zSrc="https://avatar.vercel.sh/shadcn" zAlt="@shadcn" zFallback="CN" />
              </z-message-avatar>
              <z-message-content>
                <z-bubble zVariant="muted">
                  <z-bubble-content>The component and example JSON now live under the UI registry.</z-bubble-content>
                </z-bubble>
              </z-message-content>
            </z-message>
          </z-message-group>
          <z-message-group>
            <z-message>
              <z-message-avatar />
              <z-message-content>
                <z-bubble zVariant="muted">
                  <z-bubble-content>I checked the registry addresses.</z-bubble-content>
                </z-bubble>
              </z-message-content>
            </z-message>
            <z-message>
              <z-message-avatar>
                <z-avatar zSrc="https://avatar.vercel.sh/shadcn" zAlt="@shadcn" zFallback="CN" />
              </z-message-avatar>
              <z-message-content>
                <z-bubble zVariant="muted">
                  <z-bubble-content>The component and example JSON now live under the UI registry.</z-bubble-content>
                </z-bubble>
              </z-message-content>
            </z-message>
          </z-message-group>
        </div>
      </z-example>

      <z-example zTitle="Group Chat">
        <div class="flex w-full max-w-md flex-col gap-10">
          <z-message zAlign="end">
            <z-message-content>
              <z-bubble zVariant="tinted">
                <z-bubble-content>Why is the dashboard showing zero users</z-bubble-content>
              </z-bubble>
            </z-message-content>
          </z-message>
          <z-message-group>
            <z-message>
              <z-message-avatar />
              <z-message-content>
                <z-bubble zVariant="muted">
                  <z-bubble-content>Define "zero."</z-bubble-content>
                </z-bubble>
              </z-message-content>
            </z-message>
            <z-message>
              <z-message-avatar>
                <z-avatar zSrc="https://github.com/evilrabbit.png" zAlt="@evilrabbit" zFallback="ER" />
              </z-message-avatar>
              <z-message-content>
                <z-bubble zVariant="muted">
                  <z-bubble-content>What do you mean?</z-bubble-content>
                </z-bubble>
              </z-message-content>
            </z-message>
          </z-message-group>
          <z-message zAlign="end">
            <z-message-content>
              <z-bubble zVariant="tinted">
                <z-bubble-content>
                  <span class="font-medium">&#64;eve</span>
                  can you check?
                </z-bubble-content>
              </z-bubble>
            </z-message-content>
          </z-message>
          <!-- zard's message wraps loose children in a bubble, so the marker sits in a message-content. -->
          <z-message>
            <z-message-content>
              <z-marker role="status">
                <z-marker-icon><z-spinner /></z-marker-icon>
                <z-marker-content>Checking the logs...</z-marker-content>
              </z-marker>
            </z-message-content>
          </z-message>
          <z-message>
            <z-message-content>
              <z-message-header>Eve</z-message-header>
              <z-bubble zVariant="ghost">
                <z-bubble-content>
                  <span class="whitespace-pre-wrap">{{ logsText }}</span>
                </z-bubble-content>
              </z-bubble>
            </z-message-content>
          </z-message>
        </div>
      </z-example>

      <z-example zTitle="Header and Footer">
        <div class="flex w-full max-w-md flex-col gap-12">
          <z-message zAlign="end">
            <z-message-content>
              <z-message-header class="justify-end">You</z-message-header>
              <z-bubble>
                <z-bubble-content>Can we keep this style quiet and send the update today?</z-bubble-content>
              </z-bubble>
              <z-message-footer class="gap-2">
                <span>Delivered</span>
                <button type="button" z-button zType="ghost" zSize="xs">Undo</button>
              </z-message-footer>
            </z-message-content>
          </z-message>
          <z-message zAlign="start">
            <z-message-content>
              <z-message-header>
                <span>Olivia</span>
                <span class="ml-auto font-normal">1m ago</span>
              </z-message-header>
              <z-bubble zVariant="muted">
                <z-bubble-content>
                  I checked the logs. The retry finished and the missing invoices are included now.
                </z-bubble-content>
                <z-bubble-reactions>
                  <button type="button" z-button zType="ghost" zSize="xs">Thanks</button>
                </z-bubble-reactions>
              </z-bubble>
              <z-message-footer class="gap-2">
                <span>From Support queue</span>
                <button type="button" z-button zType="ghost" zSize="xs">Copy</button>
              </z-message-footer>
            </z-message-content>
          </z-message>
          <z-message zAlign="end">
            <z-message-content>
              <z-message-header>Marina</z-message-header>
              <z-bubble zVariant="outline">
                <z-bubble-content>
                  I drafted the reply with the exact filter path and a link to the export history.
                </z-bubble-content>
              </z-bubble>
              <z-message-footer class="gap-2">
                <span>Draft ready</span>
                <button type="button" z-button zType="outline" zSize="xs">Review</button>
                <button type="button" z-button zSize="xs">Send</button>
              </z-message-footer>
            </z-message-content>
          </z-message>
          <z-message zAlign="start">
            <z-message-content>
              <z-message-header>Assistant note</z-message-header>
              <z-bubble zVariant="ghost">
                <z-bubble-content>
                  Ghost messages keep long-form assistant notes aligned with the surrounding text instead of adding a
                  frame.
                </z-bubble-content>
              </z-bubble>
              <z-message-footer class="gap-2">
                <span>Internal only</span>
                <button type="button" z-button zType="ghost" zSize="xs">Pin</button>
              </z-message-footer>
            </z-message-content>
          </z-message>
          <z-message zAlign="end">
            <z-message-content>
              <z-message-header class="justify-end">Automation warning</z-message-header>
              <z-bubble zVariant="destructive">
                <z-bubble-content>
                  The old export link expires in 10 minutes. Regenerate before sending this transcript externally.
                </z-bubble-content>
              </z-bubble>
              <z-message-footer class="gap-2">
                <span>Needs action</span>
                <button type="button" z-button zType="destructive" zSize="xs">Regenerate</button>
              </z-message-footer>
            </z-message-content>
          </z-message>
        </div>
      </z-example>

      <z-example zTitle="Actions">
        <div class="flex w-full max-w-md flex-col gap-10">
          <z-message zAlign="end">
            <z-message-content>
              <z-bubble>
                <z-bubble-content>What is the status of the deployment?</z-bubble-content>
              </z-bubble>
              <z-message-footer>
                <button type="button" z-button zType="ghost" zSize="icon" aria-label="Copy" title="Copy">
                  <ng-icon name="lucideCopy" />
                </button>
                <button type="button" z-button zType="ghost" zSize="icon" aria-label="Retry" title="Retry">
                  <ng-icon name="lucideRefreshCcw" />
                </button>
              </z-message-footer>
            </z-message-content>
          </z-message>
          <z-message>
            <z-message-avatar>
              <z-avatar zSrc="https://github.com/evilrabbit.png" zAlt="@evilrabbit" zFallback="ER" />
            </z-message-avatar>
            <z-message-content>
              <z-bubble zVariant="muted">
                <z-bubble-content>
                  The install failure is coming from the workspace package. I can open the exact log line or retry the
                  deployment.
                </z-bubble-content>
              </z-bubble>
              <z-message-footer>
                <button type="button" z-button zType="ghost" zSize="icon" aria-label="Copy" title="Copy">
                  <ng-icon name="lucideCopy" />
                </button>
                <button
                  type="button"
                  z-button
                  zType="ghost"
                  zSize="icon"
                  aria-label="Like: thumbs up"
                  title="Like: thumbs up"
                >
                  <ng-icon name="lucideThumbsUp" />
                </button>
                <button
                  type="button"
                  z-button
                  zType="ghost"
                  zSize="icon"
                  aria-label="Like: thumbs down"
                  title="Like: thumbs down"
                >
                  <ng-icon name="lucideThumbsDown" />
                </button>
              </z-message-footer>
            </z-message-content>
          </z-message>
          <z-message zAlign="end">
            <z-message-content>
              <z-bubble>
                <z-bubble-content>Okay drop me a link. I'll check it out.</z-bubble-content>
              </z-bubble>
              <z-message-footer class="gap-2">
                <span class="text-destructive font-normal">Failed to send</span>
                <button type="button" z-button zType="secondary" zSize="xs">Retry</button>
              </z-message-footer>
            </z-message-content>
          </z-message>
        </div>
      </z-example>

      <z-example zTitle="Attachment">
        <div class="flex w-full max-w-sm flex-col gap-8">
          <z-message zAlign="end">
            <z-message-content>
              <z-attachment zOrientation="vertical">
                <z-attachment-media zVariant="image">
                  <img [src]="workspaceImage" alt="Workspace" />
                </z-attachment-media>
              </z-attachment>
              <z-bubble>
                <z-bubble-content>
                  Here's the image. Can you add it to the PDF? Use it for the cover page.
                </z-bubble-content>
              </z-bubble>
            </z-message-content>
          </z-message>
          <z-message>
            <z-message-content>
              <z-bubble zVariant="muted">
                <z-bubble-content>Done. Here's the PDF with the image added as the cover page.</z-bubble-content>
              </z-bubble>
              <z-attachment>
                <z-attachment-media>
                  <ng-icon name="lucideFileText" />
                </z-attachment-media>
                <z-attachment-content>
                  <z-attachment-title>sales-dashboard.pdf</z-attachment-title>
                  <z-attachment-description>PDF · 2.4 MB</z-attachment-description>
                </z-attachment-content>
                <z-attachment-actions>
                  <button
                    type="button"
                    z-attachment-action
                    title="Download"
                    aria-label="Download"
                    zSize="icon-sm"
                    zType="secondary"
                  >
                    <ng-icon name="lucideDownload" />
                  </button>
                </z-attachment-actions>
              </z-attachment>
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
      </z-example>

      <z-example zTitle="Attachment Group">
        <div class="flex w-full max-w-sm flex-col gap-8">
          <z-message zAlign="end">
            <z-message-content>
              <z-attachment-group class="w-[80%]">
                @for (photo of brandPhotos; track photo.src) {
                  <z-attachment zOrientation="vertical">
                    <z-attachment-media zVariant="image">
                      <img [src]="photo.src" [alt]="photo.alt" />
                    </z-attachment-media>
                  </z-attachment>
                }
              </z-attachment-group>
              <z-bubble>
                <z-bubble-content>Here are the brand photos. Can you add them to the deck?</z-bubble-content>
              </z-bubble>
            </z-message-content>
          </z-message>
          <z-message>
            <z-message-content>
              <z-bubble zVariant="muted">
                <z-bubble-content>Done. Here's the draft deck and the exported assets.</z-bubble-content>
              </z-bubble>
              <z-attachment-group class="w-full">
                @for (file of brandFiles; track file.title) {
                  <z-attachment class="w-64">
                    <z-attachment-media>
                      <ng-icon [name]="file.icon" />
                    </z-attachment-media>
                    <z-attachment-content>
                      <z-attachment-title>{{ file.title }}</z-attachment-title>
                      <z-attachment-description>{{ file.description }}</z-attachment-description>
                    </z-attachment-content>
                    <z-attachment-actions>
                      <button
                        type="button"
                        z-attachment-action
                        title="Download"
                        [attr.aria-label]="'Download ' + file.title"
                        zSize="icon-sm"
                        zType="secondary"
                      >
                        <ng-icon name="lucideDownload" />
                      </button>
                    </z-attachment-actions>
                  </z-attachment>
                }
              </z-attachment-group>
            </z-message-content>
          </z-message>
        </div>
      </z-example>
    </z-example-wrapper>
  `,
})
export class MessageExampleComponent {
  protected readonly logsText = LOGS_TEXT;
  protected readonly workspaceImage = WORKSPACE_IMAGE;
  protected readonly brandPhotos = BRAND_PHOTOS;
  protected readonly brandFiles = BRAND_FILES;
}
