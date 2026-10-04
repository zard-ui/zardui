import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileCode, lucideFileText, lucideImage, lucideX } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';

import { ZardAttachmentImports } from '../imports';

@Component({
  selector: 'z-demo-attachment-group',
  imports: [NgIcon, ZardButtonComponent, ...ZardAttachmentImports],
  template: `
    <div class="mx-auto flex w-full max-w-sm flex-col gap-4 py-6">
      <z-attachment-group aria-label="Attached files" class="max-w-sm">
        @for (file of files(); track file) {
          <z-attachment class="w-64">
            <z-attachment-media aria-hidden="true">
              @if (file.endsWith('.pdf')) {
                <ng-icon name="lucideFileText" class="size-4" />
              } @else if (file.endsWith('.png')) {
                <ng-icon name="lucideImage" class="size-4" />
              } @else if (file.endsWith('.csv')) {
                <ng-icon name="lucideFileText" class="size-4" />
              } @else {
                <ng-icon name="lucideFileCode" class="size-4" />
              }
            </z-attachment-media>
            <z-attachment-content>
              <z-attachment-title>{{ file }}</z-attachment-title>
              <z-attachment-description>Ready · 24 KB</z-attachment-description>
            </z-attachment-content>
            <z-attachment-actions>
              <button type="button" z-attachment-action [attr.aria-label]="'Remove ' + file" (click)="remove(file)">
                <ng-icon name="lucideX" class="size-3.5" />
              </button>
            </z-attachment-actions>
          </z-attachment>
        }
      </z-attachment-group>
      <button type="button" z-button zType="outline" class="w-fit" (click)="restore()">Restore files</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideFileCode,
      lucideFileText,
      lucideImage,
      lucideX,
    }),
  ],
})
export class ZardDemoAttachmentGroupComponent {
  readonly files = signal(['Notes.pdf', 'Photo.png', 'Budget.csv', 'Archive.zip']);

  remove(file: string): void {
    this.files.update(files => files.filter(value => value !== file));
  }

  restore(): void {
    this.files.set(['Notes.pdf', 'Photo.png', 'Budget.csv', 'Archive.zip']);
  }
}
