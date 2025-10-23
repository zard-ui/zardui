```angular-ts showLineNumbers copyButton
import { toast } from 'ngx-sonner';

import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardInputDirective } from '../../input/input.directive';
import { ZardIconComponent } from '../icon.component';
import { ZARD_ICONS } from '../icons';

@Component({
  standalone: true,
  imports: [CommonModule, ZardIconComponent, ZardInputDirective, ZardButtonComponent],
  template: `
    <div class="flex flex-col gap-4 w-full">
      <div class="flex flex-col gap-2">
        <div class="relative">
          <input z-input type="text" placeholder="Search icons..." [value]="searchQuery()" (input)="onSearchChange($event)" class="w-full" />
          <z-icon zType="search" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
        <div class="text-xs text-muted-foreground leading-relaxed">
          <strong>Note:</strong> These are only the icons currently used in our documentation.
          <br />
          For the complete icon library, visit
          <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" class="underline hover:text-foreground transition-colors">lucide.dev/icons.</a>
        </div>
      </div>

      <div class="text-sm text-muted-foreground">{{ filteredIcons().length }} of {{ totalIcons }} icons</div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-4">
        @for (iconName of filteredIcons(); track iconName) {
          <button
            z-button
            zType="outline"
            (click)="copyIconCode(iconName)"
            class="flex flex-col items-center justify-center gap-2 h-auto min-h-[70px] py-2 px-3 group w-full"
            [title]="'Click to copy: <z-icon zType=&quot;' + iconName + '&quot; />'"
          >
            <z-icon [zType]="iconName" class="group-hover:scale-110 transition-transform shrink-0" />
            <span class="text-xs text-center group-hover:text-foreground transition-colors break-words w-full leading-relaxed hyphens-auto">
              {{ iconName }}
            </span>
          </button>
        }
      </div>

      @if (filteredIcons().length === 0) {
        <div class="text-center py-8 text-muted-foreground">No icons found matching "{{ searchQuery() }}"</div>
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

```