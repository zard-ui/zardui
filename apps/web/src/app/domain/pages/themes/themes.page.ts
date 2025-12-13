import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { ThemePreviewComponent } from './components/theme-preview/theme-preview.component';
import { ThemeSidebarComponent } from './components/theme-sidebar/theme-sidebar.component';

@Component({
  selector: 'app-themes-page',
  standalone: true,
  imports: [ThemeSidebarComponent, ThemePreviewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="container-wrapper">
      <div class="3xl:fixed:container flex h-[calc(100vh-4rem)]">
        <aside class="hidden w-72 shrink-0 overflow-y-auto md:block">
          <app-theme-sidebar />
        </aside>

        <main class="flex-1 overflow-auto p-6 md:py-6 md:pr-0 md:pl-6">
          <app-theme-preview />
        </main>
      </div>
    </div>
  `,
})
export class ThemesPage {}
