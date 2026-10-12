import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideClock,
  lucideCopy,
  lucideDownload,
  lucideFileArchive,
  lucideFileCode,
  lucideFileSearch,
  lucideFileText,
  lucideFileWarning,
  lucidePresentation,
  lucideRefreshCw,
  lucideTable,
  lucideX,
} from '@ng-icons/lucide';

import { ZardAttachmentImports } from '@zard/components/attachment';
import type {
  ZardAttachmentSizeVariants,
  ZardAttachmentStateVariants,
} from '@zard/components/attachment/attachment.variants';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDialogImports } from '@zard/components/dialog/dialog.imports';
import { ZardSpinnerComponent } from '@zard/components/spinner';

import { ExampleImports } from './example.component';

/** One attachment card; every section of shadcn's page is a list of these. */
interface AttachmentItem {
  readonly title: string;
  readonly description?: string;
  /** Lucide icon in the media slot. */
  readonly icon?: string;
  /** A spinner in the media slot. */
  readonly spinner?: boolean;
  /** An image in the media slot. */
  readonly image?: string;
  readonly alt?: string;
  readonly mediaClass?: string;
  readonly state?: ZardAttachmentStateVariants;
  readonly size?: ZardAttachmentSizeVariants;
  readonly vertical?: boolean;
  readonly cls?: string;
  readonly retryLabel?: string;
  readonly removeLabel?: string;
  readonly noActions?: boolean;
  /** Turns the card into a link through `z-attachment-trigger`. */
  readonly href?: string;
  readonly rel?: string;
  readonly openLabel?: string;
}

const WORKSPACE = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80';
const DESK = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80';
const OFFICE = 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80';
const PATIO = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&auto=format&fit=crop&q=80';
const HOUSE = 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&auto=format&fit=crop&q=80';

const vertical = (items: readonly AttachmentItem[]): AttachmentItem[] =>
  items.map(item => ({ ...item, vertical: true, cls: undefined }));

const FILES: readonly AttachmentItem[] = [
  { icon: 'lucideFileText', title: 'sales-dashboard.pdf', description: 'PDF · 2.4 MB', cls: 'w-full' },
  { icon: 'lucideTable', title: 'customer-import.csv', description: 'CSV · 18 KB', cls: 'w-full' },
  { icon: 'lucideFileCode', title: 'message-renderer.tsx', description: 'TypeScript · 12 KB', cls: 'w-full' },
];

const FILES_VERTICAL = vertical([
  ...FILES,
  { icon: 'lucideFileArchive', title: 'source-assets.zip', description: 'ZIP · 4.2 MB' },
  { icon: 'lucidePresentation', title: 'quarterly-review.key', description: 'Keynote · 9 MB' },
]);

const CONTENT_TITLE: readonly AttachmentItem[] = [
  { title: 'React Documentation', cls: 'w-full' },
  { title: 'Tailwind CSS', cls: 'w-full' },
  {
    title: 'shadcn/ui',
    size: 'sm',
    cls: 'w-48',
    noActions: true,
    href: 'https://ui.shadcn.com',
    rel: 'noopener noreferrer',
    openLabel: 'Open shadcn/ui',
  },
];

const CONTENT_DESCRIPTION: readonly AttachmentItem[] = [
  { title: 'Building accessible components', description: 'react.dev · 8 min read', cls: 'w-full' },
  { title: 'Utility-first CSS framework', description: 'tailwindcss.com', cls: 'w-full' },
  {
    title: 'Compound components in React',
    description: 'ui.shadcn.com/docs',
    size: 'sm',
    cls: 'w-full max-w-80',
    noActions: true,
    href: 'https://ui.shadcn.com/docs',
    rel: 'noopener noreferrer',
    openLabel: 'Open Compound components in React',
  },
];

