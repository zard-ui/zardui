import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideClock,
  lucideFileText,
  lucideLoaderCircle,
  lucideRefreshCw,
  lucideTriangleAlert,
  lucideX,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';

import type { ZardAttachmentStateVariants } from '../attachment.variants';
import { ZardAttachmentImports } from '../imports';

@Component({
  selector: 'z-demo-attachment-states',
  imports: [NgIcon, ZardButtonComponent, ...ZardAttachmentImports],
  template: `
    <div class="mx-auto flex w-full max-w-sm flex-col gap-4 py-6">
      <div
        role="group"
        class="bg-muted/40 flex flex-wrap items-center gap-1.5 rounded-lg border p-1"
        aria-label="Upload state controls"
      >
        @for (value of states; track value) {
          <button
            type="button"
            z-button
            [zType]="state() === value ? 'default' : 'ghost'"
            zSize="xs"
            [attr.aria-pressed]="state() === value"
            (click)="state.set(value)"
          >
            {{ value }}
          </button>
        }
      </div>

      @if (!removed()) {
        <z-attachment [zState]="state()" class="w-full">
          <z-attachment-media aria-hidden="true">
            @switch (state()) {
              @case ('idle') {
                <ng-icon name="lucideClock" class="size-4" />
              }
              @case ('uploading') {
                <ng-icon name="lucideLoaderCircle" class="text-muted-foreground size-4 animate-spin" />
              }
              @case ('processing') {
                <ng-icon name="lucideFileText" class="size-4" />
              }
              @case ('error') {
                <ng-icon name="lucideTriangleAlert" class="text-destructive size-4" />
              }
              @case ('done') {
                <ng-icon name="lucideCheck" class="size-4 text-emerald-500 dark:text-emerald-400" />
              }
            }
          </z-attachment-media>
          <z-attachment-content>
            <z-attachment-title>Report.pdf</z-attachment-title>
            <z-attachment-description aria-live="polite">{{ descriptions[state()] }}</z-attachment-description>
          </z-attachment-content>
          <z-attachment-actions>
            @if (state() === 'error') {
              <button type="button" z-attachment-action aria-label="Retry Report.pdf" (click)="state.set('uploading')">
                <ng-icon name="lucideRefreshCw" class="size-3.5" />
              </button>
            }
            <button type="button" z-attachment-action aria-label="Remove Report.pdf" (click)="removed.set(true)">
              <ng-icon name="lucideX" class="size-3.5" />
            </button>
          </z-attachment-actions>
        </z-attachment>
      }

      <z-attachment class="w-full">
        <z-attachment-media aria-hidden="true">
          <ng-icon name="lucideFileText" class="size-4" />
        </z-attachment-media>
        <z-attachment-content>
          <z-attachment-title>Independent.txt</z-attachment-title>
          <z-attachment-description>Ready · Unaffected by Report.pdf</z-attachment-description>
        </z-attachment-content>
      </z-attachment>

      @if (removed()) {
        <button type="button" z-button zType="outline" class="w-fit" (click)="removed.set(false)">
          Restore Report.pdf
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideCheck,
      lucideClock,
      lucideFileText,
      lucideLoaderCircle,
      lucideRefreshCw,
      lucideTriangleAlert,
      lucideX,
    }),
  ],
})
export class ZardDemoAttachmentStatesComponent {
  readonly states: ZardAttachmentStateVariants[] = ['idle', 'uploading', 'processing', 'error', 'done'];
  readonly state = signal<ZardAttachmentStateVariants>('uploading');
  readonly removed = signal(false);
  readonly descriptions = {
    idle: 'Waiting to upload',
    uploading: 'Uploading · 42%',
    processing: 'Processing file',
    error: 'Upload failed. Retry or remove the file.',
    done: 'Upload complete · 240 KB',
  };
}
