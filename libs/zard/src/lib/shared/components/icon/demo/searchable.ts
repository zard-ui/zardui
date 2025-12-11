import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

import { toast } from 'ngx-sonner';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardEmptyComponent } from '../../empty/empty.component';
import { ZardInputDirective } from '../../input/input.directive';
import { ZardIconComponent } from '../icon.component';
import { ZARD_ICONS } from '../icons';

@Component({
  selector: 'z-demo-icon-searchable',
  imports: [CommonModule, ZardIconComponent, ZardInputDirective, ZardButtonComponent, ZardEmptyComponent],
  standalone: true,
  template: `
    <div class="flex w-full flex-col gap-4">
      <div class="flex flex-col gap-2">
        <div class="relative">
          <input
            z-input
            type="text"
            placeholder="Search icons..."
            [value]="searchQuery()"
            (input)="onSearchChange($event)"
            class="w-full"
          />
          <z-icon
            zType="search"
            class="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
          />
        </div>
        <div class="text-muted-foreground text-xs leading-relaxed">
          <strong>Note:</strong>
          These are only the icons currently used in our documentation.
          <br />
          For the complete icon library, visit
          <a
            href="https://lucide.dev/icons"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-foreground underline transition-colors"
          >
            lucide.dev/icons.
          </a>
        </div>
      </div>

      <div class="text-muted-foreground text-sm">{{ filteredIcons().length }} of {{ totalIcons }} icons</div>

      <div
        class="grid max-h-[600px] grid-cols-2 gap-4 overflow-y-auto pr-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4"
      >
        @for (iconName of filteredIcons(); track iconName) {
          <button
            z-button
            zType="outline"
            (click)="copyIconCode(iconName)"
            class="group flex h-auto min-h-[70px] w-full flex-col items-center justify-center gap-2 px-3 py-2"
            [title]="'Click to copy: <z-icon zType=&quot;' + iconName + '&quot; />'"
          >
            <z-icon [zType]="iconName" class="shrink-0 transition-transform group-hover:scale-110" />
            <span
              class="group-hover:text-foreground w-full text-center text-xs leading-relaxed break-words hyphens-auto transition-colors"
            >
              {{ iconName }}
            </span>
          </button>
        }
      </div>

      @if (filteredIcons().length === 0) {
        <z-empty zDescription="No icons found for the given search." />
      }
    </div>
  `,
})
export class ZardDemoIconSearchableComponent {
  readonly searchQuery = signal('');

  readonly iconNames = Object.keys(ZARD_ICONS) as Array<keyof typeof ZARD_ICONS>;
  readonly totalIcons = this.iconNames.length;

  readonly filteredIcons = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.iconNames;
    }

    return this.iconNames.filter(iconName => iconName.toLowerCase().includes(query));
  });

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  async copyIconCode(iconName: string): Promise<void> {
    const code = `<z-icon zType="${iconName}" />`;

    try {
      await navigator.clipboard.writeText(code);

      toast.success('Icon copied!', {
        description: `<z-icon zType="${iconName}" />`,
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy', {
        description: 'Could not copy to clipboard',
        duration: 2000,
      });
    }
  }
}