const STATES: readonly AttachmentItem[] = [
  { state: 'idle', icon: 'lucideClock', title: 'selected-file.pdf', description: 'Ready to upload', cls: 'w-full' },
  { state: 'uploading', spinner: true, title: 'design-system.zip', description: 'Uploading · 64%', cls: 'w-full' },
  {
    state: 'processing',
    icon: 'lucideFileText',
    title: 'market-research.pdf',
    description: 'Processing document',
    cls: 'w-full',
  },
  {
    state: 'error',
    icon: 'lucideFileWarning',
    title: 'financial-model.xlsx',
    description: 'Upload failed. Try again.',
    cls: 'w-full',
    retryLabel: 'Retry upload',
    removeLabel: 'Remove attachment',
  },
  { state: 'done', icon: 'lucideCheck', title: 'uploaded-report.pdf', description: 'Uploaded · 1.8 MB', cls: 'w-full' },
];

const STATES_VERTICAL = vertical([
  { state: 'idle', icon: 'lucideClock', title: 'selected-file.pdf', description: 'Ready' },
  { state: 'uploading', spinner: true, title: 'design-system.zip', description: 'Uploading' },
  { state: 'processing', icon: 'lucideFileText', title: 'market-research.pdf', description: 'Processing' },
  {
    state: 'error',
    icon: 'lucideFileWarning',
    title: 'financial-model.xlsx',
    description: 'Failed',
    retryLabel: 'Retry financial-model.xlsx',
  },
  { state: 'done', icon: 'lucideCheck', title: 'uploaded-report.pdf', description: 'Done' },
]);

const IMAGES: readonly AttachmentItem[] = [
  { image: WORKSPACE, alt: 'Workspace', title: 'workspace.png', description: 'PNG · 820 KB' },
  { image: DESK, alt: 'Desk', title: 'desk-reference.jpg', description: 'JPG · 1.1 MB' },
  { image: OFFICE, alt: 'Office', title: 'office-reference.jpg', description: 'JPG · 940 KB' },
].map(item => ({ ...item, cls: 'w-full', href: item.image, rel: 'noreferrer', openLabel: `Open ${item.title}` }));

const IMAGES_VERTICAL = vertical([
  ...IMAGES,
  ...[
    { image: PATIO, alt: 'Outdoor patio', title: 'patio-reference.jpg', description: 'JPG · 1.6 MB' },
    { image: HOUSE, alt: 'House exterior', title: 'house-exterior.jpg', description: 'JPG · 1.4 MB' },
  ].map(item => ({ ...item, href: item.image, rel: 'noreferrer', openLabel: `Open ${item.title}` })),
]);

const IMAGE_STATES: readonly AttachmentItem[] = [
  { state: 'idle', image: OFFICE, alt: 'Office', title: 'office-reference.jpg', description: 'Ready to upload' },
  { state: 'uploading', image: WORKSPACE, alt: 'Workspace', title: 'workspace.png', description: 'Uploading · 72%' },
  { state: 'processing', image: DESK, alt: 'Desk', title: 'desk-reference.jpg', description: 'Processing image' },
  {
    state: 'error',
    image: OFFICE,
    alt: 'Office',
    title: 'office-reference.jpg',
    description: 'Upload failed',
    retryLabel: 'Retry image upload',
    removeLabel: 'Remove attachment',
  },
  { state: 'done', image: WORKSPACE, alt: 'Workspace', title: 'workspace.png', description: 'Uploaded · 1.2 MB' },
].map(item => ({ ...item, state: item.state as ZardAttachmentStateVariants, cls: 'w-full' }));

const IMAGE_STATES_VERTICAL = vertical([
  { state: 'idle', image: OFFICE, alt: 'Office', title: 'office-reference.jpg', description: 'Ready' },
  { state: 'uploading', image: WORKSPACE, alt: 'Workspace', title: 'workspace.png', description: 'Uploading' },
  { state: 'processing', image: DESK, alt: 'Desk', title: 'desk-reference.jpg', description: 'Processing' },
  {
    state: 'error',
    image: OFFICE,
    alt: 'Office',
    title: 'office-reference.jpg',
    description: 'Failed',
    retryLabel: 'Retry office-reference.jpg',
  },
  { state: 'done', image: WORKSPACE, alt: 'Workspace', title: 'workspace.png', description: 'Done' },
]);

