import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideChevronRight,
  lucideCircleUser,
  lucideClock,
  lucideFileText,
  lucideGitBranch,
  lucideSearch,
} from '@ng-icons/lucide';

import { ZardAccordionImports } from '@zard/components/accordion/accordion.imports';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDrawerImports } from '@zard/components/drawer/drawer.imports';
import { ZardMarkerImports } from '@zard/components/marker/marker.imports';
import { ZardSonnerComponent, ZardSonnerService } from '@zard/components/sonner';
import { ZardSpinnerComponent } from '@zard/components/spinner';
import { ZardDarkMode } from '@zard/services/dark-mode';

import { ExampleImports } from './example.component';

const DRAWER_FILES = ['app/chat/page.tsx', 'components/message.tsx', 'lib/ai.ts'] as const;

/** shadcn/ui's `marker-example`, in zard. */
@Component({
  selector: 'z-marker-example',
  imports: [
    ExampleImports,
    NgIcon,
    ZardAccordionImports,
    ZardButtonComponent,
    ZardDrawerImports,
    ZardMarkerImports,
    ZardSonnerComponent,
    ZardSpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideCheck,
      lucideChevronRight,
      lucideCircleUser,
      lucideClock,
      lucideFileText,
      lucideGitBranch,
      lucideSearch,
    }),
  ],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Markers" zClass="gap-8">
        <z-marker>
          <z-marker-content>A default marker</z-marker-content>
        </z-marker>
        <z-marker>
          <z-marker-icon><ng-icon name="lucideFileText" /></z-marker-icon>
          <z-marker-content>Marker with icon</z-marker-content>
        </z-marker>
        <z-marker role="status">
          <z-marker-icon><z-spinner /></z-marker-icon>
          <z-marker-content>Marker with a spinner</z-marker-content>
        </z-marker>
        <z-marker role="status">
          <z-marker-icon><z-spinner /></z-marker-icon>
          <z-marker-content class="shimmer">Marker with shimmer effect</z-marker-content>
        </z-marker>
        <z-marker role="status">
          <z-marker-content class="shimmer">Thinking...</z-marker-content>
        </z-marker>
        <a z-marker href="#">
          <z-marker-icon><ng-icon name="lucideGitBranch" /></z-marker-icon>
          <z-marker-content>Marker as a link</z-marker-content>
        </a>
        <button type="button" z-marker class="hover:text-foreground transition-colors" (click)="notify()">
          <z-marker-icon><ng-icon name="lucideClock" /></z-marker-icon>
          <z-marker-content class="flex-1">
            <div>Marker as a button</div>
          </z-marker-content>
          <z-marker-icon><ng-icon name="lucideChevronRight" /></z-marker-icon>
        </button>
        <z-marker>
          <z-marker-icon><ng-icon name="lucideCircleUser" /></z-marker-icon>
          <z-marker-content>Rhea joined the chat</z-marker-content>
        </z-marker>
        <z-marker class="justify-center">
          <z-marker-content>
            <strong class="font-medium">Olivia Rose</strong>
            left the chat
          </z-marker-content>
        </z-marker>
        <z-marker class="flex-col">
          <z-marker-icon><ng-icon name="lucideFileText" /></z-marker-icon>
          <z-marker-content>Marker with icon at the top</z-marker-content>
        </z-marker>
      </z-example>

      <z-example zTitle="Border" zClass="gap-3">
        <z-marker zVariant="border">
          <z-marker-icon><ng-icon name="lucideGitBranch" /></z-marker-icon>
          <z-marker-content>Switched to release-candidate</z-marker-content>
        </z-marker>
        <z-marker zVariant="border">
          <z-marker-icon><ng-icon name="lucideSearch" /></z-marker-icon>
          <z-marker-content>Reviewed 8 related files</z-marker-content>
        </z-marker>
        <z-marker zVariant="border">
          <z-marker-icon><ng-icon name="lucideFileText" /></z-marker-icon>
          <z-marker-content>Opened implementation notes</z-marker-content>
        </z-marker>
      </z-example>

      <z-example zTitle="Separator" zClass="gap-8">
        <z-marker zVariant="separator">
          <z-marker-content>Worked for 42s</z-marker-content>
        </z-marker>
        <z-marker zVariant="separator" role="status">
          <z-marker-icon><z-spinner /></z-marker-icon>
          <z-marker-content>Compacting conversation</z-marker-content>
        </z-marker>
        <z-marker zVariant="separator" role="status">
          <z-marker-content class="shimmer">Reading 4 files</z-marker-content>
        </z-marker>
        <z-marker zVariant="separator">
          <z-marker-icon><ng-icon name="lucideCheck" /></z-marker-icon>
          <z-marker-content>Conversation compacted</z-marker-content>
        </z-marker>
        <z-marker zVariant="separator">
          <z-marker-content>
            With a
            <a href="#">link to learn more</a>
          </z-marker-content>
        </z-marker>
        <z-marker zVariant="separator">
          <z-marker-content>
            <button type="button" z-button zType="outline">
              <ng-icon name="lucideGitBranch" />
              Button
            </button>
          </z-marker-content>
        </z-marker>
      </z-example>

      <!-- zard's accordion trigger takes a plain-text title, so the clock marker is reduced to its text. -->
      <z-example zTitle="Accordion" zContainerClass="min-h-72">
        <z-accordion zType="single">
          <z-accordion-item zValue="1" zTitle="Worked for 42s">
            <p class="text-muted-foreground text-sm">
              The user asked for a list of all the files in the current directory. The assistant responded with a list
              of all the files in the current directory.
            </p>
          </z-accordion-item>
        </z-accordion>
      </z-example>

      <z-example zTitle="Drawer">
        <z-marker zVariant="separator">
          <z-marker-content>
            <button type="button" z-button zType="outline" (click)="drawerOpen.set(true)">
              <ng-icon name="lucideSearch" data-icon="inline-start" />
              Explored 4 files
            </button>
          </z-marker-content>
        </z-marker>
        <z-drawer [(zVisible)]="drawerOpen" zPlacement="right">
          <z-drawer-header>
            <z-drawer-title>File Activity</z-drawer-title>
            <z-drawer-description>Files read while preparing the response.</z-drawer-description>
          </z-drawer-header>
          <div class="grid gap-3 px-4 text-sm">
            @for (file of files; track file) {
              <div class="flex items-center justify-between gap-4 rounded-md border px-3 py-2">
                <span class="truncate">{{ file }}</span>
                <span class="text-muted-foreground">read</span>
              </div>
            }
          </div>
          <z-drawer-footer>
            <button type="button" z-button zType="outline" z-drawer-close>Close</button>
          </z-drawer-footer>
        </z-drawer>
      </z-example>
    </z-example-wrapper>
    <z-sonner position="bottom-right" [theme]="darkMode.themeMode()" />
  `,
})
export class MarkerExampleComponent {
  private readonly sonner = inject(ZardSonnerService);
  protected readonly darkMode = inject(ZardDarkMode);

  protected readonly files = DRAWER_FILES;
  protected readonly drawerOpen = signal(false);

  protected notify(): void {
    this.sonner.show('You clicked the button');
  }
}