const SIZES: readonly AttachmentItem[] = [
  { size: 'default', title: 'Default attachment', description: 'PDF · 2.4 MB' },
  { size: 'sm', title: 'Small attachment', description: 'PDF · 2.4 MB' },
  { size: 'xs', title: 'Extra small attachment' },
].map(item => ({
  ...item,
  size: item.size as ZardAttachmentSizeVariants,
  icon: 'lucideFileText',
  cls: 'w-full',
  noActions: true,
}));

const SCROLLABLE: readonly AttachmentItem[] = [
  { icon: 'lucideFileText', title: 'briefing-notes.pdf', description: 'PDF · 1.4 MB' },
  { image: WORKSPACE, alt: 'Workspace', title: 'workspace.png', description: 'PNG · 820 KB' },
  { icon: 'lucideTable', title: 'customers.csv', description: 'CSV · 18 KB' },
  { icon: 'lucideFileCode', title: 'renderer.tsx', description: 'TSX · 12 KB' },
].map(item => ({ ...item, cls: 'w-64' }));

const SCROLLABLE_VERTICAL = vertical([
  { icon: 'lucideFileText', title: 'invoice.pdf', description: 'PDF' },
  { image: DESK, alt: 'Desk', mediaClass: 'aspect-square w-full', title: 'desk.jpg', description: 'JPG' },
  { icon: 'lucideFileArchive', title: 'assets.zip', description: 'ZIP' },
  { image: OFFICE, alt: 'Office', mediaClass: 'aspect-square w-full', title: 'office.jpg', description: 'JPG' },
  { icon: 'lucideFileText', title: 'notes.pdf', description: 'PDF' },
]);

/** shadcn/ui's `attachment-example`, in zard. */
@Component({
  selector: 'z-attachment-example',
  imports: [
    ExampleImports,
    NgIcon,
    NgTemplateOutlet,
    ZardAttachmentImports,
    ZardButtonComponent,
    ZardDialogImports,
    ZardSpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideCheck,
      lucideClock,
      lucideCopy,
      lucideDownload,
      lucideFileArchive,
      lucideFileCode,
      lucideFileSearch,
      lucideFileText,
      lucideFileWarning,
      lucidePresentation,
      lucideRefreshCw,
      lucideTable,
      lucideX,
    }),
  ],
  template: `
    <ng-template #card let-item>
      <z-attachment
        [zState]="item.state ?? 'done'"
        [zSize]="item.size ?? 'default'"
        [zOrientation]="item.vertical ? 'vertical' : 'horizontal'"
        [class]="item.cls ?? ''"
      >
        @if (item.image) {
          <z-attachment-media zVariant="image" [class]="item.mediaClass ?? ''">
            <img [src]="item.image" [alt]="item.alt" />
          </z-attachment-media>
        } @else if (item.spinner) {
          <z-attachment-media><z-spinner /></z-attachment-media>
        } @else if (item.icon) {
          <z-attachment-media><ng-icon [name]="item.icon" /></z-attachment-media>
        }
        <z-attachment-content>
          <z-attachment-title>{{ item.title }}</z-attachment-title>
          @if (item.description) {
            <z-attachment-description>{{ item.description }}</z-attachment-description>
          }
        </z-attachment-content>
        @if (!item.noActions) {
          <z-attachment-actions>
            @if (item.retryLabel) {
              <button type="button" z-attachment-action [attr.aria-label]="item.retryLabel">
                <ng-icon name="lucideRefreshCw" />
              </button>
            }
            <button type="button" z-attachment-action [attr.aria-label]="item.removeLabel ?? 'Remove ' + item.title">
              <ng-icon name="lucideX" />
            </button>
          </z-attachment-actions>
        }
        @if (item.href) {
          <a
            z-attachment-trigger
            [href]="item.href"
            target="_blank"
            [attr.rel]="item.rel"
            [attr.aria-label]="item.openLabel"
          ></a>
        }
      </z-attachment>
    </ng-template>

    <z-example-wrapper>
      <z-example zTitle="Files" zClass="gap-8">
        <div class="flex w-full flex-col gap-2">
          <div class="text-muted-foreground px-1 text-xs font-medium">Horizontal</div>
          <div class="flex flex-col gap-3">
            @for (item of files; track $index) {
              <ng-container *ngTemplateOutlet="card; context: { $implicit: item }" />
            }
          </div>
        </div>
        <div class="flex w-full flex-col gap-2">
          <div class="text-muted-foreground px-1 text-xs font-medium">Vertical</div>
          <z-attachment-group class="w-full">
            @for (item of filesVertical; track $index) {
              <ng-container *ngTemplateOutlet="card; context: { $implicit: item }" />
            }
          </z-attachment-group>
        </div>
      </z-example>

      <z-example zTitle="Content Only" zClass="gap-8">
        <div class="flex w-full flex-col gap-2">
          <div class="text-muted-foreground px-1 text-xs font-medium">Title</div>
          <div class="flex flex-col gap-3">
            @for (item of contentTitle; track $index) {
              <ng-container *ngTemplateOutlet="card; context: { $implicit: item }" />
            }
          </div>
        </div>
        <div class="flex w-full flex-col gap-2">
          <div class="text-muted-foreground px-1 text-xs font-medium">Title and Description</div>
          <div class="flex flex-col gap-3">
            @for (item of contentDescription; track $index) {
              <ng-container *ngTemplateOutlet="card; context: { $implicit: item }" />
            }
          </div>
        </div>
      </z-example>

      <z-example zTitle="States" zClass="gap-8">
        <div class="flex w-full flex-col gap-3">
          <div class="text-muted-foreground px-1 text-xs font-medium">Horizontal</div>
          <div class="flex flex-col gap-2">
            @for (item of states; track $index) {
              <ng-container *ngTemplateOutlet="card; context: { $implicit: item }" />
            }
          </div>
        </div>
        <div class="flex w-full flex-col gap-3">
          <div class="text-muted-foreground px-1 text-xs font-medium">Vertical</div>
          <z-attachment-group class="w-full">
            @for (item of statesVertical; track $index) {
              <ng-container *ngTemplateOutlet="card; context: { $implicit: item }" />
            }
          </z-attachment-group>
        </div>
      </z-example>

      <z-example zTitle="Images" zClass="gap-8">
        <div class="flex w-full flex-col gap-3">
          <div class="text-muted-foreground px-1 text-xs font-medium">Horizontal</div>
          <div class="flex flex-col gap-2">
            @for (item of images; track $index) {
              <ng-container *ngTemplateOutlet="card; context: { $implicit: item }" />
            }
          </div>
        </div>
        <div class="flex w-full flex-col gap-2">
          <div class="text-muted-foreground px-1 text-xs font-medium">Vertical</div>
          <z-attachment-group class="w-full">
            @for (item of imagesVertical; track $index) {
              <ng-container *ngTemplateOutlet="card; context: { $implicit: item }" />
            }
          </z-attachment-group>
        </div>
      </z-example>

      <z-example zTitle="Image States" zClass="gap-8">
        <div class="flex w-full flex-col gap-3">
          <div class="text-muted-foreground px-1 text-xs font-medium">Horizontal</div>
          <div class="flex flex-col gap-2">
            @for (item of imageStates; track $index) {
              <ng-container *ngTemplateOutlet="card; context: { $implicit: item }" />
            }
          </div>
        </div>
        <div class="flex w-full flex-col gap-2">
          <div class="text-muted-foreground px-1 text-xs font-medium">Vertical</div>
          <z-attachment-group class="w-full">
            @for (item of imageStatesVertical; track $index) {
              <ng-container *ngTemplateOutlet="card; context: { $implicit: item }" />
            }
          </z-attachment-group>
        </div>
      </z-example>

      <z-example zTitle="Sizes" zClass="gap-3">
        @for (item of sizes; track $index) {
          <ng-container *ngTemplateOutlet="card; context: { $implicit: item }" />
        }
      </z-example>

      <z-example zTitle="Scrollable Group" zClass="gap-4">
        <z-attachment-group class="w-full">
          @for (item of scrollable; track $index) {
            <ng-container *ngTemplateOutlet="card; context: { $implicit: item }" />
          }
        </z-attachment-group>
        <z-attachment-group class="w-full">
          @for (item of scrollableVertical; track $index) {
            <ng-container *ngTemplateOutlet="card; context: { $implicit: item }" />
          }
        </z-attachment-group>
      </z-example>

      <z-example zTitle="Triggers" zClass="gap-3">
        @if (isVisible()) {
          <z-attachment class="w-full">
            <z-attachment-media><ng-icon name="lucideFileText" /></z-attachment-media>
            <z-attachment-content>
              <z-attachment-title>contract-review.pdf</z-attachment-title>
              <z-attachment-description>PDF · 820 KB</z-attachment-description>
            </z-attachment-content>
            <z-attachment-actions>
              <button type="button" z-attachment-action aria-label="Download attachment">
                <ng-icon name="lucideDownload" />
              </button>
              <button type="button" z-attachment-action aria-label="Remove attachment" (click)="isVisible.set(false)">
                <ng-icon name="lucideX" />
              </button>
            </z-attachment-actions>
            <a z-attachment-trigger href="#" target="_blank" rel="noreferrer" aria-label="Open contract-review.pdf"></a>
          </z-attachment>
        } @else {
          <button type="button" z-button zType="outline" (click)="isVisible.set(true)">Restore attachment</button>
        }
        <z-attachment class="w-full">
          <z-attachment-media><ng-icon name="lucideFileSearch" /></z-attachment-media>
          <z-attachment-content>
            <z-attachment-title>research-summary.pdf</z-attachment-title>
            <z-attachment-description>Open preview dialog</z-attachment-description>
          </z-attachment-content>
          <z-attachment-actions>
            <button type="button" z-attachment-action aria-label="Copy link">
              <ng-icon name="lucideCopy" />
            </button>
            <button type="button" z-attachment-action aria-label="Remove research-summary.pdf">
              <ng-icon name="lucideX" />
            </button>
          </z-attachment-actions>
          <button
            type="button"
            z-attachment-trigger
            aria-label="Preview research-summary.pdf"
            (click)="dialogOpen.set(true)"
          ></button>
        </z-attachment>
        <z-dialog [(zVisible)]="dialogOpen" class="sm:max-w-md">
          <z-dialog-header>
            <z-dialog-title>research-summary.pdf</z-dialog-title>
            <z-dialog-description>
              Attachment triggers can open dialogs while actions remain independently reachable.
            </z-dialog-description>
          </z-dialog-header>
        </z-dialog>
      </z-example>
    </z-example-wrapper>
  `,
})
export class AttachmentExampleComponent {
  protected readonly files = FILES;
  protected readonly filesVertical = FILES_VERTICAL;
  protected readonly contentTitle = CONTENT_TITLE;
  protected readonly contentDescription = CONTENT_DESCRIPTION;
  protected readonly states = STATES;
  protected readonly statesVertical = STATES_VERTICAL;
  protected readonly images = IMAGES;
  protected readonly imagesVertical = IMAGES_VERTICAL;
  protected readonly imageStates = IMAGE_STATES;
  protected readonly imageStatesVertical = IMAGE_STATES_VERTICAL;
  protected readonly sizes = SIZES;
  protected readonly scrollable = SCROLLABLE;
  protected readonly scrollableVertical = SCROLLABLE_VERTICAL;

  protected readonly isVisible = signal(true);
  protected readonly dialogOpen = signal(false);
}
